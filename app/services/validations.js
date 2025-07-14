import CryptoJS from 'crypto-js';
import {apiRequest} from '../api/request';


export function validateInputs(...inputs){
     return inputs.every(input => input !== null && input !== undefined && input.trim() !== '');
};

export function validatePassword(pass) {
    const tieneMayuscula = /[A-Z]/.test(pass); 
    const tieneMinuscula = /[a-z]/.test(pass);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const longitudMinima = pass.length >= 5;
    
    return tieneMayuscula && tieneMinuscula  && 
           tieneCaracterEspecial && longitudMinima;
};

export async function emailExists(email) {
  const allUsers = await apiRequest('GET','users');
  return allUsers.some(u => u.email === email);
}

export async function validateUser(email,password) {
    const allUser = await  apiRequest('GET','users');
    const found = allUser?.find(u => u.email === email && u.password === password);
    return found || null;
};

export function hashPass(password){
    return CryptoJS.SHA512(password).toString();
};


        
