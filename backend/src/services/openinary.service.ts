import axios from "axios";
import FormData from "form-data";
import config from "../config/openinary";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import path from "path";
import os from "os";

interface UploadResponse {
  success: boolean;
  files: Array<{
    filename: string;
    path: string;
    size: number;
    url: string;
    queuedTransformationUrls?: string[];
    queueErrors?: string[];
  }>;
}

interface UploadOptions {
  filename: string;
  fileBuffer: Buffer;
  mimeType: string;
  storeId: string;
  title: {
    kurdish: string;
    english: string;
  };
  description?: string;
}

// New interface for image upload options
interface ImageUploadOptions {
  filename: string;
  fileBuffer: Buffer;
  mimeType: string;
  storeId: string;
  folder?: string; // Optional subfolder within store (e.g., 'products', 'profiles', 'gallery')
  alt?: string; // Alt text for the image
  title?: string; // Image title
  transformations?: string[]; // Optional transformations to apply
}

// New interface for image upload result
interface ImageUploadResult {
  publicId: string;
  url: string;
  path: string;
  size: number;
  width?: number;
  height?: number;
  format?: string;
  alt?: string;
  title?: string;
  thumbnailUrl?: string; // Default thumbnail URL
  optimizedUrls?: {
    small?: string; // 300px width
    medium?: string; // 600px width
    large?: string; // 1200px width
    thumbnail?: string; // 150x150 crop
  };
}

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  format: string;
}

interface UploadResult {
  publicId: string;
  url: string;
  path: string;
  size: number;
  metadata: VideoMetadata;
}

export class OpeninaryService {
  private static baseUrl = config.baseUrl;
  private static apiKey = config.apiKey;

  /**
   * Extract video metadata using ffmpeg
   */
  private static async getVideoMetadata(
    buffer: Buffer,
  ): Promise<VideoMetadata> {
    // Create temp file path
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, `video-${Date.now()}.mp4`);

