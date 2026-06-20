import {useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';

const BackButtonToArea = () => {
  const navigate = useNavigate();

  const showBackButton = useSelector((state: RootState) => state.map.fromSearchByArea);
  const showBackButtonToTeamInvest = useSelector((state: RootState) => state.TeamInvestigation.fromTeamInvestigation);
  const lastTeamId = useSelector((state: RootState) => state.TeamInvestigation.lastTeamId);


 

  const redirectToSearchArea = () => {
  
    navigate('/SearchByAreaV2',{ state: { fromReportPage: true } });
  };
  
  const redirectToTeamInvest = () => {
  
    if (lastTeamId) {
      navigate(`/teamInvestGraph/${lastTeamId}`);
    }
  };

  return (
    <>
      {showBackButton && (
        <button onClick={redirectToSearchArea}className="back-pill back-btn">
           <i className="bi bi-arrow-left icon"></i>
          <span className="label">Back</span>
        </button>
      )}
      {showBackButtonToTeamInvest && (
        <button onClick={redirectToTeamInvest}className="btn btn-success mb-2">
          Back to Team Investigation
        </button>
      )}
    </>
  );
};

export default BackButtonToArea;
