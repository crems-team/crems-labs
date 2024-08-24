import React from 'react';



function Footer() {

  const version = getVersion();

  function getVersion() {
    let version;
  
    return version = '1.2.0';
  }

  return (
<div>
<div>
<footer className="bg-light py-4 mt-5">
      <div className="container text-center">
        <nav className="navbar-nav navbar-expand">
        <ul className="navbar-nav d-flex justify-content-center flex-wrap">
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>CREMS Home Page</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#process" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Approach</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#services-1" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Services</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#partners" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Partners</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#about" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>About</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#contact" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Contact</a>
          </li>
          <li className="nav-item ">
            <a href="https://www.webedsystems.com/support" className="nav-link" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>Support</a>
          </li>
        </ul>
        </nav>
        <p className="text-center mt-4" style={{ color: '#03263a', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
          © 2024 CONSOLIDATED REAL ESTATE MANAGEMENT STRATEGIES INC. <br />
          POWERED BY WEB-ED SYSTEMS
        </p>
        <div className="float-right d-none d-sm-inline-block ">
          <b>Version</b> {version}
        </div>
      </div>
    </footer>
</div>

  
      </div>
  );
};

export default Footer;
