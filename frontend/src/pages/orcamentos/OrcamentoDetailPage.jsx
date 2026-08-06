import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiArrowLeft,
  FiGrid,
  FiEdit,
  FiSave,
  FiPrinter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/api";
import StatusBadge from "../../components/common/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { gerarOrcamentoPDF } from "../../services/pdfService";
import { useAuth } from "../../context/AuthContext";

const OrcamentoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  const [orcamento, setOrcamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [novoStatus, setNovoStatus] = useState("");
  const [novaDataInstalacao, setNovaDataInstalacao] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const fetchOrcamento = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/orcamentos/${id}`);
        setOrcamento(response.data);
        setNovoStatus(response.data.status);
        setNovaDataInstalacao(response.data.data_instalacao || "");
      } catch (err) {
        const errorMessage =
          err.response?.data?.erro ||
          "Falha ao carregar os dados do orçamento.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Erro ao carregar orçamento:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrcamento();
  }, [id]);

  // Regras de validação de status e obrigatoriedade da data
  const statusUpper = novoStatus ? novoStatus.toUpperCase() : "";
  const isConcluido = statusUpper === "CONCLUIDO";
  const isDataObrigatoriaFaltando = isConcluido && !novaDataInstalacao;
  const precisaDeData = ["EM PRODUCAO", "CONCLUIDO"].includes(statusUpper);

  const handleStatusUpdate = async () => {
    if (isDataObrigatoriaFaltando) {
      toast.error("Para marcar como Concluído, a Data de Instalação é obrigatória!");
      return;
    }

    setLoadingStatus(true);
    try {
      await api.patch(`/orcamentos/${id}/status`, { 
        status: novoStatus,
        data_instalacao: novaDataInstalacao || null
      });
      
      toast.success("Status atualizado com sucesso!");
      setOrcamento((prev) => ({ 
        ...prev, 
        status: novoStatus,
        data_instalacao: novaDataInstalacao 
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.erro || "Falha ao atualizar o status.";
      toast.error(errorMessage);
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  if (loading)
    return (
      <div className="text-center p-12">
        A carregar detalhes do orçamento...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-12">{error}</div>;
  if (!orcamento)
    return <div className="text-center p-12">Orçamento não encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate("/orcamentos", { state: { refresh: true } })}
        className="inline-flex items-center text-brand-blue font-semibold hover:underline mb-6"
      >
        <FiArrowLeft className="mr-2" /> Voltar
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-blue flex items-center">
              <FiFileText className="mr-3" />
              Detalhes do Orçamento
            </h1>
            <p className="font-mono text-lg text-gray-600 mt-1">
              {orcamento.numero_orcamento}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusBadge status={orcamento.status} />
            <button
              onClick={() => gerarOrcamentoPDF(orcamento, usuario)}
              className="text-gray-600 hover:text-brand-blue transition-colors"
              title="Gerar PDF"
            >
              <FiPrinter size={20} />
            </button>
            <Link
              to={`/orcamentos/${id}/editar`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Editar Orçamento"
            >
              <FiEdit size={20} />
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Alterar Status
          </h3>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3 w-full">
            <select
              value={novoStatus}
              onChange={(e) => setNovoStatus(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
              <option value="EM PRODUCAO">Em Produção</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="ENTREGUE">Entregue</option>
            </select>

            {/* Renderização Condicional do Calendário com a Label "Instalação:" */}
            {precisaDeData && (
              <div className="w-full md:w-1/3 flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Instalação:</span>
                <input
                  type="date"
                  value={novaDataInstalacao}
                  onChange={(e) => setNovaDataInstalacao(e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${
                    isDataObrigatoriaFaltando ? 'border-red-500' : 'border-gray-300'
                  }`}
                  title="Data de Instalação"
                />
              </div>
            )}

            <button
              onClick={handleStatusUpdate}
              disabled={
                loadingStatus || 
                (novoStatus === orcamento.status && novaDataInstalacao === (orcamento.data_instalacao || "")) ||
                isDataObrigatoriaFaltando
              }
              className="w-full md:w-auto bg-brand-blue text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
            >
              <FiSave className="mr-2" />
              {loadingStatus ? "Salvando..." : "Salvar"}
            </button>
          </div>
          
          {precisaDeData && !isDataObrigatoriaFaltando && (
            <p className="text-xs text-gray-500 mt-2">
              * Confirme ou altere a Data de Instalação para refletir no Painel.
            </p>
          )}
          {isDataObrigatoriaFaltando && (
            <p className="text-xs text-red-600 font-bold mt-2">
              * Para marcar como Concluído, a Data de Instalação é obrigatória.
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700">
            <p>
              <strong>Cliente:</strong> {orcamento.nome_cliente}
            </p>
            <p>
              <strong>Data Criação:</strong> {formatDate(orcamento.data_orcamento)}
            </p>
            <p>
              <strong>Instalação:</strong> {orcamento.data_instalacao ? formatDate(orcamento.data_instalacao) : 'A definir'}
            </p>
            <p className="text-xl font-bold">
              <strong>Valor Total:</strong>{" "}
              {formatCurrency(orcamento.valor_total)}
            </p>
          </div>
          <div className="md:hidden space-y-3 text-gray-700">
            <p>
              <strong>Cliente:</strong>
              <br />
              {orcamento.nome_cliente}
            </p>
            <p>
              <strong>Data Criação:</strong>
              <br />
              {formatDate(orcamento.data_orcamento)}
            </p>
            <p>
              <strong>Instalação:</strong>
              <br />
              {orcamento.data_instalacao ? formatDate(orcamento.data_instalacao) : 'A definir'}
            </p>
            <p className="text-xl font-bold">
              <strong>Valor Total:</strong>
              <br />
              {formatCurrency(orcamento.valor_total)}
            </p>
          </div>
          {orcamento.descricao && (
            <p className="mt-4">
              <strong>Descrição:</strong> {orcamento.descricao}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <FiGrid className="mr-2" />
          Itens do Orçamento
        </h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="p-4 font-bold text-gray-600">
                  Descrição do Item
                </th>
                <th className="p-4 font-bold text-gray-600">Cor</th>
                <th className="p-4 font-bold text-gray-600">Observações</th>
                <th className="p-4 font-bold text-gray-600 text-center">
                  Largura (m)
                </th>
                <th className="p-4 font-bold text-gray-600 text-center">
                  Comprimento (m)
                </th>
                <th className="p-4 font-bold text-gray-600 text-right">
                  Preço/m²
                </th>
                <th className="p-4 font-bold text-gray-600 text-right">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {orcamento.itens &&
                orcamento.itens.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-4">{item.descricao_item || "-"}</td>
                    <td className="p-4">{item.cor || "-"}</td>
                    <td className="p-4">{item.observacoes || "-"}</td>
                    <td className="p-4 text-center">
                      {item.largura.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      {item.comprimento.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      {formatCurrency(item.preco_m2)}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {formatCurrency(item.valor_item)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {orcamento.itens &&
            orcamento.itens.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <p className="font-bold text-gray-800">{item.descricao_item}</p>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>
                    <strong>Cor:</strong> {item.cor || "-"}
                  </p>
                  <p>
                    <strong>Medidas:</strong> {item.largura.toFixed(2)}m x{" "}
                    {item.comprimento.toFixed(2)}m
                  </p>
                  {item.observacoes && (
                    <p>
                      <strong>Obs:</strong> {item.observacoes}
                    </p>
                  )}
                </div>
                <div className="text-right font-bold text-gray-800 mt-2 border-t pt-2">
                  {formatCurrency(item.valor_item)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrcamentoDetailPage;