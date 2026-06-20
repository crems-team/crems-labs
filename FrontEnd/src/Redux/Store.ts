import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './Slices/MapSlice';
import AreaAgentSlice from './Slices/AreaAgentSlice';
import TeamInvestigationSlice from './Slices/TeamInvestigationSlice';
import navigationSlice from './Slices/navigationSlice';



const store = configureStore({
  reducer: {
    map: mapReducer,
    areaAgent: AreaAgentSlice,
    TeamInvestigation: TeamInvestigationSlice,
    navigation: navigationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
