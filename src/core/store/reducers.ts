import { PayloadAction } from '@reduxjs/toolkit';
import { 
  ResourceState,
  ListState,
  EntityState,
  PaginationState,
  FilterState
} from './types/state';

// Resource Reducers
export const createResourceReducers = <T>() => ({
  setLoading: (state: ResourceState<T>, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
  },
  setError: (state: ResourceState<T>, action: PayloadAction<string | null>) => {
    state.error = action.payload;
  },
  setData: (state: ResourceState<T>, action: PayloadAction<T>) => {
    state.data = action.payload;
    state.initialized = true;
    state.lastUpdated = Date.now();
  },
  clearData: (state: ResourceState<T>) => {
    state.data = null;
  },
  reset: (state: ResourceState<T>, initialState: ResourceState<T>) => {
    return initialState;
  }
});

// List Reducers
export const createListReducers = <T extends { id: string }>() => ({
  ...createResourceReducers<T[]>(),
  setSelectedId: (state: ListState<T>, action: PayloadAction<string | null>) => {
    state.selectedId = action.payload;
  },
  setFilters: (state: ListState<T>, action: PayloadAction<Record<string, any>>) => {
    state.filters = action.payload;
  },
  setSortBy: (state: ListState<T>, action: PayloadAction<string | null>) => {
    state.sortBy = action.payload;
  },
  setSortOrder: (state: ListState<T>, action: PayloadAction<'asc' | 'desc'>) => {
    state.sortOrder = action.payload;
  },
  setPagination: (state: ListState<T>, action: PayloadAction<PaginationState>) => {
    state.pagination = action.payload;
  },
  addItems: (state: ListState<T>, action: PayloadAction<T[]>) => {
    if (!state.data) state.data = [];
    state.data.push(...action.payload);
    state.lastUpdated = Date.now();
  },
  updateItem: (state: ListState<T>, action: PayloadAction<{ id: string; changes: Partial<T> }>) => {
    if (!state.data) return;
    const index = state.data.findIndex(item => item.id === action.payload.id);
    if (index !== -1) {
      state.data[index] = { ...state.data[index], ...action.payload.changes };
      state.lastUpdated = Date.now();
    }
  },
  removeItem: (state: ListState<T>, action: PayloadAction<string>) => {
    if (!state.data) return;
    state.data = state.data.filter(item => item.id !== action.payload);
    state.lastUpdated = Date.now();
  }
});

// Entity Reducers
export const createEntityReducers = <T extends { id: string }>() => ({
  ...createResourceReducers<Record<string, T>>(),
  addOne: (state: EntityState<T>, action: PayloadAction<T>) => {
    if (!state.data) state.data = {};
    state.data[action.payload.id] = action.payload;
    if (!state.ids.includes(action.payload.id)) {
      state.ids.push(action.payload.id);
    }
    state.lastUpdated = Date.now();
  },
  addMany: (state: EntityState<T>, action: PayloadAction<T[]>) => {
    if (!state.data) state.data = {};
    action.payload.forEach(entity => {
      state.data![entity.id] = entity;
      if (!state.ids.includes(entity.id)) {
        state.ids.push(entity.id);
      }
    });
    state.lastUpdated = Date.now();
  },
  updateOne: (state: EntityState<T>, action: PayloadAction<{ id: string; changes: Partial<T> }>) => {
    if (!state.data || !state.data[action.payload.id]) return;
    state.data[action.payload.id] = { 
      ...state.data[action.payload.id], 
      ...action.payload.changes 
    };
    state.lastUpdated = Date.now();
  },
  updateMany: (state: EntityState<T>, action: PayloadAction<Array<{ id: string; changes: Partial<T> }>>) => {
    if (!state.data) return;
    action.payload.forEach(({ id, changes }) => {
      if (state.data![id]) {
        state.data![id] = { ...state.data![id], ...changes };
      }
    });
    state.lastUpdated = Date.now();
  },
  removeOne: (state: EntityState<T>, action: PayloadAction<string>) => {
    if (!state.data) return;
    delete state.data[action.payload];
    state.ids = state.ids.filter(id => id !== action.payload);
    if (state.selectedId === action.payload) {
      state.selectedId = null;
    }
    state.lastUpdated = Date.now();
  },
  removeMany: (state: EntityState<T>, action: PayloadAction<string[]>) => {
    if (!state.data) return;
    action.payload.forEach(id => {
      delete state.data![id];
      if (state.selectedId === id) {
        state.selectedId = null;
      }
    });
    state.ids = state.ids.filter(id => !action.payload.includes(id));
    state.lastUpdated = Date.now();
  },
  setOne: (state: EntityState<T>, action: PayloadAction<T>) => {
    if (!state.data) state.data = {};
    state.data[action.payload.id] = action.payload;
    if (!state.ids.includes(action.payload.id)) {
      state.ids.push(action.payload.id);
    }
    state.lastUpdated = Date.now();
  },
  setMany: (state: EntityState<T>, action: PayloadAction<T[]>) => {
    if (!state.data) state.data = {};
    action.payload.forEach(entity => {
      state.data![entity.id] = entity;
      if (!state.ids.includes(entity.id)) {
        state.ids.push(entity.id);
      }
    });
    state.lastUpdated = Date.now();
  },
  setAll: (state: EntityState<T>, action: PayloadAction<T[]>) => {
    state.data = {};
    state.ids = [];
    action.payload.forEach(entity => {
      state.data![entity.id] = entity;
      state.ids.push(entity.id);
    });
    state.lastUpdated = Date.now();
  },
  addRelation: (state: EntityState<T>, action: PayloadAction<{ id: string; relationId: string; type: string }>) => {
    if (!state.relationIds[action.payload.type]) {
      state.relationIds[action.payload.type] = [];
    }
    if (!state.relationIds[action.payload.type].includes(action.payload.relationId)) {
      state.relationIds[action.payload.type].push(action.payload.relationId);
    }
  },
  removeRelation: (state: EntityState<T>, action: PayloadAction<{ id: string; relationId: string; type: string }>) => {
    if (!state.relationIds[action.payload.type]) return;
    state.relationIds[action.payload.type] = state.relationIds[action.payload.type]
      .filter(id => id !== action.payload.relationId);
  }
});

// Filter Reducers
export const createFilterReducers = () => ({
  setFilter: (state: FilterState, action: PayloadAction<{ key: string; value: any }>) => {
    state.filters[action.payload.key] = action.payload.value;
  },
  removeFilter: (state: FilterState, action: PayloadAction<string>) => {
    delete state.filters[action.payload];
  },
  clearFilters: (state: FilterState) => {
    state.filters = {};
  },
  setSortBy: (state: FilterState, action: PayloadAction<string | null>) => {
    state.sortBy = action.payload;
  },
  setSortOrder: (state: FilterState, action: PayloadAction<'asc' | 'desc'>) => {
    state.sortOrder = action.payload;
  },
  resetFilters: (state: FilterState, initialState: FilterState) => {
    state.filters = initialState.filters;
    state.sortBy = initialState.sortBy;
    state.sortOrder = initialState.sortOrder;
  }
});

// Pagination Reducers
export const createPaginationReducers = () => ({
  setPage: (state: PaginationState, action: PayloadAction<number>) => {
    state.page = action.payload;
  },
  setLimit: (state: PaginationState, action: PayloadAction<number>) => {
    state.limit = action.payload;
    state.page = 0; // Reset to first page when changing limit
  },
  setTotal: (state: PaginationState, action: PayloadAction<number>) => {
    state.total = action.payload;
    state.hasMore = state.page * state.limit < action.payload;
  },
  setHasMore: (state: PaginationState, action: PayloadAction<boolean>) => {
    state.hasMore = action.payload;
  },
  resetPagination: (state: PaginationState, initialState: PaginationState) => {
    state.page = initialState.page;
    state.limit = initialState.limit;
    state.total = initialState.total;
    state.hasMore = initialState.hasMore;
  }
});