const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    comment: { type: String, required: true },
    commentAuthor: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
  },
  { timestamps: true }
);

module.exports = Comment = mongoose.model("comment", CommentSchema);
