/* =========================================================
   Portfolio behavior (shared by every page)
   - Reads all project data from content/projects.json and builds:
       · the "Projects" dropdown in the nav
       · the home-page project carousel   (index.html)
       · the all-projects grid             (projects.html)
       · each project's detail page        (project.html?id=…)
   - Nav: active-section highlight, dark-over-hero, mobile menu
   - GSAP/ScrollTrigger animations (skipped for reduced motion)
   - Formspree contact form
   You shouldn't need to edit this file to update content.
   ========================================================= */
(() => {
  'use strict';

  const PROJECTS_URL = 'content/projects.json';

  const root = document.documentElement;
  const page = document.body.dataset.page || 'home';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const animate = !reduceMotion && hasGsap;

  if (animate) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    root.classList.remove('motion'); // show everything immediately
  }
  root.classList.add('ready');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'html') node.innerHTML = value; // only used for trusted inline icons
      else node.setAttribute(key, value);
    }
    for (const child of [].concat(children)) if (child) node.append(child);
    return node;
  }

  const ICONS = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="currentColor" d="M10 8.5v7l6-3.5-6-3.5Z"/></svg>',
    report: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg>'
  };

  const LINK_LABELS = { github: 'Code', video: 'Video', report: 'Report (PDF)' };

  /* ---------------- Project data ---------------- */
  let projectsPromise = null;

  function getProjects() {
    projectsPromise = projectsPromise || fetch(PROJECTS_URL, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((list) => {
        if (!Array.isArray(list)) throw new Error('projects.json must contain a list [ … ]');
        return list;
      });
    return projectsPromise;
  }

  const projectUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;

  function loadErrorMessage() {
    return location.protocol === 'file:'
      ? 'Projects can’t load when the page is opened as a file. Preview it with a local server — see README → “Preview on your computer”.'
      : 'Couldn’t load projects. Check content/projects.json for a typo (a missing comma or quote is the usual culprit).';
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    const header = $('#nav');
    const toggle = $('#nav-toggle');
    const navLinks = $$('[data-nav]');

    const setMenu = (open) => {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('nav-open')));
    header.addEventListener('click', (e) => { if (e.target.closest('.nav-links a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      setMenu(false);
      // Close the Projects dropdown if focus is inside it
      if (document.activeElement && document.activeElement.closest('.has-dropdown')) document.activeElement.blur();
    });

    // Switch the nav to dark colors while it sits over a dark header (home hero or page header).
    const darkTop = $('.hero, .page-hero');
    if (darkTop) {
      const updateNavTone = () => header.classList.toggle('on-dark', darkTop.getBoundingClientRect().bottom > header.offsetHeight);
      window.addEventListener('scroll', updateNavTone, { passive: true });
      window.addEventListener('resize', updateNavTone);
      updateNavTone();
    }

    const setActive = (id) => navLinks.forEach((a) => {
      const active = a.dataset.nav === id;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });

    if (page !== 'home') {
      setActive(page === 'about' ? 'about' : 'projects');
      return;
    }

    // Home: highlight the link of whichever section crosses the middle of the screen.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    $$('main > section[id]').forEach((s) => observer.observe(s));
  }

  // Fills the "Projects" hover dropdown with every project in projects.json.
  function buildNavDropdown(projects) {
    const list = $('[data-project-menu]');
    if (!list) return;
    list.replaceChildren(...projects.map((p) => el('li', {}, [
      el('a', { href: projectUrl(p) }, [
        el('img', { src: p.cover, alt: '', loading: 'lazy', width: 64, height: 44 }),
        el('span', { class: 'dd-text' }, [
          el('strong', { text: p.title }),
          p.category ? el('small', { text: p.category }) : null
        ])
      ])
    ])));
  }

  /* ---------------- Shared pieces ---------------- */
  function renderTools(tools = [], className = 'tools') {
    if (!tools.length) return null;
    return el('ul', { class: className, 'aria-label': 'Tools used' }, tools.map((t) => el('li', { text: t })));
  }

  function renderLinks(links = {}) {
    const items = Object.keys(LINK_LABELS)
      .filter((key) => links[key])
      .map((key) => {
        const a = el('a', { href: links[key], target: '_blank', rel: 'noopener', html: ICONS[key] });
        a.append(LINK_LABELS[key]);
        return a;
      });
    return items.length ? el('div', { class: 'links' }, items) : null;
  }

  const metaLine = (p) => [p.category, p.dates].filter(Boolean).join(' · ');

  function renderCard(p, ctaLabel) {
    const href = projectUrl(p);
    const cta = el('a', { class: 'btn btn-primary btn-sm card-cta', href, html: ICONS.arrow });
    cta.prepend(ctaLabel + ' ');
    cta.setAttribute('aria-label', `${ctaLabel}: ${p.title}`);

    return el('article', { class: 'project-card', 'data-card': '' }, [
      el('a', { class: 'card-media', href, tabindex: '-1', 'aria-hidden': 'true' }, [
        el('img', { src: p.cover, alt: '', loading: 'lazy', width: 1600, height: 1000 })
      ]),
      el('div', { class: 'card-body' }, [
        metaLine(p) ? el('p', { class: 'card-meta', text: metaLine(p) }) : null,
        el('h3', { class: 'card-title' }, [el('a', { href, text: p.title })]),
        el('p', { class: 'card-summary', text: p.summary }),
        renderTools(p.tools),
        cta
      ])
    ]);
  }

  function showError(container) {
    container.replaceChildren(el('p', { class: 'project-status', text: loadErrorMessage() }));
  }

  /* ---------------- Home page: project carousel ---------------- */
  function initHomeProjects(projects) {
    const track = $('#project-carousel');
    if (!track) return;
    const featured = projects.filter((p) => p.featured);
    const list = featured.length ? featured : projects.slice(0, 3);

    const more = el('a', { class: 'project-card more-card', href: 'projects.html', 'data-card': '' }, [
      el('span', { class: 'more-arrow', html: ICONS.arrow }),
      el('h3', { class: 'card-title', text: 'Browse all projects' }),
      el('p', { class: 'card-summary', text: `See all ${projects.length} projects, each with a full write-up.` })
    ]);

    track.replaceChildren(...list.map((p) => renderCard(p, 'View Project')), more);
    initCarousel(track);
    revealCards(track);
  }

  function initCarousel(track) {
    const prev = $('#proj-prev');
    const next = $('#proj-next');
    if (!prev || !next) return;

    const step = () => {
      const card = track.querySelector('.project-card');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 4;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max;
    };
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- Projects page: grid of all projects ---------------- */
  function initProjectsPage(projects) {
    const grid = $('#all-projects');
    grid.replaceChildren(...projects.map((p) => renderCard(p, 'See More')));
    const count = $('#project-count');
    if (count) count.textContent = `${projects.length} project${projects.length === 1 ? '' : 's'}`;
    revealCards(grid);
  }

  /* ---------------- Project detail page ---------------- */
  function renderBullet(text) {
    // "Label: rest of the sentence" → bold label
    const m = /^([^:]{1,40}):\s(.+)$/.exec(text);
    return m ? el('li', {}, [el('strong', { text: m[1] + ': ' }), m[2]]) : el('li', { text });
  }

  function renderFigure(img, className) {
    if (!img || !img.src) return null;
    return el('figure', { class: className, 'data-reveal': '' }, [
      el('div', { class: 'figure-frame' }, [el('img', { src: img.src, alt: img.caption || '', loading: 'lazy' })]),
      img.caption ? el('figcaption', { text: img.caption }) : null
    ]);
  }

  function renderSection(s, i) {
    const text = el('div', { class: 'split-text', 'data-reveal': '' }, [
      el('p', { class: 'split-num', text: String(i + 1).padStart(2, '0') }),
      s.heading ? el('h2', { class: 'split-title', text: s.heading }) : null,
      ...[].concat(s.text || []).map((t) => el('p', { text: t })),
      s.bullets && s.bullets.length ? el('ul', { class: 'split-list' }, s.bullets.map(renderBullet)) : null
    ]);
    const figure = renderFigure(s.image, 'split-media');
    if (!figure) return el('section', { class: 'split split-text-only container' }, [text]);
    return el('section', { class: `split container${i % 2 ? ' split-reverse' : ''}` }, [figure, text]);
  }

  function initProjectPage(projects) {
    const mount = $('#project-root');
    const id = new URLSearchParams(location.search).get('id');
    const index = projects.findIndex((p) => p.id === id);

    if (index < 0) {
      $('#p-title').textContent = 'Project not found';
      $('#p-summary').textContent = 'That project doesn’t exist (or its link has a typo).';
      mount.replaceChildren(el('div', { class: 'container not-found' }, [
        el('a', { class: 'btn btn-primary', href: 'projects.html', text: 'See all projects' })
      ]));
      return;
    }

    const p = projects[index];
    const nextP = projects[(index + 1) % projects.length];
    document.title = `${p.title} | ${document.title.split('|').pop().trim()}`;

    // Dark header
    $('#p-meta').textContent = metaLine(p);
    $('#p-title').textContent = p.title;
    $('#p-summary').textContent = p.summary;
    $('#p-extras').replaceChildren(...[renderTools(p.tools), renderLinks(p.links)].filter(Boolean));

    const facts = [
      ['Project type', p.category],
      ['Timeline', p.dates],
      ['Role', p.role],
      ['Technologies', (p.tools || []).join(', ')]
    ].filter((f) => f[1]);

    const blocks = [
      // Cover image overlapping the header
      el('div', { class: 'container project-cover' }, [renderFigure({ src: p.cover, caption: p.coverCaption }, 'cover-figure')]),

      el('div', { class: 'container' }, [
        el('dl', { class: 'facts facts-strip', 'data-reveal': '' },
          facts.map(([k, v]) => el('div', {}, [el('dt', { text: k }), el('dd', { text: v })])))
      ]),

      p.overview ? el('section', { class: 'container overview' }, [
        el('h2', { class: 'overview-label', text: 'Overview', 'data-reveal': '' }),
        el('div', {}, [].concat(p.overview).map((t) => el('p', { text: t, 'data-reveal': '' })))
      ]) : null,

      ...(p.sections || []).map(renderSection),

      p.skills && p.skills.length ? el('section', { class: 'container skills-block' }, [
        el('h2', { class: 'block-title', text: 'Key skills demonstrated', 'data-reveal': '' }),
        el('ul', { class: 'skill-list', 'data-reveal': '' }, p.skills.map((s) => el('li', { text: s })))
      ]) : null,

      p.gallery && p.gallery.length ? el('section', { class: 'container gallery-block' }, [
        el('h2', { class: 'block-title', text: 'Gallery', 'data-reveal': '' }),
        el('div', { class: `gallery-grid${p.gallery.length === 3 ? ' is-mosaic' : ''}` },
          p.gallery.map((g) => renderFigure(g, 'gallery-item')))
      ]) : null,

      // Next project + back to all
      projects.length > 1 ? el('section', { class: 'next-block' }, [
        el('div', { class: 'container' }, [
          el('a', { class: 'next-card', href: projectUrl(nextP), 'data-reveal': '' }, [
            el('div', { class: 'next-media' }, [el('img', { src: nextP.cover, alt: '', loading: 'lazy' })]),
            el('div', { class: 'next-text' }, [
              el('p', { class: 'card-meta', text: 'Next project' }),
              el('h2', { class: 'next-title', text: nextP.title }),
              el('span', { class: 'more-arrow', html: ICONS.arrow })
            ])
          ]),
          el('div', { class: 'project-actions' }, [
            el('a', { class: 'btn btn-secondary', href: 'projects.html', text: '← All projects' })
          ])
        ])
      ]) : null
    ];

    mount.replaceChildren(...blocks.filter(Boolean));
    setupReveals(mount);
    parallaxImages('.split-media .figure-frame img, .cover-figure .figure-frame img');
    if (animate) ScrollTrigger.refresh();
  }

  /* ---------------- Animations ---------------- */
  // Fade-up for anything marked data-reveal (safe to call again for new content).
  function setupReveals(scope = document) {
    if (!animate) return;
    $$('[data-reveal]', scope).forEach((node) => {
      if (node.dataset.revealReady) return;
      node.dataset.revealReady = '1';
      gsap.fromTo(node, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 90%', once: true }
      });
    });
  }

  // Images drift slightly inside their frames as you scroll.
  function parallaxImages(selector) {
    if (!animate) return;
    $$(selector).forEach((img) => {
      gsap.fromTo(img, { scale: 1.15, yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  function revealCards(container) {
    if (!animate) return;
    const cards = $$('[data-card]', container);
    gsap.set(cards, { opacity: 0, y: 80 });
    ScrollTrigger.batch(cards, {
      start: 'top 92%', once: true,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        clearProps: 'transform' // hand hover transforms back to CSS
      })
    });
    ScrollTrigger.refresh();
  }

  function initAnimations() {
    if (!animate) return;

    // Load-in: portrait rises (home), rule draws, then header text fades + scales in
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if ($('.hero-portrait img')) tl.fromTo('.hero-portrait img', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.6 }, 0);
    if ($('.hero-scan')) tl.fromTo('.hero-scan', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, 0.2);
    if ($('.hero-rule')) tl.fromTo('.hero-rule', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.9 }, 0.25);
    if ($('[data-hero]:not(.hero-rule)')) {
      tl.fromTo('[data-hero]:not(.hero-rule)',
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.12 }, 0.35);
    }

    // Home hero: portrait zooms + parallaxes, text drifts up and fades as you scroll
    if ($('.hero')) {
      gsap.to('.hero-portrait img', {
        yPercent: 14, scale: 1.08, transformOrigin: '50% 100%', ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero-content', {
        yPercent: -20, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true }
      });
    }

    setupReveals();

    // Bio: reveal line by line. Lines are measured at the moment the paragraph
    // scrolls into view, then the plain text is restored so it reflows on resize.
    $$('[data-lines]').forEach((p) => {
      ScrollTrigger.create({
        trigger: p, start: 'top 85%', once: true,
        onEnter: () => {
          const original = p.textContent.trim();
          const lines = splitLines(p, original);
          p.style.opacity = 1;
          gsap.from(lines, {
            yPercent: 110, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09,
            onComplete: () => { p.textContent = original; }
          });
        }
      });
    });

    parallaxImages('.story-media img');
  }

  function splitLines(node, text) {
    const words = text.split(/\s+/);
    node.textContent = '';
    const spans = words.map((w, i) => {
      const s = el('span', { text: w + (i < words.length - 1 ? ' ' : '') });
      node.append(s);
      return s;
    });
    const lines = [];
    let top = null;
    spans.forEach((s) => {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
      lines[lines.length - 1].push(s.textContent);
    });
    node.textContent = '';
    return lines.map((words) => {
      const inner = el('span', { class: 'line-inner', text: words.join('') });
      node.append(el('span', { class: 'line' }, [inner]));
      return inner;
    });
  }

  /* ---------------- Hero: live LiDAR-style scan behind the portrait ----------------
     Range rings, a rotating sweep beam, a "point cloud" that lights up as the beam
     passes, a planned path with a moving robot, and a tracked target. Kept faint so it
     never competes with the text or the photo. Pauses when off-screen; with reduced
     motion it draws a single still frame. */
  function initHeroScan() {
    const canvas = $('#hero-scan');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const TEAL = '94, 234, 212';
    const BLUE = '124, 196, 255';
    const TAU = Math.PI * 2;
    const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
    let w = 0, h = 0, angle = -Math.PI / 2, last = 0, raf = 0, visible = false;

    // Seeded random numbers so the "environment" looks the same on every visit.
    let seed = 11;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    // Point cloud in polar coordinates (r in units of the outer ring radius).
    const points = [];
    for (let i = 0; i < 9; i++) { // wall-like arcs
      const a0 = rand() * TAU, len = 0.25 + rand() * 0.6, r0 = 0.45 + rand() * 0.45, bend = (rand() - 0.5) * 0.25;
      const n = 14 + Math.floor(rand() * 16);
      for (let j = 0; j < n; j++) {
        const t = j / n;
        points.push({ a: a0 + t * len, r: Math.min(0.97, r0 + bend * t + (rand() - 0.5) * 0.015) });
      }
    }
    for (let i = 0; i < 70; i++) points.push({ a: rand() * TAU, r: 0.2 + rand() * 0.78 }); // scattered returns

    // Planned path (x, y in units of the radius; y points down), shown upper-left of the portrait.
    const path = [[-0.28, -0.56], [-0.46, -0.64], [-0.6, -0.5], [-0.77, -0.52], [-0.86, -0.3], [-0.8, -0.06]];
    const segLen = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
    const pathLen = segLen.reduce((a, b) => a + b, 0);
    const target = { x: 0.5, y: -0.62 };
    const targetAngle = Math.atan2(target.y, target.x);

    const since = (a) => { let d = (angle - a) % TAU; return d < 0 ? d + TAU : d; }; // how long ago the beam passed angle a

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight; // layout size, ignores the load-in scale animation
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time) {
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 * 0.96;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      // Range rings, crosshair, and compass ticks
      [0.32, 0.55, 0.78, 1].forEach((f, i) => {
        ctx.strokeStyle = `rgba(${TEAL}, ${i === 3 ? 0.14 : 0.07})`;
        ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, TAU); ctx.stroke();
      });
      ctx.strokeStyle = `rgba(${TEAL}, 0.05)`;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      for (let i = 0; i < 120; i++) {
        const a = (i / 120) * TAU, major = i % 10 === 0, r1 = R * (major ? 0.955 : 0.977);
        ctx.strokeStyle = `rgba(${TEAL}, ${major ? 0.3 : 0.12})`;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
      }

      // Sweep beam: a soft wedge trailing a bright leading edge
      const SPAN = 0.9;
      if (ctx.createConicGradient) {
        const g = ctx.createConicGradient(angle - SPAN, cx, cy);
        const f = SPAN / TAU;
        g.addColorStop(0, `rgba(${TEAL}, 0)`);
        g.addColorStop(f, `rgba(${TEAL}, 0.15)`);
        g.addColorStop(Math.min(1, f + 0.001), `rgba(${TEAL}, 0)`);
        g.addColorStop(1, `rgba(${TEAL}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, angle - SPAN, angle); ctx.closePath(); ctx.fill();
      } else {
        for (let i = 0; i < 18; i++) {
          ctx.fillStyle = `rgba(${TEAL}, ${0.012 * (i / 18)})`;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, angle - SPAN + (SPAN * i) / 18, angle); ctx.closePath(); ctx.fill();
        }
      }
      ctx.strokeStyle = `rgba(${TEAL}, 0.4)`;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R); ctx.stroke();

      // Point cloud: each return glows when the beam hits it, then fades
      for (const p of points) {
        const alpha = 0.05 + Math.exp(-since(p.a) * 1.1) * 0.75;
        ctx.fillStyle = `rgba(${TEAL}, ${alpha.toFixed(3)})`;
        ctx.fillRect(cx + Math.cos(p.a) * p.r * R - 1, cy + Math.sin(p.a) * p.r * R - 1, 2, 2);
      }

      // Planned path with waypoints and a robot moving along it
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = `rgba(${BLUE}, 0.35)`;
      ctx.beginPath();
      path.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R)));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(${BLUE}, 0.45)`;
      path.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(cx + x * R, cy + y * R, 2.5, 0, TAU); ctx.stroke(); });
      let d = ((time * 0.06) % 1) * pathLen, k = 0;
      while (k < segLen.length - 1 && d > segLen[k]) { d -= segLen[k]; k++; }
      const t = Math.min(1, d / segLen[k]);
      const rx = cx + (path[k][0] + (path[k + 1][0] - path[k][0]) * t) * R;
      const ry = cy + (path[k][1] + (path[k + 1][1] - path[k][1]) * t) * R;
      ctx.fillStyle = `rgba(${BLUE}, 0.15)`; ctx.beginPath(); ctx.arc(rx, ry, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = `rgba(${BLUE}, 0.9)`; ctx.beginPath(); ctx.arc(rx, ry, 3.2, 0, TAU); ctx.fill();

      // Tracked target: corner brackets that flash when the beam passes
      const tx = cx + target.x * R, ty = cy + target.y * R, s = R * 0.07, c = s * 0.45;
      const ta = 0.25 + Math.exp(-since(targetAngle) * 1.5) * 0.6;
      ctx.strokeStyle = `rgba(${TEAL}, ${ta.toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
        ctx.moveTo(tx + sx * s, ty + sy * s - sy * c); ctx.lineTo(tx + sx * s, ty + sy * s); ctx.lineTo(tx + sx * s - sx * c, ty + sy * s);
      });
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = `rgba(${TEAL}, ${(ta * 0.8).toFixed(3)})`;
      ctx.font = `600 10px ${MONO}`;
      ctx.fillText('OBJ · 2.4 m', tx - s, ty + s + 16);
    }

    function frame(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      angle = (angle + dt * 0.55) % TAU;
      draw(now / 1000);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    }
    const start = () => { if (!raf && !reduceMotion) { last = 0; raf = requestAnimationFrame(frame); } };

    resize();
    if (reduceMotion) { angle = -0.35; draw(8); }
    new ResizeObserver(() => { resize(); if (reduceMotion || !raf) draw(8); }).observe(canvas);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) start(); });
  }

  /* ---------------- Contact form (Formspree) ---------------- */
  function initForm() {
    const form = $('#contact-form');
    if (!form) return;
    const status = $('#form-status');
    const setStatus = (text, type = '') => {
      status.textContent = text;
      status.className = `form-status${type ? ' is-' + type : ''}`;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.action.includes('YOUR_FORM_ID')) {
        setStatus('This form isn’t connected yet — add your Formspree ID (see README).', 'error');
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus('Sending…');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        setStatus('Thanks! Your message is on its way. I’ll get back to you soon.', 'success');
      } catch (err) {
        console.error(err);
        setStatus('Something went wrong. Please email me directly instead.', 'error');
      } finally {
        button.disabled = false;
      }
    });
  }

  /* ---------------- Boot ---------------- */
  $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });
  initNav();
  initForm();
  initHeroScan();
  initAnimations();

  getProjects()
    .then((projects) => {
      buildNavDropdown(projects);
      if (page === 'home') initHomeProjects(projects);
      if (page === 'projects') initProjectsPage(projects);
      if (page === 'project') initProjectPage(projects);
    })
    .catch((err) => {
      console.error('Could not load projects:', err);
      const target = $('#project-carousel') || $('#all-projects') || $('#project-root');
      if (target) showError(target);
    });
})();
