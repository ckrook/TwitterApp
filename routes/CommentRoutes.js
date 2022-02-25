const express = require('express');
const router = express.Router();

router.get("/comments", (req, res) => {
    res.render("start");
  });

router.get("/single-comment", (req, res) => {
    res.redirect("single-comment");
  });

router.post("/new-comment", (req, res) => {
    res.redirect("new-comment");
  });

router.put("/edit-comment", (req, res) => {
    res.redirect("edit-comment");
  });

router.delete("/delete-comment", (req, res) => {
    res.redirect("delete-comment");
  });

module.exports = router;