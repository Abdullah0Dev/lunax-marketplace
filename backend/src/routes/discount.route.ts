import express from "express";
import { DiscountController } from "../controllers";
import { DiscountService } from "../services";

const router = express.Router();

router.get("/active", DiscountController.getActive);
router.get("/store/:storeId", DiscountController.getByStore);
router.post("/", DiscountController.create);
router.put("/:id", DiscountController.update);
router.delete("/:id", DiscountController.delete);
// Cleanup endpoint (admin only - add auth middleware in production)
router.post("/cleanup", async (req, res) => {
  try {
    const result = await DiscountService.cleanupDuplicateDiscounts();
    res.json(result);
  } catch (error) {
    console.error("Error cleaning up discounts:", error);
    res.status(500).json({ error: "Failed to cleanup discounts" });
  }
});
// Get product discount info (detailed)
router.get(
  "/product/:productId/info",
  DiscountController.getProductDiscountInfo,
);
// get products by discount percentage

// Admin endpoints
router.post("/deactivate-expired", DiscountController.deactivateExpired);
router.post(
  "/store/:storeId/deactivate",
  DiscountController.deactivateStoreDiscounts,
);


export default router;
