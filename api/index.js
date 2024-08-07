const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['https://dudaji-challenge.vercel.app', 'http://localhost:3000'],
      methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(cors({
    origin: ['https://dudaji-challenge.vercel.app', 'http://localhost:3000'],
}));

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
    console.log('connection');
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

const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});