import React, { useState,useEffect,useRef, MouseEventHandler } from 'react';
import { driver, DriveStep, Config } from 'driver.js';
import { useLocation,useMatch  } from 'react-router-dom';

import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';
import AgentService from "../Services/AgentService";
import OfficeService from "../Services/OfficeService";
import SearchItemAgent from "../Models/SearchItemAgent";
import SearchItemOffice from "../Models/SearchItemOffice";
import { BeatLoader } from 'react-spinners';
import { Dialog } from 'primereact/dialog';
import CurrentComponent from "./CurrentComponent"
import { useSearch } from './Context/Context';
import GeoAreaService from "../Services/GeoAreaService";
import SearchItemArea from "../Models/SearchItemArea";





const AppHeader : React.FC = () => {

  const location = useLocation(); 
  // const matchHome = useMatch({ path: '/', end: true });
  const matchSearchByName = useMatch('/SearchByName');
  const matchagentProdReports = useMatch('/agentProdReports/:param');
  const matchsearchByOffice = useMatch('/searchByOffice');
  const matchSearchByArea = useMatch('/SearchByArea');
  const { keycloak, initialized } = useKeycloak();
  const [searchHistoryAgent, setSearchHistoryAgent] = useState<Array<SearchItemAgent>>([]);
  const [searchHistoryOffice, setSearchHistoryOffice] = useState<Array<SearchItemOffice>>([]);
  const [searchHistoryArea, setSearchHistoryArea] = useState<Array<SearchItemArea>>([]);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isDropdownOpenOffice, setIsDropdownOpenOffice] = useState(true);
  const [isDropdownOpenArea, setIsDropdownOpenArea] = useState(true);

  const dropDownRef = useRef<HTMLDivElement>(null);
  const dropDownRefOffice = useRef<HTMLDivElement>(null);
  const dropDownRefArea = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(Boolean);
  const [visible, setVisible] = useState(false);
  let currentComponent;
  const { handleSearchAction } = useSearch();

  

  



  const handleClickOutside = (event: MouseEvent) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(!isDropdownOpen);
    }

    if (dropDownRefOffice.current && !dropDownRefOffice.current.contains(event.target as Node)) {
      setIsDropdownOpenOffice(!isDropdownOpenOffice);
    }

    if (dropDownRefArea.current && !dropDownRefArea.current.contains(event.target as Node)) {
      setIsDropdownOpenArea(!isDropdownOpenArea);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen,isDropdownOpenOffice,isDropdownOpenArea]);

  useEffect(() => {
    if (matchSearchByName) {
      currentComponent = 'SearchByName';
    } else if (matchagentProdReports) {
      currentComponent = 'agentProdReports';
    } else if (matchsearchByOffice) {
      currentComponent = 'searchByOffice';
    }else if (matchSearchByArea) {
      currentComponent = 'SearchByArea';
    } else {
      currentComponent = 'Unknown';
    }
    console.log(currentComponent);

  }, [keycloak.tokenParsed]);

  const handleClickPastReport = () => {
    const currentLocation = location.pathname.substring(1,17);
    // Check if the current path is the active path
    if (currentLocation == 'AgentProdReports') {

        
          const config: Config = {
            steps: [
            {
                element: '#idInfoIcon',
                popover: {
                title: 'Information',
                description: 'Click this icon to access detailed information for this section',
                side: 'bottom',
                showButtons: ['next', 'close']
                },
            
            },
            {
                element: '#idDisplayChart',
                popover: {
                title: 'Display the chart',
                description: 'Click this icon to display the chart',
                side: 'top',
                showButtons: ['next', 'close']
                },
            
            },
            // Add more steps as needed
            ],
            animate: true,
            overlayOpacity: 0.5,
            showButtons: ['next', 'previous', 'close']
        };

        // Initialize the driver with the configuration
        const myDriver = driver(config);

        // Start the driver
        myDriver.drive();
    }
   
  };

 /*  useEffect(() => {

    if (keycloak.tokenParsed?.sub) {
      const userId = keycloak.tokenParsed.sub;

      AgentService.getSavedFavorite(userId,"agent")
      .then((response: any) => { */
        
       /*  const history = response.data;
        console.log(history);
        localStorage.setItem(userId, JSON.stringify(history));
        setSearchHistory(history); */ 

        //setSearchHistory(response.data);
       // const filteredHistory = searchHistory.filter((item: SearchItem) => !item.isFavorite);
        //setSearchHistory(filteredHistory);
        



      /* })
      .catch((e: Error) => {
        console.log(e);
      });
    } 

  }, [isDropdownOpen]); */

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    //event.preventDefault(); // Prevent the default link behavior
    setIsLoading(true);
    const currentLocation = location.pathname.substring(1,17);
    // Check if the current path is the active path
    if (currentLocation == 'SearchByName' || currentLocation == 'AgentProdReports') {
      setIsDropdownOpen(!isDropdownOpen);
        
      if (keycloak.tokenParsed?.sub) {
        const userId = keycloak.tokenParsed.sub;
  
        await AgentService.getSavedFavorite(userId,"agent")
        .then((response: any) => {
          
         /*  const history = response.data;
          console.log(history);
          localStorage.setItem(userId, JSON.stringify(history));
          setSearchHistory(history); */ 
  
          setSearchHistoryAgent(response.data);
          setIsLoading(false);

  
         // const filteredHistory = searchHistory.filter((item: SearchItem) => !item.isFavorite);
          //setSearchHistory(filteredHistory);
          
  
  
  
        })
        .catch((e: Error) => {
          console.log(e);
        });
      }
      

    }else if(currentLocation == 'searchByOffice') {
      setIsDropdownOpenOffice(!isDropdownOpenOffice);

      if (keycloak.tokenParsed?.sub) {
        const userId = keycloak.tokenParsed.sub;
  
        await OfficeService.getSavedFavorite(userId,"office")
        .then((response: any) => {
          
         /*  const history = response.data;
          console.log(history);
          localStorage.setItem(userId, JSON.stringify(history));
          setSearchHistory(history); */ 
  
          setSearchHistoryOffice(response.data);
          setIsLoading(false);

         // const filteredHistory = searchHistory.filter((item: SearchItem) => !item.isFavorite);
          //setSearchHistory(filteredHistory);
          
  
  
  
        })
        .catch((e: Error) => {
          console.log(e);
        });
      }

    }else if(currentLocation == 'SearchByArea') {
      setIsDropdownOpenArea(!isDropdownOpenArea);

      if (keycloak.tokenParsed?.sub) {
        const userId = keycloak.tokenParsed.sub;
  
        await GeoAreaService.getSavedFavorite(userId,"area")
        .then((response: any) => {
          
         /*  const history = response.data;
          console.log(history);
          localStorage.setItem(userId, JSON.stringify(history));
          setSearchHistory(history); */ 
  
          setSearchHistoryArea(response.data);
          setIsLoading(false);

         // const filteredHistory = searchHistory.filter((item: SearchItem) => !item.isFavorite);
          //setSearchHistory(filteredHistory);
          
  
  
  
        })
        .catch((e: Error) => {
          console.log(e);
        });
      }

    }
   
    

  };

  const redirectToApr = (id : string) => {
    navigate(`/AgentProdReports/${id}`);
  };
      














  return (

    <div>
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            
            <ul className="navbar-nav">
            <li className="nav-item">
            {!keycloak.authenticated && (

            <img src="/CREMS-LABS-Logo-No-Tagline-Color-Logo.png" alt="CREMS Logo" className="img-fluid  "style={{width: '50%'}} />
            )}

              </li>

              <li className="nav-item">
              {!!keycloak.authenticated && (
                
                <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>

              )}
              </li>
            
            
            </ul>
            
            <ul id="Mobile" className="navbar-nav  text-center mx-auto">

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Links
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href="https://www.webedsystems.com/support">Support</a>
                  <a className="dropdown-item" onClick={() => setVisible(true)}>Reporting Accuracy</a>

                </div>

              </li>
            </ul>


            <ul id="Desktop" className="navbar-nav col-md-9 text-center mx-auto">
              

             

              <li className="nav-item mr-2">
                <a href="https://www.webedsystems.com/support" className="nav-link " style={{color: '#03263a', 
                fontFamily: 'Roboto-Medium, sans-serif', 
                fontWeight: 'bold'
                }}>Support</a>
              </li>
              <li className="nav-item mr-2">
                <a role="button" className="nav-link " style={{color: '#03263a', 
                fontFamily: 'Roboto-Medium, sans-serif', 
                fontWeight: 'bold'
                }} onClick={() => setVisible(true)}>Reporting Accuracy</a>
              </li>
              
              <CurrentComponent type={'D'}/>
              
            </ul>
            



            {/* Right navbar links */}

            <ul className="navbar-nav ml-auto">
              {/* Navbar Search */}
              {/* Notifications Dropdown Menu */}
              {/* <li className="nav-item">
              {!!keycloak.authenticated && (
                
                <a className="nav-link"  role="button" onClick={handleClickPastReport} tabIndex={0} data-bs-toggle="popoverGuid" data-placement="top" title="User guidance" data-bs-content="Here's some helpful information about using the site. Click outside to hide">
                      <i className="bi bi-compass"></i>
                </a> 
              )}
                
              </li> */}
              
              
              <li className="nav-item mr-2">
              {!!keycloak.authenticated && (

                    <div className="md-col-2 flex-container mt-2 my-auto" role="button" onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
                    </svg><label role="button" className="text-sm my-auto mx-auto">Saved Searches</label>
                    </div>
                  
                )}

                {!isDropdownOpen && (

                <div className=" custom-dropdown popover-style" ref={dropDownRef}>
                  <div className="dropdown-item text-center">
                  <h6>Agents</h6> 
                  </div>
                  {isLoading? ( <div  >
                                  <ul className=""style={{listStyleType: 'none'}}>
         
                                    <li>
                                    <BeatLoader className="loading-container mt-3"size={10} color="#36d7b7" />
                                    </li>
                              
                                 </ul> 
                                 </div>
                              ):                                         
                  searchHistoryAgent[0]?  (
                          <ul className="">
                            {searchHistoryAgent.map((search, index) => (
                                <a className="nav-link"   href="#" onClick={() => redirectToApr(search.agentIdC)}>
                                  <li key={index} className="">
                                    {search.firstName} {search.lastName}
                                    
                                  </li>
                              </a>
                            ))}
                          </ul>
                        ):(
                          <div className="dropdown-item text-center">No favorite agents</div>
                        )}



                </div>
                      )}

                    {!isDropdownOpenOffice && (

                    <div className=" custom-dropdown popover-style" ref={dropDownRefOffice}>
                      <div className="dropdown-item text-center">
                      <h6>Offices</h6> 
                      </div>
                      {isLoading? ( <div  >
                                  <ul className=""style={{listStyleType: 'none'}}>
         
                                    <li>
                                    <BeatLoader className="loading-container mt-3"size={10} color="#36d7b7" />
                                    </li>
                              
                                 </ul> 
                                 </div>
                              ):  
                      searchHistoryOffice[0]?  (
                              <ul >
                                {searchHistoryOffice.map((search, index) => (
                                    <a className="nav-link" href="#" onClick={() => handleSearchAction(search)} >
                                      <li key={index} className="">
                                        {search.officeName}
                                        
                                      </li>
                                  </a>
                                ))}
                              </ul>
                            ):(
                              <div className="dropdown-item text-center">No favorite offices</div>
                            )}

                        

                    </div>
                          )}
                  {!isDropdownOpenArea && (

                    <div className=" custom-dropdown popover-style" ref={dropDownRefArea}>
                      <div className="dropdown-item text-center">
                      <h6>Areas</h6> 
                      </div>
                      {isLoading? ( <div  >
                                  <ul className=""style={{listStyleType: 'none'}}>

                                    <li>
                                    <BeatLoader className="loading-container mt-3"size={10} color="#36d7b7" />
                                    </li>
                              
                                </ul> 
                                </div>
                              ):  
                      searchHistoryArea[0]?  (
                              <ul >
                                {searchHistoryArea.map((search, index) => (
                                    <a className="nav-link" href="#"  >
                                      <li key={index} className="">
                                      {"City: "}{search.city}{" | zip "}{"["+ search.zips+"]"}
                                        
                                      </li>
                                  </a>
                                ))}
                              </ul>
                            ):(
                              <div className="dropdown-item text-center">No favorite areas</div>
                            )}

                        

                    </div>
                          )}

                </li>

              <div className="hover:text-gray-200">
                          {!keycloak.authenticated && (
                            <button
                              type="button"
                              className="btn btn-primary mr-5"
                              onClick={() => keycloak.login({ redirectUri: `${process.env.REACT_APP_LOGIN_URL}` })}

                            >
                              Login
                            </button>
                          )}

                          {!!keycloak.authenticated && (
                            <button
                              type="button"
                              className="btn btn-danger "
                              onClick={() => keycloak.logout({ redirectUri: `${process.env.REACT_APP_LOGOUT_URL}`})}
                            >
                              Logout ({keycloak.tokenParsed?keycloak.tokenParsed.preferred_username:null})
                            </button>
                          )}
              </div>
              
            
              
            </ul>
           
            <div className="card flex justify-content-center">
            <Dialog header="REPORTING ACCURACY" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <p className="mb-3">
                <strong><span style={{ textDecoration: 'underline'}}>REPORTING ACCURACY: </span></strong>The Agent Production Reporting (APR) system is mostly built on Multiple Listing Systems (MLS) data. That data is updated twice daily from hundreds of online APIs, so the agent reporting is continually updated. In addition, there are other sources of data which we integrate into the APR, too.  But the accuracy of the reporting is dependent on the accuracy of the listing data which agents enter in their local MLS.
                </p>
                <p className="mb-3">
                In addition, most agents enter the same listing into 3 or 4 different MLS.  The APR system consolidates all the separate MLS, removes redundancies, and updates the most recent status of each listing. Agents frequently make errors in entering the data and the APR system endeavors to rectify obvious errors, such as typos affecting addresses, pricing, and the status of the listings. But ultimately, agents are the raw sources of the listing information, and they find many creative ways to introduce new errors.
                </p>
                <p className="mb-3">
                Our “accuracy metric” indicates a 98% accuracy, but that is not 100%, so be advised that there might be occasional errors or omissions.  When viewing the reporting, you can be assured that the data is highly accurate, but not error free. So, look at trends and totals.
                </p>
                <p className="mb-5">
                <strong><span style={{ textDecoration: 'underline'}}>WHAT THE APR IS NOT: </span></strong>The APR systems is a comprehensive representation of individual agent’s sales success, or failure. But below are some things that the APR is not:
                 <ul>
                   <li><span style={{ textDecoration: 'underline'}}>NOT a complete list of every licensed agent.</span> If an agent does not list or sell properties, then they will not be in the MLS listing data.  If you can’t find an agent, then it means they are not an active listing or selling agent.</li>
                   <li><span style={{ textDecoration: 'underline'}}>NOT a list of office management, ownership, or administration.</span> The APR system provides a series of office reports, based on the agents who claim to be in that office. But it is not a roaster of all agents who might be associated with that office.  Only the ones listing or selling properties.</li>
                   <li><span style={{ textDecoration: 'underline'}}>NOT a source of agents who have moved or left an office.</span> The APR keeps track of the office and the agents in that office by using the most recent listing or selling data. If an agent lists a property and claims to have now moved to a new office, then we’ll reflect that move in that new office’s list of agents.  Although, the agent’s history of sales moves with the agent.</li>
                   <li><span style={{ textDecoration: 'underline'}}> NOT a source of reporting everywhere.</span> The APR is currently in California and Florida. Two of the most active and fragmented MLS data states in the US. For example, there are approximately 2 dozen separate MLS publications in each of these states. The APR system consolidates all the MLS data into one database, updates it twice a day, and uses that data to generate real-time reporting.</li>
                   <li><span style={{ textDecoration: 'underline'}}> Does NOT create data.</span> The agent, office, and listing information is not “created”.  The APR cleans and organizes the data that is delivered from the MLS and other sources. It makes educated assumptions when presented with duplicate information from separate sources. No listing or agent is created without originating from one of those sources.</li>         
                 </ul>
                </p>
                
            </Dialog>
        </div>
     </nav>

          </div>
          <div id="MobilePageTitle"  className="text-center">
              
          <CurrentComponent type={'M'}/>
              </div>
          </div>
          
          



  );
};

export default AppHeader;
