/* عامل الخدمة (Service Worker) — متاح دون اتصال «كاملًا»
   الإصدار: 2026-10-19-أ (تلاوة أيمن سويد صارت ملفاتٍ محلية داخل الموقع بعد معالجتها،
   ومعها زرُّ «بلا تكرار» لعادل السنيد)
   - يتخزّن الموقع كاملًا مسبقًا عند التثبيت: كل الصفحات + التنسيقات + السكربتات
     + الأيقونات + manifest + ملف المصدر PDF + خطوط جوجل (بعد استخراج ملفاتها).
     أما ملفات الصوت (‏28 ميغابايت) فتُخدم بالتخزين أثناء أول استماع لا مسبقًا.
   - الاستراتيجيات عند التشغيل:
     • الصفحات (navigate): الشبكة أولًا NetworkFirst مع مهلة قصيرة ثم التخزين.
     • الأصول الثابتة (css/js/خطوط/صور/manifest): التخزين أولًا CacheFirst.
     • الصوت (mp3): بث فوري من الشبكة + تنزيل نسخة كاملة في الخلفية تُخزَّن،
       فتُخدم لاحقًا من التخزين ويُسمع دون اتصال (يدعم النطاقات Range).
       الملفات المحلية للسويد تُقدَّم Range من نسخة مخزّنة، فيبقى القفز إلى
       أي بيتٍ ممكنًا دون اتصال.
     • مسارات تسجيل الدخول وOAuth: مستثناة تمامًا (NetworkOnly).
   المكتبة: Workbox 7.1.0 (نسخة محلية داخل assets/vendor/workbox). */

importScripts(
  "assets/vendor/workbox/workbox-core.prod.js",
  "assets/vendor/workbox/workbox-routing.prod.js",
  "assets/vendor/workbox/workbox-strategies.prod.js"
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

const PAGES_CACHE = "pages-v6";
const ASSETS_CACHE = "assets-v6";
const SOURCES_CACHE = "sources-v6";
const AUDIO_CACHE = "audio-v6";

/* رابط ملف أنماط الخطوط كما هو مطلوب من صفحات الموقع — يجب أن يطابق حرفيًا */
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@300;400;500;700;800&display=swap";

/* قوائم التخزين المسبق (روابط نسبية لجذر الموقع + الجذر نفسه) */
const PRECACHE_PAGES = ["index.html", "matn.html", "nazim.html", "ikhtibar.html", "./"];
const PRECACHE_ASSETS = [
  "styles.css",
  "data.js",
  "script.js",
  "audio.js",
  "ikhtibar.js",
  "pwa.js",
  "manifest.webmanifest",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon-180.png",
];
const PRECACHE_SOURCES = ["assets/jazariyyah-source.pdf"];

/* يجلب رابطًا ويخزنه (يتجاوز وسيط المتصفح لضمان نسخة حديثة). أي فشل يُتجاهل
   حتى لا يتعطل التثبيت بسبب ملف واحد. */
async function putUrl(cacheName, url) {
  try {
    const cache = await caches.open(cacheName);
    const res = await fetch(new Request(url, { cache: "reload" }));
    if (res && (res.ok || res.type === "opaque")) {
      await cache.put(url, res);
      return true;
    }
  } catch (e) {}
  return false;
}

/* التخزين المسبق الكامل عند التثبيت */
self.addEventListener("activate", (event) => {
  const keep = [PAGES_CACHE, ASSETS_CACHE, SOURCES_CACHE, AUDIO_CACHE];
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (keep.indexOf(name) === -1) await caches.delete(name);
      }
      await self.clients.claim();
    })()
  );
});
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      for (const u of PRECACHE_PAGES) await putUrl(PAGES_CACHE, u);
      for (const u of PRECACHE_ASSETS) await putUrl(ASSETS_CACHE, u);
      for (const u of PRECACHE_SOURCES) await putUrl(SOURCES_CACHE, u);

      /* الخطوط: نخزّن ملف الأنماط ثم نستخرج منه روابط ملفات woff2 ونخزّنها */
      try {
        const cache = await caches.open(ASSETS_CACHE);
        let res = null;
        try {
          res = await fetch(new Request(FONT_CSS, { cache: "reload" }));
        } catch (e) {
          res = null;
        }
        if (res && (res.ok || res.type === "opaque")) {
          const forText = res.clone();
          await cache.put(FONT_CSS, res);
          let css = "";
          try {
            css = await forText.text();
          } catch (e) {
            css = "";
          }
          const found = css.match(/https:\/\/fonts\.gstatic\.com\/[^\s)"']+/g) || [];
          const uniq = Array.from(new Set(found));
          for (const u of uniq) await putUrl(ASSETS_CACHE, u);
        }
      } catch (e) {}
    })()
  );
});

/* ===== استثناء مسارات الدخول وOAuth ===== */
const isAuth = (url) =>
  /(^|\/)(login|signin|signin-|signout|logout|auth|oauth|session)(\/|$|\?|\.)/i.test(
    url.pathname + url.search
  ) || /(oauth|redirect_uri|access_token)/i.test(url.search);

