import { logger, analytics } from './config.js';
import errorHandler from './error-handler.js';

document.addEventListener("DOMContentLoaded", () => {
  // Exibir data atual e nome do usuário
  const currentDate = document.getElementById("current-date");
  const userName = document.getElementById("user-name");

  const hoje = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = hoje.toLocaleDateString('pt-BR', options);

  // Obter nome do usuário do localStorage (perfil)
  userName.textContent = localStorage.getItem("userName") || "Amigo";

  // Seleção de humor
  const moodButtons = document.querySelectorAll(".mood-card");
  const moodMessage = document.getElementById("mood-message");

  const moodFrases = {
    "Feliz": "Continue espalhando essa luz! ☀️",
    "Triste": "Tudo bem não estar bem. Estamos com você. 💙",
    "Cansado": "Descanse um pouco. Você merece. 😴",
    "Estressado": "Respire fundo. Vai passar. 😌",
    "Ansioso": "Tente focar no agora. Um passo de cada vez. 🌿",
    "Calmo": "Aproveite essa paz interior. 🧘‍♀️",
    "Empolgado": "Use essa energia para algo que você ama! 🎉",
    "Confuso": "Respire, organize os pensamentos, e siga. 🔍"
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

      moodMessage.textContent = `Você está se sentindo: ${mood} — ${frase}`;
      moodMessage.style.opacity = 0;
      setTimeout(() => {
        moodMessage.style.opacity = 1;
      }, 100);

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
  document.getElementById("desabafar").addEventListener("click", () => {
    const text = prompt("Desabafe aqui. Escreva o que quiser:");
    if (text) {
      // Save journal entry
      const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      journalEntries.push({
        text: texto,
        date: new Date().toISOString(),
        mood: selectedMood
      });
      localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

      textArea.value = "";
      errorHandler.showUserMessage("📝 Seu desabafo foi registrado. Estamos com você.", 'success');
      analytics.track('journal_entry_saved', { mood: selectedMood });

      // Opcional: Salvar desabafo
      const desabafos = JSON.parse(localStorage.getItem("desabafos") || "[]");
      desabafos.push({
        texto: text,
        data: new Date().toISOString(),
        humor: selectedMood
      });
      localStorage.setItem("desabafos", JSON.stringify(desabafos));
    }
  });

  document.getElementById("relaxar").addEventListener("click", () => {
    alert("🎧 Curta essa música para acalmar a mente.");
    window.open("https://www.youtube.com/watch?v=pWjmpSD-ph0", "_blank");
  });

  document.getElementById("motivar").addEventListener("click", () => {
    const random = frases[Math.floor(Math.random() * frases.length)];
    alert(random);
  });

  // Respiração guiada
  const btnRespirar = document.getElementById("respirar");
  const respirarTela = document.getElementById("respiracao");
  const fecharRespirar = document.getElementById("fechar-respirar");
  const faseTexto = document.getElementById("fase");

  let fases = ["Inspire profundamente...", "Segure o ar...", "Expire lentamente...", "Pausa..."];
  let faseAtual = 0;
  let intervaloRespirar;

  btnRespirar.addEventListener("click", () => {
    respirarTela.classList.add("active");
    faseAtual = 0;
    faseTexto.textContent = fases[faseAtual];
    intervaloRespirar = setInterval(() => {
      faseAtual = (faseAtual + 1) % fases.length;
      faseTexto.textContent = fases[faseAtual];
    }, 4000); // 4 segundos para cada fase
  });

  fecharRespirar.addEventListener("click", () => {
    respirarTela.classList.remove("active");
    clearInterval(intervaloRespirar);
  });

  // Atividades de bem-estar
  const btnAtividades = document.getElementById("atividades");
  const atividadesOverlay = document.getElementById("atividades-overlay");
  const fecharAtividades = document.getElementById("fechar-atividades");
  const adicionarAtividade = document.getElementById("adicionar-atividade");

  btnAtividades.addEventListener("click", () => {
    atividadesOverlay.classList.add("active");
    carregarAtividades();
  });

  fecharAtividades.addEventListener("click", () => {
    atividadesOverlay.classList.remove("active");
    salvarAtividades();
  });

  adicionarAtividade.addEventListener("click", () => {
    const novaAtividade = prompt("Descreva a nova atividade:");
    if (novaAtividade && novaAtividade.trim()) {
      adicionarNovaAtividade(novaAtividade);
    }
  });

  function adicionarNovaAtividade(texto) {
    const lista = document.querySelector(".atividades-lista");
    const id = `atividade${Date.now()}`;

    const item = document.createElement("div");
    item.className = "atividade-item";
    item.innerHTML = `
      <input type="checkbox" id="${id}">
      <label for="${id}">${texto}</label>
    `;

    lista.appendChild(item);
  }

  function carregarAtividades() {
    const atividadesSalvas = JSON.parse(localStorage.getItem("atividades") || "[]");
    const checkboxes = document.querySelectorAll(".atividade-item input[type='checkbox']");

    // Restaurar estado das checkboxes padrão
    checkboxes.forEach((checkbox, index) => {
      if (atividadesSalvas[index] !== undefined) {
        checkbox.checked = atividadesSalvas[index].concluida;
      }
    });

    // Adicionar atividades personalizadas
    const atividadesPersonalizadas = JSON.parse(localStorage.getItem("atividadesPersonalizadas") || "[]");
    atividadesPersonalizadas.forEach(atividade => {
      adicionarNovaAtividade(atividade.texto);

      // Atualizar último checkbox adicionado
      const ultimoCheckbox = document.querySelector(".atividades-lista .atividade-item:last-child input");
      ultimoCheckbox.checked = atividade.concluida;
    });
  }

  function salvarAtividades() {
    const checkboxesPadrao = Array.from(document.querySelectorAll(".atividades-lista .atividade-item:nth-child(-n+5) input"));
    const atividadesPadrao = checkboxesPadrao.map(checkbox => ({
      concluida: checkbox.checked
    }));

    const checkboxesPersonalizadas = Array.from(document.querySelectorAll(".atividades-lista .atividade-item:nth-child(n+6) input"));
    const atividadesPersonalizadas = checkboxesPersonalizadas.map(checkbox => ({
      texto: checkbox.nextElementSibling.textContent,
      concluida: checkbox.checked
    }));

    localStorage.setItem("atividades", JSON.stringify(atividadesPadrao));
    localStorage.setItem("atividadesPersonalizadas", JSON.stringify(atividadesPersonalizadas));
  }

  // Progresso emocional
  const btnProgresso = document.getElementById("progresso");
  const secaoProgresso = document.getElementById("secao-progresso");

  btnProgresso.addEventListener("click", () => {
    secaoProgresso.scrollIntoView({ behavior: "smooth" });

    // Inicializar gráficos se ainda não foram
    if (!document.querySelector("#chart-semanal .chart-bar")) {
      atualizarGraficoSemanal();
    }
    if (!document.querySelector("#calendar-mensal .calendar-day")) {
      atualizarCalendarioMensal();
    }
    if (!document.querySelector("#pie-categorias .pie-chart")) {
      atualizarGraficoCategorias();
    }
  });

  // Alternar entre abas de progresso
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      // Remover classe ativa de todos
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Adicionar classe ativa ao selecionado
      btn.classList.add("active");
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });

  // Função para salvar humor diário
  function salvarHumorDiario(humor) {
    const hoje = new Date();
    const dataString = hoje.toISOString().split('T')[0]; // YYYY-MM-DD

    // Obter registros existentes ou criar novo objeto
    const historico = JSON.parse(localStorage.getItem("historicoHumor") || "{}");

    // Adicionar/atualizar registro para hoje
    historico[dataString] = humor;

    // Salvar no localStorage
    localStorage.setItem("historicoHumor", JSON.stringify(historico));
  }

  // Atualizar gráfico semanal
  function atualizarGraficoSemanal() {
    const chartContainer = document.getElementById("chart-semanal");
    chartContainer.innerHTML = "";

    const historico = JSON.parse(localStorage.getItem("historicoHumor") || "{}");
    const hoje = new Date();

    // Valores numéricos para cada humor
    const humorValores = {
      "Feliz": 10,
      "Empolgado": 9,
      "Calmo": 8,
      "Confuso": 6,
      "Cansado": 5,
      "Ansioso": 4,
      "Estressado": 3,
      "Triste": 2
    };

    // Dias da semana
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // Criar barras para os últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      const dataString = data.toISOString().split('T')[0];
      const humor = historico[dataString] || null;
      const valor = humor ? humorValores[humor] : 0;

      const barra = document.createElement("div");
      barra.className = "chart-bar";

      // Definir altura relativa
      const altura = valor ? (valor / 10) * 100 : 10; // 10% de altura mínima
      barra.style.height = `${altura}%`;

      // Definir cor com base no valor
      if (valor >= 8) {
        barra.style.background = "#6a5acd"; // Positivo
      } else if (valor >= 5) {
        barra.style.background = "#9370db"; // Neutro
      } else if (valor > 0) {
        barra.style.background = "#dda0dd"; // Negativo
      } else {
        barra.style.background = "#e6e6fa"; // Sem registro
      }

      // Adicionar rótulos
      barra.setAttribute("data-day", diasSemana[data.getDay()]);
      barra.setAttribute("data-value", humor || "Sem registro");

      chartContainer.appendChild(barra);
    }
  }

  // Atualizar calendário mensal
  function atualizarCalendarioMensal() {
    const calendarContainer = document.getElementById("calendar-mensal");
    calendarContainer.innerHTML = "";

    const historico = JSON.parse(localStorage.getItem("historicoHumor") || "{}");
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    // Primeiro dia do mês
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);

    // Emoji para cada humor
    const humorEmojis = {
      "Feliz": "😊",
      "Empolgado": "😄",
      "Calmo": "🧘",
      "Confuso": "🤔",
      "Cansado": "😴",
      "Ansioso": "😬",
      "Estressado": "😤",
      "Triste": "😢"
    };

    // Adicionar espaços vazios para dias anteriores ao primeiro dia do mês
    const diaSemanaInicial = primeiroDia.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    for (let i = 0; i < diaSemanaInicial; i++) {
      const diaVazio = document.createElement("div");
      diaVazio.className = "calendar-day empty";
      calendarContainer.appendChild(diaVazio);
    }

    // Adicionar dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const diaEl = document.createElement("div");
      diaEl.className = "calendar-day";
      diaEl.textContent = dia;

      // Verificar se existe registro para este dia
      const dataString = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const humor = historico[dataString];

      if (humor) {
        const emoji = document.createElement("span");
        emoji.className = "mood-emoji";
        emoji.textContent = humorEmojis[humor] || "❓";
        diaEl.appendChild(emoji);

        // Adicionar título ao passar o mouse
        diaEl.title = `Humor: ${humor}`;
      }

      // Destacar o dia atual
      if (dia === hoje.getDate() && mesAtual === hoje.getMonth()) {
        diaEl.style.border = "2px solid #6a5acd";
        diaEl.style.fontWeight = "bold";
      }

      calendarContainer.appendChild(diaEl);
    }
  }

  // Atualizar gráfico de categorias (pizza)
  function atualizarGraficoCategorias() {
    const pieContainer = document.getElementById("pie-categorias");
    pieContainer.innerHTML = "";

    const historico = JSON.parse(localStorage.getItem("historicoHumor") || "{}");

    // Contar ocorrências de cada humor
    const contagem = {
      "Positivo": 0, // Feliz, Empolgado, Calmo
      "Neutro": 0,   // Confuso
      "Negativo": 0, // Cansado, Ansioso, Estressado, Triste
      "Sem registro": 0
    };

    // Classificar humores
    const positivos = ["Feliz", "Empolgado", "Calmo"];
    const neutros = ["Confuso"];
    const negativos = ["Cansado", "Ansioso", "Estressado", "Triste"];

    // Contar últimos 30 dias
    const hoje = new Date();
    for (let i = 0; i < 30; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      const dataString = data.toISOString().split('T')[0];
      const humor = historico[dataString];

      if (!humor) {
        contagem["Sem registro"]++;
      } else if (positivos.includes(humor)) {
        contagem["Positivo"]++;
      } else if (neutros.includes(humor)) {
        contagem["Neutro"]++;
      } else if (negativos.includes(humor)) {
        contagem["Negativo"]++;
      }
    }

    // Calcular porcentagens
    const total = Object.values(contagem).reduce((sum, val) => sum + val, 0);
    const porcentagens = {};

    for (const [categoria, valor] of Object.entries(contagem)) {
      porcentagens[categoria] = total > 0 ? Math.round((valor / total) * 100) : 0;
    }

    // Criar gráfico de pizza
    const pieWrapper = document.createElement("div");
    pieWrapper.className = "pie-wrapper";

    const pieChart = document.createElement("div");
    pieChart.className = "pie-chart";

    // Definir gradiente cónico com base nas porcentagens
    let start = 0;
    let gradientString = "";

    const cores = {
      "Positivo": "#6a5acd",
      "Neutro": "#9370db",
      "Negativo": "#dda0dd",
      "Sem registro": "#e6e6fa"
    };

    for (const [categoria, porcentagem] of Object.entries(porcentagens)) {
      const end = start + porcentagem;
      if (porcentagem > 0) {
        gradientString += `${cores[categoria]} ${start}% ${end}%, `;
      }
      start = end;
    }

    // Remover vírgula e espaço finais
    gradientString = gradientString.slice(0, -2);

    // Aplicar gradiente
    pieChart.style.background = `conic-gradient(${gradientString})`;

    // Criar legenda
    const legenda = document.createElement("div");
    legenda.className = "pie-legend";

    for (const [categoria, porcentagem] of Object.entries(porcentagens)) {
      if (porcentagem > 0) {
        const item = document.createElement("div");
        item.className = "legend-item";

        const cor = document.createElement("div");
        cor.className = "legend-color";
        cor.style.backgroundColor = cores[categoria];

        const texto = document.createElement("span");
        texto.textContent = `${categoria}: ${porcentagem}%`;

        item.appendChild(cor);
        item.appendChild(texto);
        legenda.appendChild(item);
      }
    }

    pieWrapper.appendChild(pieChart);
    pieContainer.appendChild(pieWrapper);
    pieContainer.appendChild(legenda);
  }

  // Análise emocional
  function atualizarAnaliseEmocional() {
    const analiseEl = document.getElementById("analise-emocional");
    const historico = JSON.parse(localStorage.getItem("historicoHumor") || "{}");

    // Contar humores dos últimos 7 dias
    const hoje = new Date();
    const ultimosSete = [];

    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      const dataString = data.toISOString().split('T')[0];
      const humor = historico[dataString];

      if (humor) {
        ultimosSete.push(humor);
      }
    }

    // Classificar humores
    const positivos = ["Feliz", "Empolgado", "Calmo"];
    const neutros = ["Confuso"];
    const negativos = ["Cansado", "Ansioso", "Estressado", "Triste"];

    let contPositivos = 0;
    let contNegativos = 0;
    let humorMaisFrequente = "";
    let maxFrequencia = 0;

    // Contar ocorrências
    const contagem = {};

    ultimosSete.forEach(humor => {
      if (positivos.includes(humor)) contPositivos++;
      if (negativos.includes(humor)) contNegativos++;

      contagem[humor] = (contagem[humor] || 0) + 1;

      if (contagem[humor] > maxFrequencia) {
        maxFrequencia = contagem[humor];
        humorMaisFrequente = humor;
      }
    });

    // Verificar presença de registros
    if (ultimosSete.length === 0) {
      analiseEl.textContent = "Você ainda não tem registros de humor suficientes para uma análise. Continue registrando seu humor diariamente para receber insights.";
      return;
    }

    // Gerar análise
    let analise = "";

    if (contPositivos > contNegativos && contPositivos >= 3) {
      analise = "Seus registros mostram uma tendência positiva de humor. Continue com as atividades que têm te feito bem!";
    } else if (contNegativos > contPositivos && contNegativos >= 3) {
      analise = "Você tem registrado mais emoções desafiadoras recentemente. Tente incluir mais atividades que te trazem alegria.";
    } else {
      analise = "Seu humor tem variado ao longo da semana, com equilíbrio entre momentos positivos e desafiadores.";
    }

    if (humorMaisFrequente && maxFrequencia >= 2) {
      analise += ` O sentimento mais frequente foi "${humorMaisFrequente}".`;
    }

    // Adicionar recomendação
    let recomendacao = "";

    if (contNegativos >= 3) {
      if (["Ansioso", "Estressado"].includes(humorMaisFrequente)) {
        recomendacao = " Recomendamos praticar exercícios de respiração e considerar reduzir a carga de compromissos.";
      } else if (["Triste", "Cansado"].includes(humorMaisFrequente)) {
        recomendacao = " Sugerimos aumentar o tempo de descanso e buscar atividades que tragam alegria.";
      }
    }

    analiseEl.textContent = analise + recomendacao;
  }

  // Mural de Apoio
  const postar = document.getElementById("postar");
  const mensagem = document.getElementById("mensagem");
  const mural = document.getElementById("mural-posts");
  const categoriaSelect = document.getElementById("categoria-post");
  const filterBtns = document.querySelectorAll(".filter-btn");

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
    mural.innerHTML = "";
    const posts = JSON.parse(localStorage.getItem("apoioPosts") || "[]");

    // Filtrar por categoria se necessário
    const postsExibir = filtro === "todos"
      ? posts
      : posts.filter(post => post.categoria === filtro);

    if (postsExibir.length === 0) {
      const mensagemVazia = document.createElement("p");
      mensagemVazia.className = "empty-message";
      mensagemVazia.textContent = filtro === "todos"
        ? "Nenhuma mensagem no mural ainda. Seja o primeiro a compartilhar!"
        : "Nenhuma mensagem nesta categoria. Que tal compartilhar uma?";
      mural.appendChild(mensagemVazia);
      return;
    }

    postsExibir.forEach(post => {
      const postEl = document.createElement("div");
      postEl.className = "mural-post";

      const categoriaEl = document.createElement("span");
      categoriaEl.className = "post-category";
      categoriaEl.textContent = post.categoria === "geral" ? "Geral" :
        post.categoria === "motivacao" ? "Motivação" :
          post.categoria === "gratidao" ? "Gratidão" : "Superação";

      const textoEl = document.createElement("p");
      textoEl.textContent = post.texto;

      const dataEl = document.createElement("span");
      dataEl.className = "post-date";

      // Formatar data
      let dataFormatada;
      try {
        const data = new Date(post.data);
        dataFormatada = data.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        dataFormatada = "Data desconhecida";
      }

      dataEl.textContent = dataFormatada;

      postEl.appendChild(categoriaEl);
      postEl.appendChild(textoEl);
      postEl.appendChild(dataEl);

      mural.appendChild(postEl);
    });
  }

  postar.addEventListener("click", () => {
    const texto = mensagem.value.trim();
    if (texto.length > 0) {
      const posts = JSON.parse(localStorage.getItem("apoioPosts") || "[]");

      // Obter categoria selecionada
      const categoria = categoriaSelect.value;

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
      const filtroAtual = document.querySelector(".filter-btn.active").getAttribute("data-filter");
      renderizarMural(filtroAtual);
    }
  });

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
    toggleTheme.textContent = "☀️";
  }

  // Alternar tema
  toggleTheme.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    toggleTheme.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Inicializar mural
  renderizarMural();

  // Inicializar o progresso emocional se está na visualização
  if (document.querySelector(".progresso-emocional")) {
    atualizarAnaliseEmocional();
  }

  // Dicas de bem-estar - ver mais
  const maisDicasBtn = document.getElementById("mais-dicas");

  if (maisDicasBtn) {
    maisDicasBtn.addEventListener("click", () => {
      const dicasContainer = document.getElementById("dicas-container");

      // Adicionar mais dicas se o botão for clicado
      const novasDicas = [
        {
          icone: "fas fa-utensils",
          titulo: "Alimentação",
          texto: "Alimentos ricos em ômega-3 e antioxidantes ajudam a reduzir a ansiedade."
        },
        {
          icone: "fas fa-mobile-alt",
          titulo: "Desconexão",
          texto: "Ficar 30 minutos sem telas antes de dormir melhora a qualidade do sono."
        },
        {
          icone: "fas fa-hand-holding-heart",
          titulo: "Gratidão",
          texto: "Listar 3 coisas positivas por dia aumenta o bem-estar emocional."
        },
        {
          icone: "fas fa-laugh",
          titulo: "Humor",
          texto: "Rir por 10 minutos pode melhorar a circulação tanto quanto 30 minutos de exercício."
        }
      ];

      novasDicas.forEach(dica => {
        const dicaCard = document.createElement("div");
        dicaCard.className = "dica-card";

        dicaCard.innerHTML = `
          <div class="dica-icon"><i class="${dica.icone}"></i></div>
          <h3>${dica.titulo}</h3>
          <p>${dica.texto}</p>
        `;

        dicasContainer.appendChild(dicaCard);
      });

      // Remover botão após mostrar todas as dicas
      maisDicasBtn.style.display = "none";
    });
  }

  // Ver mais pessoas
  const verMaisPessoasBtn = document.getElementById("ver-mais-pessoas");

  if (verMaisPessoasBtn) {
    verMaisPessoasBtn.addEventListener("click", () => {
      const container = document.querySelector(".comunidade-cards");

      // Adicionar mais pessoas
      const maisPessoas = [
        {
          img: "../img/user4.jpg",
          nome: "Carlos M.",
          interesses: "Interesses: Nutrição, Leitura"
        },
        {
          img: "../img/user5.jpg",
          nome: "Lúcia T.",
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

        container.appendChild(card);
      });

      // Remover botão após mostrar todas as pessoas
      verMaisPessoasBtn.style.display = "none";
    });
  }
});
