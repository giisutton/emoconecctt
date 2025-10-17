# 📘 Exemplo Prático: Migração de Código

## Comparação lado a lado: Vanilla JS vs React

---

## 🎯 Exemplo 1: Seletor de Humor

### ❌ ANTES - Vanilla JavaScript (main.js)

```javascript
// main.js - Parte do código (linhas 16-85)
document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-card");
  const moodMessage = document.getElementById("mood-message");

  const moodFrases = {
    Feliz: "Continue espalhando essa luz! ☀️",
    Triste: "Tudo bem não estar bem. Estamos com você. 💙",
    Cansado: "Descanse um pouco. Você merece. 😴",
    Estressado: "Respire fundo. Vai passar. 😌",
    Ansioso: "Uma coisa de cada vez. Você consegue. 🌸",
    Calmo: "Que paz! Continue assim. 🌿",
    Empolgado: "Que energia incrível! ⚡",
    Confuso: "Às vezes é assim mesmo. Vai clarear. 🌤️"
  };

  let selectedMood = "";

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remover seleção anterior
      moodButtons.forEach((btn) => btn.classList.remove("selected"));

      // Selecionar o atual
      button.classList.add("selected");

      const mood = button.getAttribute("data-mood");
      selectedMood = mood;
      const frase = moodFrases[mood] || "Sentimento registrado.";

      if (moodMessage) {
        moodMessage.textContent = `Você está se sentindo: ${mood} — ${frase}`;
        moodMessage.style.opacity = 0;
        setTimeout(() => {
          moodMessage.style.opacity = 1;
        }, 100);
      }

      // Salvar no histórico de humor
      salvarHumorDiario(mood);

      // Atualizar gráficos
      atualizarGraficoSemanal();
      atualizarCalendarioMensal();
      atualizarGraficoCategorias();
      atualizarAnaliseEmocional();
    });
  });
});

function salvarHumorDiario(mood) {
  const hoje = new Date().toISOString().split("T")[0];
  const humores = JSON.parse(localStorage.getItem("humores") || "{}");
  humores[hoje] = mood;
  localStorage.setItem("humores", JSON.stringify(humores));
}
```

### ✅ DEPOIS - React

#### 1. Context (`src/contexts/MoodContext.jsx`)

```jsx
import { createContext, useCallback } from "react";
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
  const [moodHistory, setMoodHistory] = useLocalStorage("humores", {});

  const saveMood = useCallback(
    (mood) => {
      const today = new Date().toISOString().split("T")[0];
      setMoodHistory((prev) => ({ ...prev, [today]: mood }));
    },
    [setMoodHistory]
  );

  const getMoodMessage = (mood) =>
    MOOD_MESSAGES[mood] || "Sentimento registrado.";

  const getTodayMood = () => {
    const today = new Date().toISOString().split("T")[0];
    return moodHistory[today];
  };

  return (
    <MoodContext.Provider
      value={{ moodHistory, saveMood, getMoodMessage, getTodayMood }}
    >
      {children}
    </MoodContext.Provider>
  );
}
```

#### 2. Hook (`src/hooks/useMood.js`)

```javascript
import { useContext } from "react";
import { MoodContext } from "@contexts/MoodContext";

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMood must be used within MoodProvider");
  }
  return context;
}
```

#### 3. Componente Principal (`src/components/mood/MoodSelector.jsx`)

```jsx
import { useState } from "react";
import { useMood } from "@hooks/useMood";
import MoodCard from "./MoodCard";
import MoodMessage from "./MoodMessage";
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
  const { saveMood, getMoodMessage, getTodayMood } = useMood();
  const [selectedMood, setSelectedMood] = useState(getTodayMood() || "");

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

#### 4. Componente Card (`src/components/mood/MoodCard.jsx`)

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

#### 5. Componente Mensagem (`src/components/mood/MoodMessage.jsx`)

```jsx
import { useEffect, useState } from "react";
import "./MoodMessage.css";

function MoodMessage({ mood, message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [mood]);

  return (
    <p id="mood-message" className={`mood-message ${visible ? "visible" : ""}`}>
      Você está se sentindo: <strong>{mood}</strong> — {message}
    </p>
  );
}

