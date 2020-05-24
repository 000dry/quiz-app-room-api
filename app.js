const express = require('express');
const app = express();
// const roomServer = require('./libs/room-server');

app.get('/', function (req, res) {
    res.send("Get requests r 4 fannies")
  })

app.post('/', function (req, res) {
    res.send(req.body)
  })

app.listen(4040, function () {
    console.log('Room app listening - get the party started on port 4040!');
});

// roomServer.listen(server);