const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const QANotificationModel = require("../../models/qa/QANotificationModel");
const UserModel = require("../../models/UserModel");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const user = await QANotificationModel.findOne({ user: userId })
      .populate("qanotifications.user")
      .populate("qanotifications.question");
    // console.log("QA Notifications");
    // console.log(user);
    return res.json(user.qanotifications);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const user = await UserModel.findById(userId);

    if (user.unreadNotificationQA) {
      user.unreadNotificationQA = false;
      await user.save();
    }
    return res.status(200).send("Updated");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
