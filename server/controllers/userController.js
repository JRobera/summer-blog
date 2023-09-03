const { AES, enc } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { response } = require("express");
const { logOut } = require("./adminController");
const { verifyPayment } = require("../services/verifyPayment");

const newUser = (req, res) => {
  const { user, email, password } = req.body;

  User.findOne({ email: email }).then((response) => {
    if (!response) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          throw err;
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            User.create({
              user: user,
              email: email,
              password: hash,
            }).then((response) => {
              const payload = {
                _id: response._id,
                user: response.user,
                email: response.email,
                profile: response.profile,
              }; // referst to the data that will be stored in cookie

              const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
              );
              const refreshToken = jwt.sign(
                payload,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
              );

              User.updateOne(
                { _id: response._id },
                { refreshToken: refreshToken }
              ).then((response) => {
                if (!response) {
                  console.log("Something went wrong");
                }
              });

              res.cookie("ujwt", refreshToken, {
                withCredentials: true,
                secure: true,
                sameSite: "none",
                httpOnly: true,
              });

              res
                .status(201)
                .json({ accessToken: accessToken, refreshToken: refreshToken });
            });
          }
        });
      });
    } else {
      res.status(226).json("Accounte alredy exists");
    }
  });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((response) => {
    if (response) {
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
              expiresIn: "1d",
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
          res.status(203).json("Incorrect Password");
        }
      });
    } else {
      res.status(203).json("User does not existe!");
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
  res.clearCookie("ujwt", { httpOnly: true, path: "/" });
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
    .then((response) => {
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
        const resetLink = `http://localhost:5173/reset-password/${token}/${response._id}`;

        const mailerOption = {
          from: process.env.NODEMAILERUSER,
          to: email,
          subject: "Password Reset Request",
          html: `<p>Click <strong><a href="${resetLink}"> here </a></strong> to reset your password.</p>`,
        };

        transporter.sendMail(mailerOption, (error, info) => {
          if (error) {
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
      res.json(err);
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
            res.redirect(`http://localhost:5173/reset-password/${token}/${id}`);
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
    console.log(user);
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
      .select("author content disLikes likes comments header createdAt")
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

    res.redirect(
      "http://localhost:5173/home?showModal=true&paymentSuccess=true"
    );
    console.log("Success");
  } else {
    res.redirect("http://localhost:5173/payment-failure");
  }
};

module.exports = {
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
  likeArticle,
  dislikeArticle,
  addComment,
  getLatestArticle,
  getArticles,
  getArticle,
  getPublishedArticles,
  searchArticle,
  getAbout,
  getFilterdArticle,
  addBookMark,
  getBookMarks,
  paymentCallback,
};
