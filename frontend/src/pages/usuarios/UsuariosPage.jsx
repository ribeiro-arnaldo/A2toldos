import React, { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioParaApagar, setUsuarioParaApagar] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast.error("Falha ao buscar usuários.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDeleteClick = (usuario) => {
    setUsuarioParaApagar(usuario);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!usuarioParaApagar) return;
    try {
      await api.delete(`/usuarios/${usuarioParaApagar.id}`);
      toast.success('Usuário apagado com sucesso!');
      setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== usuarioParaApagar.id));
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Falha ao apagar o usuário.');
    } finally {
      setIsModalOpen(false);
      setUsuarioParaApagar(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center">
          <FiUsers className="mr-3" /> Gestão de Usuários
        </h1>
        <Link to="/usuarios/novo" className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors">
          <FiPlus className="mr-2" /> Adicionar Usuário
        </Link>
      </div>

      {loading ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">Carregando...</div>
      ) : usuarios.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">Nenhum usuário encontrado.</div>
      ) : (
        <>
          {/* Tabela para Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="p-4 font-bold text-gray-600">Nome</th>
                  <th className="p-4 font-bold text-gray-600">E-mail</th>
                  <th className="p-4 font-bold text-gray-600">Perfil</th>
                  <th className="p-4 font-bold text-gray-600 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-semibold">{usuario.nome}</td>
                    <td className="p-4">{usuario.email}</td>
                    <td className="p-4">{usuario.perfil}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/usuarios/${usuario.id}/editar`} title="Editar" className="text-blue-600 hover:text-blue-800 transition-colors">
                          <FiEdit size={18} />
                        </Link>
                        <button onClick={() => handleDeleteClick(usuario)} title="Apagar" className="text-red-600 hover:text-red-800 transition-colors">
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
            {usuarios.map(usuario => (
              <div key={usuario.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-brand-blue text-lg">{usuario.nome}</p>
                  <div className="flex items-center space-x-3">
                    <Link to={`/usuarios/${usuario.id}/editar`} title="Editar" className="text-blue-600">
                      <FiEdit size={18} />
                    </Link>
                    <button onClick={() => handleDeleteClick(usuario)} title="Apagar" className="text-red-600">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p><strong>E-mail:</strong> {usuario.email}</p>
                  <p><strong>Perfil:</strong> {usuario.perfil}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza de que deseja apagar o usuário "${usuarioParaApagar?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default UsuariosPage;