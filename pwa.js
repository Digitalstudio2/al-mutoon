/* عامل الخدمة (PWA) + لافتة تثبيت التطبيق أسفل الشاشة
   -----------------------------------------------------
   تسجيل عامل الخدمة لا يتم في:
   - بيئة التطوير (الفتح من الملفات مباشرة file://)
   - داخل إطار المعاينة (iframe)
   - مسارات تسجيل الدخول/OAuth
   ويمكن تعطيله مؤقتًا بإضافة ?sw=off إلى الرابط.

   لافتة «ثبّت التطبيق» تظهر فور فتح الرابط في أسفل الشاشة
   (شريط مضغوط بلا قوائم خطوات)، وتخفى نهائيًا بعد التثبيت. */
(function () {
  "use strict";

  function mark(state) {
    try {
      document.documentElement.setAttribute("data-sw", state);
    } catch (e) {}
  }

  function setAttr(name, value) {
    try {
      document.documentElement.setAttribute(name, value);
    } catch (e) {}
  }

  function flags() {
    var loc = window.location;
    var path = loc.pathname || "";
    var search = loc.search || "";
    return {
      inFrame: window.self !== window.top,
      isDev: loc.protocol !== "http:" && loc.protocol !== "https:",
      isAuth:
        /(^|\/)(login|signin|signin-|signout|logout|auth|oauth|session)(\/|$|\?|\.)/i.test(path) ||
        /(oauth|redirect_uri|access_token)/i.test(search),
      disabled: /[?&](?:sw=off|nosw=1)(?:&|$)/i.test(search)
    };
  }

  var F = flags();
  var skipAll = F.inFrame || F.isDev || F.isAuth || F.disabled;

  /* ==================== لافتة تثبيت التطبيق (أسفل الشاشة) ==================== */
  var deferredPrompt = null;
  var bannerOpen = false;
  var ua = navigator.userAgent || "";
  var isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /android/i.test(ua);
  var inWebView = isAndroid && /;\s*wv\)/i.test(ua);
  var standalone = false;
  try {
    standalone =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      (window.matchMedia && window.matchMedia("(display-mode: minimal-ui)").matches) ||
      navigator.standalone === true;
  } catch (e) {}

  function ensureBanner() {
    var ov = document.getElementById("instBanner");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "instBanner";
      ov.className = "inst-help";
      var card = document.createElement("div");
      card.className = "inst-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-live", "polite");
      ov.appendChild(card);
      ov.addEventListener("click", function (e) {
        if (e.target === ov) {
          ov.classList.remove("open");
          bannerOpen = false;
        }
      });
      document.body.appendChild(ov);
    }
    return ov;
  }

  /* سطر واحد مختصر بدل قائمة الخطوات */
  function hintLine(kind, intentUrl) {
    if (kind === "ios") {
      return '<p>اضغط زر <b>المشاركة</b> <span class="ic">⬆️</span> ثم اختر <b>«إضافة إلى الشاشة الرئيسية»</b> <span class="ic">➕</span>.</p>';
    }
    if (kind === "android") {
      return (
        '<p>من قائمة المتصفح <span class="ic">⋮</span> اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</p>' +
        (inWebView
          ? '<p><a class="btn btn-solid btn-sm" href="' + intentUrl + '">افتح في متصفح كروم</a></p>'
          : "")
      );
    }
    return '<p>من قائمة المتصفح <span class="ic">⋮</span> اختر <b>«تثبيت التطبيق»</b>.</p>';
  }

  function closeBanner(ov) {
    ov.classList.remove("open");
    bannerOpen = false;
  }

  function showBanner(kind) {
    if (standalone || bannerOpen) return;
    var ov = ensureBanner();
    var cardEl = ov.querySelector(".inst-card");
    var intentUrl =
      "intent://" +
      window.location.host +
      window.location.pathname +
      window.location.search +
      "#Intent;scheme=https;package=com.android.chrome;end";

    var actions =
      '<div class="inst-actions">' +
      (kind === "ios"
        ? ""
        : '<button type="button" class="btn btn-solid btn-sm" data-install>تثبيت الآن</button>') +
      '<button type="button" class="btn btn-outline btn-sm" data-close>' +
      (kind === "ios" ? "حسنًا" : "لاحقًا") +
      "</button></div>";

    cardEl.innerHTML =
      '<div class="inst-head">📲</div>' +
      '<div class="inst-body"><h4>ثبّت «متون الجزرية» كتطبيق</h4>' +
      (kind === "ios" || kind === "android" || (kind === "generic" && !deferredPrompt)
        ? hintLine(kind, intentUrl)
        : '<p>يعمل دون اتصال بعد التثبيت.</p>') +
      "</div>" +
      actions;

    var bi = cardEl.querySelector("[data-install]");
    if (bi) {
      bi.addEventListener("click", function () {
        if (deferredPrompt) {
          var p = deferredPrompt;
          deferredPrompt = null;
          try { p.prompt(); } catch (e) {}
          try {
            if (p.userChoice && p.userChoice.then) {
              p.userChoice.then(function () {
                closeBanner(ov);
              })["catch"](function () {
                closeBanner(ov);
              });
            } else {
              closeBanner(ov);
            }
          } catch (e) {
            closeBanner(ov);
          }
        } else {
          /* بلا حدث تثبيت: سطر إرشادي مختصر للمتصفح */
          cardEl.innerHTML =
            '<div class="inst-head">📲</div>' +
            '<div class="inst-body"><h4>ثبّت «متون الجزرية» كتطبيق</h4>' +
            hintLine(isIOS ? "ios" : isAndroid ? "android" : "generic", intentUrl) +
            "</div>" +
            '<div class="inst-actions"><button type="button" class="btn btn-outline btn-sm" data-close>حسنًا</button></div>';
          cardEl.querySelector("[data-close]").addEventListener("click", function () {
            closeBanner(ov);
          });
        }
      });
    }
    cardEl.querySelector("[data-close]").addEventListener("click", function () {
      closeBanner(ov);
    });

    ov.classList.add("open");
    bannerOpen = true;
  }

  function setupBanner() {
    if (standalone) {
      setAttr("data-install", "standalone");
      var sb = document.getElementById("installAppBtn");
      if (sb) sb.hidden = true;
      return;
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      setAttr("data-install", "ready");
      /* إن فُتحت اللافتة قبل وصول الحدث فزر «تثبيت الآن» سيستعمله عند النقر */
    });

    window.addEventListener("appinstalled", function () {
      deferredPrompt = null;
      mark("installed");
      setAttr("data-install", "done");
      var sb = document.getElementById("installAppBtn");
      if (sb) sb.hidden = true;
      var ov = document.getElementById("instBanner");
      if (ov) closeBanner(ov);
    });

    /* زر 📲 أعلى الصفحة: يثبّت مباشرة أو يستدعي اللافتة السفلية للإرشاد */
    var topBtn = document.getElementById("installAppBtn");
    if (topBtn) {
      topBtn.addEventListener("click", function () {
        if (deferredPrompt) {
          var p = deferredPrompt;
          deferredPrompt = null;
          try { p.prompt(); } catch (e) {}
          try {
            if (p.userChoice && p.userChoice.then) {
              p.userChoice.then(function () { topBtn.hidden = true; })["catch"](function () { topBtn.hidden = true; });
            }
          } catch (e) {
            topBtn.hidden = true;
          }
          return;
        }
        showBanner(isIOS ? "ios" : isAndroid ? "android" : "generic");
      });
    }

    /* تظهر فور فتح الرابط — دون أي تأخير */
    var kind = isIOS ? "ios" : deferredPrompt ? "installable" : isAndroid ? "android" : "generic";
    showBanner(kind);
  }

  if (!skipAll) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupBanner);
    } else {
      setupBanner();
    }
  }

  /* ==================== تسجيل عامل الخدمة ==================== */
  function register() {
    if (F.inFrame) {
      mark("skipped-frame");
      return;
    }
    if (F.isDev) {
      mark("skipped-dev");
      return;
    }
    if (F.isAuth) {
      mark("skipped-auth");
      return;
    }
    if (F.disabled) {
      mark("skipped-flag");
      return;
    }
    if (!("serviceWorker" in navigator)) {
      mark("unsupported");
      return;
    }

    navigator.serviceWorker
      .register("sw.js", { scope: "./" })
      .then(function (reg) {
        mark("registered");
        var sw = reg.installing || reg.waiting || reg.active;
        if (!sw) return;
        if (sw.state === "activated") {
          mark("active");
        }
        sw.addEventListener("statechange", function () {
          if (sw.state === "activated") {
            mark("active");
          }
        });
      })
      ["catch"](function () {
        mark("error");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", register);
  } else {
    register();
  }
})();
