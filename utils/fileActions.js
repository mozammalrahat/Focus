import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/resource/files`,
  headers: { Authorization: cookie.get("token") },
});

export const submitNewFile = async (
  fileName,
  fileType,
  fileTopic,
  fileUrl,
  setFilesList,
  setNewFile,
  setError
) => {
  try {
    const res = await Axios.post("/", {
      fileName,
      fileType,
      fileTopic,
      fileUrl,
    });

    setFilesList((prev) => [res.data, ...prev]);
    setNewFile({ name: "", type: "" });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};

export const deleteFile = async (fileId, setFilesList, setShowToastr) => {
  try {
    await Axios.delete(`/${fileId}`);
    setFilesList((prev) => prev.filter((file) => file._id !== fileId));
    setShowToastr(true);
  } catch (error) {
    alert(catchErrors(error));
  }
};
