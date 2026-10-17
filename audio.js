/* ============================================================
   متون الجزرية لابن الجزري — مشغّل التلاوة الصوتية
   التلاوتان: الشيخ أيمن رشدي سويد · الشيخ عادل السنيد
   مع التتبّع مع التلاوة (تعليم البيت المقروء والانتقال إليه)
   ============================================================ */
(function () {
  "use strict";

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- إعداد التلاوتين ----------
     المصدران متاحان للاستماع المباشر (بثّ) دون تحميل.
     لكل مقطع: f = اسم الملف، و v = [أول بيت، آخر بيت] يُتلى فيه.
     وبمدى الأبيات هذا نستطيع تقدير البيت المقروء لحظةً بلحظة. */
  function sw(n, a, b) { return { f: pad2(n) + ".mp3", v: [a, b] }; }
  function sn(n, a, b) { return { f: "ar_" + pad2(n) + "_Jazari_Introduction_Sinead.mp3", v: [a, b] }; }

  var RECITERS = [
    {
      id: "suwaid",
      name: "الشيخ أيمن رشدي سويد",
      short: "أيمن سويد",
      source: "archive.org",
      srcUrl: "https://archive.org/details/sh-ayman-sowaid-matn-aljazareiiah",
      base: "https://archive.org/download/sh-ayman-sowaid-matn-aljazareiiah/",
      full: sw(0, 1, 109), /* متن الجزرية كاملًا */
      tracks: [
        [sw(2, 1, 8)],                          /* المقدمة */
        [sw(3, 9, 19)],                         /* مخارج الحروف */
        [sw(4, 20, 26)],                        /* الصفات */
        [sw(5, 27, 33)],                        /* التجويد */
        [sw(6, 34, 40)],                        /* الترقيق (مع استعمال الحروف) */
        [sw(6, 34, 40)],                        /* استعمال الحروف */
        [sw(7, 41, 43)],                        /* الراءات */
        [sw(8, 44, 51)],                        /* اللامات */
        [sw(9, 52, 59)],                        /* الضاد والظاء */
        [sw(10, 60, 61)],                       /* التحذيرات */
        [sw(11, 62, 64), sw(12, 65, 68)],       /* أحكام النون والميم والتنوين */
        [sw(13, 69, 72)],                       /* المدات */
        [sw(14, 73, 78)],                       /* معرفة الوقوف */
        [sw(15, 79, 93)],                       /* المقطوع والموصول */
        [sw(16, 94, 100)],                      /* التاءات */
        [sw(17, 101, 105)],                     /* همز الوصل */
        [sw(18, 106, 109)],                     /* الخاتمة */
      ],
    },
    {
      id: "snayd",
      name: "الشيخ عادل السنيد",
      short: "عادل السنيد",
      source: "islamhouse.com",
      srcUrl: "https://islamhouse.com/ar/audios/327602",
      base: "https://d1.islamhouse.com/data/ar/ih_sounds/chain/Reading_Matn_Of_Jazari_Introduction/ar_Jazari_Introduction_Sinead/",
      full: null,
      tracks: [
        [sn(1, 1, 8)],                          /* مقدمة المتن */
        [sn(2, 9, 19)],                         /* باب مخارج الحروف */
        [sn(3, 20, 26)],                        /* باب الصفات */
        [sn(4, 27, 33)],                        /* باب التجويد */
        [sn(5, 34, 40)],                        /* باب التفخيم والترقيق */
        [sn(5, 34, 40)],                        /* باب استعمال الحروف */
        [sn(6, 41, 43)],                        /* باب الراءات */
        [sn(7, 44, 49), sn(8, 50, 51)],         /* اللامات + الإدغام والإظهار */
        [sn(9, 52, 61)],                        /* الضاد والظاء */
        [sn(9, 52, 61)],                        /* التحذيرات */
        [sn(10, 62, 64), sn(11, 65, 68)],       /* الميم والنون · حكم التنوين */
        [sn(12, 69, 72)],                       /* المد والقصر */
        [sn(13, 73, 78)],                       /* معرفة الوقوف */
        [sn(14, 79, 93)],                       /* المقطوع والموصول وحكم التاء */
        [sn(15, 94, 100)],                      /* التاءات */
        [sn(16, 101, 105)],                     /* همز الوصل */
        [sn(17, 106, 109)],                     /* الخاتمة */
      ],
    },
  ];

  /* ---------- أدوات ---------- */
  var AR = "٠١٢٣٤٥٦٧٨٩";
  function arNum(n) { return String(n).replace(/\d/g, function (d) { return AR[+d]; }); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    sec = Math.floor(sec);
    return arNum(Math.floor(sec / 60)) + ":" + arNum(pad2(sec % 60));
  }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function hasMatn() { return typeof MATN !== "undefined" && MATN.length > 0; }
  function lastBab() { return hasMatn() ? MATN.length - 1 : 0; }
  function shortTitle(i) {
    if (!hasMatn() || !MATN[i]) return "";
    return String(MATN[i].title).replace(/^بابُ\s*/, "");
  }
  function verseCount(i) { return hasMatn() && MATN[i] ? MATN[i].verses.length : 0; }
  function babId(i) { return hasMatn() && MATN[i] ? MATN[i].id : ""; }
  function firstVerse(i) { return hasMatn() && MATN[i] ? MATN[i].verses[0].n : null; }

  /* خريطة: رقم البيت ← فهرس الباب */
  var VERSE2BAB = {};
  function buildVerseMap() {
    if (!hasMatn()) return;
    MATN.forEach(function (b, i) {
      b.verses.forEach(function (v) { VERSE2BAB[v.n] = i; });
    });
  }

  /* ---------- الحالة ---------- */
  var LS_KEY = "jazariyyah-audio";
  var state = { reciter: 0, index: 0, part: 0, rate: 1, loop: false, follow: false, mini: false };
  var curVerse = null;      /* البيت المقروء الآن (تقديرًا) */
  var verseStop = null;     /* البيت المطلوب التوقّف عند نهايته (استماع لبيتٍ واحد) */
  var verseStopFrac = 0;    /* نسبة نهاية ذلك البيت داخل المقطع (تُلتقط عند البدء) */
  var noticeVerse = null;   /* البيت المعروض في شريط «تم الحفظ» */
  var audio = null;
  var ui = {};
  var built = false;
  var followPauseUntil = 0; /* توقّف التتبّع مؤقتًا إن مرّر المستخدم الصفحة */

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        reciter: state.reciter, index: state.index, rate: state.rate,
        loop: state.loop, follow: state.follow, verse: curVerse,
      }));
    } catch (e) {}
  }
  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      if (typeof s.reciter === "number" && RECITERS[s.reciter]) state.reciter = s.reciter;
      if (typeof s.index === "number" && s.index >= -1 && s.index <= lastBab()) state.index = s.index;
      if (typeof s.rate === "number" && s.rate > 0) state.rate = s.rate;
      if (typeof s.loop === "boolean") state.loop = s.loop;
      if (typeof s.follow === "boolean") state.follow = s.follow;
      if (typeof s.verse === "number") curVerse = s.verse;
    } catch (e) {}
    if (hasMatn()) {
      var h = (location.hash || "").replace("#", "");
      if (h) {
        for (var i = 0; i < MATN.length; i++) {
          if (MATN[i].id === h) { state.index = i; break; }
        }
      }
    }
  }

  function isFull() { return state.index < 0; }
  function parts() {
    if (isFull()) return [];
    var t = RECITERS[state.reciter].tracks[state.index];
    return t || [];
  }
  function trackOf() {
    if (isFull()) return RECITERS[state.reciter].full;
    var list = parts();
    if (!list.length) return null;
    return list[Math.min(Math.max(state.part, 0), list.length - 1)];
  }
  function trackUrl() {
    var rec = RECITERS[state.reciter];
    if (isFull() && rec.full) return rec.base + rec.full.f;
    var t = trackOf();
    return t ? rec.base + t.f : "";
  }
  function partOfVerse(i, n) {
    var list = RECITERS[state.reciter].tracks[i] || [];
    for (var p = 0; p < list.length; p++) {
      if (list[p].v && n >= list[p].v[0] && n <= list[p].v[1]) return p;
    }
    return 0;
  }

  /* ---------- البناء ---------- */
  function build() {
    var mount = document.getElementById("playerMount");
    if (!mount) return false;

    mount.innerHTML =
      '<div class="player" id="player" role="region" aria-label="مشغّل التلاوة">' +
        '<div class="pl-inner container">' +
          '<button class="pl-btn pl-play" id="plPlay" type="button" aria-label="تشغيل">▶</button>' +
          '<div class="pl-now">' +
            '<span class="pl-title" id="plTitle">—</span>' +
            '<span class="pl-sub" id="plSub">—</span>' +
          '</div>' +
          '<div class="pl-seek">' +
            '<span class="pl-time" id="plCur">٠:٠٠</span>' +
            '<input type="range" id="plSeek" min="0" max="1000" step="1" value="0" aria-label="موضع التشغيل" />' +
            '<span class="pl-time" id="plDur">٠:٠٠</span>' +
          '</div>' +
          '<div class="pl-nav">' +
            '<button class="pl-btn pl-ico" id="plPrev" type="button" aria-label="الباب السابق" title="الباب السابق">⏮</button>' +
            '<button class="pl-btn pl-ico" id="plNext" type="button" aria-label="الباب التالي" title="الباب التالي">⏭</button>' +
          '</div>' +
          '<button class="pl-btn pl-ico pl-follow" id="plFollow" type="button" aria-label="التتبّع مع التلاوة" title="التتبّع مع التلاوة: تنقّل الصفحة تلقائيًا مع البيت المقروء">🎯</button>' +
          '<button class="pl-btn pl-ico pl-goto" id="plGoto" type="button" aria-label="الرجوع إلى المتن" title="الرجوع إلى موضع التلاوة في المتن">📖</button>' +
          '<div class="pl-set">' +
            '<select class="pl-sel" id="plReciter" aria-label="القارئ" title="القارئ"></select>' +
            '<select class="pl-sel" id="plBab" aria-label="الموضع" title="الموضع"></select>' +
            '<select class="pl-sel" id="plRate" aria-label="السرعة" title="سرعة التلاوة">' +
              '<option value="0.75">٠٫٧٥×</option>' +
              '<option value="1">١×</option>' +
              '<option value="1.25">١٫٢٥×</option>' +
              '<option value="1.5">١٫٥×</option>' +
              '<option value="1.75">١٫٧٥×</option>' +
              '<option value="2">٢×</option>' +
            '</select>' +
          '</div>' +
          '<button class="pl-btn pl-ico pl-loop" id="plLoop" type="button" aria-label="تكرار المقطع" title="تكرار المقطع">🔁</button>' +
          '<button class="pl-btn pl-ico pl-toggle" id="plMini" type="button" aria-label="تصغير المشغّل" title="تصغير / توسيع">⌄</button>' +
        '</div>' +
        '<div class="pl-err" id="plErr"></div>' +
        '<audio id="plAudio" preload="none"></audio>' +
      '</div>';

    ui.player  = document.getElementById("player");
    ui.play    = document.getElementById("plPlay");
    ui.prev    = document.getElementById("plPrev");
    ui.next    = document.getElementById("plNext");
    ui.follow  = document.getElementById("plFollow");
    ui.goto    = document.getElementById("plGoto");
    ui.title   = document.getElementById("plTitle");
    ui.sub     = document.getElementById("plSub");
    ui.cur     = document.getElementById("plCur");
    ui.dur     = document.getElementById("plDur");
    ui.seek    = document.getElementById("plSeek");
    ui.reciter = document.getElementById("plReciter");
    ui.bab     = document.getElementById("plBab");
    ui.rate    = document.getElementById("plRate");
    ui.loop    = document.getElementById("plLoop");
    ui.mini    = document.getElementById("plMini");
    ui.err     = document.getElementById("plErr");
    audio      = document.getElementById("plAudio");

    ui.reciter.innerHTML = RECITERS.map(function (r) {
      return '<option value="' + r.id + '">' + esc(r.short || r.name) + "</option>";
    }).join("");

    var opts = '<option value="-1">المتن كاملاً</option>';
    if (hasMatn()) {
      opts += MATN.map(function (b, i) {
        return '<option value="' + i + '">' + arNum(b.num) + " — " + esc(String(b.title).replace(/^بابُ\s*/, "")) + "</option>";
      }).join("");
    }
    ui.bab.innerHTML = opts;

    bind();
    built = true;
    return true;
  }

  /* ---------- الأحداث ---------- */
  function bind() {
    ui.play.addEventListener("click", toggle);

    ui.seek.addEventListener("input", function () {
      verseStop = null; /* المستخدم يتحكّم بالموضع يدويًا */
      if (audio.duration) {
        var t = (parseFloat(ui.seek.value) / 1000) * audio.duration;
        if (isFinite(t)) { audio.currentTime = t; ui.cur.textContent = fmt(t); followTick(); }
      }
    });

    ui.reciter.addEventListener("change", function () {
      var r = 0;
      for (var i = 0; i < RECITERS.length; i++) if (RECITERS[i].id === ui.reciter.value) r = i;
      if (r === state.reciter) return;
      state.reciter = r;
      if (state.index < 0 && !RECITERS[r].full) state.index = 0;
      state.part = 0;
      curVerse = null;
      saveState();
      load(!audio.paused);
    });

    ui.bab.addEventListener("change", function () {
      var v = parseInt(ui.bab.value, 10);
      playIndex(isNaN(v) ? 0 : v);
    });

    ui.rate.addEventListener("change", function () {
      state.rate = parseFloat(ui.rate.value) || 1;
      try { audio.playbackRate = state.rate; } catch (e) {}
      saveState();
    });

    ui.loop.addEventListener("click", function () {
      state.loop = !state.loop;
      saveState(); syncUI();
    });

    ui.follow.addEventListener("click", function () { setFollow(!state.follow, true); });
    ui.goto.addEventListener("click", gotoMatn);
    ui.mini.addEventListener("click", function () { setMini(!state.mini); });
    ui.prev.addEventListener("click", function () { step(-1); });
    ui.next.addEventListener("click", function () { step(1); });

    audio.addEventListener("timeupdate", function () {
      ui.cur.textContent = fmt(audio.currentTime);
      if (audio.duration && isFinite(audio.duration)) {
        ui.seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
      }
      /* توقّف عند نهاية البيت المطلوب (استماع لبيتٍ واحد) */
      if (verseStop != null && audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        var endF = verseStopFrac;
        if (endF > 0 && audio.currentTime >= endF * audio.duration - 0.06) {
          var vs = verseStop;
          verseStop = null;
          try { audio.pause(); } catch (e) {}
          syncUI();
          verseEnded(vs);
        }
      }
      followTick();
    });
    audio.addEventListener("loadedmetadata", function () {
      ui.dur.textContent = fmt(audio.duration);
      try { audio.playbackRate = state.rate; } catch (e) {}
      hideNotice();
      if (pendingSeekFrac > 0 && audio.duration) {
        try { audio.currentTime = pendingSeekFrac * audio.duration; } catch (e) {}
        pendingSeekFrac = 0;
      }
    });
    audio.addEventListener("play", function () { hideNotice(); syncUI(); });
    audio.addEventListener("pause", syncUI);
    audio.addEventListener("ended", function () {
      if (verseStop != null) {
        var vs = verseStop;
        verseStop = null;
        syncUI();
        verseEnded(vs);
        return;
      }
      if (state.loop) {
        try { audio.currentTime = 0; } catch (e) {}
        tryPlay();
        return;
      }
      var list = parts();
      if (!isFull() && state.part < list.length - 1) {
        state.part++;
        curVerse = null;
        load(true);
        return;
      }
      if (isFull()) { syncUI(); return; }
      if (state.index < lastBab()) playIndex(state.index + 1);
      else syncUI();
    });
    audio.addEventListener("error", function () {
      if (!audio.src) return;
      notice("تعذّر تحميل المقطع الصوتي — تأكّد من الاتصال بالإنترنت.", false);
      syncUI();
    });

    /* أزرار "استماع" الموزّعة في الصفحة */
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-listen]") : null;
      if (!t) return;
      e.preventDefault();
      var i = parseInt(t.getAttribute("data-listen"), 10);
      playIndex(isNaN(i) ? 0 : i);
    });

    /* «البيت التالي» من شريط انتهاء البيت */
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-pl-next-verse]") : null;
      if (!t) return;
      e.preventDefault();
      var n = parseInt(t.getAttribute("data-pl-next-verse"), 10);
      if (n > 0) playVerse(n + 1);
    });

    /* عند تعليم البيت محفوظًا نحدّث شريط الانتهاء */
    document.addEventListener("jazhifz:change", function (ev) {
      var d = (ev && ev.detail) || {};
      if (d.reset) { hideNotice(); return; }
      if (noticeVerse != null && d.verse === noticeVerse) verseEnded(noticeVerse);
    });

    /* إن مرّر المستخدم الصفحة بنفسه نتوقّف عن التنقّل التلقائي قليلًا */
    var manual = function () { if (state.follow) followPauseUntil = Date.now() + 10000; };
    window.addEventListener("wheel", manual, { passive: true });
    window.addEventListener("touchmove", manual, { passive: true });

    window.addEventListener("resize", fit);
  }

  /* ---------- التشغيل ---------- */
  var pendingSeekFrac = 0;

  /* موضع بداية الباب داخل المقطع (لأن بعض المقاطع تجمع بابين) */
  function startFraction() {
    if (isFull()) return 0;
    var t = trackOf();
    if (!t || !t.v) return 0;
    var first = firstVerse(state.index);
    if (first == null || first <= t.v[0]) return 0;
    var span = t.v[1] - t.v[0] + 1;
    if (span <= 0) return 0;
    var f = (first - t.v[0]) / span;
    return f > 0 && f < 0.95 ? f : 0;
  }

  function load(andPlay, fracOverride) {
    hideNotice();
    if (typeof fracOverride === "number") {
      pendingSeekFrac = fracOverride; /* تشغيل بيتٍ واحد: نبدأ من موضعه */
    } else {
      verseStop = null;               /* تشغيل بابٍ كامل: لا توقّف عند بيت */
      pendingSeekFrac = startFraction();
    }
    audio.src = trackUrl();
    try { audio.playbackRate = state.rate; } catch (e) {}
    ui.seek.value = "0";
    ui.cur.textContent = fmt(0);
    ui.dur.textContent = fmt(0);
    syncUI();
    markBab(currentBabIndex());
    if (andPlay) tryPlay();
  }
  function tryPlay() {
    var p = audio.play();
    if (p && p.catch) {
      p.catch(function (e) {
        if (e && e.name === "NotAllowedError") {
          notice("اضغط ▶ لاستئناف التلاوة" + (curVerse != null ? " من البيت " + arNum(curVerse) : "") + ".", true);
        } else {
          notice("تعذّر تشغيل المقطع الصوتي.", false);
        }
      });
    }
  }
  function toggle() {
    if (!audio.src) { load(true); return; }
    if (audio.paused) tryPlay();
    else audio.pause();
  }
  function notice(text, hint, actions) {
    ui.err.innerHTML = esc(text) + (actions || "");
    ui.err.classList.toggle("hint", !!hint);
    ui.err.classList.add("show");
  }
  function hideNotice() { noticeVerse = null; ui.err.classList.remove("show"); }

  function playIndex(i) {
    if (!hasMatn()) return;
    if (i < 0 && !RECITERS[state.reciter].full) i = 0;
    if (i > lastBab()) i = lastBab();
    if (i < -1) i = 0;
    state.index = i;
    state.part = 0;
    curVerse = null;
    saveState();
    load(true);
    /* مع التتبّع: ننتقل في الصفحة إلى الباب المختار */
    if (state.follow && !isFull()) {
      var el = document.querySelector('.bayt[data-n="' + firstVerse(state.index) + '"]') ||
               document.getElementById(babId(state.index));
      if (el) ensureVisible(el, true);
    }
  }
  function step(d) {
    if (isFull()) { playIndex(d > 0 ? 0 : lastBab()); return; }
    var i = state.index + d;
    if (i < 0) i = lastBab();
    if (i > lastBab()) i = 0;
    playIndex(i);
  }

  /* ---------- التتبّع مع التلاوة ---------- */
  function estimatedVerse() {
    var t = trackOf();
    if (!t || !t.v || !audio) return null;
    var d = audio.duration;
    if (!d || !isFinite(d) || d <= 0) return null;
    var a = t.v[0], n = t.v[1] - t.v[0] + 1;
    if (n <= 0) return null;
    var f = audio.currentTime / d;
    if (!(f >= 0)) return null;
    if (f > 0.999) f = 0.999;
    return a + Math.floor(f * n);
  }

  function currentBabIndex() {
    if (curVerse != null && typeof VERSE2BAB[curVerse] === "number") return VERSE2BAB[curVerse];
    return isFull() ? -1 : state.index;
  }

  /* إن انتقلت التلاوة إلى بابٍ آخر داخل المقطع نفسه نحدّث الموضع المعروض */
  function syncIndexToVerse(n) {
    var t = VERSE2BAB[n];
    if (typeof t !== "number" || isFull() || t === state.index) return;
    state.index = t;
    state.part = partOfVerse(t, n);
    syncUI();
  }

  function followTick() {
    var n = estimatedVerse();
    if (n === null || n === curVerse) return;
    curVerse = n;
    syncIndexToVerse(n);
    paintVerse(n, state.follow);
    saveState();
  }

  function paintVerse(n, withScroll) {
    each(document.querySelectorAll(".bayt.reciting"), function (el) { el.classList.remove("reciting"); });
    var el = document.querySelector('.bayt[data-n="' + n + '"]');
    if (el) el.classList.add("reciting");
    markBab(currentBabIndex());
    if (ui.sub) ui.sub.textContent = subText();
    if (withScroll && el && Date.now() > followPauseUntil) ensureVisible(el, false);
  }

  function markBab(i) {
    each(document.querySelectorAll(".bab-sec.playing"), function (el) { el.classList.remove("playing"); });
    each(document.querySelectorAll(".toc a.playing"), function (el) { el.classList.remove("playing"); });
    each(document.querySelectorAll("[data-listen].playing"), function (el) { el.classList.remove("playing"); });
    if (typeof i !== "number" || i < 0) return;
    var id = babId(i);
    if (!id) return;
    var sec = document.getElementById(id);
    if (sec) sec.classList.add("playing");
    var link = document.querySelector('.toc a[data-target="' + id + '"]');
    if (link) link.classList.add("playing");
    var btn = document.querySelector('[data-listen="' + i + '"]');
    if (btn) btn.classList.add("playing");
  }

  function playerH() { return ui.player ? ui.player.offsetHeight : 0; }

  function ensureVisible(el, force) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var target = Math.max(140, vh * 0.38);
    if (!force && Math.abs(r.top - target) < vh * 0.2) return;
    var y = r.top + (window.pageYOffset || 0) - target;
    if (y < 0) y = 0;
    try { window.scrollTo({ top: y, behavior: "smooth" }); }
    catch (e) { window.scrollTo(0, y); }
  }

  function setFollow(on, jump) {
    state.follow = !!on;
    saveState();
    syncUI();
    if (state.follow && jump) {
      var el = curVerse != null ? document.querySelector('.bayt[data-n="' + curVerse + '"]') : null;
      if (!el && !isFull()) el = document.getElementById(babId(state.index));
      if (el) ensureVisible(el, true);
    }
  }

  function gotoMatn() {
    var here = !!document.querySelector(".matn-paper");
    var n = curVerse != null ? curVerse : (isFull() ? null : firstVerse(state.index));
    var bab = (n != null && typeof VERSE2BAB[n] === "number") ? VERSE2BAB[n] : (isFull() ? -1 : state.index);
    var id = bab >= 0 ? babId(bab) : "";

    if (here) {
      var el = n != null ? document.querySelector('.bayt[data-n="' + n + '"]') : null;
      if (!el && id) el = document.getElementById(id);
      setFollow(true);
      if (el) ensureVisible(el, true);
      return;
    }
    location.href = "matn.html?resume=1" + (id ? "#" + id : "");
  }

  /* ---------- تحديث الواجهة ---------- */
  function subText() {
    var name = RECITERS[state.reciter].name;
    var s;
    if (isFull()) s = name + " · ١٧ بابًا";
    else {
      s = name + " · " + arNum(verseCount(state.index)) + " أبيات";
      var list = parts();
      if (list.length > 1) s += " · المقطع " + arNum(state.part + 1) + " من " + arNum(list.length);
    }
    if (curVerse != null) s += " · البيت " + arNum(curVerse);
    return s;
  }

  function syncUI() {
    if (!built) return;

    var bab = currentBabIndex();
    if (bab < 0) {
      ui.title.textContent = "المتن كاملاً";
      ui.prev.disabled = true;
    } else {
      ui.title.textContent = arNum(MATN[bab].num) + ". " + shortTitle(bab);
      ui.prev.disabled = false;
    }
    ui.sub.textContent = subText();

    ui.play.textContent = audio && !audio.paused ? "❚❚" : "▶";
    ui.play.setAttribute("aria-label", audio && !audio.paused ? "إيقاف" : "تشغيل");

    ui.reciter.value = RECITERS[state.reciter].id;
    ui.bab.value = String(isFull() ? -1 : state.index);
    ui.rate.value = String(state.rate);
    ui.loop.classList.toggle("on", state.loop);
    ui.follow.classList.toggle("on", state.follow);
    ui.follow.setAttribute("aria-pressed", state.follow ? "true" : "false");
  }

  /* ---------- تصغير/توسيع + ضبط فراغ الصفحة ---------- */
  function setMini(on) {
    state.mini = !!on;
    ui.player.classList.toggle("mini", state.mini);
    ui.mini.textContent = state.mini ? "⌃" : "⌄";
    ui.mini.setAttribute("aria-label", state.mini ? "توسيع المشغّل" : "تصغير المشغّل");
    fit();
  }
  function fit() {
    if (!built) return;
    document.body.style.paddingBottom = (playerH() + 10) + "px";
  }

  /* ---------- أزرار الصفحة ---------- */
  function initPageButtons() {
    var all = document.getElementById("listenAll");
    if (all) all.addEventListener("click", function (e) { e.preventDefault(); playIndex(0); });
    each(document.querySelectorAll("[data-listen-all]"), function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); playIndex(0); });
    });
    each(document.querySelectorAll("[data-listen-reciter]"), function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var id = b.getAttribute("data-listen-reciter");
        for (var i = 0; i < RECITERS.length; i++) if (RECITERS[i].id === id) state.reciter = i;
        var full = b.hasAttribute("data-listen-full") && RECITERS[state.reciter].full;
        state.part = 0;
        saveState();
        playIndex(full ? -1 : 0);
      });
    });
  }

  /* نسبة الموضع داخل المقطع التي يبدأ عندها بيتٌ معيّن */
  function fractionOfVerse(n) {
    var t = trackOf();
    if (!t || !t.v || n == null) return 0;
    if (n < t.v[0] || n > t.v[1]) return 0;
    var span = t.v[1] - t.v[0] + 1;
    if (span <= 0) return 0;
    var f = (n - t.v[0]) / span;
    return f > 0 && f < 0.98 ? f : 0;
  }

  /* نسبة الموضع داخل المقطع التي ينتهي عندها بيتٌ معيّن */
  function verseEndFraction(n) {
    var t = trackOf();
    if (!t || !t.v || n == null) return 0;
    if (n < t.v[0] || n > t.v[1]) return 0;
    var span = t.v[1] - t.v[0] + 1;
    if (span <= 0) return 0;
    var f = (n - t.v[0] + 1) / span;
    return f > 0 && f <= 1 ? f : 1;
  }

  function lastVerseNum() {
    if (!hasMatn()) return 109;
    var b = MATN[MATN.length - 1];
    return b.verses[b.verses.length - 1].n;
  }

  /* ---------- استماع لبيتٍ واحد ---------- */
  function playVerse(n) {
    if (!hasMatn() || !(n > 0)) return;
    var bi = VERSE2BAB[n];
    if (typeof bi !== "number") return;
    var list = RECITERS[state.reciter].tracks[bi] || [];
    var p = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].v && n >= list[i].v[0] && n <= list[i].v[1]) { p = i; break; }
    }
    if (p < 0) p = 0;
    state.index = bi;
    state.part = p;
    curVerse = n;
    verseStop = n;
    verseStopFrac = verseEndFraction(n);
    saveState();
    load(true, fractionOfVerse(n));
    paintVerse(n, state.follow);
    /* مع التتبّع: ننتقل إلى البيت في الصفحة */
    if (state.follow) {
      var el = document.querySelector('.bayt[data-n="' + n + '"]');
      if (el) ensureVisible(el, true);
    }
  }

  /* نهاية تلاوة البيت: نعرض خيار «تم الحفظ» والبيت التالي */
  function verseEnded(n) {
    noticeVerse = n;
    var marked = !!(window.JazHifz && window.JazHifz.has && window.JazHifz.has(n));
    var hasNext = n < lastVerseNum() && typeof VERSE2BAB[n + 1] === "number";
    var acts = "";
    if (!marked) acts += '<button class="pl-act" type="button" data-hifz="' + n + '">✓ تم الحفظ</button>';
    if (hasNext) acts += '<button class="pl-act" type="button" data-pl-next-verse="' + n + '">▸ البيت التالي</button>';
    var msg = marked
      ? "البيت " + arNum(n) + " محفوظ ✓"
      : "انتهت تلاوة البيت " + arNum(n) + " — هل حفظته؟";
    notice(msg, true, acts);
  }

  /* ---------- التهيئة ---------- */
  function init() {
    if (!build()) return;
    buildVerseMap();
    if (!hasMatn()) { ui.player.style.display = "none"; return; }

    loadState();
    if (state.index < 0 && !RECITERS[state.reciter].full) state.index = 0;

    setMini(window.innerWidth < 760);
    syncUI();
    initPageButtons();

    /* تعليم آخر موضعٍ وصلت إليه التلاوة */
    if (curVerse != null) {
      syncIndexToVerse(curVerse);
      paintVerse(curVerse, false);
    }

    /* استئناف التلاوة بعد الرجوع من صفحةٍ أخرى */
    if (/[?&]resume=1/.test(location.search)) {
      load(false);
      pendingSeekFrac = fractionOfVerse(curVerse);
      notice("اضغط ▶ لاستئناف التلاوة" + (curVerse != null ? " من البيت " + arNum(curVerse) : "") + ".", true);
      tryPlay();
    }

    fit();
    window.addEventListener("load", fit);
    setTimeout(fit, 300);
  }

  window.JazAudio = {
    play: function (i) { playIndex(typeof i === "number" ? i : 0); },
    playAll: function () { playIndex(0); },
    playVerse: playVerse,
    toggle: toggle,
    gotoMatn: gotoMatn,
    setFollow: setFollow,
    reciters: function () { return RECITERS.slice(); },
    tracksOf: function (i) {
      var r = RECITERS[state.reciter];
      return (r.tracks[i] || []).map(function (t) { return r.base + t.f; });
    },
    verse: function () { return curVerse; },
    estimated: function () { return estimatedVerse(); },
    bab: function () { return currentBabIndex(); },
    state: function () { return { reciter: state.reciter, index: state.index, part: state.part, follow: state.follow, verse: curVerse, stop: verseStop, stopFrac: verseStopFrac }; },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
