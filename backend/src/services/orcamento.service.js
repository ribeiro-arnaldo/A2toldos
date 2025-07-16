const db = require('../database/db');

const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};
const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

class OrcamentoService {

  async create(orcamentoData) {
    const { cliente_id, descricao, prazo_entrega, itens } = orcamentoData;

    const valor_total_calculado = itens.reduce((acc, item) => {
      return acc + (item.largura * item.comprimento * item.preco_m2);
    }, 0);

    const data_orcamento = new Date().toISOString().split('T')[0];
    const ano_atual = new Date().getFullYear();

    await dbRun('BEGIN TRANSACTION;');

    try {
      const maxNumQuery = `SELECT MAX(numero_orcamento) as max_num FROM orcamentos WHERE numero_orcamento LIKE ?`;
      const resultMax = await dbGet(maxNumQuery, [`%/${ano_atual}`]);
      
      let proximo_numero = 1;
      if (resultMax && resultMax.max_num) {
        const ultimo_numero = parseInt(resultMax.max_num.split('/')[0], 10);
        proximo_numero = ultimo_numero + 1;
      }
      
      const numero_formatado = String(proximo_numero).padStart(4, '0');
      const numero_orcamento = `${numero_formatado}/${ano_atual}`;

      const orcamentoQuery = `INSERT INTO orcamentos (cliente_id, descricao, valor_total, data_orcamento, prazo_entrega, numero_orcamento) VALUES (?, ?, ?, ?, ?, ?)`;
      const result = await dbRun(orcamentoQuery, [cliente_id, descricao, valor_total_calculado, data_orcamento, prazo_entrega, numero_orcamento]);
      const orcamento_id = result.lastID;

      const itemQuery = `INSERT INTO itens_orcamento (orcamento_id, descricao_item, cor, observacoes, largura, comprimento, preco_m2, valor_item, material) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Adicionado 'material'
    for (const item of itens) {
      const valor_item = item.largura * item.comprimento * item.preco_m2;
      await dbRun(itemQuery, [orcamento_id, item.descricao_item, item.cor, item.observacoes, item.largura, item.comprimento, item.preco_m2, valor_item, item.material]);
    }

      await dbRun('COMMIT;');
      
      return { id: orcamento_id, numero_orcamento, valor_total: valor_total_calculado };

    } catch (error) {
      await dbRun('ROLLBACK;');
      throw new Error(`Erro ao salvar orçamento: ${error.message}`);
    }
  }

  async listAll(filtros) {
    let query = `
      SELECT o.id, o.numero_orcamento, o.descricao, o.valor_total, o.data_orcamento, o.prazo_entrega, o.status, c.nome as nome_cliente
      FROM orcamentos o
      JOIN clientes c ON o.cliente_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filtros && filtros.cliente_id) {
      query += ' AND o.cliente_id = ?';
      params.push(filtros.cliente_id);
    }
    if (filtros && filtros.numero_orcamento) {
      query += ' AND o.numero_orcamento LIKE ?';
      params.push(`%${filtros.numero_orcamento}%`);
    }
    if (filtros && filtros.nome_cliente) {
      query += ' AND c.nome LIKE ?';
      params.push(`%${filtros.nome_cliente}%`);
    }
    if (filtros && filtros.status && filtros.status !== 'TODOS') {
      query += ' AND o.status = ?';
      params.push(filtros.status);
    }
    
    const countQuery = query.replace(/SELECT o\.id, o\.numero_orcamento, o\.descricao, o\.valor_total, o\.data_orcamento, o\.status, c\.nome as nome_cliente/, 'SELECT COUNT(o.id) as total');
    
    const countResult = await dbGet(countQuery, params);
    const total = countResult ? countResult.total : 0;

    const pagina = parseInt(filtros.pagina) || 1;
    const limite = parseInt(filtros.limite) || 10;
    const offset = (pagina - 1) * limite;

    query += ' ORDER BY o.data_orcamento DESC, o.id DESC LIMIT ? OFFSET ?';
    params.push(limite, offset);

    const orcamentos = await dbAll(query, params);
    
    return { orcamentos, total, pagina, limite };
  }

  async findById(id) {
     const orcamentoQuery = `
      SELECT
        o.*,
        c.nome as nome_cliente,
        c.email as email_cliente,
        c.telefone as telefone_cliente,
        c.documento as cliente_documento,
        c.tipo_pessoa as cliente_tipo_pessoa,
        c.endereco as cliente_endereco
      FROM orcamentos o
      JOIN clientes c ON o.cliente_id = c.id
      WHERE o.id = ?
    `;
    const orcamento = await dbGet(orcamentoQuery, [id]);
    if (!orcamento) throw new Error('Orçamento não encontrado.');

     const itensQuery = 'SELECT *, material FROM itens_orcamento WHERE orcamento_id = ?';
    const itens = await dbAll(itensQuery, [id]);
    return { ...orcamento, itens };
  } 
  
  async update(id, orcamentoData) {
    const { cliente_id, descricao, prazo_entrega, itens } = orcamentoData;

    const valor_total_calculado = itens.reduce((acc, item) => {
        return acc + (item.largura * item.comprimento * item.preco_m2);
    }, 0);

    await dbRun('BEGIN TRANSACTION;');
    try {
        await dbRun('DELETE FROM itens_orcamento WHERE orcamento_id = ?', [id]);
        
        const updateQuery = `UPDATE orcamentos SET cliente_id = ?, descricao = ?, valor_total = ?, prazo_entrega = ? WHERE id = ?`;
        const result = await dbRun(updateQuery, [cliente_id, descricao, valor_total_calculado, prazo_entrega, id]);

        if (result.changes === 0) {
            throw new Error('Orçamento não encontrado para atualização.');
        }

        const itemQuery = `INSERT INTO itens_orcamento (orcamento_id, descricao_item, cor, observacoes, largura, comprimento, preco_m2, valor_item, material) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Adicionado 'material'
    for (const item of itens) {
        const valor_item = item.largura * item.comprimento * item.preco_m2; 
        await dbRun(itemQuery, [id, item.descricao_item, item.cor, item.observacoes, item.largura, item.comprimento, item.preco_m2, valor_item, item.material]);
    }
        
        await dbRun('COMMIT;');
        return { id: parseInt(id), valor_total: valor_total_calculado };

    } catch(error) {
        await dbRun('ROLLBACK;');
        throw new Error(`Erro ao atualizar orçamento: ${error.message}`);
    }
  }

  async updateStatus(id, status) {
    const statusPermitidos = ['PENDENTE', 'APROVADO', 'REPROVADO', 'EM PRODUCAO', 'CONCLUIDO', 'ENTREGUE'];
    if (!status || !statusPermitidos.includes(status.toUpperCase())) {
      throw new Error('Status inválido ou não fornecido.');
    }
    const query = `UPDATE orcamentos SET status = ? WHERE id = ?`;
    const result = await dbRun(query, [status.toUpperCase(), id]);
    if (result.changes === 0) {
        throw new Error('Orçamento não encontrado.');
    }
    return { mensagem: `Status do orçamento atualizado para ${status.toUpperCase()} com sucesso!` };
  }

  async delete(id) {
    const query = 'DELETE FROM orcamentos WHERE id = ?';
    const result = await dbRun(query, [id]);
    if (result.changes === 0) {
        throw new Error('Orçamento não encontrado para exclusão.');
    }
    return { mensagem: 'Orçamento excluído com sucesso!' };
  }
}

module.exports = new OrcamentoService();