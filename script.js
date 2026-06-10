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

  /* ---------- Resume modal ---------- */
  const resumeModal = $("#resumeModal");
  const resumeBtn = $("#resumeBtn");
  if (resumeBtn) resumeBtn.addEventListener("click", () => openModal(resumeModal));

  /* ---------- Modal helpers ---------- */
  function openModal(m) { m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeModal(m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $$(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-close")) closeModal(m); });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal.open").forEach(closeModal); });

  /* ---------- Contact form (Web3Forms → your inbox) ---------- */
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
      const original = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && out.success) {
          form.reset();
          showToast("Message sent! I'll get back to you soon ✿");
        } else {
          showToast(out.message || "Hmm, that didn't send — email me directly?", 5000);
        }
      } catch {
        showToast("Network hiccup — please email vinoism1703@gmail.com", 5000);
      } finally { btn.disabled = false; btn.innerHTML = original; }
    });
  }

  /* ---------- AI Avatar Assistant ---------- */
  (function avatar() {
    const widget = $("#avatar");
    const panel = $("#avatarPanel");
    const fab = $("#avatarBubbleBtn");
    const body = $("#avatarBody");
    const quick = $("#avatarQuick");
    const statusEl = $("#avatarStatus");
    const closeBtn = $("#avatarClose");
    const speakBtn = $("#avatarSpeak");
    if (!panel) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // scripted brain
    const intro = [
      "Hi there! I'm Vino 👋 — well, the <em>AI</em> version of me. ✨",
      "I'm a digital marketer, a <em>vibe coder</em>, and a problem-solving builder. Basically: I make ideas real, then make people care about them.",
      "Warm and easy to work with, but low-key competitive when there's a good problem to crack. Ask me anything 👇"
    ];
    const replies = {
      what: {
        label: "What do you do?",
        msg: "Three things, one brain 🧠 — I market (branding, content, SEO), I build full-stack apps with AI inside (React, Node, OpenAI), and I do the business-dev bit: validating ideas and turning 'what if' into 'let's launch.'",
        go: "#what"
      },
      win: {
        label: "Your proudest win?",
        msg: "Top 12 nationally at the <em>Intel AI Hackathon 2025</em> with Enterprise360 — and a ₹25,000 prize 🏆. I've stacked up ₹35K+ across hackathons. Want the full list?",
        go: "#wins"
      },
      work: {
        label: "Show me your work",
        msg: "On it! Scrolling you to my favourite builds — Sahaay AI, FinMate, Enterprise360 & ContentSpark. Tap any card for the story. 🚀",
        go: "#work"
      },
      hire: {
        label: "Are you available?",
        msg: "Yes! I'm open to internships &amp; freelance right now. The fastest way to reach me is the form below — I reply quickly and I'm genuinely nice to work with. 🌷",
        go: "#contact"
      }
    };

    let typingTimer = null;
    function addMsg(html, who) {
      const el = document.createElement("div");
      el.className = "av-msg" + (who === "user" ? " user" : "");
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      if (who === "user" || reduce) { el.innerHTML = html; body.scrollTop = body.scrollHeight; return Promise.resolve(el); }
      // typewriter (renders HTML safely after typing plain text)
      return new Promise((resolve) => {
        const tmp = document.createElement("div"); tmp.innerHTML = html;
        const text = tmp.textContent;
        let i = 0; el.classList.add("av-cursor");
        clearInterval(typingTimer);
        typingTimer = setInterval(() => {
          el.textContent = text.slice(0, ++i);
          body.scrollTop = body.scrollHeight;
          if (i >= text.length) { clearInterval(typingTimer); el.classList.remove("av-cursor"); el.innerHTML = html; resolve(el); }
        }, 22);
      });
    }

    function setStatus(s) { statusEl.textContent = s; }
    function showChips() {
      quick.innerHTML = "";
      Object.entries(replies).forEach(([k, r]) => {
        const b = document.createElement("button");
        b.className = "av-chip"; b.textContent = r.label;
        b.addEventListener("click", () => onAsk(k));
        quick.appendChild(b);
      });
    }

    let lastSpoken = "";
    async function onAsk(key) {
      const r = replies[key];
      quick.innerHTML = "";
      await addMsg(r.label, "user");
      setStatus("typing…");
      await wait(280);
      const el = await addMsg(r.msg, "bot");
      lastSpoken = el.textContent;
      setStatus("online");
      if (r.go) { const t = document.querySelector(r.go); if (t) setTimeout(() => t.scrollIntoView({ behavior: "smooth" }), 450); }
      showChips();
    }

    function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

    let started = false;
    async function runIntro() {
      if (started) return; started = true;
      setStatus("saying hi…");
      for (const line of intro) { await addMsg(line, "bot"); await wait(reduce ? 60 : 400); }
      lastSpoken = intro.map((l) => l.replace(/<[^>]+>/g, "")).join(" ");
      setStatus("online");
      showChips();
    }

    function openPanel() { panel.classList.remove("hidden"); fab.hidden = true; runIntro(); }
    function minimize() { panel.classList.add("hidden"); fab.hidden = false; stopSpeak(); }

    closeBtn.addEventListener("click", minimize);
    fab.addEventListener("click", openPanel);

    // text-to-speech
    let speaking = false;
    function pickVoice() {
      const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
      return vs.find((v) => /en-IN/i.test(v.lang)) ||
             vs.find((v) => /female|zira|samantha|aria|jenny|google uk english female/i.test(v.name)) ||
             vs.find((v) => /^en/i.test(v.lang)) || vs[0];
    }
    function stopSpeak() { if (window.speechSynthesis) speechSynthesis.cancel(); speaking = false; speakBtn.classList.remove("speaking"); }
    speakBtn.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) { setStatus("voice not supported 🙁"); return; }
      if (speaking) { stopSpeak(); return; }
      const u = new SpeechSynthesisUtterance(lastSpoken || intro.join(" ").replace(/<[^>]+>/g, ""));
      const v = pickVoice(); if (v) u.voice = v;
      u.rate = 1.02; u.pitch = 1.12;
      u.onend = () => { speaking = false; speakBtn.classList.remove("speaking"); };
      speaking = true; speakBtn.classList.add("speaking");
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    });
    if (window.speechSynthesis) speechSynthesis.onvoiceschanged = pickVoice;

    // start collapsed
    panel.classList.add("hidden"); fab.hidden = true;

    // fully tuck the widget away while the contact section is in view
    // (so nothing in the corner can ever intercept clicks on the links / form)
    let contactInView = false;
    const contactSec = document.querySelector("#contact");
    if (contactSec && widget) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          contactInView = en.isIntersecting;
          if (en.isIntersecting) { minimize(); widget.classList.add("tucked"); }
          else { widget.classList.remove("tucked"); }
        });
      }, { threshold: 0.15 }).observe(contactSec);
    }

    // auto-open the greeting ~1.5s after load — but only if we're NOT at the contact section
    window.addEventListener("load", () => setTimeout(() => { if (!contactInView) openPanel(); }, 1500));
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
})();
