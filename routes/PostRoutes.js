const express = require("express");
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");
const UsersModel = require("../models/UsersModel");

const { forceAuthorize, followthem, sortPosts } = require("../middleware.js");

router.get("/", (req, res) => {
  res.render("start");
});

router.get("/single/:id", followthem ,  async (req, res) => {
  const post = await PostsModel.findById(req.params.id).lean();

  let followthem = req.followthem;

  res.render("post-single-home", { post, followthem });
});

router.post("/new", async (req, res) => {
  const userId = res.locals.userId;
  const username = res.locals.username;
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.render("home", {
      error: "This can't be empty big man",
    });
  } else {
    const newPost = new PostsModel({
      author_id: userId,
      author_name: username,
      content: content,
    });
    const user = await UsersModel.findOne({ userId });

    await newPost.save();

    res.redirect("/");
  }
});

router.put("/edit", (req, res) => {
  res.redirect("edit-post");
});

router.delete("/delete", (req, res) => {
  res.redirect("delete-post");
});

module.exports = router;
