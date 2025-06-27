const express = require('express');
const morgan = require('morgan'); 
const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Importa e usa as nossas rotas
const clientesRoutes = require('./routes/clientes');
const orcamentosRoutes = require('./routes/orcamentos');
const authRoutes = require('./routes/auth');

app.use('/clientes', clientesRoutes);
app.use('/orcamentos', orcamentosRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando! 🚀');
});

module.exports = app;