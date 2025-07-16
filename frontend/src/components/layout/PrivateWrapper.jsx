import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "./MainLayout";

const PrivateWrapper = () => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Verificando autenticação...
      </div>
    );
  }
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout />;
};

export default PrivateWrapper;
