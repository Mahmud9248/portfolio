# Abdullah Al Mahmud — Portfolio

A personal portfolio site for **Abdullah Al Mahmud**, Software Quality Assurance Engineer.
Static, dependency-free, and built with plain HTML, CSS, and JavaScript.

## Structure

```
portfolio/
├── index.html          # Single-page site
├── css/style.css       # Greyscale dark theme (light mode included)
├── js/main.js          # Theme, focus effect, glass sheen, glass dock
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

Two layers.

**The poster underneath** is unchanged in spirit: one measure, large type, raw
on the background, no cards or rules. Hierarchy comes from *brightness* rather
than labels — only four text tones exist.

**The Liquid Glass layer on top** is a translucent material built from four
stacked parts:

1. a translucent fill plus a `backdrop-filter` blur,
2. a **frosted texture** — fine desaturated noise tiled inside the glass, so it
   reads as etched glass rather than a flat translucent rectangle,
3. a **specular rim** — a 1px gradient hairline, brightest top-left and
   bottom-right, near-invisible through the middle, drawn with a masked
   pseudo-element,
4. inset edge lighting (a light top edge, a dark bottom edge) plus an outer
   light **bloom**, which is what gives each surface apparent thickness.

It is used on the bottom dock, the theme toggle, the avatar, every link
capsule, every tool chip, the availability badge, the experience entries, and
the highlights list. Everything shares the same tokens, so the material stays
consistent across sizes; only the blur radius varies (large panels drop to
`14px`, since there are several of them on screen at once).

### Text on glass

A lighter surface eats contrast, and the poster's mid-grey body text is tuned
against the *background*, not against glass. Rather than dim the material,
on-glass text gets its own floor: `--on-glass-3` is the dimmest tone permitted
on a glass surface, chosen to hold **≥4.6:1** against the brightest ambient
the orbs can put behind a panel.

### Why there's an ambient light field

Glass is invisible over flat black — `backdrop-filter` needs variation behind it
to refract. So `.ambient` holds four large, slowly drifting greyscale gradients
(pure greys, no hue). They exist purely to give the glass something to read, and
they're deliberately faint so they never compromise text contrast.

Their peak brightness is the constraint that sets `--on-glass-3`: turn the orbs
up and that tone has to come up with them.

### Graceful degradation

| Condition | Result |
|---|---|
| No `backdrop-filter` | Solid `--elev` panels, still fully legible |
| `prefers-reduced-transparency` | Glass goes opaque, ambient field hidden |
| `prefers-reduced-motion` | Ambient drift stops, focus effect resolves to full opacity |
| No JavaScript | Focus effect resolves to full opacity; dock pill stays put; progress bar stays empty |

## Customising

| What | Where |
|---|---|
| Text content | `index.html` |
| Colors, tones & spacing | `:root` and `html[data-theme="light"]` in `css/style.css` |
| Glass material | `--glass-*` tokens in `css/style.css` |
| On-glass text floor | `--on-glass-3` in `css/style.css` (must clear 4.5:1 vs the orbs) |
| Ambient light | `--orb` / `--orb-soft` and the `drift-*` keyframes |
| Motion | `[data-focus]` rules in `css/style.css` + `js/main.js` |
| Focus strength | `FLOOR_STRONG` / `FLOOR_SOFT` / `SPREAD` in `js/main.js` |
