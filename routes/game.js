var express = require("express");
var router = express.Router();

class Game{
    constructor(){
        let player_number = 0;
        let players = [];
    }

    static addPlayer(username, id){
        Game.player_number++;
        Game.players.push({ id: username })
    }

}

router.get("/")

module.exports = { Game , router};