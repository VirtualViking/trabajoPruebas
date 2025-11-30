const { Pool } = require('pg');

// Configuración de base de datos para tests
const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'inventory_test_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const setupTestDatabase = async () => {
  const client = await testPool.connect();
  try {
    await client.query('BEGIN');
    
    // Eliminar tablas si existen
    await client.query('DROP TABLE IF EXISTS products CASCADE');
    await client.query('DROP TABLE IF EXISTS categories CASCADE');
    
    // Crear tablas
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
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const cleanupTestDatabase = async () => {
  const client = await testPool.connect();
  try {
    await client.query('TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE');
  } finally {
    client.release();
  }
};

const closeTestDatabase = async () => {
  await testPool.end();
};

module.exports = {
  testPool,
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase
};