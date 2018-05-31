var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://www.gamespot.com/", function(err, res, body){
        var $ = cheerio.load(body);

        var articles = [];

        $(".media-article").each(function(i, element){
            var head = $(this).children(".media-title").text().trim();
            var sum = $(this).children(".media-deck").text().trim();

            if(head && sum){
                var headline = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var summary =sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataBlock = {
                    headline: headline,
                    summary: summary
                };
                articles.push(dataBlock);
            }
        });
        cb(articles);
    });
};
module.exports = scrape;