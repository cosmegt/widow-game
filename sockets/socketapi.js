const Game = require("../routes/game");
const socket_io = require('socket.io');

var game = new Game;
var io = socket_io();
var socket = {};
socket.io = io;


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('gameroom', (data) => {
        game.addPlayer(data.username);
        io.sockets.emit('gameroom', data)
    })
});

module.exports = socket;