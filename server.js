const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const {
  addUser,
  removeUser,
  findConnectedUser,
} = require("./utilsServer/roomActions");
const {
  loadMessages,
  sendMsg,
  setMsgToUnread,
  deleteMsg,
  checkUserPopUp,
} = require("./utilsServer/messageActions");

const { likeOrUnlikePost } = require("./utilsServer/likeOrUnlikePost");
const { likeOrUnlikePostQA } = require("./utilsServer/likeOrUnlikePostQA");
const { commentPost } = require("./utilsServer/commentPost");
const { commentPostQA } = require("./utilsServer/commentPostQA");

io.on("connection", (socket) => {
  socket.on("join", async ({ userId }) => {
    const users = await addUser(userId, socket.id);
    // console.log(users);

    setInterval(() => {
      socket.emit("connectedUsers", {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on("likePost", async ({ postId, userId, like }) => {
    const { success, name, profilePicUrl, username, postByUserId, error } =
      await likeOrUnlikePost(postId, userId, like);

    if (success) {
      socket.emit("postLiked");

      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);

        if (receiverSocket && like) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT
          io.to(receiverSocket.socketId).emit("newNotificationReceived", {
            name,
            profilePicUrl,
            username,
            postId,
          });
        }
      }
    }
  });

  socket.on("likePostQA", async ({ postId, userId, like }) => {
    const { success, name, profilePicUrl, username, postByUserId, error } =
      await likeOrUnlikePostQA(postId, userId, like);

    if (success) {
      socket.emit("postLikedQA");

      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);

        if (receiverSocket && like) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT
          io.to(receiverSocket.socketId).emit("newNotificationReceivedQA", {
            name,
            profilePicUrl,
            username,
            postId,
          });
        }
      }
    }
  });

  socket.on("commentPost", async ({ postId, userId, text }) => {
    // console.log("commentPost");
    const { success, name, profilePicUrl, username, postByUserId, error } =
      await commentPost(postId, userId, text);

    if (success) {
      socket.emit("postCommented");

      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);
        // console.log("OutsidereceiverSocket", receiverSocket);
        if (receiverSocket && text) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT

          io.to(receiverSocket.socketId).emit(
            "newCommentNotificationReceived",
            {
              name,
              profilePicUrl,
              username,
              postId,
            }
          );
        }
      }
    }
  });

  socket.on("commentPostQA", async ({ postId, userId, text }) => {
    // console.log("commentPost");
    const { success, name, profilePicUrl, username, postByUserId, error } =
      await commentPostQA(postId, userId, text);

    if (success) {
      socket.emit("postCommentedQA");

      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);
        // console.log("OutsidereceiverSocket", receiverSocket);
        if (receiverSocket && text) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT
          io.to(receiverSocket.socketId).emit(
            "newCommentNotificationReceivedQA",
            {
              name,
              profilePicUrl,
              username,
              postId,
            }
          );
        }
      }
    }
  });

  socket.on("loadMessages", async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    !error
      ? socket.emit("messagesLoaded", { chat })
      : socket.emit("noChatFound");
  });

  socket.on("sendNewMsg", async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
    const receiverSocket = findConnectedUser(msgSendToUserId);

    if (receiverSocket) {
      // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
      io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
      await checkUserPopUp(msgSendToUserId);
    }
    //
    else {
      await setMsgToUnread(msgSendToUserId);
    }

    !error && socket.emit("msgSent", { newMsg });
  });

  socket.on("deleteMsg", async ({ userId, messagesWith, messageId }) => {
    const { success } = await deleteMsg(userId, messagesWith, messageId);

    if (success) socket.emit("msgDeleted");
  });

  socket.on(
    "sendMsgFromNotification",
    async ({ userId, msgSendToUserId, msg }) => {
      const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
      const receiverSocket = findConnectedUser(msgSendToUserId);

      if (receiverSocket) {
        // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
        io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
      }
      //
      else {
        await setMsgToUnread(msgSendToUserId);
      }

      !error && socket.emit("msgSentFromNotification");
    }
  );

  socket.on("disconnect", () => removeUser(socket.id));
});

nextApp.prepare().then(() => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/auth", require("./api/auth"));
  app.use("/api/reset", require("./api/reset"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/chats", require("./api/chats"));
  app.use("/api/notifications", require("./api/notifications"));

  app.use("/api/qa/posts", require("./api/qa/posts"));
  app.use("/api/qa/qanotifications", require("./api/qa/QAnotifications"));
  app.use("/api/qa/profile", require("./api/qa/userquestions"));
  app.use("/api/univarsity", require("./api/univarsity"));
  app.use("/api/resource/files", require("./api/resource/fileList"));
  app.all("*", (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Express server running");
  });
});
