const express = require("express");
const router = express.Router();
//const cheerio = require("cheerio");
//const axios = require("axios");

const Comment = require("../models/Comment");

//@route POST /comment
//@desc Post a comment about a particular article
//@access Public
router.post("/comment", (req, res) => {
  const errors = {};
  const { comment, contentid } = req.body;

  const newComment = new Comment({
    userId: 42,
    comment,
    contentId: contentid
  });

  newComment.save(err => {
    if (err) {
      errors.err = err;
      return res.status(400).json(errors);
    }
    return res.redirect("/article/" + contentid);
  });
});

module.exports = router;
