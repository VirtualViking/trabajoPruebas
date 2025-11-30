const request = require('supertest');
const { app } = require('../../src/app');
const pool = require('../../src/config/database');

describe('API Integration Tests', () => {
  
  beforeAll(async () => {
    // Crear tablas de prueba
    const client = await pool.connect();
    try {
      await client.query('DROP TABLE IF EXISTS products CASCADE');
      await client.query('DROP TABLE IF EXISTS categories CASCADE');
      
      await client.query(`
        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await client.query(`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
          stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } finally {
      client.release();
    }
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada test
    const client = await pool.connect();
    try {
      await client.query('TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE');
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  // Test 1: Crear categoría y verificar en base de datos
  describe('POST /api/categories', () => {
    test('should create a category and persist in database', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Electronics');
      expect(response.body.data.id).toBeDefined();

      // Verificar en base de datos
      const dbResult = await pool.query('SELECT * FROM categories WHERE name = $1', ['Electronics']);
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].name).toBe('Electronics');
    });
  });

  // Test 2: Crear producto con categoría y verificar relación
  describe('POST /api/products', () => {
    test('should create a product with category relationship', async () => {
      // Primero crear categoría
      const categoryRes = await request(app)
        .post('/api/categories')
        .send({ name: 'Computers' });
      
      const categoryId = categoryRes.body.data.id;

      // Crear producto
      const productRes = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop Dell',
          description: 'High performance laptop',
          price: 1299.99,
          stock: 15,
          category_id: categoryId
        })
        .expect(201);

      expect(productRes.body.success).toBe(true);
      expect(productRes.body.data.name).toBe('Laptop Dell');
      expect(productRes.body.data.category_id).toBe(categoryId);

      // Verificar relación en base de datos
      const dbResult = await pool.query(
        'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
        [productRes.body.data.id]
      );
      expect(dbResult.rows[0].category_name).toBe('Computers');
    });
  });

  // Test 3: Listar productos con categorías
  describe('GET /api/products', () => {
    test('should return all products with category names', async () => {
      // Crear categoría y producto
      const categoryRes = await request(app)
        .post('/api/categories')
        .send({ name: 'Phones' });

      await request(app)
        .post('/api/products')
        .send({
          name: 'iPhone 15',
          price: 999,
          stock: 20,
          category_id: categoryRes.body.data.id
        });

      // Listar productos
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('iPhone 15');
      expect(response.body.data[0].category_name).toBe('Phones');
    });
  });

  // Test 4: Actualizar producto y verificar cambios
  describe('PUT /api/products/:id', () => {
    test('should update product and reflect in database', async () => {
      // Crear producto
      const createRes = await request(app)
        .post('/api/products')
        .send({
          name: 'Original Name',
          price: 100,
          stock: 5
        });

      const productId = createRes.body.data.id;

      // Actualizar producto
      const updateRes = await request(app)
        .put(`/api/products/${productId}`)
        .send({
          name: 'Updated Name',
          price: 150,
          stock: 10
        })
        .expect(200);

      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.name).toBe('Updated Name');
      expect(parseFloat(updateRes.body.data.price)).toBe(150);

      // Verificar en base de datos
      const dbResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
      expect(dbResult.rows[0].name).toBe('Updated Name');
      expect(parseFloat(dbResult.rows[0].price)).toBe(150);
    });
  });

  // Test 5: Eliminar producto y verificar eliminación
  describe('DELETE /api/products/:id', () => {
    test('should delete product from database', async () => {
      // Crear producto
      const createRes = await request(app)
        .post('/api/products')
        .send({
          name: 'To Delete',
          price: 50,
          stock: 1
        });

      const productId = createRes.body.data.id;

      // Verificar que existe
      let dbResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
      expect(dbResult.rows.length).toBe(1);

      // Eliminar producto
      await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      // Verificar que ya no existe
      dbResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
      expect(dbResult.rows.length).toBe(0);
    });
  });
});