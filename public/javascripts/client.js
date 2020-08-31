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
socket = io("http://80.70.60.14:3000", { //TODO: Change this for production
    path: '/socket'
});

socket.on('connect', () => {
    console.log("your socket id: " + socket.id);
});

socket.on('addplayer', (data) => {
    console.log(data.username + " has joined.")
});

socket.on('updateboard', (data) => {
    Controller.update_player_board(data)
})

socket.on("startgame", (data) => {
    Controller.game_start(data);
})
socket.on("updatemiddle", (data) => {
    Controller.update_cards_to_middle(data)
})

socket.on("updateturn", (data) => {
    Controller.update_turn_info(data);
})
socket.on("giveturn", () => {
    Controller.give_turn();
})
socket.on("lastturn", () => {
    console.log("request")
    Controller.last_turn();
})
socket.on("log", (msg) => {
    Controller.logger(msg);
})
socket.on("winner", (msg) => {
    window.alert("Congratulations, " + msg.username)
    Controller.logger(msg.username + " won with " + msg.descr );
})
socket.on("debug", (msg) => {
    console.log(msg)
})

ready(function(){
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
        document.getElementById("knock")
            .addEventListener("click", this.pass_knock);
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
        document.getElementById("swap-cards").disabled = true;
        document.getElementById("next-turn").disabled = true;
        document.getElementById("knock").disabled = true;
        Game.pass_turn();
    }

    pass_knock(){
        document.getElementById("swap-cards").disabled = true;
        document.getElementById("knock").disabled = true;
        document.getElementById("next-turn").disabled = true;
        Game.knock();
    }
    static pass_last(){
        document.getElementById("swap-cards").disabled = true;
        document.getElementById("knock").disabled = true;
        document.getElementById("next-turn").disabled = true;
        Game.pass_last();
    }


    static game_start(cards){
        Controller.removeAllChildNodes(document.getElementById("card-container"));
        Controller.add_cards_to_middle();
        Controller.add_cards_to_deck(cards);
        Controller.show_game_info();
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

    static add_cards_to_deck(deck){
        let CONTAINER_HTML = `<h4>Your Cards</h4><div class="image-container" id="image_container"></div>`;
        let CONTAINER = document.getElementById("card-container").innerHTML
        document.getElementById("card-container").innerHTML = CONTAINER + CONTAINER_HTML;
        for(let card of deck){
            let IMG_ELEMENT = `<img class="home-cards" id="${card}" src="/images/${card}.png">`
            let img_container = document.getElementById("image_container");
            img_container.innerHTML = img_container.innerHTML + IMG_ELEMENT;
        }
    }

    static add_cards_to_middle(){
        let CONTAINER_HTML = `<h4>Middle Cards</h4><div class="image-container" id="image_middle_container"></div>`
        document.getElementById("card-container").innerHTML = CONTAINER_HTML;
        for(let i = 0; i < 5; i++){
            let IMG_ELEMENT = `<img class="middle-cards" src="/images/gray_back.png">`
            let img_container = document.getElementById("image_middle_container");
            img_container.innerHTML = img_container.innerHTML + IMG_ELEMENT;
        }
    }

    static update_cards_to_middle(deck){
        for (let i in deck){
            let current_image = $("#image_middle_container").children().eq(i);
            let url = `/images/${deck[i]}.png`;
            let id = deck[i];
            Controller.update_image_source(current_image, url, id);
        }
    }

    static update_turn_info(data){
        let current_player = data.turn.username;
        $("#turn-info").html(current_player + "'s Turn.");
    }

    static update_image_source(image, url, id){
        image.attr("src", url);
        image.attr("id", id);
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
        document.getElementById("swap-cards").disabled = false;
        document.getElementById("knock").disabled = false;
        document.getElementById("next-turn").disabled = false
        
        $(document).on("click", ".home-cards", Controller.handle_home_click)
        $(document).on("click", ".middle-cards", Controller.handle_middle_click)
        $(document).on("click", "#swap-cards", Controller.handle_swap)
    }

    static last_turn(){
        document.getElementById("swap-cards").disabled = false;
        document.getElementById("knock").disabled = true;
        document.getElementById("next-turn").disabled = false;
        $("#next-turn").html("Final Turn")
        $(document).off("click", "#swap-cards", Controller.handle_swap);
        $("#next-turn").on("click", () => {
            Controller.pass_last();
        })
        
        $(document).on("click", ".home-cards", Controller.handle_home_click)
        $(document).on("click", ".middle-cards", Controller.handle_middle_click)
        $("#swap-cards").on("click", () => {
            Controller.handle_swap_no_remove();
        })
    }

    static handle_home_click(){
        $(".home-cards").not(this).css("border", "none")
        $(".home-cards").not(this).removeClass("selected")

        $(this).css("border", "2px dashed black");;
        $(this).addClass("selected");
    }

    static handle_middle_click(){
        $(".middle-cards").not(this).css("border", "none");
        $(".middle-cards").not(this).removeClass("selected")

        $(this).css("border", "2px dashed black");
        $(this).addClass("selected");
    }

    static handle_swap(){
        if($(".home-cards.selected").attr("id") != undefined 
        && $(".middle-cards.selected").attr("id") != undefined)
        {
            $("#swap-cards").prop("disabled", true);

            Game.swap_cards($(".home-cards.selected").attr("id"),$(".middle-cards.selected").attr("id"));
            Controller.swap_cards($(".home-cards.selected"), $(".middle-cards.selected"))
            
            Controller.remove_turn();
        }
        else{
            window.alert("You need to select two cards");
        }
    }
    static handle_swap_no_remove(){
        if($(".home-cards.selected").attr("id") != undefined 
        && $(".middle-cards.selected").attr("id") != undefined)
        {
            $("#knock").prop("disabled", true);
            $("#swap-cards").prop("disabled",true);
            Game.swap_cards($(".home-cards.selected").attr("id"),$(".middle-cards.selected").attr("id"));
            Controller.swap_cards($(".home-cards.selected"), $(".middle-cards.selected"))

        }
        else{
            window.alert("You need to select two cards");
        }
    }

    static swap_cards(card1, card2){

        let url_for_2 = card1.attr('src');
        let url_for_1 = card2.attr("src");

        let id_for_2 = card1.attr("id");
        let id_for_1 = card2.attr("id");

        card1.attr("src", url_for_1);
        card1.attr("id", id_for_1);

        card2.attr("src", url_for_2);
        card2.attr("id", id_for_2);

    }

    static remove_turn(){
        document.getElementsByClassName("home-cards")
            .removeEventListener("click", Controller.handle_home_click, true);
        document.getElementsByClassName("middle-cards")
            .removeEventListener("click", Controller.handle_middle_click, true)
        document.getElementById("swap-cards")
            .removeEventListener("click", Controller.swap_cards, true)
    }

    static logger(msg){
        $("#messages").html(msg);
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
        socket.emit("passturn", "next turn")
    }

    static swap_cards(s1, s2){
        let swap = [s1,s2]
        socket.emit("swapcards", swap)
    }

    static knock(){
        socket.emit("setbuffer", "bufferized");
        socket.emit("knock", "final round");
    }
    static pass_last(){
        socket.emit("knock", "final continue");
        console.log("final turn")
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