const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');

// Cria a tabela de clientes se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      cpf TEXT NOT NULL,
      endereco TEXT NOT NULL,
      data_nascimento TEXT NOT NULL
    )
  `);
});

module.exports = db;