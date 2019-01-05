$(document).ready(() => {
  $(document).on("click", "#commentSubmit", function(e) {
    e.preventDefault();
    const contentid = $("#theform")
      .data("contentid")
      .toString();
    //console.log(contentid);
    const commentObj = {
      comment: $("#comment").val()
    };

    $.ajax("/api/comment/" + contentid, {
      type: "POST",
      data: commentObj
    }).then(() => {
      location.reload();
    });
  });

  $(document).on("click", ".commentDelete", function(e) {
    e.preventDefault();
    const commentid = $(this).attr("data-commentid");
    $.ajax("/api/comment/" + commentid, {
      type: "DELETE"
    }).then(() => {
      location.reload();
    });
  });
});
