const express = require("express");
const {
  getLatestArticle,
  getArticles,
  getArticle,
  getAbout,
  searchArticle,
} = require("../controllers/userController");
const { sendMessage } = require("../controllers/contactUsController");

const router = express.Router();

router.get("/get/latest", getLatestArticle);
router.get("/get/articles", getArticles);
router.get("/about/info", getAbout);
router.get("/blog/:id", getArticle);

router.get("/search", searchArticle);

router.post("/api/send-message", sendMessage);

module.exports = router;
