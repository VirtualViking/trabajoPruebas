const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { categoryRoutes, productRoutes } = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares');
const { createTables } = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Rutas de la API
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Ruta para servir el frontend en cualquier otra ruta
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

// Manejo de rutas no encontradas (solo para /api/*)
app.use('/api/*', notFoundHandler);

// Manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Inicializar tablas de la base de datos
    await createTables();
    console.log('Database initialized successfully');

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Frontend available at http://localhost:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Solo iniciar si se ejecuta directamente (no en tests)
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };