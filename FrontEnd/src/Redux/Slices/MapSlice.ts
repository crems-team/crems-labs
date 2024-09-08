
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from 'leaflet';
import GeoAreaService from "../../Services/GeoAreaService";
import Cities from "../../Models/Cities"
import Zip from "../../Models/Zip"



interface Marker {
  position: [number, number];
  zip: string;
  street: string;
  nbrlist: string;
  nbragt: string;
  icon: Icon | null;
}

interface MapState {
  markers: Marker[];
  transactions: any[];
  mapInstance: any | null;
  loadingTransactions: boolean;
  activityReportClicked: boolean;
  totalTransactions: any[],
  totalAgents: any[],
  currentCitySaveSearch : Cities | null,
  currentZipSaveSearch : Zip[],
}



const initialState: MapState = {
  markers: [],
  transactions: [],
  mapInstance: null,
  loadingTransactions: false,
  activityReportClicked : true,
  totalTransactions : [],
  totalAgents: [],
  currentCitySaveSearch : null,
  currentZipSaveSearch : []

};

export const fetchTransactions = createAsyncThunk(
  'map/fetchTransactions',
  async ({ paramZip, nbrMonth }: { paramZip: string[], nbrMonth: number }, thunkAPI) => {
    try {
      const response = await GeoAreaService.fetchTransactions(paramZip.join(','), nbrMonth);
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
    zoomToLocation(state, action: PayloadAction<{ zoomLevel: number, center: [number, number] }>) {
      const { zoomLevel, center } = action.payload;
      if (state.mapInstance) {
        console.log('in');
        state.mapInstance.setView(center, zoomLevel);
      }
    },
    setActivityReportClicked(state, action: PayloadAction<boolean>) {
      state.activityReportClicked = action.payload;
    },
    setTotalTransactions(state, action: PayloadAction<any[]>) {
      state.totalTransactions = action.payload;
    },
    setTotalAgents(state, action: PayloadAction<any[]>) {
      state.totalAgents = action.payload;
    },
    setCurrentCitySaveSearch(state, action: PayloadAction<Cities| null>) {
      state.currentCitySaveSearch = action.payload;
    },
    setCurrentZipSaveSearch(state, action: PayloadAction<Zip[]>) {
      state.currentZipSaveSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loadingTransactions = true;
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
      .addCase(fetchTotalTransactions.pending, (state) => {
        // state.loadingTransactions = true;
      })
      .addCase(fetchTotalTransactions.fulfilled, (state, action) => {
        state.totalTransactions = action.payload;
        // state.loadingTransactions = false;
      })
      .addCase(fetchTotalTransactions.rejected, (state, action) => {
        console.error(action.payload);
        // state.loadingTransactions = false;
      })
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
  setCurrentZipSaveSearch
} = mapSlice.actions;

export default mapSlice.reducer;
