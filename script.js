/* ═══════════════════════════════════════════════════════════════════════
   Vira-Latas Metaleiros · script.js
   i18n · shows · mobile nav · scroll reveal
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── Translations (loaded from translations.js) ───────────────────────── */
/* All copy lives in translations.js — edit that file to change any text.   */
const T = window.T;

/* ─── State ────────────────────────────────────────────────────────────── */
const LANG_KEY = 'vl-lang';
let lang  = localStorage.getItem(LANG_KEY) || 'en';
let shows = [];

/* ─── DOM ready ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  shows = await fetch('./shows.json')
    .then(r => r.json())
    .catch(() => []);

  applyLang(lang);

  document.querySelectorAll('[data-lang]').forEach(btn =>
    btn.addEventListener('click', () => applyLang(btn.dataset.lang))
  );

  setupMobileNav();
  setupScrollReveal();
  setupTopbar();
  setupActiveNav();
  setupHeroCursor();
});

/* ─── Language ──────────────────────────────────────────────────────────── */
function applyLang(newLang) {
  lang = newLang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-t]').forEach(el => {
    const v = T[lang]?.[el.dataset.t];
    if (v !== undefined) el.innerHTML = v;
  });

  document.querySelectorAll('[data-lang]').forEach(btn =>
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false')
  );

  renderShows();
  buildMarquee();
}

/* ─── Marquee ───────────────────────────────────────────────────────────── */
function buildMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  const items = shows.slice(0, 4).map(s => {
    const bands = s.bands.join(' + ').toUpperCase();
    return `\u26a1 ${bands} \u00b7 ${s.venue.toUpperCase()} \u00b7 ${s.mon} ${s.day}`;
  });

  if (!items.length) {
    track.innerHTML = '<span>\u26a1 VIRA-LATAS METALEIROS \u00b7 HAMBURG \u00b7 EST. 2021</span><span>\u26a1 VIRA-LATAS METALEIROS \u00b7 HAMBURG \u00b7 EST. 2021</span>';
    return;
  }

  const doubled = [...items, ...items];
  track.innerHTML = doubled.map(t => `<span>${t}</span>`).join('');
}

/* ─── Shows renderer ────────────────────────────────────────────────────── */
function renderShows() {
  const list = document.getElementById('poster-list');
  if (!list) return;

  if (shows.length === 0) {
    list.innerHTML = `<p class="no-shows">[PLACEHOLDER: no shows message]</p>`;
    return;
  }

  const tix   = T[lang]['tickets'] || 'Tickets';
  const going = T[lang]['going']   || 'going';

  list.innerHTML = shows.map(s => {
    const bandsHtml = s.bands
      .map((b, i) => `<span class="b">${b}</span>${i < s.bands.length - 1 ? '<span class="plus">+</span>' : ''}`)
      .join('');

    const noteHtml   = s.note   ? `<div class="note">\u2605 ${s.note[lang] || s.note.en}</div>` : '';
    const goingHtml  = s.going  ? `<span class="going-pill">${s.going} ${going}</span>` : '';
    const ticketUrl  = s.url && s.url !== '#' ? s.url : '#';
    const ticketAttr = ticketUrl === '#' ? '' : 'target="_blank" rel="noopener"';

    return `<article class="poster" data-status="${s.status || 'soon'}">
      <div class="date">
        <span class="day">${s.day}</span>
        <span class="mon">${s.mon}</span>
        <span class="wd">${s.weekday[lang] || s.weekday.en}</span>
      </div>
      <div class="body">
        <div>
          <h3 class="bands">${bandsHtml}</h3>
          <div class="meta">
            <span>\u25c6 ${s.venue}</span>
            <span>\u25cf ${s.city}</span>
          </div>
          ${noteHtml}
        </div>
        <div class="right">
          ${goingHtml}
          <a class="tix" href="${ticketUrl}" ${ticketAttr}>${tix} \u2197</a>
        </div>
      </div>
    </article>`;
  }).join('');
}

/* ─── Mobile nav ────────────────────────────────────────────────────────── */
function setupMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
    document.body.style.overflow = open ? '' : 'hidden';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
  menu.addEventListener('click', e => { if (e.target === menu) closeMobileNav(); });

  function closeMobileNav() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    document.body.style.overflow = '';
  }
}

/* ─── Scroll reveal ─────────────────────────────────────────────────────── */
function setupScrollReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─── Topbar scroll state ───────────────────────────────────────────────── */
function setupTopbar() {
  const topbar = document.querySelector('.topbar');
  const hero   = document.querySelector('.hero');
  if (!topbar || !hero) return;

  const obs = new IntersectionObserver(
    ([entry]) => topbar.classList.toggle('scrolled', entry.isIntersecting === false),
    { threshold: 0 }
  );
  obs.observe(hero);
}

/* ─── Active nav link ───────────────────────────────────────────────────── */
function setupActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.topbar nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('id');
          navLinks.forEach(a =>
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
  );
  sections.forEach(s => obs.observe(s));
}

/* ─── Hero cursor glow (fine-pointer devices only) ─────────────────────── */
function setupHeroCursor() {
  const hero = document.querySelector('.hero');
  if (!hero || globalThis.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  hero.appendChild(glow);

  let rafId;
  hero.addEventListener('mousemove', e => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect  = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top  = `${e.clientY - rect.top}px`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId);
    glow.style.opacity = '0';
  });
  hero.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}
