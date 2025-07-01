import React from 'react';

const Pagination = ({ pagina, limite, total, onPageChange }) => {
  const totalPaginas = Math.ceil(total / limite);

  // Se só existe uma página (ou nenhuma), não há necessidade de mostrar os botões.
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center items-center space-x-4 py-4">
      <button 
        onClick={() => onPageChange(pagina - 1)} 
        disabled={pagina === 1}
        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      
      <span className="text-gray-700 font-medium">
        Página {pagina} de {totalPaginas}
      </span>
      
      <button 
        onClick={() => onPageChange(pagina + 1)} 
        disabled={pagina === totalPaginas}
        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;