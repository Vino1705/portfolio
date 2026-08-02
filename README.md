# Vinothini T — Portfolio ✿

**Developer × Digital Marketer × Problem Solver.**
I turn ideas into shipped products — and audiences into customers.

A deep-red, full-bleed editorial portfolio built as a **React (Vite) front end** with a **Node.js /
Express back end**.

---

## 🚀 Run it

```bash
npm install          # once, from the repo root (installs both workspaces)
npm run dev          # React on :5173 + API on :5174
```

Then open <http://localhost:5173>. The Vite dev server proxies `/api/*` to the Node server,
so the contact form works in development too.

**Production:**

```bash
npm run build        # builds client/dist
npm start            # Node serves the API *and* the built site on :5174
```

Copy `server/.env.example` to `server/.env` and add a `WEB3FORMS_ACCESS_KEY` to make the
contact form actually deliver mail. Without it, messages are accepted and logged to the
console.

---

## 🧱 Stack

| Layer | Choice |
|---|---|
| Front end | React 19 + Vite |
| Styling | Vanilla CSS with design tokens, one stylesheet per component |
| Back end | Node.js + Express (contact relay, JSON content API, static host) |
| Fonts | Fraunces · Plus Jakarta Sans · Caveat · Space Mono |
| Icons | Inline SVG (`client/src/components/Icons.jsx`) — no icon CDN |

## 📁 Layout

```
portfolio/
├── client/      React app (components, styles, content data, public assets)
├── server/      Express API + static host
├── assets-source/  original/raw images, not shipped to the browser
└── DOCUMENTATION.md
```

Full detail — design system, section-by-section notes, TODOs — lives in
[DOCUMENTATION.md](DOCUMENTATION.md).

---

## 👋 About me

Final-year Computer Science Engineering student at **Saveetha Engineering College, Chennai**,
working in the sweet spot between creativity and code:

- 📣 **Digital Marketing** — branding, content that converts, SEO, social
- 🧑‍💻 **Full-Stack Development** — AI-powered web apps, built and shipped
- 🧩 **Problem-Solving Biz Dev** — validating ideas and turning "what if" into "let's launch"

## 💡 Featured work

- **Sahaay AI** — a gentle mental-wellness companion. OpenAI × NxtWave Buildathon finalist.
- **FinMate** — a personal-finance & budgeting assistant. ₹10K winner at the VIT symposium.
- **Enterprise360** *(in build)* — unifies scattered enterprise data into one conversational view. Top 12 nationally at Intel AI Hackathon 2025 (₹25K).
- **ContentSpark** *(in build)* — a privacy-first AI writing companion.

## 🏆 A few proud moments

- 🥇 **Top 12 · Intel AI Hackathon 2025** (national) — ₹25,000 for Enterprise360
- 💰 **Winner · VIT Symposium** — ₹10,000 for FinMate
- ⭐ **Special Mention · ASME IMECE India 2025** — Brain Bolt, The Engineers' Sprint
- 🚀 **Finalist · OpenAI × NxtWave Buildathon** — Top 10 TN regionals with Sahaay AI

## 📫 Contact

- 📧 vinoism1703@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/vinothini-t-08b4b4274/)
- 🐙 [GitHub](https://github.com/Vino1705)

---

> 🔄 Frequently updated as I keep learning and building. Thanks for visiting!
