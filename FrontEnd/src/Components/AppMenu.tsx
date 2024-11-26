import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { resetMapState} from '../Redux/Slices/MapSlice';
import { useSearch } from '../Components/Context/Context';



function AppMenu() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {setCollapsed} = useSearch();



  const goToSearchByArea = () => {
    dispatch(resetMapState());
    setCollapsed(true);
    navigate('/SearchByArea');
  };
  return (
<div>
<aside className="main-sidebar sidebar-dark-primary elevation-4 ">
  {/* Brand Logo */}
  <a href="/" className="brand-link bg-grey">
    <span className="text-center ">
    <img src="./CREMS-LABS-Logo-No-Tagline-White.png" alt="CREMS Logo" className="img-fluid  "style={{width: '85%'}} />
    </span>
    <span className="  ml-1 "> </span>
  </a>
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    
    {/* SidebarSearch Form 
    <div className="form-inline">
      <div className="input-group" data-widget="sidebar-search">
        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
          <button className="btn btn-sidebar">
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div>*/}
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
      
        <li className="nav-item">
        <Link to="/SearchByName" className="nav-link">
        <i className="bi fas bi-person-vcard mr-1 fs-3"></i>
            <p>
            Search By Name
            </p>
            </Link>
        </li>

        <li className="nav-item">
        <Link to="/searchByOffice" className="nav-link">
          <i className="bi bi-buildings mr-1 fs-3"></i>
            <p>
            Search By Office
            </p>
            </Link>
        </li>

        <li className="nav-item">
        <a onClick={goToSearchByArea} className="nav-link" role="button">
          <i className="bi bi-globe-americas mr-1 fs-3"></i>
            <p>
            Search By Area
            </p>
            </a>
        </li>
        
      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

      </div>
  );
};

export default AppMenu;
