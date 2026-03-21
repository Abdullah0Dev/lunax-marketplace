import { Request, Response } from "express";
import { ProductService, ReelService, StoreService } from "../services";
import { Types } from "mongoose";
import { ObjectBindingOrAssignmentElement } from "typescript";

export class CustomerController {
  static async getRelevantStoresByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const minRelevance = parseInt(req.query.minRelevance as string) || 0;

      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const stores = await StoreService.getRelevantStoresByCategory(
        category as string,
        limit,
        minRelevance,
      );

      res.json(stores);
    } catch (error) {
      console.error("Error fetching relevant stores by category:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch stores",
      });
    }
  }
  /**
   * Get latest products (new arrivals)
   */
  static async getLatestProducts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;

      const products = await ProductService.getLatestProducts(page, limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching latest products:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch latest products",
      });
    }
  }

  /**
   *
   * Search products details with its ID
   */
  static async getProductDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const products = await ProductService.getProductById(id as string);
      res.json(products);
    } catch (error) {
      console.error("Error fetching latest products:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch latest products",
      });
    }
  }

  /**
   *
   * Search products with filters
   */
  static async searchProducts(req: Request, res: Response) {
    try {
      const {
        q,
        category, 
      } = req.query;

      const result = await ProductService.searchProducts(q as string, category as string);

      res.json(result);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to search products",
      });
    }
  }

  /**
   * Get store by ID with full details
   */
  static async getStoreById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: "Invalid store ID" });
      }

      const store = await StoreService.getStoreById(id as string);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json(store);
    } catch (error) {
      console.error("Error fetching store by ID:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch store",
      });
    }
  }
  /**
   * Get reels feed
   */
  static async getReelsFeed(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const reels = await ReelService.getFeed(page, limit);

      if (!reels) {
        return res.status(404).json({ error: "reels not found" });
      }

      res.status(200).json(reels);
    } catch (error) {
      console.error("Error fetching reels feed:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch reels",
      });
    }
  }

  /**
   * Get all categories with store counts
   */
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await StoreService.getCategoriesWithCounts();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
      });
    }
  }
}
