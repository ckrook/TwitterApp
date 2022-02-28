const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    author_id: { type: mongoose.ObjectId, required: true },
    content: { type: String, required: true },
    created: { type: Number, default: Date.now },
    like_count: { type: Number, required: true },
    retweet_count: { type: Number, required: true },
    comments: [{
        type: String
    }]
});

const PostsModel = mongoose.model("Posts", postsSchema);

module.exports = PostsModel;