const orcamentoService = require('../services/orcamento.service');
const { validationResult } = require('express-validator');

class OrcamentoController {

  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
    const resultado = await orcamentoService.create(req.body);
      res.status(201).json({ mensagem: 'Orçamento cadastrado com sucesso!', ...resultado });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const resultado = await orcamentoService.update(req.params.id, req.body);
      res.status(200).json({ mensagem: 'Orçamento atualizado com sucesso!', ...resultado });
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }

  async listAll(req, res) {
    try {
      const orcamentos = await orcamentoService.listAll();
      res.status(200).json(orcamentos);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  async findById(req, res) {
    try {
      const orcamento = await orcamentoService.findById(req.params.id);
      res.status(200).json(orcamento);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const resultado = await orcamentoService.updateStatus(req.params.id, req.body.status);
      res.status(200).json(resultado);
    } catch (error)
    {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      const resultado = await orcamentoService.delete(req.params.id);
      res.status(200).json(resultado);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new OrcamentoController();