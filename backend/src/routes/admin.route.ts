import express from "express";
import { AdminController } from "../controllers";

const router = express.Router();

// ========== ADMIN STORE MANAGEMENT ROUTES ==========

// Store CRUD Operations
router.post("/stores", AdminController.createStore); // Create store and return password
router.get("/stores", AdminController.getAllStores); // Get all stores with filters
router.get("/stores/:id", AdminController.getStoreById); // Get store details by ID
router.put("/stores/:id", AdminController.updateStore); // Update store details
router.delete("/stores/:id", AdminController.deleteStore); // Delete store

// Store Subscription & Payment
router.post("/stores/:id/payment", AdminController.processStorePayment); // Mark as paid and update subscription cycle


export default router;

// https://lunax-marketplace.dmsystem.dpdns.org/api/stores
/**
 * * create store and return password
 * * get store details by id
 * * get available stores: name, id, ownerName, phone Number, email,password, subscription(type: trial/premium, cycle: startDate-endDate), status(active/expired/trial..), stats(products count, reels count)
 * * update/delete/create store
 * * mark as paid cycle
 *
 */
