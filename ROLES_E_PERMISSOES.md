# 🔄 Sistema de Roles e Permissões - Migração

## 📋 Resumo das Mudanças

### ❌ Campo Removido:

- **`avatar`** - Removido da tabela `usuarios`

### ✨ Novo Campo Adicionado:

- **`role`** - Define o papel do usuário na plataforma
  - Valores possíveis: `user`, `moderator`, `admin`
  - Valor padrão: `user`

### 🆕 Novas Tabelas:

1. **`permissoes`** - Define permissões por role
2. **`logs_auditoria`** - Registra todas as ações importantes

---

## 👥 Roles Disponíveis

### 🙂 USER (Usuário Comum)

**Permissões:**

- ✅ Registrar humores e emoções
- ✅ Criar e gerenciar atividades
- ✅ Enviar mensagens no chat
- ✅ Usar chat com IA (Gemini)
- ✅ Ver e atualizar seu próprio perfil
- ✅ Registrar sessões de respiração
- ✅ Visualizar seu progresso

**Restrições:**

- ❌ Não pode acessar dados de outros usuários
- ❌ Não pode gerenciar usuários
- ❌ Não pode acessar relatórios globais
- ❌ Não pode ver logs de auditoria

### 👮 MODERATOR (Moderador)

**Permissões (USER +):**

- ✅ Ver lista de usuários
- ✅ Ver perfil de outros usuários
- ✅ Acessar relatórios estatísticos
- ✅ Visualizar dados agregados

**Restrições:**

- ❌ Não pode criar/deletar usuários
- ❌ Não pode alterar roles
- ❌ Não pode ver logs de auditoria
- ❌ Não pode alterar permissões

### 👑 ADMIN (Administrador)

**Permissões:**

- ✅ **ACESSO TOTAL** a todas as funcionalidades
- ✅ Criar, editar e deletar usuários
- ✅ Alterar roles de usuários
- ✅ Ativar/desativar contas
- ✅ Visualizar logs de auditoria
- ✅ Acessar dashboard administrativo
- ✅ Gerenciar permissões
- ✅ Ver relatórios completos

---

## 🔐 Usuário Administrador Padrão

### Credenciais:

```
Email: admin@emoconnect.com
Senha: Admin@2025
```

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro login!

---

## 🛣️ Novas Rotas de API

### Rotas Administrativas (Prefixo: `/api/v1/admin`)

#### 👥 Gestão de Usuários

**Listar Usuários** (Admin e Moderator)

```http
GET /api/v1/admin/usuarios
Authorization: Bearer {token}

Query Params:
  - page: número da página (padrão: 1)
  - limit: resultados por página (padrão: 20)
  - role: filtrar por role (user, moderator, admin)
  - ativo: filtrar por status (true, false)
  - search: buscar por nome ou email
```

**Buscar Usuário por ID** (Admin e Moderator)

```http
GET /api/v1/admin/usuarios/:id
Authorization: Bearer {token}
```

**Criar Usuário** (Apenas Admin)

```http
POST /api/v1/admin/usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "senha123",
  "role": "user"  // opcional, padrão: user
}
```

**Atualizar Usuário** (Apenas Admin)

```http
PUT /api/v1/admin/usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Novo Nome",           // opcional
  "email": "novo@email.com",     // opcional
  "role": "moderator",           // opcional
  "ativo": false                 // opcional
}
```

**Deletar Usuário** (Apenas Admin)

```http
DELETE /api/v1/admin/usuarios/:id
Authorization: Bearer {token}
```

#### 📊 Dashboard e Relatórios

**Dashboard Administrativo** (Admin e Moderator)

```http
GET /api/v1/admin/dashboard
Authorization: Bearer {token}

Retorna:
- Total de usuários por role
- Usuários ativos vs inativos
- Novos usuários últimos 7 dias
- Total de humores registrados
- Total de atividades
- Total de mensagens
```

**Logs de Auditoria** (Apenas Admin)

```http
GET /api/v1/admin/logs
Authorization: Bearer {token}

Query Params:
  - page: número da página (padrão: 1)
  - limit: resultados por página (padrão: 50)
  - usuario_id: filtrar por usuário
  - acao: filtrar por tipo de ação
```

---

## 🚀 Como Executar a Migração

### Método 1: Script Automatizado (Recomendado)

```bash
# 1. Certifique-se que as dependências estão instaladas
npm install

# 2. Execute o script de migração
node server/database/run_migration.js
```

### Método 2: SQL Manual

```bash
# 1. Conecte ao banco de dados
mysql -h mysql-giovana.alwaysdata.net -u giovana -p giovana_tcc

# 2. Execute o arquivo de migração
source server/database/migrations/001_add_roles.sql
```

### Método 3: Recriar Banco do Zero

```bash
# 1. Execute o schema atualizado
npm run db:init
```

---

## 📝 Alterações no Código

### Backend

#### ✅ Arquivos Criados:

- `server/database/migrations/001_add_roles.sql` - Script de migração
- `server/database/run_migration.js` - Script automatizado
- `server/database/generate_admin_hash.js` - Gerar hash de senha
- `server/middleware/checkRole.js` - Middleware de permissões
- `server/routes/admin.js` - Rotas administrativas

#### 📝 Arquivos Modificados:

