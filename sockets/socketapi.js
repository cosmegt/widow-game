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
    socket.on("playerready", () => {
        game.playerReady(socket.id);
        updateBoard();
        let all_ready = are_all_ready();
        console.log(all_ready);
    })

    socket.on("disconnect", (data) => {
        console.log("A user disconnected " + data);
        game.deletePlayer(socket.id);
        updateBoard();
    })
});

function updateBoard(){
    io.sockets.emit("updateBoard", game.getPlayerList())
}

function are_all_ready(){
    let list = game.getPlayerList();
    let all_true = 0;
    for(let i = 0; i < list.player_size; i++){
        all_true += list.player_list[i].is_ready;
    }
    return (all_true === list.player_size && all_true > 1)
}

module.exports = socket;