import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Icon, Message, Table } from "semantic-ui-react";
import io from "socket.io-client";
import MessageNotificationModal from "../../components/Home/MessageNotificationModal";
import baseUrl from "../../utils/baseUrl";
import { deleteFile, submitNewFile } from "../../utils/fileActions";
import getUserInfo from "../../utils/getUserInfo";
import newMsgSound from "../../utils/newMsgSound";
import uploadDocument from "../../utils/uploadDocumentToCloudinary";

function Files({ user, previousFiles }) {
  const [newFile, setNewFile] = useState({ name: "", type: "", topic: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [filesList, setFilesList] = useState(previousFiles || []);

  const [showToastr, setShowToastr] = useState(false);

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
  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const [error, setError] = useState(null);

  const [media, setMedia] = useState(null);

  const getFileNameAndType = (files) => {
    const lastdot = files[0].name.lastIndexOf(".");
    const fileName = files[0].name.substring(0, lastdot);
    const extension = files[0].name.substring(lastdot + 1);
    return { name: fileName, type: extension };
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      let dict = {};
      dict = getFileNameAndType(files);
      setNewFile((prev) => ({ ...prev, ...dict }));
      setMedia(files[0]);
    }
    if (name === "topic") {
      setNewFile((prev) => ({ ...prev, [name]: value }));
    }
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
    setLoading(true);
    let documentURL;

    if (media !== null) {
      documentURL = await uploadDocument(media);
      if (!documentURL) {
        setLoading(false);
        return setError("Error Uploading Document");
      }
    }

    console.log(documentURL);

    {
      await submitNewFile(
        newFile.name,
        newFile.type,
        newFile.topic,
        documentURL,
        setFilesList,
        setNewFile,
        setError
      );
    }
    setMedia(null);
    setLoading(false);
  };

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

      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />
        <div
          className="inputGroup"
          style={{
            marginLeft: "55px",
            marginTop: "20px",
            width: "auto",
            alignItems: "center",
          }}
        >
          <Form.Group widths="equal">
            <Form.Field>
              <input
                ref={inputRef}
                onChange={handleChange}
                name="media"
                type="file"
                style={{
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              />
            </Form.Field>

            <Divider horizontal hidden />
            <Form.Field>
              <input
                style={{
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
                value={newFile.topic}
                name="topic"
                onChange={handleChange}
                icon="clipboard outline"
                placeholder={"Add Topic!!"}
              />
            </Form.Field>
          </Form.Group>
        </div>

        {/* <Divider hidden /> */}

        <Form.Field>
          <Button
            circular
            disabled={loading}
            content={
              <strong style={{ fontSize: "12px", fontWeight: "500" }}>
                Upload Document
              </strong>
            }
            style={{
              marginLeft: "55px",
              color: "black",
              height: "35px",
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: "1px",
              width: "auto",
              height: "auto",
              backgroundColor: "#c4e6f3",
            }}
            icon="send"
            size="small"
            loading={loading}
          />
        </Form.Field>
      </Form>
      <Table stackable celled textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Topic</Table.HeaderCell>
            <Table.HeaderCell>File Type</Table.HeaderCell>
            <Table.HeaderCell>Download Link</Table.HeaderCell>
            <Table.HeaderCell>Uploaded By</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filesList.map((item) => (
            <>
              <Table.Row>
                <Table.Cell>{item.fileName}</Table.Cell>
                <Table.Cell>{item.fileTopic}</Table.Cell>
                <Table.Cell>{item.fileType}</Table.Cell>
                <Table.Cell>
                  <a href={item.fileUrl.replace("http://", "https://secure.")}>
                    Download
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {user.username === item.user.username ||
                  user.role === "root" ? (
                    <Icon
                      name="delete"
                      color="red"
                      link
                      onClick={() =>
                        deleteFile(item._id, setFilesList, setShowToastr)
                      }
                    />
                  ) : (
                    <></>
                  )}
                </Table.Cell>
                <Table.Cell>{item.user.username}</Table.Cell>
              </Table.Row>
            </>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

export default Files;

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);

  const res = await axios.get(`${baseUrl}/api/resource/files`, {
    headers: { Authorization: token },
  });

  return {
    props: {
      previousFiles: res.data,
    },
  };
}
