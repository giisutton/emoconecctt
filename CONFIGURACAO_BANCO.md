# 🔧 Configuração do Banco de Dados AlwaysData

## Status Atual
❌ **Erro de Autenticação**: Access denied for user 'giovana'@'177.128.255.194'

## Possíveis Causas

### 1. Nome de Usuário Incorreto
No AlwaysData, o usuário MySQL geralmente tem um formato específico:
- Pode ser: `giovana_tcc` (mesmo nome do banco)
- Ou: `giovana_usuario` (com prefixo específico)
- Ou: `giovana` (seu nome de login)

### 2. Senha Incorreta
- Verifique se a senha está correta: `gi170807`
- Senhas no MySQL são case-sensitive

### 3. Restrições de IP
- O AlwaysData pode ter restrições de acesso por IP
- Seu IP atual: `177.128.255.194`
- Pode ser necessário liberar este IP no painel

## ✅ Como Verificar no Painel AlwaysData

### Passo 1: Login
1. Acesse: https://admin.alwaysdata.com/
2. Faça login com suas credenciais

### Passo 2: Verificar Banco de Dados
1. No menu lateral, clique em **"Databases"** ou **"Bancos de Dados"**
2. Procure pelo banco: `giovana_tcc`
3. Anote o nome EXATO do banco de dados

### Passo 3: Verificar Usuário MySQL
1. Na mesma página de Databases, procure pela seção de **usuários**
2. Verifique o nome de usuário EXATO (pode ter um prefixo)
3. Exemplo: `giovana_tcc` ou `giovana_user`

### Passo 4: Verificar Host
1. O host deve ser: `mysql-giovana.alwaysdata.net`
2. Porta padrão: `3306`

### Passo 5: Resetar Senha (se necessário)
1. Se não tiver certeza da senha, clique em **"Editar"** no usuário
2. Defina uma nova senha
3. Anote a nova senha

### Passo 6: Verificar Permissões
1. Certifique-se de que o usuário tem permissões no banco `giovana_tcc`
2. Permissões necessárias: SELECT, INSERT, UPDATE, DELETE, CREATE

## 🔐 Credenciais Atuais no .env

```
DB_HOST=mysql-giovana.alwaysdata.net
DB_PORT=3306
DB_NAME=giovana_tcc
DB_USER=giovana
DB_PASSWORD=gi170807
```

## 📝 Ações Necessárias

1. [ ] Acessar painel do AlwaysData
2. [ ] Verificar nome exato do banco de dados
3. [ ] Verificar nome exato do usuário MySQL
4. [ ] Confirmar senha do usuário
5. [ ] Verificar permissões do usuário
6. [ ] Atualizar arquivo .env com dados corretos
7. [ ] Testar conexão novamente

## 🧪 Testar Conexão Após Correção

Após atualizar o .env com as credenciais corretas, execute:

```bash
npm run db:test
```

Se funcionar, você verá:
```
✅ Pool de conexões MySQL criado com sucesso
✅ Conexão com MySQL bem-sucedida: [ { result: 2 } ]
```

## 🚀 Inicializar Banco de Dados

Depois que a conexão funcionar, execute para criar as tabelas:

```bash
npm run db:init
```

## 💡 Alternativa: Usar phpMyAdmin

O AlwaysData oferece phpMyAdmin para gerenciar o banco:
1. Acesse: https://phpmyadmin.alwaysdata.com/
2. Use suas credenciais para fazer login
3. Teste se consegue acessar o banco `giovana_tcc`

## 📞 Suporte

Se o problema persistir, você pode:
1. Entrar em contato com o suporte do AlwaysData
2. Verificar a documentação: https://help.alwaysdata.com/en/databases/mysql/
3. Criar um novo usuário MySQL no painel

---

**IMPORTANTE**: Após verificar as credenciais corretas no painel do AlwaysData, atualize o arquivo `.env` com os valores exatos e teste novamente.
