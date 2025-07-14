import { apiRequest } from '../api/request';

// Encodes user data and stores token in localStorage
export function dataEncoding(user) {
    const payload = {
        id : user.id,
        rol : user.rol,
        exp: Date.now() + 60 * 60 * 1000 // 1 hour expiration
    };

    const token = btoa(JSON.stringify(payload));
    localStorage.setItem('token', token);
};

// Retrieves user object by email
export async function getUser(email) {
    const users = await apiRequest('GET', `users?email=${email}`);
    return users[0];
};

// Removes token from localStorage (logout)
export function logoutUser(){
    localStorage.removeItem('token');
    return;
}

// Decodes token and returns user info if valid
export function getUserLogged(){
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {        
        const decoded = JSON.parse(atob(token));
        if (decoded.exp < Date.now()) {
            localStorage.removeItem('token');
            return null;
        }
        return decoded;
    } catch (error) {
        console.log('invalid token');
        return null;
    }
};
