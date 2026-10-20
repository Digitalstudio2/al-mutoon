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
      source: "assets/audio/suwaid",
      srcUrl: "https://archive.org/details/sh-ayman-sowaid-matn-aljazareiiah",
      base: "assets/audio/suwaid/",
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

    /* ============================================================
     جدول الأزمنة المقيسة (نسبة من مدة المقطع الكلية):
     F[k] = موضع بداية الكلام في البيت رقم (أول بيت في المقطع + k).
     مستخرَج آليًّا من التسجيلات نفسها بتحليل فترات الصمت (2026-10-17)،
     وصُحِّحت أبيات السنيد (المقدمة · المخارج · الاستعمال · الضاد والظاء)
     بمحاذاة الكلام (ASR) 2026-10-18.
     وتلاوة أيمن سويد: التسجيل الجديد المرفوع (2026-10-19) — مواضع أبياته
     محسوبةٌ بمحاذاة الصمت على المقطع كاملًا، ثم قُسِّم إلى ملفات الأبواب،
     فكلُّ نسبةٍ محسوبةٌ داخل ملف بابه.
     (تصحيح 2026-10-19-ب): صُحّحت مواضع أبيات سويد لتقع على بداية الشطر الأول
     من كل بيت بعد أن وقع بعضها على الشطر الثاني، وأُعيد تقسيم ملفات الأبواب.
     (تصحيح 2026-10-19-د): صُحّحت مواضع أبيات السنيد في باب الصفات (ar_03) ونِسَبُ «بلا تكرار» له،
     فكانت تشير إلى شطرٍ من البيت السابق مبكرًا بخمسٍ إلى عشرِ ثوانٍ.
     (تصحيح 2026-10-19-هـ): أُعيد اشتقاق جداول أبواب السنيد ar_04..ar_17 ونِسَبُ «بلا تكرار» لها،
     محاذاةً صوتيةً بنيويةً على حدود مقاطع الصمت مع تحقّقٍ صوتيٍّ عند كل بداية بيت.
     F[0] = بداية أول بيت في المقطع، و F[الأخير] = نهايته.
     ============================================================ */
  var TIMINGS = {
    suwaid: {
      "00.mp3": [0.00129, 0.00968, 0.01796, 0.02645, 0.03538, 0.04387, 0.05215, 0.06075, 0.07022, 0.07860, 0.08753, 0.09624, 0.10548, 0.11459, 0.12376, 0.13290, 0.14226, 0.15151, 0.16140, 0.17043, 0.17968, 0.18871, 0.19785, 0.20753, 0.21656, 0.22602, 0.23527, 0.24452, 0.25344, 0.26226, 0.27161, 0.28086, 0.29000, 0.29914, 0.30828, 0.31742, 0.32699, 0.33645, 0.34548, 0.35452, 0.36387, 0.37258, 0.38204, 0.39247, 0.40108, 0.41043, 0.41968, 0.42860, 0.43806, 0.44710, 0.45688, 0.46753, 0.47667, 0.48645, 0.49602, 0.50645, 0.51516, 0.52430, 0.53366, 0.54247, 0.55129, 0.56075, 0.56957, 0.57903, 0.58989, 0.59968, 0.60892, 0.61796, 0.62796, 0.63742, 0.64613, 0.65473, 0.66398, 0.67237, 0.68129, 0.69065, 0.70075, 0.70989, 0.71882, 0.72849, 0.73720, 0.74688, 0.75602, 0.76538, 0.77398, 0.78269, 0.79183, 0.80118, 0.81043, 0.81903, 0.82849, 0.83785, 0.84667, 0.85656, 0.86559, 0.87473, 0.88344, 0.89301, 0.90183, 0.91065, 0.91957, 0.92849, 0.93839, 0.94720, 0.95624, 0.96570, 0.97462, 0.98409, 0.99237, 0.99935],
      "02.mp3": [0.00702, 0.12867, 0.24876, 0.37188, 0.50137, 0.62449, 0.74457, 0.86929, 0.99960],
      "03.mp3": [0.00483, 0.08841, 0.17749, 0.26438, 0.35654, 0.44740, 0.53893, 0.63010, 0.72342, 0.81566, 0.91434, 0.99961],
      "04.mp3": [0.00746, 0.15004, 0.28931, 0.43023, 0.57944, 0.71871, 0.86460, 0.99972],
      "05.mp3": [0.00757, 0.15228, 0.29195, 0.42993, 0.57632, 0.72103, 0.86406, 0.99952],
      "06.mp3": [0.00747, 0.14858, 0.28968, 0.43743, 0.58352, 0.72296, 0.86241, 0.99936],
      "07.mp3": [0.01691, 0.32120, 0.65176, 0.99929],
      "08.mp3": [0.00644, 0.12102, 0.24561, 0.36878, 0.48765, 0.61367, 0.73397, 0.86430, 0.99964],
      "09.mp3": [0.00645, 0.12837, 0.25889, 0.38654, 0.52567, 0.64185, 0.76376, 0.88854, 0.99970],
      "10.mp3": [0.02642, 0.50787, 0.99813],
      "11.mp3": [0.01660, 0.31901, 0.64355, 0.99944],
      "12.mp3": [0.01270, 0.26961, 0.51239, 0.74953, 0.99938],
      "13.mp3": [0.01342, 0.27581, 0.51730, 0.75576, 0.99880],
      "14.mp3": [0.00882, 0.16177, 0.32438, 0.49501, 0.67912, 0.84574, 0.99970],
      "15.mp3": [0.00351, 0.07370, 0.13691, 0.20717, 0.27352, 0.34145, 0.40387, 0.46709, 0.53343, 0.60129, 0.66844, 0.73087, 0.79955, 0.86745, 0.93146, 0.99974],
      "16.mp3": [0.00768, 0.15098, 0.29598, 0.43416, 0.58599, 0.72588, 0.86585, 0.99968],
      "17.mp3": [0.01048, 0.20365, 0.41804, 0.60882, 0.80458, 0.99897],
      "18.mp3": [0.01391, 0.27043, 0.54274, 0.78083, 1.00000]
    },
    snayd: {
      "ar_01_Jazari_Introduction_Sinead.mp3": [0.00043, 0.12372, 0.24398, 0.36900, 0.49640, 0.62448, 0.74418, 0.86721, 0.99616],
      "ar_02_Jazari_Introduction_Sinead.mp3": [0.00022, 0.09362, 0.18599, 0.27156, 0.36058, 0.45392, 0.54505, 0.63348, 0.72707, 0.81562, 0.91008, 0.99677],
      "ar_03_Jazari_Introduction_Sinead.mp3": [0.00078, 0.15373, 0.29166, 0.43160, 0.57427, 0.71060, 0.85692, 0.99617],
      "ar_04_Jazari_Introduction_Sinead.mp3": [0.00106, 0.14923, 0.29417, 0.43236, 0.56973, 0.70995, 0.85387, 0.99799],
      "ar_05_Jazari_Introduction_Sinead.mp3": [0.00048, 0.15745, 0.29724, 0.43518, 0.58442, 0.7193, 0.86377, 0.99851],
      "ar_06_Jazari_Introduction_Sinead.mp3": [0.00101, 0.32626, 0.65240, 0.98885],
      "ar_07_Jazari_Introduction_Sinead.mp3": [0.00083, 0.17021, 0.33553, 0.50019, 0.66301, 0.83183, 0.99849],
      "ar_08_Jazari_Introduction_Sinead.mp3": [0.00178, 0.51629, 0.98520],
      "ar_09_Jazari_Introduction_Sinead.mp3": [0.0001, 0.10661, 0.20573, 0.30695, 0.40477, 0.50005, 0.60057, 0.70096, 0.79707, 0.89633, 0.99926],
      "ar_10_Jazari_Introduction_Sinead.mp3": [0.00181, 0.36860, 0.68253, 0.99806],
      "ar_11_Jazari_Introduction_Sinead.mp3": [0.00074, 0.26221, 0.50559, 0.74773, 0.98979],
      "ar_12_Jazari_Introduction_Sinead.mp3": [0.00041, 0.26067, 0.51424, 0.76318, 0.99850],
      "ar_13_Jazari_Introduction_Sinead.mp3": [0.00017, 0.17106, 0.33153, 0.49915, 0.67026, 0.83827, 0.99535],
      "ar_14_Jazari_Introduction_Sinead.mp3": [0.00016, 0.07577, 0.13823, 0.20644, 0.27131, 0.33941, 0.40388, 0.46922, 0.53261, 0.60126, 0.66820, 0.73329, 0.80374, 0.86863, 0.93451, 0.99921],
      "ar_15_Jazari_Introduction_Sinead.mp3": [0.00049, 0.14765, 0.29466, 0.43404, 0.58006, 0.72785, 0.86838, 0.99831],
      "ar_16_Jazari_Introduction_Sinead.mp3": [0.00048, 0.21157, 0.41224, 0.60214, 0.80184, 0.99915],
      "ar_17_Jazari_Introduction_Sinead.mp3": [0.00058, 0.26328, 0.50392, 0.74110, 0.99483]
    }
  };

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
  var state = { reciter: 0, index: 0, part: 0, rate: 1, loop: false, follow: false, mini: false, skipRepeat: false };
  var skipLock = false;
  var curVerse = null;      /* البيت المقروء الآن (تقديرًا) */
  var audio = null;
  var ui = {};
  var built = false;
  var followPauseUntil = 0; /* توقّف التتبّع مؤقتًا إن مرّر المستخدم الصفحة */

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        reciter: state.reciter, index: state.index, rate: state.rate,
        loop: state.loop, follow: state.follow, verse: curVerse,
        skipRepeat: state.skipRepeat,
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
      if (typeof s.skipRepeat === "boolean") state.skipRepeat = s.skipRepeat;
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
          '<button class="pl-btn pl-ico pl-skip" id="plSkip" type="button" aria-label="قراءة بلا تكرار (سنيد)" title="قراءة بلا تكرار (سنيد)">٣×</button>' +
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
    ui.skip    = document.getElementById("plSkip");
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

    if (ui.skip) ui.skip.addEventListener("click", function () {
      if (RECITERS[state.reciter].id !== "snayd") return;
      state.skipRepeat = !state.skipRepeat;
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
      followTick();
      trySkipRepeat();
    });
    audio.addEventListener("loadedmetadata", function () {
      ui.dur.textContent = fmt(audio.duration);
      try { audio.playbackRate = state.rate; } catch (e) {}
      hideNotice();
      applyPendingSeek();
    });
    audio.addEventListener("play", function () { hideNotice(); syncUI(); });
    audio.addEventListener("pause", function () { syncUI(); });
    audio.addEventListener("durationchange", function () { applyPendingSeek(); });
    audio.addEventListener("ended", function () {
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

    /* إن مرّر المستخدم الصفحة بنفسه نتوقّف عن التنقّل التلقائي قليلًا */
    var manual = function () { if (state.follow) followPauseUntil = Date.now() + 10000; };
    window.addEventListener("wheel", manual, { passive: true });
    window.addEventListener("touchmove", manual, { passive: true });

    window.addEventListener("resize", fit);
  }

  /* ---------- التشغيل ---------- */
  var pendingSeekFrac = 0;
  var pendingSeekBack = 0;

  /* يطبّق القفزة المؤجّلة (بداية باب أو بيت) متى عُرفت مدة المقطع فعلًا */
  function applyPendingSeek() {
    if (!(pendingSeekFrac > 0) || !audio) return;
    var d = audio.duration;
    if (!d || !isFinite(d) || d <= 0) return;
    var t0 = pendingSeekFrac * d;
    if (pendingSeekBack > 0 && t0 > pendingSeekBack) t0 -= pendingSeekBack;
    if (t0 < 0) t0 = 0;
    try {
      audio.currentTime = t0;
      pendingSeekFrac = 0;
      pendingSeekBack = 0;
    } catch (e) {}
  }

  /* جدول أزمنة مقيسة لمقطعٍ ما (أو null إن لم يتوفّر) */
  function timingLookup(map, t) {
    var rec = RECITERS[state.reciter];
    var tab = rec && rec.id ? map[rec.id] : null;
    var F = (tab && t && t.f) ? tab[t.f] : null;
    if (!F || !t.v) return null;
    if (t.v[1] - t.v[0] + 1 !== F.length - 1) return null;
    return F;
  }
  /* F = مواضع بدايات الأبيات */
  function timingTable(t) { return timingLookup(TIMINGS, t); }

  /* ---------- «بلا تكرار» للسنيد: القفز فوق التكرارات ---------- */
  /* القفزة تقع عند انتهاء القراءة الأولى للبيت (بداية الوقفة التي تليها مباشرة).
     بنية التلاوة عند السنيد: يُقرأ البيت ثلاث مرات، وتُقسَّم القراءةُ الشطرَين
     مع وقفةٍ بينهما — فالقفزة بعد الشطر الثاني؛ فإن لم تُقسَّم فالقراءةُ كاملة.
     الجدول مُشتقٌّ من تحليل الصمت لمقاطع السنيد: النسبةُ نهايةُ القراءة الأولى
     (الشطر الثاني) في كل بيت، وتُتْرَك كاملةً نِسَبُ آخرِ بيتٍ في المقطع فقط.
     جُدِّدت نِسَبُ الأبواب ar_04..ar_17 محاذاةً صوتيةً في 2026-10-19-هـ. */
  var SNAYD_SKIP_EXACT = {
    "ar_01_Jazari_Introduction_Sinead.mp3": { 1: 0.03932, 2: 0.16076, 3: 0.28305, 4: 0.40880, 5: 0.53671, 6: 0.66203, 7: 0.78303 },
    "ar_02_Jazari_Introduction_Sinead.mp3": { 9: 0.03449, 10: 0.12149, 11: 0.21253, 12: 0.29984, 13: 0.39088, 14: 0.48285, 15: 0.57264, 16: 0.66213, 17: 0.75565, 18: 0.84483 },
    "ar_03_Jazari_Introduction_Sinead.mp3": { 20: 0.05262, 21: 0.19631, 22: 0.33498, 23: 0.47540, 24: 0.61675, 25: 0.75630 },
    "ar_04_Jazari_Introduction_Sinead.mp3": { 27: 0.05150, 28: 0.19407, 29: 0.33525, 30: 0.47421, 31: 0.61221, 32: 0.75305 },
    "ar_05_Jazari_Introduction_Sinead.mp3": { 34: 0.05678, 35: 0.20134, 36: 0.34066, 37: 0.48046, 38: 0.62598, 39: 0.76530 },
    "ar_06_Jazari_Introduction_Sinead.mp3": { 41: 0.11039, 42: 0.42579 },
    "ar_07_Jazari_Introduction_Sinead.mp3": { 44: 0.05731, 45: 0.22252, 46: 0.38556, 47: 0.54955, 48: 0.71665 },
    "ar_08_Jazari_Introduction_Sinead.mp3": { 50: 0.18416 },
    "ar_09_Jazari_Introduction_Sinead.mp3": { 52: 0.03676, 53: 0.13668, 54: 0.23727, 55: 0.33820, 56: 0.43478, 57: 0.53036, 58: 0.63162, 59: 0.72987, 60: 0.82678 },
    "ar_10_Jazari_Introduction_Sinead.mp3": { 62: 0.14676, 63: 0.46431 },
    "ar_11_Jazari_Introduction_Sinead.mp3": { 65: 0.09814, 66: 0.33479, 67: 0.57866 },
    "ar_12_Jazari_Introduction_Sinead.mp3": { 69: 0.08800, 70: 0.33693, 71: 0.58807 },
    "ar_13_Jazari_Introduction_Sinead.mp3": { 73: 0.05857, 74: 0.21937, 75: 0.38172, 76: 0.55040, 77: 0.72118 },
    "ar_14_Jazari_Introduction_Sinead.mp3": { 79: 0.02738, 80: 0.09414, 81: 0.15880, 82: 0.22590, 83: 0.29185, 84: 0.35877, 85: 0.42345, 86: 0.48829, 87: 0.55332, 88: 0.62123, 89: 0.68727, 90: 0.75467, 91: 0.82308, 92: 0.88872 },
    "ar_15_Jazari_Introduction_Sinead.mp3": { 94: 0.05118, 95: 0.19180, 96: 0.33628, 97: 0.47755, 98: 0.62475, 99: 0.77027 },
    "ar_16_Jazari_Introduction_Sinead.mp3": { 101: 0.07265, 102: 0.27195, 103: 0.46891, 104: 0.66251 },
    "ar_17_Jazari_Introduction_Sinead.mp3": { 106: 0.09232, 107: 0.33666, 108: 0.57557 },
  };
  function firstEndFraction() {
    if (!state.skipRepeat) return null;
    if (RECITERS[state.reciter].id !== "snayd") return null;
    var t = trackOf();
    if (!t || !t.v || !audio) return null;
    var d = audio.duration;
    if (!d || !isFinite(d) || d <= 0) return null;
    var v = estimatedVerse();
    if (v === null) return null;
    var tab = SNAYD_SKIP_EXACT[t.f];
    if (!tab) return null;
    var fe = tab[v];
    if (typeof fe !== "number" || !isFinite(fe) || fe <= 0 || fe >= 0.999) return null;
    return fe;
  }
  function trySkipRepeat() {
    if (!state.skipRepeat) return;
    if (RECITERS[state.reciter].id !== "snayd") return;
    if (skipLock) return;
    if (!audio || audio.paused) return;
    var d = audio.duration;
    if (!d || !isFinite(d) || d <= 0) return;
    var fe = firstEndFraction();
    if (fe === null) return;
    var f = audio.currentTime / d;
    if (audio.currentTime < fe * d - 0.15) return; /* لم نصل بعد إلى نهاية القراءة الأولى */
    /* القفز إلى بداية البيت التالي */
    var t = trackOf();
    if (!t || !t.v) return;
    var v = estimatedVerse();
    if (v === null) return;
    var nv = v + 1;
    if (nv > t.v[1]) return; /* last verse: لا قفز (شغّل كاملًا) */
    var nf = fractionOfVerse(nv);
    if (!(nf > 0 && nf < 0.999)) return;
    skipLock = true;
    pendingSeekFrac = nf;
    pendingSeekBack = 0;
    applyPendingSeek();
    setTimeout(function () { skipLock = false; }, 1200);
  }

  /* موضع بداية الباب داخل المقطع (لأن بعض المقاطع تجمع بابين) */
  function startFraction() {
    if (isFull()) return 0;
    var t = trackOf();
    if (!t || !t.v) return 0;
    var first = firstVerse(state.index);
    if (first == null) return 0;
    var F = timingTable(t);
    if (F) {
      var ix = first - t.v[0];
      if (ix >= 0 && ix < F.length) return F[ix];
      return 0;
    }
    if (first <= t.v[0]) return 0;
    var span = t.v[1] - t.v[0] + 1;
    if (span <= 0) return 0;
    var f = (first - t.v[0]) / span;
    return f > 0 && f < 0.95 ? f : 0;
  }

  function load(andPlay) {
    hideNotice();
    pendingSeekFrac = startFraction();
    pendingSeekBack = 0;
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
  function notice(text, hint) {
    ui.err.textContent = text;
    ui.err.classList.toggle("hint", !!hint);
    ui.err.classList.add("show");
  }
  function hideNotice() { ui.err.classList.remove("show"); }

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
    var F = timingTable(t);
    if (F) {
      var pre = 0.25 / d; /* تُحسب البداية المقيسة وما قبلها بيسير من البيت نفسه */
      var k = 0;
      for (var i = F.length - 1; i >= 0; i--) {
        if (f + pre >= F[i]) { k = i; break; }
      }
      var v = a + k;
      if (v > t.v[1]) v = t.v[1];
      return v;
    }
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
    if (ui.skip) {
      ui.skip.style.display = (RECITERS[state.reciter].id === "snayd") ? "" : "none";
      ui.skip.classList.toggle("on", state.skipRepeat && RECITERS[state.reciter].id === "snayd");
      ui.skip.setAttribute("aria-pressed", (state.skipRepeat && RECITERS[state.reciter].id === "snayd") ? "true" : "false");
      ui.skip.textContent = state.skipRepeat ? "١×" : "٣×";
    }
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
    var F = timingTable(t);
    if (F) {
      var ix = n - t.v[0];
      if (ix >= 0 && ix < F.length) {
        var ff = F[ix];
        return ff > 0 && ff < 0.999 ? ff : 0;
      }
    }
    var span = t.v[1] - t.v[0] + 1;
    if (span <= 0) return 0;
    var f = (n - t.v[0]) / span;
    return f > 0 && f < 0.98 ? f : 0;
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
      pendingSeekBack = 0.22;
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
    toggle: toggle,
    gotoMatn: gotoMatn,
    setFollow: setFollow,
    setSkipRepeat: function (on) { if (RECITERS[state.reciter].id !== "snayd") return; state.skipRepeat = !!on; saveState(); syncUI(); },
    reciters: function () { return RECITERS.slice(); },
    tracksOf: function (i) {
      var r = RECITERS[state.reciter];
      return (r.tracks[i] || []).map(function (t) { return r.base + t.f; });
    },
    verse: function () { return curVerse; },
    estimated: function () { return estimatedVerse(); },
    bab: function () { return currentBabIndex(); },
    state: function () { return { reciter: state.reciter, index: state.index, part: state.part, follow: state.follow, verse: curVerse, skipRepeat: state.skipRepeat }; },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
