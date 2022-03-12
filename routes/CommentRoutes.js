const express = require("express");
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
    profilePicture: res.locals.profilePicture,
    author_displayname: res.locals.displayname,
    post_id: postId,
  });

  await newComment.save();

  let mainPost = await PostsModel.findOne({ _id: postId });
  mainPost.comments.push(newComment._id);
  mainPost.comments_count = mainPost.comments.length;
  await mainPost.save();

  res.redirect("/post/single/" + postId);
});

router.get("/edit/:id", followthem, async (req, res) => {
  const comment = await CommentsModel.findById(req.params.id).lean();

  let followthem = req.followthem;

  if (!comment) {
    res.render("not-found");
  }

  res.render("comment-single-home", { comment, followthem });
});

router.post("/edit/:id", async (req, res) => {
  const comment = await CommentsModel.findById(req.params.id);

  comment.content = req.body.content;

  if (!comment) {
    res.render("not-found");
  }
  await comment.save();
  res.redirect("/post/single/" + comment.post_id);

});

router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const comment = await CommentsModel.findById(id);

  const post_id = comment.post_id;

  await CommentsModel.findByIdAndDelete(id);

  res.redirect("/post/single/" + post_id);
});

module.exports = router;
