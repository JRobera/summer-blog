const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    header: { type: String },
    thumbnail: { type: String, default: "" },
    content: { type: String },
    likes: { type: Number, default: 0 },
    disLikes: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    comments: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  },
  {
    timestamps: true,
  }
);

module.exports = Article = mongoose.model("article", ArticleSchema);
