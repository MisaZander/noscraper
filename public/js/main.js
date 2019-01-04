$(document).ready(function() {
  $("#commentSubmit").on("click", e => {
    e.preventDefault();
    const contentid = $("#theform")
      .data("contentid")
      .toString();
    console.log(contentid);
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
});