export default MoodMessage;
```

---

## 🎯 Exemplo 2: Chat com IA

### ❌ ANTES - Vanilla JavaScript (chat.js)

```javascript
// chat.js - Linhas 60-100
async function enviarMensagem() {
  const texto = mensagemInput.value.trim();
  if (texto === "") return;

  adicionarMensagem(texto, "sent");
  mensagemInput.value = "";

  if (chatMode === "ai") {
    try {
      const typingDiv = adicionarMensagem("Digitando...", "received", true);
      const resposta = await obterRespostaIA(texto);

      if (typingDiv && typingDiv.parentNode) {
        chatDiv.removeChild(typingDiv);
      }
      adicionarMensagem(resposta, "received");
      salvarMensagemIA(texto, resposta);
    } catch (error) {
      console.error("Erro ao obter resposta da IA:", error);
      adicionarMensagem(
        "Desculpe, ocorreu um erro. Tente novamente.",
        "received"
      );
    }
  }
}

async function obterRespostaIA(mensagem) {
  const response = await fetch("/api/v1/chat/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: mensagem })
  });

  const data = await response.json();
  return data.text || "Não consegui processar sua mensagem.";
}
```

### ✅ DEPOIS - React

#### 1. Hook Customizado (`src/hooks/useChat.js`)

```javascript
import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { sendMessageToGemini } from "@services/geminiService";

export function useChat(mode = "user", contactId = null) {
  const [messages, setMessages] = useLocalStorage(
    `chat_${mode}_${contactId || "ai"}`,
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (text) => {
      const userMessage = {
        id: Date.now(),
        text,
        type: "sent",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMessage]);

      if (mode === "ai") {
        setLoading(true);
        setError(null);

        try {
          const response = await sendMessageToGemini(text);

          const aiMessage = {
            id: Date.now() + 1,
            text: response,
            type: "received",
            timestamp: new Date().toISOString()
          };

          setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
          setError(err.message);

          const errorMessage = {
            id: Date.now() + 1,
            text: "Desculpe, ocorreu um erro. Tente novamente.",
            type: "received",
            timestamp: new Date().toISOString()
          };

          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setLoading(false);
        }
      } else {
        // Simular resposta de usuário
        setTimeout(() => {
          const mockResponse = {
            id: Date.now() + 1,
            text: "Obrigado por compartilhar isso comigo.",
            type: "received",
            timestamp: new Date().toISOString()
          };
          setMessages((prev) => [...prev, mockResponse]);
        }, 1500);
      }
    },
    [mode, setMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    messages,
    sendMessage,
    clearMessages,
    loading,
    error
  };
}
```

#### 2. Componente de Chat (`src/components/chat/ChatContainer.jsx`)

```jsx
import { useState, useRef, useEffect } from "react";
import { useChat } from "@hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import "./ChatContainer.css";

function ChatContainer({ mode, contact }) {
  const { messages, sendMessage, loading } = useChat(mode, contact?.id);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          {mode === "ai"
            ? "🤖 Assistente EmoConnect"
            : contact?.nome || "Selecione um contato"}
        </h2>
      </div>

      <MessageList messages={messages} loading={loading} />
      <div ref={messagesEndRef} />

      <MessageInput
        onSend={handleSend}
        disabled={mode === "user" && !contact}
      />
    </div>
  );
}

export default ChatContainer;
```

#### 3. Lista de Mensagens (`src/components/chat/MessageList.jsx`)

```jsx
import MessageBubble from "./MessageBubble";
import LoadingDots from "../common/LoadingDots";
import "./MessageList.css";

function MessageList({ messages, loading }) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble key={message.id} {...message} />
      ))}

      {loading && (
        <div className="message received">
          <LoadingDots />
        </div>
      )}
    </div>
  );
}

export default MessageList;
```

#### 4. Input de Mensagem (`src/components/chat/MessageInput.jsx`)

```jsx
import { useState } from "react";
import "./MessageInput.css";

function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          disabled ? "Selecione um contato" : "Digite sua mensagem..."
        }
        disabled={disabled}
      />
      <button type="submit" disabled={!text.trim() || disabled}>
        Enviar
      </button>
    </form>
  );
}

