# 📘 Vinothini T — Portfolio · Project Documentation

Internal build doc for the portfolio. Covers **what it is, the stack, the folder layout, the
design system, every section, what still needs assets, and the to-do list.**

> Public one-liner lives in `README.md`. This file is the working "brain" of the project.

*Rebuilt 2026-08-02: static HTML/CSS/JS → **React front end + Node.js back end**, full-bleed
deep-red theme.*

---

## 1. Overview

A **React single-page portfolio** for **Vinothini T** — *Developer × Digital Marketer ×
Problem Solver*. Final-year CSE @ Saveetha Engineering College, Chennai.

- **Design language:** *deep red editorial, with light patches.* The page is **wine red
  throughout** — every section is a full-bleed panel in a shade of it. The beige/blush-pink
  never takes over a whole band; it appears as **discrete light patches inside the red**:
  project cards, the About "life" cards, the notebook pages, the marquee pills, the contact
  phone block, the achievement detail card. Chocolate banner headers, film grain, big display
  serif against a heavy grotesk.
- **The patch colours:** `--wash-1 #f8efe3` (beige) → `--wash-2 #f3ddd6` → `--wash-3 #edcbc5`
  (blush pink), applied by the `.patch` class.
- **The palette is visible, not hinted:** a **blush** (`#f0cbc7`) carries buttons, headings and
  links, and a saturated **joy palette** — blush pink, gold, mint, lilac, apricot — runs across
  the About cards, fun facts, notebook page tabs, marquee dots, achievement rarities, and a thin
  **gradient rule along the top of every panel** that shows all five at once.
- **Full-bleed layout:** panels span the whole viewport width; their contents ride a centred
  1360 px rail so nothing stretches on ultrawide screens. The header is a full-width bar that
  **shrinks as you scroll**.
- **Hero:** one full-width cover banner — headline beside the caricature, with the CTAs in it.
  No separate profile block.
- **Signature sections:** skills as a **notebook whose pages actually turn**, achievements as a
  **game HUD where badges unlock as you scroll**, experience as film frames that **stack and
  overlap as you scroll**, and a contact card built around a drawn retro **telephone handset**.
- **Live (current deploy):** https://portfolio-p2yy.onrender.com/ *(still serving the old
  static build until the new one is pushed — see §8 TODO)*

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Front end | **React 19** + **Vite 6** | Function components + hooks, no router (single page) |
| Styling | **Vanilla CSS** | Design tokens in `tokens.css`; one stylesheet per component, imported by that component |
| Back end | **Node.js 20+** + **Express 4** | Contact relay, JSON content API, static host for the built client |
| Contact delivery | **Web3Forms**, server-side | The access key lives in `server/.env`, never in the browser |
| Fonts | **Google Fonts** | Fraunces (display serif), Plus Jakarta Sans (UI), Caveat (hand), Space Mono (labels/meta) |
| Icons | **Inline SVG** — `client/src/components/Icons.jsx` | Font Awesome and the Simple Icons CDN are both gone; no third-party icon requests |
| Brand logos | **Local SVGs** — `client/public/assets/logos/` | Self-hosted, used by the Skills notebook. See §4.1 for which are official and which are redraws |
| Package layout | **npm workspaces** | Root `package.json` drives `client/` and `server/` |
| Deploy target | Any Node host (Render, Railway, Fly) | `npm run build && npm start` |

**Python is no longer used anywhere.** The old `python -m http.server` dev step is replaced by
`npm run dev`, and the one-off background removal that produced `caricature.png` was a
throwaway step — the cut-out PNG is committed, so it never needs rerunning.

---

## 3. Folder layout

