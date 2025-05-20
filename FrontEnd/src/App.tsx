import React,{ useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import keycloak from "./Keycloak"
import PrivateRoute from './Helpers/PrivateRoute';

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
import OfficeProdReports from './Pages/OfficeProdReports';



// import 'primeflex/primeflex.css';

import SearchByOffice from './Pages/SearchByOffice';
import SearchByArea from './Pages/SearchByArea';
import SearchByAreaV2 from './Pages/SearchByAreaV2';
import TeamInvestigator from './Pages/TeamInvestigator';
import SearchAgent from './Pages/Tools/SearchAgent';
import SearchApiListing from './Pages/Tools/SearchApiListing';
import SearchLoanOfficer from './Pages/SearchLoanOfficer';
import LoanOfficerProdReport from './Pages/LoanOfficerProdReport';
import FactBook from './Pages/FactBook';
import UsaMap from './Pages/USAMap/MapIndex';





import Home from './Components/Home';
import InitialRedirect from './Components/InitialRedirect';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SearchProvider } from './Components/Context/Context'; 


const redirectUrl = process.env.REACT_APP_REDIRECT_URL;




console.log("url="+process.env.PUBLIC_URL)






function App() {

  // useEffect(() => {
  //   const setupTokenRefresh = () => {
  //     const updateToken = setInterval(() => {
  //       if (keycloak.authenticated) {
  //         keycloak.updateToken(70) 
  //           .then((refreshed) => {
  //             if (refreshed) {
  //               console.log('Token rafraîchi avec succès');
  //             }
  //           })
  //           .catch(() => {
  //             console.error('Échec du rafraîchissement du token, déconnexion...');
  //             keycloak.logout();
  //           });
  //       }
  //     }, 60000); // Vérifier toutes les 60 secondes

  //     return () => clearInterval(updateToken); // Nettoyer l'intervalle lors du démontage du composant
  //   };

  //   setupTokenRefresh();
  // }, []);

  return (
    <div>
          <SearchProvider>

      <ReactKeycloakProvider authClient={keycloak} initOptions={{
        onLoad: 'login-required', 
        redirectUri: `${redirectUrl}`,
        checkLoginIframe: true,
            }}
        onEvent={(event, error) => {
          if (event === 'onAuthError') {
            console.error('Auth Error:', error);
          }
        }}
        onTokens={(tokens) => {
          if (tokens.token) {
            localStorage.setItem('kc_token', tokens.token);
          }
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
                           <Route      path="/UsaMap"
                                    element={
                                      <PrivateRoute>
                                        <UsaMap />
                                      </PrivateRoute>
                                    }
                        />
                        <Route      path="/FactBook"
                                    element={
                                      <PrivateRoute>
                                        <FactBook />
                                      </PrivateRoute>
                                    }
                        />
 
                        <Route      path="/SearchByAgent"
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
                        
                        <Route      path="/SearchByAreaV2"
                                    element={
                                      <PrivateRoute>
                                        <SearchByAreaV2 />
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
                        <Route      path="/officeProdReports/:param"
                                    element={
                                      <PrivateRoute>
                                        <OfficeProdReports />
                                      </PrivateRoute>
                                    }
                        />
                        <Route      path="/TeamInvestigator/:param"
                                    element={
                                      <PrivateRoute>
                                        <TeamInvestigator />
                                      </PrivateRoute>
                                    }
                        />
                        <Route      path="/searchTool"
                                    element={
                                      <PrivateRoute>
                                        <SearchAgent />
                                      </PrivateRoute>
                                    }
                        />                        
                        <Route      path="/searchApiListing"
                                    element={
                                      <PrivateRoute>
                                        <SearchApiListing />
                                      </PrivateRoute>
                                    } 
                        /> 
                        <Route      path="/SearchLoanOfficer"
                                    element={
                                      <PrivateRoute>
                                        <SearchLoanOfficer />
                                      </PrivateRoute>
                                    } 
                        /> 
                        <Route      path="/loanOfficerProdReport/:param"
                                    element={
                                      <PrivateRoute>
                                        <LoanOfficerProdReport />
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
