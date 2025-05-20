import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './Slices/MapSlice';
import AreaAgentSlice from './Slices/AreaAgentSlice';


const store = configureStore({
  reducer: {
    map: mapReducer,
    areaAgent: AreaAgentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
