const express = require("express");
const UsersModel = require("../models/UsersModel.js");
const router = express.Router();

const mongoose = require("mongoose");
const { timeAgo, getUniqueFilename } = require("./../utils");
//LOG IN
router.get("/", (req, res) => {
  res.render("signup");
});

router.post("/log-in", (req, res) => {
  res.redirect("start");
});

//LOG OUT
router.post("/log-out", (req, res) => {
  res.redirect("home");
});

//SIGN UP
router.get("/sign-up", (req, res) => {
  res.render("signup");
});

router.post("/sign-up", (req, res) => {
  res.render("signup");
});

router.get("/sign-up-extra", (req, res) => {
  res.render("signup-step-2");
});
const { forceAuthorize, followthem } = require("./../middleware.js");
const PostsModel = require("../models/PostsModel.js");

//USER PROFILE
router.get("/:id", followthem, async (req, res) => {
  let edit = false;
  const id = req.params.id;
  let followthem = req.followthem;
  const profile = await UsersModel.findOne({ _id: id }).lean();
  const posts = await PostsModel.find({ author_id: id }).lean();

  for (let post of posts) {
    post.created = timeAgo(post.created);
  }
  if (id === res.locals.userId) {
    edit = true;
  }
  res.render("user-profile", { followthem, posts, profile, edit });
});

router.post("/follow", async (req, res) => {
  const userId = res.locals.userId;
  const id = req.query.id;
  const mainUser = await UsersModel.findOne({ userId });

  res.redirect("/");
});

router.get("/edit/:id", followthem, async (req, res) => {
  const id = req.params.id;
  let followthem = req.followthem;
  if (res.locals.userId === id) {
    const user = await UsersModel.findOne({ _id: id }).lean();
    res.render("profile-edit", { user, followthem });
  }
});

router.post("/edit/:id", followthem, async (req, res) => {
  let edit = false;
  const id = req.params.id;
  if (id === res.locals.userId) {
    edit = true;
  }
  let followthem = req.followthem;
  let coverimage = "";
  let coverimagefilename = "";
  let coverimageuploadPath = "";
  let image = "";
  let filename = "";
  let uploadPath = "";
  if (req.files && req.files.image) {
    image = req.files.image;
    filename = getUniqueFilename(image.name);
    uploadPath =
      "/Users/charleskrook/Documents/twitter-clone" +
      "/public/uploads/" +
      filename;
    await image.mv(uploadPath);
    const dbUser = await UsersModel.findOne({ _id: id });
    dbUser.profilePicture = "/uploads/" + filename;
    const profile = await UsersModel.findOne({ _id: id }).lean();
    await dbUser.save();
  }
  if (req.files && req.files.coverimage) {
    coverimage = req.files.coverimage;
    coverimagefilename = getUniqueFilename(coverimage.name);
    coverimageuploadPath =
      "/Users/charleskrook/Documents/twitter-clone" +
      "/public/uploads/" +
      coverimagefilename;
    await coverimage.mv(coverimageuploadPath);
    const dbUser = await UsersModel.findOne({ _id: id });
    dbUser.coverimage = "/uploads/" + coverimagefilename;
    await dbUser.save();
  }

  const { displayname, username, email, bio, city, website } = req.body;
  if (res.locals.userId === id) {
    const dbUser = await UsersModel.findOne({ _id: id });
    dbUser.displayname = displayname;
    dbUser.username = username;
    dbUser.email = email;
    dbUser.bio = bio;
    dbUser.city = city;
    dbUser.website = website;
    await dbUser.save();
    const profile = await UsersModel.findOne({ _id: id }).lean();
    res.render("user-profile", { profile, followthem, edit });
  }
});

router.post("/delete/:id", async (req, res) => {
  await UsersModel.findByIdAndDelete(req.params.id);

  res.cookie("token", "", { maxAge: 0 });

  res.redirect("/");
});

module.exports = router;
