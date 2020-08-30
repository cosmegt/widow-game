function ready(callback){
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

// Start
/**
     * Socket Configuration and Set up
     */
socket = io('http://80.70.60.14:3000', { //TODO: Change this for production
    path: '/socket'
});

socket.on('addplayer', (data) => {
    console.log(data.username + " has joined.")
});

socket.on('connect', () => {
    console.log("your socket id: " + socket.id);
});

socket.on('updateBoard', (data) => {
    Controller.update_player_board(data)
})

socket.on("cards", (data) => {
    Controller.game_start(data);
})
socket.on("middle", (data) => {
    Controller.update_middle(data)
})
socket.on("turn", (data) => {
    Controller.update_turn_info(data);
})
socket.on("giveturn", () => {
    Controller.give_turn();
})

ready(function(){
    /**
     * Initiating classes
     */
    const   controller = new Controller;
            controller.setup();
});

class Controller{

    setup(){
        document.getElementById("join")
            .addEventListener("click", this.user_join_game );
        
        document.getElementById("ready")
            .addEventListener("click", this.set_player_ready);
        document.getElementById("next-turn")
            .addEventListener("click", this.pass_turn);
    }

    user_join_game(){
        let username = document.getElementById("username").value;
        let player = new Player(username)
        Game.join_game(player);
        // no callbacks here because i like to play dangerous
        Controller.remove_join_button();
        Controller.update_player_board(username);
        Controller.add_ready_button();
    }

    set_player_ready(){
        Game.set_player_ready();
    }

    pass_turn(){
        document.getElementById("next-turn").disabled = true;
        Game.pass_turn();
    }

    static remove_join_button(){
        document.getElementById("join").removeEventListener("click", this.user_join_game, false );
        document.getElementById("join").disabled = true;
        document.getElementById("username").disabled = true;
    }

    static add_ready_button(){
        document.getElementById("ready").disabled = false;
    }

    static update_player_board(arr){
        let num_of_players = arr.player_size;
        let players = arr.player_list
        document.getElementById("num_of_players").innerHTML = num_of_players;
        let HTML = "";
        for(let i in players){
            let is_ready = (players[i].is_ready === true) ? "Ready" : "Not Ready"
            HTML += `<li class="list-group-item">
                    ${players[i].username} - ${is_ready} </li>`
        };
        document.getElementById("player_board").innerHTML = HTML;
        if(num_of_players >= 6){
            document.getElementById("join").disabled = true;
        }
    }

    static game_start(cards){
        Controller.removeAllChildNodes(document.getElementById("card-container"));
        Controller.add_cards_to_middle();
        Controller.add_cards_to_deck(cards);
        Controller.show_game_info();
    }

    static add_cards_to_deck(deck){
        let CONTAINER_HTML = `<div class="image-container" id="image_container"></div>`;
        let CONTAINER = document.getElementById("card-container").innerHTML
        document.getElementById("card-container").innerHTML = CONTAINER + CONTAINER_HTML;
        for(let card of deck.deck){
            let IMG_ELEMENT = `<img class="home-cards" src="/images/${card}.png">`
            let img_container = document.getElementById("image_container");
            img_container.innerHTML = img_container.innerHTML + IMG_ELEMENT;
        }
    }

    static add_cards_to_middle(){
        let CONTAINER_HTML = `<div class="image-container" id="image_middle_container"></div>`
        document.getElementById("card-container").innerHTML = CONTAINER_HTML;
        for(let i = 0; i < 5; i++){
            let IMG_ELEMENT = `<img class="middle-cards" src="/images/gray_back.png">`
            let img_container = document.getElementById("image_middle_container");
            img_container.innerHTML = img_container.innerHTML + IMG_ELEMENT;
        }
    }

    static update_turn_info(data){
        let current_player = data.turn.username;
        document.getElementById("turn-info").innerHTML = current_player;
    }

    static show_game_info(){
        document.getElementById("game-info").style.opacity = "1";
    }

    static removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    static give_turn(){
        document.getElementById("next-turn").disabled = false;
    }

    static update_middle(){

    }

}   

class Game{

    static join_game(player){
        let username = player.get_name();
        socket.emit('addplayer', {
            id : socket.id,
            username : username
        })
    }
    static set_player_ready(){
        socket.emit("playerready", {
            ready: true
        });
    }
    static pass_turn(){
        console.log("passing turn")
        socket.emit("passturn", "next turn")
    }

}

class Player{
    constructor(name){
        this.name = name;
    }
    get_name(){
        return this.name
    }
}