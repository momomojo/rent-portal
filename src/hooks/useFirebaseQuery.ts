import { useEffect, useState, useCallback } from 'react';
import { 
  query, 
  QueryConstraint, 
  getDocs, 
  collection,
  DocumentData,
  QuerySnapshot,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentReference
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CacheItem<T> {
  data: T[];
  timestamp: number;
  queryKey: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const queryCache = new Map<string, CacheItem<any>>();

function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>): DocumentData {
      return data;
    },
    fromFirestore(snapshot: any): T {
      return { id: snapshot.id, ...snapshot.data() } as T;
    }
  };
}

export const useFirebaseQuery = <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize: number = 10
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Generate a unique key for this query
  const queryKey = `${collectionName}-${constraints.map(c => c.toString()).join('-')}`;

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      const cached = queryCache.get(queryKey);
      if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      const collectionRef = collection(db(), collectionName).withConverter(createConverter<T>());
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const fetchedData = querySnapshot.docs.map(doc => doc.data());

      // Update cache
      queryCache.set(queryKey, {
        data: fetchedData,
        timestamp: Date.now(),
        queryKey
      });

      setData(fetchedData);
      setHasMore(fetchedData.length >= pageSize);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collectionName, constraints, pageSize, queryKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => fetchData(true);

  return { data, loading, error, hasMore, refresh };
};
