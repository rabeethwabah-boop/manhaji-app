// public/service-worker.js
const CACHE_NAME = 'manhaji-v1';

// الملفات الأساسية للواجهة التي نريد حفظها لكي يفتح التطبيق بدون إنترنت
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css'
];

// 1. مرحلة التثبيت: حفظ الملفات الأساسية في ذاكرة الهاتف
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✓ تم حفظ واجهة تطبيق منهجي في الذاكرة المؤقتة');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. مرحلة التفعيل: حذف الكاش القديم إذا قمنا بتحديث التطبيق مستقبلاً
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 تنظيف الملفات المؤقتة القديمة');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. مرحلة جلب البيانات: تشغيل التطبيق من الذاكرة إذا لم يكن هناك إنترنت
self.addEventListener('fetch', (event) => {
  // استثناء روابط جوجل درايف والكتب من الكاش التلقائي (لأننا سنبرمج لها زراً خاصاً للتحميل)
  if (event.request.url.includes('drive.google.com') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف موجوداً في كاش الهاتف، افتحه فوراً (سريع جداً وبدون إنترنت)
      if (cachedResponse) {
        return cachedResponse;
      }

      // إذا لم يكن موجوداً، اذهب واجلبه من الإنترنت واحفظ نسخة منه للمستقبل
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // في حال انقطاع النت تماماً
        console.log('وضع عدم الاتصال نشط');
      });
    })
  );
});