# KeraKode page — design

Date: 2026-11-18 · Status: approved by Kera 2026-11-18 (incl. WhatsApp number and top-left link + footer credit)

## Intent

Abdullah Al Mahmud ("Kera") is known as a QA engineer. He also designs and builds
complete products. KeraKode is his builder brand. It gets its own page in the
portfolio that shows real shipped work and turns visitors into client enquiries.

The main way in is a footer credit on every project he builds:
**"Designed & built by KeraKode"** links to this page. Someone using the MPL site or the
North & Side store clicks it, lands here, and should leave thinking "this person
can build mine, and it will actually work."

The angle: he builds it, and then he tries to break it. The QA background is the
selling point. Every build ships already tested.

## Goals

- A standalone page at `https://mahmud9248.github.io/portfolio/kerakode/`, a
  stable URL that project footers can link to for good.
- Show three real projects, with live links where they exist.
- Make "I can build what you need" concrete with a short list of what he builds.
- End in a clear contact action: email and WhatsApp.
- A KeraKode entry with the logo on the main portfolio page, so recruiters can find
  the builder side too.

## Non-goals

- No contact form, backend or third-party form service.
- No blog, pricing page or case-study subpages.
- No separate domain or repo yet (approach C, possible later).
- No Liquid Glass. It was reverted on `main` (commit `35850e0`). Whether glass
  ever comes back is a separate, later decision.

## Anti-goals (a failure even if it works)

- The words "vibe coder", "AI-generated" or anything that undercuts the work.
- Reading like a template or agency boilerplate: no stock icons, emoji tiles,
  gradient headlines, or fake testimonials or metrics.
- Exposing client-private material: admin screens, real registrant or player data,
  store back office.
- Breaking the main portfolio's look, Lighthouse scores, or its no-JS and
  reduced-motion behaviour.

## Constraints

- Static site: plain HTML, CSS and JS, no build step, no dependencies (see README).
- Deploys via GitHub Pages on push to `main` (`.github/workflows/pages.yml`).
- Must match the current site, the **typographic poster** style: greyscale, Inter,
  hierarchy from brightness rather than labels, large type, no cards or rules. The
  tokens live in `:root` / `html[data-theme="light"]` in `css/style.css`.
- Dark and light theme, with the same theme toggle and the same stored preference
  as the main page.
- Accessibility per the user's global rules: hit targets ≥24px (44px on touch),
  zoom never disabled, visible focus, WCAG AA contrast.

## Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | New page in this repo at `/kerakode/`, sharing `css/style.css` plus a small page stylesheet | Ships with the existing deploy and shares tokens. The URL contains "portfolio", which is less brand-like |
| B | A section at the bottom of `index.html` | Least work, but mixes the recruiter audience with the client pitch, and footer links would land mid-résumé |
| C | Separate site (`kerakode.pages.dev` / own domain) | Strongest brand, but a second repo and deploy, and footer URLs churn if the domain changes |

Chosen: **A**. If a KeraKode domain is bought later, it can point at this page.

## Decided with Kera

- **Name:** KeraKode.
- **Logo:** "Terminal K". A geometric K (vertical stem plus a detached `<`
  chevron for the arms) with a small cursor block at the bottom right that blinks.
  Monochrome, `currentColor`, so it works on both themes. The blink stops under
  `prefers-reduced-motion`. The reference SVG (64×64 viewBox) is from the
  approved mockup:
  ```svg
  <svg viewBox="0 0 64 64"><rect x="10" y="10" width="7" height="44" rx="1.5"/>
  <polyline points="42,10 22,32 42,54" fill="none" stroke="currentColor" stroke-width="7"/>
  <rect class="caret" x="46" y="46" width="10" height="8"/></svg>
  ```
  The wordmark sits next to the logo: "Kera" at full tone, "Kode" one tone dimmer.
- **Projects, all three:**
  1. **MPL Season 7**: https://mplbd.pages.dev. The full-stack tournament site
     (registration on Cloudflare D1, players, results, rules, an authority console).
  2. **North & Side**: https://northandside.com. A client e-commerce store with a
     coming-soon page.
  3. **MPL Auction**: no public URL, because it runs offline on the tournament laptop.
     It is shown with screenshots of the control and display screens. Its standout
     detail is the live Bangla auctioneer commentary and gavel audio.
- **Contact:** email (`mailto:` with the subject "Project inquiry — KeraKode") and
  WhatsApp (`https://wa.me/8801701014210`, the number already on the site as
  `tel:+8801701014210`). No form.
- **Glass:** off. Use the poster style.

## Page outline

1. **Hero:** the large Terminal K plus the wordmark, then a headline in the spirit
   of *"I build it. Then I try to break it."* and one line saying who it is for (anyone
   who needs a site, store or tool built and working).
2. **Work:** one block per project with the name, a one-line "what it is",
   what was built (2–3 short points), one standout detail, and the live link or
   screenshots.
3. **What I build:** a short list (websites, web apps, e-commerce stores, live event
   tools, dashboards / admin consoles).
4. **Why it works:** every build is tested the way he tests professionally (the QA
   angle stated as a strength, 2–3 sentences, no résumé repeat).
5. **Contact:** the email and WhatsApp actions, large.
6. **Footer:** a link back to the main portfolio.

## Builder's calls (Claude's proposals, not yet confirmed by Kera)

- **Where the KeraKode entry goes on the main page.** The reverted site has no menu
  bar (the glass dock is gone). Proposal: a small fixed "logo + KeraKode" link at
  the top-left, mirroring the theme toggle at the top-right, plus the main page's
  footer credit changing to "Designed & built by KeraKode" with a link.
- **Copy:** Claude writes it, in the tone of the existing site's short,
  confident sentences. Kera reviews it.
- **Auction screenshots:** captured by running the app at
  `C:\Users\KeraMahmud\Documents\Default Project\mpl-auction` locally
  (`start.bat` / `node server.js`). If it has no built-in sample data, load made-up
  player and team names before capturing; real names never appear. Saved saved as optimized images in
  `assets/kerakode/`. Screenshots of the live sites are optional (the links do the work).
- **DESIGN.md:** the global CLAUDE.md asks for one. The portfolio has its own
  documented system (README "Design" plus the CSS tokens), so DESIGN.md is written
  from those, not copied from a brand template.
- **SEO:** its own `<title>`, description, canonical and OG tags, and a sitemap entry. The OG
  image can reuse the main card at first.
- **Favicon on the KeraKode page:** the Terminal K.

## Left to the builder

- Exact copy wording, spacing and responsive breakpoints within the existing tokens.
- How `js/main.js` is shared (Claude's call: null-guard main-page-only features; small
  markup hooks on `index.html` are allowed, since the only visible main-page changes
  are the KeraKode link and footer credit) (theme toggle on both pages) without errors when
  main-page-only elements are missing.
- Screenshot sizing, format and lazy-loading.

## Done means

- `/kerakode/` is live, linked from the main page, and passes a browser check at
  phone and desktop widths, in both themes, with JS on and off.
- The logo renders crisply at menu size and hero size, and the caret blink respects
  reduced motion.
- The email and WhatsApp links open correctly. All three project links or screenshots work.
- The main page is unchanged apart from the new KeraKode link and the footer credit.
