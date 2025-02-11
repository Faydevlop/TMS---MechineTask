import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
