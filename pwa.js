/* عامل الخدمة (PWA) + نافذة منبثقة لإعلام الزائر بإمكانية تثبيت الموقع كتطبيق
   ---------------------------------------------------------------------------
   تسجيل عامل الخدمة لا يتم في:
   - بيئة التطوير (الفتح من الملفات مباشرة file://)
   - داخل إطار المعاينة (iframe)
   - مسارات تسجيل الدخول/OAuth
   ويمكن تعطيله مؤقتًا بإضافة ?sw=off إلى الرابط.

   نافذة «ثبّت التطبيق» تظهر تلقائيًا عند زيارته (بعد ثوانٍ من نزول الصفحة)
   مرةً كل ٧ أيام كحدٍّ أقصى في المتصفحات القابلة للتثبيت، وعلى الآيفون/الآيباد
   تعرض خطوات الإضافة إلى الشاشة الرئيسية. تختفي نهائيًا بعد التثبيت. */
(function () {
  "use strict";

  var LS_KEY = "jazariyyah-inst-popup"; /* آخر ظهور/إجابة الزائر */
  var COOLDOWN = 7 * 24 * 3600 * 1000;  /* أسبوع واحد */

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

  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
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

  /* ==================== نافذة تثبيت التطبيق ==================== */
  var deferredPrompt = null;
  var ua = navigator.userAgent || "";
  var isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isMobile = isIOS || /android|mobile|opera mini|iemobile/i.test(ua);
  var isAndroid = /android/i.test(ua);
  var inWebView = isAndroid && /;\s*wv\)/i.test(ua);
  var popupOpen = false;
  var standalone = false;
  try {
    standalone =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      (window.matchMedia && window.matchMedia("(display-mode: minimal-ui)").matches) ||
      navigator.standalone === true;
  } catch (e) {}

  /* هل يحقّ لنا عرض النافذة هذه الزيارة؟ (مرّ أسبوع عن آخر ظهور) */
  function cooldownPassed() {
    var last = parseInt(lsGet(LS_KEY) || "0", 10);
    if (!last || isNaN(last)) return true;
    return Date.now() - last > COOLDOWN;
  }
  function recordPopup() {
    lsSet(LS_KEY, String(Date.now()));
  }

  function ensureOverlay() {
    var ov = document.getElementById("instHelp");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "instHelp";
      ov.className = "inst-help";
      var card = document.createElement("div");
      card.className = "inst-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-modal", "true");
      ov.appendChild(card);
      ov.addEventListener("click", function (e) {
        if (e.target === ov) {
          ov.classList.remove("open");
          popupOpen = false;
          recordPopup();
        }
      });
      document.body.appendChild(ov);
    }
    return ov;
  }

  function stepsHtml(kind, intentUrl) {
    if (kind === "ios") {
      return (
        '<h4>📲 ثبّت «متون الجزرية» كتطبيق</h4><p>يعمل دون اتصال بعد التثبيت، على الآيفون والآيباد:</p>' +
        "<ol>" +
        '<li>اضغط زر <b>المشاركة</b> <span class="ic">⬆️</span> في شريط المتصفح.</li>' +
        '<li>اختر <b>«إضافة إلى الشاشة الرئيسية»</b> <span class="ic">➕</span>.</li>' +
        '<li>اضغط <b>«إضافة»</b> — وسيظهر التطبيق بأيقونته، ويعمل دون إنترنت.</li>' +
        "</ol>"
      );
    }
    if (kind === "android") {
      return (
        '<h4>📲 ثبّت «متون الجزرية» كتطبيق</h4><p>يعمل دون اتصال بعد التثبيت، على أندرويد (متصفح كروم):</p>' +
        "<ol>" +
        '<li>اضغط زر المزيد <span class="ic">⋮</span> في شريط المتصفح.</li>' +
        '<li>اختر <b>«تثبيت التطبيق»</b> — أو <b>«إضافة إلى الشاشة الرئيسية»</b> في الإصدارات الأقدم.</li>' +
        '<li>اضغط <b>«تثبيت»</b> — وسيظهر التطبيق بأيقونته، ويعمل دون إنترنت.</li>' +
        "</ol>" +
        '<p class="inst-note">إن لم يظهر خيار التثبيت: تأكد أنك في <b>متصفح كروم</b> (أو متصفح سامسونج إنترنت) لا داخل تطبيق آخر، وحدِّث المتصفح و«خدمات Google Play» من متجر Play، ثم أعد فتح الرابط وانتظر قليلًا قبل المحاولة.</p>' +
        (inWebView
          ? '<p><a class="btn btn-solid btn-sm" href="' + intentUrl + '">افتح في متصفح كروم</a></p>'
          : "")
      );
    }
    return (
      '<h4>📲 ثبّت «متون الجزرية» كتطبيق</h4><p>يعمل دون اتصال بعد التثبيت، في متصفحك:</p>' +
      "<ol>" +
      '<li>افتح قائمة المتصفح <span class="ic">⋮</span> ثم اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</li>' +
      "<li>ثم اضغط <b>«تثبيت/إضافة»</b> — وسيظهر التطبيق بأيقونته، ويعمل دون إنترنت.</li>" +
      "</ol>"
    );
  }

  function showPopup(kind) {
    if (standalone || popupOpen) return;
    var ov = ensureOverlay();
    var cardEl = ov.querySelector(".inst-card");
    var intentUrl =
      "intent://" +
      window.location.host +
      window.location.pathname +
      window.location.search +
      "#Intent;scheme=https;package=com.android.chrome;end";

    var havePrompt = !!deferredPrompt;
    var installBtnHtml = (kind === "ios")
      ? ""
      : '<button type="button" class="btn btn-solid btn-sm" data-install>تثبيت الآن</button>&nbsp;';

    cardEl.innerHTML =
      stepsHtml(kind, intentUrl) +
      '<div class="inst-actions">' +
      installBtnHtml +
      '<button type="button" class="btn btn-outline btn-sm" data-close>لاحقًا</button>' +
      "</div>";

    cardEl.querySelector("[data-close]").addEventListener("click", function () {
      ov.classList.remove("open");
      popupOpen = false;
      recordPopup();
    });
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
                ov.classList.remove("open");
                popupOpen = false;
                recordPopup();
              })["catch"](function () {
                ov.classList.remove("open");
                popupOpen = false;
                recordPopup();
              });
            } else {
              ov.classList.remove("open");
              popupOpen = false;
              recordPopup();
            }
          } catch (e) {
            ov.classList.remove("open");
            popupOpen = false;
            recordPopup();
          }
        } else {
          /* بلا حدث تثبيت: نستبدل المحتوى بخطوات المتصفح */
          cardEl.innerHTML =
            stepsHtml(isIOS ? "ios" : isAndroid ? "android" : "generic", intentUrl) +
            '<div class="inst-actions"><button type="button" class="btn btn-outline btn-sm" data-close>حسنًا</button></div>';
          cardEl.querySelector("[data-close]").addEventListener("click", function () {
            ov.classList.remove("open");
            popupOpen = false;
            recordPopup();
          });
        }
      });
    }
    ov.classList.add("open");
    popupOpen = true;
    recordPopup();
  }

  function setupInstall() {
    if (standalone) {
      setAttr("data-install", "standalone");
      return;
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      setAttr("data-install", "ready");
    });

    window.addEventListener("appinstalled", function () {
      deferredPrompt = null;
      mark("installed");
      setAttr("data-install", "done");
      var ov = document.getElementById("instHelp");
      if (ov) {
        ov.classList.remove("open");
        popupOpen = false;
      }
    });

    /* متى تظهر النافذة:
       - آيفون/آيباد: بعد نزول الصفحة قليلًا (لا يوجد إشعار تثبيت تلقائي).
       - كروم/إيدج وأندرويد: عند وصول حدث beforeinstallprompt، أو بعد ٦ ثوانٍ إن تأخّر. */
    if (cooldownPassed()) {
      window.setTimeout(function () {
        if (standalone || popupOpen || cooldownPassed() === false) return;
        if (isIOS) {
          showPopup("ios");
        } else if (deferredPrompt) {
          showPopup("installable");
        } else {
          window.setTimeout(function () {
            if (standalone || popupOpen || deferredPrompt) return;
            showPopup("installable");
          }, 6000);
        }
      }, 1500);
    }
  }

  if (!skipAll) setupInstall();

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
