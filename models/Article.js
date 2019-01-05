const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  contentid: {
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
    type: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments"
    }
  ]
});

module.exports = Article = mongoose.model("Article", ArticleSchema);
