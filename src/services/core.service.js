const searchItems = () => {
    return fetch("https://localhost:3333/search")
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else {
            throw "Something went wrong retriving search results";
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
    searchItems
};