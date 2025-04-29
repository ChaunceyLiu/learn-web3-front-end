// public/sw.ts (Next.js 15推荐路径)
const CACHE_NAME = 'v3-2025';
const OFFLINE_URL = '/offline-2025';

// 预缓存清单（自动生成）
declare const self: ServiceWorkerGlobalScope;
const PRECACHE_MANIFEST = self.__WB_MANIFEST || [
  { url: '/', revision: '20250419' },
  { url: '/styles.css', revision: 'v3' },
  { url: '/app.js', revision: 'v3' }
];

// ================= 安装阶段 =================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        OFFLINE_URL,
        ...PRECACHE_MANIFEST.map(item => item.url)
      ]))
      .then(() => self.skipWaiting()) // 2025推荐立即激活
  );
});

// ================= 激活阶段 =================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim()) // 2025推荐声明控制权
  );
});

// ================= 请求处理 =================
const networkFirstPaths = ['/api/', '/graphql'];
const cacheFirstPaths = ['/static/', '/_next/static'];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 策略路由
  if (networkFirstPaths.some(path => url.pathname.startsWith(path))) {
    event.respondWith(networkFirst(event));
  } else if (cacheFirstPaths.some(path => url.pathname.startsWith(path))) {
    event.respondWith(cacheFirst(event));
  } else {
    event.respondWith(cacheThenUpdate(event));
  }
});

// ================= 策略实现 =================
async function networkFirst(event: FetchEvent) {
  try {
    return await fetch(event.request);
  } catch (err) {
    const cache = await caches.open(CACHE_NAME);
    return cache.match(event.request) || Response.error();
  }
}

async function cacheFirst(event: FetchEvent) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(event.request);
  if (cached) return cached;
  
  const response = await fetch(event.request);
  if (response.ok) cache.put(event.request, response.clone());
  return response;
}

async function cacheThenUpdate(event: FetchEvent) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(event.request);
  const fetched = fetch(event.request)
    .then(async response => {
      if (response.ok) cache.put(event.request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || (await fetched) || caches.match(OFFLINE_URL);
}