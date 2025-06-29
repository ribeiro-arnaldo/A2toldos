const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota para registrar um novo usuário do sistema
router.post('/register', authController.register);

// Rota para fazer login e obter um token
router.post('/login', authController.login);

module.exports = router;