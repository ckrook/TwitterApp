const express = require('express');
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");
const UsersModel = require('../models/UsersModel.js');

router.get("/", (req, res) => {
  res.render("start");
});

router.get("/single", (req, res) => {
  res.redirect("single-post");
});

router.post("/new", async (req, res) => {
  const userId = res.locals.userId;
  const username = res.locals.username;
  const { content } = req.body;

  if(!content || !content.trim()){
    res.render("home", {
      error: "This can't be empty big man"
    })
  }
  else{
    const newPost = new PostsModel({
      author_id: userId,
      author_name: username,
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

router.post("/:id/liked", async (req, res) => {
  // const clickedPost = await PostsModel.findById(req.params.id).lean(); 
  // const user = await UsersModel.findById(res.locals.userId).lean();
  // const postId = req.params.id;
  
  // +-
  // const updatedCount = clickedPost.like_count++;

  // PostsModel.updateOne({ _id: postId }, { like_count: updatedCount});

  // console.log(clickedPost.like_count);

  // res.redirect("/");
});

router.post("/:id/reweet", async (req, res) => {
  const post = await PostsModel.findById(req.params.id).lean(); 

  console.log(post);

  res.redirect("/");
});

module.exports = router;