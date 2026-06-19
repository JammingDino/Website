/* ============================================================
   Levi Pronk-Jones — Portfolio interactions
   Vanilla JS. No dependencies. GitHub Pages friendly.
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------------------------------------------------
     PRELOADER  — count 0→100, then reveal hero words
  --------------------------------------------------------- */
  const preloader = $("#preloader");
  const countEl   = $("#preloaderCount");
  const fillEl    = $("#preloaderFill");

  function revealHero() {
    document.body.classList.add("is-loaded");
  }

  function runPreloader() {
    const skip = prefersReduced || !preloader || /[?&]instant/.test(location.search);
    if (skip) {
      if (preloader) preloader.style.display = "none";
      revealHero();
      return;
    }
    let n = 0;
    const tick = () => {
      n += Math.max(1, Math.round((100 - n) * 0.08));
      if (n >= 100) n = 100;
      countEl.textContent = String(n).padStart(3, "0");
      fillEl.style.width = n + "%";
      if (n < 100) {
        setTimeout(tick, 24 + Math.random() * 40);
      } else {
        setTimeout(() => {
          preloader.classList.add("is-done");
          revealHero();
        }, 320);
      }
    };
    tick();
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR  (desktop only) — lerped ring + instant dot
  --------------------------------------------------------- */
  function initCursor() {
    if (!isFinePointer) return;
    const ring = $("#cursor");
    const dot  = $("#cursorDot");
    if (!ring || !dot) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.classList.remove("is-hidden");
    });
    document.addEventListener("mouseleave", () => ring.classList.add("is-hidden"));

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    // hover states
    $$("[data-cursor]").forEach((el) => {
      const type = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => {
        ring.classList.toggle("is-link", type === "link");
        ring.classList.toggle("is-view", type === "view");
      });
      el.addEventListener("mouseleave", () => ring.classList.remove("is-link", "is-view"));
    });
  }

  /* ---------------------------------------------------------
     HERO MESH CANVAS — nodes + proximity links, mouse-reactive
  --------------------------------------------------------- */
  function initMesh() {
    const canvas = $("#meshCanvas");
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((w * h) / 26000); // density scales w/ area
      const count = Math.max(28, Math.min(90, target));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const LINK = 130;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // mouse repulsion
        const dxm = n.x - mouse.x, dym = n.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 140) {
          const f = (140 - dm) / 140 * 0.6;
          n.x += (dxm / dm) * f; n.y += (dym / dm) * f;
        }

        // links
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const a = (1 - d / LINK) * 0.22;
            ctx.strokeStyle = `rgba(255,77,0,${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // node
        const near = dm < 140;
        ctx.fillStyle = near ? "rgba(255,138,76,0.9)" : "rgba(244,241,234,0.45)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.6 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; });

    // pause when hero off-screen (perf)
    const hero = $("#hero");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) draw(); }
      else { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0 });
    if (hero) io.observe(hero);

    resize();
    draw();
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL  +  ABOUT word reveal  +  project viz trigger
  --------------------------------------------------------- */
  function initReveal() {
    // Debug/QA: ?instant reveals everything immediately (no scroll needed).
    const revealAll = /[?&]instant/.test(location.search);
    if (revealAll) {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-inview"));
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    $$("[data-reveal]").forEach((el) => {
      // hero items handled by preloader; skip them
      if (el.closest(".hero")) return;
      io.observe(el);
    });

    // ABOUT — split statement into words, fade each on scroll
    const stmt = $("[data-reveal-words]");
    if (stmt) {
      const html = stmt.innerHTML;
      // wrap text nodes' words while preserving <span class="accent"> etc.
      const frag = document.createElement("div");
      frag.innerHTML = html;
      const wrapWords = (node) => {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === 3) {
            const span = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((tok) => {
              if (tok.trim() === "") { span.appendChild(document.createTextNode(tok)); }
              else { const s = document.createElement("span"); s.className = "word-r"; s.textContent = tok; span.appendChild(s); }
            });
            node.replaceChild(span, child);
          } else if (child.nodeType === 1) {
            child.classList.add("word-r");
          }
        });
      };
      wrapWords(frag);
      stmt.innerHTML = frag.innerHTML;

      const words = $$(".word-r", stmt);
      if (revealAll) { words.forEach((wd) => (wd.style.opacity = "1")); return; }
      const reveal = () => {
        const rect = stmt.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85, end = vh * 0.3;
        const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        const lit = Math.floor(progress * words.length);
        words.forEach((wd, i) => { wd.style.opacity = i < lit ? "1" : "0.16"; });
      };
      window.addEventListener("scroll", reveal, { passive: true });
      reveal();
    }
  }

  /* ---------------------------------------------------------
     COUNTERS  (stats)
  --------------------------------------------------------- */
  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1400; const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     SCROLL PROGRESS + NAV state + scrollspy
  --------------------------------------------------------- */
  function initScroll() {
    const bar = $("#scrollProgress");
    const nav = $("#nav");
    const links = $$(".nav__link");
    const sections = links
      .map((l) => $(l.getAttribute("href")))
      .filter(Boolean);

    const onScroll = () => {
      const st = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (docH > 0 ? (st / docH) * 100 : 0) + "%";
      if (nav) nav.classList.toggle("is-scrolled", st > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // scrollspy
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
        }
      });
    }, { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     MOBILE NAV
  --------------------------------------------------------- */
  function initNav() {
    const nav = $("#nav");
    const burger = $("#navBurger");
    if (!nav || !burger) return;
    const close = () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-locked");
    };
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
    });
    $$(".nav__link").forEach((l) => l.addEventListener("click", close));
  }

  /* ---------------------------------------------------------
     MAGNETIC BUTTONS + card glow + subtle tilt
  --------------------------------------------------------- */
  function initInteractions() {
    if (!isFinePointer || prefersReduced) return;

    // magnetic
    $$("[data-magnetic], .btn").forEach((el) => {
      const strength = el.hasAttribute("data-magnetic") ? 0.4 : 0.25;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // lab card pointer glow
    $$(".lab-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });

    // project visual tilt
    $$("[data-tilt]").forEach((el) => {
      const viz = $(".project__visual", el);
      if (!viz) return;
      el.addEventListener("mousemove", (e) => {
        const r = viz.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        viz.style.transform = `perspective(700px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) scale(1.02)`;
      });
      el.addEventListener("mouseleave", () => { viz.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------
     MEDIA PREVIEW MODAL  (in-site sub-project previews)
  --------------------------------------------------------- */
  function initModal() {
    const modal = $("#modal");
    if (!modal) return;
    const img    = $("#modalMedia");
    const meta   = $("#modalMeta");
    const title  = $("#modalTitle");
    const desc   = $("#modalDesc");
    const highs  = $("#modalHighlights");
    const tags   = $("#modalTags");
    const links  = $("#modalLinks");
    const closeBtn = $("#modalClose");
    const mediaWrap = img.parentElement;
    let lastFocused = null;

    const fillList = (el, items, make) => {
      el.innerHTML = "";
      items.forEach((v) => el.appendChild(make(v)));
    };

    function open(card) {
      lastFocused = card;
      const d = card.dataset;
      title.textContent = d.title || "";
      meta.textContent  = d.meta || "";
      desc.textContent  = d.desc || "";

      // media (optional)
      if (d.media) { img.src = d.media; img.alt = (d.title || "") + " preview"; mediaWrap.style.display = ""; }
      else { img.removeAttribute("src"); mediaWrap.style.display = "none"; }

      // highlights — split on "|"
      const hi = (d.highlights || "").split("|").map((t) => t.trim()).filter(Boolean);
      fillList(highs, hi, (t) => { const li = document.createElement("li"); li.textContent = t; return li; });

      // tags — split on ","
      const tg = (d.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
      fillList(tags, tg, (t) => { const li = document.createElement("li"); li.textContent = t; return li; });

      // links — "Label::url | Label::url"
      const lk = (d.links || "").split("|").map((t) => t.trim()).filter(Boolean);
      fillList(links, lk, (entry) => {
        const [label, url] = entry.split("::").map((s) => s.trim());
        const a = document.createElement("a");
        a.className = "btn btn--primary";
        a.href = url || "#"; a.target = "_blank"; a.rel = "noopener noreferrer";
        a.setAttribute("data-cursor", "link");
        a.innerHTML = "<span>" + (label || "Open") + "</span>" +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>';
        return a;
      });

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
      closeBtn.focus();
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      if (lastFocused) lastFocused.focus();
    }

    // open from any card carrying data-title (main projects + lab previews)
    $$("[data-title]").forEach((card) => {
      if (!card.matches(".lab-card, .project__inner")) return;
      card.addEventListener("click", () => open(card));
    });

    modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  $("#year") && ($("#year").textContent = new Date().getFullYear());

  window.addEventListener("DOMContentLoaded", () => {
    initCursor();
    initMesh();
    initReveal();
    initCounters();
    initScroll();
    initNav();
    initInteractions();
    initModal();
    runPreloader();
  });

  // Safety net: never leave the preloader stuck if something stalls.
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader && !preloader.classList.contains("is-done")) {
        preloader.classList.add("is-done");
      }
      document.body.classList.add("is-loaded");
    }, 2600);
  });
})();
