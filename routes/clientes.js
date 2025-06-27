const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { cpf, cnpj } = require('cpf-cnpj-validator');
const validator = require('validator');

// Rota POST: Cadastrar um novo cliente
router.post('/', (req, res) => {
  const { nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento } = req.body;

  if (!nome || !email || !telefone || !tipo_pessoa || !documento || !endereco || !data_nascimento) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  let formatedDocument = '';
  if (tipo_pessoa.toUpperCase() === 'FISICA') {
    if (!cpf.isValid(documento)) {
      return res.status(400).json({ erro: 'O CPF informado é inválido.' });
    }
    formatedDocument = cpf.strip(documento);
  } else if (tipo_pessoa.toUpperCase() === 'JURIDICA') {
    if (!cnpj.isValid(documento)) {
      return res.status(400).json({ erro: 'O CNPJ informado é inválido.' });
    }
    formatedDocument = cnpj.strip(documento);
  } else {
    return res.status(400).json({ erro: "Tipo de pessoa deve ser 'FISICA' ou 'JURIDICA'." });
  }

  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s.\-&]+$/.test(nome)) {
    return res.status(400).json({ erro: 'O nome contém caracteres inválidos.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ erro: 'O e-mail informado é inválido.' });
  }
  if (!/^[0-9\s()-]+$/.test(telefone)) {
    return res.status(400).json({ erro: 'O telefone deve conter apenas números, parênteses, traços e espaços.' });
  }
  if (endereco && /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.\-ºª/']/.test(endereco)) {
    return res.status(400).json({ erro: 'O endereço contém caracteres inválidos.' });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthDate = new Date(data_nascimento);
  if (birthDate > today) {
    return res.status(400).json({ erro: 'A data de nascimento não pode ser uma data futura.' });
  }

  const checkDocumentQuery = 'SELECT id FROM clientes WHERE documento = ?';
  db.get(checkDocumentQuery, [formatedDocument], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao interagir com o banco de dados.' });
    }
    if (row) {
      return res.status(400).json({ erro: 'Este documento já está cadastrado.' });
    }

    const insertQuery = `
      INSERT INTO clientes (nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(insertQuery, [nome, email, telefone, tipo_pessoa.toUpperCase(), formatedDocument, endereco, data_nascimento], function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({ id: this.lastID, nome, tipo_pessoa: tipo_pessoa.toUpperCase(), documento: formatedDocument });
    });
  });
});

// Rota GET (TODOS): Listar todos os clientes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM clientes ORDER BY nome';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Rota GET (POR ID): Buscar um único cliente pelo ID
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
    const { nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento } = req.body;

    if (!nome || !email || !telefone || !tipo_pessoa || !documento || !endereco || !data_nascimento) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios para atualização.' });
    }
    
    // As mesmas validações do POST são aplicadas aqui
    let formatedDocument = '';
    if (tipo_pessoa.toUpperCase() === 'FISICA') {
        if (!cpf.isValid(documento)) return res.status(400).json({ erro: 'O CPF informado é inválido.' });
        formatedDocument = cpf.strip(documento);
    } else if (tipo_pessoa.toUpperCase() === 'JURIDICA') {
        if (!cnpj.isValid(documento)) return res.status(400).json({ erro: 'O CNPJ informado é inválido.' });
        formatedDocument = cnpj.strip(documento);
    } else {
        return res.status(400).json({ erro: "Tipo de pessoa deve ser 'FISICA' ou 'JURIDICA'." });
    }

    // Validação de unicidade do documento na atualização
    const checkDocumentQuery = 'SELECT id FROM clientes WHERE documento = ? AND id != ?';
    db.get(checkDocumentQuery, [formatedDocument, id], (err, row) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao verificar documento durante atualização.' });
        }
        if (row) {
            return res.status(400).json({ erro: 'O documento informado já pertence a outro cliente.' });
        }

        const query = `
            UPDATE clientes 
            SET nome = ?, email = ?, telefone = ?, tipo_pessoa = ?, documento = ?, endereco = ?, data_nascimento = ?
            WHERE id = ?
        `;
        db.run(query, [nome, email, telefone, tipo_pessoa.toUpperCase(), formatedDocument, endereco, data_nascimento, id], function(err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ erro: 'Cliente não encontrado para atualização.' });
            }
            res.json({ mensagem: 'Cliente atualizado com sucesso!' });
        });
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