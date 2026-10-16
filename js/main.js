/* =========================================================
   Abdullah Al Mahmud — portfolio
   Theme, scroll-driven focus effect, glass sheen, glass dock.
   ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /* ---------- Theme ---------- */

  var toggle = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "light" ? "#fafafa" : "#0a0a0a");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* storage unavailable — ignore */
    }
  }

  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (e) {
    /* ignore */
  }

  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
  } else if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

      if (typeof document.startViewTransition === "function" && !prefersReducedMotion()) {
        document.startViewTransition(function () {
          applyTheme(next);
        });
      } else {
        applyTheme(next);
      }
    });
  }

  /* ---------- Year ---------- */

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* =========================================================
     Scroll-driven updates (focus effect + dock state)
     Both run off a single rAF so scrolling stays cheap.
     ========================================================= */

  var focusEls = Array.prototype.slice.call(document.querySelectorAll("[data-focus]"));

  var dock = document.getElementById("dock");
  var pill = dock ? dock.querySelector(".dock-pill") : null;
  var activeLink = null;

  var sections = dock
    ? Array.prototype.slice
        .call(dock.querySelectorAll("a[data-target]"))
        .map(function (link) {
          return { link: link, el: document.getElementById(link.getAttribute("data-target")) };
        })
        .filter(function (s) {
          return s.el;
        })
    : [];

  /* ---------- Focus effect ----------
     Brightness tracks distance from the vertical centre of the viewport,
     so the reader's eye is drawn to the line they are on. */

  var FLOOR_STRONG = 0.42; // epigraph: unfocused lines
  var FLOOR_SOFT = 0.72; // intro statements: stay legible
  var SPREAD = 0.5; // fraction of viewport height mapped to full fade

  function updateFocus() {
    if (!focusEls.length) return;

    var vh = window.innerHeight;
    var center = vh / 2;
    var range = vh * SPREAD;

    for (var i = 0; i < focusEls.length; i++) {
      var el = focusEls[i];
      var rect = el.getBoundingClientRect();

      var floor = el.getAttribute("data-focus") === "soft" ? FLOOR_SOFT : FLOOR_STRONG;
      var elCenter = rect.top + rect.height / 2;

      var t = 1 - Math.min(Math.abs(elCenter - center) / range, 1);
      t = t * t;

      el.style.setProperty("--focus", (floor + t * (1 - floor)).toFixed(3));
    }
  }

  /* ---------- Dock ---------- */

  function movePill() {
    if (!pill || !activeLink) return;

    var d = dock.getBoundingClientRect();
    var r = activeLink.getBoundingClientRect();
    if (!r.width) return;

    pill.style.width = r.width + "px";
    pill.style.height = r.height + "px";
    pill.style.transform =
      "translate(" + (r.left - d.left) + "px," + (r.top - d.top) + "px)";
    pill.style.opacity = "1";
  }

  function setActive(link) {
    if (link === activeLink) return;
    if (activeLink) activeLink.classList.remove("is-active");
    activeLink = link;
    if (activeLink) activeLink.classList.add("is-active");
    movePill();
  }

  function updateDock() {
    if (!sections.length) return;

    var probe = window.scrollY + window.innerHeight * 0.4;
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].el.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) current = sections[i];
    }

    setActive(current.link);
  }

  /* ---------- Single scroll/rAF loop ---------- */

  var ticking = false;

  function update() {
    ticking = false;
    if (!prefersReducedMotion()) updateFocus();
    updateDock();
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", update);

  if (prefersReducedMotion()) {
    focusEls.forEach(function (el) {
      el.style.setProperty("--focus", "1");
    });
  }

  update();

  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(function () {
      updateDock();
    });
  }

  // On very narrow screens the dock list scrolls horizontally, so the
  // pill has to follow the list's own scroll, not just the window's.
  var dockList = dock ? dock.querySelector("ul") : null;
  if (dockList) {
    dockList.addEventListener("scroll", movePill, { passive: true });
  }

  /* =========================================================
     Glass specular sheen
     Tracks the pointer across each glass surface. Fine pointers
     only — on touch it would stick to the last tap.
     ========================================================= */

  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    var glasses = document.querySelectorAll(".glass");

    Array.prototype.forEach.call(glasses, function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;

        el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      });

      el.addEventListener("pointerleave", function () {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      });
    });
  }
})();
