const express = require("express");
const router = express.Router();

const UsersModel = require("../models/UsersModel.js");
const utils = require("../utils.js");

router.get("/", async (req, res) => {
  const password = "admin";

  const adminUserCharles = new UsersModel({
    username: "charles",
    hashedPassword: utils.hashedPassword(password),
    email: "charles.krook@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    bio: "Frontend developer based in Stockholm",
  });
  
  const adminUserAlexia = new UsersModel({
    username: "alexia",
    hashedPassword: utils.hashedPassword(password),
    email: "alexia.hellsten@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    bio: "Frontend developer & Designer based in Stockholm",
  });

  const adminUserSimon = new UsersModel({
    username: "simon",
    hashedPassword: utils.hashedPassword(password),
    email: "simon.sandahl@gmail.com",
    city: "Stockholm",
    dateOfBirth: 19900101,
    bio: "Fullstack developer based in Stockholm",
  });

  await adminUserCharles.save();
  await adminUserAlexia.save();
  await adminUserSimon.save();

  res.send(
    "Admins created!"
  );
});

module.exports = router;