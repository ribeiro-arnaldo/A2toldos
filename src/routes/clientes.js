const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

const { createClienteRules, updateClienteRules } = require('../validators/cliente.validator');

router.post('/', createClienteRules(), clienteController.create);

router.get('/', clienteController.listAll);
router.get('/:id', clienteController.findById);

router.put('/:id', updateClienteRules(), clienteController.update);

router.delete('/:id', clienteController.delete);

module.exports = router;