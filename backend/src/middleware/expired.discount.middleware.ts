// services/DiscountExpiryService.ts

import { Discount, Product } from "../models";

export class DiscountExpiryCheck {
  static async expirePassedDiscounts() {
    const now = new Date();
    
    // Find all active discounts that have expired
    const expiredDiscounts = await Discount.find({
      isActive: true,
      endDate: { $lt: now }
    });

    if (expiredDiscounts.length === 0) {
      return { count: 0 };
    }

    // Update them to inactive
    await Discount.updateMany(
      {
        _id: { $in: expiredDiscounts.map(d => d._id) }
      },
      {
        $set: { isActive: false }
      }
    );

    // Update product prices
    for (const discount of expiredDiscounts) {
      await Product.findByIdAndUpdate(discount.product_id, {
        discount_price: null
      });
    }

    return { 
      count: expiredDiscounts.length,
      discounts: expiredDiscounts.map(d => d._id)
    };
  }
}