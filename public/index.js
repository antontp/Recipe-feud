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

const controlsEl = document.getElementById("controls");
const dishDisplayEl = document.getElementById("dishDisplay");
const ingredientsDisplayEl = document.getElementById("ingredientsDisplay");

const minEl = document.getElementById("min");
const secEl = document.getElementById("sec");

// connection
var socket = null;
// game variables
var playerNum = -1;
var otherPlayerNum = -1;
// Score
var score = 0;
var otherScore = 0;

// Timer (Starts with 5 minutes each)
var min = 5;
var sec = 0;
var timer = null;

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
            case "full lobby": loadGame(); break;
            case "end": endGame(0); break;
            case playerNum: myTurn(); break;
            case (-1 * playerNum): endGame(-1*playerNum); break;
            case (-1 * otherPlayerNum): endGame(-1*otherPlayerNum); break;
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

    minEl.innerHTML = padZero(min);
    secEl.innerHTML = padZero(sec);
}

// Toggle buttons and change display
function myTurn() {
    console.log("-- MY TURN!");
    ingredientButtons.forEach(button => button.disabled = false);
    playerTurnEl.innerHTML = `It's your turn!`;

    // start timer
    timer = setInterval(() => {
        if (!min && !sec) socket.emit("timer", playerNum);
        else if (!sec) {
            min--;
            sec = 60;
        }
        if (sec) sec--;
        minEl.innerHTML = padZero(min);
        secEl.innerHTML = padZero(sec);
    }, 1000);
}
function notMyTurn() {
    console.log("-- NOT MY TURN");
    clearInterval(timer);
    ingredientButtons.forEach(button => button.disabled = true);
    playerTurnEl.innerHTML = `Waiting for the other player`;

    // Handle display if the other player answers right
    socket.once("ingredient-answer", (playerNumber, answer, guess) => {
        if (otherPlayerNum == playerNumber)
            console.log(`${otherPlayerNum} guessed and it was ${answer}!`);
        if (otherPlayerNum == playerNumber && answer) {
            otherScore++;
            otherScoreEl.innerHTML = `Other: ${otherScore} points`;
        }
        // Removing used button
        ingredientButtons.forEach(button => {
            if (button.value == guess) button.remove();
        })
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
        }
        // Removing used button
        button.remove();
    });
}

function endGame(type) {
    // close socket
    socket.close()
    // Removing game and displaying end game message
    controlsEl.style.display = "none";
    let endMessageEl = document.createElement("h2");

    if (type) {
        if (!(type+playerNum)) endMessageEl.innerHTML = `Timer out: You lost!`;
        else endMessageEl.innerHTML = `Other player's timer out: You win!`;
    }
    else if (score > otherScore) endMessageEl.innerHTML = `You won!`;
    else if (otherScore > score) endMessageEl.innerHTML = `You lost!`;
    else endMessageEl.innerHTML = `Draw!`;
    gameEl.appendChild(endMessageEl);
}