// ===== CHAT EMOCONNECT - VERSÃO FUNCIONAL =====
// Versão simplificada para funcionar sem módulos complexos

console.log("🚀 Iniciando EmoConnect Chat...");

// ===== CONFIGURAÇÃO DA IA =====
const GEMINI_API_URL = '/api/chat/gemini';

// Contexto da conversa para manter histórico
let conversaContexto = [];

// ===== VARIÁVEIS GLOBAIS =====
let modoChat = "user"; // "user" ou "ai"

// ===== PROMPT BASE PARA IA =====
const PROMPT_BASE = `Você é Luna, uma assistente virtual especializada em saúde mental e bem-estar emocional.

PERFIL:
- Nome: Luna
- Personalidade: Empática, carinhosa, compreensiva e motivadora
- Especialidade: Apoio emocional, técnicas de relaxamento e bem-estar
- Tom: Sempre acolhedor e positivo, usando emojis apropriados

DIRETRIZES:
1. Sempre responda com empatia e compreensão
2. Ofereça apoio emocional genuíno
3. Sugira técnicas práticas de bem-estar quando apropriado
4. Use linguagem acessível e reconfortante
5. Valide os sentimentos do usuário
6. Mantenha respostas de 2-4 parágrafos
7. Use emojis para tornar a conversa mais calorosa

IMPORTANTE:
- Nunca substitua ajuda profissional
- Em casos graves, incentive buscar um psicólogo
- Mantenha sempre um tom esperançoso
- Lembre que você está aqui para apoiar`;

// ===== FUNÇÕES PRINCIPAIS =====

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM carregado, inicializando chat...");
  
  try {
    inicializarChat();
    console.log("✅ Chat inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    mostrarErroConexao();
  }
});

function inicializarChat() {
  const chatContainer = document.getElementById("chat-container");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const chatModeToggle = document.getElementById("chat-mode-toggle");
  
  if (!chatContainer || !messageInput || !sendButton) {
    console.error("❌ Elementos do chat não encontrados!");
    return;
  }

  // Configurar eventos
  sendButton.addEventListener("click", enviarMensagem);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  });

  if (chatModeToggle) {
    chatModeToggle.addEventListener("click", alternarModoChat);
  }

  // Mensagem de boas-vindas
  adicionarMensagem("Luna 🌙", "Olá! Eu sou a Luna, sua companheira de bem-estar emocional. Como você está se sentindo hoje? 💜", "bot");
  
  // Carregar histórico se existir
  carregarHistorico();
}

async function enviarMensagem() {
  const messageInput = document.getElementById("message-input");
  const mensagem = messageInput.value.trim();
  
  if (!mensagem) return;

  // Limpar input
  messageInput.value = "";
  
  // Adicionar mensagem do usuário
  adicionarMensagem("Você", mensagem, "user");
  
  // Salvar no histórico
  salvarMensagemHistorico("user", mensagem);

  if (modoChat === "ai") {
    // Mostrar indicador de digitação
    mostrarIndicadorDigitacao();
    
    try {
      const resposta = await enviarParaIA(mensagem);
      removerIndicadorDigitacao();
      adicionarMensagem("Luna 🌙", resposta, "bot");
      salvarMensagemHistorico("assistant", resposta);
    } catch (error) {
      console.error("❌ Erro ao comunicar com IA:", error);
      removerIndicadorDigitacao();
      const respostaFallback = gerarRespostaFallback(mensagem);
      adicionarMensagem("Luna 🌙", respostaFallback, "bot");
      salvarMensagemHistorico("assistant", respostaFallback);
    }
  }
}

