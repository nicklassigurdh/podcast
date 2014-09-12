var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.get('/test', function(req, res) {
    res.send('hello!');
});

app.listen(process.env.PORT || 3000);

module.exports = app;