import React,{useEffect,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { resetMapState } from '../Redux/Slices/MapSlice';
import { useSearch } from '../Components/Context/Context';
import RenderOnRole from '../Helpers/RenderOnRole';

function AppMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setCollapsed } = useSearch();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const goToSearchByArea = () => {
    dispatch(resetMapState());
    setCollapsed(true);
    navigate('/SearchByArea');
  };

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
              {/* Search By Name */}
              <li className="nav-item border-menu-bottom">
                <Link to="/SearchByAgent" className="nav-link d-flex align-items-center align-items-md-start">
                  <span className="bi fas bi-person-vcard fs-3"></span>
                  <span className="menu-label text-white mt-1"> {isSidebarExpanded ? 'Agent Report' : 'Agent'} </span>
                </Link>
              </li>

              <li className="nav-item border-menu-bottom">
                <Link to="/searchByOffice" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-buildings fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Office Report' : 'Office'}</span>
                </Link>
              </li>

              <li className="nav-item border-menu-bottom">
                <a
                  onClick={goToSearchByArea}
                  className="nav-link d-flex align-items-center align-items-md-start"
                  role="button"
                >
                  <span className="bi bi-globe-americas fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Area Report' : 'Area'}</span>
                </a>
              </li>
              <RenderOnRole requiredRoles={['admin']}>
              <li className="nav-item border-menu-bottom">
                <Link to="/searchTool" className="nav-link d-flex  align-items-center align-items-md-start">
                  <span className="bi bi-search fs-3"></span>
                  <span className="menu-label text-white mt-1">{isSidebarExpanded ? 'Source Report' : 'Source'}</span>
                </Link>
              </li>
              </RenderOnRole>
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
