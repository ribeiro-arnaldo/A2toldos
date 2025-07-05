const usuarioService = require('../services/usuario.service.js');

class UsuarioController {
    
    async listAll(req, res) {
        try {           
            const usuarios = await usuarioService.listAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async findById(req, res) {
        try {
            const usuario = await usuarioService.findById(req.params.id);
            res.status(200).json(usuario);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    async update(req, res) {
        try {
            const usuarioAtualizado = await usuarioService.update(req.params.id, req.body);
            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async delete(req, res) {
        try {
            const resultado = await usuarioService.delete(req.params.id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new UsuarioController();