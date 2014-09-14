var express = require('express');
var app = express();
var feeds = require('./feeds');
var Ranking = require('./Ranking');
var r = new Ranking();
var cachedRanking = {};

//use
app.use(express.static(__dirname + '/static'));


//routing regler
app.get('/test', function(req, res) {
    res.send('hello!');
});

/** the magic **/
//on start loop through all the feeds and cache the results.
cachedRanking = r.getRanking(feeds);

//start web server
app.listen(process.env.PORT || 3000);

module.exports = app;