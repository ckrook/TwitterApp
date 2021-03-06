// GRUPP 4 / Charles Krook, Simon Sandahl, Alexia Hellsten

require("dotenv").config();
require("./mongoose.js");
require("./passport.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const UsersModel = require("./models/UsersModel.js");
const utils = require("./utils.js");
const userRoutes = require("./routes/UserRoutes.js");
const postRoutes = require("./routes/PostRoutes.js");
const commentRoutes = require("./routes/CommentRoutes.js");
const seedDataRoutes = require("./routes/SeedDataRoutes.js");
const PostsModel = require("./models/PostsModel.js");
const passport = require("passport");

const app = express();

app.use(passport.initialize());

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
app.use(express.static("public"));
app.use(cookieParser());
app.use(fileupload());

app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loginInfo = tokenData.displayName + " " + tokenData.id;
    res.locals.loggedIn = true;
    res.locals.userId = tokenData.userId;
    res.locals.username = tokenData.username;
    res.locals.displayname = tokenData.displayname;
    res.locals.profilePicture = tokenData.profilePicture;
    res.locals.bio = tokenData.bio;
    res.locals.city = tokenData.city;
    res.locals.following_count = tokenData.following_count;
    res.locals.followers_count = tokenData.followers_count;
    res.locals.posts_count = tokenData.posts_count;
  } else {
    res.locals.loggedin = false;
  }
  next();
});

const { forceAuthorize, followthem, sortPosts } = require("./middleware");

app.get("/", sortPosts, followthem, async (req, res) => {
  let posts = req.sortPosts;
  let followthem = req.followthem;
  let id = res.locals.userId;
  const profile = await UsersModel.findOne({ _id: id }).lean();

  res.render("home", { posts, followthem, profile });
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/seed-data", seedDataRoutes);

app.post("/login", async (req, res) => {
  const error = "Användarnamn eller lösenord är felaktigt";
  const { username, password } = req.body;
  UsersModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.hashedPassword)) {
      const bio = user.bio;
      const city = user.city;
      const following_count = user.follows.length;
      const followers_count = user.followers.length;
      const posts_count = user.posts.length;
      const profilePicture = user.profilePicture;
      const displayname = user.displayname;
      const userData = {
        userId: user._id,
        username,
        displayname,
        bio,
        city,
        following_count,
        profilePicture,
        followers_count,
        posts_count,
      };

      const accesToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accesToken);
      res.redirect("/");
    } else {
      res.render("home", { error });
    }
  });
});

app.get("/", (req, res) => {
  res.render("login-module");
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),

  async (req, res) => {
    const googleId = req.user.id;

    UsersModel.findOne({ googleId }, async (err, user) => {
      if (user) {
        const bio = user.bio;
        const city = user.city;
        const following_count = user.follows.length;
        const followers_count = user.followers.length;
        const profilePicture = user.profilePicture;
        const posts_count = user.posts.length;
        const displayname = user.displayname;
        const userData = {
          userId: user._id,
          username: user.username,
          displayname,
          bio,
          city,
          following_count,
          followers_count,
          posts_count,
          profilePicture,
        };
        userData.id = user._id;
        const accesToken = jwt.sign(userData, process.env.JWTSECRET);
        res.cookie("token", accesToken);
        res.redirect("/");
      } else {
        const newUser = new UsersModel({
          googleId,
          username:
            req.user.displayName.replace(/ /g, "") +
            Math.floor(Math.random() * 100),
          displayname: req.user.displayName,
          hashedPassword: utils.hashedPassword(utils.genPassword()),
          email: req.user.emails[0].value,
        });
        await newUser.save();

        const user = UsersModel.findOne({ googleId }, async (err, user) => {
          const bio = user.bio;
          const city = user.city;
          const following_count = user.follows.length;
          const followers_count = user.followers.length;
          const posts_count = user.posts.length;
          const displayname = user.displayname;
          const userData = {
            userId: user._id,
            username: user.username,
            displayname,
            bio,
            city,
            following_count,
            followers_count,
            posts_count,
          };
          userData.id = user._id;

          const accesToken = jwt.sign(userData, process.env.JWTSECRET);
          res.cookie("token", accesToken);
          res.redirect("/");
        });
      }
    });
  }
);

app.get("/sign-up", (req, res) => {
  res.render("signup");
});
app.post("/sign-up", async (req, res, next) => {
  const { username, password, confirmpassword, email } = req.body;

  UsersModel.findOne({ username }, async (err, user) => {
    if (user)
      return res
        .status(400)
        .render("signup", { error: "Username already exists" });
    if (password !== confirmpassword)
      return res
        .status(400)
        .render("signup", { error: "Password do not match" });
    UsersModel.findOne({ email }, async (err, user) => {
      if (email === username.email)
        return res
          .status(400)
          .render("signup", { error: "Email already exist in our system" });
    });

    const newUser = new UsersModel({
      username: req.body.username,
      displayname: req.body.displayname,
      hashedPassword: utils.hashedPassword(password),
      email: req.body.email,
      created: Date.now(),
      role: "User",
    });
    await newUser.save();

    UsersModel.findOne({ username }, (err, user) => {
      if (user && utils.comparePassword(password, user.hashedPassword)) {
        // Login successful
        const bio = user.bio;
        const city = user.city;
        const following_count = user.follows.length;
        const followers_count = user.followers.length;
        const displayname = user.displayname;
        const profilePicture = user.profilePicture;
        const posts_count = user.posts.length;
        const userData = {
          userId: user._id,
          username,
          bio,
          city,
          displayname,
          profilePicture,
          following_count,
          followers_count,
          posts_count,
        };
        const accesToken = jwt.sign(userData, process.env.JWTSECRET);

        res.cookie("token", accesToken);
      }
    });

    res.render("signup-step-2");
  });
});

app.post("/sign-up-extra", async (req, res) => {
  const id = res.locals.userId;
  const { dateOfBirth, city, phonenumber, website, bio } = req.body;
  let dbUser = await UsersModel.findOne({ _id: id });
  dbUser.dateOfBirth = dateOfBirth;
  dbUser.city = city;
  dbUser.phonenumber = phonenumber;
  dbUser.website = website;
  dbUser.bio = bio;

  await dbUser.save();
  res.redirect("/");
});

app.get("/sign-up-extra", (req, res) => {
  res.render("signup-step-2");
});

app.get("/secret2", forceAuthorize, (req, res) => {
  res.send("This is a secret page");
});

app.post("/log-out", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

app.use("/", (req, res) => {
  res.status(404).render("not-found");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
