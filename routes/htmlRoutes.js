const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

//Model
const Article = require("../models/Article");

//@route GET /
//@desc Query the DB for all headlines
//@access Public
router.get("/", (req, res) => {
  const errors = {}; //An empty object to send errors back
  Article.find()
    .sort({ publicationDate: -1 })
    .populate("comments")
    .exec((err, articles) => {
      if (err) {
        errors.err = err;
        return res.status(500).json(errors);
      }
      //You will receive an empty array if there's nothing to display
      const reply = {
        scrapings: null,
        articles
      };
      return res.render("index", { reply });
    });
});

//@route GET /scrape
//@desc Get the new stuff from the website
//@access Public
router.get("/scrape", (req, res) => {
  Article.find()
    .sort({ publicationDate: -1 })
    .exec((err, articles) => {
      const errors = {};
      if (err) {
        errors.err = err;
        return res.status(500).json(errors);
      }
      //Create an array of already existing content IDs to compare to
      const articleIds = articles.map(articles => articles.contentId);
      // Make a request to NHL
      axios.get("https://www.nhl.com/").then(response => {
        const $ = cheerio.load(response.data);
        const scrapings = [];
        $("li.mixed-feed__item--article").each((i, element) => {
          let contentId = $(element).data("content-id");
          contentId = contentId.toString();
          // Only add to DB if it's new
          if (articleIds.indexOf(contentId) === -1) {
            let deets = {};
            deets.contentId = contentId;
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
          }
        }); //li.each()
        Article.insertMany(scrapings)
          .then(() => {
            const reply = {
              scrapings,
              articles
            };
            return res.render("index", { reply });
          })
          .catch(err => {
            errors.err = err;
            return res.status(500).json(errors);
          });
      }); //axios
    }); //findOne() recent
}); //router.get

//@route GET /article/:contentid
//@desc Show a single article with all the comments
//@access Public
router.get("/article/:contentid", (req, res) => {
  const errors = {};
  contentId = req.params.contentid.toString();
  Article.findOne({ contentId: contentId })
    .populate("comments")
    .exec((err, article) => {
      if (err) {
        errors.err = err;
        return res.status(400).json(errors);
      } else if (!article) {
        //TODO: Render the Hoff here
        errors.noarticle = "Article not found.";
        return res.status(404).json(errors);
      }
      //return res.status(200).json(article);
      return res.render("comments", { article });
    });
});

module.exports = router;
