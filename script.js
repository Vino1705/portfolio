/* =========================================================
   vino.made — interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (pre) setTimeout(() => pre.classList.add("done"), 500);
  });

  /* ---------- Custom cursor (desktop pointer only) ---------- */
  const dot = $(".cursor-dot");
  if (dot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let x = 0, y = 0, raf = false;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) { raf = true; requestAnimationFrame(() => { dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; raf = false; }); }
    });
    const hoverTargets = "a, button, .work-card, .threat-card, .chip, input, textarea";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(hoverTargets)) dot.classList.add("hover"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(hoverTargets)) dot.classList.remove("hover"); });
  }

  /* ---------- Scroll progress + nav state + top button ---------- */
  const progress = $(".scroll-progress");
  const navbar = $("#navbar");
  const topBtn = $("#topBtn");
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + "%";
    if (navbar) navbar.classList.toggle("scrolled", h.scrollTop > 20);
    if (topBtn) topBtn.classList.toggle("show", h.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu ---------- */
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  function closeMenu() { menuToggle.classList.remove("open"); navLinks.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-link", navLinks).forEach((l) => l.addEventListener("click", closeMenu));
  }

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  const sections = $$("main section[id]");
  const navMap = {};
  $$(".nav-link").forEach((l) => { navMap[l.getAttribute("href")] = l; });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        $$(".nav-link").forEach((l) => l.classList.remove("active"));
        const link = navMap["#" + en.target.id];
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealer.observe(el));

  /* ---------- Counters ---------- */
  const counters = $$(".counter");
  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || "";
      const dur = 1400; const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterObs.observe(c));

  /* ---------- Hero rotator ---------- */
  const rotator = $("#rotator");
  if (rotator) {
    const words = ["building Sahaay-AI ✿", "heading to Nationals 🚀", "open to internships 💼", "marketing the next big thing 📣", "solving a tricky problem 🧩"];
    let i = 0, ci = 0, deleting = false;
    function type() {
      const full = words[i];
      rotator.textContent = full.slice(0, ci);
      if (!deleting && ci < full.length) { ci++; setTimeout(type, 70); }
      else if (!deleting && ci === full.length) { deleting = true; setTimeout(type, 1600); }
      else if (deleting && ci > 0) { ci--; setTimeout(type, 35); }
      else { deleting = false; i = (i + 1) % words.length; setTimeout(type, 250); }
    }
    type();
  }

  /* ---------- Hero polaroid parallax tilt ---------- */
  const polaroid = $("#heroPolaroid");
  if (polaroid && window.matchMedia("(hover: hover)").matches) {
    const wrap = polaroid.parentElement;
    wrap.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      polaroid.style.transform = `rotate(${-3 + dx * 6}deg) translate(${dx * 10}px, ${dy * 10}px)`;
    });
    wrap.addEventListener("mouseleave", () => { polaroid.style.transform = ""; });
  }

  /* ---------- Work filter ---------- */
  const chips = $$(".chip");
  const cards = $$(".work-card");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.category === f;
      card.classList.toggle("hide", !show);
    });
  }));

  /* ---------- Project modal ---------- */
  const projects = {
    sahaay: {
      eyebrow: "AI · Wellness",
      title: "Sahaay AI",
      body: "A gentle mental-wellness companion built to make emotional check-ins feel safe and easy. It offers daily reflection prompts, mood analytics over time, and an anonymous space to just be heard — no judgement, no accounts required to feel supported.<br><br>I led the product thinking and the front-end build, and shaped the warm, calming brand voice. It reached the Top 10 in the Tamil Nadu regionals of the OpenAI Academy × NxtWave Buildathon 2025 and is heading to the National round.",
      tags: ["React", "OpenAI API", "Firebase", "UX Writing"],
      meta: [["Top 10", "TN regionals"], ["Nationals", "qualified"]],
      link: "https://github.com/Ganesh-0509/Sahaay-Ai"
    },
    finmate: {
      eyebrow: "FinTech",
      title: "FinMate",
      body: "A friendly personal-finance &amp; budgeting assistant that turns raw spending data into plain-English insights and nudges. The goal: make money management feel less like a spreadsheet and more like a supportive friend.<br><br>FinMate won ₹10,000 at the VIT Technical Symposium, where judges called out its practical, problem-first approach.",
      tags: ["Web", "Budgeting", "Data Viz", "Product"],
      meta: [["₹10K", "prize won"], ["VIT", "symposium"]],
      link: "https://github.com/Vino1705/Kart-i-quo"
    },
    enterprise360: {
      eyebrow: "AI · Enterprise",
      title: "Enterprise360",
      body: "An AI assistant that pulls scattered enterprise data into one conversational view, so teams can ask a question in plain language instead of hunting across dashboards.<br><br>Enterprise360 placed in the Top 12 nationally at the Intel AI Hackathon 2025 and earned a ₹25,000 cash prize — my proudest build-under-pressure moment so far.",
      tags: ["AI", "LLM", "Dashboards", "Teamwork"],
      meta: [["Top 12", "national"], ["₹25K", "prize won"]],
      link: "https://github.com/Vino1705"
    },
    contentspark: {
      eyebrow: "AI · Marketing",
      title: "ContentSpark",
      body: "A privacy-first AI writing companion for idea generation, rewriting, and summarizing — basically a marketer's pocket co-pilot. Built around the principle that your drafts are yours, with privacy-conscious handling at its core.<br><br>This is where my marketing brain and my coding brain shake hands: a tool I genuinely wanted, so I built it.",
      tags: ["AI", "Content", "Privacy", "Marketing"],
      meta: [["Privacy", "first"], ["Solo", "build"]],
      link: "https://github.com/Vino1705"
    }
  };

  const modal = $("#projectModal");
  const modalBody = $("#modalBody");
  function openProject(key, wip) {
    const p = projects[key];
    if (!p) return;
    if (wip) {
      modalBody.innerHTML = `
        <span class="modal-eyebrow">${p.eyebrow}</span>
        <h3>${p.title}</h3>
        <div class="wip-hero">🚧</div>
        <p><strong>Currently under construction.</strong> ${p.body}</p>
        <p>I'm polishing this one up right now — check back soon, or <a href="#contact" class="wip-link">ping me</a> if you'd like an early peek. ✿</p>
        <div class="modal-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      `;
      openModal(modal);
      const ping = modalBody.querySelector(".wip-link");
      if (ping) ping.addEventListener("click", () => { closeModal(modal); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); });
      return;
    }
    modalBody.innerHTML = `
      <span class="modal-eyebrow">${p.eyebrow}</span>
      <h3>${p.title}</h3>
      <div class="modal-meta">${p.meta.map((m) => `<div><b>${m[0]}</b>${m[1]}</div>`).join("")}</div>
      <p>${p.body}</p>
      <div class="modal-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <a href="${p.link}" target="_blank" rel="noopener" class="btn btn-primary"><i class="fab fa-github"></i> View on GitHub</a>
    `;
    openModal(modal);
  }
  $$(".work-card").forEach((card) => card.addEventListener("click", () => openProject(card.dataset.project, card.classList.contains("wip"))));


  /* ---------- Modal helpers ---------- */
  function openModal(m) { m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeModal(m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $$(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-close")) closeModal(m); });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal.open").forEach(closeModal); });

  /* ---------- Contact form (Web3Forms → straight to inbox, no app) ---------- */
  const form = $("#contactForm");
  const toast = $("#toast");
  function showToast(msg, ms = 4000) {
    if (!toast) return;
    toast.querySelector("span").textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), ms);
  }
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; }
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && out.success) {
          form.reset();
          showToast("Message sent — it's in my inbox! I'll reply soon ✿");
        } else {
          showToast(out.message || "Couldn't send — email vinoism1703@gmail.com", 5000);
        }
      } catch {
        showToast("Network hiccup — please email vinoism1703@gmail.com", 5000);
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }
    });
  }

  /* ---------- 3D tilt + glare on cards ---------- */
  (function tilt() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    $$(".work-card, .win-card").forEach((card) => {
      card.classList.add("tilt3d");
      const glare = document.createElement("span");
      glare.className = "tilt-glare";
      card.appendChild(glare);
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(800px) rotateX(${(py - .5) * -8}deg) rotateY(${(px - .5) * 10}deg) translateY(-6px)`;
        glare.style.setProperty("--gx", px * 100 + "%");
        glare.style.setProperty("--gy", py * 100 + "%");
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  })();


  /* ---------- Achievements: interactive showcase ---------- */
  (function showcase() {
    const wrap = $("#showcase");
    if (!wrap) return;
    const items = $$(".sc-item", wrap);
    const img = $("#scImg"), medal = $("#scMedal"), date = $("#scDate"),
      chip = $("#scChip"), title = $("#scTitle"), desc = $("#scDesc"), info = $("#scInfo");
    let idx = 0, timer = null;
    function show(i) {
      idx = i;
      items.forEach((it, k) => it.classList.toggle("active", k === i));
      const d = items[i].dataset;
      img.style.opacity = "0";
      setTimeout(() => { img.src = d.img; img.alt = d.title; img.style.opacity = "1"; }, 180);
      medal.textContent = d.medal; date.textContent = d.date; chip.textContent = d.chip;
      title.textContent = d.title; desc.textContent = d.desc;
      info.classList.remove("sc-anim"); void info.offsetWidth; info.classList.add("sc-anim");
    }
    function next() { show((idx + 1) % items.length); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
    items.forEach((it, i) => it.addEventListener("click", () => { show(i); restart(); }));
    wrap.addEventListener("mouseenter", () => clearInterval(timer));
    wrap.addEventListener("mouseleave", restart);
    restart();
  })();

  /* ---------- Logo marquee: duplicate for a seamless loop ---------- */
  (function () {
    const track = $("#lmTrack");
    if (track) track.innerHTML += track.innerHTML;
  })();

  /* ---------- Smooth-scroll for in-page anchors ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
      }
    });
  });

  /* ---------- Cute right-side scroller (rotating phrases) ---------- */
  (function sideScroll() {
    const el = $("#ssText");
    if (!el) return;
    const phrases = [
      "stop staring at me — go see my work 👀",
      "psst… the good stuff is below 👇",
      "enough cuteness — check my skills ✨",
      "scroll down, don't be shy 🌿",
      "my projects are cuter, promise 💌",
    ];
    let i = 0;
    setInterval(() => {
      el.style.opacity = "0";
      setTimeout(() => { i = (i + 1) % phrases.length; el.textContent = phrases[i]; el.style.opacity = "1"; }, 400);
    }, 3800);
    // hide the whole scroller once the user has scrolled past the hero
    const scroller = $("#sideScroll");
    window.addEventListener("scroll", () => {
      if (!scroller) return;
      const past = window.scrollY > window.innerHeight * 0.6;
      scroller.style.opacity = past ? "0" : "1";
      scroller.style.pointerEvents = past ? "none" : "auto";
    }, { passive: true });
  })();

  /* ---------- Floating logo badges: 3D tilt on hover ---------- */
  (function skillBadges() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    $$(".orb-ic").forEach((o) => {
      const face = o.querySelector(".orb-face");
      if (!face) return;
      o.addEventListener("pointermove", (e) => {
        const r = o.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        face.style.transform = `rotateY(${px * 34}deg) rotateX(${-py * 34}deg) scale(1.14)`;
      });
      o.addEventListener("pointerleave", () => { face.style.transform = ""; });
    });
  })();

  /* ---------- Caricature: auto background-removal + 3D parallax ---------- */
  (function toon() {
    const fig = $("#dioToon"); if (!fig) return;
    const img = fig.querySelector("img"); if (!img) return;
    let cut = false;
    function autoCutout() {
      if (cut) return;
      if (img.src.indexOf("PROFILE.jpg") !== -1) return; // fallback photo — leave it
      if (!img.naturalWidth) return;
      cut = true;
      try {
        const w = img.naturalWidth, h = img.naturalHeight;
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        const ctx = cv.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const id = ctx.getImageData(0, 0, w, h), p = id.data;
        const at = (x, y) => (y * w + x) * 4;
        const cs = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
        let kr = 0, kg = 0, kb = 0;
        cs.forEach((i) => { kr += p[i]; kg += p[i + 1]; kb += p[i + 2]; });
        kr /= 4; kg /= 4; kb /= 4;
        const tol = 56 * 56, vis = new Uint8Array(w * h), st = [];
        for (let x = 0; x < w; x++) { st.push(x, (h - 1) * w + x); }
        for (let y = 0; y < h; y++) { st.push(y * w, y * w + w - 1); }
        while (st.length) {
          const q = st.pop(); if (vis[q]) continue; vis[q] = 1;
          const i = q * 4, dr = p[i] - kr, dg = p[i + 1] - kg, db = p[i + 2] - kb;
          if (dr * dr + dg * dg + db * db > tol) continue;
          p[i + 3] = 0;
          const x = q % w, y = (q / w) | 0;
          if (x > 0) st.push(q - 1); if (x < w - 1) st.push(q + 1);
          if (y > 0) st.push(q - w); if (y < h - 1) st.push(q + w);
        }
        ctx.putImageData(id, 0, 0);
        img.src = cv.toDataURL("image/png");
        fig.classList.add("is-cut");
      } catch (e) { /* tainted / error — keep original */ }
    }
    // NOTE: cutout disabled — the caricature is a full illustrated scene, not a
    // plain-background figure, so we frame it cleanly instead of cutting it.
    void autoCutout;

    // subtle 3D parallax on the cutout
    const hero = fig.closest(".hero");
    if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform = `translate(${dx * 24}px, ${dy * 16}px) rotate(${dx * 3}deg)`;
      });
      hero.addEventListener("pointerleave", () => { img.style.transform = ""; });
    }
  })();
})();
