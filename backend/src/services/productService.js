const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductService {
  async getAllProducts() {
    return await Product.findAll();
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    return product;
  }

  async getProductsByCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return await Product.findByCategory(categoryId);
  }

  async createProduct(data) {
    this.validateProductData(data);

    if (data.category_id) {
      const category = await Category.findById(data.category_id);
      if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        throw error;
      }
    }

    return await Product.create({
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      price: parseFloat(data.price),
      stock: parseInt(data.stock) || 0,
      category_id: data.category_id || null
    });
  }

  async updateProduct(id, data) {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    this.validateProductData(data);

    if (data.category_id) {
      const category = await Category.findById(data.category_id);
      if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        throw error;
      }
    }

    return await Product.update(id, {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      price: parseFloat(data.price),
      stock: parseInt(data.stock) || 0,
      category_id: data.category_id || null
    });
  }

  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    return await Product.delete(id);
  }

  async updateProductStock(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      const error = new Error('Insufficient stock');
      error.status = 400;
      throw error;
    }

    return await Product.updateStock(id, quantity);
  }

  validateProductData(data) {
    if (!data.name || data.name.trim() === '') {
      const error = new Error('Product name is required');
      error.status = 400;
      throw error;
    }

    if (data.price === undefined || data.price === null) {
      const error = new Error('Product price is required');
      error.status = 400;
      throw error;
    }

    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      const error = new Error('Product price must be a positive number');
      error.status = 400;
      throw error;
    }

    if (data.stock !== undefined) {
      const stock = parseInt(data.stock);
      if (isNaN(stock) || stock < 0) {
        const error = new Error('Product stock must be a non-negative integer');
        error.status = 400;
        throw error;
      }
    }
  }
}

module.exports = new ProductService();