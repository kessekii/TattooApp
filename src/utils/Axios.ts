import axios from "axios";
import { devUrl } from "../config";

const Instance = axios.create({
  //   baseURL: devUrl,
  baseURL: "http://[::]:4000/",
  //   baseURL: "http://[::1]:4000/",

  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    "X-Requested-With": "*",
  },
});
Instance.interceptors.request.use((config) => {
  config.timeout = 2000; // Wait for 5 seconds before timing out
  return config;
});
Instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.log("Request timed out");
    }
    return Promise.reject(error);
  }
);
export default Instance;
