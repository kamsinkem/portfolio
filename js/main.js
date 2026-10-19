/* =========================================================
   Portfolio behavior
   - Builds project cards from content/projects.json
   - Project detail modal with photo gallery
   - Nav: active-section highlight + mobile menu
   - GSAP/ScrollTrigger animations (skipped for reduced motion)
   - Formspree contact form
   You shouldn't need to edit this file to update content.
   ========================================================= */
(() => {
  'use strict';

  const PROJECTS_URL = 'content/projects.json';

  const root = document.documentElement;
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
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7"/></svg>'
  };

  const LINK_LABELS = { github: 'Code', video: 'Video', report: 'Report (PDF)' };

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
    $$('.nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

    // Highlight the nav link of whichever section crosses the middle of the screen.
    const sections = $$('main > section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) => {
          const active = a.dataset.nav === id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------------- Projects ---------------- */
  let projects = [];

  async function loadProjects() {
    const grid = $('#project-grid');
    try {
      const res = await fetch(PROJECTS_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      projects = await res.json();
      if (!Array.isArray(projects)) throw new Error('projects.json must contain a list [ … ]');
    } catch (err) {
      console.error('Could not load projects:', err);
      const msg = location.protocol === 'file:'
        ? 'Projects can’t load when the page is opened as a file. Preview it with a local server — see README → “Preview on your computer”.'
        : 'Couldn’t load projects. Check content/projects.json for a typo (a missing comma or quote is the usual culprit).';
      grid.replaceChildren(el('p', { class: 'project-status', text: msg }));
      return;
    }

    grid.replaceChildren(...projects.map(renderCard));
    animateCards();
    openFromHash();
  }

  function renderLinks(links = {}) {
    const items = Object.keys(LINK_LABELS)
      .filter((key) => links[key])
      .map((key) => {
        const a = el('a', { href: links[key], target: '_blank', rel: 'noopener' });
        a.innerHTML = ICONS[key];
        a.append(LINK_LABELS[key]);
        return a;
      });
    return items.length ? el('div', { class: 'links' }, items) : null;
  }

  function renderTools(tools = []) {
    if (!tools.length) return null;
    return el('ul', { class: 'tools', 'aria-label': 'Tools used' }, tools.map((t) => el('li', { text: t })));
  }

  function renderCard(p) {
    const media = el('div', { class: 'card-media' }, [
      el('img', { src: p.cover, alt: '', loading: 'lazy', width: 1600, height: 1000 })
    ]);
    const openBtn = el('button', { class: 'card-open', type: 'button', 'aria-label': `Open details for ${p.title}` });
    openBtn.addEventListener('click', () => openProject(p.id));

    const title = el('h3', { class: 'card-title' }, [openBtn, document.createTextNode(p.title)]);
    const body = el('div', { class: 'card-body' }, [
      p.year ? el('p', { class: 'card-meta', text: p.year }) : null,
      title,
      el('p', { class: 'card-summary', text: p.summary }),
      renderTools(p.tools),
      renderLinks(p.links)
    ]);
    return el('article', { class: 'project-card', 'data-id': p.id }, [media, body]);
  }

  /* ---------------- Project modal ---------------- */
  const modal = $('#project-modal');
  const modalBody = $('#modal-body');
  let lastFocus = null;

  function renderDetails(details = []) {
    // Each entry in "details" can be:
    //   "A paragraph of text"
    //   "## A heading"
    //   ["bullet one", "bullet two"]
    return el('div', { class: 'modal-details' }, details.map((block) => {
      if (Array.isArray(block)) return el('ul', {}, block.map((item) => el('li', { text: item })));
      if (typeof block === 'string' && block.startsWith('## ')) return el('h3', { text: block.slice(3) });
      return el('p', { text: String(block) });
    }));
  }

  function renderGallery(p) {
    const images = (p.gallery && p.gallery.length) ? p.gallery : [{ src: p.cover, caption: '' }];
    let index = 0;

    const mainImg = el('img', { src: images[0].src, alt: images[0].caption || p.title });
    const caption = el('p', { class: 'gallery-caption', text: images[0].caption || '' });
    const main = el('div', { class: 'gallery-main' }, [mainImg]);

    const thumbs = images.map((img, i) => {
      const b = el('button', { type: 'button', 'aria-label': `Show image ${i + 1} of ${images.length}`, 'aria-current': i === 0 ? 'true' : 'false' },
        [el('img', { src: img.src, alt: '', loading: 'lazy' })]);
      b.addEventListener('click', () => show(i));
      return b;
    });

    function show(i) {
      index = (i + images.length) % images.length;
      const img = images[index];
      const swap = () => {
        mainImg.src = img.src;
        mainImg.alt = img.caption || p.title;
        caption.textContent = img.caption || '';
      };
      if (animate) {
        gsap.to(mainImg, { opacity: 0, duration: 0.15, onComplete: () => { swap(); gsap.to(mainImg, { opacity: 1, duration: 0.3 }); } });
      } else {
        swap();
      }
      thumbs.forEach((t, j) => t.setAttribute('aria-current', String(j === index)));
      thumbs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    const parts = [main, caption];
    if (images.length > 1) {
      const prev = el('button', { class: 'gallery-nav gallery-prev', type: 'button', 'aria-label': 'Previous image', html: ICONS.prev });
      const next = el('button', { class: 'gallery-nav gallery-next', type: 'button', 'aria-label': 'Next image', html: ICONS.next });
      prev.addEventListener('click', () => show(index - 1));
      next.addEventListener('click', () => show(index + 1));
      main.append(prev, next);
      parts.push(el('div', { class: 'gallery-thumbs' }, thumbs));

      // Arrow keys + swipe
      modal.onkeydown = (e) => {
        if (e.key === 'ArrowLeft') show(index - 1);
        if (e.key === 'ArrowRight') show(index + 1);
      };
      let startX = null;
      main.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      main.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
        startX = null;
      });
    } else {
      modal.onkeydown = null;
    }
    return el('div', { class: 'gallery' }, parts);
  }

  function openProject(id, { updateUrl = true } = {}) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;

    const content = el('div', { class: 'modal-content' }, [
      p.year ? el('p', { class: 'card-meta', text: p.year }) : null,
      el('h2', { class: 'modal-title', id: 'modal-title', text: p.title }),
      el('p', { class: 'modal-summary', text: p.summary }),
      renderTools(p.tools),
      renderLinks(p.links),
      p.details && p.details.length ? renderDetails(p.details) : null
    ]);
    modalBody.replaceChildren(renderGallery(p), content);
    modalBody.scrollTop = 0;

    modal.showModal();
    document.body.classList.add('modal-open');
    $('#modal-close').focus();
    if (updateUrl) history.replaceState(null, '', `#project/${encodeURIComponent(id)}`);
  }

  function closeProject() {
    if (modal.open) modal.close();
  }

  modal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (location.hash.startsWith('#project/')) history.replaceState(null, '', '#projects');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });
  $('#modal-close').addEventListener('click', closeProject);
  // Click on the dimmed backdrop closes the modal.
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });

  // Deep links: yoursite.com/#project/robotic-arm opens that project directly.
  function openFromHash() {
    const m = location.hash.match(/^#project\/(.+)$/);
    if (!m) return;
    $('#projects').scrollIntoView();
    openProject(decodeURIComponent(m[1]), { updateUrl: false });
  }
  window.addEventListener('hashchange', openFromHash);

  /* ---------------- Animations ---------------- */
  function initAnimations() {
    if (!animate) return;

    // Hero: text fades + scales in on load
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.hero-img', { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .fromTo('[data-hero]',
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.14 }, 0.2);

    // Hero: background zooms + parallaxes, text drifts up and fades as you scroll
    gsap.to('.hero-media', {
      yPercent: 18, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-content', {
      yPercent: -25, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true }
    });

    // Generic fade-up for headings, photo, form, etc.
    $$('[data-reveal]').forEach((node) => {
      gsap.fromTo(node, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true }
      });
    });

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

    // Subtle photo parallax in About
    gsap.fromTo('.about-photo img', { scale: 1.15, yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.about-photo', start: 'top bottom', end: 'bottom top', scrub: true }
    });
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

  function animateCards() {
    if (!animate) return;
    const cards = $$('.project-card');
    gsap.set(cards, { opacity: 0, y: 80 });
    ScrollTrigger.batch(cards, {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        clearProps: 'transform' // hand hover transforms back to CSS
      })
    });
    ScrollTrigger.refresh();
  }

  /* ---------------- Contact form (Formspree) ---------------- */
  function initForm() {
    const form = $('#contact-form');
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
  $('#year').textContent = new Date().getFullYear();
  initNav();
  initForm();
  initAnimations();
  loadProjects();
})();
