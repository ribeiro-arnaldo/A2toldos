const db = require('../database/db');

class OrcamentoService {

  async create(orcamentoData) {
    const { cliente_id, descricao, itens } = orcamentoData;

    let valor_total_calculado = 0;
    for (const item of itens) {
      item.valor_item = item.largura * item.comprimento * item.preco_m2;
      valor_total_calculado += item.valor_item;
    }

    const data_orcamento = new Date().toISOString().split('T')[0];
    const ano_atual = new Date().getFullYear();

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION;');
        const countQuery = `SELECT COUNT(*) as count FROM orcamentos WHERE strftime('%Y', data_orcamento) = ?`;
        db.get(countQuery, [String(ano_atual)], (err, row) => {
          if (err) {
            db.run('ROLLBACK;');
            return reject(new Error('Erro ao gerar número do orçamento.'));
          }
          
          const proximo_numero = row.count + 1;
          const numero_formatado = String(proximo_numero).padStart(4, '0');
          const numero_orcamento = `${numero_formatado}/${ano_atual}`;

          const orcamentoQuery = `INSERT INTO orcamentos (cliente_id, descricao, valor_total, data_orcamento, numero_orcamento) VALUES (?, ?, ?, ?, ?)`;
          db.run(orcamentoQuery, [cliente_id, descricao, valor_total_calculado, data_orcamento, numero_orcamento], function(err) {
            if (err) {
              db.run('ROLLBACK;');
              return reject(new Error('Erro ao salvar o orçamento.'));
            }

            const orcamento_id = this.lastID;
            const itemQuery = `INSERT INTO itens_orcamento (orcamento_id, descricao_item, largura, comprimento, preco_m2, valor_item) VALUES (?, ?, ?, ?, ?, ?)`;
            let itemsProcessed = 0;
            itens.forEach(item => {
              db.run(itemQuery, [orcamento_id, item.descricao_item, item.largura, item.comprimento, item.preco_m2, item.valor_item], (itemErr) => {
                if (itemErr) {
                  db.run('ROLLBACK;');
                  return reject(new Error('Erro ao salvar um item do orçamento.'));
                }
                itemsProcessed++;
                if (itemsProcessed === itens.length) {
                  db.run('COMMIT;');
                  resolve({ id: orcamento_id, numero_orcamento, valor_total: valor_total_calculado });
                }
              });
            });
          });
        });
        // ---- FIM DA MUDANÇA ----
      });
    });
  }

   async update(id, orcamentoData) {
    const { cliente_id, descricao, itens } = orcamentoData;

    let valor_total_calculado = 0;
    for (const item of itens) {
      item.valor_item = item.largura * item.comprimento * item.preco_m2;
      valor_total_calculado += item.valor_item;
    }

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION;');
        db.run('DELETE FROM itens_orcamento WHERE orcamento_id = ?', [id], (err) => {
          if (err) {
            db.run('ROLLBACK;');
            return reject(new Error('Erro ao limpar itens antigos do orçamento.'));
          }
          const updateQuery = `UPDATE orcamentos SET cliente_id = ?, descricao = ?, valor_total = ? WHERE id = ?`;
          db.run(updateQuery, [cliente_id, descricao, valor_total_calculado, id], function(err) {
            if (err) {
              db.run('ROLLBACK;');
              return reject(new Error('Erro ao atualizar o orçamento.'));
            }
            if (this.changes === 0) {
              db.run('ROLLBACK;');
              return reject(new Error('Orçamento não encontrado para atualização.'));
            }
            const itemQuery = `INSERT INTO itens_orcamento (orcamento_id, descricao_item, largura, comprimento, preco_m2, valor_item) VALUES (?, ?, ?, ?, ?, ?)`;
            let itemsProcessed = 0;
            itens.forEach(item => {
              db.run(itemQuery, [id, item.descricao_item, item.largura, item.comprimento, item.preco_m2, item.valor_item], (itemErr) => {
                if (itemErr) {
                  db.run('ROLLBACK;');
                  return reject(new Error('Erro ao salvar novos itens do orçamento.'));
                }
                itemsProcessed++;
                if (itemsProcessed === itens.length) {
                  db.run('COMMIT;');
                  resolve({ id: parseInt(id), valor_total: valor_total_calculado });
                }
              });
            });
          });
        });
      });
    });
  }

    async listAll() {
        const query = `
      SELECT o.id, o.numero_orcamento, o.descricao, o.valor_total, o.data_orcamento, o.status, c.nome as nome_cliente
      FROM orcamentos o
      JOIN clientes c ON o.cliente_id = c.id
      ORDER BY o.data_orcamento DESC
    `;
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) reject(new Error('Erro ao buscar orçamentos.'));
        resolve(rows);
      });
    });
  }

  async findById(id) {
     const orcamentoQuery = `
      SELECT o.id, o.numero_orcamento, o.descricao, o.valor_total, o.data_orcamento, o.status, c.nome as nome_cliente, c.email as email_cliente, c.telefone as telefone_cliente
      FROM orcamentos o
      JOIN clientes c ON o.cliente_id = c.id WHERE o.id = ?
    `;
    const orcamento = await new Promise((resolve, reject) => {
      db.get(orcamentoQuery, [id], (err, row) => {
        if (err) reject(new Error('Erro ao buscar o orçamento.'));
        resolve(row);
      });
    });
    if (!orcamento) throw new Error('Orçamento não encontrado.');
    const itensQuery = 'SELECT * FROM itens_orcamento WHERE orcamento_id = ?';
    const itens = await new Promise((resolve, reject) => {
      db.all(itensQuery, [id], (err, rows) => {
        if (err) reject(new Error('Erro ao buscar os itens do orçamento.'));
        resolve(rows);
      });
    });
    return { ...orcamento, itens };
  }

  async updateStatus(id, status) {
    const statusPermitidos = ['PENDENTE', 'APROVADO', 'REPROVADO', 'EM PRODUCAO', 'CONCLUIDO', 'ENTREGUE'];
    if (!status || !statusPermitidos.includes(status.toUpperCase())) {
      throw new Error('Status inválido ou não fornecido.');
    }
    const query = `UPDATE orcamentos SET status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [status.toUpperCase(), id], function(err) {
        if (err) reject(new Error('Erro ao atualizar o status.'));
        if (this.changes === 0) reject(new Error('Orçamento não encontrado.'));
        resolve({ mensagem: `Status do orçamento atualizado para ${status.toUpperCase()} com sucesso!` });
      });
    });
  }

  async delete(id) {
    const query = 'DELETE FROM orcamentos WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(query, [id], function(err) {
        if (err) reject(new Error('Erro ao deletar orçamento.'));
        if (this.changes === 0) reject(new Error('Orçamento não encontrado para exclusão.'));
        resolve({ mensagem: 'Orçamento excluído com sucesso!' });
      });
    });
  }
}

module.exports = new OrcamentoService();