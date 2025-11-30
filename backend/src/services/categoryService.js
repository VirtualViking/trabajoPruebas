const Category = require('../models/Category');

class CategoryService {
  async getAllCategories() {
    return await Category.findAll();
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    if (!data.name || data.name.trim() === '') {
      const error = new Error('Category name is required');
      error.status = 400;
      throw error;
    }

    const existingCategory = await Category.findByName(data.name.trim());
    if (existingCategory) {
      const error = new Error('Category with this name already exists');
      error.status = 409;
      throw error;
    }

    return await Category.create({ name: data.name.trim() });
  }

  async updateCategory(id, data) {
    if (!data.name || data.name.trim() === '') {
      const error = new Error('Category name is required');
      error.status = 400;
      throw error;
    }

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

    const duplicateCategory = await Category.findByName(data.name.trim());
    if (duplicateCategory && duplicateCategory.id !== parseInt(id)) {
      const error = new Error('Category with this name already exists');
      error.status = 409;
      throw error;
    }

    return await Category.update(id, { name: data.name.trim() });
  }

  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

    const hasProducts = await Category.hasProducts(id);
    if (hasProducts) {
      const error = new Error('Cannot delete category with associated products');
      error.status = 400;
      throw error;
    }

    return await Category.delete(id);
  }
}

module.exports = new CategoryService();