/**
 * Service Worker for Lab Virtual IPA: Petualangan Pengukuran
 * Progressive Web App Offline Cache
 */

const CACHE_NAME = 'lab-pengukuran-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/virtual-lab.js',
  './js/quiz.js',
  './js/audio.js',
  './js/qrcode.min.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/slides/slide_01.jpg',
  './assets/slides/slide_02.jpg',
  './assets/slides/slide_03.jpg',
  './assets/slides/slide_04.jpg',
  './assets/slides/slide_05.jpg',
  './assets/slides/slide_06.jpg',
  './assets/slides/slide_07.jpg',
  './assets/slides/slide_08.jpg',
  './assets/slides/slide_09.jpg',
  './assets/slides/slide_10.jpg',
  './assets/slides/slide_11.jpg',
  './assets/slides/slide_12.jpg',
  './assets/slides/slide_13.jpg',
  './assets/slides/slide_14.jpg',
  './assets/slides/slide_15.jpg',
  './assets/slides/slide_16.jpg',
  './assets/modul/page_01.jpg',
  './assets/modul/page_02.jpg',
  './assets/modul/page_03.jpg',
  './assets/guides/User_Guide_Praktikum_Virtual_Jangka_Sorong/page_01.jpg',
  './assets/guides/User_Guide_Praktikum_Virtual_Neraca_Pegas/page_01.jpg',
  './assets/guides/User_Guide_Pengukuran_Waktu/page_01.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some assets could not be cached immediately:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
