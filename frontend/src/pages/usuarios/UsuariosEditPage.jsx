import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit, FiSave, FiXCircle, FiLoader } from 'react-icons/fi';
import api from '../../api/api';
import toast from 'react-hot-toast';
import UsuarioForm from '../../components/usuarios/UsuarioForm';

const UsuariosEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '', // Senha começa vazia por segurança
    perfil: 'VENDEDOR',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Efeito para buscar os dados do usuário a ser editado
  useEffect(() => {
    const fetchUsuario = async () => {
      // Apenas ADM_FULL pode carregar os dados
      try {
        const response = await api.get(`/usuarios/${id}`);
        const { nome, email, perfil } = response.data;
        setFormData({ nome, email, perfil, senha: '' }); // Preenche o form com dados existentes
      } catch (error) {
        toast.error('Falha ao carregar dados do usuário.');
        navigate('/usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = "O nome é obrigatório.";
    if (!formData.email) newErrors.email = "O e-mail é obrigatório.";
    // A senha é opcional na edição, mas se preenchida, deve ter um tamanho mínimo
    if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = "A nova senha deve ter pelo menos 6 caracteres.";
    }
    if (!formData.perfil) newErrors.perfil = "O perfil é obrigatório.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Por favor, corrija os erros indicados.");
      return;
    }
    setLoading(true);
    setErrors({});

    // Prepara os dados para enviar, removendo a senha se o campo estiver vazio
    const payload = { ...formData };
    if (!payload.senha) {
      delete payload.senha;
    }

    try {
      await api.put(`/usuarios/${id}`, payload);
      toast.success('Usuário atualizado com sucesso!');
      // Navega de volta para a lista com o sinal de refresh
      navigate('/usuarios', { state: { refresh: true } }); 
    } catch (error) {
      toast.error(error.response?.data?.erro || 'Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">A carregar dados do usuário...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand-blue mb-6 flex items-center">
        <FiEdit className="mr-3" />
        Editar Usuário
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg" noValidate>
        {/* Reutilizamos nosso componente de formulário, passando isEditing=true */}
        <UsuarioForm formData={formData} setFormData={setFormData} errors={errors} isEditing={true} />
        <div className="pt-8 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/usuarios')} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
            <FiXCircle className="mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-48 bg-brand-blue text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
          >
            {loading ? (<FiLoader className="animate-spin mr-2" />) : (<FiSave className="mr-2" />)}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuariosEditPage;