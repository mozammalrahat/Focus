const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },

  qanotifications: [
    {
      type: {
        type: String,
        enum: ["newVote", "newAnswer", "newFollower"],
      },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      question: { type: Schema.Types.ObjectId, ref: "QuestionAnswer" },
      answerId: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("QANotification", NotificationSchema);
