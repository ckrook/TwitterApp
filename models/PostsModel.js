const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    author_id: { type: mongoose.ObjectId, required: true },
    author_name: { type: String, required: true},
    content: { type: String, required: true },
    created: { type: Number, default: Date.now },
    like_count: { type: Number, default: 0 },
    retweet_count: { type: Number, default: 0 },
    comments: [{
        type: String
    }]
});

const PostsModel = mongoose.model("Posts", postsSchema);

module.exports = PostsModel;