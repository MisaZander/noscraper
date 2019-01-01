const express = require("express");
const router = express.Router();

//Model
const Article = require("../models/Article");

router.get("/", (req, res) => {
  const errors = {}; //An empty object to send errors back
  Article.find()
    .sort({ date: 1 })
    .exec((err, articles) => {
      if (err) {
        errors.err = err;
        return res.status(500).json(errors);
      }
      //You will recieve an empty array if there's nothing to display
      return res.status(200).json(articles);
    });
});

module.exports = router;
