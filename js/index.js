const api_url = 'https://www.themealdb.com/api/json/v1/1/random.php';
var dishes = [];
var tries = parseInt((Math.random() * 10) + 5);

// Fetching DOM objects
const containerEl = document.getElementById("container");
const x = {
    container: document.getElementById("xDish"),
    name: document.getElementById("xName"),
    image: document.getElementById("xImg"),
    dish: {}
};
const y = {
    container: document.getElementById("yDish"),
    name: document.getElementById("yName"),
    image: document.getElementById("yImg"),
    dish: {}
};

// Fetches data (promise => data)
async function fetchData() {
    return fetch(api_url)
        .then(async (promise) => await promise.json())
        .then((data) => data.meals[0])
}

// Post meals to HTML
function postMeal(dish, meal) {
    dish.name.innerHTML = meal.strMeal;
    dish.image.src = meal.strMealThumb;
    dish.dish = meal;
    // TODO: Catch error
}

// Fills dishes to always have 3 dishes
async function fillDishes() {
    while (dishes.length < 3) {
        dishes.unshift(await fetchData());
    }
}

// startup function
async function startup() {
    // Fetching dishes
    await fillDishes()
    // Posting to html
    postMeal(x, dishes.pop());
    postMeal(y, dishes.pop());

    //Adding onClick events
    x.container.addEventListener("click", () => {handleClick(x, y)});
    y.container.addEventListener("click", () => {handleClick(y, x)});
}

//Handle click
function handleClick(selectedDish, unwantedDish) {
    postMeal(unwantedDish, dishes.pop());
    fillDishes();
    tries--;
    console.log(tries);
    if (tries == 0) end(selectedDish);
}

// Shows chosen recipe
function end(dish) {
    // clear container and styling
    containerEl.innerHTML = null;
    containerEl.style.color = "bisque";
    containerEl.style.flexDirection = "column";
    containerEl.style.alignItems = "center";
    containerEl.style.gap = "0";

    dish.image.width = "500";

    containerEl.appendChild(dish.name);
    containerEl.appendChild(dish.image);
    containerEl.appendChild(getIngredients(dish.dish));
    containerEl.appendChild(getInstructions(dish.dish));
    
    // Reload button
    var buttonEl = document.createElement("button");
    buttonEl.innerHTML = "Pick again";
    buttonEl.onclick = () => location.reload();
    containerEl.appendChild(buttonEl);
}

// filters measures and ingredients
function getIngredients(dish) {
    var measures = Object.keys(dish).filter(function (measure) {
        return measure.startsWith("strMeasure") && dish[measure];
    })
    var ingredients = Object.keys(dish).filter(function (ingredient) {
        return ingredient.startsWith("strIngredient") && dish[ingredient];
    })
    
    var listEl = document.createElement("ul");
    for (let i = 0; i < ingredients.length; i++) {
        var liEl = document.createElement("li");
        liEl.innerHTML = dish[measures[i]] + " - " + dish[ingredients[i]];
        listEl.appendChild(liEl);
    }
    console.log(measures);
    console.log(ingredients)
    return listEl;
}

// Formats instructions
function getInstructions(dish) {
    var instructions = dish.strInstructions;
    var insEl = document.createElement("p");
    insEl.innerHTML = instructions.replaceAll('.', ".<br>");
    return insEl;
}

startup()

