const db = require('../database/db');
const { cpf, cnpj } = require('cpf-cnpj-validator');

class ClienteService {

  // POST /clientes
  async create(dadosCliente) {
    const { nome, email, telefone, tipo_pessoa, documento, endereco, data_nascimento } = dadosCliente;
    const telefoneFormatado = telefone.replace(/\D/g, '');
    const documentoFormatado = tipo_pessoa.toUpperCase() === 'FISICA' 
      ? cpf.strip(documento) 
      : cnpj.strip(documento);
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
  async listAll(filtros) {
    let query = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];
    if (filtros?.tipo && filtros?.termo) {
        const { tipo, termo } = filtros;
        switch (tipo) {
            case 'nome':
                query += ' AND nome LIKE ? COLLATE NOCASE'; 
                params.push(`%${termo}%`);
                break;
            case 'documento':
                query += ' AND documento = ?';
                params.push(termo.replace(/\D/g, ''));
                break;
            case 'telefone':
                query += ' AND telefone LIKE ?';
                params.push(`%${termo.replace(/\D/g, '')}%`);
                break;
        }
    } 
    
    else if (filtros?.nome) {
        query += ' AND nome LIKE ? COLLATE NOCASE';
        params.push(`%${filtros.nome}%`);
    }
    
    
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const total = await new Promise((resolve, reject) => {
      db.get(countQuery, params, (err, row) => {
        if (err) reject(new Error('Erro ao contar clientes.'));
        resolve(row ? row.total : 0);
      });
    });

    query += ' ORDER BY nome';

    const pagina = parseInt(filtros.pagina) || 1;
    const limite = parseInt(filtros.limite) || 10;
    const offset = (pagina - 1) * limite;
    query += ' LIMIT ? OFFSET ?';
    params.push(limite, offset);

    const clientes = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(new Error(`Erro ao buscar clientes: ${err.message}`));
        resolve(rows);
      });
    });

    return {
      clientes,
      total,
      pagina,
      limite
    };
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
    const telefoneFormatado = telefone.replace(/\D/g, '');
    let documentoFormatado = tipo_pessoa.toUpperCase() === 'FISICA' ? cpf.strip(documento) : cnpj.strip(documento);
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