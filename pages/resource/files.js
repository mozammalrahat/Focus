import axios from "axios";
import { parseCookies } from "nookies";
import { useRef, useState } from "react";
import { Button, Form, Icon, Message, Table } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import { submitNewFile } from "../../utils/fileActions";
import uploadDocument from "../../utils/uploadDocumentToCloudinary";

function Files({ user, previousFiles }) {
  console.log(user);
  const [newFile, setNewFile] = useState({ name: "", type: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [filesList, setFilesList] = useState(previousFiles || []);

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
    setNewFile(getFileNameAndType(files));
    if (name === "media") {
      setMedia(files[0]);
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
          style={{ marginLeft: "55px", marginTop: "20px", width: "250px" }}
        >
          <Form.Group>
            <input
              ref={inputRef}
              onChange={handleChange}
              name="media"
              type="file"
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
            marginLeft: "48px",
            backgroundColor: "#1DA1F2",
            color: "white",
            width: "200px",
            height: "35px",
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
                <Table.Cell>Topic</Table.Cell>
                <Table.Cell>{item.fileType}</Table.Cell>
                <Table.Cell>
                  <a href={item.fileUrl}>Download</a>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {user.username === item.user.username ? (
                    <Icon name="delete" color="red" />
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
