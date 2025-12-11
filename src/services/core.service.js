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
        console.log("Error", err)
        return Promise.reject(err);
    })
}

export const CoreService = {
    searchItems,
    searchSingleItems
};

// const searchItems = async () => {
//     try {
//       const response = await fetch("https://localhost:3333/search");
//       if (response.status !== 200) {
//         throw new Error("Something went wrong retrieving search results");
//       }
//       const resJson = await response.json();
//       return resJson;
//     } catch (err) {
//       console.log("Error", err);
//       throw err; // preserve rejection for caller
//     }
//   };