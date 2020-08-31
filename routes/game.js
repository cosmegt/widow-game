var Hand = require('pokersolver').Hand;

module.exports = class Game{
    constructor(){
        this.player_size = 0;
        this.players = [];
        this.cards = [
            "AceD", "2D", "3D",
            "4D", "5D", "6D",
            "7D", "8D", "9D",
            "TD", "JD", "QD", "KD",

            "AceS", "2S", "3S",
            "4S", "5S", "6S",
            "7S", "8S", "9S",
            "TS", "JS", "QS", "KS",

            "AceH", "2H", "3H",
            "4H", "5H", "6H",
            "7H", "8H", "9H",
            "TH", "JH", "QH", "KH",

            "AceC", "2C", "3C",
            "4C", "5C", "6C",
            "7C", "8C", "9C",
            "TC", "JC", "QC", "KC",
        ];
        this.middle_deck = [];
        this.turn = 0;
        this.buffer;
    }

    computerWinner(){
        let players = this.players;
        let all_hands = [];
        for(let i in players){
            let current = Hand.solve(players[i].deck)
                current.username = players[i].username
            all_hands.push(current)
        }
        let best = Hand.winners(all_hands)
        let winner = best[0]
        return winner

    }

    getTurn(){
        return this.turn;
    }
    setTurn(val){
        this.turn = val;
    }
    getBuffer(){
        return this.buffer
    }
    setBuffer(val){
        this.buffer = val;
    }

    addPlayer(id, username){
        this.player_size++;
        this.players.push(id = {
            username : username,
            id : id,
            is_ready: false,
            deck : []
        } )
    }

    getPlayerIndexById(id){
        let players = this.players;
        let index = -1;
        players.find(function(item, i){
            if (item != undefined) {
                if(id === item.id){
                    index = i;
                    return i;
                }
            }
          });
        return index;
    }

    deletePlayer(id){
        let players = this.players;
        let index = -1;
        players.find(function(item, i){
            if (item != undefined) {
                if(id === item.id){
                    index = i;
                    players.splice(i, 1);
                }
            }
          });
    }

    playerReady(id){
        let players = this.players;
        let index = -1;
        players.find(function(item, i){
            if (item != undefined) {
                if(id === item.id){
                    index = i;
                    players[i].is_ready = true;
                }
            }
          });
    }

    getPlayerList(){
        let player_list = [];
        let player_num = 0;
        this.players.forEach(element => {
            let arr = {
                username    : element.username,
                is_ready    : element.is_ready,
                id          : element.id,
            }
            player_list.push(arr);
            player_num++;
        });
        return { 
            player_list : player_list ,
            player_size : player_num,
        };
    }

    getPlayerDeckById(id){
        let players = this.players;
        let index = this.getPlayerIndexById(id);
        return players[index].deck;
    }

    setDeckToPlayer(id, deck){
        let players = this.players;
        let index = this.getPlayerIndexById(id);
            players[index].deck = deck;
    }
    
    setMiddleDeck(arr){
        this.middle_deck = arr;
    }

    swapCards(arr, id){
        let player_index = this.getPlayerIndexById(id);
        let players = this.players;

        let user_card_index = players[player_index].deck.indexOf(arr[0]);
        players[player_index].deck[user_card_index] = arr[1];

        let middle_deck = this.middle_deck;
        let middle_card_index = middle_deck.indexOf(arr[1]);
        middle_deck[middle_card_index] = arr[0];

    }

    getMiddleDeck(){
        return this.middle_deck;
    }

    getDeck() {
        return this.cards;
    }
    getShuffledDeck() {
        let deck = this.cards;
        var currentIndex = deck.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = deck[currentIndex];
          deck[currentIndex] = deck[randomIndex];
          deck[randomIndex] = temporaryValue;
        }
      
        return deck;
    }
    
}