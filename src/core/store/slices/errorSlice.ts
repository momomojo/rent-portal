import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ErrorState {
  globalError: string | null;
  errors: Record<string, string>;
}

const initialState: ErrorState = {
  globalError: null,
  errors: {},
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },
    setError: (state, action: PayloadAction<{ key: string; message: string }>) => {
      state.errors[action.payload.key] = action.payload.message;
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    clearAllErrors: (state) => {
      state.globalError = null;
      state.errors = {};
    },
  },
});

export const { setGlobalError, setError, clearError, clearAllErrors } = errorSlice.actions;
export const errorReducer = errorSlice.reducer;
