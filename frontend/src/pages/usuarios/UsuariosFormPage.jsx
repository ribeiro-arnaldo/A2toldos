import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUserPlus, FiSave, FiXCircle, FiLoader } from 'react-icons/fi';
import api from '../../api/api';
import toast from 'react-hot-toast';
import UsuarioForm from '../../components/usuarios/UsuarioForm';

const UsuariosFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: '', 
    perfil: 'VENDEDOR',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = "O nome é obrigatório.";
    if (!formData.email) newErrors.email = "O e-mail é obrigatório.";
  
    if (!formData.senha) {
      newErrors.senha = "A senha é obrigatória.";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres.";
    }
    
    if (formData.senha !== formData.confirmaSenha) {
      newErrors.confirmaSenha = "As senhas não coincidem.";
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
    try {      
      const { nome, email, senha, perfil } = formData;
      await api.post('/auth/register', { nome, email, senha, perfil });

      toast.success('Usuário cadastrado com sucesso!');
      navigate('/usuarios', { state: { refresh: true } });
    } catch (error) {
      toast.error(error.response?.data?.erro || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand-blue mb-6 flex items-center">
        <FiUserPlus className="mr-3" />
        Adicionar Novo Usuário
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg" noValidate>
        <UsuarioForm formData={formData} setFormData={setFormData} errors={errors} />
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
            {loading ? "Salvando..." : "Salvar Usuário"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuariosFormPage;