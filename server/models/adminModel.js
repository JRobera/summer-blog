const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  profile: {
    type: String,
    default:
      "https://res.cloudinary.com/dbv6hao81/image/upload/v1692457733/admin_default_image_vmyvub.jpg",
  },
  public_id: { type: String },
  user: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
});

module.exports = Admin = mongoose.model("admin", AdminSchema);
