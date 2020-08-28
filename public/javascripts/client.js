const socket = io('http://localhost:3000', { //TODO: Change this for production
  path: '/socket'
});

function broadcastHello(){
    socket.emit("hello", "world")
}