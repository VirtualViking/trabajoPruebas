const categoryService = require('../services/categoryService');

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();