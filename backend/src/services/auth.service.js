const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
      perfil: user.perfil    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '4h' 
    });

    return { token };
  }

  // Lógica para solicitar a recuperação de senha
  async forgotPassword({ email }) {
    if (!email) {
      throw new Error('E-mail é obrigatório.');
    }

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, user) => {
        if (err) return reject(new Error('Erro ao consultar o banco de dados.'));
        if (!user) {
          // Por segurança, retornamos sucesso genérico para não expor se o e-mail existe
          return resolve({ message: 'Se o e-mail estiver cadastrado, você receberá as instruções.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 15 * 60 * 1000; // Validade de 15 minutos

        db.run(`UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE id = ?`, 
          [token, expires, user.id], async (updateErr) => {
            if (updateErr) return reject(new Error('Erro ao gerar token de recuperação.'));

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
              }
            });

            const resetLink = `https://a2toldos.vercel.app/reset-password?token=${token}`;

            try {
              await transporter.sendMail({
                to: user.email,
                subject: 'A2 Toldos - Recuperação de Senha',
                html: `<p>Você solicitou a recuperação de senha.</p>
                       <p>Clique no link abaixo para definir uma nova senha (válido por 15 minutos):</p>
                       <a href="${resetLink}">${resetLink}</a>`
              });

              resolve({ message: 'E-mail de recuperação enviado com sucesso!' });
            } catch (mailError) {
              reject(new Error('Erro ao enviar o e-mail.'));
            }
        });
      });
    });
  }

  // Lógica para redefinir a senha usando o token enviado
  async resetPassword({ token, novaSenha }) {
    if (!token || !novaSenha) {
      throw new Error('Token e nova senha são obrigatórios.');
    }

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expires > ?`, 
        [token, Date.now()], async (err, user) => {
          if (err) return reject(new Error('Erro ao consultar o banco de dados.'));
          if (!user) return reject(new Error('Token inválido ou expirado.'));

          const salt = await bcrypt.genSalt(10);
          const senha_hash = await bcrypt.hash(novaSenha, salt);

          db.run(`UPDATE usuarios SET senha_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
            [senha_hash, user.id], (updateErr) => {
              if (updateErr) return reject(new Error('Erro ao atualizar a senha.'));
              resolve({ message: 'Senha alterada com sucesso!' });
          });
      });
    });
  }
}

module.exports = new AuthService();