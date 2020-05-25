var socketio = require('socket.io');
var io;
var guestNumber = {};
var nicknames = {};
var namesUsed = {};
var currentRoom = {};

exports.listen = function(server, userData) {
    io = socketio.listen(server);

    io.sockets.on('connection', function(socket) {
        if(!userData.roomCode && !userData.host || userData.roomCode && userData.host) {
            throw new Error('User connected with bad combination of roomCode and host status');
        }

        var room = userData.roomCode && !userData.host ? userData.roomCode : generateHostRoomCode();
        guestNumber[room] = 1;
        namesUsed[room] = namesUsed[room] ? namesUsed[room] : [];
        handleJoinRoomAttempt(socket, room, userData.host);
        guestNumber[room] = assignName(socket, guestNumber[room], nicknames, namesUsed, room, userData.username);

        handleNameChangeAttempts(socket, nicknames, namesUsed, room);
        handleClientDisconnection(socket, nicknames, namesUsed, room);
    });
};

function generateHostRoomCode() {
    var code = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ( var i = 0; i < 4; i++ ) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

function assignName(socket, guestNumber, nicknames, namesUsed, room, username) {
    var name = username ? username : 'Guest' + guestNumber;
    nicknames[room] = {[socket.id]: name};

    socket.emit('nameResult', {
        success: true,
        name: name
    });

    var usersInRoom = namesUsed[room]
    var usernamesInRoom = []

    for (var index in usersInRoom) {
        var userSocketId = usersInRoom[index].id;
        usernamesInRoom.push(nicknames[room][userSocketId]);
    }
    socket.broadcast.to(room).emit('usersJoined', {
        users: usernamesInRoom
    });
    namesUsed[room].push(name);
    return guestNumber + 1;
}

function handleJoinRoomAttempt(socket, room, host) {
    if(!host){
        joinIfRoomExists(socket, room);
    } else {
        joinRoom(socket, room, host);
    }
}

function joinIfRoomExists(socket, room) {
    if (socket.rooms[room]){
        joinRoom(socket, room)
    } else {
        socket.emit('joinResult', {success: false, room: null})
    }
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {success: true, room: room});
}

function handleNameChangeAttempts(socket, nicknames, namesUsed, room) {
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nicknames[room][socket.id];
                var previousNameIndex = namesUsed[room].indexOf(previousName);
                namesUsed[room].push(name);
                nicknames[room][socket.id] = name;
                delete namesUsed[room][previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

function handleClientDisconnection(socket, nicknames, namesUsed, room) {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed[room].indexOf(nicknames[room][socket.id]);
        delete namesUsed[room][nameIndex];
        delete nicknames[room][socket.id];
    });
}