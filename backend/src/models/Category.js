const pool = require('../config/database');

class Category {
  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByName(name) {
    const query = 'SELECT * FROM categories WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0] || null;
  }

  static async create(data) {
    const { name } = data;
    const query = `
      INSERT INTO categories (name) 
      VALUES ($1) 
      RETURNING *
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name } = data;
    const query = `
      UPDATE categories 
      SET name = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [name, id]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async hasProducts(id) {
    const query = 'SELECT COUNT(*) FROM products WHERE category_id = $1';
    const result = await pool.query(query, [id]);
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = Category;