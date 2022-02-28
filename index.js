require("dotenv").config();
require("./mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const UsersModel = require("./models/UsersModel.js");
const utils = require("./utils.js");
const userRoutes = require("./routes/UserRoutes.js");
const postRoutes = require("./routes/PostRoutes.js");
const commentRoutes = require("./routes/CommentRoutes.js");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatDate: (time) => {
        const date = new Date(time);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      },
    },
  })
);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/////////////////
// MIDDLEWARES //
////////////////
app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    // Logged in
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.userId = tokenData.userId;
    res.locals.username = tokenData.username;
  } else {
    // Not Logged in
    res.locals.loggedin = false;
  }
  next();
});

const forceAuthorize = (req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    next();
  } else {
    res.sendStatus(401);
  }
};
/////////////////////
// MIDDLEWARES ENDS//
////////////////////

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// Login //
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

//Sign up
app.post("/sign-up", async (req, res) => {
  res.render("signup");
  const { username, password, confirmPassword, email} = req.body;

  UsersModel.findOne({ username }, async (err, user) => {
    if (user) {
      return res.status(400).send('Username is already taken');
    }

    UsersModel.findOne({ email }, async (err, user) => {
    if (email == user.email) {
      return res.status(400).send("Email already in use");
    }
    
    UsersModel.findOne({ password }, async (err, user) => {
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords don't match");
    }
    
      const newUser = new UsersModel({
        username: req.body.username,
        hashedPassword: utils.hashedPassword(password),
        email: req.body.email,
        city: req.body.city,
        dateOfBirth: req.body.dateOfBirth,
        created: Date.now(),
        role: "User",
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,
        posts: req.body.posts,
        likedPosts: req.body.likedPosts
      });

      await newUser.save();
      res.redirect("/");
    });
  });
});
});

app.get("/sign-up", (req, res) => {
  res.render("signup");
});

app.get("/sign-up-extra", (req, res) => {
  res.render("signup-step-2");
});

app.get("/secret2", forceAuthorize, (req, res) => {
  res.send("This is a secret page");
});

app.get("/seed-data", async (req, res) => {
  const password = "admin";

  const adminUserCharles = new UsersModel({
    username: "CharlesKrook",
    hashedPassword: utils.hashedPassword(password),
    email: "Charles.Krook@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin",
  });
  const adminUserAlexia = new UsersModel({
    username: "AlexiaHellsten",
    hashedPassword: utils.hashedPassword(password),
    email: "Alexia.Hellsten@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin",
  });
  const adminUserSimon = new UsersModel({
    username: "SimonSandahl",
    hashedPassword: utils.hashedPassword(password),
    email: "Simon.Sandahl@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    role: "Admin",
  });

  await adminUserCharles.save();
  await adminUserAlexia.save();
  await adminUserSimon.save();

  res.send(
    "Boom admins are created! Gå bara hit en gång dock annars blir de nog knas. Kolla i mongodb compass så användarna finns där"
  );
});

app.post("/log-out", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
