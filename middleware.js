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
  let userId = res.locals.userIdname;

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
  let userId = res.locals.userId;
  let toFollow = await UsersModel.find().lean();
  let mainUser = await UsersModel.findOne({ userId });
  mainUser = mainUser.follows;
  const findFollowers = await UsersModel.find({ _id: { $in: mainUser } });
  toFollow = toFollow.filter((user) => {
    return user.username !== res.locals.userIdname;
  });
  for (var i = 0; i < toFollow.length; i++) {
    for (var j = 0; j < findFollowers.length; j++) {
      if (JSON.stringify(toFollow[i]) == JSON.stringify(findFollowers[j])) {
        toFollow.splice(i, 1);
      }
    }
  }
  toFollow = toFollow.slice(0, 5);

  req.followthem = toFollow;
  next();
};

module.exports = { forceAuthorize, followthem, sortPosts };
