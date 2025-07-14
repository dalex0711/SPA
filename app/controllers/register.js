import {emailExists, validateInputs,validatePassword, hashPass} from '../services/validations.js';
import {apiRequest} from '../api/request';
import{navegation} from '../router.js'


export  function init(){
    const registerForm = document.querySelector('#register-form');
  
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const inputsValidator = validateInputs(name,email,password);
        const passwordValidator = validatePassword(password);


        if(!inputsValidator){
            console.log('no puedes tenercampos vacios')
            return
        }else if(!passwordValidator){
           console.log('la pass es demasiado corta')
           return
        };

       if(await emailExists(email)){
        console.log('el email ya existe')
        return
       };

       const hashedPassword = hashPass(password); 
       await apiRequest('POST', 'users',{name,email, password : hashedPassword, rol:'visitante'});

       navegation('/login')
    })
}
