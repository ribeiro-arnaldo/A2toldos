const express = require('express');
const router = express.Router();
const orcamentoController = require('../controllers/orcamento.controller');
const { orcamentoRules } = require('../validators/orcamento.validator');

// As rotas POST e PUT usam o mesmo "validador"
router.post('/', orcamentoRules(), orcamentoController.create);
router.get('/', orcamentoController.listAll);
router.get('/:id', orcamentoController.findById);
router.put('/:id', orcamentoRules(), orcamentoController.update);
router.patch('/:id/status', orcamentoController.updateStatus);
router.delete('/:id', orcamentoController.delete);

module.exports = router;