export function showMessage(text, type = 'info') {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = `message ${type}`;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}