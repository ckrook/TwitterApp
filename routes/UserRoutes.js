const express = require("express");
const UsersModel = require("../models/UsersModel.js");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { timeAgo } = require("./../utils");
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
  console.log(id);
  console.log(userId);
  const mainUser = await UsersModel.findOne({ userId });
  console.log(mainUser);
  res.redirect("/");
});

router.put("/edit", (req, res) => {
  res.render("edit-profile");
});

router.delete("/delete", (req, res) => {
  res.render("delete-profile");
});

module.exports = router;
