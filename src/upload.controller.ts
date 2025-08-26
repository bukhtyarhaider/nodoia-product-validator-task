import { Request, Response } from "express";
import { FileProcessor } from "./file-processor.service";
import { mockDb } from "./database";
import { UploadResponse } from "./types";

export class UploadController {
  static async uploadProducts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
        return;
      }

      const fileExtension = req.file.originalname
        .toLowerCase()
        .substring(req.file.originalname.lastIndexOf("."));

      let processedData;

      if (fileExtension === ".csv") {
        processedData = await FileProcessor.processCSV(req.file.buffer);
      } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
        processedData = await FileProcessor.processXLSX(req.file.buffer);
      } else {
        res.status(400).json({
          success: false,
          error: "Unsupported file format",
        });
        return;
      }

      const { validProducts, invalidProducts } = processedData;

      if (validProducts.length > 0) {
        await mockDb.insertProducts(validProducts);
      }

      const response: UploadResponse = {
        success: true,
        inserted: validProducts.length,
        invalid: invalidProducts.length,
        invalidProducts,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await mockDb.getAllProducts();
      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve products",
      });
    }
  }

  static async clearProducts(req: Request, res: Response): Promise<void> {
    try {
      await mockDb.clearProducts();
      res.status(200).json({
        success: true,
        message: "All products cleared",
      });
    } catch (error) {
      console.error("Clear products error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to clear products",
      });
    }
  }
}
