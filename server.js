const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    // Welcome current user
    socket.emit('message', 'welcome to the chat');

    //Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));