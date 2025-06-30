import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiXCircle } from 'react-icons/fi';
import api from '../api/api';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';

const ClienteFormPage = () => {
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);
  
   const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Aplica os filtros em tempo real
    if (name === 'nome') {
      // Permite apenas letras, espaços e os caracteres comuns em nomes/razões sociais
      processedValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s.\-&]/g, '');
    } else if (name === 'telefone') {
      // Permite apenas números e os caracteres de formatação de telefone
      processedValue = value.replace(/[^0-9\s()-]/g, '').slice(0, 15); // Limita a 15 caracteres
    } else if (name === 'documento') {
      // Permite apenas números
      processedValue = value.replace(/[^0-9]/g, '');
      // Limita o tamanho com base no tipo de pessoa
      const maxLength = formData.tipo_pessoa === 'FISICA' ? 11 : 14;
      processedValue = processedValue.slice(0, maxLength);
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  // A função de validação continua a ser a segurança final antes do envio
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'O nome é obrigatório.';
    if (!formData.email) newErrors.email = 'O e-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Formato de e-mail inválido.';
    
    if (!formData.documento) newErrors.documento = 'O documento é obrigatório.';
    else if (formData.tipo_pessoa === 'FISICA' && !cpfValidator.isValid(formData.documento)) newErrors.documento = 'CPF inválido.';
    else if (formData.tipo_pessoa === 'JURIDICA' && !cnpjValidator.isValid(formData.documento)) newErrors.documento = 'CNPJ inválido.';

    if (!formData.telefone) newErrors.telefone = 'O telefone é obrigatório.';
    if (!formData.endereco) newErrors.endereco = 'O endereço é obrigatório.';
    if (!formData.data_nascimento) newErrors.data_nascimento = 'A data é obrigatória.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.post('/clientes', formData);
      alert('Cliente cadastrado com sucesso!');
      navigate('/clientes');
    } catch (err) {
      const errorMessage = err.response?.data?.errors ? err.response.data.errors[0].msg : (err.response?.data?.erro || 'Ocorreu um erro desconhecido');
      setErrors({ api: errorMessage });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">Novo Cliente</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-4">
        
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo / Razão Social</label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required 
                 className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required 
                   className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required
                   className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`} />
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
            <input type="text" name="documento" id="documento" value={formData.documento} onChange={handleChange} required 
                   maxLength={formData.tipo_pessoa === 'FISICA' ? 11 : 14} // Limite dinâmico
                   className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.documento ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} required
                   className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.endereco ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.endereco && <p className="mt-1 text-sm text-red-600">{errors.endereco}</p>}
          </div>
          <div>
            <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento / Fundação</label>
            <input type="date" name="data_nascimento" id="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required 
                   className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'}`} />
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
            {loading ? 'A salvar...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteFormPage;