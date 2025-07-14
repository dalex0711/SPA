import { logoutUser } from '../services/storage.js';
import { navegation } from '../router.js';

export function btnLogout() {
  const logOutBtn = document.querySelector('.log-out-btn');
  if (!logOutBtn) return;

  logOutBtn.addEventListener('click', (event) => {
    logoutUser(); 
    alert('Hasta pronto');
    navegation('/');
  });
}