const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');

// Cria a tabela de clientes se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      cpf TEXT,
      endereco TEXT
    )
  `);
});

module.exports = db;
