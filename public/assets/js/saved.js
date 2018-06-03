$(document).ready(function(){
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", articleDelete);
    $(document).on("click", ".btn.notes", articleNotes);
    $(document).on("click", ".btn.save", noteSave);
    $(document).on("click", ".btn.note-delete", noteDelete);

    loadPage();

    function loadPage(){
        articleContainer.empty();
        $.get("/api/articles?saved=true").then(function(data){
            if (data && data.length){
                console.log(data);
                showArticles(data);
            }else{
                console.log("no data");
                showEmpty();
            }
        });
    }

    function showArticles(articles){
        var articlePanels = [];
        for (var i=0; i<articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(article){
        var panel =
            $(["<div class='panel panel-default'><div class='panel-heading'><h3>",
            article.headline,
            "<a class='btn btn-danger delete'>Delete</a>",
            "<a class='btn btn-primary notes'>Notes</a></h3></div>",
            "<div class='panel-body'>",
            article.summary,
            "</div></div>"
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    function showEmpty(){
        var emptyModal =
        $(["<div class='alert alert-warning text-center'>",
        "<h3>Looks like we don't have any saved articles.</h3></div>",
        "<div class='panel panel-default'><div class='panel-heading text-center'>",
        "<h4>Would you like to browse available articles?</h4></div>",
        "<div class='panel-body text-center'><h4>",
        "<a href='/'>Browse Articles</a></h4></div></div>"
        ].join(""));
        articleContainer.append(emptyModal);
    }

    function notesList(data){
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length){
            currentNote = [
                "<li class='list-group-item'>No notes for this article yet.</li>"
            ].join("");
            notesToRender.push(currentNote);
        }else{
            for (var i=0; i<data.notes.length; i++){
                currentNote =$([
                    "li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button></li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }



    function articleDelete(){
        var articleToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: "/api/articles/" + articleToDelete._id
        }).then(function(data){
            if (data){
                loadPage();
            }
        });
    }

    function articleNotes(){
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data){
            var modalText = [
                "<div class='container-fluid text center'><h4>Notes for article: ",
                currentArticle._id,
                "</h4><hr />",
                "<ul class='list-group note-container'></ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-primary save'>Save Note</button></div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData ={
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            notesList(noteData);
        });
    }

    function noteSave(){
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if(newNote){
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                bootbox.hideAll();
            });
        }
    }

    function noteDelete(){
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url:"/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            bootbox.hideAll();
        });
    }
})
