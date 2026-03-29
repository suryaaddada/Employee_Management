import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7157/api", // change port if different
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;