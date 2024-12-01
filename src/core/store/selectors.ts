import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './types';

// Memoized selector for filtered and sorted lists
export const createFilteredListSelector = <T extends { id: string }>(
  getState: (state: RootState) => T[],
  getFilters: (state: RootState) => Record<string, any>,
  getSortBy: (state: RootState) => string | null,
  getSortDirection: (state: RootState) => 'asc' | 'desc'
) => {
  return createSelector(
    [getState, getFilters, getSortBy, getSortDirection],
    (items, filters, sortBy, sortDirection) => {
      // Apply filters
      let filteredItems = items.filter(item =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = item[key as keyof T];
          return typeof value === 'string' 
            ? itemValue?.toString().toLowerCase().includes(value.toLowerCase())
            : itemValue === value;
        })
      );

      // Apply sorting
      if (sortBy) {
        filteredItems = [...filteredItems].sort((a, b) => {
          const aValue = a[sortBy as keyof T];
          const bValue = b[sortBy as keyof T];
          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }

      return filteredItems;
    }
  );
};

// Memoized selector for paginated data
export const createPaginatedListSelector = <T>(
  getFilteredItems: (state: RootState) => T[],
  getPage: (state: RootState) => number,
  getPageSize: (state: RootState) => number
) => {
  return createSelector(
    [getFilteredItems, getPage, getPageSize],
    (items, page, pageSize) => {
      const start = page * pageSize;
      const end = start + pageSize;
      return {
        items: items.slice(start, end),
        totalItems: items.length,
        totalPages: Math.ceil(items.length / pageSize)
      };
    }
  );
};

// Create a selector that handles dependencies
export const createDependentSelector = <T, D>(
  dataSelector: (state: RootState) => T,
  dependencySelector: (state: RootState) => D | null,
  shouldReset: boolean = true
) => {
  return createSelector(
    [dataSelector, dependencySelector],
    (data, dependency) => {
      if (!dependency) {
        return shouldReset ? null : data;
      }
      return data;
    }
  );
};

// Create an error-aware selector
export const createErrorAwareSelector = <T>(
  dataSelector: (state: RootState) => T,
  errorSelector: (state: RootState) => string | null,
  loadingSelector: (state: RootState) => boolean
) => {
  return createSelector(
    [dataSelector, errorSelector, loadingSelector],
    (data, error, loading) => ({
      data,
      error,
      loading,
      isSuccess: !error && !loading && data !== null
    })
  );
};