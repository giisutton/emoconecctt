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

    // Sistema de análise contextual melhorado com REGEX
    const analiseContexto = {
      // Morte/Luto
      morte: {
        patterns: [/morr(eu|e)/i, /falec(eu|imento)/i, /perdi (meu|minha|o|a).*(pai|mãe|avô|avó|irmão|irmã|tio|tia|cachorro|gato|pet)/i, /luto/i],
        respostas: [
          "Sinto muito pela sua perda. 💙 O luto é um processo único para cada pessoa. Não há um jeito 'certo' de sentir. Você tem alguém com quem conversar sobre isso?",
          "Perder alguém que amamos é uma das dores mais profundas. Permita-se sentir o que precisa sentir. Não há pressa. Como você está cuidando de si nesse momento?",
          "Meus sentimentos por sua perda. É natural que você esteja passando por emoções intensas agora. Você está recebendo apoio das pessoas ao seu redor?"
        ]
      },
      // Problemas financeiros
      financeiro: {
        patterns: [/dinheiro/i, /desempregado/i, /conta/i, /divida/i, /dívida/i, /pagar/i, /salário/i, /financeiro/i, /demitido/i, /sem grana/i],
        respostas: [
          "Problemas financeiros geram muito estresse. Você já considerou fazer um planejamento financeiro simples? Às vezes, visualizar a situação ajuda a encontrar soluções.",
          "Entendo que a situação financeira está te preocupando. Isso é muito estressante. Você tem conseguido separar um momento para cuidar da saúde mental mesmo assim?",
          "Questões de dinheiro afetam muito nosso bem-estar. Já pensou em buscar orientação financeira gratuita? Muitas ONGs oferecem isso. E lembre-se: seu valor não está no quanto você tem no banco."
        ]
      },
      // Traição/Infidelidade
      traicao: {
        patterns: [/tra(iu|ição|í)/i, /chifruda/i, /corno/i, /infiel/i, /me traiu/i, /traído/i, /outra pessoa/i, /outro cara/i, /outra garota/i],
        respostas: [
          "Descobrir uma traição é devastador. A dor que você está sentindo é completamente válida. Não se culpe - a traição é uma escolha de quem traiu, não sua falha.",
          "Sinto muito que você tenha passado por isso. Traição quebra a confiança de forma profunda. Dê-se tempo para processar. Você merece ser tratado com respeito e fidelidade.",
          "Entendo sua dor. A traição machuca porque quebra a confiança que construímos. Não há justificativa para isso. Como você está se cuidando agora?"
        ]
      },
      // Violência/Abuso
      violencia: {
        patterns: [/abus(o|ada|ado)/i, /violência/i, /bate/i, /agrediu/i, /machuca/i, /me bate/i, /apanho/i, /abusada sexualmente/i],
        respostas: [
          "⚠️ Sinto muito que você esteja passando por isso. Sua segurança é prioridade. Por favor, considere buscar ajuda imediata: Disque 180 (mulheres) ou polícia 190. Você não merece ser tratado assim.",
          "Isso é muito sério e ninguém merece passar por violência. Por favor, procure ajuda: Disque 180, Disque 100 ou vá a uma delegacia. Há profissionais que podem te proteger.",
          "Você não está sozinho nisso e não é sua culpa. Violência é crime. Por favor, busque ajuda urgente: Disque 180, 190 ou procure uma delegacia. Sua vida e segurança importam."
        ]
      },
      // Saúde física
      saude: {
        patterns: [/doente/i, /doença/i, /diagnóstico/i, /hospital/i, /tratamento/i, /câncer/i, /cancer/i, /médico/i, /dor física/i, /cirurgia/i],
        respostas: [
          "Lidar com problemas de saúde é realmente difícil, tanto física quanto emocionalmente. Você está recebendo apoio médico adequado? E tem alguém te acompanhando nessa jornada?",
          "Entendo que questões de saúde física também afetam nosso emocional. Isso é completamente normal. Como você tem cuidado da sua saúde mental durante esse processo?",
          "Problemas de saúde podem ser assustadores. Lembre-se de que é válido ter medo e buscar informações. Você tem um bom suporte médico? E está se permitindo expressar suas emoções sobre isso?"
        ]
      },
      // Vícios/Dependências
      vicio: {
        patterns: [/vici(ado|ada|o)/i, /dependente/i, /álcool/i, /bebida/i, /drogas/i, /maconha/i, /cocaína/i, /bebo muito/i, /não consigo parar/i],
        respostas: [
          "Reconhecer que há um problema é o primeiro e mais difícil passo. Você é corajoso por admitir isso. Já considerou buscar grupos de apoio como AA ou NA? Há também o CAPS que oferece tratamento gratuito.",
          "A dependência é uma doença, não uma falha de caráter. Você merece ajuda profissional. O CVV (188) e CAPS podem te orientar. Você tem apoio familiar ou de amigos?",
          "Entendo que você está lutando contra isso. Saiba que há tratamento e você pode melhorar. Busque o CAPS da sua cidade ou ligue para 132 (SAMU) para orientação. Você não precisa enfrentar isso sozinho."
        ]
      },
      // Gravidez inesperada
      gravidez: {
        patterns: [/grávida/i, /gravida/i, /gravidez/i, /engravidei/i, /gestante/i, /aborto/i, /teste positivo/i],
        respostas: [
          "Descobrir uma gravidez, especialmente se não planejada, pode trazer muitas emoções. Não há jeito certo de se sentir. Você tem alguém de confiança para conversar sobre isso?",
          "Entendo que essa notícia te pegou de surpresa. Dê-se tempo para processar. Seja qual for sua decisão, ela é válida. Você já pensou em conversar com um profissional de saúde?",
          "Isso pode ser assustador. Lembre-se de que você tem direitos e opções, seja qual for sua escolha. Procure uma unidade de saúde para orientação médica e psicológica adequada."
        ]
      },
      // Bullying/Assédio
      bullying: {
        patterns: [/bullying/i, /zoam/i, /riem de mim/i, /assédio/i, /humilha/i, /provoca/i, /mexem comigo/i, /implicam/i],
        respostas: [
          "Bullying é sério e não é sua culpa. Ninguém merece ser tratado assim. Você já contou para alguém responsável (professor, diretor, chefe, família)? É importante denunciar.",
          "Sofrer bullying é muito doloroso. Seu sofrimento é válido. Por favor, converse com alguém que possa te ajudar - um adulto de confiança, RH da empresa, ou autoridades se necessário.",
          "Entendo como isso te afeta. Bullying pode deixar marcas profundas. Não guarde isso só para você. Denuncie e busque apoio. Você merece respeito e dignidade."
        ]
      },
      // Crises específicas
      criseTriste: {
        patterns: [/triste/i, /chorando/i, /choro/i, /mal/i, /péssimo/i, /horrível/i, /sofrendo/i],
        respostas: [
          "Vejo que você está passando por um momento difícil. Chorar e se sentir mal às vezes é necessário. Você sabe o que está te deixando assim ou é algo mais geral?",
          "Sinto que você está sofrendo. Não minimize seus sentimentos - eles são válidos. Quer me contar o que aconteceu? Às vezes, colocar para fora já alivia um pouco.",
          "Percebo que você não está bem. Está tudo bem não estar bem. O que você acha que poderia te ajudar agora? Uma conversa, um momento sozinho, ou talvez fazer algo que gosta?"
        ]
      },
      criseEstresse: {
        patterns: [/estress(e|ado|ada)/i, /sobrecarregad(o|a)/i, /exaust(o|a)/i, /cansad(o|a)/i, /esgotad(o|a)/i, /não aguento mais/i],
        respostas: [
          "Você parece estar no limite. É importante pausar antes de quebrar. Quando foi a última vez que você tirou um tempo só para você? Nem que seja 15 minutos?",
          "O esgotamento é real. Você não precisa ser produtivo 100% do tempo. Que tal listar suas prioridades e ver o que pode ser delegado ou adiado?",
          "Percebo que você está sobrecarregado. Seu corpo e mente estão pedindo descanso. Você consegue tirar um dia de folga ou pelo menos algumas horas para recarregar?"
        ]
      },
      // Cachorro/Pet morreu
      petMorreu: {
        patterns: [/(meu|minha).*(cachorro|gato|pet|animal).*(morreu|faleceu)/i, /perdi meu (cachorro|gato|pet)/i],
        respostas: [
          "Sinto muito pela perda do seu pet. 🐾💙 Eles são família e essa dor é real e profunda. Permita-se sentir saudade. Quer me contar sobre ele/ela?",
          "Perder um animal de estimação dói demais. Eles deixam marcas enormes em nossos corações. É válido estar triste. Como você está lidando com a perda?",
          "Meus sentimentos pela perda do seu companheirinho. Pets são parte da nossa família. Não há problema em estar de luto. Você tem fotos ou lembranças especiais dele?"
        ]
      },
      // ========= SITUAÇÕES POSITIVAS =========
      // Conquistas acadêmicas
      sucessoAcademico: {
        patterns: [/pass(ei|ou) (na|no) (prova|teste|vestibular|faculdade|concurso)/i, /aprovad(o|a) (na|no)/i, /tirei nota boa/i, /gabaritei/i, /formei/i, /me formei/i, /diploma/i],
        respostas: [
          "Que conquista incrível! 🎓✨ Parabéns! Todo seu esforço valeu a pena. Como você está se sentindo com essa vitória?",
          "Isso é maravilhoso! 📚🎉 Você trabalhou duro para isso. Aproveite esse momento de orgulho, você merece!",
          "Parabéns pela aprovação! 🌟 Essa é uma conquista e tanto! O que vem a seguir na sua jornada?"
        ]
      },
      // Conquistas profissionais
      sucessoProfissional: {
        patterns: [/(consegui|arrumei|comecei) (um|o) (emprego|trabalho|job)/i, /fui (promovid|contratad)(o|a)/i, /aumento de salário/i, /promoção/i, /novo emprego/i],
        respostas: [
          "Que notícia fantástica! 💼🎉 Parabéns pela conquista profissional! Você deve estar radiante. Como foi o processo?",
          "Isso é excelente! 🌟 Conquistar um novo emprego/promoção não é fácil. Você merece comemorar! O que mais te animou nessa conquista?",
          "Parabéns! 🚀 Seu esforço está sendo reconhecido. Isso é muito motivador! Como você pretende celebrar?"
        ]
      },
      // Relacionamentos felizes
      amorFeliz: {
        patterns: [/(estou|fiquei) apaixonad(o|a)/i, /(comecei|estou) namorando/i, /me cas(ei|ando)/i, /pedido de namoro/i, /noivado/i, /encontrei alguém especial/i, /feliz no relacionamento/i],
        respostas: [
          "Que lindo! 💕😊 O amor é uma das melhores sensações. Fico feliz por você estar vivendo isso! Como está sendo essa experiência?",
          "Isso é maravilhoso! 💖✨ Relacionamentos saudáveis nos fazem muito bem. Aproveite cada momento! O que te faz mais feliz nessa pessoa?",
          "Que alegria! 🥰 Estar apaixonado é especial. Desejo muita felicidade para vocês! Como se conheceram?"
        ]
      },
      // Recuperação de saúde
      melhoraSaude: {
        patterns: [/(estou|me sinto) melhor/i, /me cur(ei|ado)/i, /alta (do hospital|médica)/i, /tratamento deu certo/i, /recuperado/i, /venci (a|o) (doença|câncer|depressão)/i],
        respostas: [
          "Que alívio e alegria! 🌈💪 Recuperar a saúde é uma vitória enorme! Como você está se sentindo agora?",
          "Isso é maravilhoso! 💙✨ Você passou por um desafio difícil e venceu. Parabéns pela força e determinação!",
          "Que notícia incrível! 🌟 Sua jornada de recuperação é inspiradora. Continue cuidando de si. Como planeja celebrar?"
        ]
      },
      // Realizações pessoais
      realizacaoPessoal: {
        patterns: [/realiz(ei|ado) (meu|um) sonho/i, /comprei/i, /viaj(ei|ando)/i, /conquist(ei|ado)/i, /orgulho de mim/i, /superei/i, /venci/i, /consegui parar/i],
        respostas: [
          "Que orgulho! 🎉✨ Realizar sonhos é uma das melhores sensações do mundo. Conte-me mais sobre isso!",
          "Parabéns! 🌟 Conquistas pessoais merecem ser celebradas. Como você está se sentindo com essa vitória?",
          "Isso é fantástico! 💫 Você merece toda felicidade. O que essa conquista significa para você?"
        ]
      },
      // Gratidão e felicidade geral
      gratidaoFelicidade: {
        patterns: [/(estou|me sinto) (feliz|grat(o|a)|abençoado|sortudo)/i, /vida está boa/i, /tudo está bem/i, /momento incrível/i, /dias maravilhosos/i],
        respostas: [
          "Que maravilha! 😊✨ É lindo ver você celebrando a felicidade. Esses momentos são preciosos. O que está te fazendo tão feliz?",
          "Isso é incrível! 🌟💖 Aproveite esse momento de gratidão. A vida tem dessas surpresas boas! Continue nutrindo essa energia positiva!",
          "Fico muito feliz por você! 🎉 Momentos assim merecem ser saboreados. O que de melhor aconteceu recentemente?"
        ]
      },
      // Novo começo
      novoComeço: {
        patterns: [/novo começo/i, /recomeç(ar|ando)/i, /virar a página/i, /nova fase/i, /mudança positiva/i, /seguindo em frente/i],
        respostas: [
          "Que coragem! 🌱✨ Novos começos são desafiadores mas trazem tantas possibilidades. Como você está se sentindo com essa mudança?",
          "Isso é inspirador! 🌅💪 Começar de novo requer força. Torço muito por você nessa nova fase! O que mais te motiva?",
          "Que momento especial! 🦋 Transformações são lindas. Desejo que essa nova fase traga muita realização e paz!"
        ]
      }
    };

    // Verificar padrões específicos primeiro (regex patterns)
    for (const [categoria, dados] of Object.entries(analiseContexto)) {
      for (const pattern of dados.patterns) {
        if (pattern.test(mensagem)) {
          return dados.respostas[Math.floor(Math.random() * dados.respostas.length)];
        }
      }
    }

    // Contextos gerais com keywords (fallback)
    const contextosGerais = {
      trabalho: {
        keywords: ["trabalho", "chefe", "colega", "emprego", "escritório", "projeto", "reunião", "equipe"],
        respostas: [
          "Vejo que tem algo relacionado ao trabalho te incomodando. Quer me contar mais sobre o que está acontecendo lá?",
          "O ambiente de trabalho pode ser bem desafiador. O que especificamente está te afetando mais?",
          "Entendo. Trabalho ocupa grande parte do nosso tempo. Como isso está impactando seu dia a dia fora do expediente?"
        ]
      },
      estudo: {
        keywords: ["estudo", "prova", "faculdade", "escola", "vestibular", "nota", "matéria", "professor"],
        respostas: [
          "A pressão acadêmica pode ser intensa. Me conta mais - o que está sendo mais difícil para você agora?",
          "Entendo. Estudar pode ser estressante. Você tem conseguido equilibrar estudos com momentos de descanso?",
          "Vejo que os estudos estão pesando. Quer me contar o que especificamente está te preocupando?"
        ]
      },
      relacionamento: {
        keywords: ["namorado", "namorada", "relacionamento", "parceiro", "parceira", "marido", "esposa", "ficante"],
        respostas: [
          "Relacionamentos têm seus desafios. Me conta o que está acontecendo? Às vezes, falar ajuda a clarear as coisas.",
          "Percebo que tem algo no relacionamento te afetando. Você se sente confortável conversando com a pessoa sobre isso?",
          "Entendo. As relações amorosas podem ser complexas. O que você acha que está faltando ou sobrando nessa situação?"
        ]
      },
      saudacoes: {
        keywords: ["oi", "olá", "ola", "hey", "olar", "e ai", "eae"],
        respostas: [
          "Oi! Como você está se sentindo hoje? Estou aqui para conversar. 😊",
          "Olá! Fico feliz que você esteja aqui. O que você gostaria de compartilhar?",
          "Hey! Pode ficar à vontade para desabafar. Estou aqui para te ouvir. 💜"
        ]
      },
      coisasBoas: {
        keywords: ["feliz", "alegre", "contente", "animado", "empolgado", "ótimo", "excelente", "maravilhoso", "incrível"],
        respostas: [
          "Que bom saber que você está feliz! 😊✨ Momentos assim são especiais. O que te deixou tão animado?",
          "Fico muito feliz por você! 🌟 Compartilhar alegrias é maravilhoso. Conte-me mais sobre o que aconteceu!",
          "Isso é lindo! 💖 É sempre bom celebrar os momentos positivos. Como você está aproveitando isso?"
        ]
      }
    };

    // Verificar contextos gerais
    for (const [categoria, dados] of Object.entries(contextosGerais)) {
      if (dados.keywords.some(keyword => mensagemLower.includes(keyword))) {
        return dados.respostas[Math.floor(Math.random() * dados.respostas.length)];
      }
    }

    // Respostas abertas e empáticas (último recurso)
    const respostasAbertas = [
      "Me conte mais sobre isso. Estou aqui para ouvir você.",
      "Percebo que isso está te afetando. Quer desabafar mais? Estou aqui.",
      "Entendo. Como você tem se sentido em relação a isso?",
      "Vejo que você precisava falar sobre isso. Continue, estou te escutando.",
      "Isso parece importante para você. Quer me contar mais detalhes sobre o que aconteceu?",
      "Suas emoções são válidas. O que mais você gostaria de compartilhar sobre isso?"
    ];

    return respostasAbertas[Math.floor(Math.random() * respostasAbertas.length)];
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
