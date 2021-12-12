import axios from "axios";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import { Container, Divider, Feed, Segment } from "semantic-ui-react";
import io from "socket.io-client";
import MessageNotificationModal from "../../components/Home/MessageNotificationModal";
import { NoNotifications } from "../../components/Layout/NoData";
import CommentNotification from "../../components/Notifications/CommentNotification";
import FollowerNotification from "../../components/Notifications/FollowerNotification";
import LikeNotification from "../../components/Notifications/LikeNotification";
import baseUrl from "../../utils/baseUrl";
import getUserInfo from "../../utils/getUserInfo";
import newMsgSound from "../../utils/newMsgSound";

function Notifications({ notifications, errorLoading, user, userFollowStats }) {
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  useEffect(() => {
    const notificationRead = async () => {
      try {
        await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          { headers: { Authorization: cookie.get("token") } }
        );
      } catch (error) {
        console.log(error);
      }
    };

    notificationRead();
  }, []);

  // console.log(notifications);

  const socket = useRef();

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

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

    return () => {
      if (socket.current) {
        socket.current.emit("disconnect");
        socket.current.off();
      }
    };
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

      <Container style={{ marginTop: "1.5rem" }}>
        {notifications.length > 0 ? (
          <Segment color="teal" raised>
            <div
              style={{
                maxHeight: "40rem",
                overflow: "auto",
                height: "40rem",
                position: "relative",
                width: "100%",
              }}
            >
              <Feed size="small">
                {notifications.map((notification) => (
                  <>
                    {notification.type === "newLike" &&
                      notification.post !== null && (
                        <LikeNotification
                          key={notification._id}
                          notification={notification}
                        />
                      )}

                    {notification.type === "newComment" &&
                      notification.post !== null && (
                        <CommentNotification
                          key={notification._id}
                          notification={notification}
                        />
                      )}

                    {notification.type === "newFollower" && (
                      <FollowerNotification
                        key={notification._id}
                        notification={notification}
                        loggedUserFollowStats={loggedUserFollowStats}
                        setUserFollowStats={setUserFollowStats}
                      />
                    )}
                  </>
                ))}
              </Feed>
            </div>
          </Segment>
        ) : (
          <NoNotifications />
        )}
        <Divider hidden />
      </Container>
    </>
  );
}

Notifications.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: { Authorization: token },
    });

    return { notifications: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Notifications;
