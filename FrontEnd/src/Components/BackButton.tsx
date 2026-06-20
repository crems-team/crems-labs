import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { popBackTarget} from '../Redux/Slices/navigationSlice';
import { useAppDispatch } from '../Hooks/DispatchHook';


const BackButton = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const stack = useSelector((state: RootState) => state.navigation.stack);

  if (!stack.length) return null;

  const current = stack[stack.length - 1];

  const handleBack = () => {
    dispatch(popBackTarget());

    switch (current?.type) {
      case 'search_area':
        navigate('/SearchByAreaV2');
        break;

      case 'team_invest':
        navigate(`/teamInvestGraph/${current?.teamId}`);
        break;

      default:
        navigate(-1);
    }
  };

  return (
    <button onClick={handleBack}className="back-pill back-btn">
           <i className="bi bi-arrow-left icon"></i>
          <span className="label">Back</span>
        </button>
  );
};

export default BackButton;