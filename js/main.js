/* =========================================================
   Abdullah Al Mahmud — Portfolio
   Vanilla JS. No dependencies.
   Features: theme motion, staggered intro, scroll reveals,
   focus-reading epigraph, expanding rows, cursor preview,
   command menu (⌘K).
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme ---------------- */
  var THEME_KEY = "aam-theme";

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  }

  var stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(function () { applyTheme(next); });
    } else {
      applyTheme(next);
    }
  }

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  /* ---------------- Top bar ---------------- */
  var topbar = document.querySelector(".topbar");
  function onScrollBar() {
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 10);
  }
  onScrollBar();
  window.addEventListener("scroll", onScrollBar, { passive: true });

  /* ---------------- Footer year ---------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------- Staggered intro ---------------- */
  var introLine = document.querySelector("[data-reveal-words]");
  if (introLine) {
    var parts = Array.prototype.slice.call(introLine.querySelectorAll(".word, .hl"));
    parts.forEach(function (el, i) {
      el.style.transitionDelay = (reduceMotion ? 0 : 90 + i * 55) + "ms";
    });

    var introShown = false;
    function showIntro() {
      if (introShown) return;
      introShown = true;
      introLine.classList.add("in");
    }
    requestAnimationFrame(function () { requestAnimationFrame(showIntro); });
    // Safety net: rAF is paused in background tabs, so guarantee the
    // intro never stays invisible.
    setTimeout(showIntro, 700);
  }

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Safety net: if anything prevents the observer from firing, reveal
  // whatever is already on screen rather than leaving it invisible.
  window.addEventListener("load", function () {
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    }, 1200);
  });

  /* ---------------- Focus-reading epigraph ---------------- */
  var focusLines = Array.prototype.slice.call(document.querySelectorAll("[data-focus]"));
  if (focusLines.length && !reduceMotion) {
    var ticking = false;
    function updateFocus() {
      ticking = false;
      var vh = window.innerHeight;
      var center = vh / 2;
      var falloff = vh * 0.42;
      focusLines.forEach(function (line) {
        var rect = line.getBoundingClientRect();
        var lineCenter = rect.top + rect.height / 2;
        var d = Math.abs(lineCenter - center) / falloff;
        var v = 1 - Math.min(d, 1);
        v = v * v;                       /* ease */
        line.style.setProperty("--focus", (0.1 + v * 0.9).toFixed(3));
      });
    }
    function requestFocus() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFocus);
    }
    updateFocus();
    window.addEventListener("scroll", requestFocus, { passive: true });
    window.addEventListener("resize", requestFocus);
  } else {
    focusLines.forEach(function (l) { l.style.setProperty("--focus", "1"); });
  }

  /* ---------------- Expanding rows ---------------- */
  Array.prototype.slice.call(document.querySelectorAll(".row[aria-expanded]")).forEach(function (row) {
    row.addEventListener("click", function () {
      var detail = row.parentNode.querySelector(".row-detail");
      if (!detail) return;
      var open = row.getAttribute("aria-expanded") === "true";
      row.setAttribute("aria-expanded", open ? "false" : "true");
      detail.hidden = open;
    });
  });

  /* ---------------- Cursor-following preview ---------------- */
  var preview = document.getElementById("cursor-preview");
  if (preview && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var previewLabel = preview.querySelector("span");
    var targetX = 0, targetY = 0, curX = 0, curY = 0;
    var visible = false, rafId = null;

    function loop() {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      preview.style.transform = "translate3d(" + curX + "px," + curY + "px,0)";
      if (Math.abs(targetX - curX) > 0.3 || Math.abs(targetY - curY) > 0.3) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    function kick() { if (rafId === null) rafId = requestAnimationFrame(loop); }

    document.addEventListener("mousemove", function (e) {
      targetX = e.clientX + 16;
      targetY = e.clientY + 18;
      if (!visible) { curX = targetX - 24; curY = targetY - 8; }
      kick();
    }, { passive: true });

    var previewTargets = document.querySelectorAll("[data-preview]");
    Array.prototype.slice.call(previewTargets).forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        previewLabel.textContent = el.getAttribute("data-preview") || "";
        preview.classList.add("on");
        visible = true;
        kick();
      });
      el.addEventListener("mouseleave", function () {
        preview.classList.remove("on");
        visible = false;
      });
    });

    document.addEventListener("scroll", function () {
      preview.classList.remove("on");
      visible = false;
    }, { passive: true });
  }

  /* ---------------- Toast ---------------- */
  var toastEl = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.setAttribute("role", "status");
      toastEl.style.cssText =
        "position:fixed;left:50%;bottom:1.6rem;transform:translateX(-50%) translateY(8px);" +
        "z-index:600;padding:.55rem .9rem;border-radius:999px;" +
        "background:var(--elev);border:1px solid var(--line-strong);" +
        "font-family:var(--mono);font-size:.74rem;color:var(--text);" +
        "opacity:0;transition:opacity .25s ease,transform .25s cubic-bezier(.16,1,.3,1);pointer-events:none;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    requestAnimationFrame(function () {
      toastEl.style.opacity = "1";
      toastEl.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(-50%) translateY(8px)";
    }, 1900);
  }

  /* ---------------- Command menu ---------------- */
  var cmdk = document.getElementById("cmdk");
  var cmdkInput = document.getElementById("cmdk-input");
  var cmdkList = document.getElementById("cmdk-list");
  var cmdkOpenBtn = document.getElementById("cmdk-open");

  var commands = [
    { label: "Go to Experience", group: "Navigate", run: function () { goto("#experience"); } },
    { label: "Go to Expertise", group: "Navigate", run: function () { goto("#expertise"); } },
    { label: "Go to Highlights", group: "Navigate", run: function () { goto("#highlights"); } },
    { label: "Go to Contact", group: "Navigate", run: function () { goto("#contact"); } },
    { label: "Go to top", group: "Navigate", run: function () { goto("#top"); } },
    { label: "Toggle light / dark theme", group: "Appearance", run: toggleTheme },
    { label: "Copy email address", group: "Actions", run: copyEmail },
    { label: "Download résumé", group: "Actions", run: function () { window.location.href = "assets/resume.pdf"; } },
    { label: "Open LinkedIn", group: "Links", run: function () { window.open("https://www.linkedin.com/in/aamahmuds/", "_blank", "noopener"); } },
    { label: "Open GitHub", group: "Links", run: function () { window.open("https://github.com/Mahmud9248", "_blank", "noopener"); } },
    { label: "Send an email", group: "Links", run: function () { window.location.href = "mailto:mahmudnis@gmail.com"; } },
    { label: "Call +880 1701 014210", group: "Links", run: function () { window.location.href = "tel:+8801701014210"; } }
  ];

  function goto(hash) {
    closeCmdk();
    var el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function copyEmail() {
    var email = "mahmudnis@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(
        function () { toast("Email copied"); },
        function () { toast(email); }
      );
    } else {
      toast(email);
    }
  }

  var filtered = commands.slice();
  var activeIndex = 0;

  function renderCmds(query) {
    var q = (query || "").trim().toLowerCase();
    filtered = q
      ? commands.filter(function (c) { return (c.label + " " + c.group).toLowerCase().indexOf(q) !== -1; })
      : commands.slice();

    activeIndex = 0;
    cmdkList.innerHTML = "";

    if (!filtered.length) {
      var empty = document.createElement("li");
      empty.className = "cmdk-empty";
      empty.textContent = "No matching commands";
      cmdkList.appendChild(empty);
      return;
    }

    filtered.forEach(function (cmd, i) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmdk-item";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");

      var label = document.createElement("span");
      label.textContent = cmd.label;
      var group = document.createElement("span");
      group.className = "cmdk-group";
      group.textContent = cmd.group;

      btn.appendChild(label);
      btn.appendChild(group);
      btn.addEventListener("mousemove", function () { setActive(i); });
      btn.addEventListener("click", function () { runCmd(cmd); });
      li.appendChild(btn);
      cmdkList.appendChild(li);
    });
  }

  function setActive(i) {
    if (!filtered.length) return;
    activeIndex = (i + filtered.length) % filtered.length;
    var items = cmdkList.querySelectorAll(".cmdk-item");
    Array.prototype.forEach.call(items, function (el, idx) {
      el.setAttribute("aria-selected", idx === activeIndex ? "true" : "false");
    });
    if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function runCmd(cmd) {
    if (!cmd) return;
    closeCmdk();
    setTimeout(function () { cmd.run(); }, 0);
  }

  function openCmdk() {
    if (!cmdk) return;
    cmdk.hidden = false;
    document.body.style.overflow = "hidden";
    if (cmdkInput) { cmdkInput.value = ""; }
    renderCmds("");
    if (cmdkInput) cmdkInput.focus();
  }

  function closeCmdk() {
    if (!cmdk) return;
    cmdk.hidden = true;
    document.body.style.overflow = "";
  }

  if (cmdk) {
    if (cmdkOpenBtn) cmdkOpenBtn.addEventListener("click", openCmdk);

    Array.prototype.slice.call(document.querySelectorAll("[data-cmdk-close]")).forEach(function (el) {
      el.addEventListener("click", closeCmdk);
    });

    if (cmdkInput) {
      cmdkInput.addEventListener("input", function () { renderCmds(cmdkInput.value); });
      cmdkInput.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeIndex + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeIndex - 1); }
        else if (e.key === "Enter") { e.preventDefault(); runCmd(filtered[activeIndex]); }
        else if (e.key === "Escape") { e.preventDefault(); closeCmdk(); }
      });
    }

    document.addEventListener("keydown", function (e) {
      var key = e.key ? e.key.toLowerCase() : "";
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        cmdk.hidden ? openCmdk() : closeCmdk();
      } else if (key === "escape" && !cmdk.hidden) {
        closeCmdk();
      }
    });
  }
})();
