const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

//Model
const Article = require("../models/Article");

router.get("/", (req, res) => {
  const errors = {}; //An empty object to send errors back
  Article.find()
    .sort({ date: -1 })
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
  Article.findOne()
    .sort({ publicationDate: -1 })
    .exec((err, article) => {
      const errors = {};
      var recentID;
      if (err) {
        errors.err = err;
        return res.status(500).json(errors);
      } else if (article === null) {
        recentID = 0;
      } else {
        recentID = article.contentId;
      }
      //Make a request to NHL
      axios.get("https://www.nhl.com/").then(response => {
        const $ = cheerio.load(response.data);
        const scrapings = [];
        $("li.mixed-feed__item--article").each((i, element) => {
          if (recentID === $(element).data("content-id")) {
            return;
          } else {
            let deets = {};
            deets.contentId = $(element).data("content-id");
            deets.url = $(element)
              .children("div.mixed-feed__item-header")
              .children("div.mixed-feed__item-header-text")
              .children("a")
              .attr("href");
            deets.headline = $(element)
              .children("div.mixed-feed__item-header")
              .children("div.mixed-feed__item-header-text")
              .children("a")
              .children("h4")
              .text();
            deets.summary = $(element)
              .children("div.mixed-feed__item-header")
              .children("div.mixed-feed__item-header-text")
              .children("a")
              .children("h5")
              .text();
            deets.publicationDate = $(element)
              .children("div.mixed-feed__item-content")
              .children("div.mixed-feed__meta")
              .children("div.mixed-feed__timestamp")
              .children("time")
              .attr("datetime");
            scrapings.push(deets);
          } //else
        }); //li.each()
        Article.insertMany(scrapings)
          .then(() => {
            return res.status(200).json({ msg: "Scrape complete" });
          })
          .catch(err => {
            errors.err = err;
            return res.status(500).json(errors);
          });
      }); //axios
    }); //findOne() recent
}); //router.get

module.exports = router;
