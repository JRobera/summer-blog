const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    comment: { type: String },
    comments: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  },
  { timestamps: true }
);

module.exports = Comment = mongoose.model("comment", CommentSchema);
