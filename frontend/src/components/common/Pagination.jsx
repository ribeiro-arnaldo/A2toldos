import React from 'react';

const Pagination = ({ pagina, limite, total, onPageChange }) => {
  const totalPaginas = (limite > 0 && total > 0) ? Math.ceil(total / limite) : 1;
  if (totalPaginas <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (pagina > 1) {
      onPageChange(pagina - 1);
    }
  };

  const handleNext = () => {
    if (pagina < totalPaginas) {
      onPageChange(pagina + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 py-4">
      <button
        onClick={handlePrevious}
        disabled={pagina === 1}
        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-l-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      
      <div className="bg-white text-gray-800 font-bold py-2 px-6 border-t border-b border-gray-200">
        Página {pagina} de {totalPaginas}
      </div>
      
      <button
        onClick={handleNext}
        disabled={pagina === totalPaginas}
        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-r-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;