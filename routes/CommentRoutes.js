const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("start");
  });

router.get("/single", (req, res) => {
    res.redirect("single-comment");
  });

router.post("/new", (req, res) => {
    res.redirect("new-comment");
  });

router.put("/edit", (req, res) => {
    res.redirect("edit-comment");
  });

router.delete("/delete", (req, res) => {
    res.redirect("delete-comment");
  });

module.exports = router;