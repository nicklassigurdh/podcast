/* deps */
var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

/* function */
var Ranking = function () {
    console.log('ranking instanced...');
};
var p = Ranking.prototype;

p.getRanking = function (feeds) {
    for (var i = 0; i < feeds.length; i++) {
        console.log(feeds[i]);

        //make http request to feeds[i] and parse the result for links.
        var req = http.request(feeds[i], function(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');

            if(response.statusCode === 200){
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved
                response.on('end', function () {
                    parser.parseString(str, function (err, result) {
                        console.log(result.rss.channel[0].item.length);
                        for(var n = 0; n < result.rss.channel[0].item.length; n++){
                            console.log(result.rss.channel[0].item[n].link[0]);
                        }
                    });
                });
            }else{
                console.log('there is some problem with a feed?');
            }
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    }
}

module.exports = Ranking;