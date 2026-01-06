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
        if (err instanceof TypeError) { 
            console.error("Network or URL Error:", err.message);
            return Promise.reject("Could not connect to the server (check URL and network connection).");
       }
        console.log("Error", err);
        return Promise.reject(err);
    });
}

const login = (email, password) => {
    return fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else if (response.status === 400 || response.status === 401) {
            // 400 = Validation Error, 401 = Wrong Password/Email
            return response.json().then(errData => {
                throw errData.error_message || "Login failed";
            });
        } else {
            throw "Server error logging in";
        }
    })
    .then((resJson) => {
        return resJson;
    })
    .catch((err) => {
        if (err instanceof TypeError) { 
            console.error("Network or URL Error:", err.message);
            return Promise.reject("Could not connect to the server (check URL and network connection).");
    }
        console.log("Error", err);
        return Promise.reject(err);
    });
}

const logout = () => {
    // Get the token from local storage to send to the backend
    const token = localStorage.getItem('session_token');

    return fetch("http://localhost:3333/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": token // Pass token in header as required by backend
        }
    })
    .then((response) => {
        if(response.status === 200){
            return response.json(); // Success
        } else if (response.status === 401 || response.status === 403) {
            return response.json().then(errData => {
                throw errData.error_message || "Not logged in or invalid token";
            });
        } else {
            throw new Error("Something went wrong logging out");
        }
    })
    .then((resJson) => {
        return resJson;
    })
    .catch((err) => {
        if (err instanceof TypeError) { 
            console.error("Network or URL Error:", err.message);
            return Promise.reject("Could not connect to the server (check URL and network connection).");
       }
        console.log("Error", err);
        return Promise.reject(err);
    });
}

const getUserProfile = (user_id) => {
    const token = localStorage.getItem('session_token');
    if (!token) {
        return Promise.reject("Not authenticated. Token missing.");
    }
    
    return fetch(`http://localhost:3333/users/${user_id}`, {
    method: "GET",
    headers: {
        "X-Authorization": token
    }
})
.then((response) => {
    if(response.status === 200){
        return response.json();
    } else if (response.status === 404) {
        throw "User not found.";
    } else if (response.status === 401 || response.status === 403) {
        throw "Authentication required or access denied.";
    } else {
        throw new Error("Server error fetching profile.");
    }
})
.catch((err) => {
    console.error("Error fetching profile:", err);
    return Promise.reject(err);
});
}

export const UserService = {
    register,
    login,
    logout,
    getUserProfile
};