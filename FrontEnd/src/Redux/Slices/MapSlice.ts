
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from 'leaflet';
import GeoAreaService from "../../Services/GeoAreaService";
import SearchToolsService from "../../Services/Tools/SearchToolsService";
import Cities from "../../Models/Cities"
import Zip from "../../Models/Zip"
import States from "../../Models/States"
import Counties from "../../Models/Counties"
import { useAppDispatch } from '../../Hooks/DispatchHook';
import SelectedLocation from "../../Models/GeoAreaAgentProd/SelectedLocation"
import AgentGeoProdResult from "../../Models/GeoAreaAgentProd/AgentGeoProdResult"
import GeoAreaAgentProdService from "../../Services/GeoAreaAgentProdService";




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

interface MapState {
  error: string | null;
  markers: Marker[];
  transactions: any[];
  mapInstance: any | null;
  loadingTransactions: boolean;
  activityReportClicked: boolean;
  // totalTransactions: any[],
  totalAgents: any[],
  currentCitySaveSearch : Cities | null,
  currentZipSaveSearch : Zip[],
  currentstateSaveSearch : States | null,
  currentCountySaveSearch : Counties | null,
  selectedZipCodeSaveSearch : Zip[],
  nbrMonthSaveSearch : number,
  loadingMarkers: boolean;
  closePanel: boolean | null;
  totalTransactions: number;
  firstLoad: boolean; 
  fromSearchByArea: boolean; 
  searchSourceResult: any[];
  loadingSearchSourceResult: boolean;
  sankeyReportClicked: boolean;
  officeRankingLOClicked: boolean;
  loanOfficerByAgentClicked: boolean;
  idOfficeLO: string | null;
  idAgentLO: string | null;
  selectedLocation : SelectedLocation;
  AgentGeoProdResult : AgentGeoProdResult[];
  loadingAgentGeoProdResult: boolean;
  geoAreaAgentProdReportClicked: boolean;
  zipcodes: Zip[];
  
}



const initialState: MapState = {
  error: null,
  markers: [],
  transactions: [],
  mapInstance: null,
  loadingTransactions: false,
  activityReportClicked : true,
  // totalTransactions : [],
  totalAgents: [],
  currentCitySaveSearch : null,
  currentZipSaveSearch : [],
  currentstateSaveSearch :  null,
  currentCountySaveSearch : null,
  selectedZipCodeSaveSearch : [],
  nbrMonthSaveSearch : 3,
  loadingMarkers : true,
  closePanel : null,
  totalTransactions : 0,
  firstLoad: true,
  fromSearchByArea : false,
  searchSourceResult: [],
  loadingSearchSourceResult :false,
  sankeyReportClicked: true,
  officeRankingLOClicked: true,
  loanOfficerByAgentClicked: true,
  idOfficeLO: null,
  idAgentLO: null,
  selectedLocation : {state : '', stateCode: '',county:'', city:[], agentId:0, zip:[]},
  AgentGeoProdResult : [],
  geoAreaAgentProdReportClicked : true,
  loadingAgentGeoProdResult : false,
  zipcodes: [],


};

