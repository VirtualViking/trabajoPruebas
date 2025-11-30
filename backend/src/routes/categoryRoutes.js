const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - Obtener todas las categorías
router.get('/', categoryController.getAll);

// GET /api/categories/:id - Obtener categoría por ID
router.get('/:id', categoryController.getById);

// POST /api/categories - Crear nueva categoría
router.post('/', categoryController.create);

// PUT /api/categories/:id - Actualizar categoría
router.put('/:id', categoryController.update);

// DELETE /api/categories/:id - Eliminar categoría
router.delete('/:id', categoryController.delete);

module.exports = router;