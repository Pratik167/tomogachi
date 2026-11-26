'use strict';

// Keep this namespace scoped to the game, including on a shared GitHub Pages origin.
const scope = self.registration.scope;
const cachePrefix = `achoo-pocket-cat:${scope}:`;
const cacheName = `${cachePrefix}v5`;
const home = new URL('./', scope);
const gamePage = new URL('index.html', scope);
const files = [
  'index.html',
  'achoo.css',
  'pixels.js',
  'sound.js',
  'audio/meow.wav',
  'audio/purr.wav',
  'app.webmanifest',
  'icons/achoo-180.png',
  'icons/achoo-192.png',
  'icons/achoo-512.png',
  'icons/achoo-maskable-512.png',
].map(path => new URL(path, scope).href);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => {
    return cache.addAll(files.map(url => new Request(url, {cache: 'reload'})));
  }));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const oldCaches = (await caches.keys())
      .filter(name => name.startsWith(cachePrefix) && name !== cacheName);
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isGameNavigation = request.mode === 'navigate' && url.origin === home.origin &&
    (url.pathname === home.pathname || url.pathname === gamePage.pathname);
  if (!isGameNavigation && !files.includes(url.href)) return;

  event.respondWith((async () => {
    const cacheKey = isGameNavigation ? gamePage.href : request;
    try {
      const response = await fetch(request);
      if (response.ok && !response.redirected) {
        const copy = response.clone();
        await caches.open(cacheName).then(cache => cache.put(cacheKey, copy)).catch(() => {});
      }
      return response;
    } catch (error) {
      const cache = await caches.open(cacheName);
      const saved = await cache.match(cacheKey);
      if (saved) return saved;
      throw error;
    }
  })());
});
