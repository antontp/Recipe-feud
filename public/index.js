// Importing game-data processing functions
// const lib = require("./lib");
// const filterIngredients = lib.filterIngredients;
// const postDish = lib.postDish;
// const postIngredients = lib.postIngredients;

// game data
var ingredients = null;
var dish = null;
var ingredientButtons = [];

const feedbackEl = document.getElementById("feedback");
const lobbyEl = document.getElementById("lobby");
const joinButtonEl = document.getElementById("join");

const gameEl = document.getElementById("game");
const numIngredientsEl = document.getElementById("numIngredients");
const playerTurnEl = document.getElementById("playerTurn");

const myScoreEl = document.getElementById("myScore");
const otherScoreEl = document.getElementById("otherScore");

const dishDisplayEl = document.getElementById("dishDisplay");
const ingredientsDisplayEl = document.getElementById("ingredientsDisplay");

// connection
var socket = null;
// game variables
var playerNum = -1;
var otherPlayerNum = -1;
// Score
var score = 0;
var otherScore = 0;

function startClient() {
    console.log(" * -- CLIENT STARTING -- * ");
    socket = io();
    // Get game spot from server
    socket.once("game-spot", spot => {
        if (!spot) {
            console.log("NO SPOT: RETURNED");
            feedbackEl.innerHTML = "No space, server full lah";
            joinButtonEl.style.display = "none";
        }
        else {
            console.log(`You got player a spot ${spot}`);
            playerNum = spot;
            if (playerNum == 1) otherPlayerNum = 2;
            else otherPlayerNum = 1;
        }
    });

    // Get game data from server
    socket.once("game-data", (serverIngredients, serverDish, ingredientsLeft) => {
        ingredients = serverIngredients;
        dish = serverDish;
        numIngredientsEl.innerHTML = `Ingredients left: ${ingredientsLeft}`;
        console.log(" -- GAME DATA LOADED!");
    });

    // Handle gameStates
    socket.on("game-state", msg => {
        console.log(` -- RECEIVED GAME-STATE: ${msg}`);
        switch(msg) {
            case "waiting for players": loadLobby(); break;
            case playerNum: myTurn(); break;
            case "full lobby": loadGame(); break;
            default: notMyTurn();
        }
    });

    // Listen to ingredients left from server
    socket.on("ingredients-left", num => {
        numIngredientsEl.innerHTML = `Ingredients left: ${num}`;
    });

}

function loadLobby() {
    joinButtonEl.style.display = "none";
    feedbackEl.innerHTML = "Looking for opponent!";
}

function loadGame() {
    console.log(` -- LOAD GAME... -- `);
    lobbyEl.style.display = "none";
    gameEl.style.display = "block";
    postDish(dish);
    postIngredients(ingredients);
    ingredientButtons = document.querySelectorAll(".ingredientButton");
}

// Toggle buttons and change display
function myTurn() {
    console.log("-- MY TURN!");
    ingredientButtons.forEach(button => button.disabled = false);
    playerTurnEl.innerHTML = `It's your turn!`;
}
function notMyTurn() {
    console.log("-- NOT MY TURN");
    ingredientButtons.forEach(button => button.disabled = true);
    playerTurnEl.innerHTML = `Waiting for the other player`;

    // Handle display if the other player answers right
    socket.once("ingredient-answer", (playerNumber, answer, guess) => {
        if (otherPlayerNum == playerNumber)
            console.log(`${otherPlayerNum} guessed and it was ${answer}!`);

        if (otherPlayerNum == playerNumber && answer) {
            otherScore++;
            otherScoreEl.innerHTML = `Other: ${otherScore} points`;
            
            // Removing used button
            ingredientButtons.forEach(button => {
                if (button.value == guess) button.remove();
            })
        }
    });
}

function handleTurn(button) {
    // Sending answer to Server
    console.log(`(Sending ${button.value}) to SERVER)`);
    socket.emit("ingredient-guess", button.value);

    // Listen if the answer is right or wrong
    socket.once("ingredient-answer", (playerNumber, answer, guess) => {
        console.log(`${playerNumber}: ${button.value} was ${answer}!`);
        if (playerNumber == playerNum && answer) {
            score++;
            myScoreEl.innerHTML = `You: ${score} points`;
            // Removing used button
            button.remove();
        }
    });
}