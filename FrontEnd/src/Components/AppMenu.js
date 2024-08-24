import React from 'react';
import { Link } from 'react-router-dom';


function AppMenu() {
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
        <i class="bi fas bi-person-vcard mr-1 fs-3"></i>
            <p>
            Search By Name
            </p>
            </Link>
        </li>

        <li className="nav-item">
        <Link to="/searchByOffice" className="nav-link">
          <i class="bi bi-buildings mr-1 fs-3"></i>
            <p>
            Search By Office
            </p>
            </Link>
        </li>

        <li className="nav-item">
        <Link to="/SearchByArea" className="nav-link">
          <i class="bi bi-globe-americas mr-1 fs-3"></i>
            <p>
            Search By Area
            </p>
            </Link>
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
