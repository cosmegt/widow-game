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
        let all_ready = areAllReady();
        if(all_ready){
            startGame(gameLoop);
        }
    })
    socket.on("disconnect", (data) => {
        console.log("A user disconnected " + data);
        game.deletePlayer(socket.id);
        updateBoard();
    });
    socket.on("swapall", (data) => {
        let middle_deck = game.getMiddleDeck();
        game.setDeckToPlayer(socket.id, middle_deck);
        game.setMiddleDeck(data);
        sendToUserById(socket.id, "updatedeck", game.getPlayerDeckById(socket.id))
    })
    socket.on("middle", (data) => {
        sendToEveryone("middle", data)
    })
    socket.on("passturn", () => {
        gameLoop();
    })

    function gameLoop(){
        let turn = game.getTurn();
        let players = game.getPlayerList();
        let current_player = players.player_list[turn];
        let middle_deck = game.getMiddleDeck();
        sendToEveryone("updateturn", { turn : current_player })
        sendToEveryone("middleupdate", { middle_deck : middle_deck } );
        sendToUserById(current_player.id ,"giveturn", { turn : true })

        turn = (turn++ < (players.player_size-1)) ? turn++ : 0;
        game.setTurn(turn);
    }
});

function updateBoard(){
    io.sockets.emit("updateboard", game.getPlayerList())
}

function areAllReady(){
    let list = game.getPlayerList();
    let all_true = 0;
    for(let i = 0; i < list.player_size; i++){
        all_true += list.player_list[i].is_ready;
    }
    return (all_true === list.player_size && all_true > 1)
}

function sendToUserById(id, type, message){
    io.to(id).emit(type, message)
}
function sendToEveryone(type, message){
    io.emit(type, message)
}


function startGame(callback){
    // Split cards
    let shuffled_deck = game.getShuffledDeck();
    let players = game.getPlayerList();
    
    for(let i = 0; i < players.player_size; i++){
        range = ((i+1)*5)
        let deck = [ 
                    shuffled_deck[0+range],
                    shuffled_deck[1+range],
                    shuffled_deck[2+range],
                    shuffled_deck[3+range],
                    shuffled_deck[4+range]
                    ]
        let id = players.player_list[i].id;
        sendToUserById(id, "startgame", { deck : deck });
        game.setDeckToPlayer(id, {deck : deck})
    }
    let max_range = ((1+players.player_size)*5)
    middle_deck = [
                    shuffled_deck[0+max_range],
                    shuffled_deck[1+max_range],
                    shuffled_deck[2+max_range],
                    shuffled_deck[3+max_range],
                    shuffled_deck[4+max_range]
                ]
    game.setMiddleDeck(middle_deck);
    callback()
}

module.exports = socket;