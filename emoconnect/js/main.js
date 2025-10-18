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

  // Respirar - Exercício de respiração interativo com overlay
  const respirarBtn = document.getElementById("respirar");
  const respiracaoOverlay = document.getElementById("respiracao");
  const fecharRespirarBtn = document.getElementById("fechar-respirar");
  const circulo = document.getElementById("circulo");
  const fase = document.getElementById("fase");

  if (respirarBtn && respiracaoOverlay) {
    respirarBtn.addEventListener("click", () => {
      respiracaoOverlay.style.display = "flex";
      respiracaoOverlay.classList.add("active");
      iniciarExercicioRespiracao();
    });
  }

  if (fecharRespirarBtn && respiracaoOverlay) {
    fecharRespirarBtn.addEventListener("click", () => {
      respiracaoOverlay.style.display = "none";
      respiracaoOverlay.classList.remove("active");
    });
  }

  // Fechar overlay de respiração clicando fora
  if (respiracaoOverlay) {
    respiracaoOverlay.addEventListener("click", (e) => {
      if (e.target === respiracaoOverlay) {
        respiracaoOverlay.style.display = "none";
        respiracaoOverlay.classList.remove("active");
      }
    });
  }

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
        // Próximo ciclo
        if (ciclo < maxCiclos) {
          fazerCiclo();
        } else {
          if (fase) fase.textContent = "Exercício concluído! Como se sente? 😌";
        }
      }, 14000);
    }

    fazerCiclo();
  }

  // Relaxar - Música relaxante baseada no humor
  const relaxarBtn = document.getElementById("relaxar");
  if (relaxarBtn) {
    relaxarBtn.addEventListener("click", () => {
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
  const motivarBtn = document.getElementById("motivar");
  if (motivarBtn) {
    motivarBtn.addEventListener("click", () => {
      const random = frases[Math.floor(Math.random() * frases.length)];
      alert(random);
    });
  }

  // Atividades
  const atividadesBtn = document.getElementById("atividades");
  const atividadesOverlay = document.getElementById("atividades-overlay");
  const closeAtividadesBtn = document.getElementById("fechar-atividades");

  if (atividadesBtn && atividadesOverlay) {
    atividadesBtn.addEventListener("click", () => {
      atividadesOverlay.style.display = "flex";
      atividadesOverlay.classList.add("active");
    });
  }

  if (closeAtividadesBtn && atividadesOverlay) {
    closeAtividadesBtn.addEventListener("click", () => {
      atividadesOverlay.style.display = "none";
      atividadesOverlay.classList.remove("active");
    });
  }

  // Fechar overlay clicando fora
  if (atividadesOverlay) {
    atividadesOverlay.addEventListener("click", (e) => {
      if (e.target === atividadesOverlay) {
        atividadesOverlay.style.display = "none";
        atividadesOverlay.classList.remove("active");
      }
    });
  }

  // Checkboxes das atividades - salvar no localStorage
  const activityCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="atividade"]');

  // Carregar estado salvo
  activityCheckboxes.forEach(checkbox => {
    const saved = localStorage.getItem(checkbox.id);
    if (saved === "true") {
      checkbox.checked = true;
      checkbox.parentElement.style.opacity = "0.6";
      checkbox.parentElement.querySelector("label").style.textDecoration = "line-through";
    }

    checkbox.addEventListener('change', function () {
      localStorage.setItem(this.id, this.checked);

      if (this.checked) {
        this.parentElement.style.opacity = "0.6";
        this.parentElement.querySelector("label").style.textDecoration = "line-through";
        console.log(`Atividade ${this.id} marcada como concluída!`);
      } else {
        this.parentElement.style.opacity = "1";
        this.parentElement.querySelector("label").style.textDecoration = "none";
      }
    });
  });

  // Adicionar nova atividade
  const adicionarAtividadeBtn = document.getElementById("adicionar-atividade");
  if (adicionarAtividadeBtn) {
    adicionarAtividadeBtn.addEventListener("click", () => {
      const novaAtividade = prompt("Digite sua nova atividade:");
      if (novaAtividade && novaAtividade.trim()) {
        const atividadesLista = document.querySelector(".atividades-lista");
        if (atividadesLista) {
          const newId = `atividade-custom-${Date.now()}`;
          const novoItem = document.createElement("div");
          novoItem.className = "atividade-item";
          novoItem.innerHTML = `
            <input type="checkbox" id="${newId}">
            <label for="${newId}">${novaAtividade.trim()}</label>
          `;
          atividadesLista.appendChild(novoItem);

          // Adicionar evento ao novo checkbox
          const newCheckbox = novoItem.querySelector("input");
          newCheckbox.addEventListener("change", function () {
            localStorage.setItem(this.id, this.checked);
            if (this.checked) {
              this.parentElement.style.opacity = "0.6";
              this.parentElement.querySelector("label").style.textDecoration = "line-through";
            } else {
              this.parentElement.style.opacity = "1";
              this.parentElement.querySelector("label").style.textDecoration = "none";
            }
          });

          // Salvar atividade customizada
          const customAtividades = JSON.parse(localStorage.getItem("customAtividades") || "[]");
          customAtividades.push({ id: newId, text: novaAtividade.trim() });
          localStorage.setItem("customAtividades", JSON.stringify(customAtividades));
        }
      }
    });
  }

  // Carregar atividades customizadas salvas
  const customAtividades = JSON.parse(localStorage.getItem("customAtividades") || "[]");
  const atividadesLista = document.querySelector(".atividades-lista");
  if (atividadesLista && customAtividades.length > 0) {
    customAtividades.forEach(ativ => {
      const novoItem = document.createElement("div");
      novoItem.className = "atividade-item";
      novoItem.innerHTML = `
        <input type="checkbox" id="${ativ.id}">
        <label for="${ativ.id}">${ativ.text}</label>
      `;
      atividadesLista.appendChild(novoItem);

      const checkbox = novoItem.querySelector("input");
      const saved = localStorage.getItem(ativ.id);
      if (saved === "true") {
        checkbox.checked = true;
        novoItem.style.opacity = "0.6";
        novoItem.querySelector("label").style.textDecoration = "line-through";
      }

      checkbox.addEventListener("change", function () {
        localStorage.setItem(this.id, this.checked);
        if (this.checked) {
          this.parentElement.style.opacity = "0.6";
          this.parentElement.querySelector("label").style.textDecoration = "line-through";
        } else {
          this.parentElement.style.opacity = "1";
          this.parentElement.querySelector("label").style.textDecoration = "none";
        }
      });
    });
  }

  // Ver Progresso - Scroll suave até a seção
  const progressoBtn = document.getElementById("progresso");
  if (progressoBtn) {
    progressoBtn.addEventListener("click", () => {
      const secaoProgresso = document.getElementById("secao-progresso");
      if (secaoProgresso) {
        secaoProgresso.scrollIntoView({ behavior: "smooth", block: "start" });

        // Destacar a seção por 2 segundos
        secaoProgresso.style.boxShadow = "0 0 30px rgba(106, 90, 205, 0.5)";
        secaoProgresso.style.transition = "box-shadow 0.3s";

        setTimeout(() => {
          secaoProgresso.style.boxShadow = "";
        }, 2000);
      }
    });
  }

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
    const chartContainer = document.getElementById("chart-semanal");
    if (!chartContainer) return;

    const humorData = JSON.parse(localStorage.getItem("humorDiario") || "{}");
    const hoje = new Date();
    const ultimos7Dias = [];

    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const dataString = data.toDateString();
      const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' });

      const humor = humorData[dataString];
      const intensidade = humor ? obterIntensidadeHumor(humor.humor) : 0;

      ultimos7Dias.push({
        dia: diaSemana,
        valor: intensidade,
        humor: humor ? humor.humor : "Sem registro"
      });
    }

    chartContainer.innerHTML = "";
    ultimos7Dias.forEach(dia => {
      const barra = document.createElement("div");
      barra.className = "chart-bar";
      barra.style.height = `${dia.valor * 10}%`;
      barra.style.backgroundColor = obterCorHumor(dia.humor);
      barra.setAttribute("data-value", dia.valor);
      barra.setAttribute("data-day", dia.dia);
      barra.title = `${dia.dia}: ${dia.humor}`;
      chartContainer.appendChild(barra);
    });
  }

  function obterIntensidadeHumor(humor) {
    const intensidades = {
      "Feliz": 9,
      "Empolgado": 10,
      "Calmo": 8,
      "Confuso": 5,
      "Cansado": 4,
      "Triste": 3,
      "Ansioso": 4,
      "Estressado": 3
    };
    return intensidades[humor] || 5;
  }

  function obterCorHumor(humor) {
    const cores = {
      "Feliz": "#FFD700",
      "Empolgado": "#FF6B6B",
      "Calmo": "#4ECDC4",
      "Confuso": "#95A5A6",
      "Cansado": "#BDC3C7",
      "Triste": "#3498DB",
      "Ansioso": "#E74C3C",
      "Estressado": "#E67E22",
      "Sem registro": "#ECF0F1"
    };
    return cores[humor] || "#6a5acd";
  }

  // Calendário mensal
  function atualizarCalendarioMensal() {
    const calendarContainer = document.getElementById("calendar-mensal");
    if (!calendarContainer) return;

    const humorData = JSON.parse(localStorage.getItem("humorDiario") || "{}");
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    calendarContainer.innerHTML = "";

    // Adicionar dias da semana
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    diasSemana.forEach(dia => {
      const header = document.createElement("div");
      header.style.fontWeight = "bold";
      header.style.textAlign = "center";
      header.textContent = dia;
      calendarContainer.appendChild(header);
    });

    // Adicionar espaços vazios antes do primeiro dia
    for (let i = 0; i < primeiroDiaMes.getDay(); i++) {
      const empty = document.createElement("div");
      calendarContainer.appendChild(empty);
    }

    // Adicionar dias do mês
    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
      const dataString = data.toDateString();
      const humor = humorData[dataString];

      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      dayDiv.textContent = dia;

      if (humor) {
        dayDiv.style.backgroundColor = obterCorHumor(humor.humor);
        dayDiv.title = humor.humor;

        const emoji = document.createElement("span");
        emoji.className = "mood-emoji";
        emoji.textContent = obterEmojiHumor(humor.humor);
        dayDiv.appendChild(emoji);
      }

      if (data.toDateString() === hoje.toDateString()) {
        dayDiv.style.border = "2px solid #6a5acd";
        dayDiv.style.fontWeight = "bold";
      }

      calendarContainer.appendChild(dayDiv);
    }
  }

  function obterEmojiHumor(humor) {
    const emojis = {
      "Feliz": "😊",
      "Triste": "😢",
      "Cansado": "😴",
      "Estressado": "😤",
      "Ansioso": "😬",
      "Calmo": "🧘",
      "Empolgado": "😄",
      "Confuso": "🤔"
    };
    return emojis[humor] || "😐";
  }

  // Gráfico de categorias
  function atualizarGraficoCategorias() {
    const pieContainer = document.getElementById("pie-categorias");
    if (!pieContainer) return;

    const humorData = JSON.parse(localStorage.getItem("humorDiario") || "{}");
    const contagem = {};

    Object.values(humorData).forEach(entry => {
      contagem[entry.humor] = (contagem[entry.humor] || 0) + 1;
    });

    pieContainer.innerHTML = "";

    if (Object.keys(contagem).length === 0) {
      pieContainer.innerHTML = "<p style='text-align: center; color: #666;'>Registre seus humores para ver a distribuição</p>";
      return;
    }

    const total = Object.values(contagem).reduce((a, b) => a + b, 0);

    // Criar legenda
    const legendDiv = document.createElement("div");
    legendDiv.className = "pie-legend";
    legendDiv.style.marginTop = "20px";

    Object.entries(contagem).sort((a, b) => b[1] - a[1]).forEach(([humor, count]) => {
      const percentage = ((count / total) * 100).toFixed(1);
      const item = document.createElement("div");
      item.className = "legend-item";
      item.innerHTML = `
        <div class="legend-color" style="background: ${obterCorHumor(humor)};"></div>
        <span>${humor}: ${count} vezes (${percentage}%)</span>
      `;
      legendDiv.appendChild(item);
    });

    pieContainer.appendChild(legendDiv);
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

  // Mais dicas de bem-estar
  const maisDicasBtn = document.getElementById("mais-dicas");
  if (maisDicasBtn) {
    maisDicasBtn.addEventListener("click", () => {
      const dicasContainer = document.getElementById("dicas-container");
      if (!dicasContainer) return;

      const dicasExtras = [
        {
          icon: "fa-heart",
          titulo: "Gratidão",
          texto: "Anote 3 coisas pelas quais você é grato todos os dias."
        },
        {
          icon: "fa-sun",
          titulo: "Luz Solar",
          texto: "Exponha-se ao sol por 15 minutos diariamente para vitamina D."
        },
        {
          icon: "fa-users",
          titulo: "Conexão Social",
          texto: "Mantenha contato com amigos e família regularmente."
        },
        {
          icon: "fa-brain",
          titulo: "Aprendizado",
          texto: "Dedique tempo para aprender algo novo todos os dias."
        }
      ];

      dicasExtras.forEach(dica => {
        const dicaCard = document.createElement("div");
        dicaCard.className = "dica-card";
        dicaCard.style.animation = "fadeIn 0.5s";
        dicaCard.innerHTML = `
          <div class="dica-icon"><i class="fas ${dica.icon}"></i></div>
          <h3>${dica.titulo}</h3>
          <p>${dica.texto}</p>
        `;
        dicasContainer.appendChild(dicaCard);
      });

      maisDicasBtn.style.display = "none";
    });
  }

  // Carregar mais pessoas na comunidade
  const carregarMaisBtn = document.getElementById("ver-mais-pessoas");
  const comunidadeCards = document.querySelector(".comunidade-cards");

  if (carregarMaisBtn && comunidadeCards) {
    carregarMaisBtn.addEventListener("click", () => {
      // Simular carregamento de mais pessoas
      const maisPessoas = [
        {
          img: "https://ui-avatars.com/api/?name=Ana+C&background=10b981&color=fff&size=200&bold=true",
          nome: "Ana C.",
          interesses: "Interesses: Culinária, Jardinagem"
        },
        {
          img: "https://ui-avatars.com/api/?name=Pedro+L&background=f59e0b&color=fff&size=200&bold=true",
          nome: "Pedro L.",
          interesses: "Interesses: Esportes, Tecnologia"
        },
        {
          img: "https://ui-avatars.com/api/?name=Rafael+P&background=ef4444&color=fff&size=200&bold=true",
          nome: "Rafael P.",
          interesses: "Interesses: Arte, Jogos"
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

  // Sistema de Tabs para Progresso Emocional
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      // Remover active de todos
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Adicionar active ao clicado
      btn.classList.add("active");
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // Atualizar gráfico correspondente
      if (targetTab === "semanal") {
        atualizarGraficoSemanal();
      } else if (targetTab === "mensal") {
        atualizarCalendarioMensal();
      } else if (targetTab === "categorias") {
        atualizarGraficoCategorias();
      }
    });
  });

  // Inicializar interface
  renderizarMural();
  atualizarAnaliseEmocional();

  // Inicializar gráficos se a seção existir
  if (document.getElementById("chart-semanal")) {
    atualizarGraficoSemanal();
  }

  console.log("EmoConnect Main carregado com sucesso!");
});