import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ onLogout, usuarioLogado }) => { 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-gray-100">   
      <Sidebar 
        usuarioLogado={usuarioLogado} 
        onLogout={onLogout} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">      
        <Header 
          onLogout={onLogout} 
          usuarioLogado={usuarioLogado} 
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;