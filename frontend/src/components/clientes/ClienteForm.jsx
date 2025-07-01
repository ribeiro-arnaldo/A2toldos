import React from 'react';

const ClienteForm = ({ formData, setFormData, errors }) => {
  
  // A lógica de "handleChange" vive aqui, pois está diretamente ligada aos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'nome') {
        processedValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s.\-&]/g, '');
    } else if (name === 'telefone') {
        processedValue = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'documento') {
        processedValue = value.replace(/\D/g, '');
        const maxLength = formData.tipo_pessoa === 'FISICA' ? 11 : 14;
        processedValue = processedValue.slice(0, maxLength);
    }
    
    // Atualiza o estado no componente pai (que pode ser a página de criação ou edição)
    setFormData(prevState => ({ ...prevState, [name]: processedValue }));
  };

  return (
    <div className="space-y-4">
        {/* Campo Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo / Razão Social</label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
        </div>

        {/* Campos E-mail e Telefone */}
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

        {/* Campos Tipo de Pessoa e Documento */}
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
        
        {/* Campos Endereço e Data */}
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
    </div>
  );
};

export default ClienteForm;