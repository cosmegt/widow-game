module.exports = class Game{
    constructor(){
        this.player_size = 0;
        this.players = [];
        this.cards = [
            "AceD", "2D", "3D",
            "4D", "5D", "6D",
            "7D", "8D", "9D",
            "10D", "JD", "QD", "KD",

            "AceS", "2S", "3S",
            "4S", "5S", "6S",
            "7S", "8S", "9S",
            "10S", "JS", "QS", "KS",

            "AceH", "2H", "3H",
            "4H", "5H", "6H",
            "7H", "8H", "9H",
            "10H", "JH", "QH", "KH",

            "AceC", "2C", "3C",
            "4C", "5C", "6C",
            "7C", "8C", "9C",
            "10C", "JC", "QC", "KC",
        ];
        this.middle_deck = [];
        this.turn = 0;
    }

    getTurn(){
        return this.turn;
    }
    setTurn(val){
        this.turn = val;
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
        let middle_deck = this.middle_deck;
        middle_deck = arr;
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