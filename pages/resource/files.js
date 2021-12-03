import axios from "axios";
import { parseCookies } from "nookies";
import { useRef, useState } from "react";
import { Button, Divider, Form, Message } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import { submitNewFile } from "../../utils/fileActions";
import uploadDocument from "../../utils/uploadDocumentToCloudinary";

function Files({ previousFiles }) {
  const [newFile, setNewFile] = useState({ name: "", type: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [filesList, setFilesList] = useState(previousFiles || []);

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);

  const [fileNameList, setFileNameList] = useState([]);

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
    setFileNameList((prev) => [...prev, files[0].name]);
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
          style={{ marginLeft: "55px", marginTop: "20px" }}
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

        <Divider hidden />

        <Button
          circular
          disabled={loading}
          content={
            <strong style={{ fontSize: "20px", fontWeight: "700" }}>
              Upload Document
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
      <h1>Files Lists</h1>
      {filesList.map((item) => (
        <>
          <h1>{item.fileName}</h1>
          <h3>{item.fileUrl}</h3>
        </>
      ))}
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
