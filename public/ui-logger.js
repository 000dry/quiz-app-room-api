var socket = io.connect();
$(document).ready(function() {
    socket.on('nameResult', function(result) {
    var message;
    if (result.success) {
        message = 'You are now known as ' + result.name + '.';
    } else {
        message = result.message;
    }
        $('#messages').append(divSystemContentElement(message));
    });
    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
    });
    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });
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
    setInterval(function() {
        socket.emit('rooms');
    }, 1000);
    $('#send-message').focus();
    $('#send-form').submit(function() {
        processUserInput(chatApp, socket);
        return false;
    });
});