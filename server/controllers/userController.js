const { AES, enc } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

const updateuserProfile = (req, res) => {};

const publisharticle = (req, res) => {};

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
    Article.findOne({ _id: id }).then((response) => {
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

module.exports = {
  newUser,
  userLogin,
  refreshAccessToken,
  updateUserPassword,
  userLogout,
  updateuserProfile,
  publisharticle,
  getLatestArticle,
  getArticles,
  getArticle,
  searchArticle,
  getAbout,
};
