import axios from "axios";

const api = axios.create({
  baseURL: "https://bh-back.ihorcher.com/media",
});

export const uploadFile = async (file: File): Promise<{ fileUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload_file/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error: unknown) {
    let message = "Failed to upload file";
    if (axios.isAxiosError(error)) {
      message += `: ${error.response?.data || error.message}`;
    }
    console.error(message);
    throw new Error(message);
  }
};

export const urlAvatar = async (file_name: string): Promise<string> => {
  try {
    const { data } = await api.get(`/download/${file_name}`);
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch avatar URL";
    if (axios.isAxiosError(error)) {
      message += `: ${error.response?.data || error.message}`;
    }
    console.error(message);
    throw new Error(message);
  }
};
