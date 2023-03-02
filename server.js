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

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle socket request from client
const connections = [null, null];
io.on("connection", socket => {
    console.log(`New socket connection: ${socket}`);

    // Find available player number
    let playerIndex = null;
    for (let i in connections) {
        if (!connections[i]) {
            playerIndex = i;
            break;
        }
    }
    // Notify client about player number
    socket.emit("player-number", playerIndex);
    console.log(`Player number #${playerIndex} connected`);

    // Ignore future connections if lobby full
    if (!playerIndex) return;
    
    // Fill player space
    connections[playerIndex] = true;
});