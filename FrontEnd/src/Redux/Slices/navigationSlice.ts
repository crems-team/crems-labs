
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';




type BackTarget =
  | { type: 'search_area' }
  | { type: 'team_invest'; teamId: string }
  | null;



interface NavigationState {
    stack: BackTarget[];

}


const initialState: NavigationState = {
  stack: []
};





const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    pushBackTarget: (state, action: PayloadAction<BackTarget>) => {
      state.stack.push(action.payload);
    },
    popBackTarget: (state) => {
      state.stack.pop();
    },
    clearStack: (state) => {
      state.stack = [];
    }
  }
});

export const { pushBackTarget, popBackTarget, clearStack} = navigationSlice.actions;


export default navigationSlice.reducer;