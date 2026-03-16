// controllers/UploadController.ts
import { Request, Response } from "express";
import { OpeninaryService } from "../services/openinary.service";

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!(req as any).file) {
        return res.status(400).json({ error: "No image provided" });
      }
      console.log("req: ", req);

      const { folder = "temp", storeId = "temp" } = req.body;

      const result = await OpeninaryService.uploadImage({
        filename: (req as any).file.originalname,
        fileBuffer: (req as any).file.buffer,
        mimeType: (req as any).file.mimetype,
        storeId,
        folder,
        alt: req.body.alt,
        title: req.body.title,
      });

      res.status(201).json({
        success: true,
        url: result.url,
        publicId: result.publicId,
        thumbnailUrl: result.thumbnailUrl,
        optimizedUrls: result.optimizedUrls,
        size: result.size,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }

  static async uploadMultiple(req: Request, res: Response) {
    try {
      if (!(req as any).files || !Array.isArray((req as any).files)) {
        return res.status(400).json({ error: "No images provided" });
      }

      const { folder = "temp", storeId = "temp" } = req.body;

      const uploadPromises = (req as any).files.map((file) =>
        OpeninaryService.uploadImage({
          filename: file.originalname,
          fileBuffer: file.buffer,
          mimeType: file.mimetype,
          storeId,
          folder,
        }),
      );

      const results = await Promise.all(uploadPromises);

      res.status(201).json({
        success: true,
        images: results.map((r) => ({
          url: r.url,
          publicId: r.publicId,
          thumbnailUrl: r.thumbnailUrl,
        })),
      });
    } catch (error) {
      console.error("Multiple upload failed:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  }
}
