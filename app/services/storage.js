import {apiRequest} from '../api/request';

export function dataEncoding(user) {
    const payload = {
        id : user.id,
        rol : user.rol,
        exp: Date.now() + 60 * 60 * 1000
    };

    const token = btoa(JSON.stringify(payload))
    localStorage.setItem('token',token)
};

export async function getUser(email) {
    const users = await apiRequest('GET', `users?email=${email}`);
    return  users[0]
};


export function logoutUser(){
    localStorage.removeItem('token')
    return
}

export function getUserLogged(user){
    const token = localStorage.getItem('token')
    if(!token) return null;
    try {        
        const decoded = JSON.parse(atob(token));
        if(decoded.exp < Date.now()){
            localStorage.removeItem('token');
            return null;
        }
        return decoded;
    } catch (error) {
        console.log('token invalido')
        return null
    }
};