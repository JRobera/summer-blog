const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, default: "" },
    public_id: { type: String },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "articles" }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
