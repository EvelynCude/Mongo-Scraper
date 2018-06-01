var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://www.gamespot.com/", function(err, res, body){
        var $ = cheerio.load(body);

        var articles = [];

        $(".media-body").each(function(i, element){
            var head = $(this).children(".media-title").text().trim();
            var sum = $(this).children(".media-deck").text().trim();

            if(head && sum){
                var dataBlock = {
                    headline: head,
                    summary: sum
                };
                articles.push(dataBlock);
            }
        });
        cb(articles);
        // console.log(articles);
    });
};
module.exports = scrape;