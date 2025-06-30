import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ onLogout }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* O marcador de lugar para o conteúdo da página */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;