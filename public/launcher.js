$(document).ready(function() {
    $('#send-form').click(function() {
        const data = {
            roomCode: $('#code').val(),
            host: $('#host').val(),
            username: $('#username').val()
        }
        const opts = {
            method: 'POST',
            headers: { ContentType: 'application/json'},
            body: JSON.stringify(data)
        }
        console.log("DATA: ", JSON.stringify(data))
        fetch('/', opts).then((response) => {
            return response.text();
          })
          .then((html) => {
            document.body.innerHTML = html     
        });
    });
});


