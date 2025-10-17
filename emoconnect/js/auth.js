// emoconnect/js/auth.js - Sistema de Autenticação Frontend

const API_BASE_URL = "/api/v1";
const TOKEN_KEY = "emoconnect_token";
const USER_KEY = "emoconnect_user";

// ===========================
// FUNÇÕES DE ARMAZENAMENTO
// ===========================

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Compatibilidade com código existente
  localStorage.setItem("userName", user.nome);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userAvatar", user.avatar || "😊");
}

export function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userAvatar");
}

// ===========================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// ===========================

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    // Decodificar JWT (sem verificar assinatura)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Verificar se token expirou
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    console.error("Token inválido:", error);
    return false;
  }
}

export function redirectIfNotAuthenticated() {
  if (!isAuthenticated()) {
    window.location.href = "/html/login.html";
  }
}

export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = "/html/index.html";
  }
}

// ===========================
// REQUISIÇÕES AUTENTICADAS
// ===========================

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Não autenticado");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Token expirado ou inválido
    if (response.status === 401 || response.status === 403) {
      const data = await response.json();

      if (data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN") {
        logout();
        window.location.href = "/html/login.html?expired=true";
        throw new Error("Sessão expirada");
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro na requisição");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

// ===========================
// CADASTRO
// ===========================

export async function cadastrar(nome, email, senha, avatar = "😊") {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email, senha, avatar })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao cadastrar");
    }

    // Salvar token e dados do usuário
    saveToken(data.data.token);
    saveUser(data.data.user);

    return data;
  } catch (error) {
    console.error("Erro no cadastro:", error);
    throw error;
  }
}

// ===========================
// LOGIN
// ===========================

export async function login(email, senha) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao fazer login");
    }

    // Salvar token e dados do usuário
    saveToken(data.data.token);
    saveUser(data.data.user);

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

// ===========================
// LOGOUT
// ===========================

export async function logout() {
  try {
    // Tentar fazer logout no servidor (não é crítico)
    const token = getToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch(() => {});
    }
  } finally {
    // Remover dados locais
    removeToken();
    removeUser();
  }
}

// ===========================
// ATUALIZAR PERFIL
// ===========================

export async function atualizarPerfil(nome, avatar) {
  try {
    const data = await fetchWithAuth(`${API_BASE_URL}/auth/perfil`, {
      method: "PUT",
      body: JSON.stringify({ nome, avatar })
    });

    // Atualizar dados locais
    saveUser(data.data);

    return data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}

// ===========================
// ALTERAR SENHA
// ===========================

export async function alterarSenha(senhaAtual, novaSenha) {
  try {
    const data = await fetchWithAuth(`${API_BASE_URL}/auth/senha`, {
      method: "PUT",
      body: JSON.stringify({ senhaAtual, novaSenha })
    });

    return data;
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    throw error;
  }
}

// ===========================
// OBTER DADOS DO USUÁRIO
// ===========================

export async function obterDadosUsuario() {
  try {
    const data = await fetchWithAuth(`${API_BASE_URL}/auth/me`);

    // Atualizar dados locais
    saveUser(data.data);

    return data.data;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    throw error;
  }
}

// ===========================
// VERIFICAR EMAIL
// ===========================

export async function verificarEmail(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/verificar-email/${encodeURIComponent(email)}`
    );
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return false;
  }
}

// ===========================
// HELPERS
// ===========================

export function getUserId() {
  const user = getUser();
  return user ? user.id : null;
}

export function getUserName() {
  const user = getUser();
  return user ? user.nome : "Usuário";
}

export function getUserEmail() {
  const user = getUser();
  return user ? user.email : "";
}

export function getUserAvatar() {
  const user = getUser();
  return user ? user.avatar : "😊";
}