```
portfolio/
├── package.json               # workspace root — dev / build / start scripts
├── README.md                  # public readme
├── DOCUMENTATION.md           # ← this file
├── .gitignore
│
├── client/                    # ---------- React front end ----------
│   ├── package.json
│   ├── vite.config.js         # dev server + /api proxy → :5174
│   ├── index.html             # HTML shell (meta, SEO schema, fonts)
│   ├── public/
│   │   └── assets/            # everything the browser loads
│   │       ├── caricature.png         # hero cover art (background removed)
│   │       ├── profile.jpg            # About centre-image fallback
│   │       ├── work-*.png             # project screenshots
│   │       ├── win-*.{png,jpg}        # award photos
│   │       └── logos/*.svg            # brand logos for the Skills notebook
│   └── src/
│       ├── main.jsx           # entry — mounts <App/>, loads global CSS
│       ├── App.jsx            # page composition + page-level state
│       ├── data/site.js       # ★ ALL CONTENT lives here
│       ├── hooks/
│       │   ├── useReveal.js       # scroll-reveal observer
│       │   ├── useScrollSpy.js    # active nav section
│       │   └── useInView.js       # fire-once visibility
│       ├── styles/
│       │   ├── tokens.css         # design tokens (colour, type, shape, motion)
│       │   └── base.css           # reset, page shell, buttons, chips, headings
│       └── components/            # one .jsx + one .css per component
│           ├── Header.jsx/.css        Hero.jsx/.css       Marquee.jsx/.css
│           ├── About.jsx/.css         Skills.jsx/.css     Work.jsx/.css
│           ├── Experience.jsx/.css    Wins.jsx/.css       Contact.jsx/.css
│           ├── Footer.jsx/.css        SearchOverlay.jsx/.css
│           ├── ProjectModal.jsx/.css  BackToTop.jsx/.css
│           ├── Icons.jsx              # inline SVG icon set
│           ├── TornEdge.jsx           # shared ripped-paper divider
│           ├── PhoneArt.jsx           # drawn handset for the contact card
│           ├── Counter.jsx            # count-up number
│           └── RichText.jsx           # renders **bold** from the content data
│
├── server/                    # ---------- Node/Express back end ----------
│   ├── package.json
│   ├── .env.example           # copy → .env
│   └── src/
│       ├── index.js           # app setup, static hosting, SPA fallback
│       ├── routes/
│       │   ├── contact.js     # POST /api/contact — validate, rate-limit, relay
│       │   └── content.js     # GET  /api/content/* — JSON content
│       └── data/content.js    # trimmed copy of the site content for the API
│
└── assets-source/             # raw originals — NOT served to the browser
    ├── caricature-original.png, caricature-raw.png
    ├── profile-alt.jpeg, misc-image.png
```

**No cache-busting query strings any more.** Vite fingerprints every asset filename at build
time, so the old manual `?v=NN` bumping is gone for good.

---

## 4. Design system

Everything is driven by tokens in `client/src/styles/tokens.css` — change a value there and it
propagates across the site.

| Token group | Values |
|---|---|
| Wine scale | `--wine-950 #1e050b` → `--wine-400 #b23c52` — the page background and the dark panels |
| Chocolate | `--choco-900 #2b1310` → `--choco-700 #4f241c` — banner headers (the About block) |
| **Wash** | `--wash-1 #f8efe3` → `--wash-2 #f3ddd6` → `--wash-3 #edcbc5` — the **light patches**: beige into blush pink |
| Beige / paper | `--beige-50 #f5ecdb` → `--beige-500 #ae956a` — notebook stock |
| Ink & cream | `--cream #f7f0e3` (text on wine, the default), `--ink #3a1219` (text on light) |
| **Blush** | `--blush #f0cbc7`, `--blush-deep`, `--blush-tint` — the second lead colour; `--accent` resolves to it on dark surfaces and to `--rose-deep` on light ones |
| Joy palette | `--joy-1` blush pink · `--joy-2` gold · `--joy-3` mint · `--joy-4` lilac · `--joy-5` apricot — About cards, fun facts, notebook tabs, marquee dots, achievement rarities, panel top rule |
| Surface fills | `--card-a` / `--card-b` (card gradients), `--field-bg` (form inputs), `--danger` (errors) — these flip with the surface, so a card or input looks right on wine *and* inside a light patch |
| Accents | `--sand`, `--gold` / `--gold-deep`, `--rose` / `--rose-soft` / `--rose-deep` |
| Type | `--font-serif` Fraunces · `--font-sans` Plus Jakarta Sans · `--font-hand` Caveat · `--font-mono` Space Mono |
| Shape | `--r-xs 8px` → `--r-xl 36px`, `--r-pill` |
| Layout | `--maxw 1360px`, `--rail` = the padding that centres panel contents while the background bleeds full width |
| Motion | `--ease`, `--dur .45s` — all honoured by a `prefers-reduced-motion` block in `base.css` |

### The panel system

Every section is a **full-bleed panel**. The trick is `--rail`:

```css
.panel {
  width: 100%;
  padding-inline: var(--rail); /* max(gutter, (100% - maxw) / 2) */
}
```

The background runs edge to edge; the content stays centred and readable. No wrapper markup
needed, and `.rail` applies the same padding to a child inside a `.panel--flush`.

Variants:

- `.panel--wine` — mid wine (Work, Experience)
- `.panel--deep` — near-black wine (About, Skills, Wins, Contact)
- `.panel--paper` — cream stock (available; the Skills notebook is paper *inside* a red panel)
- `.panel--flush` — zero padding, for panels whose header band bleeds to the edge (About)

Every panel also gets a 3px **gradient rule** across its top (`.panel::before`) running through
all five joy colours — the one place the whole palette is visible at once.

### `.patch` — the light colours

Every section stays red. The beige/blush appears as **patches inside them**, via one class:

```css
.patch { background: linear-gradient(166deg, var(--wash-1), var(--wash-2), var(--wash-3)); }
```

`.patch` is also listed with `.on-paper` in the token flip, so **anything nested inside a patch
automatically switches to dark ink** — no per-component overrides. Currently applied to:

| Patch | Sits on |
|---|---|
| Project cards | Work (wine panel) |
| The three "life" cards | About (deep panel) |
| Marquee pills | the red tools band |
| Notebook pages | Skills (red cover, deep panel) |
| Contact phone block (`.cc-visual`, pinker) | Contact (deep panel) |
| Achievement detail card | Wins (deep panel) |

To add another, put `patch` on the element and delete its background rule — `.patch` supplies
the fill, the border and the text colours.

### 4.1 Brand logos

Self-hosted in `client/public/assets/logos/`. A skill in `site.js` points at one with
`logo: '<filename>'`; skills with no brand mark use `glyph: '<name>'` instead and get a drawn
icon from `skillGlyph` in `Icons.jsx`.

| Status | Files |
|---|---|
| **Official marks** (Simple Icons, restored from git history) | `react`, `nodedotjs`, `typescript`, `nextdotjs`, `firebase` |
| **Redrawn** — correct brand colours, simplified shapes | `javascript`, `html5`, `css`, `tailwindcss`, `express`, `mongodb`, `supabase`, `openai` |

