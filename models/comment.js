const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  story: {
    type: Schema.Types.ObjectId,
    ref: "articles"
  }, //Reference the Article model
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Comment = mongoose.model("comments", CommentSchema);
