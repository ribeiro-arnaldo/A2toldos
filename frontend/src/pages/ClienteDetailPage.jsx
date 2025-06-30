import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser, FiFileText, FiArrowLeft } from 'react-icons/fi';
import api from '../api/api';

const ClienteDetailPage = () => {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resCliente, resOrcamentos] = await Promise.all([
          api.get(`/clientes/${id}`),
          api.get(`/orcamentos?cliente_id=${id}`)
        ]);

        setCliente(resCliente.data);
        setOrcamentos(resOrcamentos.data.orcamentos);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar os dados do cliente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>A carregar dados do cliente...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!cliente) return <div>Cliente não encontrado.</div>;

  return (
    <div>
      <Link to="/clientes" className="inline-flex items-center text-brand-blue font-semibold hover:underline mb-6">
        <FiArrowLeft className="mr-2" />
        Voltar para a Lista de Clientes
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center mb-4">
          <FiUser className="mr-3" />
          {cliente.nome}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>E-mail:</strong> {cliente.email}</p>
          <p><strong>Telefone:</strong> {cliente.telefone}</p>
          <p><strong>Documento:</strong> {cliente.documento} ({cliente.tipo_pessoa})</p>
          <p><strong>Endereço:</strong> {cliente.endereco}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-brand-blue mb-4 flex items-center">
          <FiFileText className="mr-3" />
          Histórico de Orçamentos
        </h2>
        {orcamentos.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="p-4 font-bold text-gray-600">Nº Orçamento</th>
                <th className="p-4 font-bold text-gray-600">Descrição</th>
                <th className="p-4 font-bold text-gray-600">Data</th>
                <th className="p-4 font-bold text-gray-600">Valor Total</th>
                <th className="p-4 font-bold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.map((orcamento) => (
                <tr key={orcamento.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {/* O NÚMERO DO ORÇAMENTO AGORA É UM LINK CLICÁVEL */}
                  <td className="p-4 font-mono font-semibold text-brand-blue hover:underline">
                    <Link to={`/orcamentos/${orcamento.id}`}>
                      {orcamento.numero_orcamento}
                    </Link>
                  </td>
                  <td className="p-4">{orcamento.descricao}</td>
                  <td className="p-4">{new Date(orcamento.data_orcamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                  <td className="p-4">R$ {orcamento.valor_total.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4">{orcamento.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Este cliente ainda não possui orçamentos.</p>
        )}
      </div>
    </div>
  );
};

export default ClienteDetailPage;