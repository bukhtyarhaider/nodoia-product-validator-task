import * as XLSX from "xlsx";
import csv from "csv-parser";
import { Readable } from "stream";
import { Product, InvalidProduct } from "./types";
import { ProductValidator } from "./validators";

export class FileProcessor {
  static async processCSV(
    buffer: Buffer
  ): Promise<{ validProducts: Product[]; invalidProducts: InvalidProduct[] }> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(buffer.toString());

      stream
        .pipe((csv as any)())
        .on("data", (data: any) => results.push(data))
        .on("end", async () => {
          try {
            const processed = await this.validateAndSanitizeProducts(results);
            resolve(processed);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  }

  static async processXLSX(
    buffer: Buffer
  ): Promise<{ validProducts: Product[]; invalidProducts: InvalidProduct[] }> {
    try {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      return await this.validateAndSanitizeProducts(jsonData);
    } catch (error) {
      throw new Error(
        `Failed to process XLSX file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private static async validateAndSanitizeProducts(
    data: any[]
  ): Promise<{ validProducts: Product[]; invalidProducts: InvalidProduct[] }> {
    const validProducts: Product[] = [];
    const invalidProducts: InvalidProduct[] = [];
    const existingSkus = new Set<string>();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 1; // 1-based indexing for user-friendly error messages

      try {
        const validation = await ProductValidator.validateProduct(
          row,
          existingSkus
        );

        if (validation.isValid) {
          const sanitizedProduct = ProductValidator.sanitizeProduct(row);
          validProducts.push(sanitizedProduct);
          existingSkus.add(sanitizedProduct.sku);
        } else {
          invalidProducts.push({
            name: row.name || "Unknown",
            reason: validation.errors.join("; "),
            rowNumber,
          });
        }
      } catch (error) {
        invalidProducts.push({
          name: row.name || "Unknown",
          reason: `Processing error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          rowNumber,
        });
      }
    }

    return { validProducts, invalidProducts };
  }
}