export const fetchTransactions = createAsyncThunk(
  'map/fetchTransactions',
  async ({ paramZip, nbrMonth }: { paramZip: string[], nbrMonth: number }, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI; // Access dispatch from thunkAPI

      const response = await GeoAreaService.fetchTransactions(dispatch,paramZip.join(','), nbrMonth);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchTotalTransactions = createAsyncThunk(
  'map/fetchTotalTransactions',
  async ({ paramZip, nbrMonth }: { paramZip: string[], nbrMonth: number }, thunkAPI) => {
    try {
      const response = await GeoAreaService.GetTotalTransactions(paramZip.join(','), nbrMonth);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTotalTransactionsListings = createAsyncThunk(
  'map/getTotalTransactionsListings',
  async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
    try {
      const response = await GeoAreaAgentProdService.getTotalTransactionsListings(selectedLocation);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTotalAgentsListings = createAsyncThunk(
  'map/getTotalAgentsListings',
  async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
    try {
      const response = await GeoAreaAgentProdService.getTotalAgentsListings(selectedLocation);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const fetchTotalAgents = createAsyncThunk(
  'map/fetchTotalAgents',
  async ({ paramZip, nbrMonth }: { paramZip: string[], nbrMonth: number }, thunkAPI) => {
    try {
      const response = await GeoAreaService.GetTotalAgents(paramZip.join(','), nbrMonth);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const handleSearchSource = createAsyncThunk(
  'map/handleSearchSource',
  async ({ agentId , office, address, city}: { agentId : string, office : string, address : string, city : string }, thunkAPI) => {
    try {
      var data = {
        agentId : agentId ? agentId : null,
        office  : office ? office : null,
        address : address? address : null,
        city    : city ? city : null
        };
      const response = await SearchToolsService.getSearchData(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAgentGeoProduction = createAsyncThunk(
  'map/getAgentGeoProduction',
  async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
    try {
      const response = await GeoAreaAgentProdService.getAgentGeoProduction(selectedLocation);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapInstance(state, action: PayloadAction<any | null>) {
      state.mapInstance = action.payload;
    },
    setMarkers(state, action: PayloadAction<Marker[]>) {
      state.markers = action.payload;
    },
    addMarker(state, action: PayloadAction<Marker>) {
      state.markers.push(action.payload);
    },
    setTransactions(state, action: PayloadAction<any[]>) {
      state.transactions = action.payload;
    },
    setSearchSourceResult(state, action: PayloadAction<any[]>) {
      state.searchSourceResult = action.payload;
    },
    zoomToLocation(state, action: PayloadAction<{ zoomLevel: number, center: [number, number] }>) {
      const { zoomLevel, center } = action.payload;
      if (state.mapInstance) {
        state.mapInstance.setView(center, zoomLevel);
      }
    },
    setActivityReportClicked(state, action: PayloadAction<boolean>) {
      state.activityReportClicked = action.payload;
    },
    // setTotalTransactions(state, action: PayloadAction<any[]>) {
    //   state.totalTransactions = action.payload;
    // },
    setTotalAgents(state, action: PayloadAction<any[]>) {
      state.totalAgents = action.payload;
    },
    setCurrentCitySaveSearch(state, action: PayloadAction<Cities | null>) {
      state.currentCitySaveSearch = action.payload;
    },
    setCurrentZipSaveSearch(state, action: PayloadAction<Zip[]>) {
      state.currentZipSaveSearch = action.payload;
    },
    setLoadingMarkers(state, action: PayloadAction<boolean>) {
      state.loadingMarkers = action.payload;
    },
    setCurrentstateSaveSearch(state, action: PayloadAction<States|null>) {
      state.currentstateSaveSearch = action.payload;
    },
    setCurrentCountySaveSearch(state, action: PayloadAction<Counties|null>) {
      state.currentCountySaveSearch = action.payload;
    },
    setSelectedZipCodeSaveSearch(state, action: PayloadAction<Zip[]>) {
      state.selectedZipCodeSaveSearch = action.payload;
    },
    setNbrMonthSaveSearch(state, action: PayloadAction<number>) {
      state.nbrMonthSaveSearch = action.payload;
    },
    setClosePanel(state, action: PayloadAction<boolean | null>) {
      state.closePanel = action.payload;
    },
    setTotalTransactions(state, action: PayloadAction<number>) {
      state.totalTransactions = action.payload;
    },
    setFirstLoad: (state, action: PayloadAction<boolean>) => { 
      state.firstLoad = action.payload;
    },
    setFromSearchByArea: (state, action: PayloadAction<boolean>) => { 
      state.fromSearchByArea = action.payload;
    },
    setSankeyReportClicked(state, action: PayloadAction<boolean>) {
      state.sankeyReportClicked = action.payload;
    },
    setOfficeRankingLOClicked(state, action: PayloadAction<boolean>) {
      state.officeRankingLOClicked = action.payload;
    },
    setLoanOfficerByAgentClicked(state, action: PayloadAction<boolean>) {
      state.loanOfficerByAgentClicked = action.payload;
    },
    setIdAgentLO(state, action: PayloadAction<string | null>) {
      state.idAgentLO = action.payload;
    },
    setIdOfficeLO(state, action: PayloadAction<string | null>) {
      state.idOfficeLO = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<Partial<SelectedLocation>>) => {
      state.selectedLocation = { 
        ...state.selectedLocation, 
        ...action.payload 
      };
    },
    setAgentGeoProdResult(state, action: PayloadAction<AgentGeoProdResult[]>) {
      state.AgentGeoProdResult = action.payload;
    },
    setGeoAreaAgentProdReportClicked(state, action: PayloadAction<boolean>) {
      state.geoAreaAgentProdReportClicked = action.payload;
    },
    //Zip codes for new area page
  
    //manage error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
  },
    resetMapState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loadingTransactions = true;
        state.closePanel = true;

      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loadingTransactions = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        console.error(action.payload);
        state.loadingTransactions = false;
      
      })
      // Handle fetchTotalTransactions
      // .addCase(fetchTotalTransactions.pending, (state) => {
      //   // state.loadingTransactions = true;
      // })
      // .addCase(fetchTotalTransactions.fulfilled, (state, action) => {
      //   state.totalTransactions = action.payload;
      //   // state.loadingTransactions = false;
      // })
      // .addCase(fetchTotalTransactions.rejected, (state, action) => {
      //   console.error(action.payload);
      //   // state.loadingTransactions = false;
      // })
      // Handle fetchTotalAgents
      .addCase(fetchTotalAgents.pending, (state) => {
        // state.loadingTransactions = true;
      })
      .addCase(fetchTotalAgents.fulfilled, (state, action) => {
        state.totalAgents = action.payload;
        // state.loadingTransactions = false;
      })
      .addCase(fetchTotalAgents.rejected, (state, action) => {
        console.error(action.payload);
        // state.loadingTransactions = false;
      })
      .addCase(handleSearchSource.pending, (state) => {
        state.loadingSearchSourceResult = true;

      })
      .addCase(handleSearchSource.fulfilled, (state, action) => {
        state.searchSourceResult = action.payload;
        state.loadingSearchSourceResult = false;
      })
      .addCase(handleSearchSource.rejected, (state, action) => {
        console.error(action.payload);
        state.loadingSearchSourceResult = false;
      
      })
      //Area Geo Agent Prod
      .addCase(getAgentGeoProduction.pending, (state) => {
        state.loadingAgentGeoProdResult = true;
      })
      .addCase(getAgentGeoProduction.fulfilled, (state, action) => {
        state.AgentGeoProdResult = action.payload;
        state.loadingAgentGeoProdResult = false;
      })
      .addCase(getAgentGeoProduction.rejected, (state, action) => {
        console.error(action.payload);
        state.loadingAgentGeoProdResult = false;
      
      })
      //Area V2
      .addCase(getTotalAgentsListings.fulfilled, (state, action) => {
        state.totalAgents = action.payload;
        // state.loadingTransactions = false;
      })
      .addCase(getTotalAgentsListings.rejected, (state, action) => {
        console.error(action.payload);
        // state.loadingTransactions = false;
      })
      .addCase(getTotalTransactionsListings.fulfilled, (state, action) => {
        state.totalTransactions = action.payload;
        // state.loadingTransactions = false;
      })
      .addCase(getTotalTransactionsListings.rejected, (state, action) => {
        console.error(action.payload);
        // state.loadingTransactions = false;
      });
      
  },
});

export const {
  setMapInstance,
  setMarkers,
  addMarker,
  setTransactions,
  zoomToLocation,
  setActivityReportClicked,
  setTotalTransactions,
  setTotalAgents,
  setCurrentCitySaveSearch,
  setCurrentZipSaveSearch,
  setLoadingMarkers,
  setCurrentstateSaveSearch,
  setCurrentCountySaveSearch,
  setSelectedZipCodeSaveSearch,
  setNbrMonthSaveSearch,
  setClosePanel,
  setFirstLoad,
  resetMapState,
  setFromSearchByArea,
  setSearchSourceResult,
  setSankeyReportClicked,
  setOfficeRankingLOClicked,
  setLoanOfficerByAgentClicked,
  setIdAgentLO,
  setIdOfficeLO,
  setSelectedLocation,
  setAgentGeoProdResult,
  setGeoAreaAgentProdReportClicked,
  setError,
  
} = mapSlice.actions;

export default mapSlice.reducer;
