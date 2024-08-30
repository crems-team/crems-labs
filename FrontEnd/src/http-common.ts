import axios from "axios";


const baseURL = process.env.REACT_APP_BASE_URL || "https://crems-labs.com/app";

export default axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-type": "application/json"
  }
});