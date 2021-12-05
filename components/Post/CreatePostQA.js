import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Icon,
  Image,
  Message,
  Checkbox,
  Segment,
} from "semantic-ui-react";
// import { submitNewPost } from "../../utils/postActions";
import { submitNewPost as submitNewQuestion } from "../../utils/qaActions";
import uploadPic from "../../utils/uploadPicToCloudinary";

function CreatePostQA({ user, setPosts }) {
  // console.log("Inside CreatePostQA");
  const router = useRouter();
  const pathString = router.pathname;
  // console.log("pathString--->", pathString);

  const [newPost, setNewPost] = useState({
    text: "",
    topic: "",
    qa_toggle: "",
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const addStyles = () => ({
    textAlign: "center",
    height: "150px",
    width: "150px",
    border: "dotted",
    paddingTop: media === null && "60px",
    cursor: "pointer",
    borderColor: highlighted ? "green" : "black",
    marginLeft: "55px",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Inside handleSubmit-->", newPost.qa);
    setLoading(true);
    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error Uploading Image");
      }
    }
    await submitNewQuestion(
      newPost.text,
      newPost.topic,
      newPost.qa_toggle,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  return (
    <>
      {pathString === "/resource" ? (
        <>
          <Form error={error !== null} onSubmit={handleSubmit}>
            <Message
              error
              onDismiss={() => setError(null)}
              content={error}
              header="Oops!"
            />

            <Form.Group>
              <Image
                className="propicIcon"
                floated="left"
                src={user.profilePicUrl}
                avatar
                circular
                style={{ width: "3em", height: "3em" }}
              />
              <Form.TextArea
                className="postTextArea"
                placeholder={"Post Scholarships News"}
                name="text"
                style={{
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
                value={newPost.text}
                onChange={handleChange}
                rows={4}
                width={14}
              />
            </Form.Group>

            <div
              className="inputGroup"
              style={{ marginLeft: "55px", marginTop: "20px" }}
            >
              <h6 style={{ color: "white", margin: "-5px" }}>
                {(newPost.qa_toggle = "resource")}{" "}
              </h6>

              <Form.Group
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  letterSpacing: "0.1px",
                  color: "black",
                }}
              >
                <Form.Input
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: "1px",
                  }}
                  value={newPost.topic}
                  name="topic"
                  onChange={handleChange}
                  // label={"Add Topic"}
                  icon="graduation cap"
                  placeholder={"Scholarships Type"}
                />

                <input
                  ref={inputRef}
                  onChange={handleChange}
                  name="media"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                />
              </Form.Group>
            </div>

            <div
              onClick={() => inputRef.current.click()}
              style={addStyles()}
              onDrag={(e) => {
                e.preventDefault();
                setHighlighted(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setHighlighted(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setHighlighted(true);

                const droppedFile = Array.from(e.dataTransfer.files);

                setMedia(droppedFile[0]);
                setMediaPreview(URL.createObjectURL(droppedFile[0]));
              }}
            >
              {media === null ? (
                <Icon name="plus" size="big" />
              ) : (
                <>
                  <Image
                    className="imagefileInput"
                    style={{ height: "150px" }}
                    src={mediaPreview}
                    alt="PostImage"
                    centered
                    size="medium"
                  />
                </>
              )}
            </div>
            <Divider hidden />

            <Button
              circular
              disabled={newPost.text === "" || loading}
              content={
                <strong style={{ fontSize: "20px", fontWeight: "700" }}>
                  Post
                </strong>
              }
              style={{
                marginLeft: "48px",
                backgroundColor: "#1DA1F2",
                color: "white",
                width: "190px",
                height: "55px",
              }}
              icon="send"
              size="big"
              loading={loading}
            />
          </Form>
          <Divider />
        </>
      ) : (
        <>
          <Form error={error !== null} onSubmit={handleSubmit}>
            <Message
              error
              onDismiss={() => setError(null)}
              content={error}
              header="Oops!"
            />

            <Form.Group>
              <Image
                className="propicIcon"
                floated="left"
                src={user.profilePicUrl}
                avatar
                circular
                style={{ width: "3em", height: "3em" }}
              />
              <Form.TextArea
                className="postTextArea"
                placeholder={"Ask a Question?"}
                name="text"
                style={{
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
                value={newPost.text}
                onChange={handleChange}
                rows={4}
                width={14}
              />
            </Form.Group>

            <div
              className="inputGroup"
              style={{ marginLeft: "55px", marginTop: "20px" }}
            >
              {pathString === "/qa" ? (
                <>
                  <h6 style={{ color: "white", margin: "-5px" }}>
                    {(newPost.qa_toggle = "Questions")}{" "}
                  </h6>
                </>
              ) : (
                <>
                  <h6 style={{ color: "white", margin: "-5px" }}>
                    {(newPost.qa_toggle = "JobPost")}{" "}
                  </h6>
                </>
              )}

              <Form.Group
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  letterSpacing: "0.1px",
                  color: "black",
                }}
              >
                <Form.Input
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: "1px",
                  }}
                  value={newPost.topic}
                  name="topic"
                  onChange={handleChange}
                  // label={"Add Topic"}
                  icon="clipboard outline"
                  placeholder={"Add Topic"}
                />

                <input
                  ref={inputRef}
                  onChange={handleChange}
                  name="media"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                />
              </Form.Group>
            </div>

            <div
              onClick={() => inputRef.current.click()}
              style={addStyles()}
              onDrag={(e) => {
                e.preventDefault();
                setHighlighted(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setHighlighted(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setHighlighted(true);

                const droppedFile = Array.from(e.dataTransfer.files);

                setMedia(droppedFile[0]);
                setMediaPreview(URL.createObjectURL(droppedFile[0]));
              }}
            >
              {media === null ? (
                <Icon name="plus" size="big" />
              ) : (
                <>
                  <Image
                    className="imagefileInput"
                    style={{ height: "150px" }}
                    src={mediaPreview}
                    alt="PostImage"
                    centered
                    size="medium"
                  />
                </>
              )}
            </div>
            <Divider hidden />

            <Button
              circular
              disabled={newPost.text === "" || loading}
              content={
                <strong style={{ fontSize: "20px", fontWeight: "700" }}>
                  Post
                </strong>
              }
              style={{
                marginLeft: "48px",
                backgroundColor: "#1DA1F2",
                color: "white",
                width: "190px",
                height: "55px",
              }}
              icon="send"
              size="big"
              loading={loading}
            />
          </Form>
          <Divider />
        </>
      )}
    </>
  );
}

export default CreatePostQA;
