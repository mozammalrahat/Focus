import axios from "axios";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { Container, Divider, Feed, Segment } from "semantic-ui-react";
import { NoNotifications } from "../../components/Layout/NoData";
import CommentNotification from "../../components/Notifications/CommentNotification";
import LikeNotification from "../../components/Notifications/LikeNotification";
import baseUrl from "../../utils/baseUrl";

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

  return (
    <>
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
                    {notification.type === "newVote" &&
                      notification.post !== null && (
                        <LikeNotification
                          key={notification._id}
                          notification={notification}
                        />
                      )}

                    {notification.type === "newAnswer" &&
                      notification.post !== null && (
                        <CommentNotification
                          key={notification._id}
                          notification={notification}
                        />
                      )}

                    {/* {notification.type === "newFollower" && (
                      <FollowerNotification
                        key={notification._id}
                        notification={notification}
                        loggedUserFollowStats={loggedUserFollowStats}
                        setUserFollowStats={setUserFollowStats}
                      />
                    )} */}
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

    const res = await axios.get(`${baseUrl}/api/qa/qanotifications`, {
      headers: { Authorization: token },
    });
    console.log("Notification Lists");
    console.log(res.data);
    return { notifications: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Notifications;
