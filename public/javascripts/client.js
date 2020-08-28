const socket = io('http://localhost:3000', { //TODO: Change this for production
  path: '/socket'
});

socket.on('connect', () => {
    console.log("your socket id: " + socket.id); // 'G5p5...'
});

function broadcastHello(){
    socket.emit('chat', {
        message: "Hello!"
    })
}

socket.on('chat', (data) => {
    console.log("Hello!")
})