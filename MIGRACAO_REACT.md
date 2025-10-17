# 🚀 Guia de Migração: Vanilla JS → React

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura Proposta](#estrutura-proposta)
3. [Passo a Passo](#passo-a-passo)
4. [Componentes React](#componentes-react)
5. [Gerenciamento de Estado](#gerenciamento-de-estado)
6. [Rotas](#rotas)
7. [Comparação Antes/Depois](#comparação-antesdepois)

---

## 🎯 Visão Geral

### Por que migrar para React?

**Vantagens:**

- ✅ Componentização e reutilização de código
- ✅ Gerenciamento de estado mais robusto (Context API / Redux)
- ✅ Ecosistema rico (React Router, React Query, etc.)
- ✅ Developer Experience melhorada
- ✅ TypeScript integration fácil
- ✅ Melhor testabilidade

**Desvantagens:**

- ⚠️ Bundle maior (React + ReactDOM ≈ 140KB gzipped)
- ⚠️ Curva de aprendizado
- ⚠️ Mais complexidade inicial

### Estratégia de Migração

**Opção 1: Migração Incremental** (Recomendado)

- Manter backend intacto
- Criar nova pasta `src/` com React
- Migrar página por página
- Rodar em paralelo durante transição

**Opção 2: Migração Completa**

- Reescrever tudo de uma vez
- Risco maior, mas resultado mais consistente

---

## 🏗️ Estrutura Proposta

```
emoconecctt/
├── 📂 server/                          # Backend (sem mudanças)
│   └── ...
│
├── 📂 src/                             # Novo frontend React
│   ├── 📂 components/                  # Componentes reutilizáveis
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── mood/
│   │   │   ├── MoodSelector.jsx
│   │   │   ├── MoodCard.jsx
│   │   │   └── MoodMessage.jsx
│   │   ├── chat/
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── ContactList.jsx
│   │   │   └── ContactCard.jsx
│   │   ├── breathing/
│   │   │   ├── BreathingExercise.jsx
│   │   │   └── BreathingCircle.jsx
│   │   ├── profile/
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfileEditor.jsx
│   │   │   └── ProfileStats.jsx
│   │   ├── progress/
│   │   │   ├── WeeklyChart.jsx
│   │   │   ├── MonthlyCalendar.jsx
│   │   │   └── CategoryPieChart.jsx
│   │   └── community/
│   │       ├── PostList.jsx
│   │       ├── PostCard.jsx
│   │       └── PostForm.jsx
│   │
│   ├── 📂 pages/                       # Páginas principais
│   │   ├── Home.jsx
│   │   ├── Chat.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   │
│   ├── 📂 contexts/                    # Context API
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── MoodContext.jsx
│   │   └── ChatContext.jsx
│   │
│   ├── 📂 hooks/                       # Custom Hooks
│   │   ├── useLocalStorage.js
│   │   ├── useMood.js
│   │   ├── useChat.js
│   │   ├── useActivities.js
│   │   └── useGeminiAI.js
│   │
│   ├── 📂 services/                    # API calls
│   │   ├── api.js
│   │   ├── geminiService.js
│   │   ├── moodService.js
│   │   └── storageService.js
│   │
│   ├── 📂 utils/                       # Helpers
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   ├── 📂 styles/                      # CSS/SCSS
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── themes.css
│   │
│   ├── App.jsx                         # Componente raiz
│   ├── main.jsx                        # Entry point
│   └── router.jsx                      # React Router config
│
├── index.html                          # HTML único
├── package.json                        # Atualizado
├── vite.config.js                      # Configurado para React
└── jsconfig.json                       # Path aliases
```

---

## 📦 Passo 1: Instalar Dependências

### 1.1 Instalar React e dependências essenciais

```bash
npm install react react-dom react-router-dom
```

### 1.2 Instalar ferramentas de desenvolvimento

```bash
npm install -D @vitejs/plugin-react
npm install -D @types/react @types/react-dom  # Para IntelliSense
```

### 1.3 Bibliotecas adicionais (opcionais)

```bash
# Gerenciamento de estado global
npm install zustand  # ou redux toolkit

# Requisições HTTP
npm install axios react-query

# Formulários
npm install react-hook-form

# Ícones
npm install react-icons

# Gráficos
npm install recharts  # Alternativa React ao Chart.js

# Animações
npm install framer-motion
```

---

## ⚙️ Passo 2: Configurar Vite para React

### `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@services": resolve(__dirname, "src/services"),
      "@utils": resolve(__dirname, "src/utils"),
      "@contexts": resolve(__dirname, "src/contexts"),
      "@styles": resolve(__dirname, "src/styles")
    }
  },

  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"]
        }
      }
    }
  }
});
```

### `jsconfig.json` (Para IntelliSense)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@contexts/*": ["src/contexts/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 🎨 Passo 3: Criar Estrutura Base

### `index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="EmoConnect - Plataforma de apoio emocional"
    />
    <title>EmoConnect</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/App.jsx`

```jsx
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MoodProvider } from "./contexts/MoodContext";
import { AuthProvider } from "./contexts/AuthContext";
import AppRouter from "./router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MoodProvider>
            <AppRouter />
          </MoodProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### `src/router.jsx`

```jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
```

---

## 🧩 Passo 4: Criar Componentes Principais

### `src/components/common/Header.jsx`

```jsx
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <h1>🌟 EmoConnect</h1>
        <p className="slogan">
          Conecte-se com suas emoções. Compartilhe. Inspire.
        </p>

        <nav>
          <ul>
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/perfil"
                className={isActive("/perfil") ? "active" : ""}
              >
                Perfil
              </Link>
            </li>
            <li>
              <Link to="/chat" className={isActive("/chat") ? "active" : ""}>
                Chat
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <ThemeToggle />
    </header>
  );
}

export default Header;
```

### `src/components/mood/MoodSelector.jsx`

```jsx
import { useState } from "react";
import MoodCard from "./MoodCard";
import MoodMessage from "./MoodMessage";
import { useMood } from "@hooks/useMood";
import "./MoodSelector.css";

const MOODS = [
  { emoji: "😊", label: "Feliz" },
  { emoji: "😢", label: "Triste" },
  { emoji: "😴", label: "Cansado" },
  { emoji: "😤", label: "Estressado" },
  { emoji: "😬", label: "Ansioso" },
  { emoji: "🧘", label: "Calmo" },
  { emoji: "😄", label: "Empolgado" },
  { emoji: "🤔", label: "Confuso" }
];

function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState("");
  const { saveMood, getMoodMessage } = useMood();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    saveMood(mood);
  };

  return (
    <section className="feelings">
      <h2>Como você está se sentindo hoje?</h2>

      <div className="moods-grid">
        {MOODS.map((mood) => (
          <MoodCard
            key={mood.label}
            emoji={mood.emoji}
            label={mood.label}
            isSelected={selectedMood === mood.label}
            onClick={() => handleMoodSelect(mood.label)}
          />
        ))}
      </div>

      {selectedMood && (
        <MoodMessage
          mood={selectedMood}
          message={getMoodMessage(selectedMood)}
        />
      )}
    </section>
  );
}

export default MoodSelector;
```

### `src/components/mood/MoodCard.jsx`

```jsx
import "./MoodCard.css";

function MoodCard({ emoji, label, isSelected, onClick }) {
  return (
    <button
      className={`mood-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      aria-label={`Selecionar humor: ${label}`}
    >
      {emoji} <span>{label}</span>
    </button>
  );
}

export default MoodCard;
```

---

## 🪝 Passo 5: Criar Custom Hooks

### `src/hooks/useLocalStorage.js`

```javascript
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // Obter valor inicial do localStorage ou usar valor padrão
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Atualizar localStorage quando o valor mudar
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### `src/hooks/useMood.js`

```javascript
import { useContext } from "react";
import { MoodContext } from "@contexts/MoodContext";

export function useMood() {
  const context = useContext(MoodContext);

  if (!context) {
    throw new Error("useMood deve ser usado dentro de um MoodProvider");
  }

  return context;
}
```

### `src/hooks/useGeminiAI.js`

```javascript
import { useState } from "react";
import { sendMessageToGemini } from "@services/geminiService";

export function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message) => {
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessageToGemini(message);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
```

---

## 🌐 Passo 6: Criar Context Providers

### `src/contexts/ThemeContext.jsx`

