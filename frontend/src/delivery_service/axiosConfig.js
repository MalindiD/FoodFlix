import axios from "axios";

// Set up base URL for your backend API (e.g., localhost or production URL)
axios.defaults.baseURL = "http://localhost:5003"; // Adjust to the actual URL and port of your backend

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request headers
  }
  return config;
});

export default axios;
