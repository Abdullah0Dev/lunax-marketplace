import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  store_id: mongoose.Types.ObjectId;
  cover_image: string;
  name: {
    kurdish: string;
    english: string;
  };
  price: number;
  discount_price?: number;
  description: string;
  quantity: number;
  category: string;
  media: string[];
  specifications: Array<{
    key: string;
    value: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    index: true,
  },
  cover_image: { type: String, required: true },
  name: {
    kurdish: { type: String, required: true },
    english: { type: String, required: true },
  },
  price: { type: Number, required: true, min: 0 },
  discount_price: { type: Number, min: 0 },
  description: { type: String, required: true },
  quantity: { type: Number, default: 0, min: 0 },
  category: { type: String, required: true, index: true },
  media: [{ type: String }],
  specifications: [{
    key: String,
    value: String,
  }],
}, { timestamps: true });

export default mongoose.model<IProduct>("Product", ProductSchema);