// server/middleware/checkRole.js
// Middleware para verificar role/permissões do usuário

import { getConnection } from "../config/database.js";

// Verificar se usuário tem role específico
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.userRole;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        error: "Não autenticado"
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Sem permissão para acessar este recurso",
        requiredRole: allowedRoles
      });
    }

    next();
  };
}

// Verificar se usuário é admin
export const requireAdmin = requireRole("admin");

// Verificar se usuário é moderator ou admin
export const requireModeratorOrAdmin = requireRole("moderator", "admin");

// Verificar permissão específica no banco de dados
export async function checkPermission(recurso, acao) {
  return async (req, res, next) => {
    const userRole = req.userRole;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        error: "Não autenticado"
      });
    }

    // Admin tem acesso total
    if (userRole === "admin") {
      return next();
    }

    try {
      const connection = await getConnection();

      // Mapear ação para coluna
      const colunaAcao = {
        criar: "pode_criar",
        ler: "pode_ler",
        atualizar: "pode_atualizar",
        deletar: "pode_deletar"
      }[acao];

      if (!colunaAcao) {
        return res.status(400).json({
          success: false,
          error: "Ação inválida"
        });
      }

      // Buscar permissão
      const [permissoes] = await connection.query(
        `SELECT ${colunaAcao} as permitido 
                 FROM permissoes 
                 WHERE role = ? AND recurso = ?`,
        [userRole, recurso]
      );

      if (permissoes.length === 0 || !permissoes[0].permitido) {
        return res.status(403).json({
          success: false,
          error: `Você não tem permissão para ${acao} ${recurso}`
        });
      }

      next();
    } catch (error) {
      console.error("❌ Erro ao verificar permissão:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao verificar permissões"
      });
    }
  };
}

// Middleware para registrar ações no log de auditoria
export function logAuditoria(acao, recurso, recursoId = null) {
  return async (req, res, next) => {
    try {
      const connection = await getConnection();

      const detalhes = {
        body: req.body,
        params: req.params,
        query: req.query
      };

      await connection.query(
        `INSERT INTO logs_auditoria 
                (usuario_id, acao, recurso, recurso_id, detalhes, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          req.userId || null,
          acao,
          recurso,
          recursoId,
          JSON.stringify(detalhes),
          req.ip || req.connection.remoteAddress,
          req.headers["user-agent"]
        ]
      );

      // ✅ Importante: chamar next() mesmo se inserir com sucesso
      next();
    } catch (error) {
      console.error("❌ Erro ao registrar auditoria:", error);
      // Não bloqueia a requisição se falhar o log
      next();
    }
  };
}
