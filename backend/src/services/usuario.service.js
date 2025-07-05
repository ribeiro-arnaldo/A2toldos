const db = require('../database/db');
const bcrypt = require('bcryptjs');

// --- Helpers para "promisificar" o db ---
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};
const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

class UsuarioService {
    
    // Lista todos os usuários (sem a senha)
    async listAll() {
        return await dbAll('SELECT id, nome, email, perfil FROM usuarios');
    }

    // Busca um usuário por ID (sem a senha)
    async findById(id) {
        const usuario = await dbGet('SELECT id, nome, email, perfil FROM usuarios WHERE id = ?', [id]);
        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }
        return usuario;
    }

    // Atualiza um usuário
    async update(id, userData) {
        const { nome, email, perfil, senha } = userData;
        
        // Verifica se o e-mail já está em uso por outro usuário
        const emailExists = await dbGet('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
        if (emailExists) {
            throw new Error('Este e-mail já está em uso por outro usuário.');
        }

        // Se uma nova senha for fornecida, criptografa-a. Senão, mantém a antiga.
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            const senha_hash = await bcrypt.hash(senha, salt);
            const query = 'UPDATE usuarios SET nome = ?, email = ?, perfil = ?, senha_hash = ? WHERE id = ?';
            await dbRun(query, [nome, email, perfil, senha_hash, id]);
        } else {
            const query = 'UPDATE usuarios SET nome = ?, email = ?, perfil = ? WHERE id = ?';
            await dbRun(query, [nome, email, perfil, id]);
        }

        return { id, nome, email, perfil };
    }

    // Deleta um usuário
    async delete(id) {
        // Regra de negócio: não permitir deletar o usuário com ID 1 (o admin principal)
        if (parseInt(id, 10) === 1) {
            throw new Error('Não é possível excluir o administrador principal do sistema.');
        }
        const result = await dbRun('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.changes === 0) {
            throw new Error('Usuário não encontrado para exclusão.');
        }
        return { mensagem: 'Usuário excluído com sucesso!' };
    }
}

module.exports = new UsuarioService();