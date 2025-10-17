-- Script para criar as tabelas do EmoConnect
-- Banco de dados: giovana_tcc no AlwaysData

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de humores/emoções
CREATE TABLE IF NOT EXISTS humores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    humor VARCHAR(50) NOT NULL,
    intensidade INT NOT NULL,
    observacoes TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario_data (usuario_id, data_registro),
    INDEX idx_humor (humor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de atividades realizadas
CREATE TABLE IF NOT EXISTS atividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao_minutos INT,
    concluida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_tipo (usuario_id, tipo),
    INDEX idx_data (data_criacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de mensagens do chat
CREATE TABLE IF NOT EXISTS mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    contato VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    conteudo TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    INDEX idx_usuario_contato (usuario_id, contato),
    INDEX idx_data (data_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de progresso/metas
CREATE TABLE IF NOT EXISTS progresso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    valor INT NOT NULL,
    meta INT,
    data_registro DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_data (usuario_id, data_registro),
    INDEX idx_categoria (categoria),
    UNIQUE KEY idx_usuario_categoria_data (usuario_id, categoria, data_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de sessões de respiração
CREATE TABLE IF NOT EXISTS sessoes_respiracao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    duracao_segundos INT NOT NULL,
    ciclos_completos INT NOT NULL,
    data_sessao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_data (usuario_id, data_sessao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tema VARCHAR(20) DEFAULT 'light',
    notificacoes_ativas BOOLEAN DEFAULT TRUE,
    lembretes_ativos BOOLEAN DEFAULT TRUE,
    horario_lembrete TIME DEFAULT '09:00:00',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de permissões por role
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

-- Tabela de logs de auditoria
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

-- Inserir usuário admin padrão
-- Email: admin@emoconnect.com
-- Senha: Admin@2025
INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES
('Administrador',
 'admin@emoconnect.com',
 '$2b$10$WfuTITapdmvGrOS/G4hH9.2F678dHAQ2aNS3hkaBohHJjcgF1QNgC',
 'admin',
 TRUE)
ON DUPLICATE KEY UPDATE nome=nome;
