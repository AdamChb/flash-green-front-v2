// js/admin.js
const API_BASE = "https://flash-green.api.arcktis.fr/api";

document.addEventListener("admin-ready", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // 1) fetch profile to see their role
  let profile;
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Profil introuvable");
    profile = await res.json();
  } catch (err) {
    console.error(err);
    return window.location.href = "login.html";
  }

  // 2) plain users → redirect to cards view
  if (profile.role === 2) {
    return window.location.href = "cards.html";
  }

  // 3) professors → hide the users tab entirely
  if (profile.role === 1) {
    document.querySelector('.admin-tab[data-target="users-panel"]')?.remove();
    document.getElementById("users-panel")?.remove();
    // ensure "Cartes" is active
    const cardsTab = document.querySelector('.admin-tab[data-target="cards-panel"]');
    cardsTab.classList.add("is-active");
    document.getElementById("cards-panel").classList.remove("is-hidden");
  }

  initTabs();

  // 4) load data
  try {
    if (profile.role === 0) {
      await loadUsers(token);
    }
    await loadCards(token);
    initModals(token);
  } catch (err) {
    console.error(err);
    if (err.status === 401) window.location.href = "login.html";
    else alert("Erreur admin : " + err.message);
  }
});

function initTabs() {
  const tabs   = document.querySelectorAll(".admin-tab");
  const panels = document.querySelectorAll(".admin-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.toggle("is-active", t === tab));
      panels.forEach(p => p.classList.add("is-hidden"));
      document.getElementById(tab.dataset.target).classList.remove("is-hidden");
    });
  });
}

