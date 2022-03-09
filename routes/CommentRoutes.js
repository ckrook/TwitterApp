const express = require("express");
const router = express.Router();

const CommentsModel = require("../models/CommentsModel.js");
const PostsModel = require("../models/PostsModel.js");

router.get("/", (req, res) => {
  res.render("start");
});

router.get("/single", (req, res) => {
  res.redirect("single-comment");
});

router.post("/new/:id", async (req, res) => {
  const postId = req.params.id;

  const newComment = new CommentsModel({
    content: req.body.content,
    author_id: res.locals.userId,
    author_name: res.locals.username,
    author_displayname: res.locals.displayname,
    post_id: postId,
  });

  await newComment.save();

  // Find main post
  let mainPost = await PostsModel.findOne({ _id: postId });
  mainPost.comments.push(newComment._id);
  mainPost.comments_count = mainPost.comments.length;
  await mainPost.save();

  res.redirect("/post/single/" + postId);
});

router.put("/edit", (req, res) => {
  res.redirect("edit-comment");
});

router.delete("/delete", (req, res) => {
  res.redirect("delete-comment");
});

module.exports = router;
