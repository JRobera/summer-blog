const { AES, enc } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const { response } = require("express");
const { logOut } = require("./adminController");
const { verifyPayment } = require("../services/verifyPayment");
const { removeFromCloudinary } = require("../services/cloudinary");

const newUser = (req, res) => {
  const { userName, email, password } = req.body;

  User.findOne({ email: email }).then((response) => {
    if (!response) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILERUSER,
          pass: process.env.NODEMAILERPASS,
        },
      });

      const secret = process.env.ACCESS_TOKEN_SECRET + email;
      const user = { email: email, user: userName };
      const token = jwt.sign(user, secret, { expiresIn: "15m" });
      const verifyLink = `https://summer-blog-api.onrender.com/auth/email/${token}`;

      const mailerOption = {
        from: process.env.NODEMAILERUSER,
        to: email,
        subject: "Confirm email",
        html: `<p>Please verify you email by Clicking <strong><a href="${verifyLink}">here</a></strong>`,
      };
      try {
        transporter.sendMail(mailerOption, (error, info) => {
          if (error) {
            res.json(error);
          } else {
            res.json("Check your email for verification");
          }
        });
      } catch (error) {
        console.log(error.message);
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          throw err;
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            User.create({
              user: userName,
              email: email,
              password: hash,
              userToken: token,
            }).then((response) => {
              // const payload = {
              //   _id: response._id,
              //   user: response.user,
              //   email: response.email,
              //   profile: response.profile,
              // };
              // referst to the data that will be stored in cookie

              // const accessToken = jwt.sign(
              //   payload,
              //   process.env.ACCESS_TOKEN_SECRET,
              //   { expiresIn: "15m" }
              // );
              // const refreshToken = jwt.sign(
              //   payload,
              //   process.env.REFRESH_TOKEN_SECRET,
              //   { expiresIn: "1d" }
              // );

              // User.updateOne(
              //   { _id: response._id },
              //   { refreshToken: refreshToken }
              // ).then((response) => {
              //   if (!response) {
              //     console.log("Something went wrong");
              //   }
              // });

              // res.cookie("ujwt", refreshToken, {
              //   withCredentials: true,
              //   secure: true,
              //   sameSite: "none",
              //   httpOnly: true,
              // });

              res.status(201).json("Check your email for varification link");
            }); // then ends
          }
        });
      });
    } else {
      res.status(226).json("Accounte alredy exists");
    }
  });
};

const verifyUserEmail = (req, res) => {
  const { token } = req.params;

  User.findOne({ userToken: token })
    .then((response) => {
      if (response) {
        const secret = process.env.ACCESS_TOKEN_SECRET + response.email;
        try {
          jwt.verify(token, secret, async (err, user) => {
            if (err) return res.sendStatus(403).json("Invalid token");
            const updateUser = await User.updateOne(
              { _id: response._id },
              { isVerified: true, userToken: "" }
            );
            res.redirect(`https://summer-blog.onrender.com/signin`);
          });
        } catch (error) {
          res.json(error.message);
        }
      } else {
        res.json("Invalid user");
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((response) => {
    if (response) {
      if (response.isVerified) {
        bcrypt.compare(password, response.password, (err, result) => {
          if (result) {
            const payload = {
              _id: response._id,
              user: response.user,
              email: response.email,
              profile: response.profile,
            };

            const accessToken = jwt.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "15m",
              }
            );
            const refreshToken = jwt.sign(
              payload,
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: "3d",
              }
            );

            User.updateOne(
              { email: response.email },
              { refreshToken: refreshToken }
            ).then((respons) => {
              if (!response) {
                res.json("Sorry Error");
              }
            });

            res.cookie("ujwt", refreshToken, {
              withCredentials: true,
              secure: true,
              sameSite: "none",
              httpOnly: true,
            });
            res
              .status(200)
              .json({ accessToken: accessToken, refreshToken: refreshToken });
          } else {
            res.status(203).json("Incorrect Password!");
          }
        });
      } else {
        res.status(203).json("Invalid Accounte!");
      }
    } else {
      res.status(203).json("User does not exist!");
    }
  });
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.ujwt;

  if (!refreshToken)
    return res.this?.status(401).json("You are not authenticated");
  User.findOne({ refreshToken: refreshToken }).then((result) => {
    if (result) {
      const user = {
        _id: result._id,
        user: result.user,
        profile: result.profile,
      };
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, result) => {
          if (err) return res.sendStatus(403);

          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
          });
          res.status(200).json({ accessToken: accessToken });
        }
      );
    } else {
      res.redirect("/signin");
    }
  });
};

