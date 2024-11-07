import axios from "axios";
import { devUrl } from "../config";

export const baseURL =  "http://46.117.80.103:4000/"
// export const baseURL = "http://[::1]:4000/"
const Instance = axios.create({
  //   baseURL: devUrl,
  baseURL: baseURL,
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

