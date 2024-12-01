import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { setError, setGlobalError, clearError, clearAllErrors } from '../store/slices/errorSlice';

export const useError = () => {
  const dispatch = useAppDispatch();
  const { globalError, errors } = useAppSelector((state) => state.error);

  const setErrorMessage = useCallback(
    (key: string, message: string) => {
      dispatch(setError({ key, message }));
    },
    [dispatch]
  );

  const setGlobalErrorMessage = useCallback(
    (message: string | null) => {
      dispatch(setGlobalError(message));
    },
    [dispatch]
  );

  const clearErrorMessage = useCallback(
    (key: string) => {
      dispatch(clearError(key));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  return {
    globalError,
    errors,
    setError: setErrorMessage,
    setGlobalError: setGlobalErrorMessage,
    clearError: clearErrorMessage,
    clearAllErrors: clearAll,
  };
};
