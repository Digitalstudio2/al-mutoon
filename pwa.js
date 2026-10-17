/* تسجيل عامل الخدمة (PWA)
   لا يسجَّل في:
   - بيئة التطوير (الفتح من الملفات مباشرة file://)
   - داخل إطار المعاينة (iframe)
   - مسارات تسجيل الدخول/OAuth
   ويمكن تعطيله مؤقتًا بإضافة ?sw=off إلى الرابط. */
(function () {
  "use strict";

  function mark(state) {
    try {
      document.documentElement.setAttribute("data-sw", state);
    } catch (e) {}
  }

  function run() {
    var loc = window.location;
    var path = loc.pathname || "";
    var search = loc.search || "";
    var inFrame = window.self !== window.top;
    var isDev = loc.protocol !== "http:" && loc.protocol !== "https:";
    var isAuth =
      /(^|\/)(login|signin|signin-|signout|logout|auth|oauth|session)(\/|$|\?|\.)/i.test(path) ||
      /(oauth|redirect_uri|access_token)/i.test(search);
    var disabled = /[?&](?:sw=off|nosw=1)(?:&|$)/i.test(search);

    if (inFrame) {
      mark("skipped-frame");
      return;
    }
    if (isDev) {
      mark("skipped-dev");
      return;
    }
    if (isAuth) {
      mark("skipped-auth");
      return;
    }
    if (disabled) {
      mark("skipped-flag");
      return;
    }
    if (!("serviceWorker" in navigator)) {
      mark("unsupported");
      return;
    }

    navigator.serviceWorker.register("sw.js", { scope: "./" }).then(function (reg) {
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
    }).catch(function () {
      mark("error");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
