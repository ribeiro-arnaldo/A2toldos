import React from 'react';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';

const ClienteForm = ({ formData, setFormData, errors }) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'telefone') {
      processedValue = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'documento') {
      processedValue = value.replace(/\D/g, '');
      const maxLength = formData.tipo_pessoa === 'FISICA' ? 11 : 14;
      processedValue = processedValue.slice(0, maxLength);
    }
    
    setFormData(prevState => ({ ...prevState, [name]: processedValue }));
  };
  
  const formInputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo / Razão Social*</label>
        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleInputChange} required  
          className={`${formInputStyle} ${errors.nome ? 'border-red-500' : ''}`}
          placeholder="Digite o nome completo ou a razão social..."
        />
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail*</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required  
            className={`${formInputStyle} ${errors.email ? 'border-red-500' : ''}`}
            placeholder="exemplo@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleInputChange}
            className={`${formInputStyle} ${errors.telefone ? 'border-red-500' : ''}`}
            placeholder="(XX) 9XXXX-XXXX"
          />
          {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="tipo_pessoa" className="block text-sm font-medium text-gray-700">Tipo de Pessoa</label>
          <select name="tipo_pessoa" id="tipo_pessoa" value={formData.tipo_pessoa} onChange={handleInputChange} className={formInputStyle}>
            <option value="FISICA">Pessoa Física</option>
            <option value="JURIDICA">Pessoa Jurídica</option>
          </select>
        </div>
        <div>
          <label htmlFor="documento" className="block text-sm font-medium text-gray-700">CPF / CNPJ*</label>
          <input type="text" name="documento" id="documento" value={formData.documento} onChange={handleInputChange} required
            maxLength={14}
            className={`${formInputStyle} ${errors.documento ? 'border-red-500' : ''}`}
            placeholder="Digite apenas os números..."
          />
          {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço*</label>
          <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleInputChange} required
            className={`${formInputStyle} ${errors.endereco ? 'border-red-500' : ''}`}
            placeholder="Rua, número, bairro..."
          />
          {errors.endereco && <p className="mt-1 text-sm text-red-600">{errors.endereco}</p>}
        </div>
        <div>
          <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento / Fundação*</label>
          <input type="date" name="data_nascimento" id="data_nascimento" value={formData.data_nascimento} onChange={handleInputChange} required  
            className={`${formInputStyle} ${errors.data_nascimento ? 'border-red-500' : ''}`}
          />
          {errors.data_nascimento && <p className="mt-1 text-sm text-red-600">{errors.data_nascimento}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClienteForm;