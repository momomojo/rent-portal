import { createAction } from '@reduxjs/toolkit';
import { 
  ResourceState, 
  ListState, 
  EntityState,
  PaginationState,
  FilterState 
} from './types/state';

// Resource Actions
export const createResourceActions = <T>(slice: string) => ({
  setLoading: createAction<boolean>(`${slice}/setLoading`),
  setError: createAction<string | null>(`${slice}/setError`),
  setData: createAction<T>(`${slice}/setData`),
  clearData: createAction(`${slice}/clearData`),
  reset: createAction(`${slice}/reset`),
  setInitialized: createAction<boolean>(`${slice}/setInitialized`),
  setLastUpdated: createAction<number>(`${slice}/setLastUpdated`)
});

// List Actions
export const createListActions = <T>(slice: string) => ({
  ...createResourceActions<T[]>(slice),
  setSelectedId: createAction<string | null>(`${slice}/setSelectedId`),
  setFilters: createAction<Record<string, any>>(`${slice}/setFilters`),
  setSortBy: createAction<string | null>(`${slice}/setSortBy`),
  setSortOrder: createAction<'asc' | 'desc'>(`${slice}/setSortOrder`),
  setPagination: createAction<PaginationState>(`${slice}/setPagination`),
  setCache: createAction<{ timestamp: number; duration: number }>(`${slice}/setCache`),
  addItems: createAction<T[]>(`${slice}/addItems`),
  updateItem: createAction<{ id: string; changes: Partial<T> }>(`${slice}/updateItem`),
  removeItem: createAction<string>(`${slice}/removeItem`)
});

// Entity Actions
export const createEntityActions = <T extends { id: string }>(slice: string) => ({
  ...createResourceActions<Record<string, T>>(slice),
  addOne: createAction<T>(`${slice}/addOne`),
  addMany: createAction<T[]>(`${slice}/addMany`),
  updateOne: createAction<{ id: string; changes: Partial<T> }>(`${slice}/updateOne`),
  updateMany: createAction<Array<{ id: string; changes: Partial<T> }>>(`${slice}/updateMany`),
  removeOne: createAction<string>(`${slice}/removeOne`),
  removeMany: createAction<string[]>(`${slice}/removeMany`),
  setOne: createAction<T>(`${slice}/setOne`),
  setMany: createAction<T[]>(`${slice}/setMany`),
  setAll: createAction<T[]>(`${slice}/setAll`),
  addRelation: createAction<{ id: string; relationId: string; type: string }>(`${slice}/addRelation`),
  removeRelation: createAction<{ id: string; relationId: string; type: string }>(`${slice}/removeRelation`)
});

// Filter Actions
export const createFilterActions = (slice: string) => ({
  setFilter: createAction<{ key: string; value: any }>(`${slice}/setFilter`),
  removeFilter: createAction<string>(`${slice}/removeFilter`),
  clearFilters: createAction(`${slice}/clearFilters`),
  setSortBy: createAction<string | null>(`${slice}/setSortBy`),
  setSortOrder: createAction<'asc' | 'desc'>(`${slice}/setSortOrder`),
  resetFilters: createAction(`${slice}/resetFilters`)
});

// Pagination Actions
export const createPaginationActions = (slice: string) => ({
  setPage: createAction<number>(`${slice}/setPage`),
  setLimit: createAction<number>(`${slice}/setLimit`),
  setTotal: createAction<number>(`${slice}/setTotal`),
  setHasMore: createAction<boolean>(`${slice}/setHasMore`),
  resetPagination: createAction(`${slice}/resetPagination`)
});