import axios from "axios";


const baseURL = process.env.REACT_APP_BASE_URL;

export default axios.create({
  baseURL: `${baseURL}`,
  // baseURL: "http://localhost:3000/app",
  headers: {
    "Content-type": "application/json"
  }
});