const express = require("express");
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");

const { forceAuthorize, followthem, sortPosts } = require("../middleware.js");
const UsersModel = require("../models/UsersModel.js");

router.get("/", (req, res) => {
  res.render("start");
});

router.get("/single/:id", followthem, sortPosts,  async (req, res) => {
  const post = await PostsModel.findById(req.params.id)
    .populate("comments")
    .lean();

    let followthem = req.followthem;

  res.render("post-single-home", { post, followthem });
});

router.post("/new", async (req, res) => {
  const userId = res.locals.userId;
  const username = res.locals.username;
  const displayname = res.locals.displayname;
  console.log(userId, username);
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

//GET för edit
router.get("/post/single/:id/edit", followthem, sortPosts,  async (req, res) => {
  const id = req.params.id;
    
  const post = await PostsModel.findById(req.params.id)
    .populate("comments")
    .lean();

  let followthem = req.followthem;

  const authorId = post.author_id;
  const authorUsername = post.author_name;
  const currentUserId = res.locals.userId;
  const currentUsername = res.locals.username;
  const currentUsersPosts = await PostsModel.find({ author_id: userId });

  if (!currentUserId == authorId) {
    res.send("You don't have edit access");
    res.redirect("/")

  } else if (currentUserId == authorId) {
    res.redirect("/single/:id/edit");
    }

  // console.log("The author of this post is: " + authorUsername + " - ", authorId);
  // console.log("Current user logged in is: " + currentUsername, currentUserId);

  res.render("edit-post", { post, followthem, id });
});

//POST för edit
router.post("/single/:id/edit", async (req, res) => {
  const id = req.params.id;
    
    const post = PostsModel.findByIdAndUpdate(req.params.id);
    post.content = req.body.content;

    if (!content || !content.trim()) {
        res.send("This can't be empty");
    }
    await post.save();

  res.render("edit-post", { post, id });
});

//GET för delete
router.get("/single/:id/delete", followthem, sortPosts,  async (req, res) => {
  
  const id = req.params.id;
    
  const post = await PostsModel.findById(req.params.id)
    .populate("comments")
    .lean();

  let followthem = req.followthem;

  res.render("delete-post", { post, followthem });
});

//POST för delete
router.post("/single/:id/delete", async (req, res) => {

  const post = PostsModel.findByIdAndDelete(req.params.id);
  await post.save();

  res.render("delete-post", { post });
});

module.exports = router;
