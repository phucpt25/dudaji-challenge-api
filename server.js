const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io")

const app = express();
const server = http.createServer(app);
const baseUrl = "http://localhost:3000"
const io = new Server(server, {
    cors: {
        origin: baseUrl,
        methods: ["GET", "POST"],
    }
})

app.use(cors());

io.on('connection', (socket) => {
    socket.on('message', (m) => {
        io.emit('message', m);
    });

    socket.on('disconnect', () => {
        // TODO
    });
});

server.listen(5001);