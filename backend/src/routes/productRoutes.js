const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Obtener todos los productos
router.get('/', productController.getAll);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', productController.getById);

// GET /api/products/category/:categoryId - Obtener productos por categoría
router.get('/category/:categoryId', productController.getByCategory);

// POST /api/products - Crear nuevo producto
router.post('/', productController.create);

// PUT /api/products/:id - Actualizar producto
router.put('/:id', productController.update);

// PATCH /api/products/:id/stock - Actualizar stock
router.patch('/:id/stock', productController.updateStock);

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', productController.delete);

module.exports = router;