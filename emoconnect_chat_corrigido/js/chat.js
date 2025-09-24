// Função de teste para forçar criação de contatos
function testarContatos() {
  console.log("🧪 TESTE: Forçando criação de contatos...");
  
  const container = document.querySelector('.contacts-container');
  if (!container) {
    console.error("❌ Container não encontrado no teste!");
    return;
  }
  
  console.log("✅ Container encontrado, limpando...");
  container.innerHTML = "";
  
  // Criar contatos diretamente sem loop
  console.log("📝 Criando contatos manualmente...");
  
  const contato1 = document.createElement("div");
  contato1.className = "contact-item";
  contato1.innerHTML = `
    <img src="https://i.pravatar.cc/40?img=1" alt="Ana">
    <div class="contact-info">
      <div class="contact-name">Ana Silva</div>
      <div class="last-message">Olá, como você está?</div>
    </div>
    <div class="status-indicator online"></div>
  `;
  container.appendChild(contato1);
  
  const contato2 = document.createElement("div");
  contato2.className = "contact-item";
  contato2.innerHTML = `
    <img src="https://i.pravatar.cc/40?img=11" alt="Carlos">
    <div class="contact-info">
      <div class="contact-name">Carlos Mendes</div>
      <div class="last-message">Consegui resolver aquele problema.</div>
    </div>
    <div class="status-indicator offline"></div>
  `;
  container.appendChild(contato2);
  
  const contato3 = document.createElement("div");
  contato3.className = "contact-item";
  contato3.innerHTML = `
    <img src="https://i.pravatar.cc/40?img=5" alt="Juliana">
    <div class="contact-info">
      <div class="contact-name">Juliana Costa</div>
      <div class="last-message">Vamos conversar depois?</div>
    </div>
    <div class="status-indicator online"></div>
  `;
  container.appendChild(contato3);
  
  console.log("✅ 3 contatos criados manualmente");
  console.log("👶 Filhos no container:", container.children.length);
  
  // Adicionar event listeners
  container.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', () => {
      // Remover active de todos
      container.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
      // Adicionar active ao clicado
      item.classList.add('active');
      console.log("👆 Contato clicado:", item.querySelector('.contact-name').textContent);
    });
  });
}

