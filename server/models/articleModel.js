const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    header: { type: String },
    thumbnail: {
      type: String,
      default:
        "https://res.cloudinary.com/dbv6hao81/image/upload/v1692907118/images_oyef6e.jpg",
    },
    content: { type: String },
    tag: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    disLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    view: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = Article = mongoose.model("article", ArticleSchema);
