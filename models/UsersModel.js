const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  displayname: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String },
  dateOfBirth: { type: Number },
  created: { type: Number, default: Date.now },
  role: { type: String, default: "User" },
  bio: { type: String, default: "" },
  website: { type: String },
  profilePicture: String,
  posts: [
    {
      type: String,
      default: [],
    },
  ],
  follows: [
    {
      type: String,
      default: [],
    },
  ],
  follows_count: { type: Number },
  followers: [
    {
      type: String,
      default: [],
    },
  ],
  follower_count: { type: Number },
  likedPosts: [
    {
      type: String,
      default: [],
    },
  ],
});

const UsersModel = mongoose.model("Users", usersSchema);

module.exports = UsersModel;
