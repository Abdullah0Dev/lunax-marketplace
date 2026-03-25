import { Store, IStore, Product, Reel, Discount } from "../models";
import { Types } from "mongoose";
interface RelevanceScore {
  store: any;
  score: number;
  factors: {
    storeCategoryMatch: number;
    productsInCategory: number;
    productsWithDiscount: number;
    recentActivity: number;
    reelCount: number;
  };
}
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
  /**
   * Get nearby stores based on latitude and longitude
   * Uses geospatial indexing if you have coordinates in your store schema
   * Falls back to text-based location matching
   */
  static async getNearbyStores(
    lat: number,
    lng: number,
    radiusInKm: number = 10,
    limit: number = 20,
  ): Promise<any[]> {
    try {
      // First, check if stores have geo coordinates
      const storeWithGeo = await Store.findOne({
        "location.coordinates": { $exists: true },
      });

      // If stores have geo coordinates, use geospatial query
      if (storeWithGeo) {
        return await this.getNearbyStoresGeo(lat, lng, radiusInKm, limit);
      }

      // Otherwise, use text-based location matching
      return await this.getNearbyStoresText(lat, lng, radiusInKm, limit);
    } catch (error) {
      console.error("Error in getNearbyStores:", error);
      throw new Error(`Failed to fetch nearby stores: ${error}`);
    }
  }
  /**
   * Get featured stores based on multiple factors:
   * - Stores with most products
   * - Stores with active discounts
   * - Stores with recent reels
   * - Stores with high ratings (if you have ratings)
   * - Newly opened stores
   */
  static async getFeaturedStores(limit: number = 10): Promise<any[]> {
    try {
      // Get stores with aggregated data
      const featuredStores = await Store.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "store_id",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "reels",
            localField: "_id",
            foreignField: "store_id",
            as: "reels",
          },
        },
        {
          $lookup: {
            from: "discounts",
            localField: "_id",
            foreignField: "store_id",
            as: "discounts",
          },
        },
        {
          $addFields: {
            productCount: { $size: "$products" },
            reelCount: { $size: "$reels" },
            discountCount: {
              $size: {
                $filter: {
                  input: "$discounts",
                  as: "discount",
                  cond: { $eq: ["$$discount.isActive", true] },
                },
              },
            },
            // Calculate featured score
            featuredScore: {
              $add: [
                { $multiply: [{ $size: "$products" }, 1] }, // 1 point per product
                { $multiply: [{ $size: "$reels" }, 3] }, // 3 points per reel
                {
                  $multiply: [
                    {
                      $size: {
                        $filter: {
                          input: "$discounts",
                          as: "discount",
                          cond: { $eq: ["$$discount.isActive", true] },
                        },
                      },
                    },
                    5,
                  ],
                }, // 5 points per active discount
                // Newer stores get boost (stores less than 30 days old)
                {
                  $cond: [
                    {
                      $gte: [
                        "$createdAt",
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    10,
                    0,
                  ],
                },
              ],
            },
          },
        },
        {
          $match: {
            $or: [
              { productCount: { $gt: 0 } },
              { reelCount: { $gt: 0 } },
              { discountCount: { $gt: 0 } },
            ],
          },
        },
        {
          $sort: { featuredScore: -1, createdAt: -1 },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            id: "$_id",
            logo: 1,
            coverImage: 1,
            name: 1,
            address: 1,
            phone_number: 1,
            description: 1,
            category: 1,
            productCount: 1,
            reelCount: 1,
            discountCount: 1,
            featuredScore: 1,
            createdAt: 1,
            // Include sample products
            sampleProducts: {
              $slice: ["$products", 3],
            },
            // Include sample reels
            sampleReels: {
              $slice: ["$reels", 2],
            },
          },
        },
      ]);

      // Format the response
      return featuredStores.map((store) => ({
        id: store._id?.toString() || store.id,
        logo: store.logo,
        coverImage: store.coverImage,
        name: {
          english: store.name?.english,
          kurdish: store.name?.kurdish,
        },
        category: store.category,
        productCount: store.productCount,
        reelCount: store.reelCount,
        discountCount: store.discountCount,
        hasActiveDeals: store.discountCount > 0,
        isNew:
          new Date(store.createdAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        sampleProducts: store.sampleProducts?.map((p: any) => ({
          id: p._id.toString(),
          name: p.name?.english,
          price: p.price,
          discount_price: p.discount_price,
          image: p.cover_image,
        })),
        sampleReels: store.sampleReels?.map((r: any) => ({
          id: r._id.toString(),
          title: r.title?.english,
          thumbnail: r.thumbnail_url,
        })),
      }));
    } catch (error) {
      console.error("Error in getFeaturedStores:", error);
      throw new Error(`Failed to fetch featured stores: ${error}`);
    }
  }

  /**
   * Fallback: Get nearby stores using text-based location matching
   * This uses the address field to approximate location
   */
  private static async getNearbyStoresText(
    lat: number,
    lng: number,
    radiusInKm: number,
    limit: number,
  ): Promise<any[]> {
    try {
      // This is a simplified version - in production, you'd want to use
      // a geocoding service to convert addresses to coordinates

      // For now, we'll return stores sorted by relevance
      // and add a flag that exact distance isn't available
      const stores = await Store.find({
        address: { $exists: true, $ne: "" },
      })
        .populate({
          path: "products",
          options: { limit: 3 },
          select: "name price cover_image",
        })
        .limit(limit)
        .lean();

      return stores.map((store) => ({
        id: store._id.toString(),
        logo: store.logo,
        coverImage: store.coverImage,
        name: {
          english: store.name?.english,
          kurdish: store.name?.kurdish,
        },
        address: store.address,
        phone_number: store.phone_number,
        category: store.category,
        distance: null, // No exact distance
        approximateLocation: true,
        productCount: store.products?.length || 0,
        sampleProducts: store.products?.slice(0, 3).map((p: any) => ({
          id: p._id.toString(),
          name: p.name?.english,
          price: p.price,
          image: p.cover_image,
        })),
      }));
    } catch (error) {
      console.error("Error in getNearbyStoresText:", error);
      throw new Error(`Failed to fetch nearby stores with text: ${error}`);
    }
  }

  /**
   * Get nearby stores using geospatial indexing (if you add location to schema)
   * First, add this to your Store schema:
   *
   * location: {
   *   type: { type: String, enum: ['Point'], default: 'Point' },
   *   coordinates: { type: [Number], required: true } // [longitude, latitude]
   * }
   *
   * And create index: storeSchema.index({ location: '2dsphere' });
   */
  private static async getNearbyStoresGeo(
    lat: number,
    lng: number,
    radiusInKm: number,
    limit: number,
  ): Promise<any[]> {
    try {
      const stores = await Store.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat],
            },
            distanceField: "distance",
            maxDistance: radiusInKm * 1000, // Convert km to meters
            spherical: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "store_id",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "discounts",
            localField: "_id",
            foreignField: "store_id",
            as: "discounts",
          },
        },
        {
          $addFields: {
            productCount: { $size: "$products" },
            discountCount: {
              $size: {
                $filter: {
                  input: "$discounts",
                  as: "discount",
                  cond: { $eq: ["$$discount.isActive", true] },
                },
              },
            },
            distanceInKm: { $divide: ["$distance", 1000] }, // Convert to km
          },
        },
        {
          $sort: { distance: 1 },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            id: "$_id",
            logo: 1,
            coverImage: 1,
            name: 1,
            address: 1,
            phone_number: 1,
            description: 1,
            category: 1,
            distance: "$distanceInKm",
            productCount: 1,
            discountCount: 1,
            location: 1,
          },
        },
      ]);

      return stores.map((store) => ({
        id: store._id?.toString() || store.id,
        logo: store.logo,
        coverImage: store.coverImage,
        name: {
          english: store.name?.english,
          kurdish: store.name?.kurdish,
        },
        address: store.address,
        phone_number: store.phone_number,
        category: store.category,
        distance: Math.round(store.distance * 10) / 10, // Round to 1 decimal
        productCount: store.productCount || 0,
        discountCount: store.discountCount || 0,
        hasDeals: (store.discountCount || 0) > 0,
        coordinates: store.location?.coordinates,
      }));
    } catch (error) {
      console.error("Error in getNearbyStoresGeo:", error);
      throw new Error(`Failed to fetch nearby stores with geo: ${error}`);
    }
  }

  /**
   * Get all categories with store and product counts
   * Returns categories sorted by popularity (most stores first)
   */
  static async getCategoriesWithCounts(): Promise<
    Array<{
      id: string;
      name: {
        english: string;
        kurdish: string;
      };
      icon?: string;
      storeCount: number;
      productCount: number;
      activeDiscountCount: number;
      popularStores?: Array<{
        id: string;
        name: string;
        logo: string;
      }>;
    }>
  > {
    try {
      // Define base categories with bilingual support
      const baseCategories = [
        {
          id: "electronics",
          english: "Electronics",
          kurdish: "ئەلیکترۆنی",
          icon: "📱",
        },
        {
          id: "fashion",
          english: "Fashion",
          kurdish: "جلوبەرگ",
          icon: "👕",
        },
        {
          id: "grocery",
          english: "Grocery",
          kurdish: "خۆراک",
          icon: "🛒",
        },
        {
          id: "books",
          english: "Books",
          kurdish: "کتێب",
          icon: "📚",
        },
        {
          id: "furniture",
          english: "Furniture",
          kurdish: "کەلوپەل",
          icon: "🪑",
        },
        {
          id: "beauty",
          english: "Beauty & Health",
          kurdish: "جوانی و تەندروستی",
          icon: "💄",
        },
        {
          id: "sports",
          english: "Sports",
          kurdish: "وەرزش",
          icon: "⚽",
        },
        {
          id: "toys",
          english: "Toys & Games",
          kurdish: "یاری و کایە",
          icon: "🎮",
        },
        {
          id: "jewelry",
          english: "Jewelry",
          kurdish: "زێڕ و گەوهەر",
          icon: "💍",
        },
        {
          id: "automotive",
          english: "Automotive",
          kurdish: "ئۆتۆمۆبیل",
          icon: "🚗",
        },
      ];

      // Get counts for each category
      const categoriesWithCounts = await Promise.all(
        baseCategories.map(async (category) => {
          // Count stores in this category
          const storeCount = await Store.countDocuments({
            category: { $regex: new RegExp(category.id, "i") },
          });

          // Count products in this category
          const productCount = await Product.countDocuments({
            category: { $regex: new RegExp(category.id, "i") },
          });

          // Count products with active discounts in this category
          const productsWithDiscounts = await Product.find({
            category: { $regex: new RegExp(category.id, "i") },
            discount_price: { $exists: true, $ne: null },
          }).countDocuments();

          // Get popular stores in this category (with most products)
          const popularStores = await Store.aggregate([
            {
              $match: {
                category: { $regex: new RegExp(category.id, "i") },
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "store_id",
                as: "storeProducts",
              },
            },
            {
              $addFields: {
                productCount: { $size: "$storeProducts" },
              },
            },
            {
              $sort: { productCount: -1 },
            },
            {
              $limit: 3,
            },
            {
              $project: {
                id: "$_id",
                name: "$name.english",
                logo: 1,
                productCount: 1,
              },
            },
          ]);

          return {
            id: category.id,
            name: {
              english: category.english,
              kurdish: category.kurdish,
            },
            icon: category.icon,
            storeCount,
            productCount,
            activeDiscountCount: productsWithDiscounts,
            popularStores: popularStores.map((store) => ({
              id: store.id.toString(),
              name: store.name,
              logo: store.logo,
              productCount: store.productCount,
            })),
          };
        }),
      );

      // Sort by store count (most popular first) and filter out empty categories
      return categoriesWithCounts
        .filter((cat) => cat.storeCount > 0 || cat.productCount > 0)
        .sort((a, b) => b.storeCount - a.storeCount);
    } catch (error) {
      console.error("Error in getCategoriesWithCounts:", error);
      throw new Error(`Failed to fetch categories with counts: ${error}`);
    }
  }

  /**
   * Get stores relevant to a category with ranking
   * @param category - Category to match against
   * @param limit - Max number of stores to return
   * @param minRelevance - Minimum relevance score (0-100)
   */
  static async getRelevantStoresByCategory(
    category: string,
    limit: number = 20,
    minRelevance: number = 0,
  ) {
    try {
      // 1. Find all products in this category
      const productsInCategory = await Product.find({
        category: { $regex: new RegExp(category, "i") },
      })
        .select("store_id price discount_price")
        .lean();

      // Group products by store
      const storeProductMap = new Map();
      productsInCategory.forEach((product) => {
        const storeId = product.store_id.toString();
        if (!storeProductMap.has(storeId)) {
          storeProductMap.set(storeId, {
            count: 0,
            withDiscount: 0,
            products: [],
          });
        }
        const storeData = storeProductMap.get(storeId);
        storeData.count++;
        if (product.discount_price) {
          storeData.withDiscount++;
        }
        storeData.products.push(product);
      });

      // Get all unique store IDs that have products in this category
      const storeIds = [...storeProductMap.keys()];

      // 2. Fetch all stores with their populated data
      const stores = await Store.find({
        $or: [
          { _id: { $in: storeIds } },
          { category: { $regex: new RegExp(category, "i") } },
        ],
      })
        .populate({
          path: "products",
          match: { category: { $regex: new RegExp(category, "i") } },
          // select:
          //   "name price cover_image discount_price category description quantity media specifications",
        })
        .populate({
          path: "reels",
          options: { sort: { createdAt: -1 }, limit: 5 },
          select: "title url duration thumbnail_url",
        })
        .populate({
          path: "discounts",
          match: { isActive: true },
          select: "amount product_id",
        })
        .lean();
      // console.log("stores: ", stores[0].products);

      // 3. Calculate relevance score for each store
      const scoredStores = stores.map((store) => {
        const storeProducts = storeProductMap.get(store._id.toString()) || {
          count: 0,
          withDiscount: 0,
          products: [],
        };

        // Calculate relevance factors
        const factors = {
          // Factor 1: Store category match (0-30 points)
          storeCategoryMatch:
            store.category &&
            store.category.toLowerCase().includes(category.toLowerCase())
              ? 30
              : 0,

          // Factor 2: Number of products in this category (0-30 points)
          productsInCategory: Math.min(storeProducts.count * 3, 30),

          // Factor 3: Products with active discounts (0-20 points)
          productsWithDiscount: Math.min(storeProducts.withDiscount * 5, 20),

          // Factor 4: Recent activity (based on product recency) (0-10 points)
          recentActivity: this.calculateRecentActivityScore(
            storeProducts.products,
          ),

          // Factor 5: Has relevant reels (0-10 points)
          reelCount: store.reels?.length
            ? Math.min(store.reels.length * 2, 10)
            : 0,
        };

        // Calculate total score (0-100)
        const totalScore = Object.values(factors).reduce(
          (sum, score) => sum + score,
          0,
        );

        return {
          store: this.formatStore(store),
          score: totalScore,
          factors,
          // Include matched products for this category
          matchedProducts: storeProducts.products,
        };
      });

      // 4. Filter by minimum relevance and sort by score
      const relevantStores = scoredStores
        .filter((item) => item.score >= minRelevance)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      // console.log(
      //   "stores:2 ",
      //   relevantStores.map((item) => ({
      //     ...item.store,
      //     relevanceScore: item.score,
      //     relevanceFactors: item.factors,
      //     matchedProductsCount: item.matchedProducts?.length || 0,
      //     hasActiveDiscounts: item.factors.productsWithDiscount > 0,
      //   }))[0].products,
      // );
      // 5. Return formatted response
      return {
        category,
        totalFound: relevantStores.length,
        stores: relevantStores.map((item) => ({
          ...item.store,
          relevanceScore: item.score,
          relevanceFactors: item.factors,
          matchedProductsCount: item.matchedProducts?.length || 0,
          hasActiveDiscounts: item.factors.productsWithDiscount > 0,
        })),
      };
    } catch (error) {
      console.error("Error in getRelevantStoresByCategory:", error);
      throw new Error(`Failed to fetch relevant stores: ${error}`);
    }
  }

  /**
   * Calculate recent activity score based on product creation dates
   */
  private static calculateRecentActivityScore(products: any[]): number {
    if (!products || products.length === 0) return 0;

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const recentProducts = products.filter(
      (p) => p.createdAt && new Date(p.createdAt).getTime() > thirtyDaysAgo,
    );

    return Math.min(recentProducts.length * 2, 10);
  }

  /**
   * Format store object (convert _id to id)
   */
  private static formatStore(store: any) {
    return {
      id: store._id.toString(),
      logo: store.logo,
      coverImage: store.coverImage,
      name: store.name,
      address: store.address,
      phone_number: store.phone_number,
      description: store.description,
      category: store.category,
      products: store.products?.map((p: any) => ({
        ...p,
        id: p._id.toString(),
      })),
      reels: store.reels?.map((r: any) => ({
        id: r._id.toString(),
        title: r.title,
        url: r.url,
        duration: r.duration,
        thumbnail_url: r.thumbnail_url,
      })),
      discounts: store.discounts?.map((d: any) => ({
        id: d._id.toString(),
        amount: d.amount,
        product_id: d.product_id,
      })),
      createdAt: store.createdAt,
    };
  }

  /**
   * Get stores by category with pagination (simple version)
   */
  static async getStoresByCategory(
    category: string,
    page: number = 1,
    limit: number = 20,
  ) {
    try {
      const skip = (page - 1) * limit;

      // Find stores that either have the category or have products in this category
      const productsInCategory = await Product.distinct("store_id", {
        category: { $regex: new RegExp(category, "i") },
      });

      const query = {
        $or: [
          { category: { $regex: new RegExp(category, "i") } },
          { _id: { $in: productsInCategory } },
        ],
      };

      const [stores, total] = await Promise.all([
        Store.find(query)
          .populate({
            path: "products",
            match: { category: { $regex: new RegExp(category, "i") } },
            select: "name price cover_image discount_price",
          })
          .populate("reels", "title url duration thumbnail_url")
          .populate("discounts", "amount product_id")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Store.countDocuments(query),
      ]);

      return {
        stores: stores.map((store) => this.formatStore(store)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to fetch stores by category: ${error}`);
    }
  }

  /**
   * Search stores by multiple criteria
   */
  static async searchStores({
    query,
    category,
    lat,
    lng,
    radius,
    hasDiscounts,
    minProducts,
    sortBy = "relevance",
    page = 1,
    limit = 20,
  }: {
    query?: string;
    category?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    hasDiscounts?: boolean;
    minProducts?: number;
    sortBy?: "relevance" | "newest" | "alphabetical" | "distance";
    page?: number;
    limit?: number;
  }) {
    try {
      const skip = (page - 1) * limit;

      // Build search filter
      const filter: any = {};

      if (query) {
        filter.$or = [
          { "name.english": { $regex: query, $options: "i" } },
          { "name.kurdish": { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
      }

      if (category) {
        filter.$or = [
          ...(filter.$or || []),
          { category: { $regex: new RegExp(category, "i") } },
        ];
      }

      // Get stores with counts
      const stores = await Store.find(filter)
        .populate({
          path: "products",
          select: "name price category discount_price",
        })
        .populate("discounts", "amount")
        .lean();

      // Filter and score stores
      let scoredStores = stores.map((store) => {
        let score = 0;
        const matchedProducts =
          store.products?.filter(
            (p: any) =>
              !category ||
              p.category?.toLowerCase().includes(category.toLowerCase()),
          ) || [];

        // Calculate score based on criteria
        if (category) {
          // Store category match
          if (store.category?.toLowerCase().includes(category.toLowerCase())) {
            score += 30;
          }
          // Products in category
          score += Math.min(matchedProducts.length * 3, 30);
        }

        if (hasDiscounts) {
          const hasActiveDiscounts = store.discounts?.length > 0;
          if (!hasActiveDiscounts) return null;
          score += 20;
        }

        if (minProducts && matchedProducts.length < minProducts) {
          return null;
        }

        return {
          store: this.formatStore(store),
          score,
          matchedProductsCount: matchedProducts.length,
        };
      });

      // Remove nulls and filter
      scoredStores = scoredStores.filter((s) => s !== null);

      // Sort
      if (sortBy === "relevance") {
        scoredStores.sort((a, b) => b!.score - a!.score);
      } else if (sortBy === "newest") {
        scoredStores.sort(
          (a, b) =>
            new Date(b!.store.createdAt).getTime() -
            new Date(a!.store.createdAt).getTime(),
        );
      } else if (sortBy === "alphabetical") {
        scoredStores.sort((a, b) =>
          a!.store.name.english.localeCompare(b!.store.name.english),
        );
      }

      // Paginate
      const paginatedStores = scoredStores.slice(skip, skip + limit);

      return {
        stores: paginatedStores.map((s) => ({
          ...s!.store,
          relevanceScore: s!.score,
          matchedProductsCount: s!.matchedProductsCount,
        })),
        total: scoredStores.length,
        page,
        totalPages: Math.ceil(scoredStores.length / limit),
      };
    } catch (error) {
      throw new Error(`Failed to search stores: ${error}`);
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
