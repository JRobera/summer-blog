const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILERUSER,
    pass: process.env.NODEMAILERPASS,
  },
});

const mailerOption = {
  from: process.env.NODEMAILERUSER,
  to: email,
  subject: "Password Reset Request",
  html: `<P>Click here<strong><a href=${test}></a></strong>to reset your password.</p>`,
};

transporter.sendMail(mailerOption, (err, info) => {
  if (error) {
    res.json(error);
  } else {
    resizeBy.json("Check you email for password reset link");
  }
});
