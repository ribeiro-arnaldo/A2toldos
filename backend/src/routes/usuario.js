const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');

// Todas as rotas de gerenciamento de usuários precisam de autenticação
router.use(authMiddleware);

// Definimos as rotas para o CRUD de Usuários, usando a variável correta
router.get('/', usuarioController.listAll);
router.get('/:id', usuarioController.findById);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;