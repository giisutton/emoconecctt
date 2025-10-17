# 🔒 Script de Proteção de Rotas

## Adicione este código no início de cada arquivo HTML protegido

### Para index.html, chat.html, perfil.html

Adicione este script logo após a tag `<body>` (antes de qualquer outro conteúdo):

```html
<!-- Proteção de Rota - Verificar Autenticação -->
<script type="module">
  import { redirectIfNotAuthenticated } from "../js/auth.js";
  redirectIfNotAuthenticated();
</script>
```

## Exemplo completo para index.html:

```html
<body>
  <!-- Proteção de Rota -->
  <script type="module">
    import { redirectIfNotAuthenticated } from "../js/auth.js";
    redirectIfNotAuthenticated();
  </script>

  <header>
    <!-- resto do conteúdo -->
  </header>

  <!-- ... -->
</body>
```

---

## Adicionar Botão de Logout no Header

### Atualizar o header em todas as páginas protegidas:

```html
<header>
  <div class="container">
    <h1>🌟 EmoConnect</h1>
    <p class="slogan">Conecte-se com suas emoções. Compartilhe. Inspire.</p>
    <nav>
      <ul>
        <li><a href="index.html" class="active">Início</a></li>
        <li><a href="perfil.html">Perfil</a></li>
        <li><a href="chat.html">Chat</a></li>
        <li>
          <a href="#" id="logout-btn" style="color: #ff4757;">
            <i class="fas fa-sign-out-alt"></i> Sair
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <button id="toggle-theme" class="theme-toggle" title="Alternar tema">
    🌙
  </button>
</header>

<!-- Script de Logout -->
<script type="module">
  import { logout } from "../js/auth.js";

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmar = confirm("Deseja realmente sair?");
      if (confirmar) {
        await logout();
        window.location.href = "/html/login.html";
      }
    });
  }
</script>
```

---

## Mostrar Nome do Usuário Logado

### Atualizar a seção de boas-vindas:

```html
<div class="welcome-banner">
  <h2>Olá, <span id="user-name">Carregando...</span>!</h2>
  <p>Hoje é <span id="current-date">Quarta-feira, 17 de setembro</span></p>
</div>

<script type="module">
  import { getUserName } from "../js/auth.js";

  const userName = document.getElementById("user-name");
  if (userName) {
    userName.textContent = getUserName();
  }
</script>
```

---

## Usar userId nas Requisições

### Exemplo: Salvar humor com ID do usuário logado

```javascript
import { getUserId, fetchWithAuth } from "../js/auth.js";

async function salvarHumorDiario(mood) {
  const userId = getUserId();

  try {
    const response = await fetchWithAuth("/api/v1/data/humores", {
      method: "POST",
      body: JSON.stringify({
        usuario_id: userId,
        humor: mood,
        intensidade: 5
      })
    });

    console.log("Humor salvo:", response);
  } catch (error) {
    console.error("Erro ao salvar humor:", error);
    // Continua funcionando com localStorage como fallback
    const hoje = new Date().toISOString().split("T")[0];
    const humores = JSON.parse(localStorage.getItem("humores") || "{}");
    humores[hoje] = mood;
    localStorage.setItem("humores", JSON.stringify(humores));
  }
}
```

---

## Checklist de Implementação

### Páginas para Proteger:

- [ ] index.html - Adicionar proteção de rota
- [ ] chat.html - Adicionar proteção de rota
- [ ] perfil.html - Adicionar proteção de rota

### Header:

- [ ] Adicionar botão de logout
- [ ] Mostrar nome do usuário logado
- [ ] Mostrar avatar do usuário (opcional)

### Main.js:

- [ ] Importar `getUserId()` do auth.js
- [ ] Usar `getUserId()` nas funções que salvam dados
- [ ] Usar `fetchWithAuth()` para requisições protegidas

### Chat.js:

- [ ] Usar `getUserId()` para salvar mensagens
- [ ] Usar `fetchWithAuth()` para chat com IA

### Perfil.js:

- [ ] Usar `getUserId()` para atualizar perfil
- [ ] Usar `atualizarPerfil()` e `alterarSenha()` do auth.js

---

## Testar Sistema de Autenticação

1. **Acesse:** http://localhost:5173/html/index.html
   - Deve redirecionar para login

2. **Crie uma conta:** http://localhost:5173/html/cadastro.html
   - Preencha nome, email, senha
   - Escolha um avatar
   - Clique em "Criar Conta"

3. **Verifique redirecionamento:**
   - Deve ir para index.html após cadastro
   - Nome do usuário deve aparecer no header

4. **Teste navegação:**
   - Vá para chat.html
   - Vá para perfil.html
   - Todas devem funcionar (está logado)

5. **Teste logout:**
   - Clique no botão "Sair"
   - Deve voltar para login.html

6. **Teste sessão:**
   - Feche o navegador
   - Abra novamente
   - Acesse index.html
   - Deve continuar logado (token salvo)

7. **Teste login:**
   - Faça logout
   - Acesse login.html
   - Entre com email e senha
   - Deve voltar para index.html

---

## Comandos para Executar

```bash
# 1. Instalar novas dependências
npm install

# 2. Verificar .env
cat .env  # Linux/Mac
type .env  # Windows

# 3. Testar conexão com banco (opcional)
npm run db:test

# 4. Iniciar servidor
npm run dev

# 5. Acessar aplicação
# http://localhost:5173/html/cadastro.html
```
