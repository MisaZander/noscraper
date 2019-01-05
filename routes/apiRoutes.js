const express = require("express");
const router = express.Router();
//const cheerio = require("cheerio");
//const axios = require("axios");

//Models
const Article = require("../models/Article");
const Comment = require("../models/Comment");

//@route POST /comment/:contentid
//@desc Post a comment about a particular article
//@access Public
router.post("/comment/:contentid", (req, res) => {
  const errors = {};
  const { comment } = req.body;
  const { contentid } = req.params;

  const newComment = new Comment({
    comment
  });

  newComment.save((err, comment) => {
    if (err) {
      errors.err = err;
      return res.status(500).json(errors);
    }
    //Add new comment to Article's list of comments
    Article.findOneAndUpdate(
      { contentid: contentid },
      { $push: { comments: comment._id } },
      { new: true }
    ).exec((err, insData) => {
      if (err) {
        errors.err = err;
        return res.status(500).json(errors);
      }
      return res.status(200).json(insData);
    });
  });
});

//@route DELETE /comment/:commentid
//@desc Post a comment about a particular article
//@access Public
router.delete("/comment/:commentid", (req, res) => {
  const errors = {};
  const { commentid } = req.params;
  Comment.findByIdAndUpdate(commentid, { $set: { deleted: true } }).exec(
    err => {
      if (err) {
        errors.err = err;
        return res.status(400).json(errors);
      }
      res.status(200).json({ msg: "Comment removed." });
    }
  );
});

module.exports = router;
