import { openDB, IDBPDatabase } from 'idb';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private dbName = 'app-cache';
  private version = 1;
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return openDB(this.dbName, this.version, {
      upgrade(db) {
        // Create stores for different types of cached data
        if (!db.objectStoreNames.contains('queries')) {
          db.createObjectStore('queries');
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
        if (!db.objectStoreNames.contains('static')) {
          db.createObjectStore('static');
        }
      },
    });
  }

  async set<T>(
    storeName: 'queries' | 'images' | 'static',
    key: string,
    data: T,
    ttl: number = 3600 // Default TTL: 1 hour
  ): Promise<void> {
    const db = await this.db;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl * 1000,
    };
    await db.put(storeName, entry, key);
  }

  async get<T>(
    storeName: 'queries' | 'images' | 'static',
    key: string
  ): Promise<T | null> {
    const db = await this.db;
    const entry: CacheEntry<T> | undefined = await db.get(storeName, key);

    if (!entry) return null;

    // Check if entry has expired
    if (entry.expiresAt < Date.now()) {
      await this.delete(storeName, key);
      return null;
    }

    return entry.data;
  }

  async delete(
    storeName: 'queries' | 'images' | 'static',
    key: string
  ): Promise<void> {
    const db = await this.db;
    await db.delete(storeName, key);
  }

  async clear(storeName: 'queries' | 'images' | 'static'): Promise<void> {
    const db = await this.db;
    await db.clear(storeName);
  }

  async clearAll(): Promise<void> {
    const db = await this.db;
    await Promise.all([
      db.clear('queries'),
      db.clear('images'),
      db.clear('static'),
    ]);
  }

  async clearExpired(): Promise<void> {
    const db = await this.db;
    const stores = ['queries', 'images', 'static'] as const;

    await Promise.all(
      stores.map(async (storeName) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const keys = await store.getAllKeys();

        for (const key of keys) {
          const entry: CacheEntry<unknown> | undefined = await store.get(key);
          if (entry && entry.expiresAt < Date.now()) {
            await store.delete(key);
          }
        }

        await tx.done;
      })
    );
  }

  // Helper method for prefetching
  async prefetch<T>(
    storeName: 'queries' | 'images' | 'static',
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(storeName, key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    await this.set(storeName, key, data, ttl);
    return data;
  }

  // Subscribe to cache events
  onCacheChange(callback: (event: { type: string; key: string }) => void) {
    // Implement cache change notifications if needed
  }
}

export const cacheService = new CacheService();