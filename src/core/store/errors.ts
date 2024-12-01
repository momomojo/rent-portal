import { ResourceState, AsyncState } from './types/state';
import { SerializedError } from '@reduxjs/toolkit';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export const handleAsyncThunkError = (
  state: ResourceState<any>, 
  error: SerializedError | ApiError | null
) => {
  state.loading = false;
  state.error = error?.message || 'An unexpected error occurred';
  state.initialized = true;
};

export const handleListError = (
  state: ResourceState<any[]>,
  error: SerializedError | ApiError | null
) => {
  handleAsyncThunkError(state, error);
  state.data = state.data || []; // Ensure data is never null for lists
};

export const handleEntityError = (
  state: ResourceState<Record<string, any>>,
  error: SerializedError | ApiError | null
) => {
  handleAsyncThunkError(state, error);
  state.data = state.data || {}; // Ensure data is never null for entities
};

export const createErrorHandler = (errorMap: Record<string, string>) => {
  return (error: any): string => {
    if (typeof error === 'string') {
      return errorMap[error] || error;
    }
    
    const errorCode = error?.code || error?.name || 'UNKNOWN_ERROR';
    return errorMap[errorCode] || error?.message || 'An unexpected error occurred';
  };
};

export const handleLoadingStates = (state: AsyncState) => ({
  pending: () => {
    state.loading = true;
    state.error = null;
    state.success = false;
  },
  fulfilled: () => {
    state.loading = false;
    state.error = null;
    state.success = true;
  },
  rejected: (error: SerializedError | ApiError | null) => {
    state.loading = false;
    state.error = error?.message || 'An unexpected error occurred';
    state.success = false;
  }
});

export class StateError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'StateError';
  }
}

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
};