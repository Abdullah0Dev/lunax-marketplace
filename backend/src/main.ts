import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import storeRoutes from "./routes/store.route";
import productRoutes from "./routes/product.route";
import reelRoutes from "./routes/reel.route";
import discountRoutes from "./routes/discount.route";
   
const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("alhamdullah the marketplace is working ");
});
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/discounts", discountRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// MongoDB connection
mongoose
  .connect(MONGODB_URL || "mongodb://localhost:27017/marketplace")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
