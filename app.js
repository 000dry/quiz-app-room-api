const express = require('express');
const app = express();
const roomServer = require('./libs/room-server');
const path = require('path');
const bodyParser = require('body-parser');
const handleRoomCode = require('./libs/handle-room-code')
const QuizRoomData = require('./src/room-data')
const roomData = new QuizRoomData();

app.use('/assets', express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/launcher.html'));
});

/* -----------------------------------------------------------------------------
User session initialises on POST where req.body = { host, roomCode, quiz }
From client, sequence should be POST then a socket connection, then an emit to
'join' with { host, username, roomCode }
For user without code (host), a code is generated and returned back in res.json
For user with code, the code is validated and returned
Where invalid combination of host status and room code are provided, or where 
an invalid roomCode was given, an error (non-exceptional) is returned to user.
----------------------------------------------------------------------------- */

app.post('/', function (req, res) {
    const codeAttempt = handleRoomCode(req.body);
    if(!(codeAttempt instanceof Error)) {
        roomData.addQuizToRoom(req.body, codeAttempt);
        res.json({'roomCode': codeAttempt});
    } else {
        res.json({'error': codeAttempt.message})
    }
});

const server = app.listen(4040, function () {
    console.log('Room app listening - get the party started on port 4040!');
});

roomServer.listen(server, roomData);