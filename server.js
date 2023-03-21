// Importing game processing functions
const lib = require("./server-lib");
const fetchData = lib.fetchData;
const filterIngredients = lib.filterIngredients;
const changeTurn = lib.changeTurn;

// API urls
const api_url_dish = "https://www.themealdb.com/api/json/v1/1/random.php";
const api_url_ingredients =
  "https://www.themealdb.com/api/json/v1/1/list.php?i=list";

// Importing packages
const express = require("express");
const path = require("path");
const http = require("http");

// Init server and socket
const PORT = 3000;
const app = express();
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
// https://nm2207.online/apps/AntonTinPhan-nm2207.github.io/index.html
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://antontinphan-nm2207.github.io/",
      "http://127.0.0.1:8080/",
      "http://localhost:8000/",
    ],
    credentials: true,
  },
});

// Gamedata
const ingredients = [];
const dish = {};
const dishIngredients = [];

// State variables
var gameState = "";
var playerTurn = 1;

// Set static folder
// app.use(express.static(path.join(__dirname, "public")));

// Fetches game data and starts server
fetchData(api_url_ingredients)
  .then((dataIngredients) => ingredients.push(...dataIngredients))
  .then(() => fetchData(api_url_dish))
  .then((gameDish) => {
    Object.assign(dish, gameDish[0]);
    dishIngredients.push(...filterIngredients(gameDish[0]));
    console.log(dishIngredients);
  })
  .finally(
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  );

// test GET request
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Handle socket request from client
const connections = [];
io.on("connection", (socket) => {
  console.log(`- New socket connection!`);

  // Find available player spot
  var playerNum = null;
  if (connections.length < 2) {
    connections.push(connections.length);
    // # 1 || # 2
    playerNum = connections.length;
  }

  console.log("game-lobby: ");
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
  socket.emit("game-data", ingredients, dish, dishIngredients.length);

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
  });

  // start game
  if (gameState == "full lobby") {
    console.log(`TURN: Player # ${playerTurn}`);
    io.emit("game-state", playerTurn);
  }

  // Listen to player guess;
  socket.on("ingredient-guess", (guess) => {
    console.log(`player ${playerTurn} guessed ${guess}`);
    // Notify players about answer
    io.emit(
      "ingredient-answer",
      playerTurn,
      dishIngredients.includes(guess),
      guess
    );

    // Removes ingredient from the ingredient dish list if correct
    if (dishIngredients.includes(guess)) {
      dishIngredients.splice(dishIngredients.indexOf(guess), 1);
      io.emit("ingredients-left", dishIngredients.length);

      // Check if there is ingredients left; if not => end game show results
      if (!dishIngredients.length) {
        gameState = "end";
        io.emit("game-state", gameState);

        // Shut down server
        console.log("..Server shutdown..");
        io.disconnectSockets();
        io.close();
      }
    }
    // Change player turn
    playerTurn = changeTurn(playerTurn);
    console.log(`TURN: Player # ${playerTurn}`);
    io.emit("game-state", playerTurn);
  });

  // Listen for timer (playerNum who timer went out)
  socket.once("timer", (player) => {
    io.emit("game-state", -1 * player);
    // Shut down server
    console.log("..Server shutdown..");
    io.disconnectSockets();
    io.close();
  });
});
