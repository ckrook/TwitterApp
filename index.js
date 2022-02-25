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

app.get("/sign-up", (req, res) => {
  res.render("signup");
});

app.get("/sign-up-extra", (req, res) => {
  res.render("signup-step-2");
});

app.get("/seed-data", async (req, res) => {
  const password = "admin";

  const adminUserCharles = new UsersModel({
    username: "CharlesKrook",
    hashedPassword: utils.hashedPassword(password),
    email: "Charles.Krook@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin"
  })
  const adminUserAlexia = new UsersModel({
    username: "AlexiaHellsten",
    hashedPassword: utils.hashedPassword(password),
    email: "Alexia.Hellsten@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin"
  })
  const adminUserSimon = new UsersModel({
    username: "SimonSandahl",
    hashedPassword: utils.hashedPassword(password),
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
