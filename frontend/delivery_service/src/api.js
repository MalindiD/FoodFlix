import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diejjxqts/image/upload";
const UPLOAD_PRESET = "estate"; // Replace with your actual preset

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await axios.post(CLOUDINARY_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.secure_url;
};
