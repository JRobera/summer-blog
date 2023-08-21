const { AES, enc } = require("crypto-js");

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
  const id = AES.decrypt(req.params?.id, process.env.SECRET_KEY).toString(
    enc.Utf8
  );
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
  getLatestArticle,
  getArticles,
  getArticle,
  searchArticle,
  getAbout,
};
