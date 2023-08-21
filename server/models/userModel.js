const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  user: { type: String, required },
  email: { type: String, required },
  password: { type: String, required },
  profile: { type: String, default: "" },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "articles" }],
});

module.exports = User = mongoose.model("user", UserSchema);
