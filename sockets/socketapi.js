const Game = require("../routes/game");
const socket_io = require('socket.io');

var game = new Game;
var io = socket_io();
var socket = {};
socket.io = io;


io.on('connection', (socket) => {
    console.log('A user connected');
    updateBoard();

    socket.on('addplayer', (data) => {
        io.sockets.emit('addplayer', data)
        game.addPlayer(data.id, data.username);
        updateBoard();
    });
});

function updateBoard(){
    io.sockets.emit("updateBoard", game.getPlayerList())
}

module.exports = socket;