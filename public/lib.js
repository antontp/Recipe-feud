function postDish(dish) {
    var nameEl = document.createElement("h1");
    nameEl.innerHTML = dish.strMeal.italics();
    
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
        buttonEl.classList.add("ingredientButton");
        buttonEl.value = ingredient.strIngredient.toLowerCase();
        buttonEl.innerHTML = ingredient.strIngredient;
        buttonEl.setAttribute("onclick", "handleTurn(this)");
        ingredientsDisplayEl.appendChild(buttonEl);
    })
}
