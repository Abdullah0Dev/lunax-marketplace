import { Request, Response } from "express";
import { ProductService } from "../services";

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching  all products:", error);
      if (error instanceof Error && error.message === "Invalid store ID") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
  static async getByStore(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      const products = await ProductService.getProductsByStore(
        storeId as string,
      );
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error instanceof Error && error.message === "Invalid store ID") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id as string);
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid product ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Product not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof Error) {
        if (
          error.message === "Missing required fields" ||
          error.message === "Store not found" ||
          error.message === "Invalid store ID"
        ) {
          return res.status(400).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(
        id as string,
        req.body,
      );
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid product ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Product not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id as string);
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid product ID") {
          return res.status(400).json({ error: error.message });
        }
        if (error.message === "Product not found") {
          return res.status(404).json({ error: error.message });
        }
      }
      res.status(500).json({ error: "Failed to delete product" });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { q, category } = req.query;
      const products = await ProductService.searchProducts(
        (q as string) || "",
        category as string,
      );
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  }
}
