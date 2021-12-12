import axios from "axios";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Segment } from "semantic-ui-react";
import io from "socket.io-client";
import CommentNotificationPortal from "../../components/Home/CommentNotificationPortal";
import MessageNotificationModal from "../../components/Home/MessageNotificationModal";
import NotificationPortal from "../../components/Home/NotificationPortal";
import { NoPosts } from "../../components/Layout/NoData";
import {
  EndMessage,
  PlaceHolderPosts,
} from "../../components/Layout/PlaceHolderGroup";
import { PostDeleteToastr } from "../../components/Layout/Toastr";
import CardPost from "../../components/Post/CardPost";
import CreatePost from "../../components/Post/CreatePost";
import baseUrl from "../../utils/baseUrl";
import getUserInfo from "../../utils/getUserInfo";
import newMsgSound from "../../utils/newMsgSound";

function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get("token") },
        params: { pageNumber },
      });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      alert("Error fetching Posts");
    }
  };

  if (posts.length === 0 || errorLoading)
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
        <NoPosts />
        <CreatePost
          placeholder="Ask a Question?"
          user={user}
          setPosts={setPosts}
        />
      </>
    );

  useEffect(() => {
    if (socket.current) {
      socket.current.on(
        "newNotificationReceived",
        ({ name, profilePicUrl, username, postId }) => {
          setNewNotification({ name, profilePicUrl, username, postId });

          showNotificationPopup(true);
        }
      );
      socket.current.on(
        "newCommentNotificationReceived",
        ({ name, profilePicUrl, username, postId }) => {
          setNewCommentNotification({ name, profilePicUrl, username, postId });

          showCommentNotificationPopup(true);
        }
      );
    }
  }, []);
  return (
    <>
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

      {showToastr && <PostDeleteToastr />}

      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      <Segment>
        <CreatePost
          placeholder="Ask a Question?"
          user={user}
          setPosts={setPosts}
        />

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
  );
}

Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    // console.log(token);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Index;
