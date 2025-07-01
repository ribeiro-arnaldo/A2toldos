import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiFileText, FiArrowLeft, FiGrid } from 'react-icons/fi';

// CAMINHOS DE IMPORT ATUALIZADOS
import api from '../../api/api';
import StatusBadge from '../../components/common/StatusBadge';

const OrcamentoDetailPage = () => {
  const { id } = useParams();

  const [orcamento, setOrcamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrcamento = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/orcamentos/${id}`);
        setOrcamento(response.data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar os dados do orçamento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrcamento();
  }, [id]);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (loading) return <div className="text-center p-12">A carregar detalhes do orçamento...</div>;
  if (error) return <div className="text-red-500 text-center p-12">{error}</div>;
  if (!orcamento) return <div className="text-center p-12">Orçamento não encontrado.</div>;

  return (
    <div>
      <Link to={orcamento.cliente_id ? `/clientes/${orcamento.cliente_id}` : '/orcamentos'} className="inline-flex items-center text-brand-blue font-semibold hover:underline mb-6">
        <FiArrowLeft className="mr-2" />
        Voltar
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue flex items-center">
              <FiFileText className="mr-3" />
              Detalhes do Orçamento
            </h1>
            <p className="font-mono text-lg text-gray-600 mt-1">{orcamento.numero_orcamento}</p>
          </div>
          <StatusBadge status={orcamento.status} />
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <p><strong>Cliente:</strong> {orcamento.nome_cliente}</p>
            <p><strong>Data:</strong> {formatDate(orcamento.data_orcamento)}</p>
            <p className="text-xl font-bold"><strong>Valor Total:</strong> {formatCurrency(orcamento.valor_total)}</p>
          </div>
          {orcamento.descricao && <p className="mt-4"><strong>Descrição:</strong> {orcamento.descricao}</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-brand-blue mb-4 flex items-center">
          <FiGrid className="mr-3" />
          Itens do Orçamento
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="p-4 font-bold text-gray-600">Descrição do Item</th>
                <th className="p-4 font-bold text-gray-600 text-center">Largura (m)</th>
                <th className="p-4 font-bold text-gray-600 text-center">Comprimento (m)</th>
                <th className="p-4 font-bold text-gray-600 text-right">Preço/m²</th>
                <th className="p-4 font-bold text-gray-600 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.itens && orcamento.itens.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="p-4">{item.descricao_item || '-'}</td>
                  <td className="p-4 text-center">{item.largura.toFixed(2)}</td>
                  <td className="p-4 text-center">{item.comprimento.toFixed(2)}</td>
                  <td className="p-4 text-right">{formatCurrency(item.preco_m2)}</td>
                  <td className="p-4 text-right font-semibold">{formatCurrency(item.valor_item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrcamentoDetailPage;