# Vira-Latas Metaleiros — Website Dev Plan

> Living document. Update as decisions are made.

---

## Project context

**Vira-Latas Metaleiros** — a heavy metal concert crew based in Hamburg, Germany. Majority Brazilian with international members. "Vira-lata" = stray mutt in Portuguese; a badge of honour, the lovable underdog.

Vibe: Wacken-festival-meets-playful-metal. Gritty aesthetic, warm self-aware tone.

---

## Target output

- Single-page scroll site hosted on **GitHub Pages**
- Static HTML + CSS + JS — **no build step**
- Sections: Hero → Next Show Marquee → About → Shows → Connect/Social → Footer
- Language toggle: EN / PT-BR / DE (JS in-place swap, no reload, localStorage-persisted)
- Mobile-first (primary use case: phones in bars)

---

## Step 1 — Inspect ✅

### What the prototype contains (`design-system/`)

**`design-system/index.html`** (37 KB) — Complete single-page prototype with:
- **Sticky topbar** — logo, nav (Shows / About / Connect), EN/PT/DE language pill
- **Hero** — full-viewport, stage-light conic gradient background, animated logo glow pulse, h1 in Metal Mania display font, tagline + pitch + 2 CTA buttons, animated scroll cue
- **Marquee strip** — blood-red background, scrolling `<marquee>`-style animation with show teasers
- **About section** — bone-white background, 2-col grid: left = copy (kicker, h2, pull-quote, paragraphs); right sticky sidecar = "vira-lata" dictionary card + stats card (numbers at-a-glance). Torn-paper SVG dividers between sections.
- **Shows section** — dark background, poster-wall / vertical timeline hybrid. Date column (day/month/weekday) + diamond bullet marker + band name(s) + venue/city meta + tickets button. Responsive to 1-col at 720px.
- **Connect section** — slate-deep background, Instagram hero card (full-width, hover shifts to IG gradient), + 3 "crew-built tools" cards (Companion App, Moshsplit, Setlist Viralatas) — each with glyphs, titles, desc, pill label.
- **Footer** — logo lockup, nav links, a footer tagline in `--f-stencil`.

**`design-system/shared/brand.css`** (6 KB) — Complete design token file:
- Color vars: `--bone`, `--ink`, `--caramel`, `--blood`, `--slate-deep`, `--rule`, etc.
- Font stack: Metal Mania (display), Rye (stencil), Bungee (pop/caps), Space Grotesk (body), JetBrains Mono — loaded from Google Fonts
- Utility classes: `.grain`, `.grain-light`, `.display`, `.btn`, `.btn-caramel`, `.btn-blood`, `.torn`, `.torn-flip`, `.placeholder`
- Global resets, `::selection` style

**`design-system/shared/i18n.js`** (8 KB) — Complete i18n + data file:
- `window.VL_I18N` — full translation object for all 3 languages (EN/PT/DE)
- `window.VL_SHOWS` — 6 seeded shows with date, bands, venue, city, going-count, status, note, url
- `window.VL_lang` — localStorage helper (get/set with `vl-lang` key)

**`design-system/assets/logo.png`** (300 KB) — The mascot logo (stray dog flanked by fist + beer steins)

**Visual style summary:** Dark, gritty, warm. Deep charcoal (#0d0d10) base with caramel (#d97b2c) accents and blood-red (#c01e1e) CTAs. Bone-white (#f2ebde) used as section contrast. Grain texture overlays. SVG torn-paper dividers. Heavy metal display fonts. Offset box-shadow "brutalist card" style. Every hover has a translate(-x,-y) + offset shadow interaction.

**JS interactions already in prototype:**
- Language toggle (EN/PT/DE) via `data-t` attributes, `innerHTML` swaps, `aria-pressed` management
- Show rendering via `renderShows(lang)` generating poster HTML from `VL_SHOWS`
- LocalStorage language persistence
- CSS animations: logo glow pulse, marquee scroll, hero scroll-cue drop

### What's at the repo root

```
README.md   (2 lines)
.git/
design-system/
```

**Nothing scaffolded yet** — no `index.html`, no `styles.css`, no `script.js`, no `.github/`, no `shows.json`, no `favicon.ico`.

### What's missing to ship

1. `index.html` at root (or `/docs/index.html`) — copy + clean prototype HTML
2. `assets/logo.png` at root (or relative path fix)
3. `styles/brand.css` or inline styles
4. `script.js` (i18n + shows logic)
5. `shows.json` — separate data file for easy hand-editing (currently embedded in i18n.js)
6. `favicon.ico` / `favicon.svg`
7. `<meta>` tags: description, OG title/image/url, Twitter card
8. GitHub Actions workflow (`.github/workflows/deploy.yml`) OR manual GitHub Pages config
9. `CNAME` file if using a custom domain

---

## Step 2 — Decisions (record answers here as they come in)

### Batch 1 — Foundations

| Question | Answer |
|---|---|
| Output: static HTML+CSS+JS, no build step? | ✅ Confirmed |
| Site location: root `/`, `/docs`, or `gh-pages` branch? | ✅ Repo root (`/`) |
| Custom domain or `github.io/repo` URL? | ✅ Default `github.io/repo` |
| GitHub Actions workflow, or manual Pages config? | ✅ Manual (flip switch in Settings) |

### Batch 2 — Prototype translation

| Question | Answer |
|---|---|
| Pixel-faithful or OK to clean up rough spots? | ✅ Full creative licence |
| Any sections to remove/reorder/add? | ✅ Keep all as-is |
| Language toggle: in-place JS swap (recommended) or separate HTML files? | ✅ In-place JS |

### Batch 3 — Shows data + assets

| Question | Answer |
|---|---|
| Shows data: `shows.json` at root, or inline in HTML? | ✅ `shows.json`, loaded by `fetch()` |
| Extra show fields beyond date/bands/venue/city/ticket link? | ✅ going-count, status, per-lang note |
| Logo: copy to root `assets/`? | ✅ Done |

### Batch 4 — Polish

| Question | Answer |
|---|---|
| Favicon from logo? | ✅ SVG favicon generated |
| Analytics? | ✅ None |
| SEO meta + OG image? | ✅ Meta tags + OG image generated |

---

## Step 3 — Build milestones

Track progress here:

- [x] **M1: Scaffold** — `index.html`, `assets/`, `styles.css`, `script.js` at repo root. Local serve confirmed at `http://127.0.0.1:8765`.
- [x] **M2: Translate prototype** — Clean semantic HTML5 + full CSS matching prototype. Improvements: scroll-reveal animations, `<fieldset>` lang pickers, `scroll-behavior: smooth`, `scroll-margin-top` on sections.
- [x] **M3: Language toggle** — EN/PT/DE in-place swap via `data-t` attributes, `script.js` `T` object, localStorage persistence.
- [x] **M4: Shows section** — `fetch('./shows.json')` on load, poster card renderer, going-count pill added, 6 seeded shows.
- [x] **M5: Social links** — Instagram and footer links use `https://instagram.com/PLACEHOLDER` clearly marked.
- [ ] **M6: Mobile responsiveness** — Test at 375px, fix breakage. ← NEXT
- [ ] **M7: Polish + deploy** — Meta tags ✅ OG image ✅ favicon ✅ · GitHub Pages setup instructions.

---

## Conventions

- **Placeholder URLs:** `https://instagram.com/PLACEHOLDER`, `https://wa.me/PLACEHOLDER`
- **Placeholder text:** marked `[PLACEHOLDER: key EN]` / `[PLACEHOLDER: key PT]` / `[PLACEHOLDER: key DE]`
- **Colors / fonts:** never deviate from `brand.css` tokens without noting it here
- **No build step:** vanilla HTML/CSS/JS only

---

## Files to be created

```
index.html
assets/
  logo.png           ← copy from design-system/assets/
  favicon.svg        ← derived from logo
  og-image.png       ← placeholder (logo on dark bg)
styles/
  brand.css          ← copy from design-system/shared/
script.js            ← i18n + shows rendering
shows.json           ← extracted from i18n.js VL_SHOWS
.github/
  workflows/
    deploy.yml       ← GitHub Pages deploy (if decided)
CNAME                ← if custom domain
```

---

## Open questions / blockers

_(fill in as they arise)_
