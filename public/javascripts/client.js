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
ready(function(){
    /**
     * Socket Configuration and Set up
     */
    socket = io('http://80.70.60.14:3000', { //TODO: Change this for production
        path: '/socket'
    });

    socket.on('gameroom', (data) => {
        console.log(data.username + " has joined.")
    });

    socket.on('connect', () => {
        console.log("your socket id: " + socket.id);
    });
    /**
     * Initiating classes
     */
    const controller = new Controller;
    
});

class Controller{
    constructor(){
        this.active_listeners();
    }

    active_listeners(){
        document.getElementById("join").addEventListener("click", () => {
            let username = document.getElementById("username").value;
            let player = new Player(username)
            Game.join_game(player);
        })
    }
}   

class Game{
    constructor(){
    }

    static join_game(player, id){
        let username = player.get_name();
        socket.emit('gameroom', {
            username: username,
            id : socket.id
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