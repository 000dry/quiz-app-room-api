const handleJoinRoomAttempt = function(socket, roomCode, host) {
    if(!host){
        joinIfRoomExists(socket, roomCode);
    } else {
        joinRoom(socket, roomCode);
    }
}

function joinIfRoomExists(socket, roomCode) {
    if (socket.rooms[roomCode]){
        joinRoom(socket, roomCode)
    } else {
        socket.emit('joinResult', {success: false, roomCode: null})
    }
}

function joinRoom(socket, roomCode) {
    socket.join(roomCode);
    socket.emit('joinResult', {success: true, roomCode: roomCode});
    return roomCode;
}

module.exports = handleJoinRoomAttempt;