const db = require('../database/db');

const getDashboardData = (req, res) => {
  const dataAtual = new Date();
  const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const anoAtual = dataAtual.getFullYear();
  const mesAnoFiltro = `${anoAtual}-${mesAtual}`;

  // 1. Contadores operacionais gerais (NOVO: Somando os ENTREGUES)
  const queryStatus = `
    SELECT 
      SUM(CASE WHEN status = 'PENDENTE' THEN 1 ELSE 0 END) as pendentes,
      SUM(CASE WHEN status IN ('APROVADO', 'EM_PRODUCAO', 'EM PRODUCAO') THEN 1 ELSE 0 END) as emProducao,
      SUM(CASE WHEN status IN ('APROVADO', 'EM_PRODUCAO', 'EM PRODUCAO', 'CONCLUIDO') AND data_instalacao < date('now') THEN 1 ELSE 0 END) as atrasados,
      SUM(CASE WHEN status = 'ENTREGUE' THEN 1 ELSE 0 END) as entregues
    FROM orcamentos
  `;

  // 2. Financeiro Inteligente (Calcula o total de orçamentos e as vendas fechadas)
  const queryFinanceiro = `
    SELECT 
      COALESCE(SUM(CASE WHEN status IN ('APROVADO', 'EM_PRODUCAO', 'EM PRODUCAO', 'CONCLUIDO', 'ENTREGUE') THEN valor_total ELSE 0 END), 0) as faturamentoMes,
      SUM(CASE WHEN status IN ('APROVADO', 'EM_PRODUCAO', 'EM PRODUCAO', 'CONCLUIDO', 'ENTREGUE') THEN 1 ELSE 0 END) as vendasFechadas,
      COUNT(id) as totalOrcamentosMes,
      COALESCE(AVG(CASE WHEN status IN ('APROVADO', 'EM_PRODUCAO', 'EM PRODUCAO', 'CONCLUIDO', 'ENTREGUE') THEN valor_total ELSE NULL END), 0) as ticketMedio
    FROM orcamentos
    WHERE strftime('%Y-%m', data_orcamento) = ?
  `;

  // 3. Tabela Recentes
  const queryRecentes = `
    SELECT O.id, O.numero_orcamento, O.cliente_id, C.nome as cliente, O.categoria_servico as servico, O.valor_total, O.status, O.prazo_entrega
    FROM orcamentos O
    JOIN clientes C ON O.cliente_id = C.id
    ORDER BY O.id DESC
    LIMIT 5
  `;

  // 4. Agenda (Com o CONCLUIDO incluído)
  const queryAgenda = `
    SELECT O.id, C.nome as cliente, O.data_instalacao, C.endereco as bairro
    FROM orcamentos O
    JOIN clientes C ON O.cliente_id = C.id
    WHERE O.data_instalacao >= date('now')
    AND O.status IN ('APROVADO', 'EM_PRODUCAO', 'EM PRODUCAO', 'CONCLUIDO')
    ORDER BY O.data_instalacao ASC
    LIMIT 3
  `;

  // 5. Ranking
  const queryRanking = `
    SELECT categoria_servico as nome, COUNT(id) as qtd
    FROM orcamentos
    WHERE categoria_servico IS NOT NULL
    AND status IN ('APROVADO', 'CONCLUIDO', 'ENTREGUE')
    GROUP BY categoria_servico
    ORDER BY qtd DESC
    LIMIT 3
  `;

  db.get(queryStatus, [], (err, statusRes) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(queryFinanceiro, [mesAnoFiltro], (err, finRes) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(queryRecentes, [], (err, recentesRes) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(queryAgenda, [], (err, agendaRes) => {
          db.all(queryRanking, [], (err, rankingRes) => {
            
            // --- CÁLCULO DA TAXA DE CONVERSÃO ---
            const vendas = finRes.vendasFechadas || 0;
            const totalOrcamentos = finRes.totalOrcamentosMes || 0;
            let taxaConversaoNum = 0;
            
            if (totalOrcamentos > 0) {
              taxaConversaoNum = Math.round((vendas / totalOrcamentos) * 100);
            }

            res.json({
              totais: {
                faturamentoMes: finRes.faturamentoMes,
                vendasFechadas: vendas,
                ticketMedio: finRes.ticketMedio,
                taxaConversao: `${taxaConversaoNum}%`,
                pendentes: statusRes.pendentes || 0,
                emProducao: statusRes.emProducao || 0,
                atrasados: statusRes.atrasados || 0,
                entregues: statusRes.entregues || 0, // ENVIANDO PARA O FRONTEND
              },
              orcamentosRecentes: recentesRes || [],
              agendaInstalacoes: agendaRes || [],
              rankingServicos: rankingRes || []
            });

          });
        });
      });
    });
  });
};

module.exports = {
  getDashboardData
};