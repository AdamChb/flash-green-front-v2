document.addEventListener('admin-ready', () => {
  initAdminTabs();
  initAdminModals();
});

function initAdminTabs() {
  const tabs   = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      panels.forEach(p => p.classList.add('is-hidden'));
      document.getElementById(tab.dataset.target).classList.remove('is-hidden');
    });
  });
}

function initAdminModals() {
  const userModal   = document.getElementById('user-modal');
  const cardModal   = document.getElementById('card-modal');
  const btnAddUser  = document.getElementById('add-user');
  const btnAddCard  = document.getElementById('add-card');
  const editUsers   = document.querySelectorAll('.btn-edit-user');
  const editCards   = document.querySelectorAll('.btn-edit-card');
  const cancels     = document.querySelectorAll('.btn-cancel');

  // Ouverture
  btnAddUser.addEventListener('click', () => openModal(userModal, 'Ajouter un utilisateur'));
  btnAddCard.addEventListener('click', () => openModal(cardModal, 'Ajouter une carte'));
  editUsers.forEach(btn => btn.addEventListener('click', () => openModal(userModal, 'Modifier un utilisateur')));
  editCards.forEach(btn => btn.addEventListener('click', () => openModal(cardModal, 'Modifier une carte')));

  // Fermeture
  cancels.forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  }));
}

function openModal(modalEl, title) {
  modalEl.querySelector('h3').textContent = title;
  // Reset du formulaire
  const form = modalEl.querySelector('form');
  form.reset();
  modalEl.classList.add('active');
}
