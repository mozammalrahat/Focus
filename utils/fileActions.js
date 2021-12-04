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
  fileUrl,
  setFilesList,
  setNewFile,
  setError
) => {
  try {
    const res = await Axios.post("/", { fileName, fileType, fileUrl });

    setFilesList((prev) => [res.data, ...prev]);
    setNewFile({ name: "", type: "" });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};
