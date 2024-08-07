const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io")
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const baseUrl = "http://localhost:3000"
const io = new Server(server, {
    cors: {
        origin: baseUrl,
        methods: ["GET", "POST"],
    }
})
app.use(cors({
    origin: ['https://dudaji-challenge.vercel.app', 'http://localhost:3000'], // Update with your frontend URL and localhost
}));

app.use(cors());
app.use(express.json());

let rooms = {};


app.get('/rooms', (req, res) => {
    res.json(Object.keys(rooms))
});

app.post('/rooms', (req, res) => {
    const { room } = req.body;

    if(rooms[room]) {
        return res.status(400).json({message: 'Error: room is aldready exist'});
    }

    rooms[room] = [];
    res.status(201).json({ message: 'Successfully: create a room'});
})

io.on('connection', (socket) => {

    socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.emit('existingRoomMessages', rooms[room] || []);
    })

    socket.on('message', ({room, message}) => {
        if(!rooms[room]) rooms[room] = [];

        let newMess = {id: socket.id, message}
        rooms[room].push(newMess);
        io.to(room).emit('message', newMess);
    });

    socket.on('disconnect', () => {
        // TODO
    });
});

module.exports = app;