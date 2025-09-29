// EmoConnect Main - Versão funcional completa
document.addEventListener("DOMContentLoaded", () => {
  // Exibir data atual e nome do usuário
  const currentDate = document.getElementById("current-date");
  const userName = document.getElementById("user-name");

  const hoje = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  if (currentDate) {
    currentDate.textContent = hoje.toLocaleDateString('pt-BR', options);
  }

  // Obter nome do usuário do localStorage (perfil)
  if (userName) {
    userName.textContent = localStorage.getItem("userName") || "Amigo";
  }

  // Seleção de humor
  const moodButtons = document.querySelectorAll(".mood-card");
  const moodMessage = document.getElementById("mood-message");

  const moodFrases = {
    "Feliz": "Continue espalhando essa luz! ☀️",
    "Triste": "Tudo bem não estar bem. Estamos com você. 💙",
    "Cansado": "Descanse um pouco. Você merece. 😴",
    "Estressado": "Respire fundo. Vai passar. 😌",
    "Ansioso": "Uma coisa de cada vez. Você consegue. 🌸",
    "Calmo": "Que paz! Continue assim. 🌿",
    "Empolgado": "Que energia incrível! ⚡",
    "Confuso": "Às vezes é assim mesmo. Vai clarear. 🌤️"
  };

  // Frases motivacionais
  const frases = [
    "✨ Acredite em você, até quando ninguém mais acreditar.",
    "🌟 Você já é incrível só por tentar.",
    "☀️ Tudo vai passar, como sempre passa.",
    "💪 A sua força está nas pequenas vitórias.",
    "🌈 Sua jornada é única. Valorize-a.",
    "🌱 Cada passo conta, por menor que pareça.",
    "🌟 Você é mais forte do que imagina.",
    "🦋 Transformação exige paciência.",
    "🏆 Pequenas vitórias constroem grandes conquistas.",
    "🪄 Você tem o poder de mudar sua história."
  ];

  let selectedMood = "";

  moodButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remover seleção anterior
      moodButtons.forEach(btn => btn.classList.remove("selected"));

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

      // Atualizar gráficos e calendário
      if (document.getElementById("chart-semanal")) {
        atualizarGraficoSemanal();
      }
      if (document.getElementById("calendar-mensal")) {
        atualizarCalendarioMensal();
      }
      if (document.getElementById("pie-categorias")) {
        atualizarGraficoCategorias();
      }

      atualizarAnaliseEmocional();
    });
  });

  // Ações dos botões
  const desabafarBtn = document.getElementById("desabafar");
  if (desabafarBtn) {
    desabafarBtn.addEventListener("click", () => {
      const text = prompt("Desabafe aqui. Escreva o que quiser:");
      if (text && text.trim()) {
        // Save journal entry
        const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
        journalEntries.push({
          text: text,
          date: new Date().toISOString(),
          mood: selectedMood || "Neutro"
        });
        localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

        alert("📝 Seu desabafo foi registrado. Estamos com você.");
      }
    });
  }

  // Respirar - Exercício de respiração interativo
  const respirarBtn = document.getElementById("respirar");
  if (respirarBtn) {
    respirarBtn.addEventListener("click", () => {
      // Exercício de respiração guiado
      if (confirm("🌬️ Quer fazer um exercício de respiração guiado? Clique OK para começar.")) {
        alert("🧘‍♀️ Vamos começar!\n\n1. Sente-se confortavelmente\n2. Feche os olhos\n3. Siga as instruções...");
        
        setTimeout(() => {
          alert("🌬️ INSPIRE lentamente por 4 segundos...\n\n(1... 2... 3... 4...)");
        }, 1000);
        
        setTimeout(() => {
          alert("💨 SEGURE a respiração por 4 segundos...\n\n(1... 2... 3... 4...)");
        }, 6000);
        
        setTimeout(() => {
          alert("🌊 EXPIRE lentamente por 6 segundos...\n\n(1... 2... 3... 4... 5... 6...)");
        }, 11000);
        
        setTimeout(() => {
          alert("✨ Muito bem! Repita mais 2 vezes se quiser.\n\nComo se sente agora? 😌");
        }, 18000);
      }
    });
  }

  // Música relaxante - Sugestões baseadas no humor
  const musicBtn = document.getElementById("musica");
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      const musicPorHumor = {
        "Triste": [
          "🎵 Max Richter - On The Nature of Daylight",
          "🎵 Ólafur Arnalds - Near Light",
          "🎵 Nils Frahm - Says"
        ],
        "Ansioso": [
          "🎵 Brian Eno - Ambient 1: Music for Airports",
          "🎵 Stars of the Lid - And Their Refinement",
          "🎵 Tim Hecker - Ravedeath"
        ],
        "Feliz": [
          "🎵 Bonobo - Kong",
          "🎵 Emancipator - Dusk to Dawn",
          "🎵 Tycho - Dive"
        ],
        "Calmo": [
          "🎵 Ludovico Einaudi - Nuvole Bianche",
          "🎵 Max Richter - Sleep",
          "🎵 Kiasmos - Blurred EP"
        ],
        "Geral": [
          "🎵 Ludovico Einaudi - Nuvole Bianche",
          "🎵 Max Richter - On The Nature of Daylight", 
          "🎵 Ólafur Arnalds - Near Light",
          "🎵 Kiasmos - Blurred EP",
          "🎵 Emancipator - Dusk to Dawn"
        ]
      };
      
      const musicasParaHumor = musicPorHumor[selectedMood] || musicPorHumor["Geral"];
      const randomMusic = musicasParaHumor[Math.floor(Math.random() * musicasParaHumor.length)];
      
      const mensagem = selectedMood 
        ? `🎧 Baseado no seu humor "${selectedMood}", recomendo:\n\n${randomMusic}\n\nQue tal ouvir agora? 🎶`
        : `🎧 Sugestão musical para relaxar:\n\n${randomMusic}\n\nPerfeita para este momento! 🎶`;
        
      alert(mensagem);
    });
  }

  // Frase motivacional
  const fraseBtn = document.getElementById("frase");
  if (fraseBtn) {
    fraseBtn.addEventListener("click", () => {
      const random = frases[Math.floor(Math.random() * frases.length)];
      alert(random);
    });
  }

  // Atividades
  const atividadesBtn = document.getElementById("atividades");
  const atividadesOverlay = document.getElementById("atividades-overlay");
  const closeAtividadesBtn = document.getElementById("close-atividades");

  if (atividadesBtn && atividadesOverlay) {
    atividadesBtn.addEventListener("click", () => {
      atividadesOverlay.style.display = "flex";
    });
  }

  if (closeAtividadesBtn && atividadesOverlay) {
    closeAtividadesBtn.addEventListener("click", () => {
      atividadesOverlay.style.display = "none";
    });
  }

  // Fechar overlay clicando fora
  if (atividadesOverlay) {
    atividadesOverlay.addEventListener("click", (e) => {
      if (e.target === atividadesOverlay) {
        atividadesOverlay.style.display = "none";
      }
    });
  }

  // Checkboxes das atividades
  const activityCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="atividade"]');
  activityCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        console.log(`Atividade ${this.id} marcada como concluída!`);
      }
    });
  });

  // Chat button
  const chatBtn = document.getElementById("chat");
  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      window.location.href = "chat.html";
    });
  }

  // Perfil button
  const perfilBtn = document.getElementById("perfil");
  if (perfilBtn) {
    perfilBtn.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  // Função para salvar humor diário
  function salvarHumorDiario(humor) {
    const hoje = new Date().toDateString();
    const humorData = JSON.parse(localStorage.getItem("humorDiario") || "{}");

    humorData[hoje] = {
      humor: humor,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("humorDiario", JSON.stringify(humorData));
  }

  // Análise emocional
  function atualizarAnaliseEmocional() {
    const analiseElement = document.getElementById("analise-emocional");
    if (!analiseElement) return;

    const humorData = JSON.parse(localStorage.getItem("humorDiario") || "{}");
    const entries = Object.values(humorData);

    if (entries.length === 0) {
      analiseElement.textContent = "Registre seus humores para ver análises personalizadas.";
      return;
    }

    // Análise simples dos últimos 7 dias
    const ultimosSete = entries.slice(-7);
    const humoresPositivos = ultimosSete.filter(entry =>
      ["Feliz", "Calmo", "Empolgado"].includes(entry.humor)
    ).length;

    const porcentagemPositiva = Math.round((humoresPositivos / ultimosSete.length) * 100);

    let analise = "";
    if (porcentagemPositiva >= 70) {
      analise = `🌟 Excelente! ${porcentagemPositiva}% dos seus últimos humores foram positivos. Continue assim!`;
    } else if (porcentagemPositiva >= 50) {
      analise = `🌤️ Você está indo bem! ${porcentagemPositiva}% dos seus humores foram positivos. Que tal uma atividade relaxante?`;
    } else {
      analise = `💙 Percebemos que você tem passado por momentos difíceis. Lembre-se: está tudo bem não estar bem. Considere conversar com alguém.`;
    }

    analiseElement.textContent = analise;
  }

  // Gráfico semanal
  function atualizarGraficoSemanal() {
    // Implementação simplificada
    console.log("Atualizando gráfico semanal...");
  }

  // Calendário mensal
  function atualizarCalendarioMensal() {
    // Implementação simplificada
    console.log("Atualizando calendário mensal...");
  }

  // Gráfico de categorias
  function atualizarGraficoCategorias() {
    // Implementação simplificada
    console.log("Atualizando gráfico de categorias...");
  }

  // === SEÇÃO MURAL DE APOIO ===
  const mensagem = document.getElementById("mensagem");
  const categoriaSelect = document.getElementById("categoria-post");
  const postar = document.getElementById("postar");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Postar no mural
  if (postar && mensagem) {
    postar.addEventListener("click", () => {
      const texto = mensagem.value.trim();
      if (texto.length > 0) {
        const posts = JSON.parse(localStorage.getItem("apoioPosts") || "[]");

        // Obter categoria selecionada
        const categoria = categoriaSelect ? categoriaSelect.value : "geral";

        // Criar novo post
        const novoPost = {
          texto: texto,
          categoria: categoria,
          data: new Date().toISOString()
        };

        posts.unshift(novoPost); // adiciona no início
        localStorage.setItem("apoioPosts", JSON.stringify(posts));
        mensagem.value = "";

        // Obter filtro atual
        const filtroAtual = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "todos";
        renderizarMural(filtroAtual);
      }
    });
  }

  // Filtrar posts por categoria
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Atualizar botões
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Renderizar posts filtrados
      renderizarMural(filter);
    });
  });

  function renderizarMural(filtro = "todos") {
    const mural = document.getElementById("mural-posts");
    if (!mural) return;

    const posts = JSON.parse(localStorage.getItem("apoioPosts") || "[]");
    const postsExibir = filtro === "todos"
      ? posts
      : posts.filter(post => post.categoria === filtro);

    if (postsExibir.length === 0) {
      const mensagemVazia = document.createElement("p");
      mensagemVazia.className = "mural-vazio";
      mensagemVazia.textContent = filtro === "todos"
        ? "Ainda não há posts. Seja o primeiro a compartilhar!"
        : "Ainda não há posts nesta categoria.";
      mural.innerHTML = "";
      mural.appendChild(mensagemVazia);
      return;
    }

    mural.innerHTML = "";
    postsExibir.forEach(post => {
      const postEl = document.createElement("div");
      postEl.className = "mural-post";

      const dataFormatada = new Date(post.data).toLocaleDateString('pt-BR');

      const categoriaEl = document.createElement("span");
      categoriaEl.className = "post-categoria";
      categoriaEl.textContent = post.categoria;

      const textoEl = document.createElement("p");
      textoEl.textContent = post.texto;

      const dataEl = document.createElement("div");
      dataEl.className = "post-data";
      dataEl.textContent = dataFormatada;

      postEl.appendChild(categoriaEl);
      postEl.appendChild(textoEl);
      postEl.appendChild(dataEl);

      mural.appendChild(postEl);
    });
  }

  // Conectar com comunidade
  const connectBtns = document.querySelectorAll(".connect-btn");

  connectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const nomeUsuario = btn.parentElement.querySelector("h3").textContent;
      alert(`Solicitação de conexão enviada para ${nomeUsuario}.`);
      btn.textContent = "Solicitado";
      btn.disabled = true;
      btn.style.background = "#aaa";
    });
  });

  // Alternância de tema
  const toggleTheme = document.getElementById("toggle-theme");

  // Aplicar tema salvo (se houver)
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleTheme) toggleTheme.textContent = "☀️";
  }

  // Alternar tema
  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleTheme.textContent = isDark ? "☀️" : "🌙";
    });
  }

  // Carregar mais pessoas na comunidade
  const carregarMaisBtn = document.getElementById("carregar-mais");
  const comunidadeCards = document.querySelector(".comunidade-cards");

  if (carregarMaisBtn && comunidadeCards) {
    carregarMaisBtn.addEventListener("click", () => {
      // Simular carregamento de mais pessoas
      const maisPessoas = [
        {
          img: "../img/user4.jpg",
          nome: "Ana C.",
          interesses: "Interesses: Arte Terapia, Leitura"
        },
        {
          img: "../img/user5.jpg",
          nome: "Pedro L.",
          interesses: "Interesses: Meditação, Yoga"
        },
        {
          img: "../img/user6.jpg",
          nome: "Rafael P.",
          interesses: "Interesses: Música, Relaxamento"
        }
      ];

      maisPessoas.forEach(pessoa => {
        const card = document.createElement("div");
        card.className = "comunidade-card";

        card.innerHTML = `
          <img src="${pessoa.img}" alt="Perfil" class="comunidade-img">
          <h3>${pessoa.nome}</h3>
          <p>${pessoa.interesses}</p>
          <button class="connect-btn">Conectar</button>
        `;

        // Adicionar evento aos novos botões
        const btn = card.querySelector(".connect-btn");
        btn.addEventListener("click", () => {
          alert(`Solicitação de conexão enviada para ${pessoa.nome}.`);
          btn.textContent = "Solicitado";
          btn.disabled = true;
          btn.style.background = "#aaa";
        });

        comunidadeCards.appendChild(card);
      });

      // Remover botão após carregar
      carregarMaisBtn.style.display = "none";
    });
  }

  // Inicializar interface
  renderizarMural();
  atualizarAnaliseEmocional();

  console.log("EmoConnect Main carregado com sucesso!");
});