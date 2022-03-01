const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: false},
  dateOfBirth: { type: Number, required: false },
  created: { type: Number, default: Date.now },
  role: { type: String, default: "User" },
  bio: { type: String, required: false },
  profilePicture: String,
  posts: [],
  likedPosts: []
});

const Usersmodel = mongoose.model("Users", usersSchema);

module.exports = Usersmodel;
