const express = require("express");
const {
  getLatestArticle,
  getArticles,
  getArticle,
  getAbout,
  searchArticle,
  newUser,
  userLogin,
  userLogout,
  refreshAccessToken,
  updateuserProfile,
  updateUserPassword,
} = require("../controllers/userController");

const { sendMessage } = require("../controllers/contactUsController");

const router = express.Router();

router.post("/create/new-user", newUser);
router.post("/login", userLogin);
router.post("/user-refresh-token", refreshAccessToken);
router.post("/update/user-password", updateUserPassword);
router.post("/logout", userLogout);
router.post("update/user-profile", updateuserProfile);

router.get("/get/latest", getLatestArticle);
router.get("/get/articles", getArticles);
router.get("/about/info", getAbout);
router.get("/blog/:id", getArticle);

router.get("/search", searchArticle);

router.post("/api/send-message", sendMessage);

module.exports = router;
