var express = require('express');
var app = express();
var feeds = require('./feeds');
var Ranking = require('./Ranking');
var ranking = new Ranking();

//use
app.use(express.static(__dirname + '/static'));


//routing regler
app.get('/getRanking', function(req, res) {
    var result = {}
    result.pods = ranking.getRanking();

    res.send(JSON.stringify(result));
});

/** the magic **/
//on start loop through all the feeds and cache the results.
ranking.fillCacheWithtRanking(feeds);

//start web server
app.listen(process.env.PORT || 3000);

module.exports = app;