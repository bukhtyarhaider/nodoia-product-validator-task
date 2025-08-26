import { Product } from "../types";

class MockDatabase {
  private products: Product[] = [];

  async insertProduct(product: Product): Promise<void> {
    this.products.push(product);
  }

  async insertProducts(products: Product[]): Promise<void> {
    this.products.push(...products);
  }

  async getAllProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProductBySku(sku: string): Promise<Product | null> {
    return this.products.find((p) => p.sku === sku) || null;
  }

  async clearProducts(): Promise<void> {
    this.products = [];
  }

  get count(): number {
    return this.products.length;
  }
}

export const mockDb = new MockDatabase();
