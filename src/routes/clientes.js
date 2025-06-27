const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const { createClienteRules, updateClienteRules } = require('../validators/cliente.validator.js');


router.use(authMiddleware);


router.post('/', createClienteRules(), clienteController.create);
router.put('/:id', updateClienteRules(), clienteController.update);


router.get('/', clienteController.listAll);
router.get('/:id', clienteController.findById);
router.delete('/:id', clienteController.delete);

module.exports = router;