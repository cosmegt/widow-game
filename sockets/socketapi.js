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
        sendToEveryone('addplayer', data)
        game.addPlayer(data.id, data.username);
        updateBoard();
    });
    socket.on("playerready", () => {
        game.playerReady(socket.id);
        updateBoard();
        let all_ready = areAllReady();
        if(all_ready){
            startGame(gameLoop);
            sendLog("Game has started");
        }
    })
    socket.on("disconnect", (data) => {
        console.log("A user disconnected " + data);
        game.deletePlayer(socket.id);
        updateBoard();
    });
    socket.on("middle", (data) => {
        sendToEveryone("middle", data)
    })
    socket.on("swapcards", (data) => {
        game.swapCards(data, socket.id);
        let middle_deck = game.getMiddleDeck();
        sendToEveryone("updatemiddle", middle_deck);
    })
    socket.on("passturn", () => {
        gameLoop();
    })
    socket.on("setbuffer", () => {
        game.setBuffer(game.getTurn()-1);
        sendLog("Someone Knocked. Final Round.")
    })
    socket.on("knock", () => {
        lastRound();
    })

    function gameLoop(){
        let turn = game.getTurn();
        let players = game.getPlayerList();
        let current_player = players.player_list[turn];

        sendToEveryone("updateturn", { turn : current_player })
        sendToEveryone("updatemiddle", middle_deck )
        
        sendToUserById(current_player.id ,"giveturn", { turn : true })

        turn = (turn++ < (players.player_size-1)) ? turn++ : 0;
        game.setTurn(turn);
    }

    function lastRound(){
        let turn = game.getTurn();

        let players = game.getPlayerList();
        let buffer  = game.getBuffer();
        
        let compute = (turn != buffer);
        if(compute){
            if(turn == players.player_size){
                turn = 0
                let current_player = players.player_list[turn];
                proceed(current_player)
            }
            else{
                let current_player = players.player_list[turn];
                proceed(current_player)
                turn++
            }
        }
        else{
            endGame()
        }
        
        function proceed(current_player){
            sendToEveryone("updateturn", { turn : current_player })
            sendToEveryone("updatemiddle", middle_deck)

            sendToUserById(current_player.id ,"lastturn", { turn : true })
        }
    }

    function endGame(){
        sendLog("Game had ended");
        let winner = game.computerWinner();
        sendToEveryone("winner", winner);
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
function sendLog(message){
    io.emit("log", message);
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
        sendToUserById(id, "startgame", deck);
        game.setDeckToPlayer(id, deck)
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