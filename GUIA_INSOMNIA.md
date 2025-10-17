# 🧪 Guia de Testes - Insomnia

## 📥 Como Importar a Coleção

1. **Abra o Insomnia**
2. Clique em **"Create"** ou **"Import/Export"**
3. Selecione **"Import Data"** → **"From File"**
4. Escolha o arquivo: `Insomnia_EmoConnect_Collection.json`
5. A coleção **"EmoConnect API"** aparecerá na sidebar

---

## 🎯 Fluxo de Teste Completo

### 1️⃣ **Criar uma Conta (Cadastro)**

📍 **Rota:** `POST /api/v1/auth/cadastro`

**Request:**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "avatar": "😊"
}
```

**Response Esperado (201 Created):**

```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "avatar": "😊",
      "data_criacao": "2025-10-17T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

✅ **IMPORTANTE:** Copie o `token` retornado!

---

### 2️⃣ **Salvar o Token**

Depois de fazer cadastro ou login:

1. **Copie o token** da resposta
2. No Insomnia, clique em **"Environment"** (canto superior esquerdo)
3. Selecione **"Base Environment"**
4. Cole o token no campo `"token"`:

```json
{
  "base_url": "http://localhost:3000",
  "api_url": "http://localhost:3000/api/v1",
  "token": "COLE_SEU_TOKEN_AQUI"
}
```

5. Clique em **"Done"**

Agora todas as rotas protegidas funcionarão automaticamente! 🎉

---

### 3️⃣ **Fazer Login (se já tiver conta)**

📍 **Rota:** `POST /api/v1/auth/login`

**Request:**

```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Response Esperado (200 OK):**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "avatar": "😊",
      "ativo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4️⃣ **Testar Rotas Protegidas**

Agora que você tem o token salvo, teste as rotas protegidas:

#### 📌 Obter Meus Dados

📍 `GET /api/v1/auth/me`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "avatar": "😊",
    "data_criacao": "2025-10-17T...",
    "data_atualizacao": "2025-10-17T..."
  }
}
```

#### 📌 Salvar Humor

📍 `POST /api/v1/data/humores`

**Request:**

```json
{
  "usuario_id": 1,
  "humor": "Feliz",
  "intensidade": 8,
  "observacoes": "Dia produtivo!"
}
```

#### 📌 Chat com IA

📍 `POST /api/v1/chat/gemini`

**Request:**

```json
{
  "message": "Estou me sentindo ansioso hoje. O que devo fazer?"
}
```

**Response:**

```json
{
  "response": "Entendo que você está se sentindo ansioso...",
  "timestamp": "2025-10-17T..."
}
```

---

## 📋 Todas as Rotas Disponíveis

### 🔐 Autenticação (Públicas)

| Método | Rota                                  | Descrição                 |
| ------ | ------------------------------------- | ------------------------- |
| POST   | `/api/v1/auth/cadastro`               | Criar conta               |
| POST   | `/api/v1/auth/login`                  | Fazer login               |
| GET    | `/api/v1/auth/verificar-email/:email` | Verificar se email existe |

### 🔐 Autenticação (Protegidas - Requer Token)

