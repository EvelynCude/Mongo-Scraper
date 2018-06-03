var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://kotaku.com/tag/pc-gaming", function(err, res, body){
        var $ = cheerio.load(body);
    console.log(err);
    console.log(res.statusCode);
        var articles = [];

        $(".post-item-tag").each(function(i, element){
            var link = $(this).find(".js_entry-link").attr("href");
            var head = $(this).find(".entry-title").text().trim();
            var sum = $(this).find(".entry-summary").text().trim();

            if(head && sum){
                var dataBlock = {
                    headline: head,
                    link: link,
                    summary: sum
                };
                articles.push(dataBlock);
            }
        });
        cb(articles);

    });
};
module.exports = scrape;