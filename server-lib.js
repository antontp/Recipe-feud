// Fetches data (promise => data)
async function fetchData(api_url) {
    return fetch(api_url)
        .then(async (promise) => await promise.json())
        .then((data) => data.meals)
        .catch(error => console.log(error))
}

module.exports = { fetchData };
