// Importing game-data processing functions
// const lib = require("./lib");
// const filterIngredients = lib.filterIngredients;
// const postDish = lib.postDish;
// const postIngredients = lib.postIngredients;

// game data
var ingredients = null;
var dish = null;

const feedbackEl = document.getElementById("feedback");
const lobbyEl = document.getElementById("lobby");
const joinButtonEl = document.getElementById("join");
const gameEl = document.getElementById("game");
const dishDisplayEl = document.getElementById("dishDisplay");
const ingredientsDisplayEl = document.getElementById("ingredientsDisplay");

// game variables
var playerNum = -1;

function startClient() {
    console.log(" * -- CLIENT STARTING -- * ");
    const socket = io();
    // Get game spot from server
    socket.on("game-spot", spot => {
        if (!spot) {
            console.log("NO SPOT: RETURNED");
            feedbackEl.innerHTML = "No space, server full lah";
            joinButtonEl.style.display = "none";
            return;
        }
        else {
            console.log(`You got player a spot ${spot}`);
        }
    });

    // Get game data from server
    socket.on("game-data", (serverIngredients, serverDish) => {
        ingredients = serverIngredients;
        dish = serverDish;
        console.log(ingredients);
        console.log(dish);
        console.log(" -- GAME DATA LOADED!");
    });

    // Handle gameStates
    socket.on("game-state", msg => {
        console.log(` -- RECEIVED GAME-STATE ${msg}`);
        switch(msg) {
            case "waiting for players": loadLobby(); break;
            // case "full lobby": loadGame(); break;
            default: loadGame();
        }
    })
}

function loadLobby() {
    joinButtonEl.style.display = "none";
    feedbackEl.innerHTML = "Looking for opponent!";
}

function loadGame() {
    console.log(` -- LOAD GAME... -- `);
    lobbyEl.style.display = "none";
    gameEl.style.display = "flex";
    postDish(dish);
}