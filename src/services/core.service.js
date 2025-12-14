//Housing all the helper components for core features like search, filter, sort etc.

const searchItems = () => {
    return fetch("http://localhost:3333/search")
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else {
            throw "Something went wrong retrieving search results";
        }
    })
    .then((resJson) => {
        return resJson;
    })
    .catch((err) => {
        console.log("Error", err)
        return Promise.reject(err);
    })
}

const searchSingleItems = (item_id) => {
    return fetch(`http://localhost:3333/item/${item_id}`)
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else if (response.status === 404) {
            return response.json().then(errorBody => {
                throw new Error(errorBody.error_message || "Invalid search parameters");
            });
        }
        else {
            // Handle other server errors (e.g., 500)
            throw new Error("Server error retrieving search results");
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
        console.log("Error", err)
        return Promise.reject(err);
    })
}

const getBidHistory = (item_id) => {
    return fetch('http://localhost:3333/item/${item_id}/bid')
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else {
            throw new Error("Could not fetch bid history");
        }
    })
}

const placeBid = (item_id, amount) => {
    const sessionToken = localStorage.getItem('session_token');
    
    // Authorization check happens on the server, but we need the token here
    if (!sessionToken) {
        return Promise.reject(new Error("You must be logged in to place a bid."));
    }

    return fetch(`http://localhost:3333/item/${item_id}/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken
        },
        body: JSON.stringify({ amount: amount })
    })
    .then(async (response) => {
        const responseBody = await response.json();
        
        if (response.status === 201) {
            return responseBody;
        } else if (response.status === 400 || response.status === 403) {
            throw new Error(responseBody.error_message || "Bid validation failed - you can't bid on your own item.");
        } else if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        } else {
            throw new Error(responseBody.error_message || "An unexpected error occurred while placing the bid.");
        }
    });
}

export const CoreService = {
    searchItems,
    searchSingleItems,
    getBidHistory,
    placeBid
};