# KeraKode Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone KeraKode builder-showcase page at `/kerakode/`, linked from the main portfolio, that turns footer-credit visitors into client enquiries.

**Architecture:** A second static page inside the existing repo. It reuses `css/style.css` (tokens, theme, poster typography) and `js/main.js` (theme toggle, year, focus effect — already null-guarded, so no JS changes are needed). Page-only styles live in `css/kerakode.css`. The Terminal K logo is inline SVG using `currentColor`; its caret blink is one shared CSS rule.

**Tech Stack:** Plain HTML/CSS/JS, Inter via Google Fonts, GitHub Pages. No build step, no dependencies.

**Spec:** `docs/superpowers/specs/2026-11-18-kerakode-page-design.md`

## Global Constraints

- Poster style only: greyscale tokens from `:root` / `html[data-theme="light"]` in `css/style.css`. No Liquid Glass, no gradients on text, no emoji, no stock icons, no cards/rules.
- Never use the words "vibe coder" or "AI-generated" anywhere.
- No dependencies, no build step, no form/backend.
- Hit targets ≥24px (≥44px for touch-primary CTAs); never disable zoom; visible `:focus-visible`; WCAG AA contrast in both themes.
- Must work with JS off (content and links all usable; theme falls back to dark).
- `prefers-reduced-motion: reduce` stops the caret blink and the focus effect.
- Email: `mailto:mahmudnis@gmail.com?subject=Project%20inquiry%20%E2%80%94%20KeraKode`. WhatsApp: `https://wa.me/8801701014210`.
- Project URLs: `https://mplbd.pages.dev`, `https://northandside.com` (both `target="_blank" rel="noopener"`).
- Page URL: `https://mahmud9248.github.io/portfolio/kerakode/`.
- Logo SVG (64×64 viewBox): stem `rect x=10 y=10 w=7 h=44 rx=1.5`; chevron `polyline 42,10 22,32 42,54` stroke-width 7; caret `rect.kk-caret x=46 y=46 w=10 h=8`.

## Review Focus

1. **Phone width (375px)** — the fixed top-left KeraKode link must not overlap the avatar/name or the theme toggle on the main page. Test in Task 4.
2. **JS disabled** — the new page renders fully, theme toggle is inert but harmless, `#year` empty is acceptable. Test in Task 5.
3. **Light theme** — logo, wordmark dim tone and screenshots' borders stay ≥AA. Test in Task 5.
4. **Relative paths from `/kerakode/`** — CSS, JS, fonts, favicon, images all load under the `/portfolio/` Pages base path, not only from `localhost` root. Test in Task 2 (served from a parent dir so the path has a prefix).
5. **Real data in auction screenshots** — no real player names, photos or team owners visible. Test in Task 3.

---

### Task 1: Logo mark + DESIGN.md

**Files:**
- Modify: `css/style.css` (append a `/* KeraKode mark */` block before the final `@media (prefers-reduced-motion: reduce)` block at ~line 445, and add `.kk-caret { animation: none; }` inside that block)
- Create: `DESIGN.md`

**Interfaces:**
- Produces: CSS classes `.kk-mark` (inline-block svg, `width/height: 1em`, `fill: currentColor`), `.kk-caret` (blink: `@keyframes kk-blink { 50% { opacity: 0 } }`, `1.1s steps(1) infinite`), `.kk-word` (wordmark wrapper) and `.kk-word .kk-dim` (color `var(--tone-3)`). Markup snippet used by Tasks 2 and 4:
  ```html
  <svg class="kk-mark" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="10" width="7" height="44" rx="1.5"/><polyline points="42,10 22,32 42,54" fill="none" stroke="currentColor" stroke-width="7"/><rect class="kk-caret" x="46" y="46" width="10" height="8"/></svg>
  ```

