var socket_io = require('socket.io');
var io = socket_io();
var socket = {};

socket.io = io;

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit("message", chatmessage("Server", "Welcome"));

    socket.on('chat', (data) => {
        io.sockets.emit('chat', data)
    })
});

const chatmessage = (from, text) => {
    return {
        from,
        text,
        time: new Date().getTime()
    }
}
module.exports = socket;