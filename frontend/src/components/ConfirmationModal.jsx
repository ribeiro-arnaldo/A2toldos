import React from 'react';
import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

// Este é o nosso componente de modal reutilizável
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    // Fundo escuro semi-transparente que cobre a tela inteira
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      
      {/* A caixa (modal) principal, centralizada */}
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <FiAlertTriangle className="text-red-600 w-6 h-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
        </div>

        <p className="text-gray-600 my-4">
          {message}
        </p>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose} // O botão "Cancelar" simplesmente fecha o modal
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
          >
            <FiX className="mr-2" />
            Cancelar
          </button>
          <button
            onClick={onConfirm} // O botão "Confirmar" executa a ação principal
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-red-700 transition-colors"
          >
            <FiCheck className="mr-2" />
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;