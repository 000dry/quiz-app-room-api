var socket = io.connect();
$(document).ready(function() {
    // socket.on('nameResult', function(result) {
    // var message;
    // if (result.success) {
    //     message = 'You are now known as ' + result.name + '.';
    // } else {
    //     message = result.message;
    // }
    //     $('#messages').append(divSystemContentElement(message));
    // });
    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
    });
    socket.on('usersJoined', function(usersJoined) {
        console.log(usersJoined.users)
        $('#users').text(usersJoined.users.toString());
    })
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();
        for(var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        $('#room-list div').click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });
    // setInterval(function() {
    //     socket.emit('rooms');
    // }, 1000);
    $('#send-message').focus();
    $('#send-form').submit(function() {
        sendUserInput(socket);
        return false;
    });
});