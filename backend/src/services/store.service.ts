import { Store, IStore, Product, Reel, Discount } from "../models";
import { Types } from "mongoose";

export class StoreService {
  // Get all stores with populated data
  static async getAllStores() {
    try {
      const stores = await Store.find()
        .populate("products", "name price cover_image") // get data instead of id
        .populate("reels", "title url duration") // get data instead of id
        .populate("discounts", "amount product_id") // get data instead of id
        .sort({ createdAt: -1 })
        .lean();

      return stores.map((store) => ({
        ...store,
        id: store._id.toString(), // rewrite _id => id
        _id: undefined,
        products: store.products?.map((p: any) => ({
          ...p,
          id: p._id.toString(),
          _id: undefined,
        })),
        reels: store.reels?.map((r: any) => ({
          ...r,
          id: r._id.toString(),
          _id: undefined,
        })),
        discounts: store.discounts?.map((d: any) => ({
          ...d,
          id: d._id.toString(),
          _id: undefined,
        })),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch stores: ${error}`);
    }
  }

  // Get store by ID
  static async getStoreById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid store ID");
    }

    const store = await Store.findById(id)
      .populate("products")
      .populate("reels")
      .populate("discounts")
      .lean();

    if (!store) {
      throw new Error("Store not found");
    }

    return {
      ...store,
      id: store._id.toString(),
      _id: undefined,
    };
  }

  // Create new store
  static async createStore(data: Partial<IStore>) {
    const { name, description, logo, address, phone_number } = data;

    if (
      !name?.kurdish ||
      !name?.english ||
      !description ||
      !logo ||
      !address ||
      !phone_number
    ) {
      throw new Error("Missing required fields");
    }

    const store = await Store.create({
      logo,
      name,
      address,
      phone_number,
      description,
      category: data.category,
      products: [],
      reels: [],
      discounts: [],
    });

    return store;
  }

  // Update store
  static async updateStore(id: string, updates: Partial<IStore>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid store ID");
    }

    const store = await Store.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!store) {
      throw new Error("Store not found");
    }

    return store;
  }
 

  // Delete store and all related data (CASCADING DELETE)
  static async deleteStore(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid store ID");
    }

    // First, find the store to make sure it exists
    const store = await Store.findById(id);
    if (!store) {
      throw new Error("Store not found");
    }

    // Start a session for transaction (optional but recommended)
    // This ensures all deletes succeed or none do
    const session = await Store.startSession();
    session.startTransaction();

    try {
      // 1. Delete all products belonging to this store
      const deletedProducts = await Product.deleteMany({
        store_id: id,
      }).session(session);
      console.log(
        `Deleted ${deletedProducts.deletedCount} products for store ${id}`,
      );

      // 2. Delete all reels belonging to this store
      const deletedReels = await Reel.deleteMany({ store_id: id }).session(
        session,
      );
      console.log(`Deleted ${deletedReels.deletedCount} reels for store ${id}`);

      // 3. Delete all discounts belonging to this store
      const deletedDiscounts = await Discount.deleteMany({
        store_id: id,
      }).session(session);
      console.log(
        `Deleted ${deletedDiscounts.deletedCount} discounts for store ${id}`,
      );

      // 4. Finally, delete the store itself
      await Store.findByIdAndDelete(id).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Store and all related data deleted successfully",
        deletedCounts: {
          products: deletedProducts.deletedCount,
          reels: deletedReels.deletedCount,
          discounts: deletedDiscounts.deletedCount,
        },
        store: {
          id: store._id.toString(),
          name: store.name,
        },
      };
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Failed to delete store and related data: ${error}`);
    }
  }

  // Alternative: Soft delete (if you want to keep data but mark as inactive)
  static async softDeleteStore(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid store ID");
    }

    const store = await Store.findById(id);
    if (!store) {
      throw new Error("Store not found");
    }

    // Instead of deleting, mark as inactive (you'd need to add an 'isActive' field to your schema)
    // For now, we'll just update with a deleted flag
    const updatedStore = await Store.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    // Optionally, also soft delete related products
    await Product.updateMany({ store_id: id }, { $set: { isActive: false } });

    return updatedStore;
  }

  // Get store delete preview (show what will be deleted)
  static async getStoreDeletePreview(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid store ID");
    }

    const store = await Store.findById(id).lean();
    if (!store) {
      throw new Error("Store not found");
    }

    // Count related data
    const [productCount, reelCount, discountCount] = await Promise.all([
      Product.countDocuments({ store_id: id }),
      Reel.countDocuments({ store_id: id }),
      Discount.countDocuments({ store_id: id }),
    ]);

    // Get sample of products to show
    const sampleProducts = await Product.find({ store_id: id })
      .limit(5)
      .select("name price")
      .lean();

    return {
      store: {
        id: store._id.toString(),
        name: store.name,
        address: store.address,
        phone_number: store.phone_number,
      },
      relatedData: {
        products: {
          count: productCount,
          samples: sampleProducts.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            price: p.price,
          })),
        },
        reels: {
          count: reelCount,
        },
        discounts: {
          count: discountCount,
        },
      },
      totalItemsToDelete: productCount + reelCount + discountCount + 1, // +1 for the store itself
    };
  }
}