```jsx
import { createContext, useState, useEffect } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### `src/contexts/MoodContext.jsx`

```jsx
import { createContext, useState, useCallback } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";

export const MoodContext = createContext();

const MOOD_MESSAGES = {
  Feliz: "Continue espalhando essa luz! ☀️",
  Triste: "Tudo bem não estar bem. Estamos com você. 💙",
  Cansado: "Descanse um pouco. Você merece. 😴",
  Estressado: "Respire fundo. Vai passar. 😌",
  Ansioso: "Uma coisa de cada vez. Você consegue. 🌸",
  Calmo: "Que paz! Continue assim. 🌿",
  Empolgado: "Que energia incrível! ⚡",
  Confuso: "Às vezes é assim mesmo. Vai clarear. 🌤️"
};

export function MoodProvider({ children }) {
  const [moodHistory, setMoodHistory] = useLocalStorage("moodHistory", []);
  const [currentMood, setCurrentMood] = useState(null);

  const saveMood = useCallback(
    (mood) => {
      const newEntry = {
        mood,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };

      setMoodHistory((prev) => [...prev, newEntry]);
      setCurrentMood(mood);
    },
    [setMoodHistory]
  );

  const getMoodMessage = (mood) => {
    return MOOD_MESSAGES[mood] || "Sentimento registrado.";
  };

  const getMoodsByDateRange = (startDate, endDate) => {
    return moodHistory.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  return (
    <MoodContext.Provider
      value={{
        moodHistory,
        currentMood,
        saveMood,
        getMoodMessage,
        getMoodsByDateRange
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}
```

---

## 🔌 Passo 7: Criar Services

### `src/services/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiService();
```

### `src/services/geminiService.js`

```javascript
import { api } from "./api";

export async function sendMessageToGemini(message) {
  try {
    const response = await api.post("/chat/gemini", { message });
    return response.text;
  } catch (error) {
    console.error("Erro ao enviar mensagem para Gemini:", error);
    throw new Error("Não foi possível obter resposta da IA");
  }
}
```

---

## 📄 Passo 8: Criar Páginas

### `src/pages/Home.jsx`

```jsx
import { useState } from "react";
import Header from "@components/common/Header";
import MoodSelector from "@components/mood/MoodSelector";
import ActionCards from "@components/actions/ActionCards";
import WellnessTips from "@components/wellness/WellnessTips";
import CommunityWall from "@components/community/CommunityWall";
import BreathingExercise from "@components/breathing/BreathingExercise";
import "./Home.css";

function Home() {
  const [showBreathing, setShowBreathing] = useState(false);
  const userName = localStorage.getItem("userName") || "Amigo";

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="home-page">
      <Header />

      <main>
        <div className="welcome-banner">
          <h2>Olá, {userName}!</h2>
          <p>Hoje é {today}</p>
        </div>

        <MoodSelector />

        <ActionCards onBreathingClick={() => setShowBreathing(true)} />

        <WellnessTips />

        <CommunityWall />
      </main>

      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      )}
    </div>
  );
}

export default Home;
```

### `src/pages/Chat.jsx`

```jsx
import { useState } from "react";
import Header from "@components/common/Header";
import ChatContainer from "@components/chat/ChatContainer";
import ContactList from "@components/chat/ContactList";
import "./Chat.css";

function Chat() {
  const [chatMode, setChatMode] = useState("user"); // 'user' or 'ai'
  const [activeContact, setActiveContact] = useState(null);

  return (
    <div className="chat-page">
      <Header />

      <main className="chat-main">
        <div className="chat-layout">
          <aside className="chat-sidebar">
            <div className="chat-mode-toggle">
              <button
                className={chatMode === "user" ? "active" : ""}
                onClick={() => setChatMode("user")}
              >
                💬 Usuários
              </button>
              <button
                className={chatMode === "ai" ? "active" : ""}
                onClick={() => setChatMode("ai")}
              >
                🤖 Assistente IA
              </button>
            </div>

            {chatMode === "user" && (
              <ContactList
                activeContact={activeContact}
                onSelectContact={setActiveContact}
              />
            )}
          </aside>

          <ChatContainer mode={chatMode} contact={activeContact} />
        </div>
      </main>
    </div>
  );
}

export default Chat;
```

---

## 📊 Comparação: Antes vs Depois

### Antes (Vanilla JS)

```javascript
// main.js - 886 linhas, tudo em um arquivo
document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-card");

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // ... 50 linhas de lógica
    });
  });

  // ... centenas de linhas mais
});
```

**Problemas:**

- ❌ Difícil de manter
- ❌ Código não reutilizável
- ❌ Manipulação direta do DOM
- ❌ Estado espalhado por todo código
- ❌ Difícil de testar

### Depois (React)

```jsx
// MoodSelector.jsx - 50 linhas, focado e testável
function MoodSelector() {
  const { saveMood, getMoodMessage } = useMood();
  const [selectedMood, setSelectedMood] = useState("");

  return (
    <section className="feelings">
      {MOODS.map((mood) => (
        <MoodCard
          key={mood.label}
          {...mood}
          isSelected={selectedMood === mood.label}
          onClick={() => handleMoodSelect(mood.label)}
        />
      ))}
    </section>
  );
}
```

**Benefícios:**

- ✅ Modular e organizado
- ✅ Componentes reutilizáveis
- ✅ Estado gerenciado centralmente
- ✅ Fácil de testar
- ✅ Declarativo e legível

---

## 🚀 Passo 9: Executar Migração

### Fase 1: Setup (Dia 1)

```bash
# 1. Criar branch para migração
git checkout -b feature/react-migration

