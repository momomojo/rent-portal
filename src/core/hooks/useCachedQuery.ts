import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { cacheService } from '@/core/services/cache';

interface CacheConfig {
  ttl?: number;
  revalidate?: boolean;
}

export function useCachedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  cacheConfig?: CacheConfig
) {
  const cacheKey = Array.isArray(queryKey) ? queryKey.join('-') : String(queryKey);
  const { ttl = 3600, revalidate = true } = cacheConfig || {};

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: async () => {
      // Try to get from cache first
      const cached = await cacheService.get<TQueryFnData>(cacheKey);
      
      if (cached && !revalidate) {
        return cached;
      }

      // If not in cache or revalidating, fetch fresh data
      const data = await queryFn();
      
      // Cache the fresh data
      await cacheService.set(cacheKey, data, ttl);
      
      return data;
    },
    ...options,
    staleTime: ttl * 1000, // Convert to milliseconds
  });
}

// Helper hook for prefetching and caching data
export function usePrefetchQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey
>(
  queryClient: any,
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  cacheConfig?: CacheConfig
) {
  const cacheKey = Array.isArray(queryKey) ? queryKey.join('-') : String(queryKey);
  const { ttl = 3600 } = cacheConfig || {};

  return async () => {
    const cached = await cacheService.get(cacheKey);
    if (!cached) {
      const data = await queryFn();
      await cacheService.set(cacheKey, data, ttl);
      queryClient.setQueryData(queryKey, data);
    }
  };
}

// Helper hook for invalidating cached data
export function useInvalidateQuery<TQueryKey extends QueryKey = QueryKey>(
  queryClient: any,
  queryKey: TQueryKey
) {
  const cacheKey = Array.isArray(queryKey) ? queryKey.join('-') : String(queryKey);

  return async () => {
    await cacheService.delete(cacheKey);
    await queryClient.invalidateQueries(queryKey);
  };
}

// Example usage:
/*
const { data, isLoading } = useCachedQuery(
  ['properties', filters],
  () => fetchProperties(filters),
  {
    enabled: !!filters,
    keepPreviousData: true,
  },
  {
    ttl: 300, // Cache for 5 minutes
    revalidate: true, // Always check for fresh data
  }
);
*/