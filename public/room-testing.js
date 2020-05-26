var socket = io.connect();
$(document).ready(function() {
    socket.on('joinResult', function(result) {
        $('#room').text("Room: " + result.room);
    });
    socket.on('usersJoined', function(usersJoined) {
        $('#users').text("Users in room: " + usersJoined.users.toString());
    })
});