import React from 'react';


function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light border rounded  shadow mt-1">
      <div className="container">
        <a className="navbar-brand" href="#"><img id="cremsLogo" src="/CREMS-Logo-Horizontal_2.png" height="40"  alt="" /></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="col-md-6 text-center">
        <h6 className="h2">
          Agent Production Report
        </h6>
      </div>
        <div className=" collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto ">
            <li className="nav-item">
                <a className="nav-link text-dark" href="./" style={{fontSize: "1.2vw", color: "black", fontWeight: 400}}>Search By Names</a>
            </li>
            <li className="nav-item">
                <a className="nav-link text-dark" href="./" style={{fontSize: "1.2vw", color: "black", fontWeight: 400}}>Search By Names</a>
            </li>

           
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
