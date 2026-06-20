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
  const matchSearchByArea = useMatch('/SearchByAreaV2');
  const matchTeamInvestigator = useMatch('/TeamInvestigator/:param');
  const matchSearchTool = useMatch('/searchTool');
  const matchSearchLoanOfficer= useMatch('/SearchLoanOfficer');
  const matchloanOfficerProdReport= useMatch('/loanOfficerProdReport/:param');
  const matchsearchApiListing= useMatch('/searchApiListing');
  const welcomePage= useMatch('/welcomePage');
  const matchTeamGraph = useMatch('/teamGraph/:param');
  const matchTeam = useMatch('/SearchTeam');
  const matchSearchTeamInvest = useMatch('/SearchTeamInvest');
  const matchteamInvestGraph = useMatch('/teamInvestGraph/:param');


  


  let currentComponent;

  if (matchSearchByName) {
    currentComponent = 'Agent Intelligence';
  } else if (matchagentProdReports) {
    currentComponent = 'Agent Intelligence';
  }else if (matchofficeProdReports) {
    currentComponent = 'Office Production Reporting';
  } else if (matchsearchByOffice) {
    currentComponent = 'Office Production Reporting';
  }else if (matchSearchByArea) {
    currentComponent = 'Market Intelligence';
  }else if (matchTeamInvestigator) {
    currentComponent = 'Interaction Report';
  }else if (matchSearchTool) {
    currentComponent = 'Source Report';
  }else if (matchSearchLoanOfficer) {
    currentComponent = 'Loan Officer Production Reporting';
  }else if (matchloanOfficerProdReport) {
    currentComponent = 'Loan Officer Production Reporting';
  }
  // else if (welcomePage) {
  //   currentComponent = 'CREMS IQ';
  // }
  else if (matchTeamGraph||matchTeam) {
  currentComponent = 'Team Investigator';
  }else if (matchSearchTeamInvest||matchteamInvestGraph) {
  currentComponent = 'Team Intelligence';
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