    try {
      // Save buffer to temp file
      await fs.writeFile(tempPath, buffer);

      // Get metadata using ffprobe
      const metadata = await new Promise<any>((resolve, reject) => {
        ffmpeg.ffprobe(tempPath, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      // Find video stream
      const videoStream = metadata.streams.find(
        (s: any) => s.codec_type === "video",
      );
      console.log("videoStream: ", videoStream);

      return {
        duration: Math.round(metadata.format.duration || 0),
        width: videoStream?.width || 0,
        height: videoStream?.height || 0,
        format: metadata.format.format_name?.split(",")[0] || "mp4",
      };
    } finally {
      // Clean up temp file (runs even if error occurs)
      await fs.unlink(tempPath).catch(() => {
        console.warn(`Failed to delete temp file: ${tempPath}`);
      });
    }
  }

  /**
   * Upload video file directly to Openinary with metadata extraction
   */
  static async uploadVideo(options: UploadOptions): Promise<UploadResult> {
    const { filename, fileBuffer, mimeType, storeId, title, description } =
      options;

    // Step 1: Get video metadata FIRST (for validation and later use)
    let metadata: VideoMetadata;
    try {
      metadata = await this.getVideoMetadata(fileBuffer);
    } catch (error) {
      console.error("Failed to get video metadata:", error);
      throw new Error(
        "Could not process video file. Please ensure it's a valid video.",
      );
    }

    // Step 2: Validate duration (max 5 minutes = 300 seconds)
    if (metadata.duration > 300) {
      throw new Error(
        `Video duration (${metadata.duration}s) exceeds maximum allowed (300s = 5 minutes)`,
      );
    }

    // Step 3: Create a unique filename with store prefix
    const timestamp = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "-");
    const storedFilename = `stores/${storeId}/reels/${timestamp}-${safeFilename}`;

    // Step 4: Prepare transformations for thumbnails and optimized versions
    const transformations = [
      `w_720,h_1280,q_75,f_mp4`, // Mobile optimized
      `t_true,tt_${Math.min(3, metadata.duration)},w_320,h_180,f_webp,q_70`, // Thumbnail at 3s or end
    ];

    // Step 5: Upload to Openinary
    const formData = new FormData();
    formData.append("files", fileBuffer, {
      filename: storedFilename,
      contentType: mimeType,
    });
    formData.append("transformations", JSON.stringify(transformations));

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/upload`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${this.apiKey}`,
          },
          // transformRequest: [(data) => data],
          // body: formData,
          // maxContentLength: Infinity,
          // maxBodyLength: Infinity,
        },
      );

      const data = response.data as UploadResponse;

      if (!data.success || !data.files || data.files.length === 0) {
        throw new Error("Upload failed: No files in response");
      }

      const uploadedFile = data.files[0];

      // Step 6: Return combined result (metadata + upload info)
      return {
        publicId: uploadedFile.path,
        url: `${this.baseUrl}${uploadedFile.url}`,
        path: uploadedFile.path,
        size: uploadedFile.size,
        metadata: {
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
        },
      };
    } catch (error) {
      console.error("Openinary upload failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Upload failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
      }
      throw new Error("Failed to upload video to Openinary");
    }
  }

  /**
   * Delete video from Openinary
   */
  static async deleteVideo(publicId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${this.baseUrl}/media`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        data: {
          path: publicId,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Failed to delete video from Openinary:", error);
      return false;
    }
  }

  /**
   * Upload image file to Openinary
   */
  static async uploadImage(
    options: ImageUploadOptions,
  ): Promise<ImageUploadResult> {
    const {
      filename,
      fileBuffer,
      mimeType,
      storeId,
      folder = "images",
      alt = "",
      title = "",
      transformations = [],
    } = options;

    // Step 1: Validate file type
    if (!mimeType.startsWith("image/")) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    // Step 2: Create a unique filename with store prefix
    const timestamp = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "-");
    const storedFilename = `stores/${storeId}/${folder}/${timestamp}-${safeFilename}`;

    // Step 3: Prepare default transformations for images
    const defaultTransformations = [
      `q_auto,f_auto`, // Auto quality and format
      ...transformations,
    ];

    // Step 4: Prepare additional optimized versions
    const imageVersions = [
      `w_300,q_75,f_auto`, // Small
      `w_600,q_80,f_auto`, // Medium
      `w_1200,q_85,f_auto`, // Large
      `w_150,h_150,c_fill,q_70,f_auto`, // Thumbnail (cropped square)
    ];

    const allTransformations = [...defaultTransformations, ...imageVersions];

    // Step 5: Upload to Openinary
    const formData = new FormData();
    formData.append("files", fileBuffer, {
      filename: storedFilename,
      contentType: mimeType,
    });
    formData.append("transformations", JSON.stringify(allTransformations));

    // Add metadata if provided
    if (alt || title) {
      const metadata: Record<string, string> = {};
      if (alt) metadata.alt = alt;
      if (title) metadata.title = title;
      formData.append("metadata", JSON.stringify(metadata));
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/upload`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const data = response.data as UploadResponse;

      if (!data.success || !data.files || data.files.length === 0) {
        throw new Error("Upload failed: No files in response");
      }

      const uploadedFile = data.files[0];
      const publicId = uploadedFile.path;

      // Step 6: Generate optimized URLs
      const optimizedUrls = {
        small: this.getImageUrl(publicId, { width: 300 }),
        medium: this.getImageUrl(publicId, { width: 600 }),
        large: this.getImageUrl(publicId, { width: 1200 }),
        thumbnail: this.getImageUrl(publicId, {
          width: 150,
          height: 150,
          crop: "fill",
        }),
      };

      // Step 7: Return combined result
      return {
        publicId,
        url: `${this.baseUrl}${uploadedFile.url}`,
        path: uploadedFile.path,
        size: uploadedFile.size,
        alt,
        title,
        thumbnailUrl: optimizedUrls.thumbnail,
        optimizedUrls,
      };
    } catch (error) {
      console.error("Openinary image upload failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Image upload failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
      }
      throw new Error("Failed to upload image to Openinary");
    }
  }
  /**
   * Generate optimized image URL with transformations
   */
  static getImageUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: "auto" | "webp" | "jpeg" | "png";
      crop?: "fill" | "fit" | "scale";
    },
  ): string {
    const {
      width,
      height,
      quality = 75,
      format = "auto",
      crop = "fit",
    } = options || {};

    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    return `${this.baseUrl}/t/${transformations.join(",")}/${publicId}`;
  }

  /**
   * Upload multiple images
   */
  static async uploadImages(
    images: ImageUploadOptions[],
  ): Promise<ImageUploadResult[]> {
    try {
      const uploadPromises = images.map((image) => this.uploadImage(image));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Failed to upload multiple images:", error);
      throw new Error("Failed to upload one or more images");
    }
  }

  /**
   * Delete image from Openinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${this.baseUrl}/media`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        data: {
          path: publicId,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Failed to delete image from Openinary:", error);
      return false;
    }
  }
  /**
   * Generate thumbnail URL for video
   */
  static getThumbnailUrl(
    publicId: string,
    options?: { width?: number; height?: number; time?: number },
  ): string {
    const { width = 300, height = 300, time = 3 } = options || {};
    return `${this.baseUrl}/t/w_${width},h_${height},so_${time},f_webp/${publicId}`;
  }

  /**
   * Generate video playback URL with transformations
   */
  static getVideoUrl(
    publicId: string,
    options?: { width?: number; height?: number; quality?: number },
  ): string {
    const { width, height, quality = 75 } = options || {};

    if (width && height) {
      return `${this.baseUrl}/t/w_${width},h_${height},q_${quality},f_mp4/${publicId}`;
    } else if (width) {
      return `${this.baseUrl}/t/w_${width},q_${quality},f_mp4/${publicId}`;
    } else if (height) {
      return `${this.baseUrl}/t/h_${height},q_${quality},f_mp4/${publicId}`;
    }

    return `${this.baseUrl}/t/${publicId}`;
  }
}
