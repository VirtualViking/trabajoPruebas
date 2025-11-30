const categoryService = require('../../src/services/categoryService');
const Category = require('../../src/models/Category');

// Mock del modelo Category
jest.mock('../../src/models/Category');

describe('CategoryService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    test('should create a category successfully', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      Category.findByName.mockResolvedValue(null);
      Category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory({ name: 'Electronics' });

      expect(Category.findByName).toHaveBeenCalledWith('Electronics');
      expect(Category.create).toHaveBeenCalledWith({ name: 'Electronics' });
      expect(result).toEqual(mockCategory);
    });

    test('should throw error if category name is empty', async () => {
      await expect(categoryService.createCategory({ name: '' }))
        .rejects.toThrow('Category name is required');
    });

    test('should throw error if category already exists', async () => {
      Category.findByName.mockResolvedValue({ id: 1, name: 'Electronics' });

      await expect(categoryService.createCategory({ name: 'Electronics' }))
        .rejects.toThrow('Category with this name already exists');
    });
  });

  describe('deleteCategory', () => {
    test('should delete category without products', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      Category.findById.mockResolvedValue(mockCategory);
      Category.hasProducts.mockResolvedValue(false);
      Category.delete.mockResolvedValue(mockCategory);

      const result = await categoryService.deleteCategory(1);

      expect(Category.hasProducts).toHaveBeenCalledWith(1);
      expect(Category.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });

    test('should throw error if category has products', async () => {
      Category.findById.mockResolvedValue({ id: 1, name: 'Electronics' });
      Category.hasProducts.mockResolvedValue(true);

      await expect(categoryService.deleteCategory(1))
        .rejects.toThrow('Cannot delete category with associated products');
    });
  });
});