import { Product, ValidationResult } from "../types";
import { mockDb } from "../database";

export class ProductValidator {
  static async validateProduct(
    data: any,
    existingSkus: Set<string>
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate name
    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim() === ""
    ) {
      errors.push("Name is required and must be a non-empty string");
    }

    // Validate price
    if (data.price === undefined || data.price === null) {
      errors.push("Price is required");
    } else {
      const price = parseFloat(data.price);
      if (isNaN(price)) {
        errors.push("Price must be a valid number");
      } else if (price < 0) {
        errors.push("Price must be greater than or equal to 0");
      }
    }

    // Validate SKU
    if (!data.sku || typeof data.sku !== "string" || data.sku.trim() === "") {
      errors.push("SKU is required and must be a non-empty string");
    } else {
      const sku = data.sku.trim();

      // Check if SKU already exists in database
      const existingProduct = await mockDb.getProductBySku(sku);
      if (existingProduct) {
        errors.push("SKU already exists in database");
      }

      // Check if SKU is duplicate in current batch
      if (existingSkus.has(sku)) {
        errors.push("Duplicate SKU in upload batch");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static sanitizeProduct(data: any): Product {
    return {
      name: String(data.name).trim(),
      price: parseFloat(data.price),
      sku: String(data.sku).trim(),
    };
  }
}
