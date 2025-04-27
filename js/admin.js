const API_BASE = 'https://flash-green.api.arcktis.fr/api';

document.addEventListener('admin-ready', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return window.location.href = 'login.html';
  }

  initTabs();
  await loadUsers();
  await loadCards();
  initModals();
});

function initTabs() {
  const tabs   = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      panels.forEach(p => p.classList.add('is-hidden'));
      document.getElementById(tab.dataset.target)
              .classList.remove('is-hidden');
    });
  });
}

async function loadUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Erreur chargement utilisateurs');
  const users = await res.json();

  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.dataset.id = u.ID_personne;
    tr.innerHTML = `
      <td>${u.Pseudo.split(' ')[0] || u.Pseudo}</td>
      <td>${u.Pseudo.split(' ')[1] || ''}</td>
      <td>${u.Email}</td>
      <td>${roleLabel(u.Role_User)}</td>
      <td>
        <button class="btn-small btn-edit-user">Éditer</button>
        <button class="btn-small btn-danger btn-delete-user">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });

  // attach per-row handlers
  document.querySelectorAll('.btn-edit-user')
    .forEach(btn => btn.addEventListener('click', onEditUser));
  document.querySelectorAll('.btn-delete-user')
    .forEach(btn => btn.addEventListener('click', onDeleteUser));
}

async function loadCards() {
  const res = await fetch(`${API_BASE}/questions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Erreur chargement cartes');
  const cards = await res.json();

  const tbody = document.getElementById('cards-tbody');
  tbody.innerHTML = '';
  cards.forEach(q => {
    const tr = document.createElement('tr');
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

  document.querySelectorAll('.btn-edit-card')
    .forEach(btn => btn.addEventListener('click', onEditCard));
  document.querySelectorAll('.btn-delete-card')
    .forEach(btn => btn.addEventListener('click', onDeleteCard));
}

function roleLabel(code) {
  return { 0: 'Admin', 1: 'Enseignant', 2: 'Utilisateur' }[code] || 'Inconnu';
}


function initModals() {
  const userModal = document.getElementById('user-modal');
  const cardModal = document.getElementById('card-modal');
  const userForm  = document.getElementById('user-form');
  const cardForm  = document.getElementById('card-form');

  // Open Add
  document.getElementById('add-user')
    .addEventListener('click', () => openUserModal());
  document.getElementById('add-card')
    .addEventListener('click', () => openCardModal());

  // Cancel buttons
  document.querySelectorAll('.btn-cancel')
    .forEach(b => b.addEventListener('click', closeAllModals));

  // Submit forms
  userForm.addEventListener('submit', onSubmitUser);
  cardForm.addEventListener('submit', onSubmitCard);
}


let editingUserId = null;
function openUserModal(editData = {}) {
  editingUserId = editData.id || null;
  const m = document.getElementById('user-modal');
  m.querySelector('#user-modal-title').textContent =
    editingUserId ? 'Modifier un utilisateur' : 'Ajouter un utilisateur';

  const f = m.querySelector('form');
  f.lastName.value  = editData.lastName  || '';
  f.firstName.value = editData.firstName || '';
  f.email.value     = editData.email     || '';
  f.role.value      = editData.role      || '2';

  m.classList.add('active');
}

let editingCardId = null;
function openCardModal(editData = {}) {
  editingCardId = editData.id || null;
  const m = document.getElementById('card-modal');
  m.querySelector('#card-modal-title').textContent =
    editingCardId ? 'Modifier une carte' : 'Ajouter une carte';

  const f = m.querySelector('form');
  f.question.value = editData.question || '';
  f.answer.value   = editData.answer   || '';

  m.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}


// ———————————— CRUD Handlers ————————————

async function onSubmitUser(ev) {
  ev.preventDefault();
  const f = ev.target;
  const payload = {
    username: `${f.lastName.value} ${f.firstName.value}`,
    email:    f.email.value,
    role:     Number(f.role.value),
    password: 'ChangeMe123'  // backend requires password; prompt admin to reset later
  };

  const url = editingUserId
    ? `${API_BASE}/admin/users/${editingUserId}`
    : `${API_BASE}/admin/users`;
  const method = editingUserId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    alert('Erreur sauvegarde utilisateur');
    return;
  }
  closeAllModals();
  await loadUsers();
}

async function onDeleteUser(ev) {
  const tr = ev.target.closest('tr');
  if (!confirm('Confirmer la suppression ?')) return;
  const id = tr.dataset.id;
  await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  await loadUsers();
}


async function onSubmitCard(ev) {
  ev.preventDefault();
  const f = ev.target;
  const payload = {
    title:   f.question.value,
    content: f.answer.value
  };

  const url = editingCardId
    ? `${API_BASE}/questions/${editingCardId}`
    : `${API_BASE}/questions`;
  const method = editingCardId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    alert('Erreur sauvegarde carte');
    return;
  }
  closeAllModals();
  await loadCards();
}

async function onDeleteCard(ev) {
  const tr = ev.target.closest('tr');
  if (!confirm('Confirmer la suppression ?')) return;
  const id = tr.dataset.id;
  await fetch(`${API_BASE}/questions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  await loadCards();
}
