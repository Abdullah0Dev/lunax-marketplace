import { Product, IProduct, Store } from "../models";
import { Types } from "mongoose";

export class ProductService {
  // Get products by store ID
  static async getAllProducts() { 
    const products = await Product.find({});
    return products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }));
  }
  static async getProductsByStore(storeId: string) {
    if (!Types.ObjectId.isValid(storeId)) {
      throw new Error("Invalid store ID");
    }

    const products = await Product.find({ store_id: storeId })
      .sort({ createdAt: -1 })
      .lean();

    return products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }));
  }

  // Get single product
  static async getProductById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      ...product,
      id: product._id.toString(),
      _id: undefined,
    };
  }

  // Create product
  static async createProduct(data: Partial<IProduct>) {
    const { store_id, name, price, description, category, cover_image } = data;
    if (!Types.ObjectId.isValid(store_id)) {
      throw new Error("Invalid Store ID");
    }
    if (
      !store_id ||
      !name?.kurdish ||
      !name?.english ||
      !price ||
      !description ||
      !category ||
      !cover_image
    ) {
      throw new Error("Missing required fields");
    }

    // Check if store exists
    const store = await Store.findById(store_id);
    if (!store) {
      throw new Error("Store not found");
    }

    const product = await Product.create({
      ...data,
      quantity: data.quantity || 0,
    });

    // Add product reference to store
    await Store.findByIdAndUpdate(store_id, {
      $push: { products: product._id },
    });

    return product;
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<IProduct>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  // Delete product
  static async deleteProduct(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    // Remove product reference from store
    await Store.findByIdAndUpdate(product.store_id, {
      $pull: { products: id },
    });

    await Product.findByIdAndDelete(id);

    return { success: true };
  }

  // Search products by category
  static async searchProducts(query: string, category?: string) {
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (query) {
      filter.$or = [
        { "name.english": { $regex: query, $options: "i" } },
        { "name.kurdish": { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .populate("store_id", "name logo address")
      .sort({ createdAt: -1 })
      .lean();

    return products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
      store: product.store_id
        ? {
            id: (product.store_id as any)._id.toString(),
            name: (product.store_id as any).name,
            logo: (product.store_id as any).logo,
          }
        : null,
    }));
  }
}
