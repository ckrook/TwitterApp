require("dotenv").config();
require("./mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const UsersModel = require("./models/UsersModel.js");
const utils = require("./utils.js");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home");
});

// SIGN IN //
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  UsersModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.hashedPassword)) {
      // Login successful
      const userData = { userId: user._id, username };
      const accesToken = jwt.sign(userData, process.env.JWTSECRET);
      res.cookie("token", accesToken);
      res.redirect("/");
    } else {
      res.send("Login failed");
    }
  });
});

app.get("/sign-up", (req, res) => {
  res.render("signup");
});

app.get("/sign-up-extra", (req, res) => {
  res.render("signup-step-2");
});

app.get("/seed-data", async (req, res) => {
  const adminUserCharles = new UsersModel({
    username: "CharlesKrook",
    hashedPassword: "admin",
    email: "Charles.Krook@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin"
  })
  const adminUserAlexia = new UsersModel({
    username: "AlexiaHellsten",
    hashedPassword: "admin",
    email: "Alexia.Hellsten@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin"
  })
  const adminUserSimon = new UsersModel({
    username: "SimonSandahl",
    hashedPassword: "admin",
    email: "Simon.Sandahl@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin"
  })

  await adminUserCharles.save();
  await adminUserAlexia.save();
  await adminUserSimon.save();

  res.send("Boom admins are created! Gå bara hit en gång dock annars blir de nog knas. Kolla i mongodb compass så användarna finns där");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
