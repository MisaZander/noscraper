const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Comment = mongoose.model("comments", CommentSchema);
