import React from 'react';
import { FiMenu } from 'react-icons/fi';

const Header = ({ usuarioLogado, onMenuToggle }) => {
  const perfisMap = {
    'ADM_FULL': 'Administrador',
    'ADM_VENDAS': 'Gerente de Vendas',
    'VENDEDOR': 'Vendedor'
  };

  const nomePerfil = perfisMap[usuarioLogado?.perfil] || 'Usuário';

  return (    
    <header className="bg-brand-blue shadow-sm p-2 flex justify-between items-center">
      
      {/* Item da Esquerda: O botão de menu que só aparece no mobile */}
      <button 
        onClick={onMenuToggle} 
        className="text-white md:hidden" 
      >
        <FiMenu size={28} />
      </button>

      <div className="hidden md:block"></div>
      
      <div className="text-right">
        <span className="font-semibold text-white">{usuarioLogado?.nome}</span>
        <p className="text-xs text-white -mt-1">{nomePerfil}</p>
      </div>
    </header>
  );
};

export default Header;