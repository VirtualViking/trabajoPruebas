const pool = require('./database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Crear tabla categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla products
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
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

    // Crear índice para búsquedas por categoría
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category 
      ON products(category_id)
    `);

    await client.query('COMMIT');
    console.log('Tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const dropTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS products CASCADE');
    await client.query('DROP TABLE IF EXISTS categories CASCADE');
    await client.query('COMMIT');
    console.log('Tables dropped successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const resetTables = async () => {
  await dropTables();
  await createTables();
};

module.exports = { createTables, dropTables, resetTables };

// Ejecutar si se llama directamente
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}