| Método | Rota                  | Descrição               |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/v1/auth/me`     | Dados do usuário logado |
| PUT    | `/api/v1/auth/perfil` | Atualizar nome/avatar   |
| PUT    | `/api/v1/auth/senha`  | Alterar senha           |
| POST   | `/api/v1/auth/logout` | Fazer logout            |

### 😊 Humores (Protegidas)

| Método | Rota                                      | Descrição      |
| ------ | ----------------------------------------- | -------------- |
| GET    | `/api/v1/data/humores/:usuario_id?dias=7` | Buscar humores |
| POST   | `/api/v1/data/humores`                    | Salvar humor   |

### ✅ Atividades (Protegidas)

| Método | Rota                                              | Descrição         |
| ------ | ------------------------------------------------- | ----------------- |
| GET    | `/api/v1/data/atividades/:usuario_id?tipo=Fisica` | Buscar atividades |
| POST   | `/api/v1/data/atividades`                         | Salvar atividade  |

### 💬 Chat & Mensagens

| Método | Rota                                          | Descrição                    |
| ------ | --------------------------------------------- | ---------------------------- |
| POST   | `/api/v1/chat/gemini`                         | Chat com IA (pública)        |
| GET    | `/api/v1/data/mensagens/:usuario_id/:contato` | Buscar mensagens (protegida) |
| POST   | `/api/v1/data/mensagens`                      | Salvar mensagem (protegida)  |

### 📊 Progresso (Protegidas)

| Método | Rota                                 | Descrição        |
| ------ | ------------------------------------ | ---------------- |
| GET    | `/api/v1/data/progresso/:usuario_id` | Buscar progresso |
| POST   | `/api/v1/data/progresso`             | Salvar progresso |

### 🧘 Respiração (Protegidas)

| Método | Rota                      | Descrição     |
| ------ | ------------------------- | ------------- |
| POST   | `/api/v1/data/respiracao` | Salvar sessão |

### 🏥 Health Check (Pública)

| Método | Rota             | Descrição          |
| ------ | ---------------- | ------------------ |
| GET    | `/api/v1/health` | Status do servidor |

---

## 🧪 Casos de Teste

### ✅ Teste 1: Fluxo Completo de Usuário

```
1. POST /auth/cadastro (criar conta)
2. Copiar token
3. GET /auth/me (verificar dados)
4. POST /data/humores (registrar humor)
5. POST /chat/gemini (conversar com IA)
6. GET /data/humores/1 (ver histórico)
7. PUT /auth/perfil (atualizar perfil)
8. POST /auth/logout
```

### ✅ Teste 2: Verificar Proteção de Rotas

```
1. GET /auth/me SEM token
   ❌ Esperado: 401 Unauthorized

2. POST /data/humores SEM token
   ❌ Esperado: 401 Unauthorized

3. POST /auth/login (fazer login)
4. Copiar token
5. GET /auth/me COM token
   ✅ Esperado: 200 OK
```

### ✅ Teste 3: Validações

```
1. POST /auth/cadastro com email duplicado
   ❌ Esperado: 409 Conflict

2. POST /auth/login com senha errada
   ❌ Esperado: 401 Unauthorized

3. POST /data/humores sem campos obrigatórios
   ❌ Esperado: 400 Bad Request
```

---

## 🐛 Erros Comuns

### ❌ Error: "Token não fornecido"

**Solução:** Configure o token no Environment do Insomnia

### ❌ Error: "Token expirado"

**Solução:** Faça login novamente e atualize o token

### ❌ Error: "Email já cadastrado"

**Solução:** Use outro email ou faça login

### ❌ Error: "Connection refused"

**Solução:** Verifique se o servidor está rodando (`npm run dev`)

---

## 📊 Códigos de Status HTTP

| Código | Significado  | Quando aparece            |
| ------ | ------------ | ------------------------- |
| 200    | OK           | Requisição bem-sucedida   |
| 201    | Created      | Recurso criado (cadastro) |
| 400    | Bad Request  | Dados inválidos           |
| 401    | Unauthorized | Token ausente/inválido    |
| 403    | Forbidden    | Token expirado            |
| 404    | Not Found    | Recurso não encontrado    |
| 409    | Conflict     | Email duplicado           |
| 500    | Server Error | Erro interno do servidor  |

---

## 🚀 Dicas Pro

1. **Use variáveis de ambiente** para alternar entre dev/prod
2. **Organize requests em folders** por funcionalidade
3. **Use chains** para executar múltiplas requests
4. **Salve exemplos** de responses para documentação

---

## 📖 Alternativas ao Insomnia

Se preferir outras ferramentas:

### Postman

Importe criando uma collection similar

### cURL (Terminal)

```bash
# Cadastro
curl -X POST http://localhost:3000/api/v1/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"senha123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"senha123"}'

# Rota protegida
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### REST Client (VS Code Extension)

Crie arquivo `.http`:

```http
### Cadastro
POST http://localhost:3000/api/v1/auth/cadastro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}

### Login
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

---

## ✅ Checklist Final

- [ ] Insomnia instalado
- [ ] Coleção importada
- [ ] Servidor rodando (`npm run dev`)
- [ ] Conta criada (cadastro)
- [ ] Token salvo no Environment
- [ ] Rotas protegidas testadas
- [ ] Chat com IA testado
- [ ] Humores salvos
- [ ] Logout testado

---

**🎉 Tudo pronto para testar! Boa sorte! 🚀**