- [ ] **Step 1:** Add the CSS block. Blink only inside `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 2:** Write `DESIGN.md` from the site's own system: the color tokens (both themes, exact hex from `css/style.css`), Inter 400/500/600/700, brightness hierarchy (four text tones), the poster rules (one measure `--maxw: 820px`, no cards/rules), motion rules (focus effect, reduced motion), the KeraKode mark spec above, and "Liquid Glass: removed in 35850e0, not to be reintroduced without approval".
- [ ] **Step 3: Verify** — open a scratch HTML with the snippet at 16px and 120px in both themes: crisp, caret blinks, stops with reduced motion emulated.
- [ ] **Step 4: Commit** — `git add css/style.css DESIGN.md && git commit -m "Add KeraKode mark styles and DESIGN.md"`

### Task 2: The KeraKode page

**Files:**
- Create: `kerakode/index.html`
- Create: `css/kerakode.css`
- Create: `.claude/launch.json` (config `portfolio`: `python -m http.server 5173` with `cwd` = the repo's parent directory, so the page is served at `/<repo-dir>/kerakode/`, which exercises the path prefix the way GitHub Pages' `/portfolio/` does)

**Interfaces:**
- Consumes: Task 1 classes and markup snippet.
- Produces: section ids `#work`, `#build`, `#why`, `#contact`; project anchors `#mpl-season7`, `#north-and-side`, `#mpl-auction`; image slots `../assets/kerakode/auction-control.webp` and `../assets/kerakode/auction-display.webp` (filled in Task 3; use `width`/`height` attributes 1600×900 and `loading="lazy"`).

- [ ] **Step 1: Head.** Copy `index.html`'s head structure (charset, viewport *without* `maximum-scale`/`user-scalable`, theme-color meta, Inter link). Own `<title>KeraKode — Designed & built by Abdullah Al Mahmud</title>`, description, `<link rel="canonical" href="https://mahmud9248.github.io/portfolio/kerakode/">`, OG/Twitter tags (image `../assets/og-image.png` absolute URL), favicon = the mark as an SVG data URI on `#0a0a0a`. Stylesheets `../css/style.css` then `../css/kerakode.css`; script `../js/main.js` at end of body.
- [ ] **Step 2: Body**, in order, reusing existing classes where they fit (`.theme-toggle`, `.display`, `.chapter`, `.chapter-statement`, `.footer`, `data-focus="soft"` on statements):
  1. skip link + theme toggle (same markup as `index.html`).
  2. Hero `#top`: mark at ~`clamp(72px, 14vw, 128px)`, wordmark `Kera<span class="kk-dim">Kode</span>` as the `h1`, headline "I build it. Then I try to break it.", one line: "Websites, stores and tools for people who need them built — and working."
  3. `#work`: three `<article>`s. Each: name (`h3`), one-line what-it-is, 2–3 built points, one standout line, then a text link ("Visit mplbd.pages.dev ↗" / "Visit northandside.com ↗") or, for the auction, the two screenshots in a `<figure>` with a `<figcaption>` ("Runs offline on the tournament laptop — control screen and live display").
     - MPL Season 7: tournament site with player registration on Cloudflare D1, player list, results, rules, and a server-backed authority console. Standout: registration and review shared live across devices.
     - North & Side: client e-commerce store with a coming-soon launch page. Standout: designed and built end-to-end for a real brand.
     - MPL Auction: two-screen live player auction — operator control + big-screen display, with budget rules enforced so no team can overspend. Standout: live Bangla auctioneer commentary and gavel sounds.
  4. `#build`: list — Websites · Web apps · E-commerce stores · Live event tools · Dashboards & admin consoles.
  5. `#why`: 2–3 sentences: QA engineer by profession, so every build is tested the way he tests for a living — edge cases, real devices, failure paths — before it ships.
  6. `#contact`: heading "Have something to build?"; two large links (≥44px tall): Email (mailto above) and WhatsApp (wa.me above, `target="_blank" rel="noopener"`).
  7. Footer: "KeraKode by Abdullah Al Mahmud" + link "← Portfolio" to `../` + `© <span id="year">`.
