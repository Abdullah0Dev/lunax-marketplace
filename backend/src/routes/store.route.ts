import express from "express";
import { StoreController } from "../controllers";

const router = express.Router();

router.get("/", StoreController.getAll);
router.get("/:id", StoreController.getOne);
router.get("/category/:category", StoreController.getRelevantStoresByCategory);
router.post("/", StoreController.create);
router.post("/login", StoreController.login);
router.put("/:id", StoreController.update);
router.delete("/:id", StoreController.delete);
 
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