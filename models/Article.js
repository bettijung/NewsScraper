// REQUIRE MONGOOSE * ============================================= *
const mongoose = require("mongoose");

// CREATE SCHEMA CLASS * ========================================== *
const Schema = mongoose.Schema;

// CREATE ARTICLE SCHEMA * ======================================== *
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
      type: String,
      required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
      type: Boolean,
      default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
