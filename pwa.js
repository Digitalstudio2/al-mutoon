/* عامل الخدمة (PWA) + زر تنزيل التطبيق على الشاشة الرئيسية
   ---------------------------------------------------------
   تسجيل عامل الخدمة لا يتم في:
   - بيئة التطوير (الفتح من الملفات مباشرة file://)
   - داخل إطار المعاينة (iframe)
   - مسارات تسجيل الدخول/OAuth
   ويمكن تعطيله مؤقتًا بإضافة ?sw=off إلى الرابط.

   زر «تنزيل التطبيق» يظهر تلقائيًا في المتصفحات القابلة للتثبيت
   (حدث beforeinstallprompt في كروم/إيدج)، وعلى الآيفون/الآيباد يعرض
   خطوات الإضافة إلى الشاشة الرئيسية، ويختفي بعد التثبيت. */
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

  /* ==================== زر تنزيل التطبيق ==================== */
  var installBtn = null;
  var deferredPrompt = null;
  var ua = navigator.userAgent || "";
  var isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isMobile = isIOS || /android|mobile|opera mini|iemobile/i.test(ua);
  var standalone = false;
  try {
    standalone =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      (window.matchMedia && window.matchMedia("(display-mode: minimal-ui)").matches) ||
      navigator.standalone === true;
  } catch (e) {}

  function showBtn() {
    if (installBtn) installBtn.hidden = false;
  }
  function hideBtn() {
    if (installBtn) installBtn.hidden = true;
  }

  function showHelp(kind) {
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
        if (e.target === ov) ov.classList.remove("open");
      });
      document.body.appendChild(ov);
    }
    var cardEl = ov.querySelector(".inst-card");
    var steps =
      kind === "ios"
        ? '<h4>📲 تنزيل التطبيق على الشاشة الرئيسية</h4><p>على الآيفون والآيباد:</p>' +
          "<ol>" +
          '<li>اضغط زر <b>المشاركة</b> <span class="ic">⬆️</span> في شريط المتصفح.</li>' +
          '<li>اختر <b>«إضافة إلى الشاشة الرئيسية»</b> <span class="ic">➕</span>.</li>' +
          '<li>اضغط <b>«إضافة»</b> — وسيظهر التطبيق بأيقونته، ويعمل دون إنترنت.</li>' +
          "</ol>"
        : '<h4>📲 تنزيل التطبيق</h4><p>افتح قائمة المتصفح <span class="ic">⋮</span> ثم اختر:</p>' +
          "<ol>" +
          '<li><b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</li>' +
          "<li>ثم اضغط <b>«تثبيت/إضافة»</b> — وسيظهر التطبيق بأيقونته، ويعمل دون إنترنت.</li>" +
          "</ol>";
    cardEl.innerHTML =
      steps +
      '<div><button type="button" class="btn btn-solid btn-sm" data-close>حسنًا</button></div>';
    cardEl.querySelector("[data-close]").addEventListener("click", function () {
      ov.classList.remove("open");
    });
    ov.classList.add("open");
  }

  function setupInstall() {
    installBtn = document.getElementById("installAppBtn");
    if (!installBtn) return;

    if (standalone) {
      hideBtn();
      setAttr("data-install", "standalone");
      return;
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      showBtn();
      setAttr("data-install", "ready");
    });

    window.addEventListener("appinstalled", function () {
      deferredPrompt = null;
      hideBtn();
      mark("installed");
      setAttr("data-install", "done");
    });

    /* آيفون/آيباد (لا يدعم beforeinstallprompt) أو هاتف بلا حدث التثبيت:
       نُظهر الزر ليعرض خطوات الإضافة عند الضغط */
    if (isIOS || isMobile) showBtn();

    installBtn.addEventListener("click", function () {
      if (deferredPrompt) {
        var p = deferredPrompt;
        deferredPrompt = null;
        try {
          p.prompt();
        } catch (e) {}
        try {
          if (p.userChoice && p.userChoice.then) {
            p.userChoice.then(function () {
              hideBtn();
            })["catch"](function () {
              hideBtn();
            });
          } else {
            hideBtn();
          }
        } catch (e) {
          hideBtn();
        }
        return;
      }
      showHelp(isIOS ? "ios" : "generic");
    });
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
