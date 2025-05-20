import {useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';

const BackButtonToArea = () => {
  const navigate = useNavigate();

  const showBackButton = useSelector((state: RootState) => state.map.fromSearchByArea);

 

  const redirectToSearchArea = () => {
  
    navigate('/SearchByAreaV2',{ state: { fromReportPage: true } });
  };

  return (
    <>
      {showBackButton && (
        <button onClick={redirectToSearchArea}className="btn btn-success mb-2">
          Back to Search by Area
        </button>
      )}
    </>
  );
};

export default BackButtonToArea;
