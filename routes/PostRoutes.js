const express = require("express");
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");

const { followthem } = require("../middleware.js");
const { timeAgo } = require("../utils.js");

router.get("/", (req, res) => {
  res.render("start");
});

router.get("/single/:id", followthem, async (req, res) => {
  const followthem = req.followthem;
  const userId = res.locals.userId;
  const id = req.params.id;

  const post = await PostsModel.findById(id)
    .populate("comments")
    .lean();
    
  const postComments = post.comments;

  for (const comment of postComments) {
    comment.created = timeAgo(comment.created);
  }

  for (let i = 0; i < postComments.length; i++) {
    if(postComments[i].author_id.toString() === userId.toString()){
      postComments[i].editable = true;
    }
  }

  res.render("post-single-home", { post, followthem });
});

router.post("/new", async (req, res) => {
  const userId = res.locals.userId;
  const username = res.locals.username;
  const displayname = res.locals.displayname;
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.render("home", {
      error: "This can't be empty big man",
    });
  } else {
    const newPost = new PostsModel({
      author_id: userId,
      author_name: username,
      author_displayname: displayname,
      content: content,
    });

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
