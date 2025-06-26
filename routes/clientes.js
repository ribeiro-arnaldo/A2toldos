const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { cpf } = require('cpf-cnpj-validator');
const validator = require('validator');

// Rota POST: Cadastrar um novo cliente
router.post('/', (req, res) => {
  const { nome, email, telefone, cpf: cpfRequest, endereco, data_nascimento } = req.body;

  // --- Bloco de Validações ---
  if (!nome || !email || !telefone || !cpfRequest || !endereco || !data_nascimento) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) {
    return res.status(400).json({ erro: 'O nome deve conter apenas letras e espaços.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ erro: 'O e-mail informado é inválido.' });
  }
  if (!/^[0-9\s()-]+$/.test(telefone)) {
    return res.status(400).json({ erro: 'O telefone deve conter apenas números, parênteses, traços e espaços.' });
  }
  if (!cpf.isValid(cpfRequest)) {
    return res.status(400).json({ erro: 'O CPF informado é inválido.' });
  }
  if (endereco && /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.\-ºª/']/.test(endereco)) {
    return res.status(400).json({ erro: 'O endereço contém caracteres inválidos.' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data_nascimento)) {
    return res.status(400).json({ erro: 'A data de nascimento deve estar no formato AAAA-MM-DD.' });
  }

  // Nova Validação: Data de Nascimento não pode ser no futuro
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
  const birthDate = new Date(data_nascimento);
  if (birthDate > today) {
    return res.status(400).json({ erro: 'A data de nascimento não pode ser uma data futura.' });
  }
  // --- Fim do Bloco de Validações ---
  
  const formatedCpf = cpf.strip(cpfRequest);

  const checkCpfQuery = 'SELECT id FROM clientes WHERE cpf = ?';
  db.get(checkCpfQuery, [formatedCpf], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao interagir com o banco de dados.' });
    }
    if (row) {
      return res.status(400).json({ erro: 'Este CPF já está cadastrado.' });
    }

    const insertQuery = `
      INSERT INTO clientes (nome, email, telefone, cpf, endereco, data_nascimento)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(insertQuery, [nome, email, telefone, formatedCpf, endereco, data_nascimento], function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({ id: this.lastID, nome, email, telefone, cpf: formatedCpf, endereco, data_nascimento });
    });
  });
});

// Rota GET: Listar todos os clientes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM clientes ORDER BY nome';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Rota GET: Buscar um único cliente pelo ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM clientes WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }
    res.json(row);
  });
});

// Rota PUT: Atualizar um cliente existente pelo ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cpf: cpfRequest, endereco, data_nascimento } = req.body;

    // --- Bloco de Validações ---
    if (!nome || !email || !telefone || !cpfRequest || !endereco || !data_nascimento) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios para atualização.' });
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) {
      return res.status(400).json({ erro: 'O nome deve conter apenas letras e espaços.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ erro: 'O e-mail informado é inválido.' });
    }
    if (!/^[0-9\s()-]+$/.test(telefone)) {
      return res.status(400).json({ erro: 'O telefone deve conter apenas números, parênteses, traços e espaços.' });
    }
    if (!cpf.isValid(cpfRequest)) {
      return res.status(400).json({ erro: 'O CPF informado para atualização é inválido.' });
    }
    if (endereco && /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.\-ºª/']/.test(endereco)) {
      return res.status(400).json({ erro: 'O endereço contém caracteres inválidos.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data_nascimento)) {
      return res.status(400).json({ erro: 'A data de nascimento deve estar no formato AAAA-MM-DD.' });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthDate = new Date(data_nascimento);
    if (birthDate > today) {
      return res.status(400).json({ erro: 'A data de nascimento não pode ser uma data futura.' });
    }
    // --- Fim do Bloco de Validações ---

    const formatedCpf = cpf.strip(cpfRequest);

    const query = `
        UPDATE clientes 
        SET nome = ?, email = ?, telefone = ?, cpf = ?, endereco = ?, data_nascimento = ?
        WHERE id = ?
    `;
    db.run(query, [nome, email, telefone, formatedCpf, endereco, data_nascimento, id], function(err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado para atualização.' });
        }
        res.json({ mensagem: 'Cliente atualizado com sucesso!', id, nome, email, telefone, cpf: formatedCpf, endereco, data_nascimento });
    });
});

// Rota DELETE: Excluir um cliente pelo ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = ?';
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado para exclusão.' });
        }
        res.status(200).json({ mensagem: 'Cliente excluído com sucesso!' });
    });
});

module.exports = router;