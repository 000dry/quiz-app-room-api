$(document).ready(function() {
    $('#send-button').click(function() {
        const data = {
            roomCode: $('#code').val(),
            host: ($('#host').val() === 'true'),
            username: $('#username').val(),
            quiz: $('#quiz').val()
        }

        const opts = {
            method: 'POST',
            headers: { "Content-type": 'application/json'},
            body: JSON.stringify(data)
        }
        fetch('/', opts).then((response) => {
            console.log(response);
          });
    });
});


