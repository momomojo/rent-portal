import { renderHook, act } from '@testing-library/react';
import { usePropertyFilters } from '../usePropertyFilters';

describe('usePropertyFilters', () => {
  it('initializes with default filters', () => {
    const { result } = renderHook(() => usePropertyFilters());

    expect(result.current.filters).toEqual({
      search: '',
      type: 'all',
      status: 'all'
    });
  });

  it('initializes with provided filters', () => {
    const initialFilters = {
      search: 'test',
      type: 'apartment',
      status: 'available'
    };

    const { result } = renderHook(() => usePropertyFilters(initialFilters));
    expect(result.current.filters).toEqual(initialFilters);
  });

  it('updates individual filters', () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter('search', 'test search');
    });
    expect(result.current.filters.search).toBe('test search');

    act(() => {
      result.current.updateFilter('type', 'house');
    });
    expect(result.current.filters.type).toBe('house');
  });

  it('resets filters to default values', () => {
    const initialFilters = {
      search: 'test',
      type: 'apartment',
      status: 'available'
    };

    const { result } = renderHook(() => usePropertyFilters(initialFilters));

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      search: '',
      type: 'all',
      status: 'all'
    });
  });

  it('clears individual filters', () => {
    const initialFilters = {
      search: 'test',
      type: 'apartment',
      status: 'available',
      minPrice: 1000,
      maxPrice: 2000
    };

    const { result } = renderHook(() => usePropertyFilters(initialFilters));

    act(() => {
      result.current.clearFilter('minPrice');
    });

    expect(result.current.filters.minPrice).toBeUndefined();
    expect(result.current.filters.maxPrice).toBe(2000);
  });

  it('correctly identifies active filters', () => {
    const { result } = renderHook(() => usePropertyFilters());

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.updateFilter('search', 'test');
    });
    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.resetFilters();
    });
    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.updateFilter('type', 'apartment');
    });
    expect(result.current.hasActiveFilters).toBe(true);
  });
});