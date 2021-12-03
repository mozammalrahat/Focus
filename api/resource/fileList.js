const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const FileModel = require("../../models/resource/fileModel");
// const uuid = require("uuid").v4;

// CREATE A File

router.post("/", authMiddleware, async (req, res) => {
  const { fileName, fileType, fileUrl } = req.body;

  if (fileName.length < 1)
    return res.status(401).send("File name must be greater than 0");

  try {
    const newFile = {
      user: req.userId,
      fileName,
      fileUrl,
      fileType,
    };
    const file = await new FileModel(newFile).save();

    const FileCreated = await FileModel.findById(file._id).populate("user");

    return res.json(FileCreated);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// GET ALL Files

router.get("/", authMiddleware, async (req, res) => {
  try {
    let files;

    files = await FileModel.find().sort({ createdAt: -1 }).populate("user");

    if (files.length === 0) {
      return res.json([]);
    }

    let FilesToBeSent = [...files];
    const { userId } = req;
    FilesToBeSent.length > 0 &&
      FilesToBeSent.sort((a, b) => [
        new Date(b.createdAt) - new Date(a.createdAt),
      ]);

    return res.json(FilesToBeSent);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
