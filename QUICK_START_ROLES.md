# 🚀 INÍCIO RÁPIDO - Sistema de Roles

## ⚡ TL;DR

```bash
# 1. Executar migração
npm run migrate

# 2. Iniciar servidor
npm run dev

# 3. Login como admin
POST http://localhost:3000/api/v1/auth/login
{
  "email": "admin@emoconnect.com",
  "senha": "Admin@2025"
}

# 4. Acessar dashboard
GET http://localhost:3000/api/v1/admin/dashboard
Authorization: Bearer {seu_token}
```

---

## 📋 Mudanças Principais

### ❌ Removido

- Campo `avatar` (não é mais necessário)

### ✅ Adicionado

- Campo `role` (user, moderator, admin)
- Sistema completo de permissões
- Painel administrativo
- Logs de auditoria

---

## 🔐 Credenciais Admin

```
Email: admin@emoconnect.com
Senha: Admin@2025
```

⚠️ **Altere após primeiro login!**

---

## 📊 Estrutura de Roles

```
👑 ADMIN
  └── Acesso total
      └── Gerenciar usuários
      └── Ver logs
      └── Dashboard completo

👮 MODERATOR
  └── Ver usuários
  └── Ver relatórios
  └── [Não pode criar/deletar usuários]

🙂 USER
  └── Funcionalidades básicas
  └── Não pode acessar painel admin
```

---

## 🛣️ Novas Rotas

### `/api/v1/admin` (Requer Auth)

| Rota            | Método | Permissão | Descrição       |
| --------------- | ------ | --------- | --------------- |
| `/usuarios`     | GET    | Mod/Admin | Listar usuários |
| `/usuarios/:id` | GET    | Mod/Admin | Ver usuário     |
| `/usuarios`     | POST   | Admin     | Criar usuário   |
| `/usuarios/:id` | PUT    | Admin     | Editar usuário  |
| `/usuarios/:id` | DELETE | Admin     | Deletar usuário |
| `/dashboard`    | GET    | Mod/Admin | Estatísticas    |
| `/logs`         | GET    | Admin     | Auditoria       |

---

## 🧪 Testes Rápidos

### 1. Login Admin

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@emoconnect.com","senha":"Admin@2025"}'
```

### 2. Dashboard

```bash
curl http://localhost:3000/api/v1/admin/dashboard \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Criar Usuário

```bash
curl -X POST http://localhost:3000/api/v1/admin/usuarios \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Novo User","email":"novo@email.com","senha":"senha123","role":"user"}'
```

---

## 💻 Uso no Frontend

```javascript
import { isAdmin, isModerator, getUserRole } from "./auth.js";

// Verificar se é admin
if (isAdmin()) {
  // Mostrar painel admin
}

// Verificar role específico
const role = getUserRole(); // 'user', 'moderator', 'admin'

// Verificar se pode acessar relatórios
if (isModerator() || isAdmin()) {
  // Mostrar relatórios
}
```

---

## 📦 Scripts Disponíveis

```bash
# Executar migração
npm run migrate

# Gerar novo hash de senha
npm run generate-admin-hash

# Testar conexão
npm run db:test

# Inicializar banco completo
npm run db:init

# Iniciar dev server
npm run dev
```

---

## 🐛 Troubleshooting

### Erro: "Column 'role' doesn't exist"

```bash
npm run migrate
```

### Erro: "Cannot login as admin"

```bash
# Verificar se admin foi criado
npm run migrate

# Ou recriar banco
npm run db:init
```

### Erro: 403 Forbidden nas rotas admin

- Verifique se o token é de admin
- Token deve incluir `"role": "admin"` no payload

---

## 📚 Documentação Completa

- [ROLES_E_PERMISSOES.md](./ROLES_E_PERMISSOES.md) - Guia detalhado
- [RESUMO_ROLES.md](./RESUMO_ROLES.md) - Referência completa

---

## ✅ Checklist

- [ ] Migração executada (`npm run migrate`)
- [ ] Admin logado com sucesso
- [ ] Dashboard acessível
- [ ] Usuário comum criado
- [ ] Testado: user não acessa rotas admin
- [ ] Senha admin alterada
- [ ] Tudo commitado no GitHub

---

**🎉 Sistema Pronto! Boa sorte no TCC! 🚀**
