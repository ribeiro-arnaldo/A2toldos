const clienteService = require('../services/cliente.service');
const { validationResult } = require('express-validator');

class ClienteController {
//POST
  async create(req, res) {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Se houver erros, retorna 400 com a lista de erros.
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Se não há erros, prossegue normalmente para o service.
      const novoCliente = await clienteService.create(req.body);
      res.status(201).json(novoCliente);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }
//GET
  async listAll(req, res) {
    try {
      const clientes = await clienteService.listAll();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
//GET/id
  async findById(req, res) {
    try {
      const cliente = await clienteService.findById(req.params.id);
      res.status(200).json(cliente);
    } catch (error) {
      if (error.message === 'Cliente não encontrado.') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }
//PUT
  async update(req, res) {
    // MUDANÇA 3: Adicionamos a mesma verificação na rota de atualização.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const resultado = await clienteService.update(req.params.id, req.body);
      res.status(200).json(resultado);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }
//DELETE
  async delete(req, res) {
    try {
      const resultado = await clienteService.delete(req.params.id);
      res.status(200).json(resultado);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new ClienteController();