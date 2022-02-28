const express = require('express');
const router = express.Router();

const PostsModel = require("../models/PostsModel.js");
const utils = require("../utils.js");

router.get("/", (req, res) => {
    res.render("start");
  });

router.get("/single", (req, res) => {
    res.redirect("single-post");
  });

router.post("/new", (req, res) => {
    res.redirect("new-post");
  });

router.put("/edit", (req, res) => {
    res.redirect("edit-post");
  });

router.delete("/delete", (req, res) => {
    res.redirect("delete-post");
  });

module.exports = router;