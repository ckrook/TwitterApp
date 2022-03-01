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
    "Boom admins are created! Gå bara hit en gång dock annars blir de nog knas. Kolla i mongodb compass så användarna finns där"
  );
});

module.exports = router;

// const usersSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   hashedPassword: { type: String, required: true },
//   email: { type: String, required: true },
//   city: { type: String },
//   description: { type: String, default: "" },
//   dateOfBirth: { type: Number },
//   created: { type: Number, default: Date.now },
//   role: { type: String, default: "User" },
//   bio: String,
//   profilePicture: String,
//   posts: [
//     {
//       type: String,
//       default: [],
//     },
//   ],
//   follows: [
//     {
//       type: String,
//       default: [],
//     },
//   ],
//   follows_count: { type: Number },
//   followers: [
//     {
//       type: String,
//       default: [],
//     },
//   ],
//   follower_count: { type: Number },
//   likedPosts: [
//     {
//       type: String,
//       default: [],
//     },
//   ],
// });
