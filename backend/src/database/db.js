const path = require('path');
// const { Pool } = require('pg'); // Comentado para a apresentação
const sqlite3 = require('sqlite3').verbose();

let db;

/* 
=========================================================
 CÓDIGO DO POSTGRES (SUPABASE) - COMENTADO PARA APRESENTAÇÃO
=========================================================
if (process.env.DATABASE_URL) {
  console.log("Conectando ao banco PostgreSQL (Supabase)...");
  
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  db.connect((err, client, release) => {
    if (err) {
      console.error('Erro ao conectar ao PostgreSQL:', err.stack);
    } else {
      console.log('Conectado com sucesso ao PostgreSQL!');
      release();
    }
  });
} else { 
*/

// =========================================================
// CÓDIGO DO SQLITE - ATIVO PARA A APRESENTAÇÃO
// =========================================================
console.log("Conectando ao banco SQLite local...");
const dbPath = path.resolve(__dirname, 'database.db');
const sqliteDb = new sqlite3.Database(dbPath);

sqliteDb.serialize(() => {
  sqliteDb.run(`
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

  sqliteDb.run(`
   CREATE TABLE IF NOT EXISTS orcamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_orcamento TEXT NOT NULL UNIQUE,
      cliente_id INTEGER NOT NULL,
      descricao TEXT,
      valor_total REAL NOT NULL,
      data_orcamento TEXT NOT NULL,
      prazo_entrega TEXT,
      status TEXT NOT NULL DEFAULT 'PENDENTE',
      data_instalacao TEXT,
      categoria_servico TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
    )
  `);

  sqliteDb.run('ALTER TABLE orcamentos ADD COLUMN data_instalacao TEXT', (err) => {});
  sqliteDb.run('ALTER TABLE orcamentos ADD COLUMN categoria_servico TEXT', (err) => {});

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS itens_orcamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orcamento_id INTEGER NOT NULL,
      descricao_item TEXT,
      cor TEXT,
      observacoes TEXT, 
      largura REAL NOT NULL,
      comprimento REAL NOT NULL,
      preco_m2 REAL NOT NULL,
      valor_item REAL NOT NULL,
      FOREIGN KEY (orcamento_id) REFERENCES orcamentos (id) ON DELETE CASCADE
    )
  `);

  sqliteDb.run('ALTER TABLE itens_orcamento ADD COLUMN material TEXT', (err) => {
    if (err && !err.message.includes('duplicate column name')) {
        console.error("Erro ao adicionar coluna 'material':", err.message);
    }
  });

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      perfil TEXT NOT NULL DEFAULT 'VENDEDOR',
      reset_token TEXT,
      reset_token_expires DATETIME
    )
  `);
  sqliteDb.run('ALTER TABLE usuarios ADD COLUMN reset_token TEXT', (err) => {});
  sqliteDb.run('ALTER TABLE usuarios ADD COLUMN reset_token_expires DATETIME', (err) => {});
});

db = sqliteDb;

// } // Fim do bloco IF do Postgres comentado

module.exports = db;