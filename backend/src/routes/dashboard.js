const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Protege a rota do dashboard exigindo que o usuário esteja logado
router.use(authMiddleware);

// Rota principal que entrega todos os dados do painel
router.get('/', dashboardController.getDashboardData);

module.exports = router;