- [ ] **Step 3: `css/kerakode.css`** — only what `style.css` lacks: hero mark sizing, project article spacing, screenshot figure (2-up ≥720px, stacked below; 1px `var(--line)` border, radius 10px), contact CTA sizing. Tokens only, no new colors.
- [ ] **Step 4: Verify** — start preview, open `/<repo-dir>/kerakode/`; network panel shows zero 404s (screenshots may 404 until Task 3); console has no errors; tab through: every link has a visible focus ring.
- [ ] **Step 5: Commit** — `git add kerakode css/kerakode.css .claude/launch.json && git commit -m "Add the KeraKode page"`

### Task 3: Auction screenshots

**Files:**
- Create: `assets/kerakode/auction-control.webp`, `assets/kerakode/auction-display.webp`
- Read-only: `C:\Users\KeraMahmud\Documents\Default Project\mpl-auction` (do not commit anything there)

**Interfaces:**
- Produces: the two image files at the paths Task 2 references, 1600×900, each < 250 KB.

- [ ] **Step 1:** Inspect `mpl-auction/config.json` (`"mode": "demo"`) and `assets/players/`. If player names/photos are real people, run against a temporary copy of the app in the scratchpad with a config whose names are made up ("Player 01"…, teams "Team A"…) and photos replaced by the app's fallback/initials. Never edit the original repo.
- [ ] **Step 2:** `node server.js` in that copy; open the control and display views in the browser pane at 1600×900; drive one lot to a live bid so both screens show activity; screenshot each.
- [ ] **Step 3:** Convert to WebP (≤250 KB) and save to `assets/kerakode/`.
- [ ] **Step 4: Verify** — view both images: no real names, faces or phone numbers visible; reload the KeraKode page: screenshots render, no 404s.
- [ ] **Step 5: Commit** — `git add assets/kerakode && git commit -m "Add MPL Auction screenshots for KeraKode"`

### Task 4: Link it from the main page

**Files:**
- Modify: `index.html` (after the theme toggle button ~line 44; footer line ~188)
- Modify: `css/kerakode.css` is page-only, so put the `.kk-link` rule in `css/style.css` next to `.theme-toggle` (~line 133)
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: Task 1 snippet and classes.

- [ ] **Step 1:** Add `<a class="kk-link" href="kerakode/">` + mark + `Kera<span class="kk-dim">Kode</span>` after the theme toggle. `.kk-link`: `position: fixed`, top/left mirroring `.theme-toggle`'s offsets, same height as the toggle, tone `var(--tone-2)` → `var(--text)` on hover/focus.
- [ ] **Step 2:** Footer: `<p>Designed &amp; built by <a href="kerakode/">KeraKode</a></p>`.
- [ ] **Step 3:** `sitemap.xml`: add a `<url>` for `https://mahmud9248.github.io/portfolio/kerakode/` matching the existing entry's format.
- [ ] **Step 4: Verify** at 375×812 and 1440×900, both themes: the link never overlaps the avatar, the name or the toggle (if it does at 375px, hide the wordmark below 480px and keep the 44×44 mark); clicking it opens the KeraKode page; the rest of `index.html` is visually unchanged (compare screenshots before/after).
- [ ] **Step 5: Commit** — `git add index.html css/style.css sitemap.xml && git commit -m "Link KeraKode from the portfolio"`

### Task 5: Browser QA pass

**Files:** fixes only, wherever QA finds them.

- [ ] **Step 1:** Both pages at 375, 768, 1440 widths × dark/light: screenshot each; no overflow, no horizontal scroll, no CTA overlapping text.
- [ ] **Step 2:** JS disabled: KeraKode page fully readable, all links work.
- [ ] **Step 3:** Reduced motion emulated: caret static, no focus fade.
- [ ] **Step 4:** Click every link: mplbd.pages.dev and northandside.com open in new tabs; mailto has the subject; wa.me goes to 8801701014210; "← Portfolio" returns home.
- [ ] **Step 5:** Run Lighthouse on the KeraKode page; accessibility and SEO ≥ the main page's scores (main page is 100/100/100).
- [ ] **Step 6:** Update `README.md` structure tree with `kerakode/`, `css/kerakode.css`, `assets/kerakode/`, `DESIGN.md`. Commit fixes + README: `git commit -am "QA fixes for KeraKode"`.
