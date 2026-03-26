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
      .populate("store_id", "name logo address phone_number description")
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
            address: (product.store_id as any).address,
            phone_number: (product.store_id as any).phone_number,
            description: (product.store_id as any).description,
          }
        : null,
    }));
  }
  /**
   * Get latest products (new arrivals)
   * @param page - Page number for pagination
   * @param limit - Number of products per page
   * @returns Paginated list of latest products
   */
  static async getLatestProducts(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    products: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      console.log("new request: ))");

      // Get products sorted by creation date (newest first)
      const [products, total] = await Promise.all([
        Product.find()
          .populate("store_id", "name logo address phone_number description")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(),
      ]);

      // Format products for response
      const formattedProducts = products.map((product) => ({
        id: product._id.toString(),
        store_id: product.store_id,
        cover_image: product.cover_image,
        name: {
          kurdish: product.name?.kurdish,
          english: product.name?.english,
        },
        price: product.price,
        discount_price: product.discount_price,
        finalPrice: product.discount_price || product.price,
        description: product.description,
        quantity: product.quantity,
        category: product.category,
        media: product.media,
        specifications: product.specifications,
        // Add store info
        store: product.store_id
          ? {
              id: (product.store_id as any)._id.toString(),
              name: (product.store_id as any).name,
              logo: (product.store_id as any).logo,
              address: (product.store_id as any).address,
              phone_number: (product.store_id as any).phone_number,
              description: (product.store_id as any).description,
            }
          : null,
        hasDiscount: !!product.discount_price,
        discountPercentage: product.discount_price
          ? Math.round(
              ((product.price - product.discount_price) / product.price) * 100,
            )
          : 0,
        inStock: product.quantity > 0,
        createdAt: product.createdAt,
      }));

      return {
        products: formattedProducts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error in getLatestProducts:", error);
      throw new Error(`Failed to fetch latest products: ${error}`);
    }
  }
}
