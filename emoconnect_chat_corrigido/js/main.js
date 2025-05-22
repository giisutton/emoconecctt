document.addEventListener("DOMContentLoaded", () => {
    const moodButtons = document.querySelectorAll(".mood-card");
    const actionButtons = document.querySelectorAll(".action-card");
    const moodMessage = document.getElementById("mood-message");
  
    const frases = [
      "✨ Acredite em você, até quando ninguém mais acreditar.",
      "🌟 Você já é incrível só por tentar.",
      "☀️ Tudo vai passar, como sempre passa.",
      "💪 A sua força está nas pequenas vitórias.",
      "🌈 Sua jornada é única. Valorize-a."
    ];
  
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
    
    moodButtons.forEach(button => {
      button.addEventListener("click", () => {
        const mood = button.getAttribute("data-mood");
        const frase = moodFrases[mood] || "Sentimento registrado.";
    
        moodMessage.textContent = `Você está se sentindo: ${mood} — ${frase}`;
        moodMessage.style.opacity = 0;
        setTimeout(() => {
          moodMessage.style.opacity = 1;
        }, 100);
      });
    });
    
    actionButtons.forEach(button => {
      button.addEventListener("click", () => {
        if (button.id === "desabafar") {
          const text = prompt("Desabafe aqui. Escreva o que quiser:");
          if (text) {
            alert("📝 Seu desabafo foi registrado. Estamos com você.");
          }
        } else if (button.id === "relaxar") {
          alert("🎧 Curta essa música para acalmar a mente.");
          window.open("https://www.youtube.com/watch?v=pWjmpSD-ph0", "_blank");
        } else if (button.id === "motivar") {
          const random = frases[Math.floor(Math.random() * frases.length)];
          alert(random);
        }
      });
    });
  });
  

  const toggleTheme = document.getElementById("toggle-theme");

  // Aplicar tema salvo (se houver)
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleTheme.textContent = "☀️";
  }
  
  // Alternar tema com fade
  toggleTheme.addEventListener("click", () => {
    document.body.classList.add("fade-theme");
  
    const isDark = document.body.classList.toggle("dark-mode");
    toggleTheme.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  
    setTimeout(() => {
      document.body.classList.remove("fade-theme");
    }, 500);
  });
  


  // Mural de Apoio
const postar = document.getElementById("postar");
const mensagem = document.getElementById("mensagem");
const mural = document.getElementById("mural-posts");

function renderizarMural() {
  mural.innerHTML = "";
  const posts = JSON.parse(localStorage.getItem("apoioPosts")) || [];

  posts.forEach(texto => {
    const post = document.createElement("div");
    post.className = "mural-post";
    post.textContent = texto;
    mural.appendChild(post);
  });
}

postar.addEventListener("click", () => {
  const texto = mensagem.value.trim();
  if (texto.length > 0) {
    const posts = JSON.parse(localStorage.getItem("apoioPosts")) || [];
    posts.unshift(texto); // adiciona no início
    localStorage.setItem("apoioPosts", JSON.stringify(posts));
    mensagem.value = "";
    renderizarMural();
  }
});

renderizarMural(); // Carrega ao abrir a página



// Respiração guiada
const btnRespirar = document.getElementById("respirar");
const respirarTela = document.getElementById("respiracao");
const fecharRespirar = document.getElementById("fechar-respirar");
const faseTexto = document.getElementById("fase");

let fases = ["Inspire...", "Segure...", "Expire...", "Pause..."];
let faseAtual = 0;
let intervaloRespirar;

btnRespirar.addEventListener("click", () => {
  respirarTela.classList.add("active");
  faseAtual = 0;
  faseTexto.textContent = fases[faseAtual];
  intervaloRespirar = setInterval(() => {
    faseAtual = (faseAtual + 1) % fases.length;
    faseTexto.textContent = fases[faseAtual];
  }, 3000);
});

fecharRespirar.addEventListener("click", () => {
  respirarTela.classList.remove("active");
  clearInterval(intervaloRespirar);
});




// Diário Emocional
const emojiBtns = document.querySelectorAll(".emoji");
const feedbackDia = document.getElementById("feedback-dia");
const resumo = document.getElementById("resumo-semanal");

const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
let hoje = new Date();
let diaSemana = hoje.getDay(); // 0 a 6

let diario = JSON.parse(localStorage.getItem("diarioEmocional")) || {};

emojiBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const emoji = btn.getAttribute("data-emoji");
    diario[diaSemana] = emoji;
    localStorage.setItem("diarioEmocional", JSON.stringify(diario));
    feedbackDia.textContent = `Você registrou que hoje está se sentindo ${emoji}`;
    atualizarResumo();
  });
});

function atualizarResumo() {
  resumo.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const dia = dias[i];
    const emo = diario[i] || "⬜";
    const bloco = document.createElement("div");
    bloco.innerHTML = `<div>${dia}</div><div>${emo}</div>`;
    resumo.appendChild(bloco);
  }
}

atualizarResumo();
