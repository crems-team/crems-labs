import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../Redux/Store'; 

export const useAppDispatch: () => AppDispatch = useDispatch;
