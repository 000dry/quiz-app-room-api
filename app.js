const express = require('express');
const app = express();
const roomServer = require('./libs/room-server');
const path = require('path');

//todo: createUserFromData - instantiate user object to pass to socket listener instead of userData
const userData = {
    roomCode: "",
    host: true,
    username: ""
}

app.use('/assets', express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/launcher.html'));
});

app.post('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

const server = app.listen(4040, function () {
    console.log('Room app listening - get the party started on port 4040!');
});

roomServer.listen(server, userData);