const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  contentId: {
    type: String,
    unique: true,
    required: true
  },
  headline: {
    type: String
  },
  summary: {
    type: String
  },
  url: {
    type: String
  },
  image: {
    type: String
  },
  publicationDate: {
    type: Date
  }
});

module.exports = Article = mongoose.model("articles", ArticleSchema);
