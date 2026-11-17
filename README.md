# Abdullah Al Mahmud — Portfolio

A personal portfolio site for **Abdullah Al Mahmud**, Software Quality Assurance Engineer.
Static, dependency-free, and built with plain HTML, CSS, and JavaScript.

## Structure

```
portfolio/
├── index.html          # Single-page site
├── css/style.css       # Greyscale dark theme (light mode included)
├── js/main.js          # Theme toggle + scroll-driven focus effect
├── robots.txt          # Crawler rules
├── sitemap.xml         # Sitemap for search engines
└── assets/
    ├── resume.pdf      # Résumé download
    ├── og-image.png    # 1200×630 social preview card
    └── portrait.jpg    # Add your headshot here (see below)
```

## Adding your photo

Save your headshot as `assets/portrait.jpg` (portrait crop, roughly 3:4).
If the file is missing, the site gracefully falls back to your initials — nothing breaks.

## Social preview

`assets/og-image.png` is the 1200×630 card shown when the link is shared on
LinkedIn, X, Slack, etc. Regenerate it with `tools/make-og.ps1` if your details change.

## Run locally

Just open `index.html` in a browser. No build step, no dependencies.

For a local server (optional):

```bash
npx serve .
```

## Deploy

GitHub Pages must be enabled **once** before auto-deploy works:

1. Repo **Settings → Pages**
2. **Build and deployment → Source: GitHub Actions**

After that, every push to `main` deploys automatically via
`.github/workflows/pages.yml` — live at <https://mahmud9248.github.io/portfolio/>.

Works on any other static host too:

- **Cloudflare Pages** — connect the repo, no build command, output dir `/`
- **Netlify / Vercel** — drag the folder, or connect the repo

## Design

The site is a **typographic poster**: one measure, large type, raw on the
background, and no cards, chips, borders, or rules. Visual hierarchy comes from
*brightness* instead of labels — only four text tones exist.

The signature interaction is the **focus effect**: as you scroll, each line
brightens as it crosses the vertical centre of the viewport and dims as it
leaves. It is driven entirely by a `--focus` custom property set per element in
`js/main.js`, so the effect degrades to plain, fully-legible text when
JavaScript is unavailable or `prefers-reduced-motion` is set.

## Customising

| What | Where |
|---|---|
| Text content | `index.html` |
| Colors, tones & spacing | `:root` and `html[data-theme="light"]` in `css/style.css` |
| Motion | `[data-focus]` rules in `css/style.css` + `js/main.js` |
| Focus strength | `FLOOR_STRONG` / `FLOOR_SOFT` / `SPREAD` in `js/main.js` |
