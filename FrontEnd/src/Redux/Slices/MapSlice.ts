
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from 'leaflet';

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
}

const initialState: MapState = {
  markers: [],
  transactions: [],
  mapInstance: null,
};

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
  },
});

export const {
  setMapInstance,
  setMarkers,
  addMarker,
  setTransactions,
  zoomToLocation,
} = mapSlice.actions;

export default mapSlice.reducer;
