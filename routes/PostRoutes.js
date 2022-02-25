const express = require('express');
const router = express.Router();

router.get("/posts", (req, res) => {
    res.render("start");
  });

router.get("/single-post", (req, res) => {
    res.redirect("single-post");
  });

router.post("/new-post", (req, res) => {
    res.redirect("new-post");
  });

router.put("/edit-post", (req, res) => {
    res.redirect("edit-post");
  });

router.delete("/delete-post", (req, res) => {
    res.redirect("delete-post");
  });

module.exports = router;