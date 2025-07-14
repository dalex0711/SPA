import { emailExists, validateInputs, validatePassword, hashPass } from '../services/validations.js';
import { apiRequest } from '../api/request';
import { navegation } from '../router.js';
import { showMessage } from '../services/messages.js';


// Initialize register form behavior
export function init() {
  const registerForm = document.querySelector('#register-form');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const inputsValidator = validateInputs(name, email, password);
    const passwordValidator = validatePassword(password);

    // Validate empty fields
    if (!inputsValidator) {
      showMessage('All fields are required', 'error');
      return;
    }

    // Validate password strength
    if (!passwordValidator) {
        showMessage('Password must include uppercase, lowercase, special character and be at least 5 characters long', 'error');
      return;
    }

    // Check if email already exists
    if (await emailExists(email)) {
      showMessage('Email is already registered', 'error');
      return;
    }

    // Register new user
    const hashedPassword = hashPass(password);
    await apiRequest('POST', 'users', {
      name,
      email,
      password: hashedPassword,
      rol: 'visitante'
    });

    // Redirect to login after successful registration
    navegation('/login');
  });
}
