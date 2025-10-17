// server/routes/admin.js
// Rotas administrativas (apenas para admins)

import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  requireAdmin,
  requireModeratorOrAdmin,
  logAuditoria
} from "../middleware/checkRole.js";
import { getConnection } from "../config/database.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// ===========================
// GESTÃO DE USUÁRIOS
// ===========================

// Listar todos os usuários (admin e moderator)
router.get(
  "/usuarios",
  requireModeratorOrAdmin,
  logAuditoria("listar_usuarios", "usuarios"),
  async (req, res) => {
    try {
      const { page = 1, limit = 20, role, ativo, search } = req.query;
      const offset = (page - 1) * limit;

      const connection = await getConnection();

      let query = `SELECT id, nome, email, role, ativo, data_criacao, data_atualizacao 
                   FROM usuarios WHERE 1=1`;
      const params = [];

      if (role) {
        query += " AND role = ?";
        params.push(role);
      }

      if (ativo !== undefined) {
        query += " AND ativo = ?";
        params.push(ativo === "true");
      }

      if (search) {
        query += " AND (nome LIKE ? OR email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }

      query += " ORDER BY data_criacao DESC LIMIT ? OFFSET ?";
      params.push(parseInt(limit), parseInt(offset));

      const [usuarios] = await connection.query(query, params);

      // Contar total
      let countQuery = "SELECT COUNT(*) as total FROM usuarios WHERE 1=1";
      const countParams = [];

      if (role) {
        countQuery += " AND role = ?";
        countParams.push(role);
      }

      if (ativo !== undefined) {
        countQuery += " AND ativo = ?";
        countParams.push(ativo === "true");
      }

      if (search) {
        countQuery += " AND (nome LIKE ? OR email LIKE ?)";
        countParams.push(`%${search}%`, `%${search}%`);
      }

      const [countResult] = await connection.query(countQuery, countParams);
      const total = countResult[0].total;

      res.json({
        success: true,
        data: usuarios,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error("❌ Erro ao listar usuários:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao listar usuários"
      });
    }
  }
);

// Buscar usuário por ID (admin e moderator)
router.get(
  "/usuarios/:id",
  requireModeratorOrAdmin,
  logAuditoria("visualizar_usuario", "usuarios"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await getConnection();

      const [usuarios] = await connection.query(
        `SELECT id, nome, email, role, ativo, data_criacao, data_atualizacao
                 FROM usuarios WHERE id = ?`,
        [id]
      );

      if (usuarios.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado"
        });
      }

      res.json({
        success: true,
        data: usuarios[0]
      });
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar usuário"
      });
    }
  }
);

// Criar novo usuário (apenas admin)
router.post(
  "/usuarios",
  requireAdmin,
  logAuditoria("criar_usuario", "usuarios"),
  async (req, res) => {
    try {
      const { nome, email, senha, role = "user" } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          success: false,
          error: "Nome, email e senha são obrigatórios"
        });
      }

      if (!["user", "moderator", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          error: "Role inválido"
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
      const senhaHash = await bcrypt.hash(senha, 10);

      // Inserir usuário
      const [result] = await connection.query(
        `INSERT INTO usuarios (nome, email, senha_hash, role, ativo)
                 VALUES (?, ?, ?, ?, TRUE)`,
        [nome, email, senhaHash, role]
      );

      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        data: {
          id: result.insertId,
          nome,
          email,
          role
        }
      });
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao criar usuário"
      });
    }
  }
);

// Atualizar usuário (apenas admin)
router.put(
  "/usuarios/:id",
  requireAdmin,
  logAuditoria("atualizar_usuario", "usuarios"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, role, ativo } = req.body;

      if (!nome && !email && !role && ativo === undefined) {
        return res.status(400).json({
          success: false,
          error: "Nenhum campo para atualizar"
        });
      }

      const connection = await getConnection();

      // Verificar se usuário existe
      const [existingUser] = await connection.query(
        "SELECT id FROM usuarios WHERE id = ?",
        [id]
      );

      if (existingUser.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado"
        });
      }

      const updates = [];
      const params = [];

      if (nome) {
        updates.push("nome = ?");
        params.push(nome);
      }

      if (email) {
        updates.push("email = ?");
        params.push(email);
      }

      if (role && ["user", "moderator", "admin"].includes(role)) {
        updates.push("role = ?");
        params.push(role);
      }

      if (ativo !== undefined) {
        updates.push("ativo = ?");
        params.push(ativo);
      }

      updates.push("data_atualizacao = NOW()");

      params.push(id);

      await connection.query(
        `UPDATE usuarios SET ${updates.join(", ")} WHERE id = ?`,
        params
      );

      const [updatedUser] = await connection.query(
        "SELECT id, nome, email, role, ativo, data_atualizacao FROM usuarios WHERE id = ?",
        [id]
      );

      res.json({
        success: true,
        message: "Usuário atualizado com sucesso",
        data: updatedUser[0]
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao atualizar usuário"
      });
    }
  }
);

