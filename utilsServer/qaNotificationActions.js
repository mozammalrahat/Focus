const UserModel = require("../models/UserModel");
const QANotificationModel = require("../models/qa/QANotificationModel");

const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user.unreadNotificationQA) {
      user.unreadNotificationQA = true;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

const newLikeNotification = async (userId, questionId, userToNotifyId) => {
  try {
    const userToNotify = await QANotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: "newVote",
      user: userId,
      question: questionId,
      date: Date.now(),
    };

    await userToNotify.qanotifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeLikeNotification = async (userId, questionId, userToNotifyId) => {
  try {
    const user = await QANotificationModel.findOne({ user: userToNotifyId });

    const notificationToRemove = await user.qanotifications.find(
      (notification) =>
        notification.type === "newVote" &&
        notification.user.toString() === userId &&
        notification.questionanswer.toString() === questionId
    );

    const indexOf = user.qanotifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.qanotifications.splice(indexOf, 1);
    await user.save();

    return;
  } catch (error) {
    console.error(error);
  }
};

const newCommentNotification = async (
  postId,
  answerId,
  userId,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await QANotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: "newAnswer",
      user: userId,
      question: postId,
      answerId,
      text,
      date: Date.now(),
    };

    await userToNotify.qanotifications.unshift(newNotification);

    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeCommentNotification = async (
  questionId,
  answerId,
  userId,
  userToNotifyId
) => {
  try {
    const user = await QANotificationModel.findOne({ user: userToNotifyId });

    const notificationToRemove = await user.qanotifications.find(
      (notification) =>
        notification.type === "newAnswer" &&
        notification.user.toString() === userId &&
        notification.questionanswer.toString() === questionId &&
        notification.answerId === answerId
    );

    const indexOf = await user.qanotifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.qanotifications.splice(indexOf, 1);
    await user.save();
  } catch (error) {
    console.error(error);
  }
};

const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);

    await user.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === "newFollower" &&
        notification.user.toString() === userId
    );

    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);

    await user.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newFollowerNotification,
  removeFollowerNotification,
};
