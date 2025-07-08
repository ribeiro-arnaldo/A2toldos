import React from 'react';

const UsuarioForm = ({ formData, setFormData, errors, isEditing = false }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const formInputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo*</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className={`${formInputStyle} ${errors.nome ? 'border-red-500' : ''}`}
            required
            placeholder="Digite o nome completo..."
          />
          {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail*</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${formInputStyle} ${errors.email ? 'border-red-500' : ''}`}
            required
            placeholder="exemplo@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            {isEditing ? 'Nova Senha (opcional)' : 'Senha*'}
          </label>
          <input
            type="password"
            name="senha"
            id="senha"
            value={formData.senha}
            onChange={handleInputChange}
            className={`${formInputStyle} ${errors.senha ? 'border-red-500' : ''}`}
            placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'}
          />
          {errors.senha && <p className="mt-1 text-sm text-red-600">{errors.senha}</p>}
        </div>
        
        <div>
          <label htmlFor="confirmaSenha" className="block text-sm font-medium text-gray-700">
            {isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha*'}
          </label>
          <input
            type="password"
            name="confirmaSenha"
            id="confirmaSenha"
            value={formData.confirmaSenha}
            onChange={handleInputChange}
            className={`${formInputStyle} ${errors.confirmaSenha ? 'border-red-500' : ''}`}
            placeholder="Repita a senha"
          />
          {errors.confirmaSenha && <p className="mt-1 text-sm text-red-600">{errors.confirmaSenha}</p>}
        </div>

      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
            <label htmlFor="perfil" className="block text-sm font-medium text-gray-700">Perfil de Acesso*</label>
            <select
              name="perfil"
              id="perfil"
              value={formData.perfil}
              onChange={handleInputChange}
              className={`${formInputStyle} ${errors.perfil ? 'border-red-500' : ''}`}
              required
            >
              <option value="VENDEDOR">Vendedor</option>
              <option value="ADM_VENDAS">Admin de Vendas</option>
              <option value="ADM_FULL">Admin Completo</option>
            </select>
            {errors.perfil && <p className="mt-1 text-sm text-red-600">{errors.perfil}</p>}
          </div>
       </div>
    </div>
  );
};

export default UsuarioForm;