/* =========================================================================
   Aniket Kolhe Portfolio — interactions
   Plain JavaScript, no libraries. Each feature checks that its elements
   exist, so removing a section from index.html will not break the page.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   1. EDIT ME: personal links used in several places on the page
   ------------------------------------------------------------------------ */
const SITE = {
  // Paste your full LinkedIn URL between the quotes, e.g.
  // "https://www.linkedin.com/in/aniket-kolhe-123abc/"
  // While this is empty, the LinkedIn link stays hidden.
  linkedin: "",
  email: "Aniketkolhe88@gmail.com",
};

(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const SVG_NS = "http://www.w3.org/2000/svg";

  root.classList.add("js");

  /* -------------------------------------------------------------------------
     2. LinkedIn links (hidden until SITE.linkedin is filled in)
     ---------------------------------------------------------------------- */
  $$('[data-social="linkedin"]').forEach((item) => {
    const link = item.matches("a") ? item : $("a", item);
    if (SITE.linkedin && /^https?:\/\//.test(SITE.linkedin)) {
      if (link) link.href = SITE.linkedin;
    } else {
      item.hidden = true;
    }
  });

  /* -------------------------------------------------------------------------
     3. Header: transparent at the top, dark bar after scrolling; mobile menu;
        highlight the section you are reading
     ---------------------------------------------------------------------- */
  const header = $("#site-header");
  const menuBtn = $("#menu-toggle");
  const navLinks = $$(".nav-list a");

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const setMenu = (open) => {
    if (!header || !menuBtn) return;
    header.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(!header.classList.contains("nav-open")));
    navLinks.forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("nav-open")) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 860) setMenu(false); });
  }

  if ("IntersectionObserver" in window && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute("aria-current"));
        const link = byId.get(entry.target.id);
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* -------------------------------------------------------------------------
     4. Scroll-triggered reveals
     ---------------------------------------------------------------------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion && revealEls.length) {
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* -------------------------------------------------------------------------
     5. Hero name: split letters for the staggered drop-in
     ---------------------------------------------------------------------- */
  let charIndex = 0;
  $$("[data-split]").forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    for (const ch of text) {
      const span = document.createElement("span");
      span.className = "ch";
      span.style.setProperty("--i", charIndex++);
      span.textContent = ch;
      line.appendChild(span);
    }
  });

  /* -------------------------------------------------------------------------
     6. Original spider-web generator (corner webs + faint background webs).
        Spokes from a centre plus sagging rings; a second, slightly shifted
        pass gives the hand-drawn look of the reference.
     ---------------------------------------------------------------------- */
  function webPath({ cx, cy, r, spokes = 9, rings = 7, a0 = 0, a1 = Math.PI * 2, sag = 0.18, seed = 1 }) {
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const full = Math.abs(a1 - a0) >= Math.PI * 2 - 0.001;
    const angles = [];
    for (let i = 0; i < spokes; i++) {
      const t = full ? i / spokes : i / (spokes - 1);
      angles.push(a0 + (a1 - a0) * t + (rand() - 0.5) * (full ? 0.14 : 0.06));
    }
    const f = (n) => n.toFixed(1);
    let d = "";
    angles.forEach((a) => {
      const rr = r * (0.92 + rand() * 0.12);
      d += `M${f(cx)},${f(cy)}L${f(cx + rr * Math.cos(a))},${f(cy + rr * Math.sin(a))}`;
    });
    for (let k = 1; k <= rings; k++) {
      const base = r * Math.pow(k / rings, 0.95);
      const pts = angles.map((a) => {
        const rr = base * (0.93 + rand() * 0.12);
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
      });
      if (full) pts.push(pts[0]);
      d += `M${f(pts[0][0])},${f(pts[0][1])}`;
      for (let i = 1; i < pts.length; i++) {
        const [px, py] = pts[i - 1];
        const [qx, qy] = pts[i];
        const mx = (px + qx) / 2, my = (py + qy) / 2;
        d += `Q${f(mx + (cx - mx) * sag)},${f(my + (cy - my) * sag)} ${f(qx)},${f(qy)}`;
      }
    }
    return d;
  }

  // Pencil-sketch web for the hero corners: many uneven spokes, sagging
  // rings with a few broken strands, like a hand-drawn illustration.
  function sketchWeb({ r, spokes = 18, rings = 7, sag = 0.3, seed = 1 }) {
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const f = (n) => n.toFixed(1);
    const angles = [];
    for (let i = 0; i < spokes; i++) angles.push((i / spokes) * Math.PI * 2 + (rand() - 0.5) * 0.22);
    const lens = angles.map(() => r * (0.78 + rand() * 0.3));
    let d = "";
    angles.forEach((a, i) => {
      const bend = (rand() - 0.5) * 0.05;
      const mx = Math.cos(a + bend) * lens[i] * 0.5, my = Math.sin(a + bend) * lens[i] * 0.5;
      d += `M0,0Q${f(mx)},${f(my)} ${f(Math.cos(a) * lens[i])},${f(Math.sin(a) * lens[i])}`;
    });
    for (let k = 1; k <= rings; k++) {
      const base = r * Math.pow(k / (rings + 0.6), 1.12);
      const pts = angles.map((a, i) => {
        const rr = Math.min(base * (0.9 + rand() * 0.18), lens[i] * 0.98);
        return [Math.cos(a) * rr, Math.sin(a) * rr];
      });
      pts.push(pts[0]);
      for (let i = 1; i < pts.length; i++) {
        if (k > 1 && rand() < 0.07) continue; // a broken strand here and there
        const [px, py] = pts[i - 1];
        const [qx, qy] = pts[i];
        const mx = (px + qx) / 2, my = (py + qy) / 2;
        const sg = sag * (0.75 + rand() * 0.5);
        d += `M${f(px)},${f(py)}Q${f(mx * (1 - sg))},${f(my * (1 - sg))} ${f(qx)},${f(qy)}`;
      }
    }
    return d;
  }

  const WEBS = {
    "hero-tl": { box: "-320 -320 640 640", sketch: { r: 300, spokes: 19, rings: 8, sag: 0.32, seed: 5 } },
    "hero-br": { box: "-320 -320 640 640", sketch: { r: 300, spokes: 17, rings: 6, sag: 0.3, seed: 9 } },
    "full-a": { box: "-300 -300 600 600", opts: { cx: 0, cy: 0, r: 290, spokes: 14, rings: 10, sag: 0.16, seed: 11 } },
    "full-b": { box: "-300 -300 600 600", opts: { cx: 0, cy: 0, r: 290, spokes: 16, rings: 11, sag: 0.14, seed: 13 } },
    "full-c": { box: "-300 -300 600 600", opts: { cx: 0, cy: 0, r: 290, spokes: 15, rings: 10, sag: 0.16, seed: 17 } },
  };
  $$("svg[data-web]").forEach((svg) => {
    const cfg = WEBS[svg.dataset.web];
    if (!cfg) return;
    svg.setAttribute("viewBox", cfg.box);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    const main = document.createElementNS(SVG_NS, "path");
    const sketch = document.createElementNS(SVG_NS, "path");
    sketch.setAttribute("class", "sketch");
    if (cfg.sketch) {
      main.setAttribute("d", sketchWeb(cfg.sketch));
      sketch.setAttribute("d", sketchWeb({ ...cfg.sketch, seed: cfg.sketch.seed + 3, sag: cfg.sketch.sag + 0.05 }));
    } else {
      main.setAttribute("d", webPath(cfg.opts));
      sketch.setAttribute("d", webPath({ ...cfg.opts, seed: cfg.opts.seed + 101, sag: cfg.opts.sag + 0.04 }));
    }
    svg.append(main, sketch);
  });

  /* -------------------------------------------------------------------------
     7. Spiders (cloned from the <template>) and their drop-in on scroll
     ---------------------------------------------------------------------- */
  const spiderTpl = $("#spider-tpl");
  if (spiderTpl) {
    $$("[data-spider]").forEach((slot) => slot.appendChild(spiderTpl.content.cloneNode(true)));
  }
  const hangers = $$(".hang-spider");
  if ("IntersectionObserver" in window) {
    // when a section scrolls into view, its spider drops down its thread
    const sectionDrop = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { $$(".hang-spider", e.target).forEach((h) => h.classList.add("dropped")); sectionDrop.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    hangers.forEach((h) => { const s = h.closest("section"); if (s) sectionDrop.observe(s); });
  } else {
    hangers.forEach((h) => h.classList.add("dropped"));
  }

  /* -------------------------------------------------------------------------
     9. Crossed tapes: endless marquee that speeds up while you scroll
     ---------------------------------------------------------------------- */
  const tapes = $$("[data-tape]");
  if (tapes.length) {
    const tile = '<span class="tape-tile"></span>';
    const tracks = tapes.map((tape) => {
      const track = $(".tape-track", tape);
      const items = (track.dataset.items || "").split("|").filter(Boolean);
      const one = items.map((t) => `<span class="tape-item">${t}</span>${tile}`).join("");
      track.innerHTML = one;
      let set = one;
      let guard = 0;
      while (track.scrollWidth < window.innerWidth * 1.3 && guard++ < 10) { set += one; track.innerHTML = set; }
      track.innerHTML = set + set;
      return { track, dir: Number(tape.dataset.tape) || -1, x: 0, width: track.scrollWidth / 2 };
    });

    if (!reduceMotion) {
      let last = performance.now();
      let boost = 0;
      let lastY = window.scrollY;
      let visible = true;
      window.addEventListener("scroll", () => {
        const dy = Math.abs(window.scrollY - lastY);
        lastY = window.scrollY;
        boost = Math.min(boost + dy * 0.06, 9);
      }, { passive: true });
      window.addEventListener("resize", () => tracks.forEach((t) => { t.width = t.track.scrollWidth / 2; }));
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(tapes[0].parentElement);
      }
      tracks.forEach((t) => { if (t.dir > 0) t.x = -t.width; });
      const loop = (now) => {
        const dt = Math.min(64, now - last);
        last = now;
        if (visible) {
          const speed = 0.05 * (1 + boost);
          tracks.forEach((t) => {
            t.x += t.dir * speed * dt;
            if (t.x <= -t.width) t.x += t.width;
            if (t.x > 0) t.x -= t.width;
            t.track.style.transform = `translate3d(${t.x.toFixed(2)}px,0,0)`;
          });
        }
        boost *= 0.92;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  /* -------------------------------------------------------------------------
     10. Project cards: subtle 3D tilt (mouse only)
     ---------------------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const b = card.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        card.style.transform = `translateY(-6px) rotateX(${((0.5 - py) * 5).toFixed(2)}deg) rotateY(${((px - 0.5) * 6).toFixed(2)}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* -------------------------------------------------------------------------
     11. Contact: copy email + form that opens the visitor's own email app
         (no server is involved and nothing is sent from the page itself)
     ---------------------------------------------------------------------- */
  const copyBtn = $("#copy-email");
  const emailText = $("#email-text");
  if (copyBtn && emailText) {
    const label = $(".copy-label", copyBtn);
    const selectEmail = () => {
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
    };
    copyBtn.addEventListener("click", () => {
      const done = (text) => { label.textContent = text; setTimeout(() => { label.textContent = "Copy"; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SITE.email).then(() => done("Copied"), () => { selectEmail(); done("Press Ctrl+C"); });
      } else { selectEmail(); done("Press Ctrl+C"); }
    });
  }

  const form = $("#contact-form");
  const note = $("#form-note");
  if (form) {
    // The browser's own "Please fill in this field" bubbles handle validation (as in the reference).
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#cf-name").value.trim();
      const email = $("#cf-email").value.trim();
      const message = $("#cf-message").value.trim();
      const subject = `Portfolio enquiry from ${name}`;
      const body = `${message}\n\n${name}\n${email}`;
      note.innerHTML = `Opening your email app with this message. If nothing opens, email <strong>${SITE.email}</strong> directly.`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* -------------------------------------------------------------------------
     12. Resume buttons: hide them if the PDF is missing (when served over http)
     ---------------------------------------------------------------------- */
  const resumeLinks = $$("[data-resume]");
  if (resumeLinks.length && location.protocol.startsWith("http")) {
    fetch(resumeLinks[0].getAttribute("href"), { method: "HEAD" })
      .then((res) => { if (!res.ok) resumeLinks.forEach((a) => { (a.closest("li") || a).hidden = true; }); })
      .catch(() => { /* offline or blocked: leave the buttons alone */ });
  }

  /* -------------------------------------------------------------------------
     13. Footer year
     ---------------------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
