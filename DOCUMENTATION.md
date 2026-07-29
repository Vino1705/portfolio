# 📘 Vinothini T — Portfolio · Project Documentation

Internal build doc for the portfolio site. Covers **what it is, the tech stack, the file
structure, everything we've built, assets still needed, and the to-do list.**

> Public one-liner lives in `README.md`. This file is the working "brain" of the project.

---

## 1. Overview

A warm, personable **single-page portfolio** (plus two sub-pages) for **Vinothini T** —
*Developer × Digital Marketer × Problem Solver*. Final-year CSE @ Saveetha Engineering
College, Chennai.

- **Design language:** "cozy warm editorial" — cream/peach background, warm ink text,
  coral accent, marker-yellow highlights, playful serif + handwritten fonts.
- **Hero centrepiece:** an AI-generated **caricature** of Vino (background auto-removed),
  with **interactive floating logo badges** beside it.
- **Live (current deploy):** https://portfolio-p2yy.onrender.com/  *(serves the OLD version —
  see "What we need to do › Deploy")*

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Markup | **HTML5** | Hand-written, semantic |
| Styling | **CSS3** (vanilla) | Custom properties (design tokens), fl+grid, `@media`, `:has()` |
| Scripting | **Vanilla JavaScript** | No framework. IIFE-scoped modules in `script.js` / `pages.js` |
| Fonts | **Google Fonts** | Fraunces (serif), Plus Jakarta Sans (sans), Caveat (hand), Space Mono |
| Icons | **Font Awesome 6.4** (CDN) + **Simple Icons** (brand logos) | Brand logos also saved locally as `ic-*.svg` |
| Logo marquee | Simple Icons CDN | `cdn.simpleicons.org/<slug>` |
| Contact | **mailto:** | Opens the visitor's mail app *(to be upgraded — see TODO)* |
| Background removal | **rembg** (Python, one-off) | Cut the caricature → `caricature-cut.png` |
| Local dev server | **Python** `http.server` | `python -m http.server 5500` |
| Deploy target | Static host (**Render** / **GitHub Pages**) | No build step required |

**No build tooling / no npm** — it's a dependency-free static site. (An earlier
**React + React-Three-Fiber** experiment and a **Three.js** hero were tried and removed;
see "Removed / unused".)

---

## 3. File structure

```
portfolio/
├── index.html            # Home (hero, experience, work, wins, contact…)
├── build.html            # "Build" sub-page — skills dashboard (rings)
├── grow.html             # "Grow" sub-page — biz-dev / SEO / marketing
├── styles.css            # All home-page styles (design tokens live here)
├── script.js             # Home interactions
├── pages.css             # Sub-page styles + skills dashboard
├── pages.js              # Sub-page interactions (reveal, counters, tilt…)
├── README.md             # Public repo readme
├── DOCUMENTATION.md      # ← this file
│
├── caricature.png        # Original AI caricature (with background)
├── caricature-cut.png    # ★ Used in hero — background removed (rembg)
├── caricature-orig.png   # Backup of the original
├── PROFILE.jpg           # Real photo (About / fallback)
├── profile.jpeg          # Alt real photo
├── ic-*.svg              # Local brand logos (react, node, ts, next, python, firebase)
│
├── Screenshot 2025-11-11 *.png   # Project / win images
├── void.jpg, ujjain.jpg, nxtwave 3.jpg   # Win photos
│
└── (assets still to add — see §6)
```

**Cache-busting:** CSS/JS are linked with `?v=NN` query strings — bump the number when you
edit them so browsers reload (currently `styles.css?v=21`, `script.js?v=14`).

---

## 4. What we built — section by section

### Home (`index.html`)
1. **Top flip-word ticker** — "I **build / market / ship** things people love." (3D flip loop).
2. **Nav** — full-width, frosted, active-underline hover. Links: Home · Build · Grow · About ·
   Experience · Work · Wins · Say hi.
3. **Hero** — caricature cutout (bg removed) on a warm background, **6 interactive floating
   logo badges** beside it (React, Node, TypeScript, Next.js, Python, Firebase) that **tilt in
   3D on hover + show a label**. Cute right-side scroller with rotating phrases.
