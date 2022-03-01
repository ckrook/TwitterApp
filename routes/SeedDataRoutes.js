const express = require('express');
const router = express.Router();

const UsersModel = require("../models/UsersModel.js");
const utils = require("../utils.js");

router.get("/", async (req, res) => {
    const password = "admin";
      
    const adminUserCharles = new UsersModel({
      username: "CharlesKrook",
      hashed_password: utils.hashedPassword(password),
      email: "Charles.Krook@gmail.com",
      city: "Stockholm",
      date_of_birth: 19900101,
      role: "Admin",
    });
    const adminUserAlexia = new UsersModel({
      username: "AlexiaHellsten",
      hashed_password: utils.hashedPassword(password),
      email: "Alexia.Hellsten@gmail.com",
      city: "Stockholm",
      date_of_birth: 19900101,
      role: "Admin",
    });
    const adminUserSimon = new UsersModel({
      username: "SimonSandahl",
      hashed_password: utils.hashedPassword(password),
      email: "Simon.Sandahl@gmail.com",
      city: "Stockholm",
      date_of_birth: 19900101,
      role: "Admin",
    });
      
    await adminUserCharles.save();
    await adminUserAlexia.save();
    await adminUserSimon.save();
      
    res.send(
      "Boom admins are created! Gå bara hit en gång dock annars blir de nog knas. Kolla i mongodb compass så användarna finns där"
    );
});

module.exports = router;