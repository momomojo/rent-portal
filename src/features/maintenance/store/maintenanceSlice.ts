import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MaintenanceState } from '../types';
import { ApiClient } from '@core/api/ApiClient';

const initialState: MaintenanceState = {
  requests: [],
  loading: false,
  error: null,
};

export const fetchMaintenanceRequests = createAsyncThunk(
  'maintenance/fetchRequests',
  async () => {
    const response = await ApiClient.get('/api/maintenance-requests');
    return response.data;
  }
);

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenanceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchMaintenanceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch maintenance requests';
      });
  },
});

export default maintenanceSlice.reducer;
