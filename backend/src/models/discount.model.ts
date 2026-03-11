import mongoose from "mongoose";

export interface IDiscount extends mongoose.Document {
  store_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  amount: number; // percentage (0-100)
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

const DiscountSchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    index: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IDiscount>("Discount", DiscountSchema);