export interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  lastUpdated?: number;
}

export interface ListState<T> extends ResourceState<T[]> {
  selectedId: string | null;
  filters: Record<string, any>;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  cache: {
    timestamp: number;
    duration: number;
  };
}

export interface EntityState<T> extends ResourceState<Record<string, T>> {
  ids: string[];
  selectedId: string | null;
  relationIds: Record<string, string[]>;
}

export interface QueryState<T> extends ResourceState<T> {
  params: Record<string, any>;
  cache: {
    timestamp: number;
    duration: number;
  };
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface FilterState {
  filters: Record<string, any>;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
}