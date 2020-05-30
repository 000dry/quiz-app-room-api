const assignName = function(socket, guestNumber, nicknames, namesUsed, roomCode, username, io) {
    const name = username ? username : 'Guest' + guestNumber;
    nicknames[roomCode] = {[socket.id]: name};

    socket.emit('nameResult', {
        success: true,
        name: name
    });

    namesUsed[roomCode].push(name);
    const usersInRoom = namesUsed[roomCode]

    io.to(roomCode).emit('usersJoined', {
        users: usersInRoom
    });
    
    return guestNumber + 1;
}



const handleNameChangeAttempts = function(socket, nicknames, namesUsed, roomCode, io) {
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed[roomCode].indexOf(name) == -1) {
                const previousName = nicknames[roomCode][socket.id];
                const previousNameIndex = namesUsed[roomCode].indexOf(previousName);
                namesUsed[roomCode].push(name);
                nicknames[roomCode][socket.id] = name;
                delete namesUsed[roomCode][previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                const usersInRoom = namesUsed[roomCode]

                io.to(roomCode).emit('usersJoined', {
                    users: usersInRoom
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

module.exports = { assignName, handleNameChangeAttempts };