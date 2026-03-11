import { Request, Response } from "express";
import { DiscountService } from "../services";
import { DiscountExpiryCheck } from "../middleware/expired.discount.middleware";

export class DiscountController {
  static async getByStore(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      const discounts = await DiscountService.getDiscountsByStore(
        storeId as string,
      );
      res.json(discounts);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      if (error instanceof Error && error.message === "Invalid store ID") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to fetch discounts" });
    }
  }

  static async getActive(req: Request, res: Response) {
    try {
      // First expire any passed discounts
      await DiscountExpiryCheck.expirePassedDiscounts();

      const discounts = await DiscountService.getActiveDiscounts();
      res.json(discounts);
    } catch (error) {
      console.error("Error fetching active discounts:", error);
      res.status(500).json({ error: "Failed to fetch active discounts" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const discount = await DiscountService.createDiscount(req.body);
      res.status(201).json(discount);
    } catch (error) {
      console.error("Error creating discount:", error);
      if (error instanceof Error) {
        const errorMap: { [key: string]: number } = {
          "Missing required fields": 400,
          "Store not found": 404,
          "Product not found or doesn't belong to this store": 404,
          "Discount amount must be between 0 and 100": 400,
        };

        const statusCode = errorMap[error.message] || 500;
        return res.status(statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create discount" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const discount = await DiscountService.updateDiscount(
        id as string,
        req.body,
      );
      res.json(discount);
    } catch (error) {
      console.error("Error updating discount:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid discount ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Discount not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to update discount" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await DiscountService.deleteDiscount(id as string);
      res.json({ success: true, message: "Discount deleted successfully" });
    } catch (error) {
      console.error("Error deleting discount:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid discount ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Discount not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to delete discount" });
    }
  }
  static async deactivateExpired(req: Request, res: Response) {
    try {
      const result = await DiscountService.deactivateExpiredDiscounts();
      res.json(result);
    } catch (error) {
      console.error("Error deactivating expired discounts:", error);
      res.status(500).json({ error: "Failed to deactivate expired discounts" });
    }
  }
  static async getProductDiscountInfo(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const info = await DiscountService.getProductDiscountInfo(
        productId as string,
      );
      res.json(info);
    } catch (error) {
      console.error("Error fetching product discount info:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid product ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Product not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to fetch product discount info" });
    }
  }
  static async deactivateStoreDiscounts(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      const result = await DiscountService.deactivateStoreDiscounts(
        storeId as string,
      );
      res.json(result);
    } catch (error) {
      console.error("Error deactivating store discounts:", error);
      if (error instanceof Error && error.message === "Invalid store ID") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to deactivate store discounts" });
    }
  }
}
