import express from "express";
import { ProductController } from "../controllers";

const router = express.Router();

router.get("/search", ProductController.search);
router.get("/store/:storeId", ProductController.getByStore);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getOne);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;