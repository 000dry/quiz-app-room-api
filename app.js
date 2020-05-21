const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send("Yo quiz app")
})

app.listen(3000, function () {
    console.log('Room app listening - get the party started on port 3000!');
  });