// APP JS * ======================================================= * 

// SCRAPE BUTTON * ================================================ *
$("#scrape").on("click", () => {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done((data) => {
        console.log(data);
        window.location = "/";
    });
});

// Set clicked Nav option to 'active'
$(".navbar-nav li").click( () => {
    $(".navbar-nav li").removeClass("active");
    $(this).addClass("active");
});

// SAVE ARTICLE BUTTON * ========================================== *
$(".save").on("click", () => {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done((data) => {
        console.log(data);
        window.location = "/";
    });
});


// DELETE ARTICLE BUTTON * ======================================== *
$(".delete").on("click", () => {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done((data) => {
        console.log(data);
        window.location = "/saved";
    });
});


// ADD NOTE BUTTON * ============================================== *
$(".add-note").on("click", () => {
    var thisId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId,
        }).done((data) => {
            console.log(data.note.body);
        });
});


// SAVE NOTE BUTTON * ============================================= *
$(".save-note").on("click", () => {
    var thisId = $(this).attr("data-id");
    var noteText = $("#noteArea" + thisId).val();
    console.log(noteText);
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: noteText
        }
    }).then((data) => {
        console.log(data);
        $("#noteArea").val(" ");
        $("#noteModal").modal("hide");
        window.location = "/saved";
    });
});


// DELETE NOTE BUTTON * =========================================== *
$(".deleteNote").on("click", () => {
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done((data) => {
        console.log(data);
        $(".modalNote").modal("hide");
        window.location = "/saved";
    });
});
