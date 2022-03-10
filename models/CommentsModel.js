const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  created: { type: Number, default: Date.now },
  author_id: { type: mongoose.ObjectId, required: true },
  author_name: { type: String, required: true },
  profilePicture: { type: String },
  author_displayname: { type: String, required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  like_count: Number,
  editable: { type: Boolean, default: false },
});

const CommentsModel = mongoose.model("Comments", commentSchema);

module.exports = CommentsModel;
