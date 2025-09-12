const CACHE_NAME = 'jeju-workbook-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 설치 이벤트
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시 열기');
        return cache.addAll(urlsToCache);
      })
  );
});

// 활성화 이벤트
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch 이벤트
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          return response;
        }
        // 네트워크에서 가져오기
        return fetch(event.request);
      })
  );
});