import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  Image,
  Modal,
  Popup,
  Segment,
} from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { deletePost, likePost } from "../../utils/postActions";
import {
  deletePost as deleteQuestion,
  likePost as likeQuestion,
} from "../../utils/qaActions";
import CommentInputField from "./CommentInputField";
import ImageModal from "./ImageModal";
import LikesList from "./LikesList";
import NoImageModal from "./NoImageModal";
import PostComments from "./PostComments";

function CardPost({ post, user, setPosts, setShowToastr, socket }) {
  const [likes, setLikes] = useState(post.likes);
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  // console.log("Inside Profile page --> pathString", pathString);
  console.log("CardPost --> pathString", pathString);
  // console.log("socket.current= ", socket);

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [comments, setComments] = useState(post.comments);

  // console.log("Inside CardPost --> comments", post.comments);

  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments,
  });
  // console.log("Inside CardPost --> post", pathString);

  return (
    <>
      {showModal && (
        <Modal
          open={showModal}
          closeIcon
          closeOnDimmerClick
          onClose={() => setShowModal(false)}
        >
          <Modal.Content>
            {post.picUrl ? (
              <ImageModal {...addPropsToModal()} />
            ) : (
              <NoImageModal {...addPropsToModal()} />
            )}
          </Modal.Content>
        </Modal>
      )}

      <Segment basic>
        <Card color="teal" fluid>
          <Card.Content>
            <Image
              className="propicIcon"
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
              style={{ width: "3em", height: "3em", marginTop: "-3px" }}
            />

            {(user.role === "root" || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: "pointer" }}
                      size="mini"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure?" />
                  <p>This action is irreversible!</p>

                  <Button
                    color="red"
                    icon="trash"
                    content="Delete"
                    onClick={() =>
                      pathString === "/st"
                        ? deletePost(post._id, setPosts, setShowToastr)
                        : deleteQuestion(post._id, setPosts, setShowToastr)
                    }
                  />
                </Popup>
              </>
            )}

            <Card.Header
              style={{
                fontSize: "20px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
                fontWeight: "600",
                color: "black",
              }}
            >
              {pathString === "/st" ? (
                <>
                  <Link href={`/studentshub/${post.user.username}`}>
                    <a>{post.user.name}</a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/qa/${post.user.username}`}>
                    <a>{post.user.name}</a>
                  </Link>
                </>
              )}
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.topic && (
              <Card.Meta
                className="topic"
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  letterSpacing: "0.1px",
                  color: "black",
                }}
                content={post.topic}
              />
            )}
            {/* {post.qa_toggle && <Card.Meta content={post.qa_toggle} />} */}

            <Card.Description
              style={{
                marginTop: "40px",
                fontSize: "20px",
                letterSpacing: "0.1px",
                // wordSpacing: "0.35px",
                fontWeight: "600",
                whiteSpace: "pre-wrap",
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{
                cursor: "pointer",
                width: "98%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content extra>
            <Icon
              name={
                pathString === "/qa"
                  ? isLiked
                    ? "hand paper"
                    : "hand paper outline"
                  : isLiked
                  ? "heart"
                  : "heart outline"
              }
              color="green"
              size="large"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (socket.current) {
                  if (pathString === "/qa") {
                    socket.current.emit("likePostQA", {
                      postId: post._id,
                      userId: user._id,
                      like: isLiked ? false : true,
                    });

                    socket.current.on("postLikedQA", () => {
                      if (isLiked) {
                        setLikes((prev) =>
                          prev.filter((like) => like.user !== user._id)
                        );
                      }
                      //
                      else {
                        setLikes((prev) => [...prev, { user: user._id }]);
                      }
                    });
                  } else {
                    socket.current.emit("likePost", {
                      postId: post._id,
                      userId: user._id,
                      like: isLiked ? false : true,
                    });

                    socket.current.on("postLiked", () => {
                      if (isLiked) {
                        setLikes((prev) =>
                          prev.filter((like) => like.user !== user._id)
                        );
                      }
                      //
                      else {
                        setLikes((prev) => [...prev, { user: user._id }]);
                      }
                    });
                  }
                } else {
                  pathString === "/st"
                    ? likePost(
                        post._id,
                        user._id,
                        setLikes,
                        isLiked ? false : true
                      )
                    : likeQuestion(
                        post._id,
                        user._id,
                        setLikes,
                        isLiked ? false : true
                      );
                }
              }}
            />

            <LikesList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length}
                    ${
                      pathString === "/qa" || pathString === "/re"
                        ? likes.length === 1
                          ? "vote"
                          : "votes"
                        : likes.length === 1
                        ? "like"
                        : "likes"
                    }`}
                  </span>
                )
              }
            />

            <Icon
              name="comment outline"
              style={{ marginLeft: "7px" }}
              color="blue"
              size="large"
            />

            {comments.length > 0 &&
              comments.map(
                (comment, i) =>
                  i < 3 && (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}

            {comments.length > 3 && (
              <Button
                content="View More"
                color="teal"
                basic
                circular
                onClick={() => setShowModal(true)}
              />
            )}

            <Divider hidden />

            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setComments}
              socket={socket}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </>
  );
}

export default CardPost;
