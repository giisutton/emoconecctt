// chat.js - Funcionalidades do chat EmoConnect

// Importações do Firebase - corrigindo para garantir compatibilidade
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhlJmnNLFlTR9rG-xjQHjs9N3BQJGn8To",
  authDomain: "emoconnect-67e58.firebaseapp.com",
  databaseURL: "https://emoconnect-67e58-default-rtdb.firebaseio.com",
  projectId: "emoconnect-67e58",
  storageBucket: "emoconnect-67e58.appspot.com",
  messagingSenderId: "584511384312",
  appId: "1:584511384312:web:56fba5d6a5e6b0b690e90d"
};

// Configuração da IA
const GEMINI_API_KEY = "AIzaSyCnuGlHwY4wf-C1UhgGiNrUgbjiSsnlyBg"; 

// Inicialização da aplicação após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  inicializarChat();
  configurarTemaEscuro();
});

// Função principal de inicialização
function inicializarChat() {
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const chatRef = ref(db, "mensagens");

  // Elementos do DOM
  const chatDiv = document.getElementById("chat");
  const enviarBtn = document.getElementById("enviarBtn");
  const mensagemInput = document.getElementById("mensagemInput");
  const userChatBtn = document.getElementById("user-chat-btn");
  const aiChatBtn = document.getElementById("ai-chat-btn");
  
  // Elementos da lista de contatos
  const contactsList = document.getElementById("contacts-list");
  const contactsContainer = contactsList.querySelector(".contacts-container");
  const searchContact = document.getElementById("search-contact");
  const activeContactAvatar = document.getElementById("active-contact-avatar");
  const activeContactName = document.getElementById("active-contact-name");
    // Variáveis de estado
  let chatMode = "user"; // Modo padrão: chat com usuários
  
  // Configurar os botões do modo de chat
  userChatBtn.addEventListener("click", () => {
    chatMode = "user";
    userChatBtn.classList.add("active");
    aiChatBtn.classList.remove("active");
    chatDiv.innerHTML = ""; // Limpa o chat
    // Carrega as mensagens do Firebase apenas no modo usuário
    carregarMensagens();
    atualizarVisibilidadeLista();
    activeContactAvatar.style.display = ""; // Mostra o avatar novamente
    activeContactAvatar.src = "https://via.placeholder.com/30";
    activeContactName.textContent = "Chat EmoConnect";
  });
    aiChatBtn.addEventListener("click", () => {
    chatMode = "ai";
    aiChatBtn.classList.add("active");
    userChatBtn.classList.remove("active");
    chatDiv.innerHTML = ""; // Limpa o chat
    atualizarVisibilidadeLista();
    
    // Atualizar cabeçalho do chat para o modo IA - sem avatar
    activeContactAvatar.style.display = "none"; // Esconde o avatar da IA
    activeContactName.textContent = "Assistente EmoConnect";
    
    // Adiciona mensagem de boas-vindas da IA
    const welcomeDiv = document.createElement("div");
    welcomeDiv.classList.add("message", "received");
    welcomeDiv.innerHTML = `Olá! Sou a assistente virtual do EmoConnect. Como posso ajudar você hoje com suas emoções?<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
    chatDiv.appendChild(welcomeDiv);
  });
    // Função para enviar mensagem (funciona com Firebase e IA)
  async function enviarMensagem() {
    const texto = mensagemInput.value.trim();
    if (texto === "") return;
    
    console.log(`Enviando mensagem no modo ${chatMode}: "${texto}"`);
    
    // No modo IA, adicionamos a mensagem diretamente à interface
    // No modo usuário, deixamos o Firebase adicionar através do onChildAdded
    if (chatMode === "ai") {
      const userDiv = document.createElement("div");
      userDiv.classList.add("message", "sent");
      userDiv.innerHTML = `${texto}<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
      chatDiv.appendChild(userDiv);
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
    
    mensagemInput.value = "";
    
    if (chatMode === "user") {
      // Modo usuário - salva no Firebase
      try {
        console.log("Salvando mensagem no Firebase");
        await push(chatRef, {
          autor: "usuario",
          texto: texto,
          timestamp: Date.now()
        });
        console.log("Mensagem salva com sucesso");
      } catch (firebaseError) {
        console.error("Erro ao salvar no Firebase:", firebaseError);
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("message", "received", "error");
        errorDiv.innerHTML = `Erro ao enviar mensagem. Verifique sua conexão.<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
        chatDiv.appendChild(errorDiv);
      }
    } else {
      // Modo IA - envia para o modelo de IA
      try {
        console.log("Iniciando solicitação para a IA...");
        // Mostrar indicador de digitação
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "received", "typing");
        typingDiv.textContent = "Digitando...";
        chatDiv.appendChild(typingDiv);
        chatDiv.scrollTop = chatDiv.scrollHeight;
        
        // Chamar a API da IA com tratamento de timeout
        console.log("Chamando obterRespostaGemini com texto:", texto);
        let response;
        try {
          // Limitar tempo de resposta a 15 segundos
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout excedido")), 15000)
          );
          response = await Promise.race([
            obterRespostaGemini(texto),
            timeoutPromise
          ]);
          console.log("Resposta recebida:", response);
        } catch (innerError) {
          console.error("Erro na obtenção da resposta:", innerError);
          throw innerError;
        }
        
        // Remover indicador de digitação se ainda estiver presente
        try {
          if (typingDiv.parentNode) {
            chatDiv.removeChild(typingDiv);
          }
        } catch (removeError) {
          console.warn("Erro ao remover indicador de digitação:", removeError);
        }
        
        // Adicionar resposta da IA
        if (response) {
          const aiDiv = document.createElement("div");
          aiDiv.classList.add("message", "received");
          aiDiv.innerHTML = `${response}<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
          chatDiv.appendChild(aiDiv);
          chatDiv.scrollTop = chatDiv.scrollHeight;
        } else {
          throw new Error("Resposta vazia da IA");
        }
      } catch (error) {
        console.error("Erro ao comunicar com IA:", error);
        
        // Limpar qualquer indicador de digitação pendente
        const typingElements = document.querySelectorAll(".typing");
        typingElements.forEach(el => {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
        
        // Mostrar mensagem de erro para o usuário
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("message", "received", "error");
        errorDiv.innerHTML = `Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
        chatDiv.appendChild(errorDiv);
        chatDiv.scrollTop = chatDiv.scrollHeight;
      }
    }
  }

  // Função para obter resposta da IA
  async function obterRespostaGemini(mensagem) {
    try {
      console.log("Usando API alternativa para resposta de IA");
      
      // Usando API pública para geração de texto baseado em humor
      // Esta é uma simulação de resposta da IA
      // Em um ambiente de produção, você usaria uma API real como OpenAI, Azure OpenAI, etc.
      
      // Simula um pequeno atraso para parecer com o processamento real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Conjunto de respostas pré-definidas para diferentes tipos de emoções/mensagens
      const respostasPositivas = [
        "Estou feliz em saber que você está se sentindo bem! Lembre-se de aproveitar esses momentos positivos e talvez registrá-los em um diário para dias mais difíceis.",
        "Que bom! Compartilhar sentimentos positivos é uma ótima maneira de processá-los e integrá-los na sua experiência.",
        "Fico feliz em ouvir isso! Celebrar as pequenas vitórias é importante para nosso bem-estar emocional."
      ];
      
      const respostasNegativas = [
        "Entendo que você esteja passando por um momento difícil. Está tudo bem não estar bem às vezes. Tente ser gentil consigo mesmo neste momento.",
        "Sinto muito que você esteja passando por isso. Às vezes, apenas expressar o que sentimos já é um primeiro passo para lidar com emoções difíceis.",
        "Esses sentimentos são válidos e importantes. Você consideraria conversar com um amigo próximo ou um profissional sobre o que está sentindo?"
      ];
      
      const respostasNeutras = [
        "Obrigado por compartilhar seus pensamentos comigo. Como posso ajudar você a explorar melhor suas emoções hoje?",
        "Estou aqui para apoiar você em sua jornada emocional. Há algo específico que você gostaria de discutir mais profundamente?",
        "O autoconhecimento emocional é um processo contínuo. Estou aqui para ajudar você a refletir sobre seus sentimentos."
      ];
      
      // Analisa a mensagem para determinar o tipo de resposta
      const mensagemLower = mensagem.toLowerCase();
      let resposta;
      
      // Palavras-chave para detectar sentimentos
      const palavrasPositivas = ["feliz", "alegre", "bom", "ótimo", "contente", "alegria", "maravilhoso", "gosto", "amo"];
      const palavrasNegativas = ["triste", "mal", "ruim", "deprimido", "ansioso", "nervoso", "angústia", "difícil", "problema", "dor", "sozinho", "medo"];
      
      // Verifica se contém palavras positivas
      if (palavrasPositivas.some(palavra => mensagemLower.includes(palavra))) {
        resposta = respostasPositivas[Math.floor(Math.random() * respostasPositivas.length)];
      } 
      // Verifica se contém palavras negativas
      else if (palavrasNegativas.some(palavra => mensagemLower.includes(palavra))) {
        resposta = respostasNegativas[Math.floor(Math.random() * respostasNegativas.length)];
      } 
      // Resposta neutra para outros casos
      else {
        resposta = respostasNeutras[Math.floor(Math.random() * respostasNeutras.length)];
      }
      
      console.log("Resposta gerada:", resposta);
      return resposta;
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      throw new Error("Não foi possível gerar uma resposta. Por favor, tente novamente.");
    }
  }  // Carrega mensagens do Firebase (apenas para modo usuário)
  function carregarMensagens() {
    try {
      console.log("Iniciando carregamento de mensagens do Firebase");
      // Removemos listeners anteriores para evitar duplicações
      
      onChildAdded(chatRef, (snapshot) => {
        if (chatMode !== "user") return; // Não mostra mensagens do Firebase no modo IA
        
        const msg = snapshot.val();
        if (!msg || !msg.texto) {
          console.warn("Mensagem inválida recebida:", msg);
          return;
        }
        
        console.log("Mensagem recebida:", msg);
        const div = document.createElement("div");
        div.classList.add("message", msg.autor === "usuario" ? "sent" : "received");
        div.innerHTML = `${msg.texto}<div class="timestamp">${new Date(msg.timestamp || Date.now()).toLocaleTimeString()}</div>`;
        chatDiv.appendChild(div);
        chatDiv.scrollTop = chatDiv.scrollHeight;
      }, (error) => {
        console.error("Erro ao carregar mensagens:", error);
        // Exibir mensagem de erro para o usuário
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("message", "received", "error");
        errorDiv.innerHTML = `Erro ao carregar mensagens. Verifique sua conexão.<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
        chatDiv.appendChild(errorDiv);
      });
    } catch (error) {
      console.error("Erro ao configurar o carregamento de mensagens:", error);
    }
  }

  // ==== GERENCIAMENTO DE CONTATOS ====

  // Contatos de exemplo (em uma aplicação real, viria de um banco de dados)
  const contatos = [
    { 
      id: 1, 
      nome: "Ana Silva", 
      avatar: "https://i.pravatar.cc/150?img=1", 
      ultimaMensagem: "Olá, como você está?",
      status: "online" 
    },
    { 
      id: 2, 
      nome: "Carlos Mendes", 
      avatar: "https://i.pravatar.cc/150?img=11", 
      ultimaMensagem: "Consegui resolver aquele problema.",
      status: "offline" 
    },
    { 
      id: 3, 
      nome: "Juliana Costa", 
      avatar: "https://i.pravatar.cc/150?img=5", 
      ultimaMensagem: "Vamos conversar depois?",
      status: "online" 
    },
    { 
      id: 4, 
      nome: "Rafael Almeida", 
      avatar: "https://i.pravatar.cc/150?img=12", 
      ultimaMensagem: "Estou me sentindo melhor hoje.",
      status: "offline" 
    },
    { 
      id: 5, 
      nome: "Bianca Santos", 
      avatar: "https://i.pravatar.cc/150?img=9", 
      ultimaMensagem: "Obrigada pelo apoio!",
      status: "online" 
    }
  ];

  // Função para mostrar a lista de contatos
  function exibirContatos(listaContatos = contatos) {
    contactsContainer.innerHTML = "";
    
    listaContatos.forEach(contato => {
      const contactItem = document.createElement("div");
      contactItem.classList.add("contact-item");
      contactItem.dataset.id = contato.id;
      
      contactItem.innerHTML = `
        <img src="${contato.avatar}" alt="${contato.nome}">
        <div class="contact-info">
          <div class="contact-name">${contato.nome}</div>
          <div class="last-message">${contato.ultimaMensagem}</div>
        </div>
        <div class="status-indicator ${contato.status}"></div>
      `;
      
      contactItem.addEventListener("click", () => {
        // Remover classe ativa de todos os contatos
        document.querySelectorAll(".contact-item").forEach(item => {
          item.classList.remove("active");
        });
        
        // Adicionar classe ativa ao contato clicado
        contactItem.classList.add("active");
        
        // Atualizar o cabeçalho do chat
        activeContactAvatar.src = contato.avatar;
        activeContactName.textContent = contato.nome;
        
        // Carregar as mensagens deste contato (em uma aplicação real)
        chatDiv.innerHTML = ""; // Limpa o chat
        const welcomeMsg = document.createElement("div");
        welcomeMsg.classList.add("message", "received");
        welcomeMsg.innerHTML = `Iniciando conversa com ${contato.nome}.<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
        chatDiv.appendChild(welcomeMsg);
      });
      
      contactsContainer.appendChild(contactItem);
    });
  }

  // Função de pesquisa de contatos
  searchContact.addEventListener("input", () => {
    const searchTerm = searchContact.value.toLowerCase().trim();
    
    if (searchTerm === "") {
      exibirContatos();
      return;
    }
    
    const contatosFiltrados = contatos.filter(contato => 
      contato.nome.toLowerCase().includes(searchTerm)
    );
    
    exibirContatos(contatosFiltrados);
  });

  // Controlar a visibilidade da lista de contatos
  function atualizarVisibilidadeLista() {
    if (chatMode === "user") {
      contactsList.style.display = "flex";
    } else {
      contactsList.style.display = "none";
    }
  }

  // ==== EVENT LISTENERS ====

  // Adiciona evento para o botão de enviar
  enviarBtn.addEventListener("click", enviarMensagem);

  // Adiciona evento para pressionar Enter
  mensagemInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      enviarMensagem();
    }
  });

  // Emoji buttons
  document.querySelectorAll(".emoji-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      mensagemInput.value += btn.textContent;
      mensagemInput.focus();
    });
  });  // ==== INICIALIZAÇÃO ====
  chatMode = "user"; // Garantindo que o modo inicial seja "user"
  userChatBtn.classList.add("active");
  aiChatBtn.classList.remove("active");
  
  // Configurar o cabeçalho inicial do chat
  activeContactAvatar.style.display = ""; // Garante que o avatar esteja visível no modo usuário
  activeContactAvatar.src = "https://via.placeholder.com/30";
  activeContactName.textContent = "Chat EmoConnect";
  
  carregarMensagens();
  exibirContatos();
  atualizarVisibilidadeLista();
}

// Função para controle do tema escuro/claro
function configurarTemaEscuro() {
  const toggleThemeBtn = document.getElementById('toggle-theme');
  if (!toggleThemeBtn) return;
  
  // Verificar se o usuário já tem preferência salva
  const prefereTemaDark = localStorage.getItem('tema') === 'dark';
  if (prefereTemaDark) {
    document.body.classList.add('dark-mode');
    toggleThemeBtn.textContent = '☀️';
  }
  
  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Salvar preferência do usuário
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('tema', isDarkMode ? 'dark' : 'light');
    
    // Atualizar ícone do botão
    toggleThemeBtn.textContent = isDarkMode ? '☀️' : '🌙';
  });
}