- `server/database/schema.sql` - Schema atualizado
- `server/controllers/authController.js` - Removido `avatar`, adicionado `role`
- `server/middleware/auth.js` - Adiciona `req.userRole`
- `server/index.js` - Importa rotas administrativas

### Frontend

#### 📝 Arquivos Modificados:

- `emoconnect/js/auth.js`:
  - Removido `avatar` de `saveUser()`
  - Removido `getUserAvatar()`
  - Adicionado `getUserRole()`
  - Adicionado `isAdmin()`
  - Adicionado `isModerator()`
  - Adicionado `isModeratorOrAdmin()`

#### ⚠️ Páginas a Atualizar:

- `emoconnect/html/cadastro.html` - Remover seletor de avatar
- `emoconnect/html/perfil.html` - Remover edição de avatar

---

## 🧪 Como Testar

### 1. Executar Migração

```bash
npm run migrate  # (se adicionar script no package.json)
# OU
node server/database/run_migration.js
```

### 2. Testar Login Admin

```bash
# No Insomnia/Postman:
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@emoconnect.com",
  "senha": "Admin@2025"
}

# Resposta deve incluir:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "nome": "Administrador",
      "email": "admin@emoconnect.com",
      "role": "admin"
    },
    "token": "eyJhbGc..."
  }
}
```

### 3. Testar Rotas Admin

```bash
# Listar usuários (use o token do admin)
GET http://localhost:3000/api/v1/admin/usuarios
Authorization: Bearer {token_admin}

# Dashboard
GET http://localhost:3000/api/v1/admin/dashboard
Authorization: Bearer {token_admin}
```

### 4. Testar Permissões

```bash
# Criar usuário comum
POST http://localhost:3000/api/v1/auth/cadastro
{
  "nome": "Usuário Teste",
  "email": "teste@email.com",
  "senha": "teste123"
}

# Tentar acessar rota admin com usuário comum (deve falhar)
GET http://localhost:3000/api/v1/admin/usuarios
Authorization: Bearer {token_usuario_comum}

# Esperado: 403 Forbidden
```

---

## 📊 Estrutura do Banco de Dados

### Tabela `usuarios` (Atualizada)

```sql
CREATE TABLE usuarios (
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
);
```

### Tabela `permissoes` (Nova)

```sql
CREATE TABLE permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('user', 'moderator', 'admin') NOT NULL,
    recurso VARCHAR(100) NOT NULL,
    pode_criar BOOLEAN DEFAULT FALSE,
    pode_ler BOOLEAN DEFAULT TRUE,
    pode_atualizar BOOLEAN DEFAULT FALSE,
    pode_deletar BOOLEAN DEFAULT FALSE,
    UNIQUE KEY idx_role_recurso (role, recurso)
);
```

### Tabela `logs_auditoria` (Nova)

```sql
CREATE TABLE logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(100) NOT NULL,
    recurso VARCHAR(100),
    recurso_id INT,
    detalhes JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario_data (usuario_id, data_acao),
    INDEX idx_acao (acao),
    INDEX idx_data (data_acao)
);
```

---

## 🔒 Segurança

### ✅ Implementado:

- JWT com role incluído no payload
- Middleware de verificação de role
- Verificação de permissões no banco de dados
- Log de auditoria para ações críticas
- Proteção contra auto-deleção de admin
- Hash seguro de senhas (bcrypt)

### 🎯 Boas Práticas:

- **Altere a senha do admin após primeiro login**
- **Não compartilhe credenciais de admin**
- **Revise logs de auditoria regularmente**
- **Promova usuários a moderator/admin apenas quando necessário**
- **Desative contas suspeitas imediatamente**

---

## 📦 Scripts Adicionais no package.json

Adicione estes scripts úteis:

```json
{
  "scripts": {
    "migrate": "node server/database/run_migration.js",
    "generate-admin-hash": "node server/database/generate_admin_hash.js",
    "db:reset": "npm run db:drop && npm run db:init && npm run migrate"
  }
}
```

---

## 🆘 Troubleshooting

### Erro: "Column 'avatar' doesn't exist"

**Solução:** Execute a migração para remover a coluna avatar.

### Erro: "Unknown column 'role' in field list"

**Solução:** Execute a migração para adicionar a coluna role.

### Erro: "Access denied" nas rotas admin

**Solução:** Verifique se o token JWT inclui o campo `role` e se o usuário tem permissão.

### Erro: "Cannot login as admin"

**Solução:** Verifique se a migração criou o usuário admin corretamente.

---

## 📚 Documentação Adicional

- [Schema completo](./schema.sql)
- [Migração 001](./migrations/001_add_roles.sql)
- [Middleware de Roles](../middleware/checkRole.js)
- [Rotas Admin](../routes/admin.js)

---

## ✅ Checklist de Migração

- [ ] Backup do banco de dados criado
- [ ] Script de migração executado com sucesso
- [ ] Usuário admin criado e testado
- [ ] Login admin funcionando
- [ ] Rotas administrativas acessíveis
- [ ] Permissões testadas (user não acessa rotas admin)
- [ ] Dashboard administrativo funcionando
- [ ] Logs de auditoria sendo criados
- [ ] Frontend atualizado (avatar removido)
- [ ] Documentação atualizada

---

**🎉 Migração Completa! Seu sistema agora possui controle total de acesso baseado em roles!**
