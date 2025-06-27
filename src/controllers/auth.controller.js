const authService = require('../services/auth.service');

class AuthController {

  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ mensagem: 'Usuário registrado com sucesso!', user });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async login(req, res) {
    try {
      const { token } = await authService.login(req.body);
      res.status(200).json({ mensagem: 'Login bem-sucedido!', token });
    } catch (error) {
      res.status(401).json({ erro: error.message }); // 401 Unauthorized
    }
  }
}

module.exports = new AuthController();