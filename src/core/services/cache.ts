import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AppDBSchema extends DBSchema {
  cache: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiresAt: number;
    };
  };
}

class CacheService {
  private dbName = 'app-cache';
  private version = 1;
  private db: Promise<IDBPDatabase<AppDBSchema>>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return openDB<AppDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      },
    });
  }

  async set(key: string, data: any, ttl: number = 3600) {
    const db = await this.db;
    const now = Date.now();
    const expiresAt = now + ttl * 1000;

    await db.put('cache', {
      data,
      timestamp: now,
      expiresAt,
    }, key);
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.db;
    const cached = await db.get('cache', key);

    if (!cached) return null;

    if (cached.expiresAt < Date.now()) {
      await this.delete(key);
      return null;
    }

    return cached.data as T;
  }

  async delete(key: string) {
    const db = await this.db;
    await db.delete('cache', key);
  }

  async clear() {
    const db = await this.db;
    await db.clear('cache');
  }

  async clearExpired() {
    const db = await this.db;
    const tx = db.transaction('cache', 'readwrite');
    const store = tx.objectStore('cache');
    const keys = await store.getAllKeys();

    for (const key of keys) {
      const entry = await store.get(key);
      if (entry && entry.expiresAt < Date.now()) {
        await store.delete(key);
      }
    }

    await tx.done;
  }
}

export const cacheService = new CacheService();