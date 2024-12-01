import { useState, useEffect } from 'react';
import { rentalCache } from '@core/data/cache-manager';
import { logger } from '@core/utils/logger';

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
}

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  lastSyncTime: number | null;
}

export const useOfflineSync = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingOperations: 0,
    lastSyncTime: null,
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }));
      synchronize();
    };

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Queue an operation for sync
  const queueOperation = async (operation: Omit<SyncOperation, 'id' | 'timestamp'>) => {
    try {
      const syncOp: SyncOperation = {
        ...operation,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      await rentalCache.set('syncQueue', syncOp.id, syncOp);
      
      setSyncState(prev => ({
        ...prev,
        pendingOperations: prev.pendingOperations + 1,
      }));

      if (syncState.isOnline) {
        synchronize();
      }
    } catch (error) {
      logger.error('Failed to queue sync operation:', error);
      throw error;
    }
  };

  // Process sync queue
  const synchronize = async () => {
    if (syncState.isSyncing || !syncState.isOnline) {
      return;
    }

    setSyncState(prev => ({ ...prev, isSyncing: true }));

    try {
      const queue = await rentalCache.get<SyncOperation[]>('syncQueue', 'operations');
      if (!queue?.length) {
        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          pendingOperations: 0,
          lastSyncTime: Date.now(),
        }));
        return;
      }

      // Sort operations by timestamp
      const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);

      for (const operation of sortedQueue) {
        try {
          switch (operation.type) {
            case 'create':
              await handleCreate(operation);
              break;
            case 'update':
              await handleUpdate(operation);
              break;
            case 'delete':
              await handleDelete(operation);
              break;
          }

          // Remove processed operation from queue
          await rentalCache.delete('syncQueue', operation.id);
          setSyncState(prev => ({
            ...prev,
            pendingOperations: prev.pendingOperations - 1,
          }));
        } catch (error) {
          logger.error(`Failed to process sync operation ${operation.id}:`, error);
          // Keep the operation in the queue for retry
        }
      }
    } catch (error) {
      logger.error('Sync failed:', error);
    } finally {
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: Date.now(),
      }));
    }
  };

  // Handle different types of sync operations
  const handleCreate = async (operation: SyncOperation) => {
    switch (operation.entity) {
      case 'property':
        // await api.properties.create(operation.data);
        break;
      case 'application':
        // await api.applications.create(operation.data);
        break;
      // Add other entity types as needed
    }
  };

  const handleUpdate = async (operation: SyncOperation) => {
    switch (operation.entity) {
      case 'property':
        // await api.properties.update(operation.data.id, operation.data);
        break;
      case 'application':
        // await api.applications.update(operation.data.id, operation.data);
        break;
      // Add other entity types as needed
    }
  };

  const handleDelete = async (operation: SyncOperation) => {
    switch (operation.entity) {
      case 'property':
        // await api.properties.delete(operation.data.id);
        break;
      case 'application':
        // await api.applications.delete(operation.data.id);
        break;
      // Add other entity types as needed
    }
  };

  return {
    ...syncState,
    queueOperation,
    synchronize,
  };
};

// Example usage:
/*
const PropertyForm = () => {
  const { isOnline, queueOperation } = useOfflineSync();

  const handleSubmit = async (data) => {
    try {
      if (isOnline) {
        // Direct API call
        await api.properties.create(data);
      } else {
        // Queue for sync
        await queueOperation({
          type: 'create',
          entity: 'property',
          data,
        });
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      // Form fields
    </form>
  );
};
*/
