import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔥 AUTO TOKEN ADD
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;