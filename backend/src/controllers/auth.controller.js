const authService = require('../services/auth.service.js');

class AuthController {

    async register(req, res) {
        try {
            const novoUsuario = await authService.register(req.body);
            res.status(201).json(novoUsuario);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async login(req, res) {
        try {
            const { token } = await authService.login(req.body);
            res.status(200).json({ token });
        } catch (error) {            
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new AuthController();