const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {

  // Lógica para registrar um novo usuário
  async register(userData) {
    const { nome, email, senha } = userData;
    if (!nome || !email || !senha) {
      throw new Error('Nome, e-mail e senha são obrigatórios.');
    }

    // Verifica se o e-mail já existe
    const checkEmailQuery = 'SELECT id FROM usuarios WHERE email = ?';
    const existingUser = await new Promise((resolve, reject) => {
      db.get(checkEmailQuery, [email], (err, row) => {
        if (err) reject(new Error('Erro ao consultar o banco de dados.'));
        resolve(row);
      });
    });
    if (existingUser) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Salva o novo usuário no banco
    const insertQuery = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(insertQuery, [nome, email, senha_hash], function(err) {
        // --- MUDANÇA IMPORTANTE AQUI ---
        if (err) {
          // Agora, em vez de uma mensagem genérica, nós rejeitamos com o erro real do banco.
          reject(new Error(`Erro ao registrar usuário: ${err.message}`));
        } else {
          resolve({ id: this.lastID, nome, email });
        }
        // --- FIM DA MUDANÇA ---
      });
    });
  }

  // Lógica para fazer login
  async login(credentials) {
    const { email, senha } = credentials;
    if (!email || !senha) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    // Busca o usuário pelo e-mail
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const user = await new Promise((resolve, reject) => {
      db.get(query, [email], (err, row) => {
        if (err) reject(new Error('Erro ao buscar usuário.'));
        resolve(row);
      });
    });
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      throw new Error('Credenciais inválidas.');
    }

    // Se as senhas batem, gera o "crachá digital" (JWT)
    const payload = {
      id: user.id,
      nome: user.nome
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '4h'
    });

    return { token };
  }
}

module.exports = new AuthService();