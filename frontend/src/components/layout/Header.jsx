import React from 'react';

const Header = ({ usuarioLogado }) => {  
  const perfisMap = {
    'ADM_FULL': 'Administrador',
    'ADM_VENDAS': 'Gerente de Vendas',
    'VENDEDOR': 'Vendedor'
  };

    const nomePerfil = perfisMap[usuarioLogado?.perfil] || 'Usuário';

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-end items-center">
        {/* Container para o nome e perfil */}
        <div className="text-right">
          <span className="font-semibold text-gray-800">{usuarioLogado?.nome}</span>
          <p className="text-xs text-gray-500">{nomePerfil}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;