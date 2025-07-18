import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // change port if needed
  withCredentials: true, // enable cookies
});

export default API;
