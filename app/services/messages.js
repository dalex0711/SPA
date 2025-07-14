// Displays a floating message on screen (type: 'info' or 'error')
export function showMessage(text, type = 'info') {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = `message ${type}`;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000); // Auto-remove after 3 seconds
}
