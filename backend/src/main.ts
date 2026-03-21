import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import storeRoutes from "./routes/store.route";
import productRoutes from "./routes/product.route";
import reelRoutes from "./routes/reel.route";
import discountRoutes from "./routes/discount.route";
import uploadImagesRoutes from "./routes/upload.routes";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req, res) => {
  res.send("alhamdullah the marketplace is working ");
});
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/upload", uploadImagesRoutes);
app.use("/api/discounts", discountRoutes);

// .../stores/store_Id => GET
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
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(
        `🎥 Openinary Test: http://localhost:${PORT}/test-openinary.html`,
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