// Expor função globalmente para teste
window.testarContatos = testarContatos;
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
  console.log("=== DOM CARREGADO ===");
  console.log("Iniciando inicializarChat...");
  
  // Verificar se todos os elementos existem antes de inicializar
  const elementosNecessarios = {
    'chat': document.getElementById("chat"),
    'enviarBtn': document.getElementById("enviarBtn"),
    'mensagemInput': document.getElementById("mensagemInput"),
    'userChatBtn': document.getElementById("user-chat-btn"),
    'aiChatBtn': document.getElementById("ai-chat-btn"),
    'contactsList': document.getElementById("contacts-list"),
    'contactsContainer': document.querySelector(".contacts-container"),
    'activeContactAvatar': document.getElementById("active-contact-avatar"),
    'activeContactName': document.getElementById("active-contact-name")
  };
  
  console.log("=== VERIFICAÇÃO DE ELEMENTOS ===");
  let elementosFaltando = [];
  
  for (const [nome, elemento] of Object.entries(elementosNecessarios)) {
    if (!elemento) {
      console.error(`❌ ELEMENTO FALTANDO: ${nome}`);
      elementosFaltando.push(nome);
    } else {
      console.log(`✅ ELEMENTO OK: ${nome}`);
    }
  }
  
  if (elementosFaltando.length > 0) {
    console.error("❌ ERRO: Elementos faltando:", elementosFaltando);
    // Tentar inicializar mesmo assim, mas com tratamento especial
  }
  
  try {
    inicializarChat();
  } catch (error) {
    console.error("❌ ERRO na inicialização do chat:", error);
  }
  
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
  const testeContatosBtn = document.getElementById("teste-contatos");
  
  // Elementos da lista de contatos
  const contactsList = document.getElementById("contacts-list");
  const contactsContainer = contactsList.querySelector(".contacts-container");
  const searchContact = document.getElementById("search-contact");
  const activeContactAvatar = document.getElementById("active-contact-avatar");
  const activeContactName = document.getElementById("active-contact-name");
  
  // Event listener para o botão de teste
  if (testeContatosBtn) {
    testeContatosBtn.addEventListener('click', () => {
      console.log("🔴 BOTÃO DE TESTE CLICADO");
      testarContatos();
    });
  }
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

  // Função para obter resposta da IA com melhorias
  async function obterRespostaGemini(mensagem) {
    try {
      console.log("Gerando resposta da IA para:", mensagem);
      
      // Simula processamento da IA com delay realista
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      // Sistema de respostas inteligente baseado em contexto emocional
      const contextosEmocionais = {
        saudacao: {
          keywords: ["oi", "olá", "tchau", "bom dia", "boa tarde", "boa noite"],
          respostas: [
            "Olá! É um prazer conversar com você. Como você está se sentindo hoje?",
            "Oi! Estou aqui para apoiá-lo em sua jornada emocional. O que você gostaria de compartilhar?",
            "Seja bem-vindo! Vamos conversar sobre suas emoções e sentimentos?"
          ]
        },
        positivas: {
          keywords: ["feliz", "alegre", "bom", "ótimo", "excelente", "contente", "alegria", "maravilhoso", "gosto", "amo", "amor", "gratidão"],
          respostas: [
            "Que alegria saber que você está se sentindo bem! ✨ Momentos como esses são preciosos. Que tal registrar esse sentimento para lembrar nos dias mais difíceis?",
            "Fico muito feliz em ouvir isso! 😊 Compartilhar momentos positivos é uma forma maravilhosa de multiplicar a alegria. O que está te deixando tão bem assim?",
            "Excelente! Celebrar as pequenas vitórias e momentos positivos é fundamental para o bem-estar emocional. Continue cultivando essa energia!"
          ]
        },
        negativas: {
          keywords: ["triste", "mal", "ruim", "terrível", "deprimido", "ansioso", "nervoso", "angústia", "difícil", "problema", "dor", "sozinho", "medo", "preocupado"],
          respostas: [
            "Sinto muito que você esteja passando por um momento difícil. 💙 É completamente normal ter dias assim. Lembre-se: você é mais forte do que imagina.",
            "Entendo que você está enfrentando desafios agora. Seus sentimentos são válidos e importantes. Às vezes, expressar o que sentimos já é o primeiro passo para a cura.",
            "É corajoso da sua parte compartilhar esses sentimentos. Você não está sozinho nessa jornada. Que tal tentarmos algumas técnicas de respiração ou reflexão?"
          ]
        },
        autocuidado: {
          keywords: ["cansado", "estressado", "sobrecarregado", "exausto", "trabalho", "estudos", "dormir", "descanso"],
          respostas: [
            "Parece que você precisa de um momento para si mesmo. 🌱 Que tal fazer uma pausa? Algumas respirações profundas ou uma caminhada podem ajudar muito.",
            "O autocuidado é essencial! Você já experimentou técnicas de mindfulness ou meditação? Posso te sugerir alguns exercícios simples de relaxamento.",
            "É importante reconhecer quando precisamos desacelerar. Seu bem-estar vem primeiro. Que tal programar um tempo só para você hoje?"
          ]
        },
        motivacao: {
          keywords: ["desistir", "difícil", "impossível", "não consigo", "fracasso", "sem esperança"],
          respostas: [
            "Lembre-se: cada dia é uma nova oportunidade para recomeçar. 🌅 Você já superou desafios antes e pode superar esse também. Acredito em você!",
            "Os momentos difíceis são temporários, mas sua força é permanente. 💪 Que tal focarmos em pequenos passos que você pode dar hoje?",
            "Entendo que parece impossível agora, mas você é mais resiliente do que imagina. Vamos pensar juntos em estratégias para tornar isso mais manejável?"
          ]
        },
        relacionamentos: {
          keywords: ["família", "amigos", "relacionamento", "namorado", "namorada", "briga", "discussão", "conversa"],
          respostas: [
            "Os relacionamentos são uma parte importante da nossa vida emocional. Como você se sente sobre essa situação? Às vezes, uma conversa aberta pode resolver muito.",
            "É natural haver altos e baixos nos relacionamentos. O importante é a comunicação respeitosa. Você já pensou em expressar seus sentimentos de forma calma?",
            "Relacionamentos exigem paciência e compreensão mútua. Como posso te ajudar a processar esses sentimentos sobre essa pessoa importante?"
          ]
        }
      };
      
      // Análise da mensagem
      const mensagemLower = mensagem.toLowerCase();
      let contextoEncontrado = null;
      let resposta = null;
      
      // Procura por contextos específicos
      for (const [contexto, dados] of Object.entries(contextosEmocionais)) {
        if (dados.keywords.some(keyword => mensagemLower.includes(keyword))) {
          contextoEncontrado = contexto;
          resposta = dados.respostas[Math.floor(Math.random() * dados.respostas.length)];
          break;
        }
      }
      
      // Se não encontrou contexto específico, usa respostas gerais empáticas
      if (!resposta) {
        const respostasGerais = [
          "Obrigado por compartilhar isso comigo. Suas emoções são válidas e importantes. Como posso ajudá-lo a processar melhor esses sentimentos?",
          "Estou aqui para apoiá-lo em sua jornada emocional. Há algo específico sobre o que você gostaria de conversar mais profundamente?",
          "É importante expressar nossos sentimentos. Como você se sente ao compartilhar isso? Existe algo mais que gostaria de explorar sobre essa situação?",
          "Vejo que você está refletindo sobre algo importante. O autoconhecimento emocional é um processo valioso. Que insights você tem sobre isso?",
          "Suas palavras mostram uma pessoa que está buscando compreender suas emoções. Isso é muito positivo! Como posso te ajudar nessa reflexão?"
        ];
        resposta = respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
      }
      
      console.log(`Contexto identificado: ${contextoEncontrado || 'geral'}`);
      console.log("Resposta gerada:", resposta);
      
      return resposta;
      
    } catch (error) {
      console.error("Erro ao gerar resposta da IA:", error);
      // Resposta de fallback mais amigável
      return "Desculpe, tive uma pequena dificuldade para processar sua mensagem. Pode tentar reformular ou me contar de outra forma? Estou aqui para ajudar! 💙";
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
    console.log("=== EXIBINDO CONTATOS ===");
    console.log("Lista de contatos recebida:", listaContatos);
    console.log("Quantidade de contatos:", listaContatos ? listaContatos.length : 0);
    
    // Tentar encontrar o container se ainda não foi encontrado
    if (!contactsContainer) {
      console.log("🔍 Tentando encontrar container de contatos...");
      contactsContainer = document.querySelector(".contacts-container");
      if (!contactsContainer) {
        contactsContainer = document.querySelector(".contacts-list .contacts-container");
      }
      if (!contactsContainer) {
        contactsContainer = document.getElementById("contacts-container");
      }
    }
    
    if (!contactsContainer) {
      console.error("❌ Container de contatos não encontrado! Tentando criar um temporário...");
      
      // Criar um container temporário se não existir
      const contactsList = document.getElementById("contacts-list");
      if (contactsList) {
        const tempContainer = document.createElement("div");
        tempContainer.className = "contacts-container";
        tempContainer.style.flex = "1";
        tempContainer.style.overflowY = "auto";
        tempContainer.style.padding = "10px";
        contactsList.appendChild(tempContainer);
        contactsContainer = tempContainer;
        console.log("✅ Container temporário criado");
      } else {
        console.error("❌ Nem mesmo o elemento contacts-list foi encontrado!");
        return;
      }
    }
    
    console.log("✅ Container encontrado:", contactsContainer);
    
    // Limpar conteúdo existente
    contactsContainer.innerHTML = "";
    
    if (!listaContatos || listaContatos.length === 0) {
      console.log("⚠️ Nenhum contato para exibir");
      const noContactsMsg = document.createElement("div");
      noContactsMsg.className = "no-contacts";
      noContactsMsg.innerHTML = `
        <p style="text-align: center; color: #666; padding: 20px;">
          <i class="fas fa-users" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
          Nenhum contato encontrado
        </p>
      `;
      contactsContainer.appendChild(noContactsMsg);
      return;
    }
    
    console.log(`📝 Criando elementos para ${listaContatos.length} contatos...`);
    
    listaContatos.forEach((contato, index) => {
      console.log(`Criando contato ${index + 1}:`, contato.nome);
      
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
        console.log("👆 Contato clicado:", contato);
        
        // Remover classe ativa de todos os contatos
        document.querySelectorAll(".contact-item").forEach(item => {
          item.classList.remove("active");
        });
        
        // Adicionar classe ativa ao contato clicado
        contactItem.classList.add("active");
        
        // Atualizar o cabeçalho do chat
        if (activeContactAvatar) {
          activeContactAvatar.src = contato.avatar;
          activeContactAvatar.onerror = function() {
            this.src = `https://via.placeholder.com/36x36/6a5acd/white?text=${contato.nome.charAt(0)}`;
          };
        }
        if (activeContactName) {
          activeContactName.textContent = contato.nome;
        }
        
        // Carregar as mensagens deste contato (simulação)
        chatDiv.innerHTML = "";
        const welcomeMsg = document.createElement("div");
        welcomeMsg.classList.add("message", "received");
        welcomeMsg.innerHTML = `Iniciando conversa com ${contato.nome}. 💬<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
        chatDiv.appendChild(welcomeMsg);
        
        // Simular algumas mensagens antigas (opcional)
        setTimeout(() => {
          const oldMsg = document.createElement("div");
          oldMsg.classList.add("message", "received");
          oldMsg.innerHTML = `${contato.ultimaMensagem}<div class="timestamp">${new Date(Date.now() - 3600000).toLocaleTimeString()}</div>`;
          chatDiv.appendChild(oldMsg);
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }, 500);
      });
      
      contactsContainer.appendChild(contactItem);
      console.log(`✅ Contato ${contato.nome} adicionado ao DOM`);
    });
    
    console.log(`✅ ${listaContatos.length} contatos exibidos com sucesso no container:`, contactsContainer);
    
    // Debug: verificar se os elementos foram realmente adicionados
    const elementosNoContainer = contactsContainer.children.length;
    console.log(`🔍 DEBUG: Container agora tem ${elementosNoContainer} elementos filhos`);
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
  
  console.log("=== INICIANDO CONFIGURAÇÃO DO CHAT ===");
  
  // Verificações de elementos essenciais com tratamento mais flexível
  if (!chatDiv) {
    console.error("❌ Elemento chat não encontrado!");
    return;
  }
  if (!enviarBtn) {
    console.error("❌ Botão enviar não encontrado!");
    return;
  }
  if (!mensagemInput) {
    console.error("❌ Input de mensagem não encontrado!");
    return;
  }
  if (!userChatBtn || !aiChatBtn) {
    console.error("❌ Botões de modo de chat não encontrados!");
    return;
  }
  
  // Para contactsList e contactsContainer, vamos tentar encontrar de forma mais flexível
  let contactsListElement = contactsList || document.getElementById("contacts-list");
  let contactsContainerElement = contactsContainer || document.querySelector(".contacts-container");
  
  if (!contactsListElement) {
    console.error("❌ Lista de contatos não encontrada! Tentando criar...");
    // Não vamos retornar aqui, vamos tentar continuar
  }
  
  if (!contactsContainerElement) {
    console.error("❌ Container de contatos não encontrado! Tentando encontrar novamente...");
    contactsContainerElement = document.querySelector(".contacts-list .contacts-container");
    if (!contactsContainerElement) {
      console.error("❌ Container de contatos ainda não encontrado!");
    }
  }
  
  // Atualizar as variáveis globais
  if (contactsContainerElement) {
    contactsContainer = contactsContainerElement;
    console.log("✅ Container de contatos encontrado e atualizado");
  }
  
  // Garantindo que o modo inicial seja "user"
  console.log("⚙️ Configurando modo inicial...");
  chatMode = "user";
  userChatBtn.classList.add("active");
  aiChatBtn.classList.remove("active");
  
  // Configurar o cabeçalho inicial do chat
  if (activeContactAvatar) {
    console.log("⚙️ Configurando avatar inicial...");
    activeContactAvatar.style.display = ""; 
    activeContactAvatar.src = "https://via.placeholder.com/36x36/6a5acd/white?text=EC";
    activeContactAvatar.onerror = function() {
      this.src = "https://via.placeholder.com/36x36/6a5acd/white?text=EC";
    };
  }
  if (activeContactName) {
    activeContactName.textContent = "Chat EmoConnect";
  }
  
  console.log("⚙️ Carregando mensagens do Firebase...");
  try {
    carregarMensagens();
  } catch (error) {
    console.error("❌ Erro ao carregar mensagens:", error);
  }
  
  console.log("⚙️ Tentando exibir lista de contatos...");
  try {
    // Forçar a exibição de contatos mesmo que haja problemas
    exibirContatos();
  } catch (error) {
    console.error("❌ Erro ao exibir contatos:", error);
    // Vamos tentar uma abordagem alternativa
    setTimeout(() => {
      console.log("🔄 Tentativa alternativa de exibir contatos...");
      try {
        testarContatos(); // Usar a função de teste como fallback
      } catch (retryError) {
        console.error("❌ Erro na segunda tentativa:", retryError);
      }
    }, 1000);
  }
  
  console.log("⚙️ Atualizando visibilidade da lista...");
  try {
    atualizarVisibilidadeLista();
  } catch (error) {
    console.error("❌ Erro ao atualizar visibilidade:", error);
  }
  
  console.log("✅ Chat inicializado!");
  
  // Mensagem de boas-vindas no chat
  try {
    const welcomeDiv = document.createElement("div");
    welcomeDiv.classList.add("message", "received");
    welcomeDiv.innerHTML = `Bem-vindo ao EmoConnect! 🌟 <br>Selecione um contato para começar a conversar ou mude para o modo IA para falar comigo.<div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
    chatDiv.appendChild(welcomeDiv);
  } catch (error) {
    console.error("❌ Erro ao criar mensagem de boas-vindas:", error);
  }
  
  // DEBUG: Forçar exibição de informações sobre contatos
  console.log("=== DEBUG: Informações dos contatos ===");
  console.log("Array de contatos:", contatos);
  console.log("Quantidade de contatos:", contatos.length);
  console.log("Container de contatos:", contactsContainer);
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