const updateUserPassword = (req, res) => {};

const userLogout = (req, res) => {
  res.clearCookie("ujwt");
  res.status(200).json("User Logged out");
};

const changeProfileImage = async (req, res) => {
  const imgData = await uploadToCloudinary(req.file.path, "profile_img");
  const profile = await User.updateOne(
    {
      _id: req.body?.id,
    },
    {
      $set: {
        profile: imgData.url,
        public_id: imgData.public_id,
      },
    }
  );
  User.findOne({ _id: req.body?.id }).then((response) => {
    if (response) {
      res.status(200).json(response);
    }
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then(async (response) => {
      if (response) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILERUSER,
            pass: process.env.NODEMAILERPASS,
          },
        });

        const secret = process.env.ACCESS_TOKEN_SECRET + response.password;
        const user = { email: response.email, id: response._id };
        const token = jwt.sign(user, secret, { expiresIn: "15m" });
        const resetLink = `https://summer-blog.onrender.com/reset-password/${token}/${response._id}`;
        const templatePath = path.join(
          __dirname,
          "../mails/password-reset-mail.ejs"
        );
        const data = { response, resetLink };
        const html = await ejs.renderFile(templatePath, data);
        const mailerOption = {
          from: process.env.NODEMAILERUSER,
          to: email,
          subject: "Password Reset Request",
          html,
        };

        transporter.sendMail(mailerOption, (error, info) => {
          if (error) {
            console.log(error);
            res.json(error);
          } else {
            res.json("Check your email for password reset link");
          }
        });
      } else {
        res.json("User not registered");
      }
    })
    .catch((error) => {
      res.json(error);
    });
};

const verifyResetPasswordLink = async (req, res) => {
  const { token, id } = req.params;
  User.findOne({ _id: id })
    .then((response) => {
      if (response) {
        const secret = process.env.ACCESS_TOKEN_SECRET + response.password;
        try {
          jwt.verify(token, secret, (err, user) => {
            if (err) return res.sendStatus(403).json("Invalid token");
            res.redirect(
              `https://summer-blog-api.onrender.com/reset-password/${token}/${id}`
            );
          });
        } catch (error) {
          res.json(error.message);
        }
      } else {
        res.json("Invalid user");
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
};

const setNewPassword = async (req, res) => {
  const { token, id } = req.params;
  const { newPassword } = req.body;

  User.findOne({ _id: id })
    .then((response) => {
      if (response) {
        const secret = process.env.ACCESS_TOKEN_SECRET + response.password;

        jwt.verify(token, secret, (err, user) => {
          if (err) return res.sendStatus(403);
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              throw err;
            }
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) {
                throw err;
              } else {
                User.updateOne({ _id: id }, { password: hash }).then(
                  (response) => {
                    if (response) {
                      res.status(200).json("Password Updated successfully!");
                    }
                  }
                );
              }
            });
          });
        });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
};

const changePassword = async (req, res) => {
  const { id, currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findOne({ _id: id }).select("password");
  if (user) {
    bcrypt.compare(currentPassword, user?.password, (err, result) => {
      if (result) {
        if (newPassword === confirmPassword) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              throw err;
            }
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) {
                throw err;
              } else {
                User.updateOne({ _id: id }, { password: hash }).then(
                  (response) => {
                    res.status(200).json("Password have been updated!");
                  }
                );
              }
            });
          });
        }
      }
    });
  } else {
    res.json("User not found");
  }
};

