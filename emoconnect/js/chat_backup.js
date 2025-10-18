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

    const mensagemLower = mensagem.toLowerCase();
    
    // Análise de sentimento e contexto
    const palavrasMensagem = mensagemLower.split(/\s+/);
    let pontuacaoContexto = {};

    // Respostas contextualizadas baseadas em palavras-chave
    const contextosEspecificos = [
      // Trabalho e estudos
      {
        keywords: ["trabalho", "chefe", "colega", "emprego", "carreira", "demitido", "demissão"],
        respostas: [
          "Entendo que a situação no trabalho está te afetando. É comum o ambiente profissional impactar nosso emocional. Você já pensou em conversar com alguém sobre isso ou buscar apoio de RH?",
          "Questões relacionadas ao trabalho podem ser muito desgastantes. Que tal separar um tempo para avaliar o que realmente importa para você na sua carreira?",
          "Percebo que o trabalho está pesando. Lembre-se de que seu valor não é definido pelo emprego. Como você tem cuidado de si mesmo fora do trabalho?"
        ]
      },
      {
        keywords: ["estudos", "prova", "faculdade", "universidade", "vestibular", "nota", "reprovar", "matéria"],
        respostas: [
          "Sei que a pressão dos estudos pode ser intensa. Você está se cobrando demais? Às vezes, fazer pausas estratégicas ajuda mais do que estudar sem parar.",
          "A jornada acadêmica tem seus desafios. Lembre-se de que uma nota não define sua inteligência. Como você está organizando seu tempo de estudo?",
          "Entendo a preocupação com os estudos. Já tentou técnicas como pomodoro ou estudar em grupo? Às vezes, mudar a abordagem faz toda diferença."
        ]
      },
      // Relacionamentos
      {
        keywords: ["namorado", "namorada", "namorando", "relacionamento", "terminar", "término", "ex", "traição", "briga"],
        respostas: [
          "Relacionamentos podem ser desafiadores. É importante lembrar que comunicação honesta é a base de tudo. Você tem conseguido expressar seus sentimentos para a outra pessoa?",
          "Percebo que você está lidando com questões amorosas. Saiba que é válido sentir o que você está sentindo. Você já conversou com amigos próximos sobre isso?",
          "Entendo que essa situação no relacionamento te machucou. Dê-se tempo para processar seus sentimentos. O que você acha que precisa neste momento para se sentir melhor?"
        ]
      },
      {
        keywords: ["família", "pai", "mãe", "irmão", "irmã", "pais", "parente", "familiar"],
        respostas: [
          "Questões familiares podem ser profundas. Cada família tem sua dinâmica. Você se sente confortável conversando com alguém da família sobre isso?",
          "Entendo que a situação familiar está complicada. Às vezes, criar limites saudáveis é necessário para nosso bem-estar. Como você tem lidado com isso?",
          "A família tem um impacto grande em nós. Lembre-se de que você pode escolher como e quando se relacionar com eles. Seu bem-estar emocional vem primeiro."
        ]
      },
      {
        keywords: ["amigo", "amiga", "amizade", "amigos", "perdeu amigo", "briga com amigo"],
        respostas: [
          "Amizades verdadeiras são preciosas. Se houve um mal-entendido, uma conversa sincera pode ajudar. Você acha que consegue conversar com essa pessoa?",
          "Perder ou brigar com um amigo dói muito. Dê-se tempo para processar isso. Você sente que a amizade ainda tem valor para ser resgatada?",
          "Entendo que a situação com seu amigo te afetou. Amizades também passam por fases. O que você acha que poderia fazer para melhorar isso?"
        ]
      },
      // Saúde mental específica
      {
        keywords: ["ansiedade", "ansioso", "ansiosa", "pânico", "taquicardia", "medo", "nervoso"],
        respostas: [
          "A ansiedade pode ser avassaladora. Você já tentou exercícios de respiração profunda? Inspire por 4 segundos, segure por 4, expire por 6. Repetir isso pode ajudar a acalmar.",
          "Percebo que a ansiedade está presente. Já considerou escrever sobre o que te deixa ansioso? Colocar no papel pode ajudar a organizar os pensamentos.",
          "Entendo sua ansiedade. Focar no presente, uma coisa de cada vez, pode ajudar. Você tem um hobby ou atividade que te acalma?"
        ]
      },
      {
        keywords: ["depressão", "deprimido", "deprimida", "triste demais", "vazio", "sem sentido", "suicídio", "morrer"],
        respostas: [
          "Sinto muito que você esteja sentindo isso. Por favor, considere buscar ajuda profissional - um psicólogo ou CVV (188). Você não precisa passar por isso sozinho. Sua vida tem valor. 💙",
          "Percebo que você está em um momento muito difícil. É corajoso admitir isso. Por favor, converse com alguém de confiança ou ligue para o CVV (188). Você merece apoio profissional.",
          "Seu sofrimento é real e importante. Mas há pessoas que podem ajudar - profissionais de saúde mental estão preparados para isso. O CVV (188) está disponível 24h. Não hesite em buscar ajuda."
        ]
      },
      {
        keywords: ["insônia", "não consigo dormir", "acordar", "pesadelo", "sono"],
        respostas: [
          "Problemas de sono afetam muito nosso bem-estar. Você tem uma rotina antes de dormir? Evitar telas 1h antes e criar um ambiente calmo pode ajudar.",
          "A qualidade do sono é essencial. Já tentou meditação guiada ou sons relaxantes antes de dormir? Aplicativos como Calm ou Headspace podem ajudar.",
          "Entendo a frustração de não conseguir dormir. Manter horários regulares e evitar cafeína à tarde pode fazer diferença. Como está sua rotina?"
        ]
      },
      // Autoestima
      {
        keywords: ["feio", "feia", "gordo", "gorda", "magro", "corpo", "aparência", "beleza"],
        respostas: [
          "Sei que a pressão estética é real. Mas você é muito mais do que sua aparência. Que tal focar nas coisas que você gosta em si mesmo, seja uma habilidade, seu humor, sua gentileza?",
          "A relação com nosso corpo pode ser difícil. Lembre-se de que corpos saudáveis vêm em todas as formas. O que importa é como você se sente e sua saúde. Você tem cuidado de si?",
          "Entendo sua preocupação com aparência. Mas pense: quem você admira? Provavelmente é por quem elas são, não apenas pela aparência. O mesmo vale para você. 💜"
        ]
      },
      {
        keywords: ["não sou bom", "não sirvo", "incapaz", "burro", "incompetente", "fracasso"],
        respostas: [
          "Você está sendo muito duro consigo mesmo. Todos temos dificuldades e isso não define quem somos. Quais são suas qualidades? Todo mundo tem algo especial.",
          "Percebo que você está com a autoestima baixa. Mas pense: você já superou desafios antes. Liste 3 coisas que você faz bem. Aposto que há muitas!",
          "Esses pensamentos negativos sobre si mesmo não são a verdade. São apenas pensamentos. Você é capaz, sim. O que te faz sentir assim?"
        ]
      },
      // Situações positivas
      {
        keywords: ["conquista", "consegui", "passei", "promovido", "feliz", "alegre", "vitória"],
        respostas: [
          "Que maravilha! Parabéns pela sua conquista! 🎉 Você merece celebrar esse momento. Como você está se sentindo?",
          "Isso é incrível! Reconhecer e celebrar nossas vitórias é importante. Você trabalhou duro para isso! O que vem a seguir?",
          "Fico muito feliz por você! 😊 Momentos assim nos lembram da nossa capacidade. Continue acreditando em si mesmo!"
        ]
      },
      // Saudações
      {
        keywords: ["oi", "olá", "ola", "hey", "bom dia", "boa tarde", "boa noite"],
        respostas: [
          "Olá! É um prazer conversar com você. Como você está se sentindo hoje? �",
          "Oi! Estou aqui para ouvir e apoiar você. O que está passando pela sua cabeça?",
          "Olá! Fico feliz que você esteja aqui. Sobre o que gostaria de conversar hoje?"
        ]
      },
      // Solidão
      {
        keywords: ["sozinho", "sozinha", "solidão", "ninguém", "isolado", "sem amigos"],
        respostas: [
          "A solidão pode ser muito difícil. Mas lembre-se: estar só temporariamente não significa que você está sozinho para sempre. Já pensou em participar de grupos com interesses em comum?",
          "Entendo como se sente. Que tal começar pequeno? Um hobby novo, um curso online, pode te conectar com pessoas que compartilham seus interesses.",
          "Sei que a solidão dói. Mas você tem valor e merece conexões genuínas. Às vezes, começar com pequenas interações no dia a dia já ajuda. Como você costuma passar seu tempo?"
        ]
      }
    ];

    // Busca por contexto específico
    for (const contexto of contextosEspecificos) {
      if (contexto.keywords.some(keyword => mensagemLower.includes(keyword))) {
        return contexto.respostas[Math.floor(Math.random() * contexto.respostas.length)];
      }
    }

    // Respostas gerais mais empáticas
    const respostasGerais = [
      "Obrigada por compartilhar isso comigo. Suas emoções são válidas. Quer me contar mais sobre o que está acontecendo?",
      "É corajoso da sua parte se abrir assim. Como você tem lidado com essa situação no dia a dia?",
      "Percebo que isso está te afetando. Você tem alguém próximo com quem possa conversar sobre isso também?",
      "Entendo. Às vezes, só desabafar já alivia. Como você se sente ao falar sobre isso?",
      "Vejo que você está refletindo sobre algo importante. O que você acha que poderia te ajudar nesse momento?"
    ];

    return respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
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
          activeContactAvatar.onerror = function () {
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
