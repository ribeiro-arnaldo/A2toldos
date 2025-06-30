import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-brand-blue">Painel Principal</h1>
      <p className="mt-4 text-gray-700">
        Bem-vindo ao Sistema de Orçamentos da A2 Toldos!
      </p>
      <p className="mt-2">
        O seu login foi realizado com sucesso e você foi redirecionado.
      </p>
      {/* Aqui construiremos os gráficos e tabelas no futuro */}
    </div>
  );
};

export default DashboardPage;