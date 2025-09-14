import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
}

// Offline storage utilities
export class OfflineStorage {
  private dbName = 'UltimateBibleDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('pendingPrayers')) {
          db.createObjectStore('pendingPrayers', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('cachedVerses')) {
          db.createObjectStore('cachedVerses', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('userNotes')) {
          db.createObjectStore('userNotes', { keyPath: 'id' });
        }
      };
    });
  }

  async storePendingPrayer(prayer: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pendingPrayers'], 'readwrite');
    const store = transaction.objectStore('pendingPrayers');
    
    return new Promise((resolve, reject) => {
      const request = store.add({ ...prayer, id: Date.now().toString() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingPrayers(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pendingPrayers'], 'readonly');
    const store = transaction.objectStore('pendingPrayers');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingPrayer(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pendingPrayers'], 'readwrite');
    const store = transaction.objectStore('pendingPrayers');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cacheVerse(verse: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['cachedVerses'], 'readwrite');
    const store = transaction.objectStore('cachedVerses');
    
    return new Promise((resolve, reject) => {
      const request = store.put(verse);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedVerse(id: string): Promise<any | null> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['cachedVerses'], 'readonly');
    const store = transaction.objectStore('cachedVerses');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();