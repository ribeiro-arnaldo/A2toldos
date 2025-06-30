import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          {/* Futuramente podemos ter uma barra de busca aqui */}
        </div>
        <div>
          <span className="font-semibold">Arnaldo Ribeiro</span>
          {/* TODO: Lógica para mostrar o nome do utilizador logado */}
        </div>
      </div>
    </header>
  );
};

export default Header;