const updateuserInfo = async (req, res) => {
  // console.log(req.body);
  const { id, name, tags } = req.body;

  try {
    const updatedUser = await User.updateOne(
      { _id: id },
      { $set: { user: name, interests: tags } }
    );
    if (updatedUser) {
      res.status(200).json("Updated Successfully");
    } else {
      res.json("Sorry some thing went wrong");
    }
  } catch (error) {
    res.json(error);
  }
};

const publishArticle = async (req, res) => {
  if (
    req.file.mimetype == "image/png" ||
    req.file.mimetype == "image/jpg" ||
    req.file.mimetype == "image/jpeg"
  ) {
    try {
      const data = await uploadToCloudinary(
        req.file.path,
        "article_image_folder"
      );

      const article = new Article({
        header: req.body.header,
        thumbnail: data.url,
        public_id: data.public_id,
        tag: req.body.tag,
        content: req.body.article,
        author: req.body.id,
      });

      const saveThumbnail = await Article.updateOne(
        {
          _id: article._id,
        },
        {
          $set: {
            thumbnail: data.url,
            public_id: data.public_id,
          },
        }
      );
      const saveArticle = await article.save();
      User.updateOne({ _id: req.body.id }, { $push: { articles: article._id } })
        .then((response) => {
          // console.log("successful update");
        })
        .catch((err) => res.json("error user not updated"));

      res.status(200).json("Article published Successfully!");
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(400).json("Invalid File Type");
  }
};

const deleteArticle = (req, res) => {
  Article.findOneAndDelete({ _id: req.body.id }).then((response) => {
    removeFromCloudinary(response?.public_id);
    if (response) {
      res.status(200).json("Article Deleted Successfuly");
    } else {
      res.json("Error!");
    }
  });
};

// get article to update
const getArticleToUpdate = (req, res) => {
  const id = req.params?.id;
  Article.findOne({ _id: id })
    .select("header thumbnail tag content ")
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      }
    })
    .catch((error) => {
      res.json(error);
    });
};

const updateArticle = async (req, res) => {
  // console.log(req.body);
  if (req.body.thumbnail == "null") {
    try {
      const updatedArticle = await Article.updateOne(
        {
          _id: req.body.id,
        },
        {
          header: req.body.header,
          tag: req.body.tag,
          content: req.body.article,
        }
      );
      console.log("up_id: " + updateArticle?.public_id);
      res.status(200).json("Article updated!");
    } catch (error) {
      res.status(400).json(error.message);
    }
  } else {
    if (
      req.file.mimetype == "image/png" ||
      req.file.mimetype == "image/jpg" ||
      req.file.mimetype == "image/jpeg"
    ) {
      try {
        const data = await uploadToCloudinary(
          req.file.path,
          "article_image_folder"
        );

        const updatedArticle = await Article.updateOne(
          {
            _id: req.body.id,
          },
          {
            header: req.body.header,
            thumbnail: data.url,
            public_id: data.public_id,
            tag: req.body.tag,
            content: req.body.article,
          }
        );
        res.status(200).json("Article updated!");
      } catch (error) {
        res.status(400).json(error.message);
      }
    } else {
      res.status(400).json("Invalid File Type");
    }
  }
  // if (
  //   req.file.mimetype == "image/png" ||
  //   req.file.mimetype == "image/jpg" ||
  //   req.file.mimetype == "image/jpeg"
  // ) {
  // try {
  // const data = await uploadToCloudinary(
  //   req.file.path,
  //   "article_image_folder"
  // );

  // const updatedArticle = await Article.updateOne(
  //   {
  //     _id: req.body.id,
  //   },
  //   {
  //     header: req.body.header,
  // thumbnail: data.url,
  // public_id: data.public_id,
  //     tag: req.body.tag,
  //     content: req.body.article,
  //   }
  // );
  //   console.log(updatedArticle);
  // } catch (error) {
  //   res.status(400).json(error.message);
  // }
  // } else {
  //   res.status(400).json("Invalid File Type");
  // }
};

