import React, { useState, useEffect } from "react";
import { FiUsers, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        toast.error("Falha ao buscar usuários.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center">
          <FiUsers className="mr-3" /> Gestão de Usuários
        </h1>
        {/* O botão de adicionar ficará aqui no futuro */}
        {/* <Link to="/usuarios/novo" className="...">
          <FiPlus className="mr-2" /> Adicionar Usuário
        </Link> */}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-8">
                  A carregar...
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">{usuario.nome}</td>
                  <td className="p-4">{usuario.email}</td>
                  <td className="p-4">{usuario.perfil}</td>
                  <td className="p-4 text-center">
                    {/* Botões de editar/deletar virão aqui */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosPage;
