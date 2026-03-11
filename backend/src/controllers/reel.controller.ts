import { Request, Response } from "express";
import { ReelService } from "../services";
import multer from "multer";

// Configure multer for memory storage (we'll forward to Openinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 300 * 1024 * 1024, // 300MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed") as any, false);
    }
  },
});

export class ReelController { 
  /**
   * Upload reel (server-side upload with multer)
   */
  static async uploadReel(req: Request, res: Response) {
    try {
      // Use multer middleware
      upload.single("video")(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { storeId, titleKurdish, titleEnglish, description } = req.body;
        const file = (req as any).file;

        if (!file) {
          return res.status(400).json({ error: "No video file uploaded" });
        }

        if (!storeId || !titleKurdish || !titleEnglish) {
          return res.status(400).json({
            error:
              "Missing required fields: storeId, titleKurdish, titleEnglish",
          });
        }

        try {
          const reel = await ReelService.createReel({
            store_id: storeId,
            fileBuffer: file.buffer,
            filename: file.originalname,
            mimeType: file.mimetype,
            title: {
              kurdish: titleKurdish,
              english: titleEnglish,
            },
            description,
          });

          res.status(201).json(reel);
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("duration")) {
              return res.status(400).json({ error: error.message });
            }
            if (error.message.includes("limit reached")) {
              return res.status(400).json({ error: error.message });
            }
          }
          throw error;
        }
      });
    } catch (error) {
      console.error("Error uploading reel:", error);
      res.status(500).json({ error: "Failed to upload reel" });
    }
  }

  static async getByStore(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      const reels = await ReelService.getReelsByStore(storeId as string);
      res.json(reels);
    } catch (error) {
      console.error("Error fetching reels:", error);
      if (error instanceof Error && error.message === "Invalid store ID") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to fetch reels" });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reel = await ReelService.getReelById(id as string);
      res.json(reel);
    } catch (error) {
      console.error("Error fetching reel:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid reel ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Reel not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to fetch reel" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const reel = await ReelService.createReel(req.body);
      res.status(201).json(reel);
    } catch (error) {
      console.error("Error creating reel:", error);
      if (error instanceof Error) {
        if (
          error.message === "Missing required fields" ||
          error.message === "Store not found" ||
          error.message ===
            "Daily upload limit reached (max 5 reels per day)" ||
          error.message === "Reel duration cannot exceed 5 minutes"
        ) {
          return res.status(400).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to create reel" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title?.kurdish && !title?.english && !description) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const reel = await ReelService.updateReel(id as string, {
        title,
        description,
      });
      res.json(reel);
    } catch (error) {
      console.error("Error updating reel:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid reel ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Reel not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to update reel" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ReelService.deleteReel(id as string);
      res.json({ success: true, message: "Reel deleted successfully" });
    } catch (error) {
      console.error("Error deleting reel:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid reel ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Reel not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to delete reel" });
    }
  }

  static async getFeed(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const reels = await ReelService.getFeed(page, limit);
      res.json(reels);
    } catch (error) {
      console.error("Error fetching reel feed:", error);
      res.status(500).json({ error: "Failed to fetch reel feed" });
    }
  }
  /**
   * Check upload limit for a store
   */
  static async checkUploadLimit(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      const limitInfo = await ReelService.checkDailyUploadLimit(storeId as string);
      res.json(limitInfo);
    } catch (error) {
      console.error("Error checking upload limit:", error);
      res.status(500).json({ error: "Failed to check upload limit" });
    }
  }

  /**
   * Webhook handler for Openinary
   */
  static async handleWebhook(req: Request, res: Response) {
    try {
      // Verify webhook signature here (add security)
      const reel = await ReelService.handleUploadWebhook(req.body);
      res.status(200).json({ success: true, reel });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  }
}
