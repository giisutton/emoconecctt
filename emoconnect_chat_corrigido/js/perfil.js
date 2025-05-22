document.addEventListener("DOMContentLoaded", () => {
  const profileImg = document.getElementById("profile-img");
  const nameField = document.getElementById("profile-name");
  const bioField = document.getElementById("profile-bio");
  const idadeField = document.getElementById("idade");
  const localizacaoField = document.getElementById("localizacao");
  const interessesField = document.getElementById("interesses");

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

  // Criar novo post
  postForm.onsubmit = e => {
    e.preventDefault();
    const text = newPost.value.trim();
    if (text) {
      const now = new Date();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <p>"${text}"</p>
        <span class="post-date">Publicado em: ${now.toLocaleDateString()}</span>
        <button class="like-post"><i class="fas fa-heart"></i></button>
        <button class="delete-post"><i class="fas fa-trash-alt"></i></button>`;
      postList.prepend(div);
      newPost.value = "";
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
  }

  loadData();
});
