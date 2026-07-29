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
            // Recurse rather than treating the whole element as one word, so a
            // multi-word <span class="accent"> lights up word by word like the
            // rest of the sentence instead of all at once.
            wrapWords(child);
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
        words.forEach((wd, i) => { wd.style.opacity = i < lit ? "1" : "0.4"; });
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
     LIVE DOWNLOAD STATS
     Modrinth has an open-CORS public API, so its total is fetched
     live in the browser. CurseForge is Cloudflare/API-key gated and
     can't be reached client-side, so its figure is stored in
     assets/stats.json and summed with the live Modrinth count.
  --------------------------------------------------------- */
  function initStats() {
    const els = $$("[data-downloads]");
    if (!els.length) return;

    const fmtK = (n) => (n >= 1000 ? Math.floor(n / 1000) + "K+" : String(n));

    const animate = (el, target) => {
      if (prefersReduced) { el.textContent = fmtK(target); return; }
      const dur = 1200, t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmtK(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    (async () => {
      // Fallbacks keep the page accurate even fully offline.
      let curseforge = 485000, modrinth = 19572;

      try {
        const s = await fetch("assets/stats.json", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null));
        if (s) {
          if (typeof s.curseforge === "number") curseforge = s.curseforge;
          if (typeof s.modrinthFallback === "number") modrinth = s.modrinthFallback;
        }
      } catch (_) { /* keep fallback */ }

      try {
        const projects = await fetch("https://api.modrinth.com/v2/user/JammingDino/projects")
          .then((r) => (r.ok ? r.json() : null));
        if (Array.isArray(projects)) {
          modrinth = projects.reduce((sum, p) => sum + (p.downloads || 0), 0);
        }
      } catch (_) { /* keep fallback */ }

      const total = curseforge + modrinth;
      els.forEach((el) => animate(el, total));

      // Keep the Minecraft modal's copy in sync with the live figure. Only the
      // leading "500,000+" is swapped — the rest of the sentence is left alone.
      const mc = $("#mcProject");
      if (mc) {
        const exact = total.toLocaleString() + "+";
        mc.dataset.meta = "JAVA · " + exact + " DOWNLOADS";
        if (mc.dataset.highlights) {
          mc.dataset.highlights = mc.dataset.highlights.replace(/^[\d,]+\+/, exact);
        }
      }
    })();
  }

  /* ---------------------------------------------------------
     LIVE PUBLIC REPO COUNT
     GitHub's REST API is open-CORS, so the figure on the page is
     the real one. data-count in the markup is the offline fallback.
  --------------------------------------------------------- */
  function initRepos() {
    const el = $("[data-repos]");
    if (!el) return;
    fetch("https://api.github.com/users/JammingDino")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (u && typeof u.public_repos === "number") {
          el.setAttribute("data-count", String(u.public_repos));
          // If the counter already ran, correct the settled value.
          if (el.textContent.trim() !== "0") el.textContent = String(u.public_repos);
        }
      })
      .catch(() => { /* fallback stays */ });
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
    const meta   = $("#modalMeta");
    const title  = $("#modalTitle");
    const desc   = $("#modalDesc");
    const body   = $("#modalBody");
    const tags   = $("#modalTags");
    const note   = $("#modalNote");
    const links  = $("#modalLinks");
    const closeBtn = $("#modalClose");
    let lastFocused = null;

    /* ── Lightbox ───────────────────────────────────────────────────────────
       Several of the screenshots are dense enough that they only make sense
       at full size, so every figure in the modal opens into this layer. It
       stacks above the modal rather than replacing it, and remembers the set
       it was opened from so ← / → step through the same case study.        */
    const lb        = $("#lightbox");
    const lbImg     = $("#lightboxImg");
    const lbCaption = $("#lightboxCaption");
    const lbClose   = $("#lightboxClose");
    const lbPrev    = $("#lightboxPrev");
    const lbNext    = $("#lightboxNext");
    let shots = [];        // the current modal's figures
    let shotIndex = 0;
    let lbReturnFocus = null;

    function showShot(i) {
      if (!shots.length) return;
      shotIndex = (i + shots.length) % shots.length;
      const s = shots[shotIndex];
      lbImg.src = s.src;
      lbImg.alt = s.caption;
      lbCaption.textContent = shots.length > 1
        ? (shotIndex + 1) + " / " + shots.length + (s.caption ? "  ·  " + s.caption : "")
        : s.caption;
      const many = shots.length > 1;
      lbPrev.hidden = !many;
      lbNext.hidden = !many;
    }

    function openLightbox(i) {
      if (!shots.length) return;
      lbReturnFocus = document.activeElement;
      showShot(i);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      lbClose.focus();
    }

    function closeLightbox() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      lbImg.removeAttribute("src");
      if (lbReturnFocus && lbReturnFocus.focus) lbReturnFocus.focus();
      lbReturnFocus = null;
    }

    const lbIsOpen = () => lb.classList.contains("is-open");

    lb.querySelectorAll("[data-lb-close]").forEach((el) => el.addEventListener("click", closeLightbox));
    lbPrev.addEventListener("click", () => showShot(shotIndex - 1));
    lbNext.addEventListener("click", () => showShot(shotIndex + 1));

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

      // tags — split on ","
      const tg = (d.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
      fillList(tags, tg, (t) => { const li = document.createElement("li"); li.textContent = t; return li; });

      // ── Body: highlights and gallery figures, woven together ──────────────
      // A run of bullets followed by a run of screenshots reads as homework
      // then a slideshow. Alternating them lets each figure illustrate the
      // points just made, and keeps a long case study from becoming a wall.
      const hi  = (d.highlights || "").split("|").map((t) => t.trim()).filter(Boolean);
      let gal = (d.gallery || "").split("|").map((t) => t.trim()).filter(Boolean)
        .map((entry) => {
          const [caption, src] = entry.split("::").map((s) => s.trim());
          return src ? { caption: caption || "", src } : null;
        }).filter(Boolean);
      // A card with a single data-media and no gallery becomes a one-shot
      // gallery, so every image in every modal enlarges the same way.
      if (!gal.length && d.media) gal = [{ caption: "", src: d.media }];

      body.innerHTML = "";
      shots = gal.slice();

      const addFigure = (shot, index) => {
        const fig = document.createElement("figure");
        fig.className = "modal__shot";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "modal__shot-btn";
        btn.setAttribute("data-cursor", "link");
        btn.setAttribute("aria-label", "Enlarge: " + (shot.caption || "image"));
        const im = document.createElement("img");
        im.src = shot.src; im.loading = "lazy";
        im.alt = shot.caption || ((d.title || "Project") + " screenshot");
        const hint = document.createElement("span");
        hint.className = "modal__shot-hint mono";
        hint.setAttribute("aria-hidden", "true");
        hint.textContent = "ENLARGE";
        btn.append(im, hint);
        btn.addEventListener("click", () => openLightbox(index));
        fig.appendChild(btn);
        if (shot.caption) {
          const cap = document.createElement("figcaption");
          cap.className = "mono";
          cap.textContent = shot.caption;
          fig.appendChild(cap);
        }
        body.appendChild(fig);
      };

      const addBullets = (items) => {
        if (!items.length) return;
        const ul = document.createElement("ul");
        ul.className = "modal__highlights";
        items.forEach((t) => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
        body.appendChild(ul);
      };

      if (!gal.length) {
        addBullets(hi);
      } else if (!hi.length) {
        gal.forEach(addFigure);
      } else {
        // Lead with one figure so the modal opens on something to look at,
        // then split the bullets across the figures that remain.
        addFigure(gal[0], 0);
        const rest = gal.slice(1);
        const groups = rest.length + 1;
        const per = Math.ceil(hi.length / groups);
        for (let g = 0; g < groups; g++) {
          addBullets(hi.slice(g * per, (g + 1) * per));
          if (rest[g]) addFigure(rest[g], g + 1);
        }
      }

      // closing note — credits, availability, caveats
      note.textContent = d.note || "";
      note.hidden = !d.note;

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
      if (lbIsOpen()) closeLightbox();
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      shots = [];
      if (lastFocused) lastFocused.focus();
    }

    // open from any card carrying data-title (main projects + lab previews)
    $$("[data-title]").forEach((card) => {
      if (!card.matches(".lab-card, .project__inner")) return;
      card.addEventListener("click", () => open(card));
    });

    modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      // The lightbox is the top layer, so it answers first and Escape peels
      // one layer at a time rather than dumping the reader back to the page.
      if (lbIsOpen()) {
        if (e.key === "Escape")     { e.preventDefault(); closeLightbox(); }
        if (e.key === "ArrowRight") { e.preventDefault(); showShot(shotIndex + 1); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); showShot(shotIndex - 1); }
        return;
      }
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
    initRepos();
    initCounters();
    initStats();
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
