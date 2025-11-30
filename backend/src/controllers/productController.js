const productService = require('../services/productService');

class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async getByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await productService.getProductsByCategory(categoryId);
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (quantity === undefined || quantity === null) {
        return res.status(400).json({
          success: false,
          message: 'Quantity is required'
        });
      }

      const product = await productService.updateProductStock(id, parseInt(quantity));
      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();