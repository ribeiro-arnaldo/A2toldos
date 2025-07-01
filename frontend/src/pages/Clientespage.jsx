import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiPlus, FiSearch, FiEdit, FiTrash2, FiInfo, FiRotateCw } from 'react-icons/fi';
import api from '../api/api';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

// Funções auxiliares para formatar os dados para exibição
const formatarDocumento = (doc, tipo) => {
  if (!doc) return '';
  const docLimpo = String(doc).replace(/\D/g, '');
  if (tipo === 'FISICA') {
    return docLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return docLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const formatarTelefone = (tel) => {
  if (!tel) return '';
  const telLimpo = String(tel).replace(/\D/g, '');
  if (telLimpo.length === 11) {
    return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};


// O componente recebe o estado dos clientes do App.jsx
const ClientesPage = ({ clientes, setClientes, buscaRealizada, setBuscaRealizada }) => {
  // Estado para controlar o loading e os inputs do formulário de busca
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteParaApagar, setClienteParaApagar] = useState(null);
  
  // Estado local para os campos de busca
  const [tipoFiltro, setTipoFiltro] = useState('nome');
  const [termoBusca, setTermoBusca] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setBuscaRealizada(true); // Informa ao App que uma busca foi feita

    const params = { pagina: 1, limite: 10 }; // Você pode adicionar paginação aqui no futuro
    if (termoBusca) {
      // Limpa o termo de busca para documentos e telefones antes de enviar
      if (tipoFiltro === 'documento' || tipoFiltro === 'telefone') {
        params[tipoFiltro] = termoBusca.replace(/\D/g, '');
      } else {
        params[tipoFiltro] = termoBusca;
      }
    }

    try {
      const response = await api.get('/clientes', { params });
      setClientes(response.data.clientes); // Atualiza o estado no App.jsx
    } catch (err) {
      setError('Falha ao buscar clientes.');
      toast.error('Falha ao buscar clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setTipoFiltro('nome');
    setTermoBusca('');
    setClientes([]);
    setBuscaRealizada(false);
    setError(null);
  };

  const handleDeleteClick = (cliente) => {
    setClienteParaApagar(cliente);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteParaApagar) return;
    try {
      await api.delete(`/clientes/${clienteParaApagar.id}`);
      // Atualiza a lista de clientes removendo o que foi apagado
      setClientes(clientes.filter(cliente => cliente.id !== clienteParaApagar.id));
      toast.success('Cliente apagado com sucesso!');
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Falha ao apagar o cliente.');
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setClienteParaApagar(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center"><FiUsers className="mr-3" /> Gestão de Clientes</h1>
        <Link to="/clientes/novo" className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors"><FiPlus className="mr-2" /> Adicionar Cliente</Link>
      </div>
      
      {/* Formulário de Busca */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipo-filtro" className="block text-sm font-medium text-gray-700">Filtrar por</label>
              <select id="tipo-filtro" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow">
                <option value="nome">Nome</option>
                <option value="documento">Documento</option>
                <option value="telefone">Telefone</option>
              </select>
            </div>
            <div>
              <label htmlFor="termo-busca" className="block text-sm font-medium text-gray-700">Termo de Busca</label>
              <input type="text" id="termo-busca" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow" value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} placeholder={`Digite o ${tipoFiltro} do cliente...`} />
            </div>
          </div>
          <div className="md:col-span-2 mt-4 flex justify-end space-x-4">
            <button type="button" onClick={handleClearSearch} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center hover:bg-gray-300 transition-colors"><FiRotateCw className="mr-2" /> Limpar</button>
            <button type="submit" className="bg-brand-yellow text-brand-blue font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"><FiSearch className="mr-2" /> Procurar</button>
          </div>
        </form>
      </div>

      {/* Tabela de Resultados */}
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
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Nenhum cliente encontrado.</td></tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-semibold text-brand-blue hover:underline"><Link to={`/clientes/${cliente.id}`}>{cliente.nome}</Link></td>
                    <td className="p-4">{formatarDocumento(cliente.documento, cliente.tipo_pessoa)}</td>
                    <td className="p-4">{formatarTelefone(cliente.telefone)}</td>
                    <td className="p-4">{cliente.email}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/clientes/${cliente.id}/editar`} title="Editar" className="text-blue-600 hover:text-blue-800 transition-colors"><FiEdit size={18} /></Link>
                        <button onClick={() => handleDeleteClick(cliente)} title="Apagar" className="text-red-600 hover:text-red-800 transition-colors"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza de que deseja apagar o cliente "${clienteParaApagar?.nome}"? Orçamentos associados também poderão ser afetados.`}
      />
    </div>
  );
};

export default ClientesPage;