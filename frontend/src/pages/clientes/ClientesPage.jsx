import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUsers,
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
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { formatarDocumento, formatarTelefone } from "../../utils/formatters";

const ClientesPage = ({
  clientes,
  setClientes,
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
  const [clienteParaApagar, setClienteParaApagar] = useState(null);

  const handleSearch = useCallback(
    async (pagina = 1) => {
      setLoading(true);
      if (!buscaRealizada) setBuscaRealizada(true);

      const params = {
        pagina,
        limite: dadosPaginacao.limite,
      };
      if (filtros.termo && filtros.termo.trim() !== "") {
        params.tipo = filtros.tipo;
        params.termo = filtros.termo;
      }

      try {
        const response = await api.get("/clientes", { params });
        setClientes(response.data.clientes);
        setDadosPaginacao({
          pagina: response.data.pagina,
          limite: response.data.limite,
          total: response.data.total,
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.erro || "Falha ao buscar clientes.";
        toast.error(errorMessage);
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      buscaRealizada,
      dadosPaginacao.limite,
      filtros,
      setBuscaRealizada,
      setClientes,
      setDadosPaginacao,
      setLoading,
    ]
  );

  useEffect(() => {
    if (location.state?.refresh) {
      handleSearch(1);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, handleSearch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handleClearFilters = useCallback(() => {
    setFiltros({ tipo: "nome", termo: "" });
    setClientes([]);
    setBuscaRealizada(false);
    setDadosPaginacao({ pagina: 1, limite: 10, total: 0 });
  }, [setClientes, setFiltros, setBuscaRealizada, setDadosPaginacao]);

  const handleDeleteClick = (cliente) => {
    setClienteParaApagar(cliente);
    setIsModalOpen(true);
  };

  const confirmDelete = useCallback(async () => {
    if (!clienteParaApagar) return;
    try {
      await api.delete(`/clientes/${clienteParaApagar.id}`);
      toast.success("Cliente apagado com sucesso!");
      handleSearch(dadosPaginacao.pagina);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Falha ao apagar o cliente.");
    } finally {
      setIsModalOpen(false);
      setClienteParaApagar(null);
    }
  }, [clienteParaApagar, dadosPaginacao.pagina, handleSearch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center">
          <FiUsers className="mr-3" /> Gestão de Clientes
        </h1>
        <Link
          to="/clientes/novo"
          className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors"
        >
          <FiPlus className="mr-2" /> Adicionar Cliente
        </Link>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label
                htmlFor="tipoFiltro"
                className="block text-sm font-medium text-gray-700"
              >
                Filtrar por
              </label>
              <select
                id="tipoFiltro"
                name="tipo"
                value={filtros.tipo}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
              >
                <option value="nome">Nome</option>
                <option value="documento">Documento</option>
                <option value="telefone">Telefone</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="termoBusca"
                className="block text-sm font-medium text-gray-700"
              >
                Termo de Busca
              </label>
              <input
                type="text"
                id="termoBusca"
                name="termo"
                value={filtros.termo}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
                placeholder={`Digite o ${filtros.tipo}...`}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
            >
              <FiRotateCw className="mr-2" /> Limpar
            </button>
            <button
              type="submit"
              className="bg-brand-yellow text-brand-blue font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <FiSearch className="mr-2" /> Procurar
            </button>
          </div>
        </form>
      </div>

      {!buscaRealizada ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            Faça uma busca para ver os clientes.
          </h3>
          <p className="text-gray-500">
            Utilize os filtros acima para encontrar um cliente específico.
          </p>
        </div>
      ) : loading ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          Carregando...
        </div>
      ) : clientes.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="p-4 font-bold text-gray-600">Nome</th>
                  <th className="p-4 font-bold text-gray-600">Documento</th>
                  <th className="p-4 font-bold text-gray-600">Telefone</th>
                  <th className="p-4 font-bold text-gray-600">E-mail</th>
                  <th className="p-4 font-bold text-gray-600 text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold text-brand-blue hover:underline">
                      <Link to={`/clientes/${cliente.id}`}>{cliente.nome}</Link>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {formatarDocumento(
                        cliente.documento,
                        cliente.tipo_pessoa
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {formatarTelefone(cliente.telefone)}
                    </td>
                    <td className="p-4">{cliente.email}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/clientes/${cliente.id}/editar`}
                          title="Editar"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(cliente)}
                          title="Apagar"
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/clientes/${cliente.id}`}
                    className="font-bold text-brand-blue text-lg"
                  >
                    {cliente.nome}
                  </Link>
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/clientes/${cliente.id}/editar`}
                      title="Editar"
                      className="text-blue-600"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(cliente)}
                      title="Apagar"
                      className="text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Documento:</strong>{" "}
                    {formatarDocumento(cliente.documento, cliente.tipo_pessoa)}
                  </p>
                  <p>
                    <strong>Telefone:</strong>{" "}
                    {formatarTelefone(cliente.telefone)}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {cliente.email}
                  </p>
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
        message={`Tem a certeza de que deseja apagar o cliente "${clienteParaApagar?.nome}"?`}
      />
    </div>
  );
};

export default ClientesPage;
