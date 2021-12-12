const UserModel = require("../models/UserModel");
const PostModel = require("../models/qa/PostModel");
const uuid = require("uuid").v4;
const {
  newLikeNotification,
  removeLikeNotification,
} = require("../utilsServer/notificationActions");

const commentPostQA = async (postId, userId, text) => {
  if (text.length < 1) return { error: "Answer should be atleast 1 character" };

  const post = await PostModel.findById(postId);

  if (!post) return { error: "No post found" };

  const user = await UserModel.findById(userId);

  const { name, profilePicUrl, username } = user;

  return {
    success: true,
    name,
    profilePicUrl,
    username,
    postByUserId: post.user.toString(),
  };
};

module.exports = { commentPostQA };
