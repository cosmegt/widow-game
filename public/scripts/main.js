const socket = io('http://localhost:3000', { //TODO: Change this for production
  path: '/socket'
});

function broadcast(){
    socket.broadcast
}