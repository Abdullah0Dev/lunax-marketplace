import express from "express";
import { StoreController } from "../controllers";

const router = express.Router();

router.get("/", StoreController.getAll);
router.get("/:id", StoreController.getOne);
router.post("/", StoreController.create);
router.put("/:id", StoreController.update);
router.delete("/:id", StoreController.delete);

export default router;