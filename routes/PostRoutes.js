const express = require("express");
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");

const { forceAuthorize, followthem, sortPosts } = require("../middleware.js");
const UsersModel = require("../models/UsersModel.js");
const { timeAgo } = require("../utils.js");

router.get("/", (req, res) => {
  res.render("start");
});

router.get("/single/edit/:id", (req, res) => {
  res.render("edit-post-home");
});

router.get("/single/delete/:id", (req, res) => {
  res.render("delete-post-home");
});

router.get("/single/:id", followthem, sortPosts, async (req, res) => {
  const followthem = req.followthem;
  const userId = res.locals.userId;
  const id = req.params.id;
  const postId = req.params.id;
  const currentUser = res.locals.userId;

  const post = await PostsModel.findById(id).populate("comments").lean();
  const postComments = post.comments;

  for (const comment of postComments) {
    comment.created = timeAgo(comment.created);
  }

  for (let i = 0; i < postComments.length; i++) {
    if (postComments[i].author_id.toString() === userId.toString()) {
      postComments[i].editable = true;
    }
  }
  postComments.reverse();

  res.render("post-single-home", { post, followthem, postId, currentUser });
});

router.post("/new", async (req, res) => {
  const userId = res.locals.userId;
  const username = res.locals.username;
  const displayname = res.locals.displayname;
  const profilePicture = res.locals.profilePicture;
  const { content } = req.body;
  const postId = req.params.id;
  console.log(displayname);
  console.log(profilePicture);
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
      profilePicture: profilePicture,
    });

    await newPost.save();
    console.log(newPost);
    res.redirect("/");
  }
});

router.get("/edit/:id", followthem, sortPosts, async (req, res) => {
  const postId = req.params.id;

  const post = await PostsModel.findOne({ _id: postId }).lean();

  let followthem = req.followthem;

  const authorId = post.author_id;
  const currentUser = res.locals.userId;
  // const currentUsersPosts = await PostsModel.find({ author_id: userId });

  if (!currentUser == authorId) {
    res.send("You don't have edit access");
    res.redirect("/");
  } else if (currentUser == authorId) {
    res.redirect("/single/edit/:id");
  }

  res.render("edit-post-home", {
    post,
    postId,
    authorId,
    currentUser,
    followthem,
  });
});

//POST för edit
router.post("/edit/:id", async (req, res) => {
  const postId = req.params.id;

  const post = await PostsModel.findOneAndUpdate(
    { _id: postId },
    { $set: (content = req.body.content) }
  );

  if (!post.content || !post.content.trim()) {
    res.render("edit-post-home", {
      error: "This can't be empty",
    });
  } else {
    await post.save();
  }

  res.redirect("post/single/" + postId);
});

router.get("/delete/:id", async (req, res) => {
  const postId = req.params.id;
  const currentUser = res.locals.userId;

  const post = await PostsModel.findOne({ _id: postId }).lean();

  res.render("delete-post", { post, postId, authorId, currentUser });
});

router.post("/delete/:id", async (req, res) => {
  const postId = req.params.id;
  const userId = res.locals.userId;

  const post = await PostsModel.findOneAndDelete({ _id: postId });

  await post.save();

  res.redirect("/user/" + userId);
});

module.exports = router;
