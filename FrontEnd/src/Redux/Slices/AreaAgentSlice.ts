
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
import { MapLevel } from '../../Models/UsaMapType';




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

interface AreaAgentState {
  totalAgent: number;
  agentGeoProdResultExtract: AgentGeoProdResult[];
  extractionLoading: boolean;
  totalTransaction: number;
  totalListings: number;
  mapLevel: MapLevel;
  cities: Cities[];
  copyCities: Cities[];
  selectedTabIndex: number;
  selectedOption:string; 
  selectedZipCode:Zip[];
  zipcodes: Zip[];
  listingsGeoProduction: any[];
  listingsGeoLoading: boolean;
  
  

  
}



const initialState: AreaAgentState = {
    totalAgent: 0,
    agentGeoProdResultExtract: [],
    extractionLoading: false,
    totalTransaction: 0,
    totalListings: 0,
    mapLevel: {level: 'country', selectedState: "", selectedCounty: ""},
    cities:[],
    copyCities:[],
    selectedTabIndex:-1,
    selectedOption: 'cities',
    selectedZipCode:[],
    zipcodes: [],
    listingsGeoProduction: [],
    listingsGeoLoading: false,






};

export const getTotalAgents = createAsyncThunk(
  'map/getTotalAgents',
  async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
    try {
      const response = await GeoAreaAgentProdService.getNumberOfAgent(selectedLocation);
      return response.data;
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
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getTotalTransaction = createAsyncThunk(
    'map/getTotalTransaction',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getTotalTransaction(selectedLocation);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getTotalListings = createAsyncThunk(
    'map/getTotalListings',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getTotalListings(selectedLocation);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getZipCodesByCity = createAsyncThunk(
    'map/getZipCodesByCity',
    async ({ selectedLocation }: { selectedLocation: SelectedLocation}, thunkAPI) => {
      try {
        const response = await GeoAreaAgentProdService.getZipsbyCityName(selectedLocation);
        return response.data;
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
      state.totalTransaction = action.payload;
    },
    setTotalListings(state, action: PayloadAction<number>) {
      state.totalListings = action.payload;
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
    
    resetAreaAgentState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTotalAgents.fulfilled, (state, action) => {
        state.totalAgent = action.payload;
      })
      .addCase(getTotalAgents.rejected, (state, action) => {
        console.error(action.payload);
      
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
        .addCase(getTotalTransaction.fulfilled, (state, action) => {
            state.totalTransaction = action.payload;
        })
        .addCase(getTotalTransaction.rejected, (state, action) => {
        console.error(action.payload);
        
        })
        .addCase(getTotalListings.fulfilled, (state, action) => {
          state.totalListings = action.payload;
        })
        .addCase(getTotalListings.rejected, (state, action) => {
        console.error(action.payload);
        
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
    setTotalListings,
    setSelectedOption,
    setSelectedZipCode,
    setZipCodes,
    setListingsGeoProduction,
  
} = areaAgentSlice.actions;

export default areaAgentSlice.reducer;
