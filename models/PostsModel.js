const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  author_id: { type: mongoose.ObjectId, required: true },
  author_name: { type: String, required: true },
  author_displayname: { type: String, required: true },
  content: { type: String, required: true },
  profilePicture: { type: String },
  created: { type: Number, default: Date.now },
  like_count: { type: Number, default: 0 },
  retweet_count: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
  comments_count: { type: Number, default: 0 },
  editable: { type: Boolean, default: false },
});

const PostsModel = mongoose.model("Posts", postsSchema);

module.exports = PostsModel;
