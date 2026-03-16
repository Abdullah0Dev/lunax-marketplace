import { IReel, Store, Reel } from "../models";
import { Types } from "mongoose";
import { startOfDay, endOfDay } from "date-fns";
import { ReelResponse, CreateReelInput } from "../types";
import { OpeninaryService } from "./openinary.service";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import path from "path";
import os from "os";

// In your ReelService, before uploading to Openinary
async function getVideoMetadata(
  buffer: Buffer,
): Promise<{ duration: number; width: number; height: number }> {
  // Save buffer to temp file
  const tempPath = `/tmp/${Date.now()}.mp4`;
  await fs.writeFile(tempPath, buffer);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(tempPath, (err, metadata) => {
      if (err) reject(err);

      const videoStream = metadata.streams.find(
        (s) => s.codec_type === "video",
      );
      resolve({
        duration: Math.round(metadata.format.duration || 0),
        width: videoStream?.width || 0,
        height: videoStream?.height || 0,
      });

      // Clean up temp file
      fs.unlink(tempPath); //, () => {}
    });
  });
}
export class ReelService {
  // Get reels by store ID
  static async getReelsByStore(storeId: string): Promise<ReelResponse[]> {
    if (!Types.ObjectId.isValid(storeId)) {
      throw new Error("Invalid store ID");
    }

    const reels = await Reel.find({ store_id: storeId })
      .sort({ createdAt: -1 })
      .lean();

    return reels.map((reel) => this.formatReelResponse(reel));
  }

