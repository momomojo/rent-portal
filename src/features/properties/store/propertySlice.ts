import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  rent: number;
  status: 'available' | 'rented' | 'maintenance';
  landlordId: string;
  tenantId?: string;
  images: string[];
  amenities: string[];
}

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.properties.push(action.payload);
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter(p => p.id !== action.payload);
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  setSelectedProperty,
  setLoading,
  setError,
} = propertySlice.actions;

export const propertyReducer = propertySlice.reducer;
