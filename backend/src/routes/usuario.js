const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/permissions.middleware.js');


router.use(authMiddleware);

// Apenas ADM_FULL pode acessar estas rotas
router.get('/', checkPermission(['ADM_FULL']), usuarioController.listAll);
router.get('/:id', checkPermission(['ADM_FULL']), usuarioController.findById);
router.put('/:id', checkPermission(['ADM_FULL']), usuarioController.update);
router.delete('/:id', checkPermission(['ADM_FULL']), usuarioController.delete);

module.exports = router;