The redraws are recognisable but they are **not** the official vector artwork. To swap in the
real thing, download the SVG from [simpleicons.org](https://simpleicons.org) and overwrite the
file — the filename is the only contract, nothing in the code changes.

**Colour switching.** `.on-dark` and `.on-paper` re-declare `--text`, `--text-dim`, `--line`,
`--surface`, `--accent`… so everything nested inside adopts the right scheme automatically.
Dark is the page default; `.on-paper` is what the notebook and the contact card's blush panel
use. Because components style themselves with tokens rather than literal colours, moving a
section between a paper and a wine panel needs no CSS changes.

Other shared primitives in `base.css`: `.container`, `.section`, `.eyebrow`, `.section-title`,
`.hand`, `.btn` (`.btn-primary` / `.btn-ghost`), `.chip`, `.torn-edge`, `[data-reveal]`.

---

## 5. Section by section

Scroll order. Header entries map 1:1 to section IDs.

| # | Section | ID | What's in it |
|---|---|---|---|
| 0 | **Header** | — | **Full-width** maroon bar: outlined home button, `vino.made` wordmark, nav items rendered as a **bold label with a small caption underneath**, and a **search** button on the right. **Shrinks on scroll** — the bar drops from `--nav-h` to `--nav-h-sm` and the captions collapse away. Scrollspy highlights the current section; collapses to a full-screen sheet under 880px. |
| 1 | **Hero** | `#home` | Full-bleed cover banner and the only intro block. A **two-column grid** — headline, lead and the **"See my work" / "My résumé" CTAs** in one column, caricature in the other, so type can never collide with art. The art is capped by `max-height` so it cannot inflate the row and push the copy down. Running strip and a **torn paper edge** hand off to the section below. **No floating tech logos**, no separate profile card. |
| — | Tools marquee | — | Full-width **red band carrying light beige/blush pills** (dots cycling through the joy palette), edge-faded, pauses on hover. Decorative, not a nav target. |
| 2 | **About** | `#about` | Its own deep panel, opened by a **chocolate banner** carrying "MY *Niche* & SPECIALTIES" and torn away into the body. Then: the specialty pills around a centred portrait, a short personal story, **three colourful "life" cards** (freelancing · hackathons · tuition teaching) each in its own joy colour, and a 2 × 2 row of fun facts. **No stat counters here** — the numbers live only in Wins so they are not repeated. |
| 3 | **Skills** | `#skills` | **A working notebook**, open on a red panel. A wine-leather cover holds four cream pages with red rules and a blush spiral spine — two visible at a time. **One leaf actually turns**: it is hinged at the spine and rotates 180° on `rotateY` with `preserve-3d` + `backface-visibility`, so its front face is page 2 and its back face is page 3. It turns itself every 7s, pauses on hover, and can be driven by the arrows or the dots. Each skill is a chip with its **real brand logo** — name only, **no self-rated percentages**. Every page carries a colour from the joy palette (a tab down its outer edge, the header rule, the handwritten note, and the tint behind each chip and logo tile), so the notebook is not one flat cream block. Below 880px the book unbinds into a plain stack (`order` keeps the pages in reading order). |
| 4 | **Work** | `#work` | Wine panel with the project cards as **light patches** on it. Cards → case-study modal (problem → what I built → result → stack). **No category filters** — every project is shown. |
| 5 | **Experience** | `#experience` | **35mm film roll.** Black film base, punched sprocket holes down both edges (SVG tile), edge markings top and bottom, one frame per role with a frame number and a pink handwritten margin note. Each frame is `position: sticky`, so **frames stack and overlap as you scroll** — the roll piles itself up. Frame 03 is deliberately **unexposed** — the "hire me" slot. |
| 6 | **Wins** | `#wins` | **An achievements HUD — the section is played, not read.** Left: a **player card** with the caricature, a class line, a `LVL` badge and an **XP bar** that fills as achievements land, plus the stat tiles (**the only place the numbers appear**) and four always-on "side quests". Right: a **badge board**. Badges start locked — greyscaled, padlocked, titled `???` — and **unlock one at a time when the section scrolls into view**, each with a pop, a shine sweep across the tile, a toast (*"Achievement unlocked — +2500 XP"*) and a bump to the XP bar and level. Tapping a locked badge unlocks it early; tapping an unlocked one opens the **detail card** (photo, date, rarity tier, story, XP). A **Replay** button re-runs the whole sequence. Each win carries an `xp` value and a `rarity` colour from the joy palette. |
| 7 | **Contact** | `#contact` | A card split in two: a **pink patch** block holding a **drawn retro telephone handset** (`PhoneArt.jsx` — inline SVG with a coiled cord, so it scales and picks up the theme colours) plus the direct details and socials, and a form that **POSTs to the Node API** with inline per-field errors and status states. |

Then the **footer**: one big call to action (headline + the email as a button + socials) over a
thin credit bar. The old "Sections" link list and "Say hi" column are gone.

Plus: **search overlay** (nav magnifier or `⌘K` / `Ctrl+K` — searches sections, projects, skills
and wins, arrow keys + Enter to jump), project modal, back-to-top, scroll progress bar, film
grain.

---

## 6. Back end

Base URL in dev: `http://localhost:5174` (the Vite dev server proxies `/api` there).

| Method | Route | Does |
|---|---|---|
| `GET` | `/api/health` | Liveness + uptime |
| `GET` | `/api/content` | Profile summary + counts |
| `GET` | `/api/content/profile` · `/projects` · `/experience` · `/wins` | Content as JSON |
| `POST` | `/api/contact` | Validates, honeypot-checks, rate-limits (5 / IP / 10 min), relays to Web3Forms |

In production `server/src/index.js` also serves `client/dist` with a SPA fallback, so one Node
process hosts the whole thing.

**Env** (`server/.env`, copied from `.env.example`): `PORT`, `WEB3FORMS_ACCESS_KEY`,
`ALLOWED_ORIGINS`. Without an access key the API still returns `200` and logs the message —
handy for local testing.

> Content note: `client/src/data/site.js` and `server/src/data/content.js` both hold content.
> The client copy is what renders; the server copy is what the JSON API returns. Edit both when
> content changes, or drop the API copy if you never consume it.

---

## 7. Assets still needed

Drop these into `client/public/assets/` (exact names) and they light up instantly.

| File | For | Status |
|---|---|---|
| `about-centre.png` | **The centre image in the About "Niche & Specialties" block** — cut-out portrait, transparent PNG works best | ⏳ you said you'd send it; falls back to `profile.jpg` until then |
| `resume-developer.pdf` | Hero "My résumé" button (goes in `client/public/`) | ⏳ save it |
| FreshFrame project screenshots + live links | Work section | ⏳ send when ready |
| `og-image.png` | Link previews (currently points at the caricature) | ⏳ optional |

---

## 8. ✅ TODO

**High priority**
- [ ] **Deploy the rebuild** — the live URL still serves the old static site. See §9 below; the old service is almost certainly a **Static Site**, which cannot run this. It needs replacing with a **Web Service**.
- [ ] Set `WEB3FORMS_ACCESS_KEY` in the host's environment variables so the contact form delivers.
- [ ] Save `about-centre.png` and `resume-developer.pdf` (see §7).
- [ ] Real project links + FreshFrame case studies in the Work section.

**Polish**
- [ ] Convert `caricature.png` (~900 KB) and the screenshots to **WebP**.
- [ ] Proper `og:image` for LinkedIn/WhatsApp previews.
- [ ] Add analytics (Plausible / GA).
- [ ] Consider a custom domain (e.g. `vinothini.dev`).

**Done in this rebuild**
- [x] Migrated the whole front end to **React** (Vite) — components, hooks, per-component CSS.
- [x] Added a real **Node.js/Express** back end — contact relay + JSON content API + static host.
- [x] Dropped **Python** entirely (dev server is now `npm run dev`).
- [x] **Deep red theme, full-bleed**: wine page end to end, panels span the viewport on a centred rail, beige reduced to the Skills notebook and torn edges.
- [x] Added **blush `#eac7c3`** as the second lead colour, plus a joy palette for the About cards.
- [x] Header is **full width and shrinks on scroll**; cut the dead space under it in the hero.
- [x] Folded the profile block back into the hero — the CTAs live in the banner now.
- [x] **About** rewritten: freelancing, hackathons and tuition teaching as three colourful cards; stat counters removed so the numbers only appear in Wins.
- [x] **Skills** rebuilt as a real notebook — red cover, cream pages, blush spine, one leaf that turns (auto every 7s, pauses on hover, arrows + dots). Red and blush now carry the section instead of it sitting apart as a cream block.
- [x] Enlarged the hero caricature to fill the space beside the headline.
- [x] **Wins turned into an interactive achievements game** — player card, XP bar, level, locked/unlocked badges with rarity tiers, unlock toasts, detail card and a replay button.
- [x] Bigger skill chips (larger logos, roomier pills) so the notebook pages are not half empty.
- [x] **Dropped the skill percentages** — no numbers, no proficiency bars, just the tool and its logo.
- [x] Colour-coded the notebook pages and cycled the marquee dots through the joy palette.
- [x] **Light colours as patches, not sections** — the page stays red-dominant; beige/blush appears via a `.patch` class on individual cards and blocks (project cards, About life cards, marquee pills, notebook pages, phone block, achievement detail).
- [x] Saturated the joy palette so the colours actually read, and added a **five-colour gradient rule to the top of every panel**.
- [x] Added `--card-a` / `--card-b` / `--field-bg` tokens so cards and form fields flip correctly between the dark and light halves.
- [x] Pushed **blush** further through the page: kicker, badge, eyebrows, nav wordmark + active state, marquee dots, project tags, win chips.
- [x] Fun facts aligned **2 × 2** instead of 3 + 1.
- [x] Removed the **Work category filters**.
- [x] **Experience** frames now **stack and overlap on scroll** (`position: sticky`).
- [x] **Footer** rebuilt as a single CTA — no section list, no "Say hi" column.
- [x] Fixed the hero headline overflowing into the torn edge — the cover is now a two-column grid.
- [x] Gave **About** its own panel with a chocolate banner header.
- [x] Rebuilt **Contact** around a drawn telephone handset.
- [x] Removed the floating tech logos beside the caricature.
- [x] Rebuilt the **header** as a pill bar with label + caption nav and search.
- [x] Rebuilt the **hero** as a profile banner with a torn edge and overlapping avatar.
- [x] Rebuilt **About** as "Niche & Specialties" with a centred image slot.
- [x] Rebuilt **Experience** as a 35mm film roll.
- [x] Deleted the `ic-*.svg` brand logos, the unused Three.js experiments (`three-bg.js`, `three-diorama.js`, `icons3d.js`) and the old `index.html` / `styles.css` / `script.js`.
- [x] Reorganised the folder into `client/`, `server/`, `assets-source/`.
- [x] Removed the Font Awesome and Simple Icons CDN dependencies (inline SVG instead).

---

## 9. Run it locally

```bash
npm install     # from the repo root — installs client + server
npm run dev     # React :5173  ·  API :5174
```

Other scripts:

| Command | Does |
|---|---|
| `npm run dev` | Both dev servers with hot reload |
| `npm run dev:client` / `npm run dev:server` | One at a time |
| `npm run build` | Builds `client/dist` |
| `npm start` | Node serves the API **and** the built site on `:5174` |
| `npm run preview` | `build` then `start` — production check |

---

## 10. Deploying

The site is **one Node process** that serves the JSON API *and* the built React app. That means
it must run as a **Web Service**, not a Static Site.

### Why the old deploy stopped updating

The original service was a **Static Site** pointed at the repo root, where `index.html`,
`styles.css` and `script.js` used to live. The rebuild deleted those, so there is nothing at the
root for a static host to serve — it keeps showing the last successful build. A Static Site also
has **no Start Command field at all**, which is why there is nowhere to put `npm start`.

A Static Site cannot be converted into a Web Service. Create a new Web Service and point the
custom domain (or update the shared link) at it.

### Settings

| Setting | Value |
|---|---|
| Service type | **Web Service** |
| Runtime | Node |
| Branch | `master` |
| Build command | `npm install --include=dev && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| Env: `NODE_VERSION` | `20` |
| Env: `NODE_ENV` | `production` |
| Env: `WEB3FORMS_ACCESS_KEY` | your key (never committed) |

`render.yaml` at the repo root encodes all of the above — Render → **New → Blueprint** →
pick the repo and it configures itself. You still add the access key by hand.

### Two things that will bite you

1. **`--include=dev` is not optional.** Hosts set `NODE_ENV=production`, and npm then skips
   `devDependencies` — where Vite lives. A plain `npm install && npm run build` fails with
   `vite: not found`.
2. **Bind to `0.0.0.0`.** `server/src/index.js` does this explicitly; hosts cannot route to a
   process listening only on localhost. It also reads `process.env.PORT`, which the host sets.

### Checking a deploy worked

- `GET /api/health` → `{"ok":true,...}` means the Node process is up.
- The nav should read **About · Skills · Work · Experience · Wins**. If it still says
  *Build / Grow / Say hi*, you are looking at the old static build.

---

## 11. Contact

- 📧 vinoism1703@gmail.com
- 🐙 https://github.com/Vino1705
- 💼 https://www.linkedin.com/in/vinothini-t-08b4b4274/

*Last updated: 2026-08-02.*
