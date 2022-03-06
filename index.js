require("dotenv").config();
require("./mongoose.js");

const mongoose = require("mongoose");
const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const UsersModel = require("./models/UsersModel.js");
const utils = require("./utils.js");
const userRoutes = require("./routes/UserRoutes.js");
const postRoutes = require("./routes/PostRoutes.js");
const commentRoutes = require("./routes/CommentRoutes.js");
const seedDataRoutes = require("./routes/SeedDataRoutes.js");
const PostsModel = require("./models/PostsModel.js");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatDate: (time) => {
        const date = new Date(time);
        return date.toLocaleDateString() + " · " + date.toLocaleTimeString();
      },
    },
  })
);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//////////////////
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
    res.locals.displayname = tokenData.displayname;
    res.locals.hashedPassword = tokenData.hashedPassword;
    res.locals.bio = tokenData.bio;
    res.locals.city = tokenData.city;
    res.locals.created = tokenData.created;
    res.locals.phonenumber = tokenData.phonenumber,
    res.locals.dateOfBirth = tokenData.dateOfBirth,
    res.locals.website = tokenData.website,
    res.locals.following_count = tokenData.following_count;
    res.locals.followers_count = tokenData.followers_count;
    res.locals.posts_count = tokenData.posts_count;
  } else {
    // Not Logged in
    res.locals.loggedin = false;
  }
  next();
});

const { forceAuthorize, followthem, sortPosts } = require("./middleware");
const { json } = require("express/lib/response");
const { token } = require("morgan");

//////////////////////
// MIDDLEWARES ENDS//
////////////////////

app.get("/", sortPosts, followthem, async (req, res) => {
  let posts = req.sortPosts;
  let followthem = req.followthem;

  res.render("home", { posts, followthem });
});

// ROUTES

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/seed-data", seedDataRoutes);

// END OF ROUTES

// Login //
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  UsersModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.hashedPassword)) {
      // Login successful
      const bio = user.bio;
      const city = user.city;
      const following_count = user.follows.length;
      const followers_count = user.followers.length;
      const posts_count = user.posts.length;
      const displayname = user.displayname;
      const userData = {
        userId: user._id,
        username,
        displayname,
        bio,
        city,
        following_count,
        followers_count,
        posts_count,
      };
      const accesToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accesToken);
      res.redirect("/");
    } else {
      console.log(err);
      res.send("Login failed");
    }
  });
});

app.get("/", (req, res) => {
  res.render("login-module");
});

app.get("/sign-up", (req, res) => {
  res.render("signup");
});

app.get("/sign-up-extra", async (req, res) => { 
  res.render("signup-step-2");
});

app.post("/sign-up", async (req, res, next) => {

  const { username, password, confirmPassword, email } = req.body;

    const newUser = new UsersModel({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      displayname: req.body.displayname,
      hashedPassword: utils.hashedPassword(password),
      email: req.body.email,
      created: Date.now(),
      role: "User",
    });

    const userToken = jwt.sign(newUser.toJSON(), process.env.JWTSECRET);
    res.cookie("token", userToken);

    await newUser.save();

    UsersModel.find({ username, email, password }, async (err, user, emailadress, password) => {
      if (user == username) {
        res.status(200).send("Username taken");
      }  
      if (emailadress) {
        res.status(200).send("Email already in use");
      }
      if (password !== confirmPassword)
      {
        res.status(200).send("Passwords don't match");
      }
      else {
        console.log(err);
      }
    });
    res.redirect("/sign-up-extra");
  });


app.post("/sign-up-extra", async (req, res) => {

  const userData = req.cookies.userToken;
    
  UsersModel.findOne({ _id: userData.id }, async (err, user) => {

    if (user) {
      
      const updatedUser = new UsersModel({
        _id: userData.id,
        username: userData.username,
        displayname: userData.displayname,
        hashedpassword: userData.hashedPassword,
        email: userData.email,
        created: userData.created,
        role: userData.role,
        city: req.body.city,
        phonenumber: req.body.phonenumber,
        dateOfBirth: req.body.dateOfBirth,
        bio: req.body.bio,
        website: req.body.website,
      });
      
      await updatedUser.save();  
    }
    else {
      console.log(err);
      res.redirect("/home");
    }
  });
});

app.get("/secret2", forceAuthorize, (req, res) => {
  res.send("This is a secret page");
});

app.post("/log-out", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
