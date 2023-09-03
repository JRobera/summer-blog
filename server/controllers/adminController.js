const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { AES, enc } = require("crypto-js");
const { response } = require("express");
const { uploadToCloudinary } = require("../services/cloudinary");

const newAdmin = (req, res) => {
  const { user, password } = req.body;

  Admin.findOne({ user: user }).then((response) => {
    if (!response) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          throw err;
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            Admin.create({
              user: user,
              password: hash,
            });
            res.status(201).json("Accout Created!");
          }
        });
      });
    } else {
      res.json("Account already existes!");
    }
  });
};

const adminLogin = (req, res) => {
  const { user, password } = req.body;

  Admin.findOne({ user: user })
    .then((response) => {
      if (response) {
        bcrypt.compare(password, response.password, (err, result) => {
          if (result) {
            const admin = {
              _id: response._id,
              user: response.user,
              profile: response.profile,
            };
            const accessToken = jwt.sign(
              admin,
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "15m",
              }
            );
            const refreshToken = jwt.sign(
              admin,
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: "1d" }
            );
            Admin.updateOne(
              { user: response.user },
              { refreshToken: refreshToken }
            ).then((response) => {
              if (!response) {
                console.log("Error Token not updated");
              }
            });
            res.cookie("adjwt", refreshToken, {
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
    })
    .catch((err) => {
      console.log(err);
    });
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.adjwt;

  if (!refreshToken)
    return res.this?.status(401).json("You are not authenticated");
  Admin.findOne({ refreshToken: refreshToken }).then((result) => {
    if (result) {
      const admin = {
        _id: result._id,
        user: result.user,
        profile: result.profile,
      };
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, result) => {
          if (err) return res.sendStatus(403);

          const accessToken = jwt.sign(admin, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
          });
          res.status(200).json({ accessToken: accessToken });
        }
      );
    } else {
      res.redirect("/login/admin/page");
    }
  });
};

const updatePassword = (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = AES.decrypt(req.params?.user, process.env.SECRET_KEY).toString(
    enc.Utf8
  );

  Admin.findOne({ user: user }).then((response) => {
    if (response) {
      bcrypt.compare(oldPassword, response.password, (err, result) => {
        if (result) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              throw err;
            }
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) {
                throw err;
              } else {
                Admin.updateOne({ user: user }, { password: hash }).then(
                  (response) => {
                    if (response) {
                      res.status(200).json("Password Updated successfully!");
                    }
                  }
                );
              }
            });
          });
        } else {
          res.status(203).json("Previos Password does not match!");
        }
      });
    } else {
      res.status(203).json("User does not exist!");
    }
  });
};

const deleteAccount = (req, res) => {
  const { user } = req.body;
  Admin.findOneAndDelete({ user: user })
    .then((response) => {
      if (response) {
        res.status(200).json("Account Deleted");
      } else {
        res.status(203).json("User does not exist!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const logOut = (req, res) => {
  res.clearCookie("adjwt", { httpOnly: true, path: "/" });
  res.status(200).json("User Logged out");
};

const editAboutUs = async (req, res) => {
  console.log(req.file.mimetype);
  About.deleteMany({}).then((response) => {});
  if (
    req.file.mimetype == "image/png" ||
    req.file.mimetype == "image/jpg" ||
    req.file.mimetype == "image/jpeg"
  ) {
    try {
      const data = await uploadToCloudinary(req.file.path, "about_us_img");
      console.log(data);

      if (data) {
        const about = new About({
          profile: data.url,
          public_id: data.public_id,
          text: req.body.text,
        });
        const saveImg = await About.updateOne(
          {
            _id: about._id,
          },
          {
            $set: {
              profile: data.url,
              public_id: data.public_id,
            },
          }
        );
        const saveAbout = await about.save();
        res.status(200).json("About page updated");
      } else {
        res.status(203).json("Oops something went wrong!");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(400).json("Invalid File Type");
  }
};

const changeProfileBG = async (req, res) => {
  const imgData = await uploadToCloudinary(req.file.path, "profile_bg");
  const profile = await Admin.updateOne(
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
  Admin.findOne({ _id: req.body?.id }).then((response) => {
    if (response) {
      res.status(200).json(response);
    }
  });
};

// const publishArticle = async (req, res) => {
//   console.log(req.body);
//   if (
//     req.file.mimetype == "image/png" ||
//     req.file.mimetype == "image/jpg" ||
//     req.file.mimetype == "image/jpeg"
//   ) {
//     try {
//       const data = await uploadToCloudinary(
//         req.file.path,
//         "article_image_folder"
//       );

//       const article = new Article({
//         header: req.body.header,
//         thumbnail: data.url,
//         public_id: data.public_id,
//         content: req.body.article,
//         author: req.body.id,
//       });

//       const saveThumbnail = await Article.updateOne(
//         {
//           _id: article._id,
//         },
//         {
//           $set: {
//             thumbnail: data.url,
//             public_id: data.public_id,
//           },
//         }
//       );
//       const saveArticle = await article.save();

//       res.status(200).json("Article published Successfully!");
//     } catch (error) {
//       res.status(400).json(error);
//     }
//   } else {
//     res.status(400).json("Invalid File Type");
//   }
// };

const deleteArticle = (req, res) => {
  console.log(req.body);
  Article.findOneAndDelete({ _id: req.body.id }).then((response) => {
    if (response) {
      res.status(200).json("Article Deleted Successfuly");
    } else {
      res.json("Error!");
    }
  });
};

module.exports = {
  newAdmin,
  adminLogin,
  logOut,
  refreshAccessToken,
  updatePassword,
  deleteAccount,
  editAboutUs,
  changeProfileBG,
  // publishArticle,
  deleteArticle,
};
