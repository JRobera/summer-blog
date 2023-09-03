const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: {
      type: String,
      default:
        "https://res.cloudinary.com/dbv6hao81/image/upload/v1692969059/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR_blqb4r.jpg",
    },
    interests: [{ type: String }],
    bookMarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
    public_id: { type: String },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
    disLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
