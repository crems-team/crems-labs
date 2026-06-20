import React,{useEffect,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { resetMapState } from '../Redux/Slices/MapSlice';
import { resetAreaAgentState } from '../Redux/Slices/AreaAgentSlice';
import { resetTeamInvestigationState } from '../Redux/Slices/TeamInvestigationSlice';
import { useSearch } from '../Components/Context/Context';
import RenderOnRole from '../Helpers/RenderOnRole';

function AppMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setCollapsed } = useSearch();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    areaReports: false,
  });
  
  const goToSearchByArea = () => {
    // document.body.classList.toggle('sidebar-collapse');
    dispatch(resetMapState());
    dispatch(resetAreaAgentState());
    dispatch(resetTeamInvestigationState());
    setCollapsed(true);
    navigate('/SearchByAreaV2');
  };

    const goToTeamInvestigation = () => {
    dispatch(resetTeamInvestigationState());
    navigate('/SearchTeamInvest');
  };

  // const goToSearchByAreaV2 = () => {
  //   document.body.classList.toggle('sidebar-collapse');
  //   dispatch(resetAreaAgentState());
  //   setCollapsed(true);
  //   navigate('/SearchByAreaV2');
  // };
 
  const handleSidebarClick = () => {
    document.body.classList.toggle('sidebar-collapse');
  };

  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed = document.body.classList.contains('sidebar-collapse');
      setIsSidebarExpanded(!isCollapsed);
    };

    updateSidebarState();

    const observer = new MutationObserver(() => {
      updateSidebarState();
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const triggerFeedback = () => {
    // Find the existing button by class or ID (replace with your selector if different)
    const feedbackButton = document.querySelector('.atlwdg-trigger');
    if (feedbackButton) {
      (feedbackButton as HTMLElement).click(); // Simulate click event
    } else {
      console.error('Feedback button not found.');
    }
  };

  

  const toggleSubmenu = (submenuKey: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenuKey]: !prev[submenuKey]
    }));
    const isCollapsed = document.body.classList.contains('sidebar-collapse');
    if(isCollapsed){
      document.body.classList.toggle('sidebar-collapse');
    }

  };

  // Ferme les sous-menus quand la sidebar se réduit
  useEffect(() => {
    if (!isSidebarExpanded) {
      setOpenSubmenus({ areaReports: false });
    }
  }, [isSidebarExpanded]);

  return (
    <div  style={{ cursor: 'pointer' }}>
      <aside className="main-sidebar sidebar-dark-primary sidebar-no-expand">
        {/* Brand Logo */}
        <a href="/" className="brand-link bg-grey">
          <span className="text-center">
            <img
              src="./CREMS-LABS-Logo-No-Tagline-White.png"
              alt="CREMS Logo"
              className="img-fluid"
              style={{ width: '85%' }}
            />
          </span>
        </a>

        {/* Sidebar */}
        <div className="sidebar">

          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* <li className="nav-item border-menu-bottom ">
                <Link to="/UsaMap" className="nav-link d-flex align-items-center align-items-md-start">
                <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'UsaMap' : 'UsaMap'}</span>                </Link>
              </li> */}
              
              {/* Fact Book */}
              <li className="nav-item border-menu-bottom ">
                <Link to="/welcomePage" className="nav-link d-flex align-items-center align-items-md-start">
                  <span className=" text-white mt-1"> {isSidebarExpanded ?<span><span className="bi bi-book fs-4"></span> <span className="ml-2"> Welcome Page </span> </span>: <span><span className="d-md-block " >Welcome</span> <span className="d-md-block">Page</span> </span>} </span>
                </Link>
              </li>

              <li className="nav-item border-menu-bottom">
                <a
                  onClick={goToSearchByArea}
                  className="nav-link d-flex align-items-center align-items-md-start"
                  role="button"
                >
                  <span className="bi bi-globe-americas fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Market Intelligence' : 'Market'}</span>
                </a>
              </li>

              {/* Search By Name */}
              <li className="nav-item border-menu-bottom">
                <Link to="/SearchByAgent" className="nav-link d-flex align-items-center align-items-md-start">
                  <span className="bi fas bi-person-vcard fs-3"></span>
                  <span className="menu-label text-white mt-1"> {isSidebarExpanded ? 'Agent Intelligence' : 'Agent'} </span>
                </Link>
              </li>

              <li className="nav-item border-menu-bottom">            
                <a
                  onClick={goToTeamInvestigation}
                  className="nav-link d-flex align-items-center align-items-md-start"
                  role="button"
                >
                  <span className="bi bi-people fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Team Intelligence' : 'Team'}</span>
                </a>
              </li>

              <li className="nav-item border-menu-bottom">
                <Link to="/searchByOffice" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-buildings fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Office Intelligence' : 'Office '}</span>
                </Link>
              </li>
              {/* Area Report */}
              {/* <li className="nav-item border-menu-bottom">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSubmenu('areaReports');
                  }}
                  className="nav-link d-flex align-items-center align-items-md-start"
                  role="button"
                  aria-expanded={openSubmenus.areaReports}
                >
                  <span className="bi bi-globe-americas fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Area Report' : 'Area'}</span> */}
                  {/* {isSidebarExpanded && (
                    <i className={`bi ${openSubmenus.areaReports ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  )} */}
                {/* </a> */}
                
                {/* {isSidebarExpanded && openSubmenus.areaReports && (
                  <ul className="nav nav-pills nav-sidebar flex-column submenu">
                    <li className="nav-item">
                      <a
                        onClick={goToSearchByArea}
                        className="nav-link d-flex align-items-center align-items-md-start"
                        role="button"
                      >
                        <span className="menu-label text-white mt-1">Listings Analytics</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        onClick={goToSearchByAreaV2}
                        className="nav-link d-flex align-items-center align-items-md-start"
                        role="button"
                      >
                        <span className="menu-label text-white mt-1">Agents Analytics</span>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              

    
              
              

              {/* <li className="nav-item border-menu-bottom">
                <Link to="/SearchLoanOfficer" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-bank fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Loan Officer' : 'LO'}</span>
                </Link>
              </li> */}
              
              {/* <li className="nav-item border-menu-bottom">
                <Link to="/SearchTeam" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-people fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Team Report' : 'Team'}</span>
                </Link>
              </li> */}
              {/* <RenderOnRole requiredRoles={['admin']}>
              <li className="nav-item border-menu-bottom">
                <Link to="/searchTool" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-search fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Source Report' : 'Source'}</span>
                </Link>
              </li>
              </RenderOnRole>
              <RenderOnRole requiredRoles={['admin']}>
              <li className="nav-item border-menu-bottom">
                <Link to="/searchApiListing" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-download fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Listing API Report' : 'Listing API'}</span>
                </Link>
              </li>
              </RenderOnRole> */}
              <li className="nav-item border-menu-bottom">
                <a
                  //href="https://www.webedsystems.com/support"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation
                    triggerFeedback();
                  }}
                  className="nav-link d-flex align-items-center align-items-md-start"
                  role="button"
                >
                  <span className="bi bi-headset fs-3"></span>
                  <span className="menu-label text-white mt-1">Support</span>
                </a>
              </li>
              



            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default AppMenu;
