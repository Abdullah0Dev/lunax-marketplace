import { Request, Response } from "express";
import { StoreService } from "../services";
import { Types } from "mongoose";

export class StoreController {
  static async getAll(req: Request, res: Response) {
    try {
      const stores = await StoreService.getAllStores();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res
        .status(500)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to fetch stores",
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