async function loadUsers(token) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const e = new Error(res.statusText);
    e.status = res.status;
    throw e;
  }
  const users = await res.json();

  const tbody = document.getElementById("users-tbody");
  tbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.dataset.id = u.ID_personne;
    tr.innerHTML = `
      <td>${u.Pseudo}</td>
      <td>${u.Email}</td>
      <td>${roleLabel(u.Role_User)}</td>
      <td>
        <button class="btn-small btn-edit-user">Éditer</button>
        <button class="btn-small btn-danger btn-delete-user">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-edit-user")
          .forEach(btn => btn.addEventListener("click", onEditUser));
  document.querySelectorAll(".btn-delete-user")
          .forEach(btn => btn.addEventListener("click", onDeleteUser));
}

async function loadCards(token) {
  const res = await fetch(`${API_BASE}/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const e = new Error(res.statusText);
    e.status = res.status;
    throw e;
  }
  const cards = await res.json();

  const tbody = document.getElementById("cards-tbody");
  tbody.innerHTML = "";
  cards.forEach(q => {
    const tr = document.createElement("tr");
    tr.dataset.id = q.ID_question;
    tr.innerHTML = `
      <td>${q.Intitule}</td>
      <td>${q.Reponse}</td>
      <td>
        <button class="btn-small btn-edit-card">Éditer</button>
        <button class="btn-small btn-danger btn-delete-card">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-edit-card")
          .forEach(btn => btn.addEventListener("click", onEditCard));
  document.querySelectorAll(".btn-delete-card")
          .forEach(btn => btn.addEventListener("click", onDeleteCard));
}

function onEditUser(e) {
  const tr = e.target.closest("tr");
  openModal("user-modal", "Modifier un utilisateur");
  const form = document.getElementById("user-form");
  form.dataset.id           = tr.dataset.id;
  form.elements.pseudo.value = tr.children[0].textContent;
  form.elements.email.value  = tr.children[1].textContent;
  form.elements.role.value   = roleCode(tr.children[2].textContent);
}

function onDeleteUser(e) {
  const tr = e.target.closest("tr");
  const id = tr.dataset.id;
  if (!confirm("Supprimer cet utilisateur ?")) return;
  const token = localStorage.getItem("token");
  fetch(`${API_BASE}/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(r => { if (!r.ok) throw new Error(r.statusText); tr.remove(); })
    .catch(err => alert("Erreur suppression : " + err.message));
}

function onEditCard(e) {
  const tr = e.target.closest("tr");
  openModal("card-modal", "Modifier une carte");
  const form = document.getElementById("card-form");
  form.dataset.id                  = tr.dataset.id;
  form.elements.question.value     = tr.children[0].textContent;
  form.elements.answer.value       = tr.children[1].textContent;
}

function onDeleteCard(e) {
  const tr = e.target.closest("tr");
  const id = tr.dataset.id;
  if (!confirm("Supprimer cette carte ?")) return;
  const token = localStorage.getItem("token");
  fetch(`${API_BASE}/questions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(r => { if (!r.ok) throw new Error(r.statusText); tr.remove(); })
    .catch(err => alert("Erreur suppression : " + err.message));
}

function initModals(token) {
  const addUser = document.getElementById("add-user");
  if (addUser) addUser.addEventListener("click", () => openModal("user-modal","Ajouter un utilisateur"));

  const addCard = document.getElementById("add-card");
  if (addCard) addCard.addEventListener("click", () => openModal("card-modal","Ajouter une carte"));

  document.querySelectorAll(".btn-cancel")
          .forEach(b => b.addEventListener("click", closeAllModals));

  const userForm = document.getElementById("user-form");
  if (userForm) userForm.addEventListener("submit", e => onSubmitUser(e, token));

  const cardForm = document.getElementById("card-form");
  if (cardForm) cardForm.addEventListener("submit", e => onSubmitCard(e, token));
}

async function onSubmitUser(e, token) {
  e.preventDefault();
  const form = e.target;
  const id   = form.dataset.id;
  const payload = {
    username: form.elements.pseudo.value,
    email:    form.elements.email.value,
    role:     parseInt(form.elements.role.value, 10)
  };

  let url, method;
  if (id) {
    url    = `${API_BASE}/admin/users/${id}`;
    method = "PUT";
  } else {
    payload.password = form.elements.password.value;
    url    = `${API_BASE}/admin/users`;
    method = "POST";
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert(`Erreur ${method} utilisateur : ${res.status} ${res.statusText}`);
    return;
  }

  closeAllModals();
  const activeTab = document.querySelector(".admin-tab.is-active").dataset.target;
  await loadUsers(token);
  document.querySelector(`[data-target="${activeTab}"]`).click();
}

async function onSubmitCard(e, token) {
  e.preventDefault();
  const form = e.target;
  const id   = form.dataset.id;
  const payload = {
    title:   form.elements.question.value,
    content: form.elements.answer.value
  };
  const url    = id ? `${API_BASE}/questions/${id}` : `${API_BASE}/questions`;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert(`Erreur ${method} carte : ${res.statusText}`);
    return;
  }

  closeAllModals();
  const activeTab = document.querySelector(".admin-tab.is-active").dataset.target;
  await loadCards(token);
  document.querySelector(`[data-target="${activeTab}"]`).click();
}

function openModal(modalId, title) {
  const m = document.getElementById(modalId);
  if (!m) return;
  const form = m.querySelector("form");
  m.querySelector("h3").textContent = title;
  form.reset();

  // only strip data-id on "Add" workflows
  if (!title.startsWith("Modifier")) {
    delete form.dataset.id;
  }

  // only toggle password field in the user form
  if (modalId === "user-modal") {
    const pwGroup = form.querySelector(".password-group");
    if (title.startsWith("Modifier")) {
      pwGroup?.classList.add("hidden");
      form.elements.password.required = false;
    } else {
      pwGroup?.classList.remove("hidden");
      form.elements.password.required = true;
    }
  }

  m.classList.add("active");
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
}

function roleLabel(code) {
  return { 0: "Admin", 1: "Enseignant", 2: "Utilisateur" }[code] || "N/A";
}
function roleCode(label) {
  return { Admin: 0, Enseignant: 1, Utilisateur: 2 }[label] ?? 2;
}