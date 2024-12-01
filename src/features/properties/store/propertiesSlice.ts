import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PropertiesState } from '../types';
import { ApiClient } from '@core/api/ApiClient';

const initialState: PropertiesState = {
  properties: [],
  loading: false,
  error: null,
};

export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async () => {
    const response = await ApiClient.get('/api/properties');
    return response.data;
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      });
  },
});

export default propertiesSlice.reducer;
