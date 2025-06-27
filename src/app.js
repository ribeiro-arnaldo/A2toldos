const express = require('express');
const app = express();

app.use(express.json());

// O caminho para as rotas começa com './' porque elas estão no mesmo nível do app.js
const clientesRoutes = require('./routes/clientes');
const orcamentosRoutes = require('./routes/orcamentos');

app.use('/clientes', clientesRoutes);
app.use('/orcamentos', orcamentosRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando! 🚀');
});

module.exports = app;