const pool = require('../config/database');

class Product {
  static async findAll() {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByCategory(categoryId) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = $1 
      ORDER BY p.id ASC
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  }

  static async create(data) {
    const { name, description, price, stock, category_id } = data;
    const query = `
      INSERT INTO products (name, description, price, stock, category_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const result = await pool.query(query, [
      name,
      description || null,
      price,
      stock || 0,
      category_id || null
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, description, price, stock, category_id } = data;
    const query = `
      UPDATE products 
      SET name = $1, 
          description = $2, 
          price = $3, 
          stock = $4, 
          category_id = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 
      RETURNING *
    `;
    const result = await pool.query(query, [
      name,
      description || null,
      price,
      stock,
      category_id || null,
      id
    ]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateStock(id, quantity) {
    const query = `
      UPDATE products 
      SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND stock + $1 >= 0
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, id]);
    return result.rows[0] || null;
  }
}

module.exports = Product;