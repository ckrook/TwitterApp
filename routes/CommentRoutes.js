const express = require('express');
const router = express.Router();

const CommentsModel = require("../models/CommentsModel.js");
const PostsModel = require("../models/PostsModel.js");

const { followthem } = require("../middleware.js");

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
    post_id: postId
  });

  await newComment.save();

  // Find main post
  let mainPost = await PostsModel.findOne({ _id: postId });

  mainPost.comments.push(newComment._id);

  await mainPost.save();

  res.redirect("/post/single/" + postId);
});

router.get("/edit/:id", followthem ,async (req, res) => {
  const comment = await CommentsModel.findById(req.params.id).lean();

  let followthem = req.followthem;

  res.render("comment-single-home", { comment, followthem });
});

router.post("/edit/:id", async (req, res) => {
  const comment = await CommentsModel.findById(req.params.id);

  comment.content = req.body.content;

  await comment.save();

  console.log(comment);

  res.redirect("/post/single/" + comment.post_id);
});

router.post("/delete/:id", (req, res) => {
  res.redirect("delete-comment");
});

module.exports = router;