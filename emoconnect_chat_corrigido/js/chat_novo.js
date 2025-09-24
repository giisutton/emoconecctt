// ===== CHAT EMOCONNECT - VERSÃO COM IA REAL =====
// Versão funcional com Google Gemini API para TCC

console.log("🚀 Iniciando EmoConnect Chat com IA Real...");

// ===== CONFIGURAÇÃO DA IA =====
const GEMINI_API_KEY = "AIzaSyCnuGlHwY4wf-C1UhgGiNrUgbjiSsnlyBg";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Contexto da conversa para manter histórico
let conversaContexto = [];

// ===== VARIÁVEIS GLOBAIS =====
let modoChat = "user"; // "user" ou "ai"
let contatoAtivo = null;

// Lista de contatos (simulação)
const listaContatos = [
  {
    id: 1,
    nome: "Ana Silva",
    avatar: "https://i.pravatar.cc/40?img=1",
    ultimaMensagem: "Olá, como você está?",
    status: "online"
  },
  {
    id: 2,
    nome: "Carlos Mendes", 
    avatar: "https://i.pravatar.cc/40?img=11",
    ultimaMensagem: "Consegui resolver aquele problema.",
    status: "offline"
  },
  {
    id: 3,
    nome: "Juliana Costa",
    avatar: "https://i.pravatar.cc/40?img=5", 
    ultimaMensagem: "Vamos conversar depois?",
    status: "online"
  },
  {
    id: 4,
    nome: "Rafael Almeida",
    avatar: "https://i.pravatar.cc/40?img=12",
    ultimaMensagem: "Estou me sentindo melhor hoje.",
    status: "offline"
  },
  {
    id: 5,
    nome: "Bianca Santos",
    avatar: "https://i.pravatar.cc/40?img=9",
    ultimaMensagem: "Obrigada pelo apoio!",
    status: "online"
  }
];

// ===== AGUARDAR DOM =====
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM carregado, inicializando chat...");
  inicializarChat();
});

// ===== FUNÇÃO PRINCIPAL =====
function inicializarChat() {
  try {
    // Buscar elementos
    const elementos = buscarElementos();
    if (!elementos) return;
    
    // Configurar eventos
    configurarEventos(elementos);
    
    // Mostrar contatos
    criarContatos(elementos);
    
    // Configurar modo inicial
    configurarModoInicial(elementos);
    
    console.log("✅ Chat inicializado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
  }
}

// ===== BUSCAR ELEMENTOS DOM =====
function buscarElementos() {
  const elementos = {
    chatBox: document.getElementById('chat'),
    inputMensagem: document.getElementById('mensagemInput'),
    btnEnviar: document.getElementById('enviarBtn'),
    btnUser: document.getElementById('user-chat-btn'),
    btnAI: document.getElementById('ai-chat-btn'),
    listaContatos: document.getElementById('contacts-list'),
    containerContatos: document.querySelector('.contacts-container'),
    avatarAtivo: document.getElementById('active-contact-avatar'),
    nomeAtivo: document.getElementById('active-contact-name'),
    inputPesquisa: document.getElementById('search-contact')
  };
  
  // Verificar elementos essenciais
  const essenciais = ['chatBox', 'inputMensagem', 'btnEnviar', 'btnUser', 'btnAI'];
  for (let nome of essenciais) {
    if (!elementos[nome]) {
      console.error(`❌ Elemento ${nome} não encontrado!`);
      return null;
    }
  }
  
  // Criar container se não existir
  if (!elementos.containerContatos && elementos.listaContatos) {
    const container = document.createElement('div');
    container.className = 'contacts-container';
    container.style.cssText = 'flex: 1; overflow-y: auto; padding: 10px;';
    elementos.listaContatos.appendChild(container);
    elementos.containerContatos = container;
    console.log("✅ Container de contatos criado");
  }
  
  console.log("✅ Elementos encontrados");
  return elementos;
}

// ===== CONFIGURAR EVENTOS =====
function configurarEventos(elementos) {
  // Botão enviar
  elementos.btnEnviar.addEventListener('click', () => enviarMensagem(elementos));
  
  // Enter no input
  elementos.inputMensagem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem(elementos);
  });
  
  // Botões de modo
  elementos.btnUser.addEventListener('click', () => mudarModo('user', elementos));
  elementos.btnAI.addEventListener('click', () => mudarModo('ai', elementos));
  
  // Pesquisa de contatos
  if (elementos.inputPesquisa) {
    elementos.inputPesquisa.addEventListener('input', (e) => {
      pesquisarContatos(e.target.value, elementos);
    });
  }
  
  // Emojis
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elementos.inputMensagem.value += btn.textContent;
      elementos.inputMensagem.focus();
    });
  });
  
  console.log("✅ Eventos configurados");
}

