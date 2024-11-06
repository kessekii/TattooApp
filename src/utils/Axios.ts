import axios from "axios";
import { devUrl } from "../config";

const Instance = axios.create({
  //   baseURL: devUrl,
  baseURL: "http://46.117.80.103:4000/",
    // baseURL: "http://[::1]:4000/",

  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    "X-Requested-With": "*",
  },
});

export default Instance;
