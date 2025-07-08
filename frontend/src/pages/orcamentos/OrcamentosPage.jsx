import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiPlus,
  FiSearch,
  FiRotateCw,
  FiInfo,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../../api/api";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const OrcamentosPage = ({
  orcamentos,
  setOrcamentos,
  filtros,
  setFiltros,
  buscaRealizada,
  setBuscaRealizada,
  dadosPaginacao,
  setDadosPaginacao,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orcamentoParaApagar, setOrcamentoParaApagar] = useState(null);

  const handleSearch = async (pagina = 1) => {
    setLoading(true);
    if (!buscaRealizada) setBuscaRealizada(true);

    const params = { ...filtros, pagina, limite: dadosPaginacao.limite };
    if (!params.nome_cliente) delete params.nome_cliente;
    if (!params.numero_orcamento) delete params.numero_orcamento;

    try {
      const response = await api.get("/orcamentos", { params });
      setOrcamentos(response.data.orcamentos);
      setDadosPaginacao({
        pagina: response.data.pagina,
        limite: response.data.limite,
        total: response.data.total,
      });
    } catch (error) {
      toast.error("Falha ao buscar orçamentos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.refresh) {
      handleSearch(1);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handleClearFilters = () => {
    setFiltros({ numero_orcamento: "", nome_cliente: "", status: "TODOS" });
    setOrcamentos([]);
    setDadosPaginacao({ pagina: 1, limite: 10, total: 0 });
    setBuscaRealizada(false);
  };

  const handleDeleteClick = (orcamento) => {
    setOrcamentoParaApagar(orcamento);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orcamentoParaApagar) return;
    try {
      await api.delete(`/orcamentos/${orcamentoParaApagar.id}`);
      toast.success("Orçamento apagado com sucesso!");
      handleSearch(dadosPaginacao.pagina);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Falha ao apagar o orçamento.");
    } finally {
      setIsModalOpen(false);
      setOrcamentoParaApagar(null);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center">
          <FiFileText className="mr-3" /> Gestão de Orçamentos
        </h1>
        <Link
          to="/orcamentos/novo"
          className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors"
        >
          <FiPlus className="mr-2" /> Adicionar Orçamento
        </Link>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nome_cliente" className="block text-sm font-medium text-gray-700">
                Nome do Cliente
              </label>
              <input
                type="text"
                name="nome_cliente"
                id="nome_cliente"
                value={filtros.nome_cliente}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
                placeholder="Digite o nome do cliente..."
              />
            </div>
            <div>
              <label htmlFor="numero_orcamento" className="block text-sm font-medium text-gray-700">
                Nº do Orçamento
              </label>
              <input
                type="text"
                name="numero_orcamento"
                id="numero_orcamento"
                value={filtros.numero_orcamento}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
                placeholder="Digite o número..."
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={filtros.status}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
              >
                <option value="TODOS">Todos</option>
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADO">Aprovado</option>
                <option value="REPROVADO">Reprovado</option>
                <option value="EM PRODUCAO">Em Produção</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="ENTREGUE">Entregue</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button type="button" onClick={handleClearFilters} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
              <FiRotateCw className="mr-2" /> Limpar
            </button>
            <button type="submit" className="bg-brand-yellow text-brand-blue font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
              <FiSearch className="mr-2" /> Procurar
            </button>
          </div>
        </form>
      </div>
      
      {!buscaRealizada ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Faça uma busca para ver os orçamentos.</h3>
          <p className="text-gray-500">Utilize os filtros acima para encontrar um orçamento específico.</p>
        </div>
      ) : loading ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">Carregando...</div>
      ) : orcamentos.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">Nenhum orçamento encontrado.</div>
      ) : (
        <>
          {/* Tabela para Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="p-4 font-bold text-gray-600">Nº Orçamento</th>
                  <th className="p-4 font-bold text-gray-600">Cliente</th>
                  <th className="p-4 font-bold text-gray-600">Data</th>
                  <th className="p-4 font-bold text-gray-600 text-right">Valor Total</th>
                  <th className="p-4 font-bold text-gray-600 text-center">Status</th>
                  <th className="p-4 font-bold text-gray-600 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map((orcamento) => (
                  <tr key={orcamento.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-mono font-semibold text-brand-blue hover:underline whitespace-nowrap">
                      <Link to={`/orcamentos/${orcamento.id}`}>{orcamento.numero_orcamento}</Link>
                    </td>
                    <td className="p-4">{orcamento.nome_cliente}</td>
                    <td className="p-4 whitespace-nowrap">{formatDate(orcamento.data_orcamento)}</td>
                    <td className="p-4 text-right whitespace-nowrap">{formatCurrency(orcamento.valor_total)}</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={orcamento.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/orcamentos/${orcamento.id}/editar`} title="Editar" className="text-blue-600 hover:text-blue-800 transition-colors">
                          <FiEdit size={18} />
                        </Link>
                        <button onClick={() => handleDeleteClick(orcamento)} title="Apagar" className="text-red-600 hover:text-red-800 transition-colors">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para Mobile */}
          <div className="md:hidden space-y-4">
            {orcamentos.map(orcamento => (
              <div key={orcamento.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <Link to={`/orcamentos/${orcamento.id}`} className="font-bold text-brand-blue text-lg font-mono">{orcamento.numero_orcamento}</Link>
                  <div className="flex items-center space-x-3">
                    <Link to={`/orcamentos/${orcamento.id}/editar`} title="Editar" className="text-blue-600">
                      <FiEdit size={18} />
                    </Link>
                    <button onClick={() => handleDeleteClick(orcamento)} title="Apagar" className="text-red-600">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-2">
                  <p><strong>Cliente:</strong> {orcamento.nome_cliente}</p>
                  <p><strong>Data:</strong> {formatDate(orcamento.data_orcamento)}</p>
                  <p><strong>Valor:</strong> <span className="font-semibold">{formatCurrency(orcamento.valor_total)}</span></p>
                  <div className="flex items-center">
                    <strong className="mr-2">Status:</strong>
                    <StatusBadge status={orcamento.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Pagination
            pagina={dadosPaginacao.pagina}
            limite={dadosPaginacao.limite}
            total={dadosPaginacao.total}
            onPageChange={handleSearch}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza de que deseja apagar o orçamento "${orcamentoParaApagar?.numero_orcamento}"?`}
      />
    </div>
  );
};

export default OrcamentosPage;