/* deps */
var http = require('http');
var xml2js = require('xml2js');
var XMLparser = new xml2js.Parser();
var FB = require('fb');
FB.setAccessToken('CAACEdEose0cBANa44vHw42RU2oqNrt9gtGTIsnsMPajXguDzeqxi33ylXUVQ6or1P2CTOfuP3RdxqjjacZBbslO1HOKu352mINEZBHHNZCOGc6RWBNLj8FZCkimx6YZCNgKcjx8jZBdB7nfB6oGerOlSZC3QJDWJuKlkNXsSJHdQkYsQuWJMOdXFMZAfR7xLWcA4mOufA6RenZBsUaRXj0AwzaNxnH53hZCssZD');

/* function */
var Ranking = function () {

    self = this;

    self.cachedRanking = {
        ts : Date.now(),
        rankings : []
    };

    self.facebookTooken = '';

    self.doRequest = function(siteObj, callback) {
        //make http request to feeds[i] and parse the result for links.
        var req = http.request(siteObj, function(response) {
            //console.log('STATUS: ' + response.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(response.headers));

            response.setEncoding('utf8');

            if(response.statusCode === 200){
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved
                response.on('end', function () {
                    callback(str);
                });
            }else{
                console.log('there is some problem with a request: '+ JSON.stringify(siteObj));
            }
        });

        req.on('error', function(e) {
            console.log('problem with request: %S',  JSON.stringify(e));
        });

        req.end();
    };

};
var p = Ranking.prototype;

p.fillCacheWithtRanking = function (feeds) {
    var self = this;
    for (var i = 0; i < feeds.length; i++) {
        self.cachedRanking.ts = Date.now();

        var parsFeedsGetRanking = function (str) {
            XMLparser.parseString(str, function (err, result) {
                for(var n = 0; n < result.rss.channel[0].item.length; n++){

                    var tmpRankingObj = {},
                        tmpURL = result.rss.channel[0].item[n].link[0].substring(0, result.rss.channel[0].item[n].link[0].indexOf("?"));

                    tmpRankingObj.link = tmpURL;
                    tmpRankingObj.title = result.rss.channel[0].item[n].title[0];
                    tmpRankingObj.description = result.rss.channel[0].item[n].description[0];
                    tmpRankingObj.content = result.rss.channel[0].item[n]['content:encoded'][0];

                    self.cachedRanking.rankings.push(tmpRankingObj);

                    var callback = function (res) {
                        if(!res || res.error) {
                            console.log(!res ? 'error occurred' : res.error);
                            return;
                        }

                        for(var i = 0; i < self.cachedRanking.rankings.length; i++){
                            if(self.cachedRanking.rankings[i].link === res.data[0].url){
                                self.cachedRanking.rankings[i].shares = res.data[0].share_count;
                                self.cachedRanking.rankings[i].likes = res.data[0].like_count;
                                self.cachedRanking.rankings[i].total = res.data[0].total_count;
                            };
                        }
                    };

                    console.log('get facebook data for: '+tmpURL);
                    FB.api('fql', { q: 'SELECT share_count, like_count, comment_count, total_count, url FROM link_stat WHERE url="'+ tmpURL +'"'}, callback);

                }
            });
        };

        console.log('get feed: '+ feeds[i].hostname);
        self.doRequest(feeds[i], parsFeedsGetRanking);

    }
}

p.getRanking = function () {
    return self.cachedRanking.rankings;
}

module.exports = Ranking;

/*
 Facebook*: https://api.facebook.com/method/links.getStats?urls=%%URL%%&format=json
 Twitter: http://urls.api.twitter.com/1/urls/count.json?url=%%URL%%
 Reddit:http://buttons.reddit.com/button_info.json?url=%%URL%%
 LinkedIn: http://www.linkedin.com/countserv/count/share?url=%%URL%%&format=json
 Digg: http://widgets.digg.com/buttons/count?url=%%URL%%
 Delicious: http://feeds.delicious.com/v2/json/urlinfo/data?url=%%URL%%
 StumbleUpon: http://www.stumbleupon.com/services/1.01/badge.getinfo?url=%%URL%%
 Pinterest: http://widgets.pinterest.com/v1/urls/count.json?source=6&url=%%URL%%
*/