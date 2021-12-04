const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const QuestionModel = require("../models/qa/PostModel");
const FollowerModel = require("../models/FollowerModel");
const ProfileModel = require("../models/ProfileModel");
const bcrypt = require("bcryptjs");
const {
  newFollowerNotification,
  removeFollowerNotification,
} = require("../utilsServer/notificationActions");

// GET PROFILE INFO
router.get("/", authMiddleware, async (req, res) => {
  try {
    const students = await UserModel.find({ university: { $ne: null } });
    const uniqKey = await UserModel.collection.distinct("university");

    universityList = {};
    // console.log("uniqKey[0]-->", uniqKey.length);

    uniqKey.map((university) => {
      universityList[university] = new Array();
    });

    students.map((student) => {
      universityList[student.university].push(student);
    });
    // Object.keys(univarsityList).map(function (key) {
    //   {
    //     univarsityList[key].map((item) => {
    //       console.log("item-->", item.name);
    //     });
    //   }
    // });

    return res.json(universityList);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
