var socket = io.connect('http://localhost:4040/');
$(document).ready(function() { 

    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
    });
    socket.on('usersJoined', function(usersJoined) {
        $('#users').text(usersJoined.users.toString());
    })
    $('#send-button').click(function() {
        const data = {
            roomCode: $('#code').val(),
            host: ($('#host').val() === 'true'),
            username: $('#username').val()
        }
        socket.emit('join', data);
    })
});