async function enviarParaIA(mensagem) {
  // Adicionar mensagem ao contexto
  conversaContexto.push({
    role: "user",
    content: mensagem
  });

  const payload = {
    messages: [
      { role: "system", content: PROMPT_BASE },
      ...conversaContexto.slice(-10) // Manter apenas últimas 10 mensagens
    ]
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  const resposta = data.response || data.message || "Desculpe, não consegui processar sua mensagem.";
  
  // Adicionar resposta ao contexto
  conversaContexto.push({
    role: "assistant", 
    content: resposta
  });

  return resposta;
}

function gerarRespostaFallback(mensagem) {
  const respostasFallback = [
    "💜 Entendo como você está se sentindo. Ás vezes é difícil expressar nossas emoções. Que tal tentarmos uma respiração profunda juntos?",
    "🌟 Obrigada por compartilhar isso comigo. Seus sentimentos são válidos e importantes. Como posso te apoiar agora?",
    "🤗 Percebo que você está passando por algo. Lembre-se: você não está sozinho(a). Estou aqui para te ouvir.",
    "💙 É corajoso da sua parte falar sobre isso. Que tal pensarmos em algo que te faz sentir bem?",
    "🌸 Seus sentimentos importam muito. Vamos respirar juntos e encontrar um momento de calma?"
  ];
  
  return respostasFallback[Math.floor(Math.random() * respostasFallback.length)];
}

function adicionarMensagem(autor, conteudo, tipo) {
  const chatContainer = document.getElementById("chat-container");
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${tipo}`;
  
  const timestamp = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  messageDiv.innerHTML = `
    <div class="message-header">
      <strong>${autor}</strong>
      <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-content">${conteudo}</div>
  `;
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function mostrarIndicadorDigitacao() {
  const chatContainer = document.getElementById("chat-container");
  
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing-indicator";
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML = `
    <div class="message-header">
      <strong>Luna 🌙</strong>
    </div>
    <div class="message-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removerIndicadorDigitacao() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function alternarModoChat() {
  const toggle = document.getElementById("chat-mode-toggle");
  const statusElement = document.getElementById("chat-status");
  
  modoChat = modoChat === "user" ? "ai" : "user";
  
  if (toggle) {
    toggle.textContent = modoChat === "ai" ? "🤖 IA Ativa" : "💬 Modo Simples";
    toggle.className = `mode-toggle ${modoChat}`;
  }
  
  if (statusElement) {
    statusElement.textContent = modoChat === "ai" 
      ? "Chat com IA Luna ativa 🌙" 
      : "Modo de registro pessoal 📝";
  }

  const mensagemModo = modoChat === "ai" 
    ? "🤖 IA ativada! Agora posso conversar e te ajudar com suas emoções." 
    : "📝 Modo simples ativado. Use este espaço para registrar seus pensamentos.";
    
  adicionarMensagem("Sistema", mensagemModo, "system");
}

function salvarMensagemHistorico(role, content) {
  const historico = JSON.parse(localStorage.getItem("chatHistorico") || "[]");
  
  historico.push({
    role: role,
    content: content,
    timestamp: new Date().toISOString()
  });
  
  // Manter apenas últimas 100 mensagens
  if (historico.length > 100) {
    historico.splice(0, historico.length - 100);
  }
  
  localStorage.setItem("chatHistorico", JSON.stringify(historico));
}

function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem("chatHistorico") || "[]");
  
  // Carregar últimas 20 mensagens
  const mensagensRecentes = historico.slice(-20);
  
  mensagensRecentes.forEach(msg => {
    if (msg.role === "user") {
      adicionarMensagem("Você", msg.content, "user");
    } else if (msg.role === "assistant") {
      adicionarMensagem("Luna 🌙", msg.content, "bot");
    }
  });
}

function mostrarErroConexao() {
  const chatContainer = document.getElementById("chat-container");
  if (chatContainer) {
    chatContainer.innerHTML = `
      <div class="error-message">
        <p>❌ Erro ao inicializar o chat.</p>
        <p>Verifique sua conexão e recarregue a página.</p>
      </div>
    `;
  }
}

// ===== FUNÇÕES AUXILIARES =====

// Limpar histórico (pode ser chamada por botão)
function limparHistorico() {
  if (confirm("Tem certeza que deseja limpar todo o histórico do chat?")) {
    localStorage.removeItem("chatHistorico");
    conversaContexto = [];
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.innerHTML = "";
      adicionarMensagem("Luna 🌙", "Histórico limpo! Como posso te ajudar hoje? 💜", "bot");
    }
  }
}

// Exportar conversa (pode ser útil)
function exportarConversa() {
  const historico = JSON.parse(localStorage.getItem("chatHistorico") || "[]");
  const texto = historico.map(msg => 
    `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role}: ${msg.content}`
  ).join('\n\n');
  
  const blob = new Blob([texto], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emoconnect-chat-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

console.log("✅ EmoConnect Chat carregado com sucesso!");