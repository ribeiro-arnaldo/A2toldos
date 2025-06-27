const clienteService = require('../services/cliente.service');

class ClienteController {

  // POST /clientes
  async create(req, res) {
    try {
      const novoCliente = await clienteService.create(req.body);
      res.status(201).json(novoCliente);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  // GET /clientes
  async listAll(req, res) {
    try {
      const clientes = await clienteService.listAll();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET /clientes/:id
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


  // PUT /clientes/:id
  async update(req, res) {
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

  // DELETE /clientes/:id
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