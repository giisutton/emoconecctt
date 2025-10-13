document.addEventListener("DOMContentLoaded", () => {
  const profileImg = document.getElementById("profile-img");
  const nameField = document.getElementById("profile-name");
  const bioField = document.getElementById("profile-bio");
  const idadeField = document.getElementById("idade");
  const localizacaoField = document.getElementById("localizacao");
  const interessesField = document.getElementById("interesses");
  const toggleThemeBtn = document.getElementById("toggle-theme");

  const editBtn = document.getElementById("edit-profile-btn");
  const modal = document.getElementById("edit-modal");
  const cancelEdit = document.getElementById("cancel-edit");
  const saveProfile = document.getElementById("save-profile");

  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const postForm = document.getElementById("post-form");
  const postList = document.getElementById("post-list");
  const newPost = document.getElementById("new-post");
  const searchInput = document.getElementById("search-posts");
  const postCount = document.getElementById("post-count");
  const postProgress = document.getElementById("post-progress");
  const themeSelect = document.getElementById("background-theme");
  const togglePublic = document.getElementById("toggle-public-view");
  const datetime = document.getElementById("datetime");

  // Atualiza data e hora
  const now = new Date();
  datetime.textContent = now.toLocaleString();

  // Troca de abas
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.tab;
      tabContents.forEach(tc => {
        tc.classList.remove("active");
        if (tc.id === "tab-" + target) {
          tc.classList.add("active");
        }
      });
    });
  });

  // Abrir modal
  editBtn.onclick = () => {
    document.getElementById("edit-name").value = nameField.textContent;
    document.getElementById("edit-bio").value = bioField.textContent;
    document.getElementById("edit-age").value = idadeField.textContent;
    document.getElementById("edit-location").value = localizacaoField.textContent;
    document.getElementById("edit-interests").value = interessesField.textContent;
    modal.style.display = "flex";
  };

  cancelEdit.onclick = () => {
    modal.style.display = "none";
  };

  saveProfile.onclick = () => {
    nameField.textContent = document.getElementById("edit-name").value;
    bioField.textContent = document.getElementById("edit-bio").value;
    idadeField.textContent = document.getElementById("edit-age").value;
    localizacaoField.textContent = document.getElementById("edit-location").value;
    interessesField.textContent = document.getElementById("edit-interests").value;

    localStorage.setItem("userName", nameField.textContent);
    localStorage.setItem("userBio", bioField.textContent);
    localStorage.setItem("userAge", idadeField.textContent);
    localStorage.setItem("userLocation", localizacaoField.textContent);
    localStorage.setItem("userInterests", interessesField.textContent);

    modal.style.display = "none";
  };

  // Trocar imagem de perfil
  profileImg.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = event => {
          profileImg.src = event.target.result;
          localStorage.setItem("profileImage", event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Seleção de emoção para posts
  let selectedEmotion = "";
  const emotionButtons = document.querySelectorAll(".emotion-btn");
  
  emotionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      emotionButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedEmotion = btn.dataset.emotion;
    });
  });

  // Criar novo post
  postForm.onsubmit = e => {
    e.preventDefault();
    const text = newPost.value.trim();
    if (text) {
      const now = new Date();
      const div = document.createElement("div");
      div.className = "post";
      
      let emotionEmoji = "";
      if (selectedEmotion) {
        switch (selectedEmotion) {
          case "feliz": emotionEmoji = "😊"; break;
          case "triste": emotionEmoji = "😢"; break;
          case "ansioso": emotionEmoji = "😰"; break;
          case "calmo": emotionEmoji = "😌"; break;
          case "irritado": emotionEmoji = "😠"; break;
        }
      }
      
      div.innerHTML = `
        <p>${emotionEmoji} "${text}"</p>
        <span class="post-date">Publicado em: ${now.toLocaleDateString()}</span>
        <span class="post-emotion">${selectedEmotion ? `Sentindo-se ${selectedEmotion}` : ""}</span>
        <button class="like-post"><i class="fas fa-heart"></i></button>
        <button class="delete-post"><i class="fas fa-trash-alt"></i></button>`;
      postList.prepend(div);
      newPost.value = "";
      selectedEmotion = "";
      emotionButtons.forEach(b => b.classList.remove("selected"));
      savePosts();
    }
  };

  function savePosts() {
    localStorage.setItem("userPosts", postList.innerHTML);
    atualizarPostCount();
  }

  function bindActions() {
    postList.querySelectorAll(".delete-post").forEach(btn => {
      btn.onclick = () => {
        btn.parentElement.remove();
        savePosts();
      };
    });

    postList.querySelectorAll(".like-post").forEach(btn => {
      btn.onclick = () => {
        btn.classList.toggle("liked");
        btn.style.color = btn.classList.contains("liked") ? "red" : "#888";
      };
    });
  }

  function atualizarPostCount() {
    const count = postList.querySelectorAll(".post").length;
    postCount.textContent = count;
    postProgress.value = count;
  }

  // Filtro de posts
  searchInput.addEventListener("input", () => {
    const termo = searchInput.value.toLowerCase();
    document.querySelectorAll(".post").forEach(post => {
      const texto = post.textContent.toLowerCase();
      post.style.display = texto.includes(termo) ? "block" : "none";
    });
  });

  // Fundo personalizado
  themeSelect.addEventListener("change", () => {
    document.body.className = themeSelect.value;
    localStorage.setItem("fundoPerfil", themeSelect.value);
  });

  // Ver como público
  togglePublic.addEventListener("click", () => {
    document.body.classList.toggle("public-view");
    togglePublic.textContent = document.body.classList.contains("public-view")
      ? "👁️ Ver como você"
      : "👁️ Ver como público";
  });

  // Funcionalidade de alternância de tema (claro/escuro)
  function loadThemePreference() {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      toggleThemeBtn.textContent = "☀️";
    } else {
      toggleThemeBtn.textContent = "🌙";
    }
  }

  toggleThemeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    toggleThemeBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("darkMode", isDark);
  });

  function loadData() {
    nameField.textContent = localStorage.getItem("userName") || "Fulano de Tal";
    bioField.textContent = localStorage.getItem("userBio") || '"Aqui para compartilhar emoções e experiências."';
    idadeField.textContent = localStorage.getItem("userAge") || "25 anos";
    localizacaoField.textContent = localStorage.getItem("userLocation") || "São Paulo, Brasil";
    interessesField.textContent = localStorage.getItem("userInterests") || "Música, Livros, Bem-estar";
    profileImg.src = localStorage.getItem("profileImage") || "user-placeholder.png";
    postList.innerHTML = localStorage.getItem("userPosts") || "";
    themeSelect.value = localStorage.getItem("fundoPerfil") || "default";

    if (themeSelect.value !== "default") {
      document.body.classList.add(themeSelect.value);
    }

    bindActions();
    atualizarPostCount();
    loadThemePreference();
  }

  loadData();
  
  // Implementação do rastreador de humor diário
  const moodButtons = document.querySelectorAll(".mood-btn");
  const moodNote = document.getElementById("mood-note");
  const saveMoodBtn = document.getElementById("save-mood");
  const moodCalendar = document.getElementById("mood-calendar");
  const moodChart = document.getElementById("mood-chart");
  let selectedMood = "";
  
  moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      moodButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedMood = btn.dataset.mood;
    });
  });
  
  saveMoodBtn.addEventListener("click", () => {
    if (!selectedMood) {
      alert("Por favor, selecione como você está se sentindo hoje.");
      return;
    }
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // formato YYYY-MM-DD
    
    // Obter registros existentes ou criar um novo array
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    
    // Verificar se já existe um registro para hoje
    const existingIndex = moodHistory.findIndex(entry => entry.date === dateString);
    
    if (existingIndex !== -1) {
      // Atualizar o registro existente
      moodHistory[existingIndex] = {
        date: dateString,
        mood: selectedMood,
        note: moodNote.value.trim()
      };
    } else {
      // Adicionar novo registro
      moodHistory.push({
        date: dateString,
        mood: selectedMood,
        note: moodNote.value.trim()
      });
    }
    
    // Salvar no localStorage
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
    
    // Atualizar o calendário e o gráfico
    updateMoodCalendar();
    updateMoodChart();
    
    // Resetar formulário
    moodButtons.forEach(b => b.classList.remove("selected"));
    moodNote.value = "";
    selectedMood = "";
    
    alert("Registro de humor salvo com sucesso!");
  });
  
  function updateMoodCalendar() {
    moodCalendar.innerHTML = "";
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    
    // Gerar calendário do mês atual
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Primeiro dia do mês
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Adicionar dias vazios para alinhar com dia da semana
    const startOffset = firstDay.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    for (let i = 0; i < startOffset; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day empty";
      moodCalendar.appendChild(emptyDay);
    }
    
    // Adicionar dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      dayDiv.textContent = day;
      
      // Verificar se existe registro para este dia
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMood = moodHistory.find(entry => entry.date === dateString);
      
      if (dayMood) {
        let moodEmoji;
        switch (dayMood.mood) {
          case "excelente": moodEmoji = "😁"; break;
          case "bem": moodEmoji = "🙂"; break;
          case "neutro": moodEmoji = "😐"; break;
          case "mal": moodEmoji = "🙁"; break;
          case "pessimo": moodEmoji = "😞"; break;
          default: moodEmoji = "";
        }
        
        const moodIndicator = document.createElement("span");
        moodIndicator.className = "mood-indicator";
        moodIndicator.textContent = moodEmoji;
        dayDiv.appendChild(moodIndicator);
        
        // Adicionar tooltip com a nota
        if (dayMood.note) {
          dayDiv.title = dayMood.note;
        }
      }
      
      moodCalendar.appendChild(dayDiv);
    }
  }
  
  function updateMoodChart() {
    moodChart.innerHTML = "";
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    
    // Ordenar por data
    moodHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Pegar os últimos 7 dias
    const lastWeek = moodHistory.slice(-7);
    
    // Mapear humor para valor numérico
    const moodValues = {
      "excelente": 5,
      "bem": 4,
      "neutro": 3,
      "mal": 2,
      "pessimo": 1
    };
    
    // Criar barras do gráfico
    lastWeek.forEach(entry => {
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      
      // Altura baseada no humor
      const value = moodValues[entry.mood] || 3;
      const heightPercent = (value / 5) * 100;
      bar.style.height = `${heightPercent}%`;
      
      // Dia da semana
      const date = new Date(entry.date);
      const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      bar.setAttribute("data-day", weekdays[date.getDay()]);
      
      // Tooltip com a data completa e nota
      bar.title = `${date.toLocaleDateString()}: ${entry.note || "Sem anotações"}`;
      
      moodChart.appendChild(bar);
    });
  }
  
  // Implementação da galeria de fotos
  const addPhotoBtn = document.getElementById("add-photo");
  const photoInput = document.getElementById("photo-input");
  const photoGallery = document.getElementById("photo-gallery");
  
  addPhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });
  
  photoInput.addEventListener("change", e => {
    const files = e.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = event => {
          // Obter galeria existente
          const gallery = JSON.parse(localStorage.getItem("photoGallery") || "[]");
          
          // Adicionar nova foto
          gallery.push({
            url: event.target.result,
            date: new Date().toISOString(),
            description: ""
          });
          
          // Salvar no localStorage
          localStorage.setItem("photoGallery", JSON.stringify(gallery));
          
          // Atualizar a galeria na UI
          updatePhotoGallery();
        };
        
        reader.readAsDataURL(file);
      }
    }
  });
  
  function updatePhotoGallery() {
    photoGallery.innerHTML = "";
    const gallery = JSON.parse(localStorage.getItem("photoGallery") || "[]");
    
    gallery.forEach((photo, index) => {
      const photoItem = document.createElement("div");
      photoItem.className = "gallery-item";
      
      const img = document.createElement("img");
      img.src = photo.url;
      img.alt = `Foto ${index + 1}`;
      
      const actions = document.createElement("div");
      actions.className = "photo-actions";
      
      const describeBtn = document.createElement("button");
      describeBtn.innerHTML = '<i class="fas fa-edit"></i>';
      describeBtn.title = "Adicionar descrição";
      describeBtn.addEventListener("click", () => {
        const description = prompt("Adicione uma descrição para esta foto:", photo.description);
        if (description !== null) {
          gallery[index].description = description;
          localStorage.setItem("photoGallery", JSON.stringify(gallery));
          img.title = description;
        }
      });
      
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.title = "Remover foto";
      deleteBtn.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja remover esta foto?")) {
          gallery.splice(index, 1);
          localStorage.setItem("photoGallery", JSON.stringify(gallery));
          updatePhotoGallery();
        }
      });
      
      actions.appendChild(describeBtn);
      actions.appendChild(deleteBtn);
      
      photoItem.appendChild(img);
      photoItem.appendChild(actions);
      
      if (photo.description) {
        img.title = photo.description;
      }
      
      photoGallery.appendChild(photoItem);
    });
  }
  
  // Inicializar calendário e gráfico de humor
  updateMoodCalendar();
  updateMoodChart();
  
  // Inicializar galeria de fotos
  updatePhotoGallery();
  
  // Salvar preferências de configuração
  const saveConfigBtn = document.getElementById("save-config-btn");
  saveConfigBtn.addEventListener("click", () => {
    const notificacoesCheck = document.getElementById("notificacoes-check").checked;
    const mensagensPrivadasCheck = document.getElementById("mensagens-privadas-check").checked;
    const idiomaSelect = document.getElementById("idioma-select").value;
    const privacidadeSelect = document.getElementById("privacidade-select").value;
    const mostrarHumorCheck = document.getElementById("mostrar-humor-check").checked;
    const lembretesCheck = document.getElementById("lembretes-check").checked;
    
    // Salvar no localStorage
    const config = {
      notificacoes: notificacoesCheck,
      mensagensPrivadas: mensagensPrivadasCheck,
      idioma: idiomaSelect,
      privacidade: privacidadeSelect,
      mostrarHumor: mostrarHumorCheck,
      lembretes: lembretesCheck
    };
    
    localStorage.setItem("userConfig", JSON.stringify(config));
    alert("Preferências salvas com sucesso!");
  });
  
  // Carregar configurações salvas
  function loadUserConfig() {
    const config = JSON.parse(localStorage.getItem("userConfig") || "{}");
    
    if (config.notificacoes !== undefined) {
      document.getElementById("notificacoes-check").checked = config.notificacoes;
    }
    
    if (config.mensagensPrivadas !== undefined) {
      document.getElementById("mensagens-privadas-check").checked = config.mensagensPrivadas;
    }
    
    if (config.idioma) {
      document.getElementById("idioma-select").value = config.idioma;
    }
    
    if (config.privacidade) {
      document.getElementById("privacidade-select").value = config.privacidade;
    }
    
    if (config.mostrarHumor !== undefined) {
      document.getElementById("mostrar-humor-check").checked = config.mostrarHumor;
    }
    
    if (config.lembretes !== undefined) {
      document.getElementById("lembretes-check").checked = config.lembretes;
    }
  }
  
  loadUserConfig();
});
