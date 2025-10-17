import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection } from "../config/database.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Gerar token JWT
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      nome: user.nome
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// 📝 CADASTRO
export async function cadastro(req, res) {
  try {
    const { nome, email, senha, avatar } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        error: "Nome, email e senha são obrigatórios"
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido"
      });
    }

    // Validar força da senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Senha deve ter no mínimo 6 caracteres"
      });
    }

    const connection = await getConnection();

    // Verificar se email já existe
    const [existingUser] = await connection.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Email já cadastrado"
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    // Inserir usuário
    const [result] = await connection.query(
      `INSERT INTO usuarios (nome, email, senha_hash, avatar, ativo)
             VALUES (?, ?, ?, ?, TRUE)`,
      [nome, email, senhaHash, avatar || "😊"]
    );

    const userId = result.insertId;

    // Buscar usuário criado
    const [newUser] = await connection.query(
      "SELECT id, nome, email, avatar, data_criacao FROM usuarios WHERE id = ?",
      [userId]
    );

    // Gerar token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: {
        user: newUser[0],
        token
      }
    });
  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao cadastrar usuário"
    });
  }
}

// 🔐 LOGIN
export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios"
      });
    }

    const connection = await getConnection();

    // Buscar usuário por email
    const [users] = await connection.query(
      "SELECT id, nome, email, senha_hash, avatar, ativo FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos"
      });
    }

    const user = users[0];

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return res.status(403).json({
        success: false,
        error: "Usuário desativado. Entre em contato com o suporte."
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos"
      });
    }

    // Remover senha_hash do retorno
    delete user.senha_hash;

    // Gerar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao fazer login"
    });
  }
}

// 👤 OBTER DADOS DO USUÁRIO LOGADO
export async function me(req, res) {
  try {
    const userId = req.userId; // Vem do middleware de autenticação

    const connection = await getConnection();
    const [users] = await connection.query(
      `SELECT id, nome, email, avatar, data_criacao, data_atualizacao
             FROM usuarios WHERE id = ? AND ativo = TRUE`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado"
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar dados do usuário"
    });
  }
}

// ✏️ ATUALIZAR PERFIL
export async function atualizarPerfil(req, res) {
  try {
    const userId = req.userId;
    const { nome, avatar } = req.body;

    if (!nome) {
      return res.status(400).json({
        success: false,
        error: "Nome é obrigatório"
      });
    }

    const connection = await getConnection();

    await connection.query(
      `UPDATE usuarios 
             SET nome = ?, avatar = ?, data_atualizacao = NOW()
             WHERE id = ?`,
      [nome, avatar, userId]
    );

    const [updatedUser] = await connection.query(
      "SELECT id, nome, email, avatar, data_atualizacao FROM usuarios WHERE id = ?",
      [userId]
    );

    res.json({
      success: true,
      message: "Perfil atualizado com sucesso",
      data: updatedUser[0]
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar perfil:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar perfil"
    });
  }
}

// 🔑 ALTERAR SENHA
export async function alterarSenha(req, res) {
  try {
    const userId = req.userId;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        success: false,
        error: "Senha atual e nova senha são obrigatórias"
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Nova senha deve ter no mínimo 6 caracteres"
      });
    }

    const connection = await getConnection();

    // Buscar usuário
    const [users] = await connection.query(
      "SELECT senha_hash FROM usuarios WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado"
      });
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, users[0].senha_hash);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        error: "Senha atual incorreta"
      });
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    // Atualizar senha
    await connection.query(
      "UPDATE usuarios SET senha_hash = ?, data_atualizacao = NOW() WHERE id = ?",
      [novaSenhaHash, userId]
    );

    res.json({
      success: true,
      message: "Senha alterada com sucesso"
    });
  } catch (error) {
    console.error("❌ Erro ao alterar senha:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao alterar senha"
    });
  }
}

// 🚪 LOGOUT (apenas retorna sucesso, frontend remove token)
export async function logout(req, res) {
  res.json({
    success: true,
    message: "Logout realizado com sucesso"
  });
}

// 📧 VERIFICAR SE EMAIL EXISTE
export async function verificarEmail(req, res) {
  try {
    const { email } = req.params;

    const connection = await getConnection();
    const [users] = await connection.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    res.json({
      success: true,
      exists: users.length > 0
    });
  } catch (error) {
    console.error("❌ Erro ao verificar email:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao verificar email"
    });
  }
}
