// Importing game-data processing functions
const lib = require("./lib")
const fetchData = lib.fetchData;

// API urls
const api_url_dish = 'https://www.themealdb.com/api/json/v1/1/random.php';
const api_url_ingredients = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';

// Importing packages
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// Init server and socket
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Gamedata
const ingredients = []
const dish = {}

// State variables
var gameState = "";

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Fetches game data and starts server
fetchData(api_url_ingredients)
.then(dataIngredients => ingredients.push(...dataIngredients))
.then(() => fetchData(api_url_dish))
.then(gameDish => Object.assign(dish, gameDish[0]))
.finally(
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
);

// Handle socket request from client
const connections = [];
io.on("connection", socket => {
    console.log(`New socket connection:`);

    // Find available player spot
    var playerNum = null;
    if (connections.length < 2) {
        connections.push(connections.length);
        // # 1 || # 2
        playerNum = connections.length;
    }

    console.log(connections);

    // Notify client about player spot
    socket.emit("game-spot", playerNum);

    // Ignore future connections if lobby full
    if (!playerNum) {
        console.log(`(sending a player away...)`);
        return;
    }
    console.log(`Player # ${playerNum} connected`);
    // Send game data
    socket.emit("game-data", ingredients, dish);

    // If the joining player is the last player
    if (connections.length == 2) gameState = "full lobby";
    else gameState = "waiting for players";

    // Notify lobby of gameStates
    io.emit("game-state", gameState);

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log(playerNum + " has diconnected");
        connections.shift();
        console.log(connections);
    })
});