  // Get single reel
  static async getReelById(id: string): Promise<ReelResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid reel ID");
    }

    const reel = await Reel.findById(id).lean();
    if (!reel) {
      throw new Error("Reel not found");
    }

    return this.formatReelResponse(reel);
  }

  // Check daily upload limit
  static async checkDailyUploadLimit(storeId: string): Promise<{
    canUpload: boolean;
    currentCount: number;
    remaining: number;
    maxLimit: number;
  }> {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());

    const count = await Reel.countDocuments({
      store_id: storeId,
      createdAt: { $gte: start, $lte: end },
    });

    const MAX_DAILY_LIMIT = 5;
    const remaining = Math.max(0, MAX_DAILY_LIMIT - count);

    return {
      canUpload: count < MAX_DAILY_LIMIT,
      currentCount: count,
      remaining,
      maxLimit: MAX_DAILY_LIMIT,
    };
  }

  // Create reel
  static async createReel(input: CreateReelInput): Promise<ReelResponse> {
    const { store_id, fileBuffer, filename, mimeType, title, description } =
      input;

    // Validate store existence
    if (!Types.ObjectId.isValid(store_id)) {
      throw new Error("Invalid store ID");
    }

    const store = await Store.findById(store_id);
    if (!store) {
      throw new Error("Store not found");
    }

    // Check daily upload limit
    const limitCheck = await this.checkDailyUploadLimit(store_id);
    if (!limitCheck.canUpload) {
      throw new Error(
        `Daily upload limit reached. You have uploaded ${limitCheck.currentCount} out of ${limitCheck.maxLimit} reels today.`,
      );
    }

    // Upload to Openinary (metadata extraction and validation happens inside)
    let uploadResult;
    try {
      uploadResult = await OpeninaryService.uploadVideo({
        filename,
        fileBuffer,
        mimeType,
        storeId: store_id,
        title,
        description,
      });
      console.log("uploadResult: ", uploadResult);
    } catch (error) {
      console.error("Openinary upload failed:", error);
      // Error messages from OpeninaryService are already user-friendly
      throw error;
    }

    // Create reel in database with all metadata
    try {
      const reel = await Reel.create({
        store_id,
        public_id: uploadResult.publicId,
        url: uploadResult.url,
        thumbnail_url: OpeninaryService.getThumbnailUrl(uploadResult.publicId, {
          time: Math.min(3, uploadResult.metadata.duration),
        }),
        title,
        description,
        duration: uploadResult.metadata.duration,
        format: uploadResult.metadata.format,
        width: uploadResult.metadata.width,
        height: uploadResult.metadata.height,
        size: uploadResult.size,
      });

      // Add reel reference to store
      await Store.findByIdAndUpdate(store_id, {
        $push: { reels: reel._id },
      });

      return this.formatReelResponse(reel.toObject());
    } catch (error) {
      // If database creation fails, clean up the uploaded video
      console.error("Database creation failed, cleaning up Openinary:", error);
      await OpeninaryService.deleteVideo(uploadResult.publicId).catch((e) => {
        console.error("Failed to clean up Openinary video:", e);
      });
      throw new Error("Failed to save reel information. Please try again.");
    }
  }

  // Update reel
  static async updateReel(
    id: string,
    updates: Partial<IReel>,
  ): Promise<ReelResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid reel ID");
    }

    // Only allow updating certain fields
    const allowedUpdates = {
      title: updates.title,
      description: updates.description,
    };

    const reel = await Reel.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true },
    ).lean();

    if (!reel) {
      throw new Error("Reel not found");
    }

    return this.formatReelResponse(reel);
  }

  // Delete reel
  static async deleteReel(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid reel ID");
    }

    const reel = await Reel.findById(id);
    if (!reel) {
      throw new Error("Reel not found");
    }

    // Delete from Openinary first
    try {
      await OpeninaryService.deleteVideo(reel.public_id);
    } catch (error) {
      console.error("Failed to delete from Openinary:", error);
      // Continue with database deletion even if Openinary delete fails
      // You might want to handle this differently based on your requirements
    }

    // Remove reel reference from store
    await Store.findByIdAndUpdate(reel.store_id, {
      $pull: { reels: id },
    });

    // Delete from database
    await Reel.findByIdAndDelete(id);

    return {
      success: true,
      message: "Reel deleted successfully from both database and Openinary",
    };
  }

  // Get all reels (feed)
  static async getFeed(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    reels: ReelResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [reels, total] = await Promise.all([
      Reel.find()
        .populate("store_id", "name logo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Reel.countDocuments(),
    ]);

    const formattedReels = reels.map((reel) => ({
      ...this.formatReelResponse(reel),
      store: reel.store_id
        ? {
            id: (reel.store_id as any)._id.toString(),
            name: (reel.store_id as any).name,
            logo: (reel.store_id as any).logo,
          }
        : null,
    }));

    return {
      reels: formattedReels,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  /**
   * Helper to format reel response
   */
  private static formatReelResponse(reel: any): ReelResponse {
    return {
      id: reel._id.toString(),
      thumbnail_url:
        reel.thumbnail_url || OpeninaryService.getThumbnailUrl(reel.public_id),
      ...reel,
    };
  }

  /**
   * Handle Openinary webhook for successful upload
   */
  static async handleUploadWebhook(data: any): Promise<ReelResponse> {
    const { publicId, url, duration, format, size, width, height, metadata } =
      data;

    // Extract storeId from publicId (format: stores/{storeId}/reels/{filename})
    const storeId = publicId.split("/")[1];

    // Parse metadata (you'd need to send this during upload)
    let title = { kurdish: "", english: "" };
    let description = "";

    if (metadata) {
      try {
        const parsed = JSON.parse(metadata);
        title = parsed.title || title;
        description = parsed.description || description;
      } catch (e) {
        console.error("Failed to parse metadata", e);
      }
    }

    // Create reel in database
    const reel = await Reel.create({
      store_id: storeId,
      public_id: publicId,
      url,
      thumbnail_url: OpeninaryService.getThumbnailUrl(publicId),
      title,
      description,
      duration,
      format,
      width,
      height,
      size,
    });

    // Add to store
    await Store.findByIdAndUpdate(storeId, {
      $push: { reels: reel._id },
    });

    return this.formatReelResponse(reel.toObject());
  }
}
