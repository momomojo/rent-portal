import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface BaseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface QueryState<T> extends BaseState<T> {
  lastFetched: number | null;
}

interface ListState<T> extends BaseState<T[]> {
  selectedId: string | null;
  filters: Record<string, any>;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
}

export const createBaseState = <T>(): BaseState<T> => ({
  data: null,
  loading: false,
  error: null,
  initialized: false
});

export const createQueryState = <T>(): QueryState<T> => ({
  ...createBaseState<T>(),
  lastFetched: null
});

export const createListState = <T>(): ListState<T> => ({
  ...createBaseState<T[]>(),
  selectedId: null,
  filters: {},
  sortBy: null,
  sortDirection: 'asc'
});

export const createResourceSlice = <T extends { id: string }>(
  name: string,
  initialState: ListState<T> = createListState<T>(),
  extraReducers = {}
) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      setData: (state, action: PayloadAction<T[]>) => {
        state.data = action.payload;
        state.initialized = true;
      },
      addItem: (state, action: PayloadAction<T>) => {
        if (!state.data) state.data = [];
        state.data.push(action.payload);
      },
      updateItem: (state, action: PayloadAction<T>) => {
        if (!state.data) return;
        const index = state.data.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      },
      removeItem: (state, action: PayloadAction<string>) => {
        if (!state.data) return;
        state.data = state.data.filter(item => item.id !== action.payload);
      },
      setSelectedId: (state, action: PayloadAction<string | null>) => {
        state.selectedId = action.payload;
      },
      setFilters: (state, action: PayloadAction<Record<string, any>>) => {
        state.filters = action.payload;
      },
      setSorting: (state, action: PayloadAction<{ sortBy: string; direction: 'asc' | 'desc' }>) => {
        state.sortBy = action.payload.sortBy;
        state.sortDirection = action.payload.direction;
      },
      resetState: () => createListState<T>()
    },
    extraReducers
  });
};

export const createAsyncThunkWithRetry = <T>(
  typePrefix: string,
  payloadCreator: (args: any, thunkAPI: any) => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
  } = {}
) => {
  const { maxRetries = 3, retryDelay = 1000 } = options;

  return createAsyncThunk<T, any>(
    typePrefix,
    async (args, thunkAPI) => {
      let lastError;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await payloadCreator(args, thunkAPI);
        } catch (error) {
          lastError = error;
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => 
              setTimeout(resolve, retryDelay * Math.pow(2, attempt))
            );
          }
        }
      }
      return thunkAPI.rejectWithValue(lastError);
    }
  );
};