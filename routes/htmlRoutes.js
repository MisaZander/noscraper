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
    .populate("Comment")
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
  axios.get("https://www.nhl.com/").then(response => {
    const $ = cheerio.load(response.data);
    const scrapings = [];
    $("li.mixed-feed__item--article").each((i, element) => {
      let contentid = $(element).data("content-id");
      contentid = contentid.toString();
      let deets = {};
      deets.contentid = contentid;
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
    }); //li.each()

    //Recursively insert each scraping one by one
    //Attempted duplicates will be rejected
    const scrapingsLength = scrapings.length;
    recursiveInsertion(scrapings, 0, scrapingsLength);
    return res.redirect("/");
  }); //axios get
}); //router scrap get

//@route GET /article/:contentid
//@desc Show a single article with all the comments
//@access Public
router.get("/article/:contentid", (req, res) => {
  const errors = {};
  contentid = req.params.contentid.toString();
  Article.findOne({ contentid: contentid })
    .populate("Comment")
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

const recursiveInsertion = (scrapings, i, scrapingsLength) => {
  if (i === scrapingsLength) {
    return;
  }
  let { contentid, url, headline, summary, publicationDate } = scrapings[i];
  let newArticle = new Article({
    contentid,
    url,
    headline,
    summary,
    publicationDate
  });

  newArticle.save(err => {
    if (err) {
      console.log("Duplicate article scraped.");
      recursiveInsertion(scrapings, i + 1, scrapingsLength);
    } else {
      console.log("New article scraped");
      recursiveInsertion(scrapings, i + 1, scrapingsLength);
    }
  });
};

module.exports = router;

// OLD SCRAPER
//@route GET /scrape
// //@desc Get the new stuff from the website
// //@access Public
// router.get("/scrape", (req, res) => {
//   Article.find()
//     .sort({ publicationDate: -1 })
//     .exec((err, articles) => {
//       console.log(articles);
//       const errors = {};
//       if (err) {
//         errors.err = err;
//         return res.status(500).json(errors);
//       }
//       //Create an array of already existing content IDs to compare to
//       const articleIds = articles.map(articles => articles.contentid);
//       // Make a request to NHL
//       axios.get("https://www.nhl.com/").then(response => {
//         const $ = cheerio.load(response.data);
//         const scrapings = [];
//         $("li.mixed-feed__item--article").each((i, element) => {
//           let contentid = $(element).data("content-id");
//           contentid = contentid.toString();
//           // Only add to DB if it's new
//           if (articleIds.indexOf(contentid) === -1) {
//             let deets = {};
//             deets.contentid = contentid;
//             deets.url = $(element)
//               .children("div.mixed-feed__item-header")
//               .children("div.mixed-feed__item-header-text")
//               .children("a")
//               .attr("href");
//             deets.headline = $(element)
//               .children("div.mixed-feed__item-header")
//               .children("div.mixed-feed__item-header-text")
//               .children("a")
//               .children("h4")
//               .text();
//             deets.summary = $(element)
//               .children("div.mixed-feed__item-header")
//               .children("div.mixed-feed__item-header-text")
//               .children("a")
//               .children("h5")
//               .text();
//             deets.publicationDate = $(element)
//               .children("div.mixed-feed__item-content")
//               .children("div.mixed-feed__meta")
//               .children("div.mixed-feed__timestamp")
//               .children("time")
//               .attr("datetime");
//             scrapings.push(deets);
//           }
//         }); //li.each()
//         Article.insertMany(scrapings)
//           .then(() => {
//             return res.redirect("/");
//           })
//           .catch(err => {
//             errors.err = err;
//             return res.status(500).json(errors);
//           });
//       }); //axios
//     }); //findOne() recent
// }); //router.get
