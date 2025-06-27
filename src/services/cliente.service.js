const db = require('../database/db');
const { cpf, cnpj } = require('cpf-cnpj-validator');

class ClienteService {

  // POST /clientes
  async create(dadosCliente) {
    const { nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento } = dadosCliente;

    // Lógica 1: Formatar o documento para salvar no banco
    const documentoFormatado = tipo_pessoa.toUpperCase() === 'FISICA' 
      ? cpf.strip(documento) 
      : cnpj.strip(documento);

    // Lógica 2: Verificar se o documento já existe (regra de negócio)
    const checkDocumentQuery = 'SELECT id FROM clientes WHERE documento = ?';
    const clienteExistente = await new Promise((resolve, reject) => {
      db.get(checkDocumentQuery, [documentoFormatado], (err, row) => {
        if (err) reject(new Error('Erro ao consultar o banco de dados.'));
        resolve(row);
      });
    });

    if (clienteExistente) {
      throw new Error('Este documento já está cadastrado.');
    }

    // Lógica 3: Inserir no banco
    const insertQuery = `INSERT INTO clientes (nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const novoCliente = await new Promise((resolve, reject) => {
      db.run(insertQuery, [nome, email, telefone, tipo_pessoa.toUpperCase(), documentoFormatado, endereco, data_nascimento], function (err) {
        if (err) reject(new Error('Erro ao salvar o cliente no banco de dados.'));
        resolve({ id: this.lastID, nome, tipo_pessoa: tipo_pessoa.toUpperCase(), documento: documentoFormatado });
      });
    });
    return novoCliente;
  }

  // GET /clientes
  async listAll() {
    const query = 'SELECT * FROM clientes ORDER BY nome';
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) reject(new Error('Erro ao buscar clientes.'));
        resolve(rows);
      });
    });
  }

  // GET /clientes/:id
  async findById(id) {
    const query = 'SELECT * FROM clientes WHERE id = ?';
    const cliente = await new Promise((resolve, reject) => {
      db.get(query, [id], (err, row) => {
        if (err) reject(new Error('Erro ao buscar cliente.'));
        resolve(row);
      });
    });
    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }
    return cliente;
  }
  
  // PUT /clientes/:id
  async update(id, dadosCliente) {
    const { nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento } = dadosCliente;
    
    // Lógica 1: Formatar o documento
    let documentoFormatado = tipo_pessoa.toUpperCase() === 'FISICA' ? cpf.strip(documento) : cnpj.strip(documento);

    // Lógica 2: Verificar se o documento é unico na atualização
    const checkDocumentQuery = 'SELECT id FROM clientes WHERE documento = ? AND id != ?';
    const clienteExistente = await new Promise((resolve, reject) => {
        db.get(checkDocumentQuery, [documentoFormatado, id], (err, row) => {
            if (err) reject(new Error('Erro ao verificar documento durante atualização.'));
            resolve(row);
        });
    });
    if (clienteExistente) {
        throw new Error('O documento informado já pertence a outro cliente.');
    }

    // Lógica 3: Atualizar no banco
    const query = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, tipo_pessoa = ?, documento = ?, endereco = ?, data_nascimento = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [nome, email, telefone, tipo_pessoa.toUpperCase(), documentoFormatado, endereco, data_nascimento, id], function(err) {
        if (err) reject(new Error('Erro ao atualizar cliente.'));
        if (this.changes === 0) reject(new Error('Cliente não encontrado para atualização.'));
        resolve({ mensagem: 'Cliente atualizado com sucesso!' });
      });
    });
  }

  // DELETE /clientes/:id
  async delete(id) {
    const query = 'DELETE FROM clientes WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(query, [id], function(err) {
        if (err) reject(new Error('Erro ao deletar cliente.'));
        if (this.changes === 0) reject(new Error('Cliente não encontrado para exclusão.'));
        resolve({ mensagem: 'Cliente excluído com sucesso!' });
      });
    });
  }
}

module.exports = new ClienteService();