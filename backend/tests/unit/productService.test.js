const productService = require('../../src/services/productService');
const Product = require('../../src/models/Product');
const Category = require('../../src/models/Category');

// Mock de los modelos
jest.mock('../../src/models/Product');
jest.mock('../../src/models/Category');

describe('ProductService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('should create a product successfully', async () => {
      const mockProduct = {
        id: 1,
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 999.99,
        stock: 10,
        category_id: 1
      };
      Category.findById.mockResolvedValue({ id: 1, name: 'Electronics' });
      Product.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 999.99,
        stock: 10,
        category_id: 1
      });

      expect(Category.findById).toHaveBeenCalledWith(1);
      expect(Product.create).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    test('should throw error if product name is empty', async () => {
      await expect(productService.createProduct({
        name: '',
        price: 100,
        stock: 5
      })).rejects.toThrow('Product name is required');
    });
  });

  describe('validateProductData', () => {
    test('should throw error if price is negative', async () => {
      await expect(productService.createProduct({
        name: 'Test Product',
        price: -10,
        stock: 5
      })).rejects.toThrow('Product price must be a positive number');
    });

    test('should throw error if stock is negative', async () => {
      await expect(productService.createProduct({
        name: 'Test Product',
        price: 100,
        stock: -5
      })).rejects.toThrow('Product stock must be a non-negative integer');
    });
  });

  describe('updateProductStock', () => {
    test('should throw error if insufficient stock', async () => {
      Product.findById.mockResolvedValue({
        id: 1,
        name: 'Laptop',
        stock: 5
      });

      await expect(productService.updateProductStock(1, -10))
        .rejects.toThrow('Insufficient stock');
    });
  });
});