const express = require("express");
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");

const { forceAuthorize, followthem, sortPosts } = require("../middleware.js");
const UsersModel = require("../models/UsersModel.js");
const { timeAgo } = require("../utils.js");

router.get("/", (req, res) => {
  res.render("start");
});


router.get("/single/edit/:id", async (req, res) => {
  const followthem = req.followthem;
  const userId = res.locals.userId;
  const id = req.params.id;
  const postId = req.params.id;
  const currentUser = await UsersModel.findOne({ _id: userId }).populate("posts").lean();
  const post = await PostsModel.findById(id).populate("comments").lean();
  const authorId = post.authorId;

  res.render("edit-post-home", {
    followthem,
    userId,
    id,
    postId,
    currentUser,
    post,
    authorId
  });
});


router.get("/single/:id", followthem, sortPosts, async (req, res) => {
  const followthem = req.followthem;
  const userId = res.locals.userId;
  const id = req.params.id;
  const postId = req.params.id;
  const currentUser = await UsersModel.findOne({ _id: userId }).populate("posts").lean();
  const posts = await PostsModel.find({ author_id: id }).lean();
  const post = await PostsModel.findById(id).populate("comments").lean();
  const authorId = post.author_id;

  for (let post of posts) {
    post.created = timeAgo(post.created);
  }
  if (currentUser === authorId) {
    editable = true;
  }

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

  res.render("post-single-home", { post, followthem, postId });
});

router.get("/edit/:id", async (req, res) => {
  const postId = req.params.id;

  const post = await PostsModel.findOne({ _id: postId }).lean();

  let followthem = req.followthem;

  const authorId = post.author_id;
  const currentUser = res.locals.userId;
  const currentUsersPosts = await PostsModel.find({ author_id: userId });

  if (!currentUser == authorId) {
    res.render("not-found");
    
  } else if (currentUser == authorId) {
    post.editable = true;
    res.redirect("/post/single/edit/" + postId);
  }

  res.render("edit-post-home", {
    post,
    postId,
    authorId,
    currentUser,
    currentUsersPosts,
    followthem,
  });
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

//POST för edit
router.post("/edit/:id", async (req, res) => {
  
  const postId = req.params.id;
  const post = await PostsModel.findById(req.params.id);
  post.content = req.body.content;

  if (!post.content) {
    res.send("Can't leave this empty");
  }
  
  await post.save();

  res.redirect("post/single/" + postId);
});

// router.get("/delete/:id", async (req, res) => {
//   const postId = req.params.id;
//   const currentUser = res.locals.userId;

//   const post = await PostsModel.findOne({ _id: postId }).lean();

//   res.render("delete-post", { post, postId, authorId, currentUser });
// });

router.post("/delete/:id", async (req, res) => {

  const postId = req.params.id;
  const userId = res.locals.userId;
  const post = await PostsModel.findById(postId);

  await PostsModel.findByIdAndDelete(req.params.id);

  res.redirect("/user/" + userId);
});

module.exports = router;