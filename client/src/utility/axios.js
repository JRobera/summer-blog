import axios from "axios";

const api = axios.create({
  baseURL: "https://summer-blog-api.onrender.com",
});

export default api;
