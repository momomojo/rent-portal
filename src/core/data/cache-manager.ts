import { openDB, IDBPDatabase } from 'idb';
import { logger } from '@core/utils/logger';

interface CacheConfig {
  name: string;
  version: number;
  stores: {
    [key: string]: string[];
  };
  expiryTime?: number; // in milliseconds
}

export class CacheManager {
  private db: IDBPDatabase | null = null;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = {
      expiryTime: 24 * 60 * 60 * 1000, // 24 hours default
      ...config,
    };
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      this.db = await openDB(this.config.name, this.config.version, {
        upgrade(db) {
          // Create object stores
          Object.entries(this.config.stores).forEach(([storeName, indexes]) => {
            const store = db.createObjectStore(storeName, {
              keyPath: 'id',
              autoIncrement: true,
            });

            // Create indexes
            indexes.forEach(indexName => {
              store.createIndex(indexName, indexName);
            });

            // Create timestamp index for cache invalidation
            store.createIndex('timestamp', 'timestamp');
          });
        },
      });
    } catch (error) {
      logger.error('Failed to initialize cache database:', error);
    }
  }

  async set<T>(storeName: string, key: string, data: T): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.put({
        id: key,
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error(`Failed to set cache for ${key}:`, error);
      throw error;
    }
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const result = await store.get(key);

      if (!result) {
        return null;
      }

      // Check if cache is expired
      if (
        this.config.expiryTime &&
        Date.now() - result.timestamp > this.config.expiryTime
      ) {
        await this.delete(storeName, key);
        return null;
      }

      return result.data as T;
    } catch (error) {
      logger.error(`Failed to get cache for ${key}:`, error);
      return null;
    }
  }

  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(key);
    } catch (error) {
      logger.error(`Failed to delete cache for ${key}:`, error);
      throw error;
    }
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
    } catch (error) {
      logger.error(`Failed to clear cache for ${storeName}:`, error);
      throw error;
    }
  }

  async clearExpired(storeName: string): Promise<void> {
    if (!this.db || !this.config.expiryTime) {
      return;
    }

    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const index = store.index('timestamp');
      const expiredKeys = await index.getAllKeys(IDBKeyRange.upperBound(
        Date.now() - this.config.expiryTime
      ));

      await Promise.all(
        expiredKeys.map(key => this.delete(storeName, key as string))
      );
    } catch (error) {
      logger.error(`Failed to clear expired cache for ${storeName}:`, error);
    }
  }
}

// Create cache instance for rental data
export const rentalCache = new CacheManager({
  name: 'rental-cache',
  version: 1,
  stores: {
    properties: ['location', 'price', 'type'],
    searches: ['query', 'filters'],
    users: ['email'],
    applications: ['userId', 'propertyId', 'status'],
  },
  expiryTime: 12 * 60 * 60 * 1000, // 12 hours
});
