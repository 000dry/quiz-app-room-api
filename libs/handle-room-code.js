/* ------------------------
 Process data from initial
 POST request to server to
 determine whether or not
 to return a room code.
------------------------ */


const handleRoomCode = function(userData) {
    //Throw error when user has no room code and is not host OR user is host and has room code
    if((!userData.roomCode && !userData.host) || (userData.roomCode && userData.host)) {
        return new Error('User connected with bad combination of room code and host status');
    }

    /* ------------------------------------------------------------------------
    Return already existing room code if user is not a host and has a valid
    room code
    ------------------------------------------------------------------------ */
    if(userData.roomCode && !userData.host) {
        return validateRoomCode(userData.roomCode);
    };

    //TODO: run check against active rooms to ensure a room code isn't already taken
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ( let i = 0; i < 4; i++ ) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

const validateRoomCode = function(roomCode) {
    //Code must be UPPERCASE and 4-letter string
    if(/^[A-Z]{4}$/.test(roomCode)){
        return roomCode
    }
    return new Error('User supplied invalid room code');
};

module.exports = handleRoomCode;