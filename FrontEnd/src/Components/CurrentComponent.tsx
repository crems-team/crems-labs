import React from 'react';
import { useMatch } from 'react-router-dom';


interface CurrentComponentProps {
    type: string;
    
}

const CurrentComponent: React.FC<CurrentComponentProps> = ({ type}) => {
  const matchSearchByName = useMatch('/SearchByAgent');
  const matchagentProdReports = useMatch('/agentProdReports/:param');
  const matchofficeProdReports = useMatch('/officeProdReports/:param');
  const matchsearchByOffice = useMatch('/searchByOffice');
  const matchSearchByArea = useMatch('/SearchByArea');
  const matchTeamInvestigator = useMatch('/TeamInvestigator/:param');
  const matchSearchTool = useMatch('/searchTool');
  const matchSearchLoanOfficer= useMatch('/SearchLoanOfficer');
  const matchloanOfficerProdReport= useMatch('/loanOfficerProdReport/:param');
  const matchsearchApiListing= useMatch('/searchApiListing');
  const matchFactBook= useMatch('/FactBook');

  


  let currentComponent;

  if (matchSearchByName) {
    currentComponent = 'Agent Production Reporting';
  } else if (matchagentProdReports) {
    currentComponent = 'Agent Production Reporting';
  }else if (matchofficeProdReports) {
    currentComponent = 'Office Production Reporting';
  } else if (matchsearchByOffice) {
    currentComponent = 'Office Production Reporting';
  }else if (matchSearchByArea) {
    currentComponent = 'Market Dynamics';
  }else if (matchTeamInvestigator) {
    currentComponent = 'Team Investigator';
  }else if (matchSearchTool) {
    currentComponent = 'Source Report';
  }else if (matchSearchLoanOfficer) {
    currentComponent = 'Loan Officer Production Reporting';
  }else if (matchloanOfficerProdReport) {
    currentComponent = 'Loan Officer Production Reporting';
  }else if (matchFactBook) {
    currentComponent = 'FACT BOOK Introduction';
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
 
            <span className="header-title custom-font-title-M" >
              {currentComponent}
            </span>
       
      )}
    </>

  );
};

export default CurrentComponent;
