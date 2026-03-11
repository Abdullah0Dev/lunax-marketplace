import mongoose from "mongoose";
import validator from "validator";

export interface IReel extends mongoose.Document {
  store_id: mongoose.Types.ObjectId;
  public_id: string; // Openinary public ID
  url: string;
  thumbnail_url?: string;
  format: string;
  width?: number;
  height?: number;
  size: number; // file size in bytes
  title: {
    kurdish: string;
    english: string;
  };
  description: string;
  duration: number; // in seconds
  createdAt: Date;
}

const ReelSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: (val: string) => validator.isURL(val),
        message: "URL must be valid",
      },
    },
    thumbnail_url: String,
    title: {
      kurdish: { type: String, required: true },
      english: { type: String, required: true },
    },
    description: String,
    duration: { type: Number, min: 1, max: 300, required: true }, // max 5 minutes = 300 seconds
    format: String,
    width: Number,
    height: Number,
    size: Number,
  },
  {
    timestamps: true,
    // Ensure we can query by store and date for rate limiting
    indexes: [{ store_id: 1, createdAt: -1 }, { public_id: 1 }],
  },
);

export default mongoose.model<IReel>("Reel", ReelSchema);
