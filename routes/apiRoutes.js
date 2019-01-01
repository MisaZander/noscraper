const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

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

router.get("/scrape", (req, res) => {
  //Make a request to NHL
  axios.get("https://www.nhl.com/").then(response => {
    const $ = cheerio.load(response.data);
    const scrapings = [];
    $("li.mixed-feed__item--article").each((i, element) => {
      let deets = {};
      deets.contentId = $(element).data("content-id");
      deets.headline = $(element)
        .children("div.mixed-feed__item-header")
        .children("div.mixed-feed__item-header-text")
        .children("a")
        .attr("href");
      scrapings.push(deets);
    });
    console.log(scrapings);
    console.log(`Final Tally: ${scrapings.length} articles`);
    return res.status(200).json({ msg: "Done" });
  });
});

module.exports = router;
