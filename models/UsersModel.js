const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String },
  description: { type: String, default: "" },
  dateOfBirth: { type: Number },
  created: { type: Number, default: Date.now },
  role: { type: String, default: "User" },
  bio: String,
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
  likedPosts: [
    {
      type: String,
      default: [],
    },
  ],
});

const UsersModel = mongoose.model("Users", usersSchema);

module.exports = UsersModel;