const likeArticle = async (req, res) => {
  const { id, userid } = req.body;
  // console.log(req.body);
  const article = await Article.findOne({ _id: id }).select("likes disLikes");
  if (article?.likes?.includes(userid)) {
    const rmlikeArticle = await Article.updateOne(
      { _id: id },
      { $pull: { likes: userid } },
      { new: true }
    );
    const rmlike = await User.updateOne(
      { _id: userid },
      { $pull: { likes: id } }
    );
    res.json(false);
  } else {
    if (article?.disLikes?.includes(userid)) {
      const rmdislikeArticle = await Article.updateOne(
        { _id: id },
        { $pull: { disLikes: userid } }
      );

      const rmdislike = await User.updateOne(
        { _id: userid },
        { $pull: { disLikes: id } }
      );
    }
    const likeArticle = await Article.findByIdAndUpdate(
      { _id: id },
      { $push: { likes: userid } },
      { new: true }
    );

    const userlikes = await User.findByIdAndUpdate(
      { _id: userid },
      { $push: { likes: id } }
    );

    // console.log("like");
    res.json(true);
  }
};

const dislikeArticle = async (req, res) => {
  const { id, userid } = req.body;

  const article = await Article.findOne({ _id: id }).select("likes disLikes");

  if (article?.disLikes?.includes(userid)) {
    const rmdislikeArticle = await Article.updateOne(
      { _id: id },
      { $pull: { disLikes: userid } }
    );
    const rmdislike = await User.updateOne(
      { _id: userid },
      { $pull: { disLikes: id } }
    );
    res.json(false);
  } else {
    const adddislikeArticle = await Article.updateOne(
      { _id: id },
      { $push: { disLikes: userid } }
    );
    const adddislike = await User.updateOne(
      { _id: userid },
      { $push: { disLikes: id } }
    );
    if (article?.likes?.includes(userid)) {
      const rmlikeArticle = await Article.updateOne(
        { _id: id },
        { $pull: { likes: userid } }
      );
      const rmlike = await User.updateOne(
        { _id: userid },
        { $pull: { likes: id } }
      );
      // console.log("xchange");
    }
    // console.log("dislike");
    res.json(true);
  }
};

const addComment = async (req, res) => {
  const { id, userid, comment } = req.body;
  const newComment = new Comment({
    comment: comment,
    commentAuthor: userid,
  });

  const article = await Article.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        comments: newComment?._id,
      },
    }
  );
  newComment.save();
  res.status(201).json("Comment have been Added");
};

const likeComment = async (req, res) => {
  const { id, userid } = req.body;

  const commentLike = await Comment.findOne({ _id: id }).select("likes");
  if (commentLike?.likes.includes(userid)) {
    const comment = await Comment.updateOne(
      { _id: id },
      { $pull: { likes: userid } }
    );
    res.json(false);
  } else {
    const comment = await Comment.updateOne(
      { _id: id },
      { $push: { likes: userid } }
    );
    res.status(200).json(true);
  }
};

const commentReply = async (req, res) => {
  const { commentid, userid, reply, comment } = req.body;
  const commentReply = await Comment.create({
    comment: reply,
    commentAuthor: userid,
  });
  if (commentReply) {
    const comment = await Comment.updateOne(
      { _id: commentid },
      { $push: { comments: commentid } }
    );
  }
};

const getLatestArticle = (req, res) => {
  Article.findOne({})
    .sort({ $natural: -1 })
    .then((response) => {
      res.json(response);
    });
};

const getArticles = (req, res) => {
  Article.find({})
    .sort({ $natural: -1 })
    .limit(10)
    .then((response) => {
      res.json(response);
    });
};

const searchArticle = (req, res) => {
  Article.find({
    $or: [
      { header: { $regex: "^[" + req.params.query + "]", $options: "i" } },
      { content: { $regex: "^[" + req.params.query + "]", $options: "i" } },
    ],
  }).then((response) => {
    res.json(response);
  });
};

const getUserDataEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await User.findOne({ _id: id }).select(
      "user interests -_id"
    );
    res.json(userData);
  } catch (error) {
    console.log(error.message);
  }
};

