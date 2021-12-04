const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    fileName: { type: String, required: true },

    fileUrl: { type: String, required: true },

    fileType: { type: String, required: true },

    fileTopic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FileModel", FileSchema);
