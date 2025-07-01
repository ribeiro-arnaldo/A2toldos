import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiXCircle } from 'react-icons/fi';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';

const ClienteEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo_pessoa: 'FISICA',
    documento: '',
    endereco: '',
    data_nascimento: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        const dataFormatada = response.data.data_nascimento.split('T')[0];
        setFormData({ ...response.data, data_nascimento: dataFormatada });
      } catch (error) {
        toast.error('Falha ao carregar dados do cliente.');
        navigate('/clientes');
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'nome') {
      processedValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s.\-&]/g, '');
    } else if (name === 'telefone') {
      // Remove tudo que não for dígito e LIMITA a 11 caracteres
      processedValue = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'documento') {
      processedValue = value.replace(/\D/g, '');
      const maxLength = formData.tipo_pessoa === 'FISICA' ? 11 : 14;
      processedValue = processedValue.slice(0, maxLength);
    }
    
    setFormData(prevState => ({ ...prevState, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'O nome é obrigatório.';
    if (!formData.email) newErrors.email = 'O e-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Formato de e-mail inválido.';
    
    // Validação de telefone
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
      await api.put(`/clientes/${id}`, formData);
      toast.success('Cliente atualizado com sucesso!');
      navigate('/clientes', { state: { refresh: true } });
    } catch (err) {
      const errorMessage = err.response?.data?.erro || 'Ocorreu um erro desconhecido.';
      setErrors({ api: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nome) {
    return <div className="p-6">A carregar dados para edição...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-4" noValidate>
        {/* O JSX do formulário é idêntico ao de criação, então foi omitido para brevidade, mas deve ser igual */}
        {/* ... cole aqui todo o JSX de dentro do <form> da página de criação ... */}
         <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo / Razão Social</label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tipo_pessoa" className="block text-sm font-medium text-gray-700">Tipo de Pessoa</label>
            <select name="tipo_pessoa" id="tipo_pessoa" value={formData.tipo_pessoa} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow">
              <option value="FISICA">Pessoa Física</option>
              <option value="JURIDICA">Pessoa Jurídica</option>
            </select>
          </div>
          <div>
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700">CPF / CNPJ</label>
            <input type="text" name="documento" id="documento" value={formData.documento} onChange={handleChange} required maxLength={14} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.documento ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow" />
          </div>
          <div>
            <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento / Fundação</label>
            <input type="date" name="data_nascimento" id="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.data_nascimento && <p className="mt-1 text-sm text-red-600">{errors.data_nascimento}</p>}
          </div>
        </div>
        {errors.api && (
          <div className="p-3 my-4 text-center text-sm text-red-800 bg-red-100 rounded-lg">
            {errors.api}
          </div>
        )}
        <div className="pt-4 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/clientes')} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
            <FiXCircle className="mr-2" />
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg flex items-center hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
            <FiSave className="mr-2" />
            {loading ? 'A salvar...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteEditPage;