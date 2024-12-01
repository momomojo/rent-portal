import { useState, useCallback } from 'react';

interface PropertyFilters {
  search: string;
  type: string;
  status: string;
  minPrice?: number;
  maxPrice?: number;
}

export const usePropertyFilters = (initialFilters?: Partial<PropertyFilters>) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    type: 'all',
    status: 'all',
    ...initialFilters
  });

  const updateFilter = useCallback((key: keyof PropertyFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all'
    });
  }, []);

  const clearFilter = useCallback((key: keyof PropertyFilters) => {
    setFilters(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return filters.search !== '' || 
           filters.type !== 'all' || 
           filters.status !== 'all' ||
           filters.minPrice !== undefined ||
           filters.maxPrice !== undefined;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    clearFilter,
    hasActiveFilters: hasActiveFilters()
  };
};