const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  googleId: { type: String },
  username: { type: String, required: true },
  displayname: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String },
  dateOfBirth: { type: String },
  created: { type: Number, default: Date.now },
  phonenumber: { type: Number },
  role: { type: String, default: "User" },
  bio: { type: String, default: "" },
  website: { type: String },
  profilePicture: String,
  coverimage: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Posts"
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
