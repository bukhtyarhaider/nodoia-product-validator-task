export interface Product {
  name: string;
  price: number;
  sku: string;
}

export interface InvalidProduct {
  name: string;
  reason: string;
  rowNumber?: number;
}

export interface UploadResponse {
  success: boolean;
  inserted: number;
  invalid: number;
  invalidProducts: InvalidProduct[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
