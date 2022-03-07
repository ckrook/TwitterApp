const UsersModel = require("./models/UsersModel");
const PostsModel = require("./models/PostsModel.js");
const utils = require("./utils.js");

const forceAuthorize = (req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const sortPosts = async (req, res, next) => {
  let posts = await PostsModel.find()
    .sort([["created", "desc"]])
    .lean();
  for (let post of posts) {
    post.created = utils.timeAgo(post.created);
  }
  req.sortPosts = posts;
  next();
};

const followthem = async (req, res, next) => {
  let toFollow = "";
  if (res.locals.userId) {
    let userId = res.locals.userId;
    toFollow = await UsersModel.find().lean();
    let mainUser = await UsersModel.findOne({ _id: userId });

    const findFollowers = await UsersModel.find({
      _id: { $in: mainUser.follows },
    });
    toFollow = toFollow.filter((user) => {
      return user.username !== res.locals.username;
    });
    for (var i = 0; i < toFollow.length; i++) {
      for (var j = 0; j < findFollowers.length; j++) {
        if (JSON.stringify(toFollow[i]) == JSON.stringify(findFollowers[j])) {
          toFollow.splice(i, 1);
        }
      }
    }
    req.followthem = toFollow;
  }
  toFollow = toFollow.slice(0, 5);

  req.followthem = toFollow;
  next();
};

module.exports = { forceAuthorize, followthem, sortPosts };
