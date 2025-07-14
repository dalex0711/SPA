import { validateInputs, validateUser, hashPass } from "../services/validations";
import { dataEncoding, getUser } from "../services/storage";
import { navegation } from '../router.js';
import { showMessage } from '../services/messages.js';

// Initialize login form logic
export function init() {
    const loginForm = document.querySelector('#login-form');

    // Handle form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get input values
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        // Validate empty fields
        const validatedInputs = validateInputs(email, password);
        if (!validatedInputs) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Hash password and validate user
        const hashedPassword = hashPass(password); 
        const user = await validateUser(email, hashedPassword);

        // Handle invalid credentials
        if (!user) {
            showMessage('Invalid credentials. Please try again.', 'error');
            return;
        }

        // Save user session and redirect based on role
        const fullUser = await getUser(email);
        dataEncoding(fullUser);

        showMessage('Login successful!', 'success');

        const redirectTo = fullUser.rol === 'admi' ? '/dashboard' : '/events';
        navegation(redirectTo);
    });
}
