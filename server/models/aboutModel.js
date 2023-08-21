const mongoose = require("mongoose");

const AboutSchema = mongoose.Schema({
  profile: { type: String },
  public_id: { type: String },
  text: { type: String },
  socialMedia: [{ type: String }],
});

module.exports = About = mongoose.model("about", AboutSchema);
