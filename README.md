# CSV/XLSX Bulk Upload API

A robust TypeScript Node.js API for bulk uploading products via CSV or XLSX files with comprehensive validation.

## Features

- ✅ CSV and XLSX file support
- ✅ Type-safe TypeScript implementation
- ✅ Comprehensive validation (name, price ≥ 0, unique SKU)
- ✅ Invalid row logging with detailed error messages
- ✅ Mock database with in-memory storage
- ✅ Security middleware (Helmet, CORS)
- ✅ File size limits (10MB)
- ✅ Error handling and logging

## Installation

```bash
npm install
npm run build
npm start
```

For development:

```bash
npm run dev
```

## API Endpoints

### POST /api/upload

Upload CSV or XLSX file with products.

**Request:**

- Content-Type: `multipart/form-data`
- Field name: `file`
- Supported formats: `.csv`, `.xlsx`, `.xls`

**Response:**

```json
{
  "success": true,
  "inserted": 15,
  "invalid": 3,
  "invalidProducts": [
    {
      "name": "Car 1",
      "reason": "Price must be greater than or equal to 0",
      "rowNumber": 2
    }
  ]
}
```

### GET /api/products

Retrieve all products from the database.

### DELETE /api/products

Clear all products from the database.

### GET /health

Health check endpoint.

## File Format

Your CSV/XLSX files should have these columns:

- `name` (required, string)
- `price` (required, number ≥ 0)
- `sku` (required, unique string)

## Example CSV:

```csv
name,price,sku
"Product 1",29.99,"SKU001"
"Product 2",45.50,"SKU002"
```

## Validation Rules

1. **Name**: Required, non-empty string
2. **Price**: Required, must be a number ≥ 0
3. **SKU**: Required, unique across database and upload batch

Invalid rows are logged with detailed error messages and row numbers.

## Error Handling

- File type validation
- File size limits (10MB)
- Comprehensive input validation
- Database constraint checking
- Detailed error responses

## Testing

Use tools like Postman or curl to test:

```bash
curl -X POST \
  -F "file=@products.csv" \
  http://localhost:3000/api/upload
```
