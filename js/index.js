const api_url_dish = 'https://www.themealdb.com/api/json/v1/1/random.php';
const api_url_ingredients = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';
// player 1 == true
// player 2 == false
var playerSwitch = true;

// Fetching DOM objects
const containerEl = document.getElementById("container");
const playerTurnEl = document.getElementById("playerTurn");
const dishDisplayEl = document.getElementById("dishDisplay");
const ingredientsDisplayEl = document.getElementById("ingredientsDisplay")

// Fetches data (promise => data)
async function fetchData(api_url) {
    return fetch(api_url)
        .then(async (promise) => await promise.json())
        .then((data) => data.meals)
        .catch(error => console.log(error))
}

// startup function
async function startup() {
    // Fetching ingredients
    const allIngredients = await fetchData(api_url_ingredients);
    postIngredients(allIngredients);
    console.log(allIngredients);
    // console.log(allIngredients.find(o => o.strIngredient == "Salmon"));

    // Fetching dish
    const dish = await fetchData(api_url_dish).then(data => data[0]);
    const dish_ingredients = filterIngredients(dish);
    postDish(dish);
    console.log(dish_ingredients);
    console.log(dish)
}

// Filters measures and ingredients
function filterIngredients(dish) {
    return Object.keys(dish)
        .filter(function (ingredient) {
            return ingredient.startsWith("strIngredient") && dish[ingredient];
        })
        .map(key => {
            return dish[key]
        })
        .sort();
}

function postDish(dish) {
    var nameEl = document.createElement("h1");
    nameEl.innerHTML = dish.strMeal;
    
    var imageEl = document.createElement("img");
    imageEl.src = dish.strMealThumb;
    imageEl.width = 400;
    imageEl.height = 400;

    dishDisplayEl.appendChild(nameEl);
    dishDisplayEl.appendChild(imageEl);
}
function postIngredients(ingredients) {
    ingredients.forEach(ingredient => {        
        let buttonEl = document.createElement("button");
        buttonEl.id = "ingredientButton";
        buttonEl.value = ingredient.strIngredient;
        buttonEl.innerHTML = ingredient.strIngredient;
        ingredientsDisplayEl.appendChild(buttonEl);
    })
}

startup();

