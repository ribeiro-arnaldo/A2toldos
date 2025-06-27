const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Rota POST: Cadastrar um novo orçamento
router.post('/', (req, res) => {
  const { cliente_id, descricao, itens } = req.body;

  if (!cliente_id) {
    return res.status(400).json({ erro: 'O ID do cliente é obrigatório.' });
  }
  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'O orçamento deve ter pelo menos um item.' });
  }

  let valor_total_calculado = 0;
  for (const item of itens) {
    if (item.largura == null || item.comprimento == null || item.preco_m2 == null) {
      return res.status(400).json({ erro: 'Cada item deve ter largura, comprimento e preço por m².' });
    }
    const valor_item = item.largura * item.comprimento * item.preco_m2;
    item.valor_item = valor_item;
    valor_total_calculado += valor_item;
  }

  const data_orcamento = new Date().toISOString().split('T')[0];

  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');
    const orcamentoQuery = `INSERT INTO orcamentos (cliente_id, descricao, valor_total, data_orcamento) VALUES (?, ?, ?, ?)`;
    db.run(orcamentoQuery, [cliente_id, descricao, valor_total_calculado, data_orcamento], function(err) {
      if (err) {
        db.run('ROLLBACK;');
        return res.status(500).json({ erro: 'Erro ao salvar o orçamento.', detalhes: err.message });
      }

      const orcamento_id = this.lastID;
      const itemQuery = `INSERT INTO itens_orcamento (orcamento_id, descricao_item, largura, comprimento, preco_m2, valor_item) VALUES (?, ?, ?, ?, ?, ?)`;
      
      let itemsProcessed = 0;
      itens.forEach(item => {
        db.run(itemQuery, [orcamento_id, item.descricao_item, item.largura, item.comprimento, item.preco_m2, item.valor_item], (itemErr) => {
          if (itemErr) {
            db.run('ROLLBACK;');
            return res.status(500).json({ erro: 'Erro ao salvar um item do orçamento.', detalhes: itemErr.message });
          }
          itemsProcessed++;
          if (itemsProcessed === itens.length) {
            db.run('COMMIT;');
            res.status(201).json({ mensagem: 'Orçamento cadastrado com sucesso!', id: orcamento_id, valor_total: valor_total_calculado });
          }
        });
      });
    });
  });
});

// Rota GET (TODOS): Listar todos os orçamentos
router.get('/', (req, res) => {
  const query = `
    SELECT o.id, o.descricao, o.valor_total, o.data_orcamento, c.nome as nome_cliente
    FROM orcamentos o
    JOIN clientes c ON o.cliente_id = c.id
    ORDER BY o.data_orcamento DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar orçamentos.', detalhes: err.message });
    }
    res.json(rows);
  });
});

// Rota GET (POR ID): Buscar um orçamento completo com seus itens
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const orcamentoQuery = `
    SELECT o.id, o.descricao, o.valor_total, o.data_orcamento, c.nome as nome_cliente, c.email as email_cliente, c.telefone as telefone_cliente
    FROM orcamentos o
    JOIN clientes c ON o.cliente_id = c.id
    WHERE o.id = ?
  `;
  db.get(orcamentoQuery, [id], (err, orcamento) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar o orçamento.', detalhes: err.message });
    }
    if (!orcamento) {
      return res.status(404).json({ erro: 'Orçamento não encontrado.' });
    }

    const itensQuery = 'SELECT * FROM itens_orcamento WHERE orcamento_id = ?';
    db.all(itensQuery, [id], (itemErr, itens) => {
      if (itemErr) {
        return res.status(500).json({ erro: 'Erro ao buscar os itens do orçamento.', detalhes: itemErr.message });
      }
      const respostaCompleta = { ...orcamento, itens: itens };
      res.json(respostaCompleta);
    });
  });
});

// Rota PUT: Atualizar um orçamento existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { cliente_id, descricao, itens } = req.body;

  // Validações e cálculos (iguais ao POST)
  if (!cliente_id) return res.status(400).json({ erro: 'O ID do cliente é obrigatório.' });
  if (!Array.isArray(itens) || itens.length === 0) return res.status(400).json({ erro: 'O orçamento deve ter pelo menos um item.' });
  
  let valor_total_calculado = 0;
  for (const item of itens) {
    if (item.largura == null || item.comprimento == null || item.preco_m2 == null) return res.status(400).json({ erro: 'Cada item deve ter largura, comprimento e preço por m².' });
    const valor_item = item.largura * item.comprimento * item.preco_m2;
    item.valor_item = valor_item;
    valor_total_calculado += valor_item;
  }
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');
    // 1. Deleta os itens ANTIGOS do orçamento
    db.run('DELETE FROM itens_orcamento WHERE orcamento_id = ?', [id], (err) => {
      if (err) {
        db.run('ROLLBACK;');
        return res.status(500).json({ erro: 'Erro ao limpar itens antigos do orçamento.', detalhes: err.message });
      }

      // 2. Atualiza o orçamento principal
      const updateQuery = `UPDATE orcamentos SET cliente_id = ?, descricao = ?, valor_total = ? WHERE id = ?`;
      db.run(updateQuery, [cliente_id, descricao, valor_total_calculado, id], function(err) {
        if (err) {
          db.run('ROLLBACK;');
          return res.status(500).json({ erro: 'Erro ao atualizar o orçamento.', detalhes: err.message });
        }
        if (this.changes === 0) {
          db.run('ROLLBACK;');
          return res.status(404).json({ erro: 'Orçamento não encontrado para atualização.' });
        }

        // 3. Insere os itens NOVOS
        const itemQuery = `INSERT INTO itens_orcamento (orcamento_id, descricao_item, largura, comprimento, preco_m2, valor_item) VALUES (?, ?, ?, ?, ?, ?)`;
        let itemsProcessed = 0;
        itens.forEach(item => {
          db.run(itemQuery, [id, item.descricao_item, item.largura, item.comprimento, item.preco_m2, item.valor_item], (itemErr) => {
            if (itemErr) {
              db.run('ROLLBACK;');
              return res.status(500).json({ erro: 'Erro ao salvar novos itens do orçamento.', detalhes: itemErr.message });
            }
            itemsProcessed++;
            if (itemsProcessed === itens.length) {
              db.run('COMMIT;');
              res.status(200).json({ mensagem: 'Orçamento atualizado com sucesso!', id, valor_total: valor_total_calculado });
            }
          });
        });
      });
    });
  });
});

// Rota DELETE: Excluir um orçamento (e seus itens, graças ao ON DELETE CASCADE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orcamentos WHERE id = ?';
  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao deletar o orçamento.', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Orçamento não encontrado para exclusão.' });
    }
    res.status(200).json({ mensagem: 'Orçamento excluído com sucesso!' });
  });
});

module.exports = router;