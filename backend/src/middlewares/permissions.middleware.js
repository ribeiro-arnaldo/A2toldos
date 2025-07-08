const checkPermission = (perfisPermitidos) => {
    return (req, res, next) => {
      const { usuarioPerfil } = req;
  
      if (!usuarioPerfil || !perfisPermitidos.includes(usuarioPerfil)) {
        return res.status(403).json({ erro: 'Acesso negado. Você não tem permissão para esta ação.' });
      }
  
      next();
    };
  };
  
  module.exports = checkPermission;