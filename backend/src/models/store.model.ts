import mongoose from "mongoose";
export type StoreStatus = "active" | "expired" | "trial" | "suspended";
export type SubscriptionPlan = "trial" | "premium";
export type PaymentMethod = "cash" | "bank";

export interface ISubscription {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  isPaid: boolean;
  paidAmount?: number;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
  paymentHistory?: IPaymentHistory[];
  transactionId?: string;
}

export interface IPaymentHistory {
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  transactionId?: string;
}
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
  owner_name?: string;
  subscription?: ISubscription;
  username?: string;
  password?: string;
  products: mongoose.Types.ObjectId[];
  reels: mongoose.Types.ObjectId[];
  discounts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  status?: StoreStatus;
}

const PaymentHistorySchema = new mongoose.Schema<IPaymentHistory>({
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, enum: ["cash", "bank"], required: true },
  plan: { type: String, enum: ["trial", "premium"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  transactionId: { type: String, sparse: true },
});
const SubscriptionSchema = new mongoose.Schema<ISubscription>({
  plan: {
    type: String,
    enum: ["trial", "premium"],
    default: "trial",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  paidAmount: { type: Number },
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ["cash", "bank"] },
  paymentHistory: [PaymentHistorySchema],
});
const StoreSchema = new mongoose.Schema(
  {
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
    owner_name: String,
    status: {
      type: String,
      enum: ["active", "expired", "trial", "suspended"],
      default: "trial",
    },
    username: { type: String, unique: true, sparse: true },
    password: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
    discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
    subscription: SubscriptionSchema,
  },
  { timestamps: true },
);
// Pre-save middleware to update status based on subscription
// StoreSchema.pre("save", function (next: (error?: Error) => void) {
//   const store = this as IStore;
//   const now = new Date();

//   // If manually suspended, keep suspended
//   if (store.status === "suspended") {
//     return next();
//   }

//   // Check if subscription is expired
//   if (store.subscription && store.subscription.endDate < now) {
//     if (store.subscription.isPaid) {
//       store.status = "expired";
//     } else {
//       store.status = "expired";
//     }
//   }
//   // Check if on trial (not paid and not expired)
//   else if (!store.subscription?.isPaid && store.subscription?.endDate >= now) {
//     store.status = "trial";
//   }
//   // Check if active (paid and not expired)
//   else if (store.subscription?.isPaid && store.subscription?.endDate >= now) {
//     store.status = "active";
//   }

//   next();
// });

export default mongoose.model<IStore>("Store", StoreSchema);
