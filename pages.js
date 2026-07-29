/* =========================================================
   vino.made — Build & Grow subpage interactions
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* nav scrolled + scroll progress + back-to-top */
  const navbar = $("#navbar"), progress = $(".scroll-progress"), topBtn = $("#topBtn");
  function onScroll() {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (progress) progress.style.width = (p * 100) + "%";
    if (navbar) navbar.classList.toggle("scrolled", h.scrollTop > 20);
    if (topBtn) topBtn.classList.toggle("show", h.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* mobile menu */
  const menuToggle = $("#menuToggle"), navLinks = $("#navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-link", navLinks).forEach((l) => l.addEventListener("click", () => {
      navLinks.classList.remove("open"); menuToggle.classList.remove("open");
    }));
  }

  /* custom cursor dot (match home) */
  const dot = $(".cursor-dot");
  if (dot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let raf = false, x = 0, y = 0;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) { raf = true; requestAnimationFrame(() => { dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; raf = false; }); }
    });
    const t = "a, button, .feat-card, .stack-item, .proj-row, .split-half";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(t)) dot.classList.add("hover"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(t)) dot.classList.remove("hover"); });
  }

  /* reveal on scroll */
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal-up, .reveal").forEach((el) => revObs.observe(el));

  /* counters */
  const cObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, target = parseInt(el.dataset.target, 10) || 0, suffix = el.dataset.suffix || "";
      const dur = 1400, start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$(".counter").forEach((c) => cObs.observe(c));

  /* skill bars fill on view */
  const bObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.style.width = (en.target.dataset.level || "0") + "%";
      obs.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  $$(".bar-fill").forEach((b) => bObs.observe(b));

  /* smooth scroll for same-page anchors */
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) { const t = document.querySelector(id); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); } }
  }));

  /* ===================== WOW-FACTOR ===================== */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* word-by-word headline reveal */
  const h1 = $(".subhero h1");
  if (h1 && !reduce) {
    let i = 0;
    Array.from(h1.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (part.trim() === "") { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement("span");
          s.className = "w"; s.style.setProperty("--i", i++); s.textContent = part;
          frag.appendChild(s);
        });
        h1.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        n.classList.add("w"); n.style.setProperty("--i", i++);
      }
    });
    h1.classList.add("split");
    requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add("in")));
  }

  /* cursor-following spotlight on hero */
  const subhero = $(".subhero");
  if (subhero && !reduce && canHover) {
    const sp = document.createElement("div"); sp.className = "spotlight";
    subhero.prepend(sp);
    subhero.addEventListener("pointermove", (e) => {
      const r = subhero.getBoundingClientRect();
      sp.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      sp.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  }

  /* 3D tilt + glare on cards */
  if (!reduce && canHover) {
    $$(".feat-card, .stack-item").forEach((card) => {
      card.classList.add("tilt");
      const glare = document.createElement("span"); glare.className = "glare";
      card.appendChild(glare);
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `rotateX(${(py - .5) * -10}deg) rotateY(${(px - .5) * 12}deg) translateY(-6px)`;
        glare.style.setProperty("--gx", px * 100 + "%");
        glare.style.setProperty("--gy", py * 100 + "%");
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* magnetic buttons */
  if (!reduce && canHover) {
    $$(".subhero-actions .btn, .cta-band .btn").forEach((btn) => {
      btn.classList.add("magnetic");
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .4}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }
})();