// ===== CRIAR CONTATOS =====
function criarContatos(elementos) {
  if (!elementos.containerContatos) {
    console.error("❌ Container de contatos não disponível");
    return;
  }
  
  console.log("📝 Criando contatos...");
  elementos.containerContatos.innerHTML = '';
  
  listaContatos.forEach(contato => {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.dataset.id = contato.id;
    
    div.innerHTML = `
      <img src="${contato.avatar}" alt="${contato.nome}" 
           onerror="this.src='https://via.placeholder.com/40x40/6a5acd/white?text=${contato.nome[0]}'">
      <div class="contact-info">
        <div class="contact-name">${contato.nome}</div>
        <div class="last-message">${contato.ultimaMensagem}</div>
      </div>
      <div class="status-indicator ${contato.status}"></div>
    `;
    
    // Click no contato
    div.addEventListener('click', () => selecionarContato(contato, elementos));
    
    elementos.containerContatos.appendChild(div);
  });
  
  console.log(`✅ ${listaContatos.length} contatos criados`);
}

// ===== SELECIONAR CONTATO =====
function selecionarContato(contato, elementos) {
  console.log("👆 Contato selecionado:", contato.nome);
  
  // Remover active de todos
  document.querySelectorAll('.contact-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Adicionar active ao selecionado
  const itemSelecionado = document.querySelector(`[data-id="${contato.id}"]`);
  if (itemSelecionado) {
    itemSelecionado.classList.add('active');
  }
  
  // Atualizar header
  if (elementos.avatarAtivo) {
    elementos.avatarAtivo.src = contato.avatar;
    elementos.avatarAtivo.onerror = () => {
      elementos.avatarAtivo.src = `https://via.placeholder.com/36x36/6a5acd/white?text=${contato.nome[0]}`;
    };
  }
  if (elementos.nomeAtivo) {
    elementos.nomeAtivo.textContent = contato.nome;
  }
  
  // Limpar chat e mostrar mensagem inicial
  elementos.chatBox.innerHTML = '';
  adicionarMensagem(`Conversa com ${contato.nome} iniciada! 💬`, 'received', elementos);
  
  contatoAtivo = contato;
}

// ===== MUDAR MODO (USER/AI) =====
function mudarModo(novoModo, elementos) {
  console.log(`🔄 Mudando para modo: ${novoModo}`);
  
  modoChat = novoModo;
  
  // Atualizar botões
  elementos.btnUser.classList.toggle('active', novoModo === 'user');
  elementos.btnAI.classList.toggle('active', novoModo === 'ai');
  
  // Mostrar/esconder lista de contatos
  if (elementos.listaContatos) {
    elementos.listaContatos.style.display = novoModo === 'user' ? 'flex' : 'none';
  }
  
  // Atualizar header
  if (novoModo === 'ai') {
    if (elementos.avatarAtivo) elementos.avatarAtivo.style.display = 'none';
    if (elementos.nomeAtivo) elementos.nomeAtivo.textContent = 'Assistente EmoConnect';
    
    // Limpar chat e mensagem de boas-vindas da IA
    elementos.chatBox.innerHTML = '';
    adicionarMensagem('Olá! Sou sua assistente virtual do EmoConnect. 🤖✨ Estou aqui para conversar sobre suas emoções, oferecer apoio e ajudar no que precisar. Como você está se sentindo hoje?', 'received', elementos);
    
  } else {
    if (elementos.avatarAtivo) elementos.avatarAtivo.style.display = '';
    if (elementos.nomeAtivo) elementos.nomeAtivo.textContent = contatoAtivo ? contatoAtivo.nome : 'Chat EmoConnect';
  }
  
  // Limpar chat se mudou de modo
  if (novoModo === 'user' && elementos.chatBox.children.length > 0) {
    elementos.chatBox.innerHTML = '';
    adicionarMensagem('Selecione um contato para conversar! 👥', 'received', elementos);
  }
}

// ===== ENVIAR MENSAGEM =====
function enviarMensagem(elementos) {
  const texto = elementos.inputMensagem.value.trim();
  if (!texto) return;
  
  console.log(`📤 Enviando: "${texto}" (modo: ${modoChat})`);
  
  // Adicionar mensagem do usuário
  adicionarMensagem(texto, 'sent', elementos);
  elementos.inputMensagem.value = '';
  
  if (modoChat === 'ai') {
    // Mostrar "digitando..."
    const typingMsg = adicionarMensagem('🤖 Digitando...', 'received typing', elementos);
    
    // Chamar IA real
    chamarGeminiAPI(texto, elementos, typingMsg);
    
  } else if (modoChat === 'user' && contatoAtivo) {
    // Simular resposta do contato
    setTimeout(() => {
      const respostas = [
        'Entendi! Obrigado por compartilhar isso.',
        'Que interessante! Me conte mais sobre isso.',
        'Estou aqui se precisar conversar.',
        'Como você está se sentindo sobre isso?',
        'Isso faz muito sentido!'
      ];
      const resposta = respostas[Math.floor(Math.random() * respostas.length)];
      adicionarMensagem(resposta, 'received', elementos);
    }, 1000);
  }
}

// ===== CHAMAR API DO GEMINI =====
async function chamarGeminiAPI(mensagem, elementos, typingMsg) {
  try {
    console.log("🤖 Tentando Google Gemini API...");
    
    // Tentar API do Gemini primeiro
    const resposta = await tentarGeminiAPI(mensagem);
    
    // Remover "digitando..."
    if (typingMsg && typingMsg.parentNode) {
      typingMsg.parentNode.removeChild(typingMsg);
    }
    
    // Mostrar resposta
    adicionarMensagem(resposta, 'received', elementos);
    console.log("✅ Resposta obtida com sucesso");
    
  } catch (error) {
    console.log("⚠️ API falhou, usando IA local inteligente...", error.message);
    
    // Remover "digitando..." se ainda estiver lá
    if (typingMsg && typingMsg.parentNode) {
      typingMsg.parentNode.removeChild(typingMsg);
    }
    
    // Usar IA local como fallback
    const respostaLocal = obterRespostaIALocal(mensagem);
    adicionarMensagem(respostaLocal, 'received', elementos);
  }
}

// ===== TENTAR API DO GEMINI =====
async function tentarGeminiAPI(mensagem) {
  const requestBody = {
    contents: [{
      parts: [{ text: criarPromptEmocional(mensagem) }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 512,
    }
  };
  
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error("Invalid response format");
  }
}

// ===== IA LOCAL INTELIGENTE (FALLBACK) =====
function obterRespostaIALocal(mensagem) {
  console.log("🧠 Usando IA local inteligente...");
  
  const msgLower = mensagem.toLowerCase();
  
  // Análise emocional avançada
  const contextosEmocionais = {
    // Sentimentos negativos - MELHORADOS
    mal_estar: {
      keywords: ["não estou bem", "nao estou bem", "me sinto mal", "não tô bem", "nao to bem", "estou mal", "não me sinto bem"],
      respostas: [
        "Percebo que você está passando por um momento difícil agora. 💙 Não estar bem é um sinal importante que seu corpo e mente estão te dando. Você consegue identificar o que pode estar contribuindo para esse sentimento? Às vezes pode ser cansaço, estresse, alguma situação específica...",
        "Sinto muito que você esteja se sentindo assim. 🤗 É corajoso reconhecer e expressar que não está bem - muitas pessoas guardam isso para si. Você gostaria de compartilhar o que está te deixando dessa forma? Estou aqui para te ouvir sem julgamento.",
        "Obrigada por confiar em mim esse sentimento. 🌸 Quando dizemos 'não estou bem', geralmente há várias camadas por trás disso. Pode ser algo físico, emocional, ou uma mistura. Que tal começarmos identificando: você diria que é mais uma sensação física ou emocional?"
      ]
    },
    
    tristeza: {
      keywords: ["triste", "tristeza", "deprimido", "sozinho", "vazio", "chateado", "melancolia", "down"],
      respostas: [
        "A tristeza é uma emoção profunda e válida. 💧 Ela nos conecta com nossa humanidade e, às vezes, nos ajuda a processar perdas ou mudanças importantes. O que você acha que pode estar por trás dessa tristeza? Algo específico aconteceu ou é um sentimento mais geral?",
        "Reconheço a coragem que é preciso para falar sobre tristeza. 🤲 Esse sentimento, embora doloroso, faz parte da experiência humana. Você tem se permitido sentir essa emoção ou tem tentado 'empurrar para longe'? Às vezes, acolher a tristeza é o primeiro passo para compreendê-la.",
        "Sinto sua dor através das suas palavras. 🌙 A tristeza pode parecer um buraco sem fundo, mas ela tem um propósito - nos convida a parar, refletir e cuidar de nós mesmos. Como você tem se cuidado durante esse período? Você tem uma rede de apoio próxima?"
      ]
    },

    ansiedade: {
      keywords: ["ansioso", "ansiosa", "nervoso", "nervosa", "preocupado", "preocupada", "angustiado", "tenso", "estressado", "pânico", "inquieto"],
      respostas: [
        "A ansiedade pode ser realmente intensa e desconfortável. 🫁 Vamos começar com sua respiração - você percebe se está respirando mais rápido ou de forma mais superficial agora? Às vezes, focar na respiração já traz um alívio inicial. Inspire profundamente por 4 segundos, segure por 4, solte por 6.",
        "Entendo como a ansiedade pode ser avassaladora. �️ Ela geralmente vem com pensamentos acelerados e sensações físicas intensas. Você consegue me contar se há algo específico que está te deixando ansioso(a) ou se é mais uma sensação geral de inquietação?",
        "A ansiedade é como um alarme interno que às vezes dispara quando não há perigo real. � Vamos tentar identificar: existem pensamentos específicos circulando na sua mente agora? E fisicamente, onde você sente mais tensão - no peito, estômago, ombros?"
      ]
    },
    
    felicidade: {
      keywords: ["feliz", "alegre", "bem", "ótimo", "excelente", "maravilhoso", "animado", "contente", "radiante"],
      respostas: [
        "Que energia maravilhosa! ✨ Sua alegria é contagiante até através desta tela. É lindo quando conseguimos reconhecer e celebrar nossos momentos de bem-estar. O que está trazendo essa felicidade para sua vida hoje? Merece ser celebrado!",
        "Fico genuinamente feliz em sentir sua alegria! 🌟 Momentos assim são presentes que a vida nos dá. Você consegue identificar o que contribuiu para esse estado de espírito? É importante reconhecermos esses 'ingredientes' da felicidade para cultivá-los mais.",
        "Sua felicidade ilumina nossa conversa! 😊 É inspirador ver alguém em um momento positivo. Que tal guardarmos esse sentimento? Anote mentalmente ou fisicamente o que está sentindo agora - será um tesouro para os dias mais desafiadores."
      ]
    },
    
    tcc_estudo: {
      keywords: ["tcc", "monografia", "dissertação", "estudo", "estudar", "apresentação", "defesa", "faculdade", "universidade", "prova", "trabalho acadêmico", "formatura"],
      respostas: [
        "O TCC é uma montanha que parece impossível de escalar, não é? 📚 Mas olha só - você chegou até aqui! Isso já demonstra sua capacidade e determinação. Vamos quebrar esse 'monstro' em partes menores? Qual etapa está te causando mais ansiedade: a pesquisa, a escrita ou a apresentação?",
        "A jornada acadêmica tem suas pressões únicas, e o TCC é definitivamente o grande desafio final. 🎓 É normal sentir ansiedade - você está criando algo original e significativo! Me conta: o que mais te preocupa no processo? Prazos, conteúdo, orientador, ou a apresentação final?",
        "Reconheço a pressão acadêmica que você está enfrentando. 📖 O TCC representa não apenas uma nota, mas toda sua jornada de aprendizado. Lembra: não precisa ser perfeito, precisa ser SEU. Como posso te ajudar a organizar os próximos passos de forma mais leve e manejável?"
      ]
    },
    
    motivacao: {
      keywords: ["desistir", "não consigo", "nao consigo", "difícil", "impossível", "sem forças", "cansado", "fracasso", "desânimo", "sem esperança"],
      respostas: [
        "Reconheço essa sensação de esgotamento, e quero que saiba que ela é temporal, não permanente. 💪 O fato de você estar aqui, expressando isso, já mostra que ainda há uma chama dentro de você. Não é sobre não sentir cansaço - é sobre encontrar pequenos passos possíveis mesmo quando tudo parece impossível.",
        "Compreendo que tudo pareça uma montanha intransponível agora. 🏔️ Mas vamos fazer um exercício: olhe para trás e veja quantas 'montanhas impossíveis' você já escalou na vida. Você tem mais força e recursos internos do que imagina neste momento de cansaço.",
        "Primeiro, respire fundo. 🌬️ Segundo, saiba que sentir vontade de desistir não é fracasso - é um sinal de que você precisa de cuidado e, talvez, uma nova estratégia. Que tal começarmos identificando UMA coisa pequena e concreta que você pode fazer hoje? Pequenos passos também são progresso."
      ]
    },
    
    sono_cansaco: {
      keywords: ["cansado", "cansada", "sono", "dormir", "insônia", "acordar", "noite", "descanso", "exausto", "exausta"],
      respostas: [
        "O cansaço pode afetar tudo - nosso humor, concentração, capacidade de lidar com desafios. 😴 É como se nosso 'sistema operacional' estivesse rodando devagar. Me conta: é mais um cansaço físico, mental, ou emocional? E como tem sido seu sono ultimamente?",
        "Entendo essa exaustão. 🌙 Às vezes nosso corpo e mente estão pedindo uma pausa real. Você tem conseguido descansar de qualidade ou tem sido mais um 'descanso de aparência'? Vamos pensar juntos em estratégias para um descanso mais reparador.",
        "O cansaço é um sinal importante que não devemos ignorar. ⚡ Pode ser físico, mas também pode ser nosso jeito de processar estresse ou sobrecarga emocional. Quando foi a última vez que você teve um momento só seu, sem pressões ou obrigações? Autocuidado não é luxo, é necessidade."
      ]
    },
    
    relacionamentos: {
      keywords: ["família", "amigos", "relacionamento", "namorado", "namorada", "pais", "conflito", "briga", "discussão", "sozinho", "sozinha", "incompreendido"],
      respostas: [
        "Relacionamentos são uma das partes mais complexas e importantes da vida. 💝 Cada pessoa traz sua história, expectativas e formas de se comunicar. Me conta um pouco mais sobre essa situação - é um conflito específico ou mais um sentimento geral sobre como as coisas estão?",
        "É doloroso quando nos sentimos desconectados das pessoas importantes em nossas vidas. 🤝 Comunicação é uma arte que todos estamos sempre aprendendo. Você já conseguiu expressar seus sentimentos abertamente para essa pessoa? Às vezes, mal-entendidos são mais simples de resolver do que imaginamos.",
        "Relacionamentos exigem paciência, compreensão mútua e, principalmente, comunicação honesta. 💬 Cada pessoa tem sua linguagem de amor e forma de demonstrar afeto. Como você costuma expressar carinho e como prefere receber? Às vezes, as pessoas falam 'idiomas emocionais' diferentes."
      ]
    }
  };
  
  // Encontrar o contexto mais apropriado
  let melhorContexto = null;
  let maiorPontuacao = 0;
  
  for (const [nome, contexto] of Object.entries(contextosEmocionais)) {
    const pontos = contexto.keywords.filter(keyword => msgLower.includes(keyword)).length;
    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      melhorContexto = contexto;
    }
  }
  
  // Se encontrou um contexto específico
  if (melhorContexto && maiorPontuacao > 0) {
    return melhorContexto.respostas[Math.floor(Math.random() * melhorContexto.respostas.length)];
  }
  
  // Saudações
  if (msgLower.includes('oi') || msgLower.includes('olá') || msgLower.includes('ola')) {
    const saudacoes = [
      "Olá! 👋 Que bom ter você aqui. Como está se sentindo hoje? Estou aqui para te ouvir e apoiar no que precisar.",
      "Oi! ✨ É um prazer conversar com você. Este é um espaço seguro para compartilhar seus pensamentos e sentimentos. O que trouxe você até aqui hoje?",
      "Seja muito bem-vindo(a)! 🌟 Estou aqui como sua companhia virtual no EmoConnect. Como posso te apoiar hoje? Fique à vontade para compartilhar o que estiver sentindo."
    ];
    return saudacoes[Math.floor(Math.random() * saudacoes.length)];
  }
  
  // Despedidas
  if (msgLower.includes('tchau') || msgLower.includes('obrigado') || msgLower.includes('obrigada')) {
    const despedidas = [
      "Foi um prazer conversar com você! 💙 Lembre-se: você é mais forte do que imagina. Volte sempre que precisar. Cuide-se bem!",
      "Obrigada por compartilhar seus sentimentos comigo. 🌸 Estar aqui, buscando apoio, já mostra sua coragem. Estarei sempre aqui quando precisar. Até mais!",
      "Que nossa conversa tenha te trazido algum conforto. ✨ Você merece cuidado, compreensão e felicidade. Não hesite em voltar. Um abraço virtual! 🤗"
    ];
    return despedidas[Math.floor(Math.random() * despedidas.length)];
  }
  
  // Respostas gerais empáticas - MELHORADAS
  const respostasGerais = [
    "Percebo que há algo importante nas suas palavras. 💙 Cada sentimento que você compartilha é válido e merece atenção. Como você está se sentindo ao falar sobre isso aqui comigo? Às vezes, colocar os pensamentos em palavras já traz um alívio inicial.",
    "Estou aqui para te ouvir com todo o cuidado e sem qualquer julgamento. 🤗 Sua coragem de compartilhar seus sentimentos mostra uma pessoa que busca crescimento e bem-estar. Há algo específico sobre essa situação que está mais pesado no seu coração?",
    "Obrigada por confiar em mim seus pensamentos. 🌱 O autoconhecimento é uma jornada contínua e nem sempre fácil. Que insights você tem sobre seus próprios sentimentos? E como costuma cuidar de si mesmo(a) em momentos assim?",
    "Suas reflexões mostram uma pessoa consciente e que valoriza seu bem-estar emocional, e isso é admirável. ✨ Todos nós passamos por momentos de incerteza e busca por clareza. O que você sente que mais precisa agora - ser ouvido(a), encontrar estratégias práticas, ou apenas processar esses sentimentos?",
    "É significativo termos um espaço seguro para processar nossos pensamentos e emoções. 🍃 Vejo que você está refletindo sobre aspectos importantes da sua vida. Como posso te apoiar melhor neste momento? Prefere explorar mais profundamente esses sentimentos ou buscar estratégias práticas?"
  ];
  
  return respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
}

// ===== CRIAR PROMPT EMOCIONAL =====
function criarPromptEmocional(mensagem) {
  const promptSistema = `Você é a assistente virtual do EmoConnect, uma plataforma de apoio emocional e mental.

INSTRUÇÕES IMPORTANTES:
- Você é empática, acolhedora e profissional
- Foque em bem-estar emocional e mental
- Ofereça apoio genuíno sem dar conselhos médicos
- Use emojis apropriados mas com moderação
- Mantenha conversas em português brasileiro
- Seja uma companhia amigável e compreensiva

CONTEXTO:
O usuário está buscando apoio emocional através desta plataforma. Trate cada conversa como única e importante.

MENSAGEM DO USUÁRIO: ${mensagem}

Responda de forma natural, empática e útil:`;

  return promptSistema;
}

// ===== ADICIONAR MENSAGEM =====
function adicionarMensagem(texto, tipo, elementos) {
  const div = document.createElement('div');
  div.className = `message ${tipo}`;
  
  const timestamp = new Date().toLocaleTimeString();
  div.innerHTML = `${texto}<div class="timestamp">${timestamp}</div>`;
  
  elementos.chatBox.appendChild(div);
  elementos.chatBox.scrollTop = elementos.chatBox.scrollHeight;
  
  return div; // Retornar elemento para poder remover depois
}

// ===== PESQUISAR CONTATOS =====
function pesquisarContatos(termo, elementos) {
  if (!elementos.containerContatos) return;
  
  const items = elementos.containerContatos.querySelectorAll('.contact-item');
  
  items.forEach(item => {
    const nome = item.querySelector('.contact-name').textContent.toLowerCase();
    const match = nome.includes(termo.toLowerCase());
    item.style.display = match ? 'flex' : 'none';
  });
}

// ===== CONFIGURAR MODO INICIAL =====
function configurarModoInicial(elementos) {
  // Modo inicial: user
  mudarModo('user', elementos);
  
  // Mensagem inicial
  adicionarMensagem('Bem-vindo ao EmoConnect! 🌟 Selecione um contato ou mude para o modo IA.', 'received', elementos);
  
  console.log("✅ Modo inicial configurado");
}

// ===== TEMA ESCURO =====
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggle-theme');
  if (toggleBtn) {
    const isDark = localStorage.getItem('tema') === 'dark';
    if (isDark) {
      document.body.classList.add('dark-mode');
      toggleBtn.textContent = '☀️';
    }
    
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('tema', isDarkMode ? 'dark' : 'light');
      toggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
    });
  }
});

console.log("✅ Chat EmoConnect carregado!");