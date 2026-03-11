import express from "express";
import { ReelController } from "../controllers";

const router = express.Router();

router.get("/feed", ReelController.getFeed);
router.get("/store/:storeId", ReelController.getByStore);
router.get("/:id", ReelController.getOne);
router.post("/", ReelController.create);
router.put("/:id", ReelController.update);
router.delete("/:id", ReelController.delete);

// Store owner routes (add authentication middleware in production)
router.post("/upload", ReelController.uploadReel);
router.put("/:id", ReelController.update);
router.delete("/:id", ReelController.delete);

// Utility routes
router.get("/limit/:storeId", ReelController.checkUploadLimit);

// Webhook (should be protected with a secret in production)
router.post("/webhook", ReelController.handleWebhook);
export default router;
