import axios from "axios";
import keycloak from "./Keycloak"

const baseURL = process.env.REACT_APP_BASE_URL;

const http = axios.create({
   baseURL: `${baseURL}`,
  //  baseURL: "http://localhost:3000/app",  
   headers: {
    "Content-type": "application/json"
  }
});

// Intercepteur pour injection automatique du token
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
  response => response,
  error => {
    if (error.response?.status === 401) {
      keycloak.logout(); 
    }
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