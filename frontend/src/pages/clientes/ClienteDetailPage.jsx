import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiUser, FiFileText, FiArrowLeft, FiEdit } from "react-icons/fi";
import api from "../../api/api";
import StatusBadge from "../../components/common/StatusBadge";
import {
  formatarDocumento,
  formatarTelefone,
  formatDate,
  formatCurrency,
} from "../../utils/formatters";

const ClienteDetailPage = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resCliente, resOrcamentos] = await Promise.all([
          api.get(`/clientes/${id}`),
          api.get(`/orcamentos?cliente_id=${id}&limite=1000`),
        ]);

        setCliente(resCliente.data);
        setOrcamentos(resOrcamentos.data.orcamentos);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar os dados do cliente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center">A carregar dados do cliente...</div>
    );
  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;
  if (!cliente)
    return <div className="p-6 text-center">Cliente não encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate("/clientes", { state: { refresh: true } })}
        className="inline-flex items-center text-brand-blue font-semibold hover:underline mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Voltar para a Lista de Clientes
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-brand-blue flex items-center mb-4">
            <FiUser className="mr-3" />
            {cliente.nome}
          </h1>
          <Link
            to={`/clientes/${cliente.id}/editar`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Editar Cliente"
          >
            <FiEdit size={20} />
          </Link>
        </div>

        {/* --- CORREÇÃO: VISTA DESKTOP --- */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>E-mail:</strong> {cliente.email}
          </p>
          <p>
            <strong>Telefone:</strong> {formatarTelefone(cliente.telefone)}
          </p>
          <p>
            <strong>Documento:</strong>{" "}
            {formatarDocumento(cliente.documento, cliente.tipo_pessoa)}
          </p>
          <p>
            <strong>Endereço:</strong> {cliente.endereco}
          </p>
        </div>

        {/* --- CORREÇÃO: CARD MOBILE --- */}
        <div className="md:hidden space-y-3 text-gray-700">
          <p>
            <strong>E-mail:</strong>
            <br />
            {cliente.email}
          </p>
          <p>
            <strong>Telefone:</strong>
            <br />
            {formatarTelefone(cliente.telefone)}
          </p>
          <p>
            <strong>Documento:</strong>
            <br />
            {formatarDocumento(cliente.documento, cliente.tipo_pessoa)}
          </p>
          <p>
            <strong>Endereço:</strong>
            <br />
            {cliente.endereco}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-brand-blue mb-4 flex items-center">
          <FiFileText className="mr-3" />
          Histórico de Orçamentos
        </h2>

        {/* --- VISTA DESKTOP (TABELA) --- */}
        <div className="hidden md:block overflow-x-auto">
          {orcamentos.length > 0 ? (
            <table className="w-full text-left">
              {/* ... Thead da tabela ... */}
              <tbody>
                {orcamentos.map((orcamento) => (
                  <tr
                    key={orcamento.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-mono font-semibold text-brand-blue hover:underline whitespace-nowrap">
                      <Link to={`/orcamentos/${orcamento.id}`}>
                        {orcamento.numero_orcamento}
                      </Link>
                    </td>
                    <td className="p-4">{orcamento.descricao}</td>
                    <td className="p-4 whitespace-nowrap">
                      {formatDate(orcamento.data_orcamento)}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {formatCurrency(orcamento.valor_total)}
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={orcamento.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">
              Este cliente ainda não possui orçamentos.
            </p>
          )}
        </div>

        {/* --- VISTA MOBILE (CARDS) --- */}
        <div className="md:hidden space-y-4">
          {orcamentos.length > 0 ? (
            orcamentos.map((orcamento) => (
              <Link
                to={`/orcamentos/${orcamento.id}`}
                key={orcamento.id}
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="font-mono text-brand-blue">
                    {orcamento.numero_orcamento}
                  </span>
                  <StatusBadge status={orcamento.status} />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {orcamento.descricao}
                </p>
                <div className="flex justify-between text-sm mt-2 text-gray-800">
                  <span>{formatDate(orcamento.data_orcamento)}</span>
                  <span className="font-semibold">
                    {formatCurrency(orcamento.valor_total)}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">
              Este cliente ainda não possui orçamentos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetailPage;
