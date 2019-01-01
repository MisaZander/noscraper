const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StorySchema = new Schema({
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
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "comment"
  }
});

module.exports = Story = mongoose.model("Story", StorySchema);
