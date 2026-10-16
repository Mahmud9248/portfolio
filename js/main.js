/* =========================================================
   Abdullah Al Mahmud — portfolio
   Theme toggle + scroll-driven focus effect.
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

  /* ---------- Focus effect ----------
     Brightness tracks distance from the vertical centre of the viewport,
     so the reader's eye is always drawn to the line they are on. */

  var focusEls = Array.prototype.slice.call(document.querySelectorAll("[data-focus]"));

  if (focusEls.length) {
    if (prefersReducedMotion()) {
      focusEls.forEach(function (el) {
        el.style.setProperty("--focus", "1");
      });
    } else {
      var ticking = false;

      var FLOOR_STRONG = 0.42; // epigraph: unfocused lines
      var FLOOR_SOFT = 0.72; // section statements: stays legible
      var SPREAD = 0.5; // fraction of viewport height that maps to full fade

      function updateFocus() {
        ticking = false;

        var vh = window.innerHeight;
        var center = vh / 2;
        var range = vh * SPREAD;

        for (var i = 0; i < focusEls.length; i++) {
          var el = focusEls[i];
          var rect = el.getBoundingClientRect();

          var floor = el.getAttribute("data-focus") === "soft" ? FLOOR_SOFT : FLOOR_STRONG;
          var elCenter = rect.top + rect.height / 2;

          var t = 1 - Math.min(Math.abs(elCenter - center) / range, 1);
          t = t * t; // ease-in on the falloff

          el.style.setProperty("--focus", (floor + t * (1 - floor)).toFixed(3));
        }
      }

      function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateFocus);
      }

      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      window.addEventListener("load", updateFocus);

      updateFocus();
    }
  }
})();
