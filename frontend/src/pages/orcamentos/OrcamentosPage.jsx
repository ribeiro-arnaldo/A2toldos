import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPlus } from 'react-icons/fi';

const OrcamentosPage = () => {

  // A lógica de busca e paginação será adicionada aqui no futuro
  // Por enquanto, é uma página de placeholder

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue flex items-center">
          <FiFileText className="mr-3" /> Gestão de Orçamentos
        </h1>
        <Link to="/orcamentos/novo" className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors">
          <FiPlus className="mr-2" /> Adicionar Orçamento
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
        <h3 className="text-lg font-semibold">Página em Construção</h3>
        <p>A funcionalidade de busca e listagem de orçamentos será implementada aqui.</p>
      </div>
    </div>
  );
};

export default OrcamentosPage;