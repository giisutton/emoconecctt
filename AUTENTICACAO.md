# 🔐 Sistema de Autenticação - EmoConnect

## Visão Geral

Sistema completo de autenticação com:

- ✅ Cadastro de usuários
- ✅ Login com senha hash (bcrypt)
- ✅ JWT (JSON Web Token) para sessões
- ✅ Proteção de rotas no frontend
- ✅ Middleware de autenticação no backend
- ✅ Persistência de sessão
- ✅ Logout

---

## 📦 Dependências Necessárias

```bash
npm install bcrypt jsonwebtoken cookie-parser
```

---

## 🗂️ Arquivos Criados

### Backend:

1. `server/controllers/authController.js` - Lógica de autenticação
2. `server/middleware/auth.js` - Middleware de proteção
3. `server/routes/auth.js` - Rotas de autenticação

### Frontend:

4. `emoconnect/html/login.html` - Página de login
5. `emoconnect/html/cadastro.html` - Página de cadastro
6. `emoconnect/js/auth.js` - Lógica de autenticação frontend
7. `emoconnect/css/auth.css` - Estilos de login/cadastro

---

## 🔐 Fluxo de Autenticação

```
1. Usuário acessa o site
   ↓
2. Verifica se tem token JWT válido
   ↓
   SIM → Vai para dashboard
   NÃO → Redireciona para login
   ↓
3. Login/Cadastro
   ↓
4. Backend valida e retorna JWT
   ↓
5. Frontend salva JWT no localStorage
   ↓
6. Todas as requisições incluem JWT no header
   ↓
7. Backend valida JWT em cada requisição protegida
```

---

## 📝 Estrutura do Token JWT

```json
{
  "userId": 123,
  "email": "usuario@email.com",
  "nome": "João Silva",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 🛡️ Segurança Implementada

- ✅ Senhas com hash bcrypt (salt rounds: 10)
- ✅ JWT com expiração de 7 dias
- ✅ Tokens armazenados apenas no localStorage (httpOnly não funciona no frontend)
- ✅ Validação de email único
- ✅ Validação de força de senha
- ✅ Proteção contra SQL Injection (prepared statements)
- ✅ Rate limiting nas rotas de auth
- ✅ CORS configurado

---

## 🚀 Como Usar

### 1. Instalar dependências

```bash
npm install bcrypt jsonwebtoken cookie-parser
```

### 2. Atualizar .env

```env
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456
JWT_EXPIRES_IN=7d
```

### 3. Criar tabela de usuários (já existe no schema.sql)

### 4. Reiniciar servidor

```bash
npm run dev
```

### 5. Testar

- Acesse: http://localhost:5173/html/cadastro.html
- Crie uma conta
- Faça login
- Será redirecionado para index.html (protegido)

---

## 📋 Rotas da API

### Públicas (sem autenticação)

- `POST /api/v1/auth/cadastro` - Criar conta
- `POST /api/v1/auth/login` - Fazer login
- `GET /api/v1/auth/verificar-email/:email` - Verificar se email existe

### Protegidas (requerem token JWT)

- `GET /api/v1/auth/me` - Dados do usuário logado
- `PUT /api/v1/auth/perfil` - Atualizar perfil
- `PUT /api/v1/auth/senha` - Alterar senha
- `POST /api/v1/auth/logout` - Fazer logout
- Todas as rotas de `/api/v1/data/*` (humores, atividades, etc)

---

## 🧪 Testando com cURL

### Cadastro

```bash
curl -X POST http://localhost:3000/api/v1/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

### Rota Protegida

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🐛 Troubleshooting

### Erro: "Token inválido"

- Verifique se o token está sendo enviado no header
- Verifique se JWT_SECRET está configurado no .env
- Verifique se o token não expirou

### Erro: "Email já cadastrado"

- Email já existe no banco de dados
- Use outro email ou faça login

### Erro: "Senha incorreta"

- Verifique se a senha está correta
- Senhas são case-sensitive

---

## 📱 Frontend: Como Usar

### Verificar se está logado

```javascript
import {
  isAuthenticated,
  getUser,
  redirectIfNotAuthenticated
} from "./auth.js";

// Em qualquer página protegida
redirectIfNotAuthenticated();

// Obter dados do usuário
const user = getUser();
console.log(user.nome); // "João Silva"
```

### Fazer logout

```javascript
import { logout } from "./auth.js";

document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
});
```

### Fazer requisição autenticada

```javascript
import { fetchWithAuth } from "./auth.js";

// GET
const humores = await fetchWithAuth("/api/v1/data/humores/123");

// POST
const novoHumor = await fetchWithAuth("/api/v1/data/humores", {
  method: "POST",
  body: JSON.stringify({ humor: "Feliz", intensidade: 8 })
});
```

---

## 🔄 Próximos Passos

1. ✅ Instalar dependências
2. ✅ Configurar JWT_SECRET no .env
3. ✅ Adicionar os novos arquivos ao projeto
4. ✅ Testar cadastro e login
5. ✅ Proteger todas as páginas (index.html, chat.html, perfil.html)
6. ✅ Integrar dados do usuário logado nas páginas

---

## 📖 Referências

- [JWT.io](https://jwt.io/) - Debugar tokens JWT
- [bcrypt npm](https://www.npmjs.com/package/bcrypt) - Hash de senhas
- [Express JWT](https://www.npmjs.com/package/jsonwebtoken) - JWT para Node.js
