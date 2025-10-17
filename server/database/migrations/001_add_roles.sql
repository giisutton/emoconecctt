-- =====================================================
-- MIGRAÇÃO: Adicionar Sistema de Roles (Papéis)
-- Data: 2025-10-17
-- Descrição: Remove campo 'avatar' e adiciona campo 'role'
-- =====================================================

-- 1. Adicionar coluna 'role' na tabela usuarios
ALTER TABLE usuarios 
ADD COLUMN role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user' 
AFTER senha_hash;

-- 2. Criar índice para role (para queries rápidas)
CREATE INDEX idx_role ON usuarios(role);

-- 3. Remover coluna 'avatar' (se existir)
ALTER TABLE usuarios 
DROP COLUMN IF EXISTS avatar;

-- 4. Criar usuário admin padrão (senha: Admin@2025)
-- Hash gerado com bcrypt (10 salt rounds): Admin@2025
INSERT INTO usuarios (nome, email, senha_hash, role, ativo) 
VALUES (
    'Administrador',
    'admin@emoconnect.com',
    '$2b$10$WfuTITapdmvGrOS/G4hH9.2F678dHAQ2aNS3hkaBohHJjcgF1QNgC',
    'admin',
    TRUE
) ON DUPLICATE KEY UPDATE nome=nome;

-- 5. Criar tabela de permissões (para controle fino de acesso)
CREATE TABLE IF NOT EXISTS permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('user', 'moderator', 'admin') NOT NULL,
    recurso VARCHAR(100) NOT NULL COMMENT 'Ex: users.create, posts.delete',
    pode_criar BOOLEAN DEFAULT FALSE,
    pode_ler BOOLEAN DEFAULT TRUE,
    pode_atualizar BOOLEAN DEFAULT FALSE,
    pode_deletar BOOLEAN DEFAULT FALSE,
    UNIQUE KEY idx_role_recurso (role, recurso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Inserir permissões padrão para cada role

-- Permissões de USER (usuário comum)
INSERT INTO permissoes (role, recurso, pode_criar, pode_ler, pode_atualizar, pode_deletar) VALUES
('user', 'humores', TRUE, TRUE, TRUE, TRUE),
('user', 'atividades', TRUE, TRUE, TRUE, TRUE),
('user', 'mensagens', TRUE, TRUE, TRUE, TRUE),
('user', 'progresso', TRUE, TRUE, TRUE, TRUE),
('user', 'respiracao', TRUE, TRUE, TRUE, TRUE),
('user', 'perfil', FALSE, TRUE, TRUE, FALSE),
('user', 'chat_ia', TRUE, TRUE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE pode_ler=pode_ler;

-- Permissões de MODERATOR (moderador)
INSERT INTO permissoes (role, recurso, pode_criar, pode_ler, pode_atualizar, pode_deletar) VALUES
('moderator', 'humores', TRUE, TRUE, TRUE, TRUE),
('moderator', 'atividades', TRUE, TRUE, TRUE, TRUE),
('moderator', 'mensagens', TRUE, TRUE, TRUE, TRUE),
('moderator', 'progresso', TRUE, TRUE, TRUE, TRUE),
('moderator', 'respiracao', TRUE, TRUE, TRUE, TRUE),
('moderator', 'perfil', FALSE, TRUE, TRUE, FALSE),
('moderator', 'chat_ia', TRUE, TRUE, FALSE, FALSE),
('moderator', 'usuarios', FALSE, TRUE, TRUE, FALSE),
('moderator', 'relatorios', FALSE, TRUE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE pode_ler=pode_ler;

-- Permissões de ADMIN (administrador - acesso total)
INSERT INTO permissoes (role, recurso, pode_criar, pode_ler, pode_atualizar, pode_deletar) VALUES
('admin', 'humores', TRUE, TRUE, TRUE, TRUE),
('admin', 'atividades', TRUE, TRUE, TRUE, TRUE),
('admin', 'mensagens', TRUE, TRUE, TRUE, TRUE),
('admin', 'progresso', TRUE, TRUE, TRUE, TRUE),
('admin', 'respiracao', TRUE, TRUE, TRUE, TRUE),
('admin', 'perfil', TRUE, TRUE, TRUE, TRUE),
('admin', 'chat_ia', TRUE, TRUE, TRUE, TRUE),
('admin', 'usuarios', TRUE, TRUE, TRUE, TRUE),
('admin', 'permissoes', TRUE, TRUE, TRUE, TRUE),
('admin', 'relatorios', TRUE, TRUE, TRUE, TRUE),
('admin', 'configuracoes', TRUE, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE pode_ler=pode_ler;

-- 7. Criar tabela de logs de auditoria (para segurança)
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(100) NOT NULL COMMENT 'Ex: login, create_user, delete_post',
    recurso VARCHAR(100) COMMENT 'Tabela/recurso afetado',
    recurso_id INT COMMENT 'ID do recurso afetado',
    detalhes JSON COMMENT 'Informações adicionais',
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario_data (usuario_id, data_acao),
    INDEX idx_acao (acao),
    INDEX idx_data (data_acao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Verificação final
SELECT 'Migração 001_add_roles concluída com sucesso!' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT role, COUNT(*) AS quantidade FROM usuarios GROUP BY role;
