import express from "express";
import { CustomerController, DiscountController } from "../controllers";

const router = express.Router();

// ========== CUSTOMER ROUTES ==========
router.get("/stores/categories", CustomerController.getCategories);
router.get("/products/search", CustomerController.searchProducts);
router.get(
  "/stores/category/:category",
  CustomerController.getRelevantStoresByCategory,
);
router.get(
  "/discount/products",
  DiscountController.getProductsWithDiscount,
);

router.get("/stores/:id", CustomerController.getStoreById);
router.get("/products/latest", CustomerController.getLatestProducts);
router.get("/reels/feed", CustomerController.getReelsFeed);
router.get("/products/:id", CustomerController.getProductDetails);

export default router;

// https://lunax-marketplace.dmsystem.dpdns.org/api/stores
/**
 * * Get Stores By Category
 * * get store details by id
 * * after showing products details => get product details
 * * get latest products
 * * get reels feed
 *
 */
