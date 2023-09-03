const express = require("express");
const {
  newAdmin,
  adminLogin,
  logOut,
  updatePassword,
  deleteAccount,
  refreshAccessToken,
  editAboutUs,
  changeProfileBG,
  // publishArticle,
  deleteArticle,
} = require("../controllers/adminController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/new-admin", newAdmin);
router.post("/login/admin", adminLogin);
router.post("/admin/logout", logOut);
router.post("/refresh-token", refreshAccessToken);
router.post("/update/password/:user", updatePassword);
router.post("/delete/account", deleteAccount);
router.post("/edit/about", upload.single("profile"), editAboutUs);
router.post("/change-bg", upload.single("profile-bg"), changeProfileBG);
// router.post("/publish/article", upload.single("thumbnail"), publishArticle);
router.post("/delete/article", deleteArticle);

module.exports = router;
