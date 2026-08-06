const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();


app.use(cors({
  origin: '*' 
}));
app.use(express.json());
app.use(morgan('dev'));

// Rotas existentes
const clientesRoutes = require('./routes/clientes.js');
const orcamentosRoutes = require('./routes/orcamentos.js');
const authRoutes = require('./routes/auth.js');
const usuarioRoutes = require('./routes/usuario.js');
const dashboardRoutes = require('./routes/dashboard');

app.use('/usuarios', usuarioRoutes);
app.use('/clientes', clientesRoutes);
app.use('/orcamentos', orcamentosRoutes);
app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando! 🚀');
});

module.exports = app;