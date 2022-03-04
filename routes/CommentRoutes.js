const express = require('express');
const router = express.Router();

const CommentsModel = require("../models/CommentsModel.js");
const PostsModel = require("../models/PostsModel.js");

router.get("/", (req, res) => {
    res.render("start");
});

router.get("/single", (req, res) => {
    res.redirect("single-comment");
});

router.post("/new", async (req, res) => {

  res.redirect("new-comment");
});

router.put("/edit", (req, res) => {
    res.redirect("edit-comment");
});

router.delete("/delete", (req, res) => {
    res.redirect("delete-comment");
});

module.exports = router;