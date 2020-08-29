var socket_io = require('socket.io');
var io = socket_io();
var socket = {};

socket.io = io;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('gameroom', (data) => {
        io.sockets.emit('gameroom', data)
    })
});


module.exports = socket;