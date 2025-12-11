const login = (email, password) => {
    return fetch
}

const register = (first_name, last_name, email, password) => {
    return fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        })
    })
    .then((response) => {
        if(response.status === 201){
            return response.json();
        } else if (response.status === 400) {
            return response.json().then(errData => {
                throw errData.error_message || "Bad Request";
            });
        } else {
            throw "Something went wrong creating account";
        }
    })
    .then((resJson) => {
        return resJson;
    })
    .catch((err) => {
        console.log("Error", err);
        return Promise.reject(err);
    });
}

export const UserService = {
    register
};