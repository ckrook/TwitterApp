const express = require('express');
const router = express.Router();

//LOG IN
router.get("/log-in", (req, res) => {
    res.render("signup");
  });
  
router.post("/log-in", (req, res) => {
    res.redirect("start");
  });

//LOG OUT
  router.post("/log-out", (req, res) => {
    res.redirect("home");
  });

//SIGN UP
router.get("/sign-up", (req, res) => {
    res.render("signup");
  });
  
router.post("/sign-up", (req, res) => {
    res.render("signup");
  });
  
router.get("/sign-up-extra", (req, res) => {
    res.render("signup-step-2");
  });

//USER PROFILE
router.get("/user-profile", (req, res) => {
    res.render("user-profile");
  });

 router.put("/edit-profile", (req, res) => {
    res.render("edit-profile");
});
    
router.delete("/delete-profile", (req, res) => {
    res.render("delete-profile");
});

module.exports = router;