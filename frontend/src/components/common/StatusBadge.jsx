import React from 'react';

const StatusBadge = ({ status }) => {
  // Objeto que mapeia cada status a uma cor de fundo
  const statusColors = {
    PENDENTE: 'bg-yellow-500',
    APROVADO: 'bg-green-500',
    REPROVADO: 'bg-red-500',
    'EM PRODUCAO': 'bg-blue-500', // Note as aspas para o nome com espaço
    CONCLUIDO: 'bg-purple-500',
    ENTREGUE: 'bg-gray-500',
  };

  // Define uma cor padrão caso o status não seja encontrado
  const bgColor = statusColors[status] || 'bg-gray-400';

  return (
    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;