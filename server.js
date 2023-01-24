const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
const PORT = process.env.PORT || 5000;
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:rooms', (req, res) => {
    res.render('rooms', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.emit('user-connected', userId)
        io.emit('user-connected', userId)
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})