const isSameOrigin = (url) => url.origin === self.location.origin;
const isFontHost = (url) => /^(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname);

/* 1) لا تخزين مؤقت إطلاقًا لمسارات الدخول/OAuth */
workbox.routing.registerRoute(
  ({ url }) => isAuth(url),
  new workbox.strategies.NetworkOnly()
);

/* 2) الصفحات: الشبكة أولًا */
workbox.routing.registerRoute(
  ({ request, url }) => request.mode === "navigate" && !isAuth(url) && !/\.pdf$/i.test(url.pathname),
  new workbox.strategies.NetworkFirst({
    cacheName: PAGES_CACHE,
    networkTimeoutSeconds: 4,
  })
);

/* 3) ملف المصدر PDF: التخزين أولًا (داخلي فقط) */
workbox.routing.registerRoute(
  ({ url }) => isSameOrigin(url) && /\.pdf$/i.test(url.pathname),
  new workbox.strategies.CacheFirst({ cacheName: SOURCES_CACHE })
);

/* 4) الأصول الثابتة (css/js/خطوط/صور/الأيقونات/manifest): التخزين أولًا */
workbox.routing.registerRoute(
  ({ request, url }) => {
    if (isAuth(url)) return false;
    if (!isSameOrigin(url) && !isFontHost(url)) return false;
    if (/manifest\.webmanifest$/i.test(url.pathname)) return true;
    return ["style", "script", "font", "image"].indexOf(request.destination) !== -1;
  },
  new workbox.strategies.CacheFirst({ cacheName: ASSETS_CACHE })
);

/* 5) الصوت: بث فوري من الشبكة + تخزين نسخة كاملة في الخلفية تُخدم لاحقًا دون اتصال */
const audioInflight = new Set();
const isAudioUrl = (url) => /\.mp3($|\?)/i.test(url.pathname + url.search);

async function downloadFullAudio(href) {
  if (audioInflight.has(href)) return;
  audioInflight.add(href);
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const hit = await cache.match(href, { ignoreVary: true });
    if (hit) return;
    let res = null;
    try {
      res = await fetch(href, { mode: "cors" });
    } catch (e) {
      res = null;
    }
    if (!res) {
      try {
        res = await fetch(href, { mode: "no-cors" });
      } catch (e) {
        res = null;
      }
    }
    if (res && (res.ok || res.type === "opaque")) {
      await cache.put(href, res);
    }
  } catch (e) {
  } finally {
    audioInflight.delete(href);
  }
}

/* نُبقي جسم آخر مقطع مخزّن في الذاكرة لتسريع تجزيء استجابات النطاق (206) */
let audioBuf = { href: "", buf: null };

/* يبني استجابة ٢٠٦ من نسخة مخزّنة كاملة عند طلب نطاق، كي يبقى القفز إلى البيت
   المحدد يعمل على الأجهزة التي تُخدَم من التخزين (أصل مشكلة «يقرأ من البداية»).
   يرجّع null إذا كانت النسخة غير مقروءة (opaque) أو الطلب غير صالح. */
async function rangedFromCached(hit, href, rangeHeader) {
  const m = /^bytes=(\d+)-(\d*)$/.exec(String(rangeHeader || "").trim());
  if (!m) return null;
  try {
    if (audioBuf.href !== href || !audioBuf.buf) {
      audioBuf = { href: href, buf: await hit.clone().arrayBuffer() };
    }
    const total = audioBuf.buf.byteLength;
    let s = parseInt(m[1], 10);
    let e = m[2] !== "" ? parseInt(m[2], 10) : total - 1;
    if (s > e || s >= total) return null;
    if (e >= total) e = total - 1;
    const body = audioBuf.buf.slice(s, e + 1);
    return new Response(body, {
      status: 206,
      statusText: "Partial Content",
      headers: {
        "Content-Type": hit.headers.get("Content-Type") || "audio/mpeg",
        "Content-Range": "bytes " + s + "-" + e + "/" + total,
        "Content-Length": String(body.byteLength),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (e) {
    return null;
  }
}

const audioHandler = {
  async handle({ request, url, event }) {
    if (request.method !== "GET") return undefined;
    const cache = await caches.open(AUDIO_CACHE);
    const hit = await cache.match(url.href, { ignoreVary: true });
    const rangeHeader = request.headers.get("range");
    if (hit) {
      if (!rangeHeader) return hit;
      /* طلب نطاق من نسخة مخزّنة: نبني ٢٠٦، وإلا نعتمد الشبكة كي لا يفقد
         المشغّل قدرة القفز إلى موضع البيت المطلوب */
      const ranged = await rangedFromCached(hit, url.href, rangeHeader);
      if (ranged) return ranged;
      try {
        return await fetch(request);
      } catch (e) {
        return hit;
      }
    }
    event.waitUntil(downloadFullAudio(url.href).catch(() => {}));
    try {
      return await fetch(request);
    } catch (e) {
      return undefined;
    }
  },
};

workbox.routing.registerRoute(
  ({ request, url }) => isAudioUrl(url) || request.destination === "audio",
  audioHandler
);
