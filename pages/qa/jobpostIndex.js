import axios from "axios";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Segment } from "semantic-ui-react";
import { NoPosts } from "../../components/Layout/NoData";
import {
  EndMessage,
  PlaceHolderPosts,
} from "../../components/Layout/PlaceHolderGroup";
import { PostDeleteToastr } from "../../components/Layout/Toastr";
import CardPost from "../../components/Post/CardPost";
import CreatePost from "../../components/Post/CreatePost";
import CreatePostQA from "../../components/Post/CreatePostQA";
import baseUrl from "../../utils/baseUrl";
import io from "socket.io-client";
import MessageNotificationModal from "../../components/Home/MessageNotificationModal";
import getUserInfo from "../../utils/getUserInfo";
import newMsgSound from "../../utils/newMsgSound";
import NotificationPortal from "../../components/Home/NotificationPortal";
import CommentNotificationPortal from "../../components/Home/CommentNotificationPortal";

function jobpost({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const path = router.pathname;
  const pathString = path.slice(0, 3);

  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopup, showNotificationPopup] = useState(false);

  const [newCommentNotification, setNewCommentNotification] = useState(null);
  const [commeNtnotificationPopup, showCommentNotificationPopup] =
    useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
          newMsgSound(name);
        }
      });
    }

    document.title = `Welcome, ${user.name.split(" ")[0]}`;

    return () => {
      if (socket.current) {
        socket.current.emit("disconnect");
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/qa/posts`, {
        headers: { Authorization: cookie.get("token") },

        params: { pageNumber, toggle: "JobPost" },
      });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
      // console.log("Inside--->fetchDataOnScroll");
    } catch (error) {
      alert("Error fetching Posts");
    }
  };
  if (pathString === "/qa") {
    if (posts.length === 0 || errorLoading)
      return (
        <>
          <CreatePostQA user={user} setPosts={setPosts} />
          <NoPosts />
        </>
      );
  } else {
    if (posts.length === 0 || errorLoading)
      return (
        <>
          <CreatePost user={user} setPosts={setPosts} />
          <NoPosts />
        </>
      );
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on(
        "newNotificationReceivedQA",
        ({ name, profilePicUrl, username, postId }) => {
          setNewNotification({ name, profilePicUrl, username, postId });

          showNotificationPopup(true);
        }
      );

      socket.current.on(
        "newCommentNotificationReceivedQA",
        ({ name, profilePicUrl, username, postId }) => {
          setNewCommentNotification({ name, profilePicUrl, username, postId });

          showCommentNotificationPopup(true);
        }
      );
    }
  }, []);

  return (
    <>
      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}
      {notificationPopup && newNotification !== null && (
        <NotificationPortal
          newNotification={newNotification}
          notificationPopup={notificationPopup}
          showNotificationPopup={showNotificationPopup}
        />
      )}

      {commeNtnotificationPopup && newCommentNotification !== null && (
        <CommentNotificationPortal
          newNotification={newCommentNotification}
          notificationPopup={commeNtnotificationPopup}
          showNotificationPopup={showCommentNotificationPopup}
        />
      )}

      {pathString === "/qa" ? (
        <>
          {showToastr && <PostDeleteToastr />}
          <Segment>
            <CreatePostQA user={user} setPosts={setPosts} />

            <InfiniteScroll
              hasMore={hasMore}
              next={fetchDataOnScroll}
              loader={<PlaceHolderPosts />}
              endMessage={<EndMessage />}
              dataLength={posts.length}
            >
              {posts.map((post) => (
                <CardPost
                  socket={socket}
                  key={post._id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                  setShowToastr={setShowToastr}
                />
              ))}
            </InfiniteScroll>
          </Segment>
        </>
      ) : (
        <>
          {showToastr && <PostDeleteToastr />}
          <Segment>
            <CreatePost user={user} setPosts={setPosts} />

            <InfiniteScroll
              hasMore={hasMore}
              next={fetchDataOnScroll}
              loader={<PlaceHolderPosts />}
              endMessage={<EndMessage />}
              dataLength={posts.length}
            >
              {posts.map((post) => (
                <CardPost
                  socket={socket}
                  key={post._id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                  setShowToastr={setShowToastr}
                />
              ))}
            </InfiniteScroll>
          </Segment>
        </>
      )}
    </>
  );
}

jobpost.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/qa/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1, toggle: "JobPost" },
    });
    // console.log(res.data);
    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default jobpost;