# 2. Instalar dependências
npm install react react-dom react-router-dom
npm install -D @vitejs/plugin-react

# 3. Atualizar vite.config.js
# 4. Criar estrutura de pastas src/
```

### Fase 2: Core (Dias 2-3)

- Criar contexts (Theme, Mood, Auth)
- Criar hooks customizados
- Criar componentes comuns (Header, Button, Modal)
- Configurar rotas

### Fase 3: Páginas (Dias 4-6)

- Migrar página Home
- Migrar página Chat
- Migrar página Profile

### Fase 4: Teste & Deploy (Dia 7)

- Testar todas funcionalidades
- Ajustar CSS
- Build de produção
- Deploy

---

## 📝 Checklist de Migração

### Setup

- [ ] Instalar React e dependências
- [ ] Configurar Vite para React
- [ ] Criar estrutura de pastas
- [ ] Configurar jsconfig.json

### Contexts

- [ ] ThemeContext
- [ ] MoodContext
- [ ] AuthContext
- [ ] ChatContext

### Hooks

- [ ] useLocalStorage
- [ ] useMood
- [ ] useGeminiAI
- [ ] useChat

### Componentes Comuns

- [ ] Header
- [ ] Button
- [ ] Modal
- [ ] ThemeToggle
- [ ] Loading

### Componentes de Mood

- [ ] MoodSelector
- [ ] MoodCard
- [ ] MoodMessage

### Componentes de Chat

- [ ] ChatContainer
- [ ] MessageList
- [ ] MessageInput
- [ ] ContactList

### Páginas

- [ ] Home
- [ ] Chat
- [ ] Profile

### Services

- [ ] API Service
- [ ] Gemini Service
- [ ] Storage Service

### Testes

- [ ] Testar navegação
- [ ] Testar seleção de humor
- [ ] Testar chat com IA
- [ ] Testar chat com usuários
- [ ] Testar perfil
- [ ] Testar tema escuro/claro

---

## 💡 Dicas Importantes

1. **Migre incrementalmente** - Não tente migrar tudo de uma vez
2. **Mantenha o backend** - Não precisa mudar nada no servidor
3. **Use TypeScript** - Considere migrar para TS depois
4. **Teste constantemente** - Teste cada componente conforme migra
5. **CSS Modules** - Considere usar CSS Modules para evitar conflitos
6. **Performance** - Use React.memo() e useMemo() onde necessário

---

## 🎓 Recursos de Aprendizado

- [React Docs (Beta)](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite + React](https://vitejs.dev/guide/)
- [Custom Hooks](https://usehooks.com/)

---

## 🤝 Precisa de Ajuda?

Estou aqui para ajudar em qualquer etapa da migração! Posso:

- Criar qualquer componente específico
- Ajustar configurações
- Resolver problemas
- Otimizar código

**Quer que eu comece a migração agora?** 🚀
