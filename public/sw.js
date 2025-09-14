const CACHE_NAME = 'ultimate-bible-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/src/assets/app-icon.png',
  '/src/assets/hero-bible.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline prayer submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-prayer') {
    event.waitUntil(syncPrayers());
  }
});

async function syncPrayers() {
  try {
    // Get pending prayers from IndexedDB
    const pendingPrayers = await getPendingPrayers();
    
    for (const prayer of pendingPrayers) {
      try {
        await fetch('/api/prayers', {
          method: 'POST',
          body: JSON.stringify(prayer),
          headers: { 'Content-Type': 'application/json' }
        });
        
        // Remove from pending after successful sync
        await removePendingPrayer(prayer.id);
      } catch (error) {
        console.log('Failed to sync prayer:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
async function getPendingPrayers() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UltimateBibleDB', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingPrayers'], 'readonly');
      const store = transaction.objectStore('pendingPrayers');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function removePendingPrayer(prayerId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UltimateBibleDB', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingPrayers'], 'readwrite');
      const store = transaction.objectStore('pendingPrayers');
      const deleteRequest = store.delete(prayerId);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
  });
}