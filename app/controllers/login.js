import { validateInputs, validateUser, hashPass } from "../services/validations";
import { dataEncoding, getUser } from "../services/storage";
import { navegation } from '../router.js';
import { showMessage } from '../services/messages.js';

export function init(){
    const loginForm = document.querySelector('#login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const validatedInputs = validateInputs(email, password);
        if (!validatedInputs) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const hashedPassword = hashPass(password); 
        const user = await validateUser(email, hashedPassword);

        if (!user) {
            showMessage('Invalid credentials. Please try again.', 'error');
            return;
        }

        const fullUser = await getUser(email);
        dataEncoding(fullUser);

        showMessage('Login successful!', 'success');

        const redirectTo = fullUser.rol === 'admi' ? '/dashboard' : '/events';
        navegation(redirectTo);
    });
}
