const express = require('express');
const app = express();
const port = 3000;

// Middleware para receber JSON no corpo da requisição
app.use(express.json());

// 👉 Importa e usa as rotas de cliente
const clientesRoutes = require('./routes/clientes');
app.use('/clientes', clientesRoutes);

// Rota simples para testar se a API está online
app.get('/', (req, res) => {
  res.send('API funcionando! 🚀');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
