# Abdullah Al Mahmud — Portfolio

A personal portfolio site for **Abdullah Al Mahmud**, Software Quality Assurance Engineer.
Static, dependency-free, and built with plain HTML, CSS, and JavaScript.

## Structure

```
portfolio/
├── index.html          # Single-page site
├── css/style.css       # Greyscale dark theme (light mode included)
├── js/main.js          # Theme toggle, mobile nav, scroll reveal
└── assets/
    ├── resume.pdf      # Résumé download
    └── portrait.jpg    # Add your headshot here (see below)
```

## Adding your photo

Save your headshot as `assets/portrait.jpg` (portrait crop, roughly 3:4).
If the file is missing, the site gracefully falls back to your initials — nothing breaks.

## Run locally

Just open `index.html` in a browser. No build step, no dependencies.

For a local server (optional):

```bash
npx serve .
```

## Deploy

Works on any static host:

- **GitHub Pages** — Settings → Pages → Deploy from branch → `main` / root
- **Cloudflare Pages** — connect the repo, no build command, output dir `/`
- **Netlify / Vercel** — drag the folder, or connect the repo

## Customising

| What | Where |
|---|---|
| Text content | `index.html` |
| Colors & spacing | `:root` and `html[data-theme]` in `css/style.css` |
| Animations | `.reveal` styles + `js/main.js` |
