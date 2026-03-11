import { IDiscount, Product, Discount, Store } from "../models";
import { Types } from "mongoose";

export class DiscountService {
  // Get discounts by store ID
  static async getDiscountsByStore(storeId: string) {
    if (!Types.ObjectId.isValid(storeId)) {
      throw new Error("Invalid store ID");
    }

    const discounts = await Discount.find({ store_id: storeId })
      .populate("product_id", "name price cover_image")
      .sort({ createdAt: -1 })
      .lean();

    return discounts.map((discount) => ({
      ...discount,
      id: discount._id.toString(),
      _id: undefined,
      product: discount.product_id
        ? {
            id: (discount.product_id as any)._id.toString(),
            name: (discount.product_id as any).name,
            price: (discount.product_id as any).price,
          }
        : null,
    }));
  }
  // Clean up duplicate discounts (utility method)
  static async cleanupDuplicateDiscounts() {
    // Find all products that have multiple discounts
    const duplicates = await Discount.aggregate([
      {
        $group: {
          _id: "$product_id",
          count: { $sum: 1 },
          discounts: { $push: "$$ROOT" },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    const cleanupResults = [];

    for (const item of duplicates) {
      // Sort discounts by createdAt (newest first)
      const sorted = item.discounts.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Keep the newest active discount, deactivate others
      const [latest, ...oldOnes] = sorted;

      // Deactivate all older discounts
      for (const old of oldOnes) {
        await Discount.findByIdAndUpdate(old._id, {
          $set: { isActive: false },
        });
        cleanupResults.push({
          discountId: old._id,
          productId: old.product_id,
          action: "deactivated",
        });
      }

      // Ensure the latest is active
      if (!latest.isActive) {
        await Discount.findByIdAndUpdate(latest._id, {
          $set: { isActive: true },
        });
        cleanupResults.push({
          discountId: latest._id,
          productId: latest.product_id,
          action: "activated",
        });
      }
    }

    return {
      message: `Cleaned up ${duplicates.length} products with duplicate discounts`,
      details: cleanupResults,
    };
  }

  // Get active discounts
  static async getActiveDiscounts() {
    const now = new Date();
    console.info("now date: ", now);

    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now }, // started on or before now
      endDate: { $gte: now }, // ends on or after now (future)
    })
      .populate("product_id")
      .populate("store_id", "name logo")
      .lean();

    return discounts.map((discount) => ({
      ...discount,
      id: discount._id.toString(),
      _id: undefined,
    }));
  }

  // Create discount
  static async createDiscount(data: Partial<IDiscount>) {
    const { store_id, product_id, amount } = data;

    if (!store_id || !product_id || amount === undefined) {
      throw new Error("Missing required fields");
    }

    // Check if store exists
    const store = await Store.findById(store_id);
    if (!store) {
      throw new Error("Store not found");
    }

    // Check if product exists and belongs to store
    const product = await Product.findOne({ _id: product_id, store_id });
    if (!product) {
      throw new Error("Product not found or doesn't belong to this store");
    }

    // Validate amount
    if (amount < 0 || amount > 100) {
      throw new Error("Discount amount must be between 0 and 100");
    }

    // STRICTLY check if discount already exists for this product
    const existingDiscount = await Discount.findOne({
      product_id: product_id,
      store_id: store_id,
      isActive: true,
    });

    if (existingDiscount) {
      throw new Error(
        `A discount already exists for this product. Please update the existing discount instead. Discount ID: ${existingDiscount._id}`,
      );
    }

    const discount = await Discount.create({
      ...data,
      isActive: true,
    });

    // Add discount reference to store
    await Store.findByIdAndUpdate(store_id, {
      $push: { discounts: discount._id },
    });

    // Update product with discount price
    const discountedPrice = product.price * (1 - amount / 100);
    await Product.findByIdAndUpdate(product_id, {
      discount_price: discountedPrice,
    });

    return discount;
  }

  // Update discount
  static async updateDiscount(id: string, updates: Partial<IDiscount>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid discount ID");
    }

    const discount = await Discount.findById(id);
    if (!discount) {
      throw new Error("Discount not found");
    }

    // If amount is being updated, update product discount price
    if (updates.amount !== undefined) {
      const product = await Product.findById(discount.product_id);
      if (product) {
        const discountedPrice = product.price * (1 - updates.amount / 100);
        await Product.findByIdAndUpdate(discount.product_id, {
          discount_price: discountedPrice,
        });
      }
    }

    const updated = await Discount.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    return updated;
  }

  // Delete discount
  static async deleteDiscount(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid discount ID");
    }

    const discount = await Discount.findById(id);
    if (!discount) {
      throw new Error("Discount not found");
    }

    // Remove discount price from product
    await Product.findByIdAndUpdate(discount.product_id, {
      discount_price: null,
    });

    // Remove discount reference from store
    await Store.findByIdAndUpdate(discount.store_id, {
      $pull: { discounts: id },
    });

    await Discount.findByIdAndDelete(id);

    return { success: true };
  }

  // Deactivate expired discounts
  static async deactivateExpiredDiscounts() {
    const now = new Date();

    const expired = await Discount.find({
      isActive: true,
      endDate: { $lt: now },
    });

    for (const discount of expired) {
      discount.isActive = false;
      await discount.save();

      // Remove discount price from product
      await Product.findByIdAndUpdate(discount.product_id, {
        discount_price: null,
      });
    }

    return expired.length;
  }
  // Get product discount info (helper method)
  static async getProductDiscountInfo(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new Error("Product not found");
    }

    const discount = await Discount.findOne({
      product_id: productId,
      isActive: true,
    }).lean();

    return {
      product: {
        id: product._id.toString(),
        name: product.name,
        original_price: product.price,
        current_price: product.discount_price || product.price,
        has_discount: !!discount,
      },
      discount: discount
        ? {
            id: discount._id.toString(),
            amount: discount.amount,
            startDate: discount.startDate,
            endDate: discount.endDate,
            savings: product.price - (product.discount_price || product.price),
          }
        : null,
    };
  }
  // Bulk deactivate discounts for a store
  static async deactivateStoreDiscounts(storeId: string) {
    if (!Types.ObjectId.isValid(storeId)) {
      throw new Error("Invalid store ID");
    }

    const discounts = await Discount.find({
      store_id: storeId,
      isActive: true,
    });

    for (const discount of discounts) {
      discount.isActive = false;
      await discount.save();

      // Remove discount price from product
      await Product.findByIdAndUpdate(discount.product_id, {
        discount_price: null,
      });
    }

    return {
      count: discounts.length,
      message: `Deactivated ${discounts.length} discounts for store ${storeId}`,
    };
  }
}
