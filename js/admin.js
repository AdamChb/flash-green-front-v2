// js/admin.js

document.addEventListener('admin-ready', initAdminTabs);

function initAdminTabs() {
  const tabs   = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1) onglet actif
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      // 2) afficher le bon panel
      panels.forEach(p => p.classList.add('is-hidden'));
      const targetId = tab.dataset.target;
      document.getElementById(targetId).classList.remove('is-hidden');
    });
  });
}
