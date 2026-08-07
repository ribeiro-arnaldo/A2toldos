import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiAlertCircle, FiClock, FiTool, FiPlus, FiDollarSign, 
  FiShoppingBag, FiTrendingUp, FiPercent, FiCalendar, FiMapPin, FiAward, FiCheckCircle 
} from 'react-icons/fi';
import api from '../../api/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  
  const [totais, setTotais] = useState({
    faturamentoMes: "R$ 0,00",
    vendasFechadas: 0,
    ticketMedio: "R$ 0,00",
    taxaConversao: "0%",
    pendentes: 0,
    aprovados: 0,
    emProducao: 0,
    concluidos: 0, 
    atrasados: 0,
    entregues: 0,
  });
  const [orcamentosRecentes, setOrcamentosRecentes] = useState([]);
  const [agendaInstalacoes, setAgendaInstalacoes] = useState([]);
  const [rankingServicos, setRankingServicos] = useState([]);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard');
        
        // Tratamento seguro para os dados do backend
        setTotais({
          ...response.data.totais,
          concluidos: response.data.totais.concluidos ?? 0,
          aprovados: response.data.totais.aprovados ?? 0,
        });
        setOrcamentosRecentes(response.data.orcamentosRecentes || []);
        setAgendaInstalacoes(response.data.agendaInstalacoes || []);
        setRankingServicos(response.data.rankingServicos || []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setErro("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    };

    carregarDashboard();
  }, []);

  const getStatusBadge = (status) => {
    let colorClass = "";
    switch (status) {
      case "PENDENTE": case "Pendente": colorClass = "bg-yellow-500 text-white"; break;
      case "APROVADO": case "Aprovado": colorClass = "bg-emerald-500 text-white"; break;
      case "REPROVADO": case "Reprovado": colorClass = "bg-red-500 text-white"; break;
      case "EM_PRODUCAO": case "Em Produção": case "EM PRODUCAO": colorClass = "bg-blue-500 text-white"; break;
      case "CONCLUIDO": case "Concluído": colorClass = "bg-purple-500 text-white"; break;
      case "ENTREGUE": case "Entregue": colorClass = "bg-gray-500 text-white"; break;
      case "Atrasado": colorClass = "bg-red-100 text-red-700 ring-2 ring-red-600 animate-pulse"; break;
      default: colorClass = "bg-gray-200 text-gray-800";
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${colorClass}`}>
        {status}
      </span>
    );
  };

  const aoClicarNoCard = (filtro) => {
    navigate('/orcamentos', { state: { filtroStatus: filtro } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 font-semibold animate-pulse">Carregando painel da A2 Toldos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        {erro}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">Painel Principal</h1>
          <p className="mt-2 text-gray-700">Resumo de vendas, faturamento e produção da A2 Toldos.</p>
        </div>
        <button 
          onClick={() => navigate('/orcamentos/novo')} 
          className="font-bold py-2 px-4 rounded-lg flex items-center transition-all shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#ffb634', color: '#06397d' }}
        >
          <FiPlus className="mr-2" /> Novo Orçamento
        </button>
      </div>

      {/* ALERTA DE ATRASO */}
      {totais.atrasados > 0 && (
        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded shadow-sm flex items-start gap-3">
          <FiAlertCircle className="text-red-600 text-2xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-bold">Atraso na Produção</h3>
            <p className="text-red-700 text-sm mt-1">
              Atenção! Temos <strong>{totais.atrasados} pedido(s) aprovado(s) com o prazo expirado</strong>.
            </p>
          </div>
        </div>
      )}

      {/* SESSÃO 1: VENDAS E FINANCEIRO */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Desempenho Comercial (Mês Atual)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Faturamento</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  {typeof totais.faturamentoMes === 'number' ? totais.faturamentoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : totais.faturamentoMes}
                </h3>
              </div>
              <div className="p-3 bg-green-50 rounded-full text-green-600">
                <FiDollarSign size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Vendas Fechadas</p>
                <h3 className="text-2xl font-bold text-brand-blue mt-1">{totais.vendasFechadas}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-full text-brand-blue">
                <FiShoppingBag size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Taxa de Conversão</p>
                <h3 className="text-2xl font-bold text-purple-600 mt-1">{totais.taxaConversao}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                <FiPercent size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Ticket Médio</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {typeof totais.ticketMedio === 'number' ? totais.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : totais.ticketMedio}
                </h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                <FiTrendingUp size={24} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SESSÃO 2: STATUS OPERACIONAL */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Acompanhamento da Fábrica</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div onClick={() => aoClicarNoCard('Pendentes')} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-yellow-500 cursor-pointer transform transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">Aguardando Resposta</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{totais.pendentes}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><FiClock size={24} /></div>
            </div>
          </div>

          
          <div onClick={() => aoClicarNoCard('Aprovados')} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-emerald-500 cursor-pointer transform transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">Aprovados</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{totais.aprovados}</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-full text-emerald-600"><FiCheckCircle size={24} /></div>
            </div>
          </div>

          <div onClick={() => aoClicarNoCard('Em Produção')} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-blue-500 cursor-pointer transform transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">Em Produção</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{totais.emProducao}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full text-blue-600"><FiTool size={24} /></div>
            </div>
          </div>
          
          <div onClick={() => aoClicarNoCard('Concluídos')} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-purple-500 cursor-pointer transform transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">Concluídos</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{totais.concluidos}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full text-purple-600"><FiCheckCircle size={24} /></div>
            </div>
          </div>

          <div onClick={() => aoClicarNoCard('Atrasados')} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-red-500 cursor-pointer transform transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">Atrasados</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">{totais.atrasados}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-full text-red-600"><FiAlertCircle size={24} /></div>
            </div>
          </div>

          <div onClick={() => aoClicarNoCard('Entregues')} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-gray-500 cursor-pointer transform transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">Entregues</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{totais.entregues}</h3>
              </div>
              <div className="p-2 bg-gray-100 rounded-full text-gray-600"><FiCheckCircle size={24} /></div>
            </div>
          </div>

        </div>
      </section>

      {/* SESSÃO 3: TABELA + AGENDA/RANKING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Tabela */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-brand-blue">Orçamentos Recentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Nº</th>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Prazo Máx.</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {orcamentosRecentes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Nenhum orçamento cadastrado recentemente.</td>
                  </tr>
                ) : (
                  orcamentosRecentes.map((orc) => (
                    <tr key={orc.id} className="hover:bg-gray-50 transition-colors">
                      <td 
                        className="px-6 py-4 font-bold text-brand-blue cursor-pointer hover:underline"
                        onClick={() => navigate(`/orcamentos/${orc.id}`)}
                      >
                        {orc.numero_orcamento || `#${orc.id}`}
                      </td>
                      
                      <td 
                        className="px-6 py-4 font-semibold text-gray-700 cursor-pointer hover:text-brand-blue hover:underline"
                        onClick={() => navigate(`/clientes/${orc.cliente_id}`)}
                      >
                        {orc.cliente}
                      </td>
                      
                      <td className="px-6 py-4">{getStatusBadge(orc.status)}</td>
                      <td className="px-6 py-4 font-bold text-gray-500">{orc.prazo_entrega || 'A definir'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUNA DIREITA: Agenda e Ranking */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
            <h2 className="text-md font-bold text-brand-blue mb-4 flex items-center">
              <FiCalendar className="mr-2" /> Próximas Instalações
            </h2>
            <div className="space-y-4">
              {agendaInstalacoes.length === 0 ? (
                <p className="text-xs text-gray-500">Nenhuma instalação agendada.</p>
              ) : (
                agendaInstalacoes.map((item) => (
                  <div key={item.id} className="flex flex-col border-l-2 border-brand-yellow pl-3">
                    <span className="text-sm font-bold text-gray-800">{item.cliente}</span>
                    <span className="text-xs text-gray-500 flex items-center mt-1"><FiClock className="mr-1"/> {item.data_instalacao}</span>
                    <span className="text-xs text-gray-500 flex items-center mt-0.5"><FiMapPin className="mr-1"/> {item.bairro}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
            <h2 className="text-md font-bold text-brand-blue mb-4 flex items-center">
              <FiAward className="mr-2" /> Top Serviços (Mês)
            </h2>
            <div className="space-y-3">
              {rankingServicos.length === 0 ? (
                <p className="text-xs text-gray-500">Sem dados de serviços este mês.</p>
              ) : (
                rankingServicos.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{item.nome}</span>
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-brand-blue px-2 py-1 rounded">{item.qtd}x</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DashboardPage;