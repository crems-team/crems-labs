import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import keycloak, { keycloakInitOptions, setupTokenRefresh ,getUserInfo} from "./Keycloak";
import PrivateRoute from './Helpers/PrivateRoute';

// Import components
import SearchByName from './Pages/SearchByName';
import AppMenu from './Components/AppMenu';
import Footer from './Components/Footer';
import AppHeader from './Components/AppHeader';
import AgentProdReports from './Pages/AgentProdReports';
import OfficeProdReports from './Pages/OfficeProdReports';
import SearchByOffice from './Pages/SearchByOffice';
import SearchByArea from './Pages/SearchByArea';
import SearchByAreaV2 from './Pages/SearchByAreaV2';
import TeamInvestigator from './Pages/TeamInvestigator';
import SearchAgent from './Pages/Tools/SearchAgent';
import SearchApiListing from './Pages/Tools/SearchApiListing';
import SearchLoanOfficer from './Pages/SearchLoanOfficer';
import LoanOfficerProdReport from './Pages/LoanOfficerProdReport';
import WelcomePage from './Pages/WelcomePage';
import UsaMap from './Pages/USAMap/MapIndex';
import SearchTeam from './Pages/SearchTeam';
import TeamGraphMockPage from './Pages/TeamGraphMockPage';
import SearchTeamInvestigation from './Pages/TeamInvestigation/SearchTeamInvestigation';
import TeamInvestigationGraphPage from './Pages/TeamInvestigation/TeamInvestigationGraphPage';

// CSS imports
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './App.css';

// Context and hooks
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchProvider } from './Components/Context/Context'; 
import SessionExpiredModal from './Components/SessionExpiredModal';

import { InactivityMonitor } from './Components/InactivityMonitor';
import  BackButton from './Components/BackButton';



const INACTIVITY_LIMIT = 30 * 60 * 1000;  

const App: React.FC = () => {
  const [tokenRefreshCleanup, setTokenRefreshCleanup] = useState<() => void>(() => () => {});
  const [expired, setExpired] = useState(false);
  const handleKeycloakEvent = useCallback((event: string) => {
    if (event === 'onAuthSuccess') {
      const cleanup = setupTokenRefresh();
      setTokenRefreshCleanup(() => cleanup);
      setExpired(false);
    }
    if (event === 'onAuthError' || event === 'onAuthLogout') {
      setExpired(true);
    }
  }, []);

  const handleTokens = useCallback((tokens: any) => {
    if (tokens.token) localStorage.setItem('kc_token', tokens.token);
  }, []);

  const onInactivity = () => {
    // Mark the session expired and stop refresh auto
    setExpired(true);
    tokenRefreshCleanup();
  };

  const onReconnect = () => {
    setExpired(false);
    keycloak.logout();  
  };


  return (
    <div>
      <SearchProvider>
        <ReactKeycloakProvider 
          authClient={keycloak} 
          initOptions={keycloakInitOptions}
          onEvent={handleKeycloakEvent}
          onTokens={handleTokens}
          LoadingComponent={
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
            <InactivityMonitor timeout={INACTIVITY_LIMIT} onTimeout={onInactivity} />

            <SessionExpiredModal show={expired} onReconnect={onReconnect} />

          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="wrapper">
              <PrivateRoute>
                <AppHeader />
              </PrivateRoute>
              <PrivateRoute>
                <BackButton />
              </PrivateRoute>

              <div className="content-wrapper bg-white">
                <Routes>  
                  <Route path="/UsaMap" element={
                    <PrivateRoute><UsaMap /></PrivateRoute>
                  } />
                  
                  <Route path="/welcomePage" element={
                    <PrivateRoute><WelcomePage /></PrivateRoute>
                  } />

                  <Route path="/SearchByAgent" element={
                    <PrivateRoute><SearchByName /></PrivateRoute>
                  } />
                  
                  <Route path="/searchByOffice" element={
                    <PrivateRoute><SearchByOffice /></PrivateRoute>
                  } />

                  <Route path="/SearchByArea" element={
                    <PrivateRoute><SearchByArea /></PrivateRoute>
                  } />
                  
                  <Route path="/SearchByAreaV2" element={
                    <PrivateRoute><SearchByAreaV2 /></PrivateRoute>
                  } />

                  <Route path="/agentProdReports/:param" element={
                    <PrivateRoute><AgentProdReports /></PrivateRoute>
                  } />
                  
                  <Route path="/officeProdReports/:param" element={
                    <PrivateRoute><OfficeProdReports /></PrivateRoute>
                  } />
                  
                  <Route path="/TeamInvestigator/:param" element={
                    <PrivateRoute><TeamInvestigator /></PrivateRoute>
                  } />
                  
                  <Route path="/searchTool" element={
                    <PrivateRoute><SearchAgent /></PrivateRoute>
                  } />
                  
                  <Route path="/searchApiListing" element={
                    <PrivateRoute><SearchApiListing /></PrivateRoute>
                  } />
                  
                  <Route path="/SearchLoanOfficer" element={
                    <PrivateRoute><SearchLoanOfficer /></PrivateRoute>
                  } />

                  <Route path="/SearchTeam" element={
                      <PrivateRoute><SearchTeam /></PrivateRoute>
                    } />      

                  <Route path="/SearchTeamInvest" element={
                      <PrivateRoute><SearchTeamInvestigation /></PrivateRoute>
                    } />   

                  <Route path="/teamInvestGraph/:param" element={
                    <PrivateRoute><TeamInvestigationGraphPage /></PrivateRoute>
                  } />    

                  <Route path="/teamGraph/:param" element={
                    <PrivateRoute><TeamGraphMockPage /></PrivateRoute>
                  } />       
                  
                  <Route path="/loanOfficerProdReport/:param" element={
                    <PrivateRoute><LoanOfficerProdReport /></PrivateRoute>
                  } />
                </Routes>
              </div>

              <PrivateRoute>
                <Footer />
              </PrivateRoute>
              
              <PrivateRoute>
                <AppMenu />
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
                theme="light"
              />



            </div>
          </BrowserRouter>
        </ReactKeycloakProvider>
      </SearchProvider>
    </div>
  );
};

export default App;