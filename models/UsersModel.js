const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  date_of_birth: { type: Number, required: true },
  created: { type: Number, default: Date.now },
  role: { type: String, default: "User" },
  bio: String,
  profilePicture: String,
  posts: [
    {
      type: String,
    },
  ],
  liked_posts: [
    {
      type: String,
    },
  ],
});

const UsersModel = mongoose.model("Users", usersSchema);

module.exports = UsersModel;
