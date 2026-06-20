import axios from "axios";
import keycloak from "./Keycloak"
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_BASE_URL; 

const http = axios.create({
   baseURL: `${baseURL}`, 
  //  baseURL: "http://localhost:3000/app",  
   headers: {
    "Content-type": "application/json"
  }
});

// interceptor for inject token
http.interceptors.request.use(async (config) => {
  if (keycloak && keycloak.authenticated) {
    try {
      await keycloak.updateToken(70); 
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      keycloak.logout();
    }
  }
  return config;
});


http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      
      sessionStorage.setItem("session_expired", "true");
      keycloak.logout();
    } 
    else if (status >= 500) {
      toast.error("An internal error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } 
    // else if (status >= 400) {
    //   const message = error.response?.data?.message || "An internal error occurred.";
    //   toast.warn(message, { position: "top-right", autoClose: 5000 });
    // }

    return Promise.reject(error);
  }
);

// import axios from "axios";


// const baseURL = process.env.REACT_APP_BASE_URL;

// export default axios.create({
//   // baseURL: `${baseURL}`,
//   baseURL: "http://localhost:3000/app",
//   headers: {
//     "Content-type": "application/json"
//   }
// });

export default http;