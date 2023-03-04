// Filters measures and ingredients on dish
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
