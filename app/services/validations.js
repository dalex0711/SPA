import CryptoJS from 'crypto-js';
import { apiRequest } from '../api/request';

// Checks if all inputs are non-empty and valid
export function validateInputs(...inputs) {
  return inputs.every(input => input !== null && input !== undefined && input.trim() !== '');
};

// Validates password rules: uppercase, lowercase, special character, min length
export function validatePassword(pass) {
  const tieneMayuscula = /[A-Z]/.test(pass); 
  const tieneMinuscula = /[a-z]/.test(pass);
  const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  const longitudMinima = pass.length >= 5;

  return tieneMayuscula && tieneMinuscula &&
         tieneCaracterEspecial && longitudMinima;
};

// Checks if email is already registered
export async function emailExists(email) {
  const allUsers = await apiRequest('GET', 'users');
  return allUsers.some(u => u.email === email);
}

// Verifies credentials and returns the user object if valid
export async function validateUser(email, password) {
  const allUser = await apiRequest('GET', 'users');
  const found = allUser?.find(u => u.email === email && u.password === password);
  return found || null;
};

// Encrypts password using SHA512
export function hashPass(password) {
  return CryptoJS.SHA512(password).toString();
};