4. **Logo marquee** — official brand logos, seamless scroll, edge fade, pause-on-hover.
5. **Two-sides gateway** — Build × Grow → link to sub-pages.
6. **About** — photo, bio, fun facts, animated stat counters.
7. **Experience** — two cards:
   - **HealthPilot.ai** — Tester & Business Development Executive · 2026 – Present · links to healthpilot.ai
   - **FreshFrame** — Co-founder & Developer (freelance with brother) · Websites · Branding · Digital Solutions + "Let's build something" CTA
8. **Work** — project cards (2 marked "under construction").
9. **Wins** — **stats band** (counts up) + **interactive showcase** (click a name → stage
   updates with photo/details, auto-advances, progress bar).
10. **Contact** — mailto form + details/socials.
11. Footer, project modal, toast, back-to-top.

### Build sub-page (`build.html`)
- Lean, skills-first. **Logo dashboard** = proficiency **rings** with brand logos, grouped
  (Frontend / Backend & Data / AI & Prompt Engineering / Testing & QA / Tools). Compact
  "selected builds" strip. **Developer résumé** button.

### Grow sub-page (`grow.html`)
- Business development, SEO & digital marketing (with "learning" pills), learning roadmap,
  "pitches that won" proof. **Marketing résumé** button.

### Interactions (`script.js` / `pages.js`)
Preloader · custom cursor · scroll progress · scrollspy · reveal-on-scroll · counters ·
skill-bar/ring fills · project & résumé modals · **mailto** contact · logo-marquee dup ·
**Wins showcase** · **floating-badge 3D tilt** · caricature parallax · side-scroller phrases.

---

## 5. Removed / unused (safe to delete later)

- `three-bg.js`, `three-diorama.js`, `icons3d.js` — earlier 3D hero experiments, no longer
  referenced by any page.
- The **React + R3F** "universe" build was fully reverted (not in the tree).
- `image.png` — unused stray.

---

## 6. Assets still needed (save into the repo folder)

> Chat-pasted images can't be saved automatically — drop these files in the folder with the
> exact names and they light up instantly.

| File | For | Status |
|---|---|---|
| `healthpilot-logo.png` | HealthPilot card logo | ⏳ save it |
| `freshframe-logo.png` | FreshFrame card logo | ⏳ save it |
| `resume-developer.pdf` | Build page + Home résumé button | ⏳ save it |
| `resume-marketing.pdf` | Grow page résumé button | ⏳ save it |
| FreshFrame project screenshots + live links | Work section | ⏳ send when ready |
| FreshFrame website URL | "Visit our studio" button | ⏳ send when ready |

---

## 7. ✅ What we need to do (TODO)

**High priority**
- [ ] **Deploy** — commit + push. The live site still shows an old version; none of this
      session's work is pushed.
- [ ] **Real project links + screenshots** in the Work section (Home) and Build page.
- [x] **Reliable contact** — ✅ Done. Wired to **Web3Forms** (key `a5a582b3-…`); submissions
      deliver straight to vinoism1703@gmail.com (verified working).
- [ ] Save the 2 **logos** + 2 **résumé PDFs** (see §6).

**Polish**
- [ ] Optimize `caricature-cut.png` (~900 KB) → **WebP** (~150 KB).
- [ ] Add an **Open Graph image** (`og:image`) for nice link previews on LinkedIn/WhatsApp.
- [ ] Mobile pass on the hero (caricature + badges currently hidden < 860px).
- [ ] Add **FreshFrame website link** + client case studies when ready.
- [ ] Add basic **analytics** (Plausible / GA).

**Housekeeping**
- [ ] Delete unused files (`three-bg.js`, `three-diorama.js`, `icons3d.js`, `image.png`).
- [ ] Optionally self-host the marquee/badge logos so nothing depends on the Simple Icons CDN.
- [ ] Consider a **custom domain** (e.g. `vinothini.dev`).

---

## 8. Run it locally

```bash
cd "path/to/portfolio"
python -m http.server 5500
# open http://localhost:5500
```

> Use a **server** (not double-click) — the caricature background step + logo textures need
> `http://`. Hard-refresh (Ctrl+Shift+R) after edits to skip cached CSS/JS.

---

## 9. Contact

- 📧 vinoism1703@gmail.com
- 🐙 https://github.com/Vino1705
- 💼 https://www.linkedin.com/in/vinothini-t-08b4b4274/

*Last updated: 2026-07-29.*
