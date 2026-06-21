// public/service-worker.js
const CACHE_NAME = 'manhaji-cache-v1';

// تنصيب عامل الخدمة
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// تفعيل وتحديث الذاكرة
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// التقاط الطلبات وحفظها للعمل بدون إنترنت (Offline Mode)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف محفوظاً مسبقاً، اعرضه فوراً
      if (cachedResponse) {
        return cachedResponse;
      }
      // إذا لم يكن محفوظاً، اطلبه من الإنترنت ثم احفظه للمرات القادمة
      return fetch(event.request).then((response) => {
        // فلترة الطلبات غير الصالحة
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }).catch(() => {
      // في حال انقطاع النت وعدم وجود الملف، لا تفعل شيئاً (تجنب الانهيار)
      console.log('لا يوجد اتصال بالإنترنت وهذا الملف غير محفوظ.');
    })
  );
});