// Deletar usuário (apenas admin)
router.delete(
  "/usuarios/:id",
  requireAdmin,
  logAuditoria("deletar_usuario", "usuarios"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await getConnection();

      // Impedir auto-deleção
      if (parseInt(id) === req.userId) {
        return res.status(400).json({
          success: false,
          error: "Você não pode deletar sua própria conta"
        });
      }

      const [result] = await connection.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado"
        });
      }

      res.json({
        success: true,
        message: "Usuário deletado com sucesso"
      });
    } catch (error) {
      console.error("❌ Erro ao deletar usuário:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao deletar usuário"
      });
    }
  }
);

// ===========================
// ESTATÍSTICAS E RELATÓRIOS
// ===========================

// Dashboard com estatísticas gerais (admin e moderator)
router.get(
  "/dashboard",
  requireModeratorOrAdmin,
  logAuditoria("visualizar_dashboard", "dashboard"),
  async (req, res) => {
    try {
      const connection = await getConnection();

      // Total de usuários por role
      const [usuariosPorRole] = await connection.query(
        "SELECT role, COUNT(*) as total FROM usuarios GROUP BY role"
      );

      // Usuários ativos vs inativos
      const [usuariosStatus] = await connection.query(
        "SELECT ativo, COUNT(*) as total FROM usuarios GROUP BY ativo"
      );

      // Total de humores registrados
      const [totalHumores] = await connection.query(
        "SELECT COUNT(*) as total FROM humores"
      );

      // Total de atividades
      const [totalAtividades] = await connection.query(
        "SELECT COUNT(*) as total FROM atividades"
      );

      // Total de mensagens
      const [totalMensagens] = await connection.query(
        "SELECT COUNT(*) as total FROM mensagens"
      );

      // Novos usuários últimos 7 dias
      const [novosUsuarios] = await connection.query(
        `SELECT COUNT(*) as total FROM usuarios 
                 WHERE data_criacao >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
      );

      res.json({
        success: true,
        data: {
          usuarios: {
            porRole: usuariosPorRole,
            porStatus: usuariosStatus,
            novosUltimos7Dias: novosUsuarios[0].total
          },
          atividade: {
            humores: totalHumores[0].total,
            atividades: totalAtividades[0].total,
            mensagens: totalMensagens[0].total
          }
        }
      });
    } catch (error) {
      console.error("❌ Erro ao buscar dashboard:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas"
      });
    }
  }
);

// Logs de auditoria (apenas admin)
router.get(
  "/logs",
  requireAdmin,
  logAuditoria("visualizar_logs", "logs_auditoria"),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, usuario_id, acao } = req.query;
      const offset = (page - 1) * limit;

      const connection = await getConnection();

      let query = `SELECT l.*, u.nome as usuario_nome, u.email as usuario_email
                   FROM logs_auditoria l
                   LEFT JOIN usuarios u ON l.usuario_id = u.id
                   WHERE 1=1`;
      const params = [];

      if (usuario_id) {
        query += " AND l.usuario_id = ?";
        params.push(usuario_id);
      }

      if (acao) {
        query += " AND l.acao LIKE ?";
        params.push(`%${acao}%`);
      }

      query += " ORDER BY l.data_acao DESC LIMIT ? OFFSET ?";
      params.push(parseInt(limit), parseInt(offset));

      const [logs] = await connection.query(query, params);

      res.json({
        success: true,
        data: logs
      });
    } catch (error) {
      console.error("❌ Erro ao buscar logs:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar logs de auditoria"
      });
    }
  }
);

export default router;
