import { useRouter } from "next/router";
import React from "react";
import { Divider, Feed } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function CommentNotification({ notification }) {
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  return (
    <>
      <Feed.Event>
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/qa/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              commented on your{" "}
              {pathString === "/qa" ? (
                <a href={`/qa/post/${notification.question._id}`}>question.</a>
              ) : (
                <a href={`/studentshub/post/${notification.post._id}`}>post.</a>
              )}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>

          {pathString === "/qa"
            ? notification.question.picUrl && (
                <Feed.Extra images>
                  <a href={`qa/post/${notification.question._id}`}>
                    <img src={notification.question.picUrl} />
                  </a>
                </Feed.Extra>
              )
            : notification.post.picUrl && (
                <Feed.Extra images>
                  <a href={`studentshub/post/${notification.post._id}`}>
                    <img src={notification.post.picUrl} />
                  </a>
                </Feed.Extra>
              )}

          <Feed.Extra text>
            <strong>{notification.text}</strong>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
}

export default CommentNotification;
