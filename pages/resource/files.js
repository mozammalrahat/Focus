import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Icon, Message, Table } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import { deleteFile, submitNewFile } from "../../utils/fileActions";
import uploadDocument from "../../utils/uploadDocumentToCloudinary";

function Files({ user, previousFiles }) {
  const [newFile, setNewFile] = useState({ name: "", type: "", topic: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [filesList, setFilesList] = useState(previousFiles || []);

  const [showToastr, setShowToastr] = useState(false);
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
            width: "700px",
            alignItems: "center",
          }}
        >
          <Form.Group>
            <input
              ref={inputRef}
              onChange={handleChange}
              name="media"
              type="file"
              style={{
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "1px",
                width: "400px",
              }}
            />
            <input
              style={{
                marginLeft: "30px",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "1px",
                width: "270px",
              }}
              value={newFile.topic}
              name="topic"
              onChange={handleChange}
              // label={"Add Location"}
              icon="clipboard outline"
              placeholder={"Add Topic!!"}
            />
          </Form.Group>
        </div>

        {/* <Divider hidden /> */}

        <Button
          circular
          disabled={loading}
          content={
            <strong style={{ fontSize: "12px", fontWeight: "500" }}>
              Upload Document
            </strong>
          }
          style={{
            marginLeft: "250px",
            color: "black",
            height: "35px",
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: "1px",
            width: "400px",
          }}
          icon="send"
          size="small"
          loading={loading}
        />
      </Form>
      <Table celled>
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
                  <a href={item.fileUrl}>Download</a>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {user.username === item.user.username ? (
                    <Icon
                      name="delete"
                      color="red"
                      link
                      onClick={() =>
                        deleteFile(item._id, setFilesList, setShowToastr)
                      }
                    />
                  ) : (
                    <strong></strong>
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
