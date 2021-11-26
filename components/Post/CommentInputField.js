import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { postComment } from "../../utils/postActions";
import { postComment as postAnswer } from "../../utils/qaActions";

function CommentInputField({ postId, user, setComments }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        pathString === "/qa"
          ? await postAnswer(postId, user, text, setComments, setText)
          : await postComment(postId, user, text, setComments, setText);

        setLoading(false);
      }}
    >
      <Form.Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={pathString === "/qa" ? "Answer Please!!" : "Add Comment"}
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
