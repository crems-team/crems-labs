import React,{ useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import keycloak from "./Keycloak"
import PrivateRoute from "./Helpers/PrivateRoute";

import SearchByName from './Pages/SearchByName';
import AppMenu from './Components/AppMenu';
import Footer from './Components/Footer';
import AppHeader from './Components/AppHeader';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import './App.css';
import AgentProdReports from './Pages/AgentProdReports';


//import 'primeflex/primeflex.css';

import SearchByOffice from './Pages/SearchByOffice';
import SearchByArea from './Pages/SearchByArea';

import Home from './Components/Home';
import InitialRedirect from './Components/InitialRedirect';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SearchProvider } from './Components/Context/Context'; 


const redirectUrl = process.env.REACT_APP_REDIRECT_URL;




console.log("url="+process.env.PUBLIC_URL)






function App() {


  return (
    <div>
          <SearchProvider>

      <ReactKeycloakProvider authClient={keycloak} initOptions={{
        onLoad: 'login-required', 
        redirectUri: `${redirectUrl}`,
        checkLoginIframe: false,
            }}>

          <BrowserRouter basename={process.env.PUBLIC_URL}>
            
            <div className="wrapper">
                    
                    <PrivateRoute>
                      <AppHeader/>
                    </PrivateRoute>
                    <div className="content-wrapper bg-white">
                       
                      <Routes>  

                        {/* <Route      path="/"
                                    element={
                                        <Home />
                                    }
                        />                                       */}
 
                        <Route      path="/SearchByName"
                                    element={
                                      <PrivateRoute>
                                        <SearchByName />
                                      </PrivateRoute>
                                    }
                        />
                                    
                        <Route      path="/searchByOffice"
                                    element={
                                      <PrivateRoute>
                                        <SearchByOffice />
                                      </PrivateRoute>
                                    }
                        />

                        <Route      path="/SearchByArea"
                                    element={
                                      <PrivateRoute>
                                        <SearchByArea />
                                      </PrivateRoute>
                                    }
                        />
                        <Route      path="/agentProdReports/:param"
                                    element={
                                      <PrivateRoute>
                                        <AgentProdReports />
                                      </PrivateRoute>
                                    }
                        />
                      </Routes>
                    </div>
                    <PrivateRoute>
                      <Footer/>
                    </PrivateRoute>
                    <PrivateRoute>
                      <AppMenu/>
                    </PrivateRoute>

                    <ToastContainer 
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
            </div>
          </BrowserRouter>

      </ReactKeycloakProvider>
      </SearchProvider>

    </div>
  );
}

export default App;
