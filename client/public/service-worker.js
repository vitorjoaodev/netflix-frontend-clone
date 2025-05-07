// Service Worker para Netflix Clone

const CACHE_NAME = 'netflix-clone-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images (9).jpg',
  '/assets/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg',
  '/assets/323ecca68b7105d23184e783b86b0c5a.jpg',
  '/assets/Screenshot+2024-09-25+at+1.42.30 PM.png',
  '/assets/Design sem nome (82).png',
  '/assets/Design sem nome (83).png'
];

// Instala o Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: network first, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Limpa caches antigos quando uma nova versão do service worker é ativada
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});