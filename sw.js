/* عامل الخدمة (Service Worker) — دعم العمل دون اتصال
   الاستراتيجية:
   - الصفحات (navigate): الشبكة أولًا NetworkFirst مع مهلة قصيرة ثم التخزين.
   - الملفات الثابتة ذات الأسماء المتغيرة/المرقّمة (css/js/fonts/images/pdf): التخزين أولًا CacheFirst.
   - مسارات تسجيل الدخول وOAuth: تُستثنى تمامًا من التخزين (NetworkOnly).
   المكتبة: Workbox 7.1.0 (نسخة محلية داخل assets/vendor/workbox). */

importScripts(
  "assets/vendor/workbox/workbox-core.prod.js",
  "assets/vendor/workbox/workbox-routing.prod.js",
  "assets/vendor/workbox/workbox-strategies.prod.js"
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

/* استثناء مسارات الدخول وOAuth */
const isAuth = (url) =>
  /(^|\/)(login|signin|signin-|signout|logout|auth|oauth|session)(\/|$|\?|\.)/i.test(
    url.pathname + url.search
  ) || /(oauth|redirect_uri|access_token)/i.test(url.search);

const isSameOrigin = (url) => url.origin === self.location.origin;
const isFontHost = (url) => /^(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname);

/* لا تخزين مؤقت إطلاقًا لمسارات الدخول/OAuth */
workbox.routing.registerRoute(
  ({ url }) => isAuth(url),
  new workbox.strategies.NetworkOnly()
);

/* الصفحات: الشبكة أولًا */
workbox.routing.registerRoute(
  ({ request, url }) => request.mode === "navigate" && !isAuth(url) && !/\.pdf$/i.test(url.pathname),
  new workbox.strategies.NetworkFirst({
    cacheName: "pages-v1",
    networkTimeoutSeconds: 4,
  })
);

/* ملف المصدر PDF: التخزين أولًا (داخلي فقط) */
workbox.routing.registerRoute(
  ({ url }) => isSameOrigin(url) && /\.pdf$/i.test(url.pathname),
  new workbox.strategies.CacheFirst({ cacheName: "sources-v1" })
);

/* الملفات الثابتة (css/js/خطوط/صور/الأيقونات/manifest): التخزين أولًا */
workbox.routing.registerRoute(
  ({ request, url }) => {
    if (isAuth(url)) return false;
    if (!isSameOrigin(url) && !isFontHost(url)) return false;
    if (/manifest\.webmanifest$/i.test(url.pathname)) return true;
    return ["style", "script", "font", "image"].indexOf(request.destination) !== -1;
  },
  new workbox.strategies.CacheFirst({ cacheName: "assets-v1" })
);
