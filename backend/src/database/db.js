const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      tipo_pessoa TEXT NOT NULL,
      documento TEXT NOT NULL UNIQUE, 
      endereco TEXT NOT NULL,
      data_nascimento TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orcamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_orcamento TEXT NOT NULL UNIQUE,
      cliente_id INTEGER NOT NULL,
      descricao TEXT,
      valor_total REAL NOT NULL,
      data_orcamento TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDENTE',
      FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS itens_orcamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orcamento_id INTEGER NOT NULL,
      descricao_item TEXT,
      largura REAL NOT NULL,
      comprimento REAL NOT NULL,
      preco_m2 REAL NOT NULL,
      valor_item REAL NOT NULL,
      FOREIGN KEY (orcamento_id) REFERENCES orcamentos (id) ON DELETE CASCADE
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      perfil TEXT NOT NULL DEFAULT 'VENDEDOR' -- Nova coluna adicionada
    )
  `);
});

module.exports = db;