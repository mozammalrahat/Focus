const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const UserModel = require("../../models/UserModel");
const PostModel = require("../../models/qa/PostModel");
const QuestionModel = require("../../models/qa/PostModel");
const FollowerModel = require("../../models/FollowerModel");
const ProfileModel = require("../../models/ProfileModel");
const bcrypt = require("bcryptjs");
const {
  newFollowerNotification,
  removeFollowerNotification,
} = require("../../utilsServer/notificationActions");

// GET QUESTIONS OF USER
router.get(`/posts/:username`, authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).send("No User Found");
    }

    const posts = await QuestionModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});
module.exports = router;
