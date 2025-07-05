const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {

  // Lógica para registrar um novo usuário
  async register(userData) {
    const { nome, email, senha, perfil } = userData; 
    if (!nome || !email || !senha || !perfil) {
      throw new Error('Nome, e-mail, senha e perfil são obrigatórios.');
    }

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

    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Salva o novo usuário no banco com o seu perfil
    const insertQuery = 'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(insertQuery, [nome, email, senha_hash, perfil], function(err) {
        if (err) {
          reject(new Error(`Erro ao registrar usuário: ${err.message}`));
        } else {
          resolve({ id: this.lastID, nome, email, perfil });
        }
      });
    });
  }

  // Lógica para fazer login, incluindo o perfil no token
  async login(credentials) {
    const { email, senha } = credentials;
    if (!email || !senha) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const user = await new Promise((resolve, reject) => {
      db.get(query, [email], (err, row) => {
        if (err) reject(new Error('Erro ao buscar usuário.'));
        resolve(row);
      });
    });
    if (!user) {
      throw new Error('E-mail ou senha incorretos. \nPor favor, tente novamente.');
    }

    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      throw new Error('E-mail ou senha incorretos. \nPor favor, tente novamente.');
    }

    // (token JWT)
    const payload = {
      id: user.id,
      nome: user.nome,
      perfil: user.perfil     };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '4h' 
    });

    return { token };
  }
}

module.exports = new AuthService();