import { Request, Response } from "express";
import { ProductService, ReelService, StoreService } from "../services";
import { Types } from "mongoose";
import { ObjectBindingOrAssignmentElement } from "typescript";
import { IStore, Store } from "../models";

export class AdminController {
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
  private static generateSecurePassword(length = 12) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABC$D2E2FGH$IJ5KL$MN3OPQ3RST3UV3WX3YZ0123456789!@#$%&";
    let password = "";

    // Use Web Crypto API for secure random values
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    for (let i = 0; i < length; i++) {
      password += charset[values[i] % charset.length];
    }
    return password;
  }
  static async createStore(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        logo,
        address,
        phone_number,
        ownerName,
        username,
        coverImage,
        password,
        category,
      } = req.body;
      // Validate required fields
      const requiredFields = [
        {
          field: "name.kurdish",
          value: name?.kurdish,
          message: "Store name (Kurdish) is required",
        },
        { field: "logo", value: logo, message: "Store logo is required" },
        {
          field: "address",
          value: address,
          message: "Store address is required",
        },
        {
          field: "phone_number",
          value: phone_number,
          message: "Phone number is required",
        },
      ];

      for (const { field, value, message } of requiredFields) {
        if (!value) {
          return res.status(400).json({
            success: false,
            error: message,
            field: field,
          });
        }
      }
      // Validate URL format for logo (if provided)
      if (logo && !logo.startsWith("http://") && !logo.startsWith("https://")) {
        return res.status(400).json({
          success: false,
          error: "Logo must be a valid URL (http:// or https://)",
          field: "logo",
        });
      }

      // Check if username already exists (if provided)
      if (username) {
        const existingStore = await Store.findOne({ username });
        if (existingStore) {
          return res.status(409).json({
            success: false,
            error: "Username already taken",
            field: "username",
          });
        }
      }

      // Check if phone number already exists
      const existingPhone = await Store.findOne({ phone_number });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          error: "Phone number already registered",
          field: "phone_number",
        });
      }
      console.log("phone_number: ", phone_number);
      
      if (!phone_number.startsWith("+964")) {
        return res.status(409).json({
          success: false,
          error: "Phone number Must be Iraqi Format: +9647...",
          field: "phone_number",
        });
      }
      const autoPassword =  AdminController.generateSecurePassword(16);
      const storeDetails: Partial<IStore> = {
        name: {
          kurdish: name.kurdish,
          english: name.english,
        },
        ownerName,
        username,
        password: password.trim() ? password : autoPassword,
        phone_number,
        logo,
        address,
        description,
        category,
        ...coverImage,
      };
      const { store } = await StoreService.createStoreWithTrial(storeDetails);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.status(201).json({
        success: true,
        message: "Store created successfully with 30-day trial period",
        data: {
          store: {
            id: store._id,
            name: store.name,
            owner_name: store.owner_name,
            username: store.username,
            phone_number: store.phone_number,
            logo: store.logo,
            address: store.address,
            category: store.category,
            status: store.status,
            subscription: {
              plan: store.subscription.plan,
              startDate: store.subscription.startDate,
              endDate: store.subscription.endDate,
              daysLeft: Math.ceil(
                (store.subscription.endDate.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            },
            createdAt: store.createdAt,
          },
          credentials: {
            username: store.username,
            password: store.password, // Return generated password for admin to share with store owner
          },
        },
      });
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to create store",
      });
    }
  }
  static async getAllStores(req: Request, res: Response) {
    try {
      const store = await StoreService.getAllStoresStats();

      if (!store) {
        return res.status(404).json({ error: "No stores available" });
      }

      res.json(store);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch stores",
      });
    }
  }
  static async updateStore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const store = await StoreService.updateStore(id as string, req.body);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error updating stores:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to update store",
      });
    }
  }
  static async deleteStore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const store = await StoreService.deleteStore(id as string);
      res.json(store);
    } catch (error) {
      console.error("Error deleting stores:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to delete store",
      });
    }
  }

  // Subscription & Payment
  static async processStorePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, paymentMethod, plan, paymentDate, transactionId } =
        req.body;

      // Validate required fields
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Store ID is required",
        });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid payment amount is required",
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          error: "Payment method is required",
        });
      }

      if (!plan) {
        return res.status(400).json({
          success: false,
          error: "Subscription plan is required",
        });
      }

      if (!paymentDate) {
        return res.status(400).json({
          success: false,
          error: "Payment date is required",
        });
      }

      // Process the payment
      const updatedStore = await StoreService.processPayment(id as string, {
        amount,
        paymentMethod,
        plan,
        paymentDate: new Date(paymentDate),
        transactionId,
      });

      // Return success response
      res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        data: {
          store: {
            id: updatedStore._id,
            name: updatedStore.name,
            status: updatedStore.status,
            subscription: {
              plan: updatedStore.subscription.plan,
              startDate: updatedStore.subscription.startDate,
              endDate: updatedStore.subscription.endDate,
              isPaid: updatedStore.subscription.isPaid,
              paidAmount: updatedStore.subscription.paidAmount,
              paymentDate: updatedStore.subscription.paymentDate,
              paymentMethod: updatedStore.subscription.paymentMethod,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process payment",
      });
    }
  }
}
