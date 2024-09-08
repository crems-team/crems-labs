import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../Redux/Store'; // Adjust the path to your store file

export const useAppDispatch: () => AppDispatch = useDispatch;
