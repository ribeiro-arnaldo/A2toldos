const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 👉 Rota para cadastrar cliente
router.post('/', (req, res) => {
  const { nome, email, telefone, cpf, endereco } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ erro: 'Nome e CPF são obrigatórios.' });
  }

  const query = `
    INSERT INTO clientes (nome, email, telefone, cpf, endereco)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [nome, email, telefone, cpf, endereco], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.status(201).json({ id: this.lastID, nome, email, telefone, cpf, endereco });
  });
});

// 👉 Rota para listar todos os clientes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM clientes';

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.json(rows);
  });
});

module.exports = router;
