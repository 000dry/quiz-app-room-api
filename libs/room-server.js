const socketio = require('socket.io');
const _ = require('lodash');
const handleJoinRoomAttempt = require('./listeners/handle-join-room-attempt')
const { assignName, handleNameChangeAttempts } = require('./listeners/handle-names')

let io;
let quizRooms = {};
const guestNumber = {}; // { [roomCode]: int }
const nicknames = {};   // { [roomCode]: { [socket.id]: "" } }
const namesUsed = {};   // { [roomCode]: [] }
const currentRoom = {}; // { [socket.id]: roomCode }

exports.listen = function(server, roomData) {
    /* -----------------------------------------------------
    roomData is the RoomData object instantiated with the
    server. It listens for changes when a [roomCode]: quiz
    pair is added and overwrites the full object of 
    RoomData.openRooms to quizRooms on 'quizRoomState'
    event.
    ----------------------------------------------------- */
    roomData.on('quizRoomState', function(quizRoomData) {
        quizRooms = quizRoomData;
    });
    io = socketio.listen(server);
    io.sockets.on('connection', function(socket) {
        /* ---------------------------------------------
        On connection set up a single listener to handle 
        the rest of user initialisation once ready - user
        should emit to 'join' once they're ready with
        a roomCode returned from initial POST interaction
        --------------------------------------------- */
        console.log("User has connect on socket: " + socket.id);
        joinRoomAfterConnect(socket)
    });
};

function joinRoomAfterConnect(socket) {
    socket.on('join', function(userData) {
    /* ---------------------------------------------
    Client should emit 'join' with 
    { userData: { roomCode, username, host } }
    once they have received their room code back from
    server over HTTPS. At this point, we begin tracking
    various room attributes:
    
    - guestNumber: { [roomCode]: int } primarily used for
        assigning the default 'Guest${n}' username to user
    - namesUsed: { [roomCode]: [] } keeps an array of the
        usernames in use in that room as a quick reference for
        preventing duplicates when users attempt to assign own
        username
    - fn handleJoinRoomAttempt: if host, join immediately.
        if !host, check that the room exists to ensure user
        hasn't sent incorrect code.
        --> emits 'joinResult'.
    - fn assignName: returns guestNumber[roomCode]++ and is 
        assigned to guestNumber[roomcode], so that the next 
        users default 'Guest${n}' username. Also sets custom
        username if one is received in userData.
        --> emits 'nameResult' to socket and 'usersJoined' to room.
    - fn handleNameChangeAttempts:
        --> listens on 'nameAttempt'
        will not accept input 'Guest' as valied attempt.
        checks against namesUsed[roomCode] and rejects attempt 
        to use a name already in use.
        successful name change clears old username from namesUsed[roomCode]
        array and adds new entry and nicknames[roomCode][socket.id] gets 
        assigned value of new name
        --> emits on 'nameResult'
    - fn handleClientDisconnection: clean up objects storing room data
    --------------------------------------------- */
        
        const { roomCode, username, host } = userData;
        guestNumber[roomCode] = 1;
        namesUsed[roomCode] = namesUsed[roomCode] ? namesUsed[roomCode] : [];
        currentRoom[socket.id] = handleJoinRoomAttempt(socket, roomCode, host);
        guestNumber[roomCode] = assignName(socket, guestNumber[roomCode], nicknames, namesUsed, roomCode, username, io);

        handleNameChangeAttempts(socket, nicknames, namesUsed, roomCode, io);
        handleClientDisconnection(socket, nicknames, namesUsed, roomCode);
    })
}


function handleClientDisconnection(socket, nicknames, namesUsed, roomCode) {
    socket.on('disconnect', function() {
        //TODO: Weird behaviour - receives 'disconnect' if socket.on('join') is spammed and errors with roomCode = undefined
        console.log("Disconnecting user " + nicknames[roomCode][socket.id] + " on socket " + socket.id);
        const nameIndex = namesUsed[roomCode].indexOf(nicknames[roomCode][socket.id]);
        namesUsed[roomCode].splice([nameIndex],1);
        delete nicknames[roomCode][socket.id];
        delete currentRoom[socket.id];

        if(_.isEmpty(namesUsed[roomCode])) {
            console.log("Last client disconnected: Room " + roomCode + " cleared from namesUsed")
            delete namesUsed[roomCode];
        }
        if(_.isEmpty(nicknames[roomCode])) {
            console.log("Last client disconnected: Room " + roomCode + " cleared from nicknames")
            delete nicknames[roomCode];
        }

        //TODO: ensure all objects are enscapsulated (guest, quizRoom) and clearing down properly
    });
}