import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import { FiUsers, FiPlus, FiSearch, FiEdit, FiTrash2, FiInfo, FiRotateCw } from 'react-icons/fi';
import api from '../api/api';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tipoFiltro, setTipoFiltro] = useState('nome');
  const [termoBusca, setTermoBusca] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  // Esta função agora é chamada pelo formulário de busca
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError(null);
    setBuscaRealizada(true);

    const params = {
      pagina: 1,
      limite: 10,
    };

    if (termoBusca) {
      params[tipoFiltro] = termoBusca;
    }

    try {
      const response = await api.get('/clientes', { params });
      setClientes(response.data.clientes);
      // TODO: Implementar a lógica de paginação com os dados de 'total' e 'pagina'
    } catch (err) {
      setError('Falha ao buscar clientes. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar a busca e redefinir a tela
  const handleClearSearch = () => {
    setTipoFiltro('nome');
    setTermoBusca('');
    setClientes([]);
    setBuscaRealizada(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center">
          <FiUsers className="mr-3" />
          Gestão de Clientes
        </h1>
        <Link 
          to="/clientes/novo"
          className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors"
        >
          <FiPlus className="mr-2" />
          Adicionar Cliente
        </Link>
      </div>

      {/* Painel de Busca atualizado com o botão Limpar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipo-filtro" className="block text-sm font-medium text-gray-700">Filtrar por</label>
              <select
                id="tipo-filtro"
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
              >
                <option value="nome">Nome</option>
                <option value="documento">Documento</option>
                <option value="telefone">Telefone</option>
              </select>
            </div>
            <div>
              <label htmlFor="termo-busca" className="block text-sm font-medium text-gray-700">Termo de Busca</label>
              <input
                type="text"
                id="termo-busca"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder={`Digite o ${tipoFiltro} do cliente...`}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClearSearch}
              className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
            >
              <FiRotateCw className="mr-2" />
              Limpar
            </button>
            <button
              type="submit"
              className="bg-brand-yellow text-brand-blue font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <FiSearch className="mr-2" />
              Procurar
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        { !buscaRealizada ? (
          <div className="text-center p-12 text-gray-500">
            <FiInfo className="mx-auto text-4xl mb-4" />
            <h3 className="text-lg font-semibold">Faça uma busca para ver os clientes.</h3>
            <p>Utilize os filtros acima para encontrar um cliente específico ou deixe em branco e clique em "Procurar" para listar todos.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="p-4 font-bold text-gray-600">Nome</th>
                <th className="p-4 font-bold text-gray-600">Documento</th>
                <th className="p-4 font-bold text-gray-600">Telefone</th>
                <th className="p-4 font-bold text-gray-600">E-mail</th>
                <th className="p-4 font-bold text-gray-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">A carregar...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="text-center p-4 text-red-500">{error}</td></tr>
              ) : clientes.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Nenhum cliente encontrado para os critérios informados.</td></tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-semibold text-brand-blue hover:underline">
                      {/* O NOME AGORA É UM LINK CLICÁVEL */}
                      <Link to={`/clientes/${cliente.id}`}>
                        {cliente.nome}
                      </Link>
                    </td>
                    <td className="p-4">{cliente.documento}</td>
                    <td className="p-4">{cliente.telefone}</td>
                    <td className="p-4">{cliente.email}</td>
                    <td className="p-4 text-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800"><FiEdit /></button>
                      <button className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientesPage;