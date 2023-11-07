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
  updateuserInfo,
  updateUserPassword,
  publishArticle,
  deleteArticle,
  updateArticle,
  getArticleToUpdate,
  dislikeArticle,
  likeArticle,
  addComment,
  likeComment,
  getFilterdArticle,
  addBookMark,
  forgotPassword,
  verifyResetPasswordLink,
  setNewPassword,
  paymentCallback,
  getBookMarks,
  changeProfileImage,
  getPublishedArticles,
  changePassword,
  verifyUserEmail,
  commentReply,
  getCommentReplys,
  getUserDataEdit,
  addView,
} = require("../controllers/userController");
const upload = require("../middleware/upload");

const { sendMessage } = require("../controllers/contactUsController");

const router = express.Router();

router.get("/auth/email/:token", verifyUserEmail);
router.post("/create/new-user", newUser);
router.post("/login", userLogin);
router.post("/user-refresh-token", refreshAccessToken);
router.post("/update/user-password", updateUserPassword);
router.post("/logout", userLogout);
router.post(
  "/change-profile-image",
  upload.single("profile-img"),
  changeProfileImage
);
router.post("/forgot/password", forgotPassword);
router.get("/reset-password/:token/:id", verifyResetPasswordLink);
router.post("/reset-password/:token/:id", setNewPassword);
router.post("/change-password", changePassword);
router.post("/update-user-info", updateuserInfo);
router.post("/publish/article", upload.single("thumbnail"), publishArticle);
router.post("/delete/article", deleteArticle);
router.post("/update/article", upload.single("thumbnail"), updateArticle);
router.post("/like", likeArticle);
router.post("/dislike", dislikeArticle);
router.post("/new-comment", addComment);
router.post("/like/comment", likeComment);
router.post("/add/comment/reply", commentReply);
router.post("/get/reply", getCommentReplys);
router.post("/add/bookmark", addBookMark);
router.post("/get/my/book-marks", getBookMarks);
router.post("/get/published-article", getPublishedArticles);
router.put("/count-view", addView);

router.get("/get/users/data/:id", getUserDataEdit);
router.get("/get/latest", getLatestArticle);
router.get("/get/articles", getArticles);
router.get("/about/info", getAbout);
router.get("/blog/:id", getArticle);
router.get("/article/to-update/:id", getArticleToUpdate);

router.get("/search", searchArticle);

router.post("/api/send-message", sendMessage);
router.post("/filterd/articles", getFilterdArticle);
router.get("/payment-callback", paymentCallback);

module.exports = router;
