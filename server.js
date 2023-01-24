const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const { v4: uuidV4 } = require('uuid');
const io = require('socket.io')(server);
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
    res.render('rooms', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId);
        })
    })

})
server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});