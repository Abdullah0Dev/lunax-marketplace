import mongoose from "mongoose";

export interface IStore extends mongoose.Document {
  logo: string;
  coverImage?: string;
  name: {
    kurdish: string;
    english: string;
  };
  address: string;
  phone_number: string;
  description: string;
  category?: string;
  username?: string;
  password?: string;
  products: mongoose.Types.ObjectId[];
  reels: mongoose.Types.ObjectId[];
  discounts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  coverImage: String,
  name: {
    kurdish: { type: String, required: true },
    english: { type: String, required: true },
  },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  username: { type: String, unique: true, sparse: true },
  password: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
  discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
}, { timestamps: true });

export default mongoose.model<IStore>("Store", StoreSchema);