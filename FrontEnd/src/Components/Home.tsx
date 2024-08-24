import { useKeycloak } from "@react-keycloak/web";




function Home() {

    const { keycloak, initialized } = useKeycloak();



  return (

    <div>
  <nav className=" navbar navbar-expand navbar-white navbar-light">
    <ul className="navbar-nav">
      <li className="nav-item">
        <img src="../CREMS-LABS-Logo-No-Tagline-Color-Logo.png" alt="CREMS Logo" className="img-fluid  " style={{width: '100%'}} />
      </li>
    </ul>
    <ul className="navbar-nav col-md-10 text-center mx-auto">
      <li className="nav-item mr-2">
        <a href="https://www.crems.net/#process" className="nav-link " style={{color: '#03263a'}}>&nbsp;&nbsp;&nbsp;Approach</a>
      </li>
      <li className="nav-item mr-2">
        <a href="https://www.crems.net/#services-1" className="nav-link " style={{color: '#03263a'}}>Services</a>
      </li>
      <li className="nav-item mr-2">
        <a href="https://www.crems.net/#partners" className="nav-link " style={{color: '#03263a'}}>Partners</a>
      </li>
      <li className="nav-item mr-2">
        <a href="https://www.crems.net/#about" className="nav-link " style={{color: '#03263a'}}>About</a>
      </li>
      <li className="nav-item mr-2">
        <a href="https://www.crems.net/#contact" className="nav-link " style={{color: '#03263a'}}>Contact</a>
      </li>
      <li className="nav-item mr-2">
        <a href="https://www.webedsystems.com/support" className="nav-link " style={{color: '#03263a'}}>Support</a>
      </li>
      <li className="nav-item mr-2">
        <a href="https://www.crems.net/" className="nav-link " style={{color: '#03263a'}}>CREMS Home Page</a>
      </li>
    </ul>
    <ul className="navbar-nav ml-auto">
      <div className="hover:text-gray-200">
      {!keycloak.authenticated && (
                            <button
                              type="button"
                              className="btn btn-primary mr-5"
                              onClick={() => keycloak.login({ redirectUri: `http://localhost:3001/SearchByName` })}

                            >
                                        Reports Login

                            </button>
                          )}
    
      </div>
    </ul>
  </nav>
  <div className=" mt-5 container">
    <div className="row justify-content-center">
      <h3 className="text-center" style={{color: '#00131e'}}>Good data leads you to good solutions.  Don’t guess… use CREMS-LABS to know!</h3>
    </div>
    <div className="row ml-1 mt-5   ">
      <div className="col-sm-3">
        <div className="card rounded shadow">
          <img className="card-img-top" src="./1_CREMS-LABS_Left_Box_Image.jpg" alt="Card image cap" style={{height: '11rem'}} />
          <div className="card-body">
            <p className="card-title " style={{color: '#03263a', height: '6rem'}}>We provide concierge business solutions to maximize profitability by leveraging opportunities.</p>
            <a href="https://www.crems.net/" style={{color: '#00131e', fontFamily: 'Arial', fontWeight: 'bold'}}>Learn More</a>
          </div>
        </div>
      </div>
      <div className="col-sm-3">
        <div className="card rounded shadow">
          <img className="card-img-top" src="./2_CREMS-LABS_Center-Left_Box_Image.jpg" alt="Card image cap" style={{height: '11rem'}} />
          <div className="card-body">
            <p className="card-title " style={{color: '#00131e', height: '6rem'}}>We provide clients with technical and professional advice based on years of experience.</p>
            <a href="https://www.crems.net/" style={{color: '#00131e', fontFamily: 'Arial', fontWeight: 'bold'}}>Learn More</a>
          </div>
        </div>
      </div>
      <div className="col-sm-3">
        <div className="card rounded shadow">
          <img className="card-img-top" src="./3_CREMS-LABS_Center-Right_Box_Image.jpg" alt="Card image cap" style={{height: '11rem'}} />
          <div className="card-body">
            <p className="card-title " style={{color: '#00131e', height: '6rem'}}>Industry wide relationships with Agents, Brokers, Title and Mortgage Companies, plus National Trade Groups.</p>
            <a href="https://www.crems.net/" style={{color: '#00131e', fontFamily: 'Arial', fontWeight: 'bold'}}>Meet Some</a>
          </div>
        </div>
      </div>         
      <div className="col-sm-3">
        <div className="card rounded shadow">
          <img className="card-img-top" src="./4_CREMS-LABS_Right_Box_Ron_Garber.jpg" alt="Card image cap" style={{height: '11rem'}} />
          <div className="card-body">
            <p className="card-title " style={{color: '#00131e', height: '6rem'}}>35+ years of real estate experience as both an agent, broker, and a consultant to Fortune 500 companies.</p>
            <a href="https://www.crems.net/" style={{color: '#00131e', fontFamily: 'Arial', fontWeight: 'bold'}}>Learn More</a>
          </div>
        </div>
      </div>
    </div>
    <div className="row mt-5 d-flex justify-content-center">
      <h2 className="text-center" style={{color: '#00131e', fontWeight: 'bold'}}>CORPORATE CONSULTING, TRAINING, &amp; ACCOUNTABILITY</h2>
      <h3 className="text-center" style={{color: '#03263a'}}>Data / Metrics Analysis</h3>
      <p className="text-left mt-5" style={{color: '#00131e'}}>
        CREMS Inc. leverages industry experience and data / metrics analysis to assist Real Estate organizations focus on the measurable activities necessary to increase lead generation, lead conversion and operational excellence. Real Estate Brokerage firms can provide proven training materials and methods for their agents. Real Estate Teams can provide innovative strategies to increase their internal businesses to run more efficient and cost effectively focusing on ROI. Ancillary Service Providers can provide education and training to provide an understanding of the value added services they bring to the Real Estate.</p>
      <div className=" mt-5 text-center">
        <img  src="./CREMS_Data_Graphs.jpg" alt="Card image cap" style={{width: '50rem'}} />
      </div>
    </div>
  </div>
  <footer className="bg-light py-4 mt-5">
    <div className="container justify-content-center">
      <nav className="navbar-nav navbar-expand">
        <ul className="navbar-nav d-flex justify-content-center flex-wrap mx-auto">
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/" className="nav-link" style={{color: '#03263a'}}>CREMS Home Page</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#process" className="nav-link" style={{color: '#00131e'}}>Approach</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#services-1" className="nav-link" style={{color: '#00131e'}}>Services</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#partners" className="nav-link" style={{color: '#00131e'}}>Partners</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#about" className="nav-link" style={{color: '#00131e'}}>About</a>
          </li>
          <li className="nav-item mr-3">
            <a href="https://www.crems.net/#contact" className="nav-link" style={{color: '#00131e'}}>Contact</a>
          </li>
          <li className="nav-item ">
            <a href="https://www.webedsystems.com/support" className="nav-link" style={{color: '#00131e'}}>Support</a>
          </li>
        </ul>
      </nav>
      <p className="text-center mt-4" style={{color: '#03263a'}}>
        © 2024 CONSOLIDATED REAL ESTATE MANAGEMENT STRATEGIES INC. <br />
        POWERED BY WEB-ED SYSTEMS
      </p>
    </div>
  </footer>
</div>

    

  );
};

export default Home;
