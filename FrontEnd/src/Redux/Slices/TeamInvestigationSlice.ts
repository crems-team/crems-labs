
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { OrgNode, OrgNodeType } from "../../types/org.types";
import TeamService from "../../Services/TeamService";



export type TierKey = "T0" | "T1" | "T2" | "T3" | "T4";

export type FilterCriteria = {
  office: boolean;
  officeName: string;
  currentTab: string; // '0', '1', ...
  tiers: Record<TierKey, boolean> & { hideAdmin: boolean };
};


interface TeamInvestigationState {
  selectedTabIndex : number;
  data : OrgNode[];
  isLoading : boolean;
  filterCriteria: FilterCriteria;
  fromTeamInvestigation: boolean;
  lastTeamId: string | null;
}



const initialState: TeamInvestigationState = {
    selectedTabIndex: 0,
    data : [],
    isLoading : false,
    filterCriteria: {
    office: false,
    officeName: "",
    currentTab: "0",
    tiers: {
      T0: false,
      T1: false,
      T2: false,
      T3: false,
      T4: false,
      hideAdmin: false,
    },
  },
  fromTeamInvestigation : false,
  lastTeamId:   null,

};

export const getOrgNodesByTeamKey = createAsyncThunk(
  'teamInvestigation/getOrgNodesByTeamKey',
  async ({ teamKey }: { teamKey: string}, thunkAPI) => {
    try {
      const response = await TeamService.getOrgNodesByTeamKey({name :teamKey});
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



const TeamInvestigationSlice = createSlice({
  name: 'teamInvestigation',
  initialState,
  reducers: {
    setSelectedTabIndex(state, action: PayloadAction<number>) {
        state.selectedTabIndex = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
        state.isLoading = action.payload;
    },
    setFilterCriteria(state, action: PayloadAction<FilterCriteria>) {
      state.filterCriteria = action.payload;
    },
    setOffice(state, action: PayloadAction<boolean>) {
      state.filterCriteria.office = action.payload;
    },
    setTier(state, action: PayloadAction<{ key: TierKey; value: boolean }>) {
      state.filterCriteria.tiers[action.payload.key] = action.payload.value;
    },
     setFromTeamInvestigation: (state, action: PayloadAction<boolean>) => { 
      state.fromTeamInvestigation = action.payload;
    },
    setLastTeamId(state, action: PayloadAction<string>) {
      state.lastTeamId = action.payload;
    },
    
    resetTeamInvestigationState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrgNodesByTeamKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrgNodesByTeamKey.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrgNodesByTeamKey.rejected, (state, action) => {
        console.error(action.payload);
        state.isLoading = false;
      
      });
    
      
  },
});

export const {
    setSelectedTabIndex,
    setIsLoading,
    setFilterCriteria,
    setOffice,
    setTier,
    setFromTeamInvestigation,
    resetTeamInvestigationState,
    setLastTeamId,
  
} = TeamInvestigationSlice.actions;

export default TeamInvestigationSlice.reducer;
