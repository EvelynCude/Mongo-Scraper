$(document).ready(function(){

    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", articleSave);
    $(document).on("click", ".scrape-new", articleScrape);

    loadPage();

    function loadPage(){
        articleContainer.empty();
        jQuery.get("/api/articles?saved=false")
            .then(function(data){
                if(data && data.length){
                    showArticles(data);
                }else{
                    emptyArticles();
                }
            });
    }

    function showArticles(articles){
        var articlePanels = [];
        for (var i=0; i<articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
        console.log(JSON.stringify(articlePanels));
    }

    function createPanel(article){
        var panel =
            $(["<div class='panel panel-default'><div class='panel-heading'><h3>",
            article.headline,
            "<a class='btn btn-success save' align='right'>Save Article</a></h3></div>",
            "<div class='panel-body'>",
            article.summary,
            "</div></div>"
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    function emptyArticles(){
        var emptyModal =
        $(["<div class='alert alert-warning text-center'><h3>Looks like we don't have any new articles.</h3></div>",
            "<div class='panel panel-default'><div class='panel-heading text-center'>",
            "<h4>What would you like to do?</h4></div>",
            "<div class='panel-body text-center'><h5><a class='scrape-new'>Try scraping new articles</a></h4>",
            "<h4><a href='/saved'>Go to saved articles</a></h4>",
            "</div></div>"
        ].join(""));
        articleContainer.append(emptyModal);
    }

    function articleSave(){
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        console.log(articleToSave);

        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToSave
        }).then(function(data){
            // console.log(data);
            if(data){
                loadPage();
            }
        });
    }

    function articleScrape(){
        $.get("/api/fetch")
            .then(function(data){
                loadPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
            });
    }







})