// EmoConnect Chat - Versão SEM Firebase (localStorage apenas)

document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Chat EmoConnect iniciando...");
  
  try {
    inicializarChat();
    configurarTemaEscuro();
  } catch (error) {
    console.error("❌ Erro na inicialização do chat:", error);
  }
});

function inicializarChat() {
  // Elementos do DOM
  const chatDiv = document.getElementById("chat");
  const enviarBtn = document.getElementById("enviarBtn");
  const mensagemInput = document.getElementById("mensagemInput");
  const userChatBtn = document.getElementById("user-chat-btn");
  const aiChatBtn = document.getElementById("ai-chat-btn");
  const contactsList = document.getElementById("contacts-list");
  const contactsContainer = document.querySelector(".contacts-container");
  const searchContact = document.getElementById("search-contact");
  const activeContactAvatar = document.getElementById("active-contact-avatar");
  const activeContactName = document.getElementById("active-contact-name");
  
  let chatMode = "user";
  let contatoAtual = null;
  
  // Contatos simulados
  const contatos = [
    { id: 1, nome: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1", ultimaMensagem: "Olá, como você está?", status: "online" },
    { id: 2, nome: "Carlos Mendes", avatar: "https://i.pravatar.cc/150?img=11", ultimaMensagem: "Consegui resolver aquele problema.", status: "offline" },
    { id: 3, nome: "Juliana Costa", avatar: "https://i.pravatar.cc/150?img=5", ultimaMensagem: "Vamos conversar depois?", status: "online" },
    { id: 4, nome: "Rafael Almeida", avatar: "https://i.pravatar.cc/150?img=12", ultimaMensagem: "Estou me sentindo melhor hoje.", status: "offline" },
    { id: 5, nome: "Bianca Santos", avatar: "https://i.pravatar.cc/150?img=9", ultimaMensagem: "Obrigada pelo apoio!", status: "online" }
  ];
  
  // Configurar botões de modo de chat
  userChatBtn.addEventListener("click", () => {
    chatMode = "user";
    userChatBtn.classList.add("active");
    aiChatBtn.classList.remove("active");
    chatDiv.innerHTML = "";
    atualizarVisibilidadeLista();
    
    if (activeContactAvatar) {
      activeContactAvatar.style.display = "";
      activeContactAvatar.src = "https://via.placeholder.com/36x36/6a5acd/white?text=EC";
    }
    if (activeContactName) activeContactName.textContent = "Chat EmoConnect";
    
    adicionarMensagem("Selecione um contato para começar a conversar! 💬", "received");
  });
  
  aiChatBtn.addEventListener("click", () => {
    chatMode = "ai";
    aiChatBtn.classList.add("active");
    userChatBtn.classList.remove("active");
    chatDiv.innerHTML = "";
    atualizarVisibilidadeLista();
    
    if (activeContactAvatar) activeContactAvatar.style.display = "none";
    if (activeContactName) activeContactName.textContent = "Assistente EmoConnect";
    
    adicionarMensagem("Olá! Sou a assistente virtual do EmoConnect. Como posso ajudar você hoje com suas emoções? 💜", "received");
  });
  
  // Função para enviar mensagem
  async function enviarMensagem() {
    const texto = mensagemInput.value.trim();
    if (texto === "") return;
    
    adicionarMensagem(texto, "sent");
    mensagemInput.value = "";
    
    if (chatMode === "user") {
      if (contatoAtual) {
        salvarMensagemContato(contatoAtual.id, { texto, tipo: "sent", timestamp: Date.now() });
        
        setTimeout(() => {
          const respostas = [
            "Entendo como você se sente. Estou aqui se precisar conversar.",
            "Obrigado por compartilhar isso comigo.",
            "Que bom que você está se abrindo. Continue assim!",
            "Estou pensando em você. Força!",
            "Isso deve ser difícil. Como posso ajudar?"
          ];
          const resposta = respostas[Math.floor(Math.random() * respostas.length)];
          adicionarMensagem(resposta, "received");
          salvarMensagemContato(contatoAtual.id, { texto: resposta, tipo: "received", timestamp: Date.now() });
        }, 2000);
      }
    } else {
      try {
        const typingDiv = adicionarMensagem("Digitando...", "received", true);
        const resposta = await obterRespostaIA(texto);
        
        if (typingDiv && typingDiv.parentNode) chatDiv.removeChild(typingDiv);
        adicionarMensagem(resposta, "received");
      } catch (error) {
        console.error("Erro IA:", error);
        document.querySelectorAll(".typing").forEach(el => el.parentNode && el.parentNode.removeChild(el));
        adicionarMensagem("Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente? 💙", "received");
      }
    }
  }
  
  function adicionarMensagem(texto, tipo, isTyping = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", tipo);
    
    if (isTyping) {
      messageDiv.classList.add("typing");
      messageDiv.textContent = texto;
    } else {
      messageDiv.innerHTML = `${texto}<div class="timestamp">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>`;
    }
    
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
    return messageDiv;
  }
  
  async function obterRespostaIA(mensagem) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const contextosEmocionais = {
      saudacao: {
        keywords: ["oi", "olá", "ola", "tchau", "bom dia", "boa tarde", "boa noite"],
        respostas: [
          "Olá! É um prazer conversar com você. Como você está se sentindo hoje? 😊",
          "Oi! Estou aqui para apoiá-lo em sua jornada emocional. O que você gostaria de compartilhar?",
          "Seja bem-vindo! Vamos conversar sobre suas emoções e sentimentos?"
        ]
      },
      positivas: {
        keywords: ["feliz", "alegre", "bom", "ótimo", "excelente", "contente", "alegria", "maravilhoso", "amo", "amor", "gratidão"],
        respostas: [
          "Que alegria saber que você está se sentindo bem! ✨ Momentos como esses são preciosos!",
          "Fico muito feliz em ouvir isso! 😊 O que está te deixando tão bem assim?",
          "Excelente! Celebrar momentos positivos é fundamental para o bem-estar emocional!"
        ]
      },
      negativas: {
        keywords: ["triste", "mal", "ruim", "terrível", "deprimido", "ansioso", "nervoso", "angústia", "difícil", "problema", "dor", "sozinho", "medo", "preocupado"],
        respostas: [
          "Sinto muito que você esteja passando por um momento difícil. 💙 É completamente normal ter dias assim.",
          "Entendo que você está enfrentando desafios agora. Seus sentimentos são válidos e importantes.",
          "É corajoso da sua parte compartilhar esses sentimentos. Você não está sozinho nessa jornada."
        ]
      },
      autocuidado: {
        keywords: ["cansado", "estressado", "sobrecarregado", "exausto", "trabalho", "estudos", "dormir", "descanso"],
        respostas: [
          "Parece que você precisa de um momento para si mesmo. 🌱 Que tal fazer uma pausa?",
          "O autocuidado é essencial! Já experimentou técnicas de mindfulness ou meditação?",
          "É importante reconhecer quando precisamos desacelerar. Seu bem-estar vem primeiro."
        ]
      },
      motivacao: {
        keywords: ["desistir", "difícil", "impossível", "não consigo", "fracasso", "sem esperança"],
        respostas: [
          "Lembre-se: cada dia é uma nova oportunidade para recomeçar. 🌅 Acredito em você!",
          "Os momentos difíceis são temporários, mas sua força é permanente. 💪",
          "Entendo que parece impossível agora, mas você é mais resiliente do que imagina."
        ]
      }
    };
    
    const mensagemLower = mensagem.toLowerCase();
    let resposta = null;
    
    for (const [contexto, dados] of Object.entries(contextosEmocionais)) {
      if (dados.keywords.some(keyword => mensagemLower.includes(keyword))) {
        resposta = dados.respostas[Math.floor(Math.random() * dados.respostas.length)];
        break;
      }
    }
    
    if (!resposta) {
      const respostasGerais = [
        "Obrigada por compartilhar isso comigo. Suas emoções são válidas e importantes. Como posso ajudá-lo?",
        "Estou aqui para apoiá-lo em sua jornada emocional. Há algo específico sobre o que gostaria de conversar?",
        "É importante expressar nossos sentimentos. Como você se sente ao compartilhar isso?",
        "Vejo que você está refletindo sobre algo importante. O autoconhecimento emocional é valioso!",
        "Suas palavras mostram uma pessoa que está buscando compreender suas emoções. Isso é muito positivo!"
      ];
      resposta = respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
    }
    
    return resposta;
  }
  
  function salvarMensagemContato(contatoId, mensagem) {
    const chave = `chat_contato_${contatoId}`;
    const mensagens = JSON.parse(localStorage.getItem(chave) || "[]");
    mensagens.push(mensagem);
    localStorage.setItem(chave, JSON.stringify(mensagens));
  }
  
  function carregarMensagensContato(contatoId) {
    const chave = `chat_contato_${contatoId}`;
    return JSON.parse(localStorage.getItem(chave) || "[]");
  }
  
  function exibirContatos(listaContatos = contatos) {
    if (!contactsContainer) return;
    
    contactsContainer.innerHTML = "";
    
    if (!listaContatos || listaContatos.length === 0) {
      contactsContainer.innerHTML = `<div class="no-contacts"><p style="text-align: center; color: #666; padding: 20px;"><i class="fas fa-users" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>Nenhum contato encontrado</p></div>`;
      return;
    }
    
    listaContatos.forEach((contato) => {
      const contactItem = document.createElement("div");
      contactItem.classList.add("contact-item");
      contactItem.dataset.id = contato.id;
      
      contactItem.innerHTML = `
        <img src="${contato.avatar}" alt="${contato.nome}" onerror="this.src='https://via.placeholder.com/40x40/6a5acd/white?text=${contato.nome.charAt(0)}'">
        <div class="contact-info">
          <div class="contact-name">${contato.nome}</div>
          <div class="last-message">${contato.ultimaMensagem}</div>
        </div>
        <div class="status-indicator ${contato.status}"></div>
      `;
      
      contactItem.addEventListener("click", () => {
        document.querySelectorAll(".contact-item").forEach(item => item.classList.remove("active"));
        contactItem.classList.add("active");
        contatoAtual = contato;
        
        if (activeContactAvatar) {
          activeContactAvatar.src = contato.avatar;
          activeContactAvatar.style.display = "";
          activeContactAvatar.onerror = function() {
            this.src = `https://via.placeholder.com/36x36/6a5acd/white?text=${contato.nome.charAt(0)}`;
          };
        }
        if (activeContactName) activeContactName.textContent = contato.nome;
        
        chatDiv.innerHTML = "";
        const mensagensSalvas = carregarMensagensContato(contato.id);
        
        if (mensagensSalvas.length === 0) {
          adicionarMensagem(`Iniciando conversa com ${contato.nome}. 💬`, "received");
        } else {
          mensagensSalvas.forEach(msg => adicionarMensagem(msg.texto, msg.tipo));
        }
      });
      
      contactsContainer.appendChild(contactItem);
    });
  }
  
  if (searchContact) {
    searchContact.addEventListener("input", () => {
      const searchTerm = searchContact.value.toLowerCase().trim();
      const contatosFiltrados = searchTerm === "" ? contatos : contatos.filter(c => c.nome.toLowerCase().includes(searchTerm));
      exibirContatos(contatosFiltrados);
    });
  }
  
  function atualizarVisibilidadeLista() {
    if (contactsList) contactsList.style.display = chatMode === "user" ? "flex" : "none";
  }
  
  // Event listeners
  if (enviarBtn) enviarBtn.addEventListener("click", enviarMensagem);
  if (mensagemInput) {
    mensagemInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") enviarMensagem();
    });
  }
  
  // Inicialização
  if (!chatDiv || !enviarBtn || !mensagemInput) {
    console.error("❌ Elementos essenciais não encontrados!");
    return;
  }
  
  chatMode = "user";
  userChatBtn.classList.add("active");
  
  if (activeContactAvatar) {
    activeContactAvatar.style.display = "";
    activeContactAvatar.src = "https://via.placeholder.com/36x36/6a5acd/white?text=EC";
  }
  if (activeContactName) activeContactName.textContent = "Chat EmoConnect";
  
  exibirContatos();
  atualizarVisibilidadeLista();
  adicionarMensagem("Bem-vindo ao EmoConnect! 🌟 Selecione um contato para conversar ou mude para o modo IA.", "received");
  
  console.log("✅ Chat inicializado com sucesso (SEM Firebase)!");
}

function configurarTemaEscuro() {
  const toggleThemeBtn = document.getElementById('toggle-theme');
  if (!toggleThemeBtn) return;
  
  const prefereTemaDark = localStorage.getItem('tema') === 'dark';
  if (prefereTemaDark) {
    document.body.classList.add('dark-mode');
    toggleThemeBtn.textContent = '☀️';
  }
  
  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('tema', isDarkMode ? 'dark' : 'light');
    toggleThemeBtn.textContent = isDarkMode ? '☀️' : '🌙';
  });
}
