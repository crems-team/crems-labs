import {useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { useSearch } from '../Components/Context/Context';

const BackButtonToArea = () => {
  const navigate = useNavigate();

  const showBackButton = useSelector((state: RootState) => state.map.fromSearchByArea);

 

  const redirectToSearchArea = () => {
  
    navigate('/SearchByArea',{ state: { fromReportPage: true } });
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
