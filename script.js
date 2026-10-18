/* ============================================================
   متون الجزرية لابن الجزري — سكربت الموقع
   ============================================================ */
(function () {
  "use strict";

  /* ---------- أدوات مساعدة ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const DIACRITICS = /[\u064B-\u0652\u0670\u0640\u0653-\u0655\u06D6-\u06ED\u200C-\u200F\u0610-\u061A]/;

  function normChar(ch) {
    if (ch === "أ" || ch === "إ" || ch === "آ" || ch === "ٱ") return "ا";
    if (ch === "ى") return "ي";
    if (ch === "ة") return "ه";
    if (ch === "ؤ") return "و";
    if (ch === "ئ") return "ي";
    return ch;
  }

  // يبني نسخة مجرّدة من التشكيل مع خريطة فهارس إلى النص الأصلي
  function stripped(text) {
    let out = "";
    const map = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (DIACRITICS.test(ch)) continue;
      out += normChar(ch);
      map.push(i);
    }
    return { text: out, map: map };
  }

  function normQuery(q) {
    const s = stripped(arabicToAsciiDigits(String(q).toLowerCase())).text;
    return s.replace(/[«»؛:،.,!؟…\-–—_()[\]{}"'|/\\]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // تحويل الأرقام إلى الأرقام العربية المشرقية
  const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function arNum(n) {
    return String(n).replace(/\d/g, (d) => AR_DIGITS[+d]);
  }
  function arabicToAsciiDigits(s) {
    return String(s).replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  }

  function highlight(original, norm, map, q) {
    if (!q) return escapeHtml(original);
    const idx = norm.indexOf(q);
    if (idx < 0) return escapeHtml(original);
    const start = map[idx];
    const end = map[idx + q.length - 1] + 1;
    return escapeHtml(original.slice(0, start)) +
      "<mark>" + escapeHtml(original.slice(start, end)) + "</mark>" +
      escapeHtml(original.slice(end));
  }

  /* ---------- أيقونات الأبواب ---------- */
  const ICONS = [
    '<path d="M12 6c-2-1.6-5-2.2-8-2.2v14.4c3 0 6 .6 8 2.2 2-1.6 5-2.2 8-2.2V3.8c-3 0-6 .6-8 2.2z"/><path d="M12 6v14.4"/>',
    '<path d="M4 12h2l2-6 3 14 3-11 2 3h4"/>',
    '<path d="M6 4h12M6 9h12M6 14h8"/><circle cx="18" cy="17" r="3"/>',
    '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9L6.7 19.6l1.1-6L3.4 9.4l6-.8z"/>',
    '<path d="M5 19l7-14 7 14"/><path d="M8.5 13h7"/>',
    '<path d="M3 12a9 9 0 0 0 18 0"/><path d="M12 3v9"/><path d="M9 6l3-3 3 3"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    '<path d="M4 20c4-1 6-4 8-9s4-7 8-8"/><path d="M4 20h16"/>',
    '<path d="M8 4h8v16H8z"/><path d="M11 8h2M11 12h2M11 16h2"/>',
    '<path d="M12 4v16M6 4v16M18 4v16"/><path d="M6 9h12M6 15h12"/>',
    '<path d="M4 12h16"/><path d="M12 4v16"/><circle cx="12" cy="12" r="9"/>',
    '<path d="M5 5l14 14M19 5L5 19"/>',
    '<path d="M12 3v18"/><path d="M5 8c4 3 10 3 14 0"/><path d="M5 16c4-3 10-3 14 0"/>',
    '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    '<path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4M4 17l8 4 8-4"/>',
    '<path d="M7 4v16"/><path d="M7 4h9l-1.5 4L16 12H7"/>',
    '<path d="M12 3l3 6 6 .9-4.3 4.2 1 6L12 17l-5.7 3 1-6L3 9.9 9 9z"/>',
  ];
  const icon = (i) => '<svg viewBox="0 0 24 24">' + ICONS[i % ICONS.length] + "</svg>";

  /* ---------- التنقل ---------- */
  function initNav() {
    const btn = $("#menuBtn"), nav = $("#nav");
    if (btn && nav) btn.addEventListener("click", () => nav.classList.toggle("open"));
    const path = location.pathname.split("/").pop() || "index.html";
    $$(".nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href === path) a.classList.add("active");
    });
  }

  /* ---------- الوضع الليلي ---------- */
  function initTheme() {
    const btns = $$("[data-theme-toggle]");
    let saved = null;
    try { saved = localStorage.getItem("jazariyyah-theme"); } catch (e) {}
    if (saved === "dark") document.body.classList.add("dark");
    const sync = () => btns.forEach((b) => (b.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙"));
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        try { localStorage.setItem("jazariyyah-theme", document.body.classList.contains("dark") ? "dark" : "light"); } catch (e) {}
        sync();
      })
    );
    sync();
  }

  /* ---------- بناء شبكة الأبواب (الرئيسية) ---------- */
  function renderAbwab() {
    const grid = $("#abwabGrid");
    if (!grid || typeof MATN === "undefined") return;
    grid.innerHTML = MATN.map((b, i) => {
      const mem = hifzOfBab(b);
      return (
        '<a class="bab-card" href="matn.html#' + b.id + '">' +
        '<span class="no">' + arNum(b.num < 10 ? "0" + b.num : b.num) + "</span>" +
        '<span class="ic">' + icon(i) + "</span>" +
        "<h3>" + b.title + "</h3>" +
        "<p>" + b.desc + "</p>" +
        '<div class="meta">' + arNum(b.verses.length) + " بيتًا · اقرأ الباب ›" +
        (mem ? '<span class="mem-badge">✓ ' + arNum(mem) + "/" + arNum(b.verses.length) + "</span>" : "") +
        "</div>" +
        "</a>"
      );
    }).join("");
  }

  /* ---------- الأبيات المميزة (الرئيسية) ---------- */
  function renderFeatured() {
    const box = $("#featured");
    if (!box || typeof MATN === "undefined") return;
    const picks = [9, 21, 24, 27, 41, 52, 65, 69, 74];
    const all = {};
    MATN.forEach((b) => b.verses.forEach((v) => (all[v.n] = { v: v, b: b })));
    box.innerHTML = picks
      .filter((n) => all[n])
      .slice(0, 6)
      .map((n) => {
        const o = all[n];
        return (
          '<div class="feat">' +
          '<div class="src">' + o.b.title + " — البيت " + arNum(n) + "</div>" +
          '<div class="bayt"><span>' + escapeHtml(o.v.a) + '</span><span class="sep">۞</span><span>' + escapeHtml(o.v.b) + "</span></div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ============================================================
     الحفظ: تعليم الأبيات المحفوظة («تم الحفظ»)
     يُخزَّن محليًا في المتصفح، ويظهر العدّاد في شريط الأدوات
     وشارة لكل باب وفي الفهرس الجانبي.
     ============================================================ */
  const HIFZ_KEY = "jazariyyah-hifz";
  let HIFZ = {}; // { رقم البيت: ١ }

  function hifzLoad() {
    HIFZ = {};
    try {
      const raw = JSON.parse(localStorage.getItem(HIFZ_KEY) || "{}");
      if (raw && typeof raw === "object") {
        Object.keys(raw).forEach((k) => {
          const n = parseInt(k, 10);
          if (n > 0 && raw[k]) HIFZ[n] = 1;
        });
      }
    } catch (e) { HIFZ = {}; }
  }
  function hifzSave() {
    try { localStorage.setItem(HIFZ_KEY, JSON.stringify(HIFZ)); } catch (e) {}
  }
  function hifzHas(n) { return !!HIFZ[n]; }
  function hifzCount() { return Object.keys(HIFZ).length; }
  function hifzTotal() {
    if (typeof MATN === "undefined") return 0;
    return MATN.reduce((s, b) => s + b.verses.length, 0);
  }
  function hifzOfBab(b) {
    let m = 0;
    b.verses.forEach((v) => { if (HIFZ[v.n]) m++; });
    return m;
  }

  function hifzToggle(n) {
    if (HIFZ[n]) delete HIFZ[n]; else HIFZ[n] = 1;
    hifzSave();
    hifzPaintVerse(n);
    hifzProgress();
    document.dispatchEvent(new CustomEvent("jazhifz:change", {
      detail: { verse: n, marked: hifzHas(n), count: hifzCount() },
    }));
  }

  function hifzPaintVerse(n) {
    const el = document.querySelector('.bayt[data-n="' + n + '"]');
    if (!el) return;
    const on = hifzHas(n);
    el.classList.toggle("mem", on);
    const b = el.querySelector(".vb-hifz");
    if (b) {
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.title = on ? "إلغاء تعليم البيت محفوظًا" : "تم الحفظ";
      b.setAttribute("aria-label", (on ? "إلغاء تعليم البيت " : "تم الحفظ — البيت ") + arNum(n));
    }
  }

  function hifzProgress() {
    const c = hifzCount(), t = hifzTotal();
    const info = $("#hifzInfo");
    if (info) {
      info.innerHTML = "✓ المحفوظ <b>" + arNum(c) + "/" + arNum(t) + "</b>";
      info.classList.toggle("has", c > 0);
      info.title = c > 0
        ? "الأبيات المحفوظة: " + arNum(c) + " من " + arNum(t) + " — اضغط للتصفير"
        : "لم تُعلَّم أبياتٌ محفوظة بعد";
    }
    if (typeof MATN === "undefined") return;
    MATN.forEach((b) => {
      const m = hifzOfBab(b), tot = b.verses.length;
      const badge = document.querySelector('.hifz-badge[data-hifzbab="' + b.id + '"]');
      if (badge) {
        badge.textContent = m ? (m >= tot ? "✓ محفوظ" : "محفوظ " + arNum(m) + "/" + arNum(tot)) : "";
        badge.classList.toggle("show", m > 0);
        badge.classList.toggle("done", tot > 0 && m >= tot);
      }
      const ct = document.querySelector('.toc a[data-target="' + b.id + '"] .ct');
      if (ct) ct.textContent = m > 0 ? (m >= tot ? "✓ " + arNum(tot) : arNum(m) + "/" + arNum(tot)) : arNum(tot);
    });
  }

  function hifzRepaint() {
    if (typeof MATN === "undefined") return;
    MATN.forEach((b) => b.verses.forEach((v) => hifzPaintVerse(v.n)));
    hifzProgress();
  }

  /* أزرار البيت: «تم الحفظ» */
  function initVerseActions() {
    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      const h = e.target.closest("[data-hifz]");
      if (h) {
        e.preventDefault();
        const n = parseInt(h.getAttribute("data-hifz"), 10);
        if (n > 0) hifzToggle(n);
        return;
      }
    });

    const info = $("#hifzInfo");
    if (info)
      info.addEventListener("click", function () {
        if (!hifzCount()) return;
        if (window.confirm("تصفير كل الأبيات المعلَّمة محفوظة؟")) {
          HIFZ = {};
          hifzSave();
          hifzRepaint();
          document.dispatchEvent(new CustomEvent("jazhifz:change", { detail: { verse: 0, marked: false, count: 0, reset: true } }));
        }
      });
  }

  window.JazHifz = {
    has: hifzHas,
    count: hifzCount,
    total: hifzTotal,
    toggle: hifzToggle,
    mark: function (n) { if (!hifzHas(n)) hifzToggle(n); },
    unmark: function (n) { if (hifzHas(n)) hifzToggle(n); },
  };

  /* ---------- الفهرس والأبيات (صفحة المتن) ---------- */
  let VERSE_INDEX = [];

  function renderMatn() {
    const root = $("#matnRoot");
    if (!root || typeof MATN === "undefined") return;

    // الفهرس الجانبي
    const toc = $("#toc");
    if (toc) {
      toc.innerHTML =
        '<h3>فهرس الأبواب</h3>' +
        MATN.map(
          (b) =>
            '<a href="#' + b.id + '" data-target="' + b.id + '">' +
            '<span class="tn">' + arNum(b.num) + "</span><span>" + b.title + '</span><span class="ct">' +
            arNum(b.verses.length) + "</span></a>"
        ).join("");
    }

    // الأبيات
    VERSE_INDEX = [];
    root.innerHTML = MATN.map((b, bi) => {
      const vers = b.verses
        .map((v) => {
          const full = v.a + " " + v.b;
          const s = stripped(full);
          VERSE_INDEX.push({ n: v.n, bab: b.id, babTitle: b.title, norm: s.text, raw: full });
          return (
            '<div class="bayt" data-n="' + v.n + '" data-bab="' + b.id + '" data-raw="' + escapeHtml(full) + '">' +
            '<span class="num">' + arNum(v.n) + "</span>" +
            '<span class="acts">' +
              '<button class="vb vb-hifz" type="button" data-hifz="' + v.n + '" aria-pressed="false" title="تم الحفظ" aria-label="تم الحفظ — البيت ' + arNum(v.n) + '">✓</button>' +
              '<button class="vb vb-copy copy-btn" type="button" title="نسخ البيت" aria-label="نسخ البيت ' + arNum(v.n) + '">⧉</button>' +
            "</span>" +
            '<div class="text"><span class="h1">' + escapeHtml(v.a) + '</span>' +
            '<span class="sep">۞</span>' +
            '<span class="h2">' + escapeHtml(v.b) + "</span></div>" +
            "</div>"
          );
        })
        .join("");
      return (
        '<section class="bab-sec" id="' + b.id + '" data-bab="' + b.id + '">' +
        "<h3><span class=\"bnum\">باب " + arNum(b.num) + "</span>" + b.title.replace(/^بابُ\s*/, "") +
          '<span class="hifz-badge" data-hifzbab="' + b.id + '" title="الأبيات المحفوظة من هذا الباب"></span>' +
          '<button class="listen-btn" type="button" data-listen="' + bi + '" title="تلاوة هذا الباب">▶ استماع</button></h3>' +
        '<p class="bdesc">' + b.desc + "</p>" +
        vers +
        "</section>"
      );
    }).join("");

    initCopy();
    initScrollSpy();
    restoreFont();
  }

  /* ---------- النسخ ---------- */
  function initCopy() {
    $$(".copy-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        const raw = this.closest(".bayt").getAttribute("data-raw");
        const done = () => {
          this.classList.add("ok");
          this.title = "تم نسخ البيت";
          setTimeout(() => { this.classList.remove("ok"); this.title = "نسخ البيت"; }, 1400);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(raw).then(done.bind(this), () => fallbackCopy(raw, done.bind(this)));
        else fallbackCopy(raw, done.bind(this));
      })
    );
  }
  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- البحث والتصفية ---------- */
  function initSearch() {
    const input = $("#searchInput");
    if (!input) return;
    const clear = $("#searchClear");
    const info = $("#searchInfo");
    const hideBtn = $("#hideToggle");

    function run() {
      const rawQ = input.value.trim();
      const q = normQuery(rawQ);
      const digits = arabicToAsciiDigits(rawQ).replace(/\s/g, "");
      const isNum = /^\d+$/.test(digits) && digits.length <= 3;
      let count = 0;

      MATN.forEach((b) => {
        let babHas = 0;
        b.verses.forEach((v) => {
          const el = document.querySelector('.bayt[data-n="' + v.n + '"]');
          if (!el) return;
          if (!q) {
            el.classList.remove("hit");
            el.querySelector(".text").innerHTML =
              '<span class="h1">' + escapeHtml(v.a) + '</span><span class="sep">۞</span><span class="h2">' + escapeHtml(v.b) + "</span>";
            return;
          }
          const full = v.a + " " + v.b;
          const s = stripped(full);
          let hit = s.text.indexOf(q) >= 0;
          if (isNum && String(v.n) === digits) hit = true;
          if (!hit && q.length >= 2 && normQuery(b.title).indexOf(q) >= 0) hit = true;

          if (hit) {
            count++;
            babHas++;
            el.classList.add("hit");
            const h1 = highlight(v.a, stripped(v.a).text, stripped(v.a).map, q);
            const h2 = highlight(v.b, stripped(v.b).text, stripped(v.b).map, q);
            el.querySelector(".text").innerHTML =
              '<span class="h1">' + h1 + '</span><span class="sep">۞</span><span class="h2">' + h2 + "</span>";
          } else {
            el.classList.remove("hit");
            el.querySelector(".text").innerHTML =
              '<span class="h1">' + escapeHtml(v.a) + '</span><span class="sep">۞</span><span class="h2">' + escapeHtml(v.b) + "</span>";
          }
        });
        const sec = document.querySelector('.bab-sec[data-bab="' + b.id + '"]');
        if (sec) sec.classList.toggle("has-hit", babHas > 0);
      });

      const empty = $("#emptyState");
      if (empty) empty.classList.toggle("show", !!q && count === 0);
      if (info) info.textContent = q ? count + " نتيجة" : "";
      if (clear) clear.style.display = rawQ ? "block" : "none";
    }

    input.addEventListener("input", run);
    if (clear) clear.addEventListener("click", () => { input.value = ""; run(); input.focus(); });
    if (hideBtn) hideBtn.addEventListener("click", () => { document.body.classList.toggle("hide-nonhits"); hideBtn.classList.toggle("on"); });

    // بحث عبر رابط ?q=
    const p = new URLSearchParams(location.search);
    if (p.get("q")) { input.value = p.get("q"); run(); }
  }

  /* ---------- تتبّع الباب الظاهر ---------- */
  function initScrollSpy() {
    const links = $$("#toc a");
    if (!links.length) return;
    const secs = $$(".bab-sec");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.toggle("active", l.getAttribute("data-target") === e.target.id));
          }
        });
      },
      { rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );
    secs.forEach((s) => obs.observe(s));
    links.forEach((l) =>
      l.addEventListener("click", () => {
        links.forEach((x) => x.classList.remove("active"));
        l.classList.add("active");
        document.getElementById("nav") && document.getElementById("nav").classList.remove("open");
      })
    );
  }

  /* ---------- حجم الخط ---------- */
  function applyFont(size, lh) {
    document.body.style.setProperty("--matn-size", size + "px");
    document.body.style.setProperty("--matn-lh", lh);
  }
  function restoreFont() {
    let size = 21, lh = 2.25;
    try {
      size = parseInt(localStorage.getItem("jazariyyah-size") || "21", 10);
      lh = localStorage.getItem("jazariyyah-lh") || "2.25";
    } catch (e) {}
    applyFont(size, lh);
  }
  function initFont() {
    const up = $("#fontUp"), down = $("#fontDown"), lhBtn = $("#lhToggle"), print = $("#printBtn");
    if (up) up.addEventListener("click", () => change(2));
    if (down) down.addEventListener("click", () => change(-2));
    if (lhBtn)
      lhBtn.addEventListener("click", () => {
        const cur = parseFloat(getComputedStyle(document.body).getPropertyValue("--matn-lh")) || 2.25;
        const next = cur >= 3 ? 1.9 : cur + 0.35;
        applyFont(currentSize(), next.toFixed(2));
        lhBtn.classList.toggle("on", next > 2.3);
        save();
      });
    if (print) print.addEventListener("click", () => window.print());

    function currentSize() {
      return parseInt(getComputedStyle(document.body).getPropertyValue("--matn-size")) || 21;
    }
    function change(d) {
      const s = Math.min(40, Math.max(15, currentSize() + d));
      applyFont(s, getComputedStyle(document.body).getPropertyValue("--matn-lh"));
      save();
    }
    function save() {
      try {
        localStorage.setItem("jazariyyah-size", currentSize());
        localStorage.setItem("jazariyyah-lh", getComputedStyle(document.body).getPropertyValue("--matn-lh").trim());
      } catch (e) {}
    }
  }

  /* ---------- التهيئة ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    hifzLoad();
    initNav();
    initTheme();
    renderAbwab();
    renderFeatured();
    renderMatn();
    hifzRepaint();
    initVerseActions();
    initSearch();
    initFont();
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
