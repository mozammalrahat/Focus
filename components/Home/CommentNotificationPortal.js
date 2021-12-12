import { Segment, TransitionablePortal, Icon, Feed } from "semantic-ui-react";
import newMsgSound from "../../utils/newMsgSound";
import { useRouter } from "next/router";
import calculateTime from "../../utils/calculateTime";

function CommentNotificationPortal({
  newNotification,
  notificationPopup,
  showNotificationPopup,
}) {
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  console.log("Inside Profile page --> pathString", pathString);

  const { name, profilePicUrl, username, postId } = newNotification;

  return (
    <TransitionablePortal
      transition={{ animation: "fade left", duration: "500" }}
      onClose={() => notificationPopup && showNotificationPopup(false)}
      onOpen={newMsgSound}
      open={notificationPopup}
    >
      <Segment
        style={{ right: "5%", position: "fixed", top: "10%", zIndex: 1000 }}
      >
        <Icon
          name="close"
          size="large"
          style={{ float: "right", cursor: "pointer" }}
          onClick={() => showNotificationPopup(false)}
        />

        <Feed>
          <Feed.Event>
            <Feed.Label>
              <img src={profilePicUrl} />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User
                  onClick={() => router.push(`${pathString}/${username}`)}
                >
                  {name}{" "}
                </Feed.User>{" "}
                commented on your{" "}
                {pathString === "/st" ? (
                  <>
                    <a
                      onClick={() => router.push(`/studentshub/post/${postId}`)}
                    >
                      {" "}
                      post
                    </a>
                  </>
                ) : (
                  <>
                    <a onClick={() => router.push(`/qa/post/${postId}`)}>
                      {" "}
                      post
                    </a>
                  </>
                )}
                <Feed.Date>{calculateTime(Date.now())}</Feed.Date>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Segment>
    </TransitionablePortal>
  );
}

export default CommentNotificationPortal;
