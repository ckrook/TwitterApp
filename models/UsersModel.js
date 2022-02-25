const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true},
  dateOfBirth: { type: Number, required: true },
  created: { type: Number, default: Date.now },
  role: { type: String, default: "User" },
  bio: String,
  profilePicture: String,
  posts: [],
  likedPosts: []
});

const Usersmodel = mongoose.model("Users", usersSchema);

module.exports = Usersmodel;
