// Fetches data (promise => data)
const fetch = require("node-fetch");

async function fetchData(api_url) {
    return fetch(api_url)
        .then(async (promise) => await promise.json())
        .then((data) => data.meals)
        .catch(error => console.log(error))
}

// Filters measures and ingredients on dish
function filterIngredients(dish) {
    return Object.keys(dish)
        .filter(function (ingredient) {
            return ingredient.startsWith("strIngredient") && dish[ingredient];
        })
        .map(key => {
            return dish[key].toLowerCase();
        })
        .sort(); 
}

// change player turn
function changeTurn(currentPlayer) {
    if (currentPlayer == 1) return 2;
    else return 1;
}

module.exports = { fetchData, filterIngredients, changeTurn };
