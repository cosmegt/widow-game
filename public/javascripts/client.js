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
            .addEventListener("click", this.user_join_game )
    }

    user_join_game(){
        let username = document.getElementById("username").value;
        let player = new Player(username)
        Game.join_game(player);
        // no callbacks here because i like to play dangerous
        Controller.remove_join_button();
        Controller.update_player_board(username)
    }

    static remove_join_button(){
        document.getElementById("join").removeEventListener("click", this.user_join_game, false );
        document.getElementById("join").disabled = true;
        document.getElementById("username").disabled = true;
    }

    static update_player_board(arr){
        console.log(arr)
        let num_of_players = arr.player_size;
        let players = arr.players
        document.getElementById("num_of_players").innerHTML = num_of_players;
        let HTML = "";
        for(let i in players){
            HTML += `<li class="list-group-item">${players[i]}</li>`
        };
        document.getElementById("player_board").innerHTML = HTML;
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
}

class Player{
    constructor(name){
        this.name = name;
    }
    get_name(){
        return this.name
    }
}