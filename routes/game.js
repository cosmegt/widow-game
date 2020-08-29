module.exports = class Game{
    constructor(){
        this.player_size = 0;
        this.players = [];
        this.cards = [
            "diamonds_a", "diamonds_2", "diamonds_3",
            "diamonds_4", "diamonds_5", "diamonds_6",
            "diamonds_7", "diamonds_8", "diamonds_9",
            "diamonds_10", "diamonds_j", "diamonds_q", "diamonds_k",

            "spades_a", "spades_2", "spades_3",
            "spades_4", "spades_5", "spades_6",
            "spades_7", "spades_8", "spades_9",
            "spades_10", "spades_j", "spades_q", "spades_k",

            "hearts_a", "hearts_2", "hearts_3",
            "hearts_4", "hearts_5", "hearts_6",
            "hearts_7", "hearts_8", "hearts_9",
            "hearts_10", "hearts_j", "hearts_q", "hearts_k",

            "clubs_a", "clubs_2", "clubs_3",
            "clubs_4", "clubs_5", "clubs_6",
            "clubs_7", "clubs_8", "clubs_9",
            "clubs_10", "clubs_j", "clubs_q", "clubs_k"
        ];
    }

    addPlayer(id, username){
        this.player_size++;
        this.players.push(id = {
            username : username,
            id : id,
            is_ready: false
        } )
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
                username : element.username,
                is_ready : element.is_ready
            }
            player_list.push(arr);
            player_num++;
        });
        return { 
            player_list : player_list ,
            player_size : player_num,
        };
    }

    get_deck() {
        return this.cards;
    }
    get_shuffled_deck() {
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