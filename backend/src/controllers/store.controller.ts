import { Request, Response } from "express";
import { StoreService } from "../services";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Store } from "../models";
export class StoreController {
  static async getAll(req: Request, res: Response) {
    try {
      const stores = await StoreService.getAllStores();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch stores",
      });
    }
  }
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      // Search for user in database
      const user = await Store.findOne({ username });
      const currentStatus = user?.status;
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // make sure the user is active
      // Compare password
      // if (password !== user.password) {
      //   return res.status(401).json({ message: "Invalid password" });
      // }
      const isPasswordValid = password === user.password;
      console.log(
        "isPasswordValid: ",
        isPasswordValid,
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      if (currentStatus === 'expired') {
        return res.status(401).json({ message: "Make sure to pay the subscription" });
      }

      // Generate token (JWT example)
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "90d" },
      );

      // Return success response
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
        },
        store: { id: user._id, name: user.name },
      });
    } catch (error) {
      console.log("server error: ", error);
      res.status(500).json({ message: "Server error" });
    }
  }
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
   * Get stores by category (simple paginated)
   */
  static async getStoresByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const stores = await StoreService.getStoresByCategory(
        category as string,
        page,
        limit,
      );
      res.json(stores);
    } catch (error) {
      console.error("Error fetching stores by category:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch stores",
      });
    }
  }

  /**
   * Search stores with advanced filters
   */
  static async searchStores(req: Request, res: Response) {
    try {
      const {
        q,
        category,
        lat,
        lng,
        radius,
        hasDiscounts,
        minProducts,
        sortBy,
        page,
        limit,
      } = req.query;

      const result = await StoreService.searchStores({
        query: q as string,
        category: category as string,
        lat: lat ? parseFloat(lat as string) : undefined,
        lng: lng ? parseFloat(lng as string) : undefined,
        radius: radius ? parseFloat(radius as string) : undefined,
        hasDiscounts: hasDiscounts === "true",
        minProducts: minProducts ? parseInt(minProducts as string) : undefined,
        sortBy: (sortBy as any) || "relevance",
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      res.json(result);
    } catch (error) {
      console.error("Error searching stores:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to search stores",
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
   * Get featured stores
   */
  static async getFeaturedStores(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const stores = await StoreService.getFeaturedStores(limit);
      res.json({
        stores,
        total: stores.length,
        limit,
      });
    } catch (error) {
      console.error("Error fetching featured stores:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch featured stores",
      });
    }
  }

  /**
   * Get nearby stores based on location
   */
  static async getNearbyStores(req: Request, res: Response) {
    try {
      const { lat, lng } = req.query;
      const radius = parseInt(req.query.radius as string) || 10;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required" });
      }

      const stores = await StoreService.getNearbyStores(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius,
        limit,
      );

      res.json({
        stores,
        total: stores.length,
        center: {
          lat: parseFloat(lat as string),
          lng: parseFloat(lng as string),
        },
        radius,
      });
    } catch (error) {
      console.error("Error fetching nearby stores:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch nearby stores",
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

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const store = await StoreService.getStoreById(id as string);
      res.json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid store ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Store not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to fetch store" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const store = await StoreService.createStore(req.body);
      res.status(201).json(store);
    } catch (error) {
      console.error("Error creating store:", error);
      if (
        error instanceof Error &&
        error.message === "Missing required fields"
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create store" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const store = await StoreService.updateStore(id as string, req.body);
      res.json(store);
    } catch (error) {
      console.error("Error updating store:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid store ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Store not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to update store" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await StoreService.deleteStore(id as string);
      res.json({ success: true, message: "Store deleted successfully" });
    } catch (error) {
      console.error("Error deleting store:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid store ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Store not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to delete store" });
    }
  }
}
