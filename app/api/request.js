const apiUrl = 'http://localhost:3000/';

export async function apiRequest(method, endpoint = '',body = null) {
    try {
        
        const options ={
            method,
            headers:{
                 'Content-Type': 'application/json'
            },

        };

        if(body && method != 'GET'){
            options.body =  JSON.stringify(body)
        };

        const response = await fetch(`${apiUrl}${endpoint}`,options);
        if(!response.ok) throw {
            status : response.status,
            statusText :  response.statusText
        };

        const json = await response.json();
        return json;
    } catch (error) {
        const menssage = error.statusText || "An error has ocurred";
        console.log(menssage)
        throw error;
    }
} 