export default MessageInput;
```

---

## 🎯 Exemplo 3: Exercício de Respiração

### ❌ ANTES - Vanilla JavaScript

```javascript
// main.js - Linhas 122-167
function iniciarExercicioRespiracao() {
  let ciclo = 0;
  const maxCiclos = 3;

  function fazerCiclo() {
    if (ciclo >= maxCiclos) {
      if (fase) fase.textContent = "Exercício concluído! 😌";
      return;
    }

    ciclo++;

    // Inspirar (4s)
    if (fase) fase.textContent = "Inspire profundamente... 🌬️";
    if (circulo) circulo.style.animation = "respirar-inspire 4s ease-in-out";

    setTimeout(() => {
      // Segurar (4s)
      if (fase) fase.textContent = "Segure... 🫁";
      if (circulo) circulo.style.animation = "respirar-hold 4s ease-in-out";
    }, 4000);

    setTimeout(() => {
      // Expirar (6s)
      if (fase) fase.textContent = "Expire lentamente... 🌊";
      if (circulo) circulo.style.animation = "respirar-expire 6s ease-in-out";
    }, 8000);

    setTimeout(() => {
      if (ciclo < maxCiclos) {
        fazerCiclo();
      } else {
        if (fase) fase.textContent = "Exercício concluído! 😌";
      }
    }, 14000);
  }

  fazerCiclo();
}
```

### ✅ DEPOIS - React

#### Componente (`src/components/breathing/BreathingExercise.jsx`)

```jsx
import { useState, useEffect } from "react";
import BreathingCircle from "./BreathingCircle";
import "./BreathingExercise.css";

const PHASES = {
  INHALE: {
    text: "Inspire profundamente... 🌬️",
    duration: 4000,
    animation: "inhale"
  },
  HOLD: { text: "Segure... 🫁", duration: 4000, animation: "hold" },
  EXHALE: {
    text: "Expire lentamente... 🌊",
    duration: 6000,
    animation: "exhale"
  }
};

const MAX_CYCLES = 3;

function BreathingExercise({ onClose }) {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("INHALE");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentCycle >= MAX_CYCLES) {
      setIsComplete(true);
      return;
    }

    const phases = ["INHALE", "HOLD", "EXHALE"];
    let phaseIndex = phases.indexOf(currentPhase);

    const timer = setTimeout(() => {
      phaseIndex++;

      if (phaseIndex >= phases.length) {
        // Próximo ciclo
        setCurrentCycle((prev) => prev + 1);
        setCurrentPhase("INHALE");
      } else {
        setCurrentPhase(phases[phaseIndex]);
      }
    }, PHASES[currentPhase].duration);

    return () => clearTimeout(timer);
  }, [currentCycle, currentPhase]);

  return (
    <div className="breathing-overlay" onClick={onClose}>
      <div className="breathing-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Exercício de Respiração</h2>

        <BreathingCircle animation={PHASES[currentPhase]?.animation} />

        <p className="phase-text">
          {isComplete
            ? "Exercício concluído! Como se sente? 😌"
            : PHASES[currentPhase]?.text}
        </p>

        <p className="cycle-counter">
          Ciclo {Math.min(currentCycle + 1, MAX_CYCLES)} de {MAX_CYCLES}
        </p>
      </div>
    </div>
  );
}

export default BreathingExercise;
```

#### Componente Círculo (`src/components/breathing/BreathingCircle.jsx`)

```jsx
import "./BreathingCircle.css";

function BreathingCircle({ animation }) {
  return (
    <div className={`breathing-circle ${animation}`}>
      <div className="inner-circle" />
    </div>
  );
}

export default BreathingCircle;
```

#### CSS (`src/components/breathing/BreathingCircle.css`)

```css
.breathing-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  transition: transform 0.3s ease;
}

.inner-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.breathing-circle.inhale {
  animation: breathe-in 4s ease-in-out;
}

.breathing-circle.hold {
  transform: scale(1.5);
}

.breathing-circle.exhale {
  animation: breathe-out 6s ease-in-out;
}

@keyframes breathe-in {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.5);
  }
}

@keyframes breathe-out {
  from {
    transform: scale(1.5);
  }
  to {
    transform: scale(1);
  }
}
```

---

## 📊 Resumo das Vantagens

| Aspecto              | Vanilla JS              | React                            |
| -------------------- | ----------------------- | -------------------------------- |
| **Linhas de código** | 886 linhas em 1 arquivo | ~50-100 linhas por componente    |
| **Reutilização**     | ❌ Difícil              | ✅ Fácil                         |
| **Manutenção**       | ❌ Complexa             | ✅ Simples                       |
| **Testabilidade**    | ❌ Difícil              | ✅ Fácil                         |
| **Organização**      | ❌ Tudo junto           | ✅ Separado por responsabilidade |
| **Estado**           | ❌ Espalhado            | ✅ Centralizado (Context)        |
| **Performance**      | ✅ Leve                 | ⚠️ +140KB bundle                 |

---

## 🚀 Próximo Passo

**Quer que eu:**

1. ✅ Crie a estrutura completa de pastas React?
2. ✅ Migre um componente específico?
3. ✅ Configure o projeto para React?
4. ✅ Crie todos os componentes?

**Me avise e começamos a migração! 🎯**
