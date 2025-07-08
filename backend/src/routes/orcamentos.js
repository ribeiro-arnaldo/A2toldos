const express = require('express');
const router = express.Router();
const orcamentoController = require('../controllers/orcamento.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/permissions.middleware.js');
const { orcamentoRules } = require('../validators/orcamento.validator.js'); 

router.use(authMiddleware);

router.post('/', orcamentoRules(), orcamentoController.create);
router.put('/:id', orcamentoRules(), orcamentoController.update);

router.get('/', orcamentoController.listAll);
router.get('/:id', orcamentoController.findById);
router.patch('/:id/status', orcamentoController.updateStatus);


router.delete('/:id', checkPermission(['ADM_FULL', 'ADM_VENDAS']), orcamentoController.delete);

module.exports = router;