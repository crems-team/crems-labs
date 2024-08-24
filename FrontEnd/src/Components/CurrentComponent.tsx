import React from 'react';
import { useMatch } from 'react-router-dom';


interface CurrentComponentProps {
    type: string;
    
}

const CurrentComponent: React.FC<CurrentComponentProps> = ({ type}) => {
  const matchSearchByName = useMatch('/SearchByName');
  const matchagentProdReports = useMatch('/agentProdReports/:param');
  const matchsearchByOffice = useMatch('/searchByOffice');
  const matchSearchByArea = useMatch('/SearchByArea');

  let currentComponent;

  if (matchSearchByName) {
    currentComponent = 'Agent Production Reporting';
  } else if (matchagentProdReports) {
    currentComponent = 'Agent Production Reporting';
  } else if (matchsearchByOffice) {
    currentComponent = 'Office Production Reporting';
  }else if (matchSearchByArea) {
    currentComponent = 'Market Dynamics';
  } else {
    currentComponent = ' ';
  }

  return (
    <>
      {type === 'D' && (
        <ul id="DesktopTitle" className="navbar-nav mx-auto">
          <li className="nav-item">
            <span className="header-title">
              {currentComponent}
            </span>
          </li>
        </ul>
      )}
      
      {type === 'M' && (
 
            <span  >
              {currentComponent}
            </span>
       
      )}
    </>

  );
};

export default CurrentComponent;
