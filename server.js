const express = require('express');
const useSocket = require('socket.io')

const app = express();
const server = require('http').createServer(app);
const io = useSocket(server);

app.use(express.json());

let rooms = new Map();

app.get('/rooms/:roomId', (req, res) => {
    const roomId = +req.params.roomId;

    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : {
        users: [],
        messages: []
    };
    res.json(obj);
});

app.get('/create-room', (req, res) => {

    const roomIdGenerator = () => {
        return Math.round(Math.random() * (999 - 100) + 100);
    };

    let roomId = roomIdGenerator();

    while (rooms.has(roomId)) roomId = roomIdGenerator();

    rooms.set(roomId, new Map([
        ['users', new Map()],
        ['messages', []]
    ]))


    const obj = {roomId};

    res.json(obj);
});

app.post('/rooms', (req, res) => { // не используется
    const {roomId} = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
    res.send();
});

app.get('/check-room/:roomId', (req, res) => {
    const roomId = +req.params.roomId;

    let obj = rooms.has(roomId) ? {roomExist: true} : {roomExist: false};
    res.json(obj);
})

io.on('connection', socket => {
    console.log('user connected', socket.id);

    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users = [...rooms.get(roomId).get('users').values()];
        socket.to(roomId).emit('SET-USERS', users);
        console.log('Массив пользователей:', users.toString());
    });


    socket.on('NEW-MESSAGE', ({roomId, userName, text}) => {
        const currentDate = new Date();
        const hours = currentDate.getHours().toString().length === 1
            ? '0' + currentDate.getHours()
            : currentDate.getHours();
        const minutes = currentDate.getMinutes().toString().length === 1
            ? '0' + currentDate.getMinutes()
            : currentDate.getMinutes();
        const time = `${hours}:${minutes}`;
        console.log(time);
        const obj = {userName, text, time};
        rooms.get(roomId).get('messages').push(obj);
        socket.to(roomId).emit('NEW-MESSAGE', obj);

    });

    socket.on('disconnect', () => {
        rooms.forEach( (value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.to(roomId).broadcast.emit('SET-USERS', users);
            }
        })
    })
})

server.listen(9999, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log('Cервер запущен.')
});