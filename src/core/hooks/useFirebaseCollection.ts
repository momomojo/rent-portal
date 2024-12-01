import { useState, useCallback, useEffect } from 'react';
import { QueryConstraint } from 'firebase/firestore';
import { EnhancedFirebaseClient } from '../firebase/enhancedFirebase';
import { db } from '../firebase/config';
import { ApiError } from '../api/types';
import { useError } from './useError';

interface UseFirebaseCollectionOptions<T> {
  initialData?: T[];
  onError?: (error: ApiError) => void;
}

interface UseFirebaseCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  create: (id: string, data: Partial<T>) => Promise<void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  client: EnhancedFirebaseClient;
}

export function useFirebaseCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  options: UseFirebaseCollectionOptions<T> = {}
): UseFirebaseCollectionResult<T> {
  const [data, setData] = useState<T[]>(options.initialData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const { setGlobalError } = useError();

  const client = new EnhancedFirebaseClient(db, collectionName);

  const handleError = useCallback((error: ApiError) => {
    setError(error);
    setGlobalError(error.message);
    options.onError?.(error);
  }, [options.onError, setGlobalError]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await client.queryDocuments<T>(constraints);
      setData(result);
      setError(null);
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [client, constraints, handleError]);

  const create = useCallback(async (id: string, newData: Partial<T>) => {
    try {
      await client.setDocument(id, newData);
      await fetchData(); // Refresh the list
    } catch (err) {
      handleError(err as ApiError);
      throw err;
    }
  }, [client, fetchData, handleError]);

  const update = useCallback(async (id: string, updateData: Partial<T>) => {
    try {
      await client.updateDocument(id, updateData);
      await fetchData(); // Refresh the list
    } catch (err) {
      handleError(err as ApiError);
      throw err;
    }
  }, [client, fetchData, handleError]);

  const remove = useCallback(async (id: string) => {
    try {
      await client.deleteDocument(id);
      await fetchData(); // Refresh the list
    } catch (err) {
      handleError(err as ApiError);
      throw err;
    }
  }, [client, fetchData, handleError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
    client
  };
}
