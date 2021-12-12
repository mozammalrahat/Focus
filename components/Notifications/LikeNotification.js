import { useRouter } from "next/router";
import React from "react";
import { Divider, Feed } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
function LikeNotification({ notification }) {
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  // console.log("notification-->", notification);
  return (
    <>
      <Feed.Event>
        <Feed.Label image={notification.user.profilePicUrl || null} />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              liked your{" "}
              {pathString === "/qa" ? (
                <a href={`/qa/post/${notification.question._id}`}>question.</a>
              ) : (
                <a href={`/post/${notification.post._id}`}>post.</a>
              )}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>

          {pathString === "/qa"
            ? notification.question.picUrl && (
                <Feed.Extra images>
                  <a href={`/qa/post/${notification.question._id}`}>
                    <img src={notification.question.picUrl} />
                  </a>
                </Feed.Extra>
              )
            : notification.post.picUrl && (
                <Feed.Extra images>
                  <a href={`/post/${notification.post._id}`}>
                    <img src={notification.post.picUrl} />
                  </a>
                </Feed.Extra>
              )}
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
}

export default LikeNotification;
