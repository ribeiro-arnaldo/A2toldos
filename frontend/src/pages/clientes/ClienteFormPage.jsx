import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiXCircle } from 'react-icons/fi';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import api from '../../api/api';
import toast from 'react-hot-toast';
import ClienteForm from '../../components/clientes/ClienteForm'; // Importa o formulário reutilizável

const ClienteFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '', email: '', telefone: '', tipo_pessoa: 'FISICA',
    documento: '', endereco: '', data_nascimento: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // A validação continua sendo responsabilidade da página
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'O nome é obrigatório.';
    if (!formData.email) newErrors.email = 'O e-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Formato de e-mail inválido.';
    
    const telefoneLimpo = formData.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length > 0 && telefoneLimpo.length < 10) {
        newErrors.telefone = 'O telefone deve ter 10 ou 11 dígitos.';
    }

    if (!formData.documento) newErrors.documento = 'O documento é obrigatório.';
    else if (formData.tipo_pessoa === 'FISICA' && !cpfValidator.isValid(formData.documento)) newErrors.documento = 'CPF inválido.';
    else if (formData.tipo_pessoa === 'JURIDICA' && !cnpjValidator.isValid(formData.documento)) newErrors.documento = 'CNPJ inválido.';
    
    if (!formData.data_nascimento) newErrors.data_nascimento = 'A data é obrigatória.';

    return newErrors;
  };

  // O envio do formulário (handleSubmit) também é responsabilidade da página
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Por favor, corrija os erros no formulário.');
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await api.post('/clientes', formData);
      toast.success('Cliente cadastrado com sucesso!');
      navigate('/clientes', { state: { refresh: true } });
    } catch (err) {
      const errorMessage = err.response?.data?.erro || 'Ocorreu um erro desconhecido.';
      setErrors({ api: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">Adicionar Novo Cliente</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg" noValidate>
        
        <ClienteForm formData={formData} setFormData={setFormData} errors={errors} />

        {errors.api && (
          <div className="p-3 my-4 text-center text-sm text-red-800 bg-red-100 rounded-lg">
            {errors.api}
          </div>
        )}

        <div className="pt-8 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/clientes')} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
            <FiXCircle className="mr-2" />
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg flex items-center hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
            <FiSave className="mr-2" />
            {loading ? 'A salvar...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteFormPage;