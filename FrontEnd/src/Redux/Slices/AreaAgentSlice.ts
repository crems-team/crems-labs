
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from 'leaflet';
import GeoAreaService from "../../Services/GeoAreaService";
import SearchToolsService from "../../Services/Tools/SearchToolsService";
import Cities from "../../Models/Cities"
import Zip from "../../Models/Zip"
import States from "../../Models/States"
import Counties from "../../Models/Counties"
import { useAppDispatch } from '../../Hooks/DispatchHook';
import SelectedLocation from "../../Models/GeoAreaAgentProd/SelectedLocation";
import AgentGeoProdResult from "../../Models/GeoAreaAgentProd/AgentGeoProdResult";
import TeamGeoProdResult from "../../Models/GeoAreaAgentProd/TeamGeoProdResult"
import GeoAreaAgentProdService from "../../Services/GeoAreaAgentProdService";
import { MapLevel } from '../../Models/UsaMapType';
import SearchItemArea from "../../Models/SearchItemHistory";
import TeamInvestigationAgents from "../../Models/TeamInvestigation/TeamInvestigationAgents";
import { DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';


interface Marker {
  position: [number, number];
  zip: string;
  street: string;
  nbrlist: string;
  nbragt: string;
  icon: Icon | null;
}
interface LocationState {
  state: string;
  stateCode: string;
  county: string;
  city: string[];
  agentId: number;
}

type SearchMode = 'county' | 'city' | 'zip';

interface AreaAgentState {
  totalAgent: number;
  totalAgentLoading: boolean;
  agentGeoProdResultExtract: AgentGeoProdResult[];
  extractionLoading: boolean;
  totalTransactionAgent: number;
  totalTransactionAgentLoading: boolean;
  totalListingsAgent: number;
  totalListingsAgentLoading: boolean;
  mapLevel: MapLevel;
  cities: Cities[];
  copyCities: Cities[];
  selectedTabIndex: number;
  selectedOption:string; 
  selectedZipCode:Zip[];
  zipcodes: Zip[];
  listingsGeoProduction: any[];
  listingsGeoLoading: boolean;
  totalAgentForListing: number;
  totalAgentForListingLoading: boolean;
  totalTransactionForListings: number;
  totalTransactionForListingsLoading: boolean;
  searchHistory: SearchItemArea[];
  originalData: any[] ;
  displayedData: any[] ;
  teamGeoProdResult: TeamGeoProdResult[];
  teamGeoProdResultLoading: boolean;
  teamAgentList: TeamInvestigationAgents[];
  teamAgentListLoading: boolean;
  searchHistoryTeam: SearchItemArea[];
  areaModeDisplay : string;
  selectedTeam: TeamGeoProdResult | null;
  teamFilters: DataTableFilterMeta;
  agentFilters: DataTableFilterMeta;
  isLoadingCities : boolean;
  selectedItem : any;
  query : string;
  mode : SearchMode;
  searchTermListing : string;
  isFiltered : boolean;
  inputValue : string;
  allCities  : boolean;
  allZipCodes: boolean;
  accordionIndex: number;
  


  
}



const initialState: AreaAgentState = {
    totalAgent: 0,
    totalAgentLoading : false,
    agentGeoProdResultExtract: [],
    extractionLoading: false,
    totalTransactionAgent: 0,
    totalTransactionAgentLoading : false,
    totalListingsAgent: 0,
    totalListingsAgentLoading: false,
    mapLevel: {level: 'country', selectedState: "", selectedCounty: ""},
    cities:[],
    copyCities:[],
    selectedTabIndex:-1,
    selectedOption: 'cities',
    selectedZipCode:[],
    zipcodes: [],
    listingsGeoProduction: [],
    listingsGeoLoading: false,
    totalAgentForListing: 0,
    totalAgentForListingLoading: false,
    totalTransactionForListings: 0,
    totalTransactionForListingsLoading: false,
    searchHistory: [],
    originalData: [] ,
    displayedData:[] ,
    teamGeoProdResult : [],
    teamGeoProdResultLoading : false,
    teamAgentList : [],
    teamAgentListLoading : false, 
    searchHistoryTeam : [],
    areaModeDisplay : 'team',
    selectedTeam : null,
    teamFilters: {
                    teamName: { value: '', matchMode: FilterMatchMode.CONTAINS }
                 },
    agentFilters: {
                    name: { value: '', matchMode: FilterMatchMode.CONTAINS }
                  },
    isLoadingCities : false,
    selectedItem : null,
    query : '',
    mode : 'county',
    searchTermListing : '',
    isFiltered : false,
    inputValue : '',
    allCities  : false,
    allZipCodes: false,
    accordionIndex: 0,
};

export const getTotalAgents = createAsyncThunk(
  'map/getTotalAgents',
  async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
    try {
      const response = await GeoAreaAgentProdService.getNumberOfAgent(selectedLocation);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAgentGeoProductionForExtraction = createAsyncThunk(
    'map/getAgentGeoProductionForExtraction',
    async (selectedLocation: SelectedLocation, thunkAPI) => {
        try {
        const response = await GeoAreaAgentProdService.getAgentGeoProductionForExtraction(selectedLocation);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getTotalTransactionAgent = createAsyncThunk(
    'map/getTotalTransactionAgent',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getTotalTransactionAgent(selectedLocation);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getTotalListingsAgent = createAsyncThunk(
    'map/getTotalListingsAgent',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getTotalListingsAgent(selectedLocation);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getZipCodesByCity = createAsyncThunk(
    'map/getZipCodesByCity',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        console.log(selectedLocation);
        const response = await GeoAreaAgentProdService.getZipsbyCityName(selectedLocation);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getListingsGeoProduction = createAsyncThunk(
    'map/getListingsGeoProduction',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const { dispatch } = thunkAPI; // Access dispatch from thunkAPI
  
        const response = await GeoAreaAgentProdService.getListingsGeoProduction(dispatch,selectedLocation);
        return response;
      }  catch (e: any) {

      let errorMessage = "Internal server error";
      const status = e?.response?.status;

      if (status === 404) {
        errorMessage = "No data available.";
      } else if (status === 400) {
        errorMessage = "Invalid request.";
      } else if (status === 401 || status === 403) {
        errorMessage = "Unauthorized access.";
      } else if (status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.message) {
        errorMessage = e.message;
      }

      return thunkAPI.rejectWithValue({
        status,
        message: errorMessage
      });
    }
    }
  );

  export const getTotalAgentForListing = createAsyncThunk(
    'map/getTotalAgentForListing',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getTotalAgentForListing(selectedLocation);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getTotalTransactionForListings = createAsyncThunk(
    'map/getTotalTransactionForListings',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getTotalTransactionForListings(selectedLocation);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getTeamGeoProduction = createAsyncThunk(
    'map/getTeamGeoProduction',
    async (selectedLocation: SelectedLocation, thunkAPI) => {
        try {
          const { dispatch } = thunkAPI;
          dispatch(setAreaModeDisplay('team'));
          const response = await GeoAreaAgentProdService.getTeamGeoProduction(selectedLocation);
          return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getAgentTeamTable = createAsyncThunk(
    'map/getAgentTeamTable',
  async ({ teamId }: { teamId: number}, thunkAPI) => {
        try {
        const response = await GeoAreaAgentProdService.getAgentTeamTable({teamId});
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

const areaAgentSlice = createSlice({
  name: 'areaAgent',
  initialState,
  reducers: {
    setMapLevel(state, action: PayloadAction<MapLevel>) {
        state.mapLevel = action.payload;
    },
    setCities(state, action: PayloadAction<Cities[]>) {
        state.cities = action.payload;
    },
    setCopyCities(state, action: PayloadAction<Cities[]>) {
        state.copyCities = action.payload;
    },
    setSelectedTabIndex(state, action: PayloadAction<number>) {
        state.selectedTabIndex = action.payload;
    },
    setTotalAgent(state, action: PayloadAction<number>) {
      state.totalAgent = action.payload;
    },
    setTotalTransactionsAg(state, action: PayloadAction<number>) {
      state.totalTransactionAgent = action.payload;
    },
    setTotalListingsAgent(state, action: PayloadAction<number>) {
      state.totalListingsAgent = action.payload;
    },
    setSelectedOption(state, action: PayloadAction<string>) {
      state.selectedOption = action.payload;
    },
    setSelectedZipCode(state, action: PayloadAction<Zip[]>) {
      state.selectedZipCode = action.payload;
    },
    setZipCodes(state, action: PayloadAction<Zip[]>) {
      state.zipcodes = action.payload;
    },
    setListingsGeoProduction(state, action: PayloadAction<any[]>) {
      state.listingsGeoProduction = action.payload;
    },
    setTotalAgentForListing(state, action: PayloadAction<number>) {
      state.totalAgentForListing = action.payload;
    },
    setTotalTransactionForListings(state, action: PayloadAction<number>) {
      state.totalTransactionForListings = action.payload;
    },
    setSearchHistory(state, action: PayloadAction<SearchItemArea[]>) {
      state.searchHistory = action.payload;
    },
    setSearchHistoryTeam(state, action: PayloadAction<SearchItemArea[]>) {
      state.searchHistoryTeam = action.payload;
    },
    setOriginalData(state, action: PayloadAction<any[]>) {
      state.originalData = action.payload;
    },
    setDisplayedData(state, action: PayloadAction<any[]>) {
      state.displayedData = action.payload;
    },
    setAreaModeDisplay(state, action: PayloadAction<string>) {
      state.areaModeDisplay = action.payload;
    },
    setSelectedTeam(state, action: PayloadAction<TeamGeoProdResult>) {
      state.selectedTeam = action.payload;
    },
    setTeamFilters(state, action) {
        state.teamFilters = action.payload;
    },
    setAgentFilters(state, action) {
        state.agentFilters = action.payload;
    },
    setIsLoadingCities(state, action) {
        state.isLoadingCities = action.payload;
    },
    setSelectedItem(state, action) {
        state.selectedItem = action.payload;
    },
    setQuery(state, action) {
        state.query = action.payload;
    },
    setMode(state, action) {
        state.mode = action.payload;
    },
    setSearchTermListing(state, action) {
        state.searchTermListing = action.payload;
    },
    setIsFiltered(state, action) {
        state.isFiltered = action.payload;
    },
    setInputValue(state, action) {
        state.inputValue = action.payload;
    },
    setAllCities(state, action) {
        state.allCities = action.payload;
    },
    setAllZipCodes(state, action) {
        state.allZipCodes = action.payload;
    },
    setAccordionIndex: (state, action) => {
        state.accordionIndex = action.payload;
    },

    resetAreaAgentState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTotalAgents.pending, (state) => {
        state.totalAgentLoading = true;
      })
      .addCase(getTotalAgents.fulfilled, (state, action) => {
        state.totalAgent = action.payload;
        state.totalAgentLoading = false;
      })
      .addCase(getTotalAgents.rejected, (state, action) => {
        console.error(action.payload);
        state.totalAgentLoading = false;
      
      })
      .addCase(getAgentGeoProductionForExtraction.pending, (state) => {
            state.extractionLoading = true;
        })
      .addCase(getAgentGeoProductionForExtraction.fulfilled, (state, action) => {
            state.agentGeoProdResultExtract = action.payload;
            state.extractionLoading = false;
        })
      .addCase(getAgentGeoProductionForExtraction.rejected, (state, action) => {
            console.error(action.payload);
            state.extractionLoading = false;
        
        })
        .addCase(getTotalTransactionAgent.pending, (state) => {
          state.totalTransactionAgentLoading = true;
        })
        .addCase(getTotalTransactionAgent.fulfilled, (state, action) => {
            state.totalTransactionAgent = action.payload;
            state.totalTransactionAgentLoading = false;
        })
        .addCase(getTotalTransactionAgent.rejected, (state, action) => {
        console.error(action.payload);
        state.totalTransactionAgentLoading = false;
        
        })
        .addCase(getTotalListingsAgent.pending, (state) => {
          state.totalListingsAgentLoading = true;
        })
        .addCase(getTotalListingsAgent.fulfilled, (state, action) => {
          state.totalListingsAgent = action.payload;
          state.totalListingsAgentLoading = false;
        })
        .addCase(getTotalListingsAgent.rejected, (state, action) => {
        console.error(action.payload);
        state.totalListingsAgentLoading = false;
        
        }).addCase(getZipCodesByCity.fulfilled, (state, action) => {
          state.zipcodes = action.payload;
        })
        .addCase(getZipCodesByCity.rejected, (state, action) => {
        console.error(action.payload);
        
        })
        .addCase(getListingsGeoProduction.pending, (state) => {
          state.listingsGeoLoading = true;
      })
      .addCase(getListingsGeoProduction.fulfilled, (state, action) => {
        console.log(action.payload);
            state.listingsGeoProduction = action.payload;
            state.listingsGeoLoading = false;

        })
      .addCase(getListingsGeoProduction.rejected, (state, action) => {
            console.error(action.payload);
            state.listingsGeoLoading = false;
        
        })
        .addCase(getTotalAgentForListing.pending, (state) => {
          state.totalAgentForListingLoading = true;
        })
        .addCase(getTotalAgentForListing.fulfilled, (state, action) => {
          state.totalAgentForListing = action.payload;
          state.totalAgentForListingLoading = false;
        })
        .addCase(getTotalAgentForListing.rejected, (state, action) => {
          console.error(action.payload);
          state.totalAgentForListingLoading = false;
        
        })
        .addCase(getTotalTransactionForListings.pending, (state) => {
          state.totalTransactionForListingsLoading = true;
        })
        .addCase(getTotalTransactionForListings.fulfilled, (state, action) => {
          state.totalTransactionForListings = action.payload;
          state.totalTransactionForListingsLoading = false;
        })
        .addCase(getTotalTransactionForListings.rejected, (state, action) => {
          console.error(action.payload);
          state.totalTransactionForListingsLoading = false;
        
        })
        .addCase(getTeamGeoProduction.pending, (state) => {
            state.teamGeoProdResultLoading = true;
        })
      .addCase(getTeamGeoProduction.fulfilled, (state, action) => {
            state.teamGeoProdResult = action.payload;
            state.teamGeoProdResultLoading = false;
        })
      .addCase(getTeamGeoProduction.rejected, (state, action) => {
            console.error(action.payload);
            state.teamGeoProdResultLoading = false;
        
        })
        .addCase(getAgentTeamTable.pending, (state) => {
            state.teamAgentListLoading = true;
        })
      .addCase(getAgentTeamTable.fulfilled, (state, action) => {
            state.teamAgentList = action.payload;
            state.teamAgentListLoading = false;
        })
      .addCase(getAgentTeamTable.rejected, (state, action) => {
            console.error(action.payload);
            state.teamAgentListLoading = false;
        
        });
    
      
  },
});

export const {
    setMapLevel,
    setCopyCities,
    setCities,
    setSelectedTabIndex,
    setTotalAgent,
    setTotalTransactionsAg,
    resetAreaAgentState,
    setTotalListingsAgent,
    setSelectedOption,
    setSelectedZipCode,
    setZipCodes,
    setListingsGeoProduction,
    setTotalAgentForListing,
    setTotalTransactionForListings,
    setSearchHistory,
    setOriginalData,
    setDisplayedData,
    setSearchHistoryTeam,
    setAreaModeDisplay,
    setSelectedTeam,
    setTeamFilters, 
    setAgentFilters,
    setIsLoadingCities,
    setSelectedItem,
    setQuery,
    setMode,
    setSearchTermListing,
    setIsFiltered,
    setInputValue,
    setAllCities,
    setAllZipCodes,
    setAccordionIndex
  
} = areaAgentSlice.actions;

export default areaAgentSlice.reducer;
