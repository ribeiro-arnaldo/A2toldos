const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Acesso negado. Nenhum token foi fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ erro: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: 'Token mal formatado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
       return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }

    
    req.userId = decoded.id;
    req.userNome = decoded.nome;

    return next();
  });
};

module.exports = authMiddleware;