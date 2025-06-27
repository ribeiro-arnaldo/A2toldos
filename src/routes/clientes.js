const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.post('/', clienteController.create);
router.get('/', clienteController.listAll);
router.get('/:id', clienteController.findById);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);

module.exports = router;