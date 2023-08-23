require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// routes
const AdminRoute = require("./routes/adminroutes");
const UserRoute = require("./routes/userroutes");

// models
const Admin = require("./models/adminModel");
const User = require("./models/userModel");
const Article = require("./models/articleModel");
const About = require("./models/aboutModel");
const Comment = require("./models/commentModel");

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`Error connecting to DB ${err}`);
  });

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", AdminRoute);
app.use("/", UserRoute);

app.listen(process.env.PORT || 3007, () => {
  console.log("Server started on Port " + process.env.PORT);
});