const getAbout = (req, res) => {
  About.findOne({}).then((response) => {
    res.json(response);
  });
};

const getArticle = (req, res) => {
  const id = req.params?.id;

  // const id = AES.decrypt(req.params?.id, process.env.SECRET_KEY).toString(enc.Utf8);
  try {
    Article.findOne({ _id: id })
      .select(
        "author thumbnail content disLikes likes comments header createdAt"
      )
      .populate({ path: "author", select: "user profile" })
      .populate({
        path: "comments",
        populate: { path: "commentAuthor", select: "profile user" },
      })
      .then((response) => {
        if (response) {
          res.status(200).json(response);
        } else {
          res.status(404).json("Error not found!");
        }
      });
  } catch (err) {
    res.json(err);
  }
};

const getCommentReplys = async (req, res) => {
  // console.log(req.body);
  const { commentid } = req.body;
  const reply = await Comment.findOne({ _id: commentid }).select("comments");
  // .populate({ path: "comments"});
};

const getPublishedArticles = async (req, res) => {
  const { u_id } = req.body;

  const userArticles = await User.findOne({ _id: u_id })
    .select("articles")
    .populate({
      path: "articles",
      select: "_id header thumbnail content createdAt",
    });

  if (userArticles) {
    res.status(200).json(userArticles.articles);
  } else {
    res.json("An error occured");
  }
};

const getFilterdArticle = async (req, res) => {
  const { id } = req.body;
  const interests = await User.findOne({ _id: id }).select("interests -_id");
  // console.log(interests.interests);
  Article.find({ tag: { $in: interests.interests } })
    .sort({ $natural: -1 })
    .limit(10)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.json(error);
    });
};

const addBookMark = async (req, res) => {
  const { id, articleid } = req.body;

  const userBookMark = await User.findOne({ _id: id }).select("bookMarks -_id");
  if (userBookMark?.bookMarks.includes(articleid)) {
    User.updateOne({ _id: id }, { $pull: { bookMarks: articleid } }).then(
      (response) => {
        if (response) {
          res.status(208).json("BookMark removed");
        } else {
          res.json("Error");
        }
      }
    );
  } else {
    User.updateOne({ _id: id }, { $push: { bookMarks: articleid } }).then(
      (response) => {
        if (response) {
          res.status(200).json("Added to bookmark");
        } else {
          res.json("Error");
        }
      }
    );
  }
};

const getBookMarks = async (req, res) => {
  const { userId } = req.body;
  // console.log(req.body);
  try {
    const bookMarks = await User.findOne({ _id: userId })
      .select("bookMarks")
      .populate({
        path: "bookMarks",
        select: "header thumbnail content author createdAt",
        populate: { path: "author" },
      });
    // console.log(bookMarks);
    res.status(200).json(bookMarks);
  } catch (error) {}
};

// PAYMENT CONTROLLER
const paymentCallback = async (req, res) => {
  const { tx_ref } = req.query;
  const status = await verifyPayment(tx_ref);
  if (status === "success") {
    const paymentSuccess = { paymentSuccess: true };

    res.redirect("https://summer-blog.onrender.com/home?paymentSuccess=true");
    console.log("Success");
  } else {
    res.redirect("https://summer-blog.onrender.com/payment-failure");
  }
};

module.exports = {
  verifyUserEmail,
  newUser,
  userLogin,
  refreshAccessToken,
  updateUserPassword,
  userLogout,
  changeProfileImage,
  forgotPassword,
  verifyResetPasswordLink,
  setNewPassword,
  changePassword,
  updateuserInfo,
  publishArticle,
  deleteArticle,
  updateArticle,
  getArticleToUpdate,
  likeArticle,
  dislikeArticle,
  addComment,
  likeComment,
  commentReply,
  getLatestArticle,
  getArticles,
  getArticle,
  getCommentReplys,
  getPublishedArticles,
  searchArticle,
  getUserDataEdit,
  getAbout,
  getFilterdArticle,
  addBookMark,
  getBookMarks,
  paymentCallback,
};
