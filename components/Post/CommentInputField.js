import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { postComment } from "../../utils/postActions";
import { postComment as postAnswer } from "../../utils/qaActions";

function CommentInputField({ postId, user, setComments, socket }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  // console.log("socket-->", socket);
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        if (socket.current) {
          if (pathString === "/st") {
            socket.current.emit("commentPost", {
              postId: postId,
              userId: user._id,
              text: text,
            });

            socket.current.on("postCommented", async () => {
              try {
                pathString === "/st"
                  ? await postComment(postId, user, text, setComments, setText)
                  : await postAnswer(postId, user, text, setComments, setText);
              } catch (error) {
                alert(catchErrors(error));
              }
            });
          } else {
            socket.current.emit("commentPostQA", {
              postId: postId,
              userId: user._id,
              text: text,
            });

            socket.current.on("postCommentedQA", async () => {
              try {
                pathString === "/st"
                  ? await postComment(postId, user, text, setComments, setText)
                  : await postAnswer(postId, user, text, setComments, setText);
              } catch (error) {
                alert(catchErrors(error));
              }
            });
          }
        } else {
          pathString === "/st"
            ? await postComment(postId, user, text, setComments, setText)
            : await postAnswer(postId, user, text, setComments, setText);
        }
        setLoading(false);
      }}
    >
      <Form.Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={pathString === "/st" ? "Add Comment" : "Answer Please!!"}
        action={{
          color: "blue",
          icon: "edit",
          loading: loading,
          disabled: text === "" || loading,
        }}
      />
    </Form>
  );
}

export default CommentInputField;
