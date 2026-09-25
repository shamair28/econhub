/* site/site.js — Study Hub shell. Needs site/courses.js loaded first.
 *
 * Renders, from the HUB_SITE site map:
 *   every page   top bar (menu · brand · theme toggle), side menu (drawer), theme switching
 *   lesson pages (<body class="lesson" data-course data-chapter>)
 *                course-badge brand, ‹ › chapter buttons, reading-progress bar, pinned sidebar with
 *                the current chapter's scroll-tracked section list, "practise this chapter" links,
 *                end-of-chapter pager, "mark studied", back-to-top, figure zoom
 *   homepage     (<body data-page="home">) hero, continue reading, upcoming tests, prep tools, courses
 *
 * Progress lives in localStorage (this device only):
 *   hub:theme 'light'|'dark' · hub:nav 'closed' (desktop sidebar hidden) — both raw strings, read by
 *   the inline <head> script before first paint · hub:done {"1B03/3": ts} · hub:last {course,n,sec,secTitle,t}
 */
(function () {
  'use strict';

  const SITE = window.HUB_SITE || { courses: [], events: [] };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const root = document.documentElement;
  const body = document.body;

  /* ── storage ── */
  const raw = {
    get(k) { try { return localStorage.getItem('hub:' + k); } catch (e) { return null; } },
    set(k, v) { try { if (v == null) localStorage.removeItem('hub:' + k); else localStorage.setItem('hub:' + k, v); } catch (e) { /* private mode */ } }
  };
  const store = {
    get(k, d) { const v = raw.get(k); if (v == null) return d; try { return JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { raw.set(k, v == null ? null : JSON.stringify(v)); }
  };
  const doneKey = (code, n) => code + '/' + n;
  const isDone = (code, n) => !!store.get('done', {})[doneKey(code, n)];

  /* ── site map helpers ── */
  const courseByCode = code => SITE.courses.find(c => c.code === code);
  const chHref = (course, n) => '/' + course.code + '/ch' + n;
  const courseName = c => c.dept + ' ' + c.code;
  const badge = c => `<span class="course-badge" data-course="${c.code}">${courseName(c)}</span>`;
  function toolsFor(course, n) {
    return (course.tools || []).map(t => {
      if (Array.isArray(t.chapters)) return t.chapters.includes(n) ? { t, links: [] } : null;
      if (t.chapters && t.chapters[n]) return { t, links: t.chapters[n] };
      return null;
    }).filter(Boolean);
  }
  /* "Practise:" chips for a chapter — deep links (e.g. SME weeks) or the whole tool */
  function practiseChips(course, n) {
    return toolsFor(course, n).map(({ t, links }) => links.length
      ? links.map(([hash, label]) => `<a class="chip cc" href="${t.href}${hash}">${t.icon} ${esc(t.short || t.title)} · ${esc(label)}</a>`).join('')
      : `<a class="chip cc" href="${t.href}">${t.icon} ${esc(t.title)}</a>`).join('');
  }
  function upcoming(now = new Date()) {
    return (SITE.events || []).map(e => ({ ...e, s: new Date(e.start), en: new Date(e.end || e.start) }))
      .filter(e => !isNaN(e.s) && e.en > now).sort((a, b) => a.s - b.s);
  }
  function dayDiff(d, now = new Date()) {
    const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.round((b - a) / 864e5);
  }
  function whenText(e, now = new Date()) {
    if (e.s <= now) return 'Happening now';
    const d = dayDiff(e.s, now);
    return d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : 'In ' + d + ' days';
  }
  const fmtDate = d => d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtTime = d => d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
  function ago(t) {
    const m = Math.round((Date.now() - t) / 6e4);
    if (m < 1) return 'just now';
    if (m < 60) return m + ' min ago';
    const h = Math.round(m / 60); if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    const d = Math.round(h / 24); return d === 1 ? 'yesterday' : d + ' days ago';
  }

  /* ── theme ── */
  const mqDark = matchMedia('(prefers-color-scheme: dark)');
  const theme = () => { const t = root.getAttribute('data-theme'); return t === 'dark' || t === 'light' ? t : (mqDark.matches ? 'dark' : 'light'); };
  function paintThemeBtn() {
    const b = $('#themeBtn'); if (!b) return;
    const dark = theme() === 'dark';
    b.innerHTML = dark ? '<span class="glyph" aria-hidden="true">☀</span><span class="lbl">Light</span>' : '<span class="glyph" aria-hidden="true">☾</span><span class="lbl">Dark</span>';
    b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    b.title = b.getAttribute('aria-label');
  }
  function toggleTheme() { const t = theme() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', t); raw.set('theme', t); paintThemeBtn(); }
  mqDark.addEventListener('change', paintThemeBtn);

  /* ── toast ── */
  let toastT;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); body.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1900);
  }

  /* ════════════ page context ════════════ */
  const isLesson = body.classList.contains('lesson');
  const page = body.dataset.page || (isLesson ? 'lesson' : 'other');
  let ctx = null;
  if (isLesson) {
    let code = body.dataset.course, n = +body.dataset.chapter;
    if (!code || !n) {
      const m = location.pathname.match(/\/([0-9A-Za-z]{4})\/(?:[0-9A-Za-z]{4}-)?ch(\d+)(?:\.html?)?\/?$/);
      if (m) { code = m[1].toUpperCase(); n = +m[2]; }
    }
    const course = courseByCode(code);
    if (course) {
      const i = course.chapters.findIndex(c => c.n === n);
      ctx = {
        course, n,
        ch: course.chapters[i] || { n, title: ($('h1.lesson-title') || {}).textContent || 'Chapter ' + n },
        prev: i > 0 ? course.chapters[i - 1] : null,
        next: i >= 0 ? course.chapters[i + 1] || null : null
      };
      if (!body.dataset.course) body.dataset.course = code;
    }
  }

  /* the chapter's sections, read from the lesson markup */
  const sections = !isLesson ? [] : $$('main.page > section[id]').filter(s => s.id !== 'footer').map(s => {
    const h = $('h2', s), lab = $('.section-number', s), txt = lab ? lab.textContent.trim() : '';
    const num = txt.match(/\d+/);
    const tag = num ? num[0] : /practice/i.test(txt + s.id) ? '✎' : /summary/i.test(txt + s.id) ? 'Σ' : '•';
    return { el: s, id: s.id, title: h ? h.textContent.trim() : s.id, tag };
  });

  /* ════════════ top bar ════════════ */
  function renderTopbar() {
    const bar = $('#topbar'); if (!bar) return;
    const menu = `<button class="icon-btn menu-btn" id="menuBtn" type="button" aria-controls="sidenav" aria-expanded="false">
        <span class="glyph" aria-hidden="true">☰</span><span class="lbl">${ctx ? 'Chapters' : 'Courses'}</span></button>`;
    const themeBtn = '<button class="icon-btn theme-btn" id="themeBtn" type="button"></button>';
    if (ctx) {
      const { course, n, ch, prev, next } = ctx;
      const arrow = (c, dir) => c
        ? `<a class="icon-btn" href="${chHref(course, c.n)}" aria-label="${dir === '‹' ? 'Previous' : 'Next'} chapter: Chapter ${c.n}, ${esc(c.title)}" title="${dir === '‹' ? 'Previous' : 'Next'}: Ch. ${c.n} — ${esc(c.title)}"><span class="glyph" aria-hidden="true">${dir}</span></a>`
        : `<span class="icon-btn" aria-disabled="true" aria-hidden="true"><span class="glyph">${dir}</span></span>`;
      bar.innerHTML = `${menu}
        <a class="brand" href="/#c-${course.code}" title="${courseName(course)} — all chapters">${badge(course)}<span class="brand-name">Chapter ${n}</span></a>
        <nav class="crumbs" aria-label="Current position"><span class="crumb-ch">${esc(ch.title)}</span><span class="sep sep-sec" aria-hidden="true">›</span><span class="crumb-sec" id="crumbSec"></span></nav>
        <span class="spacer"></span>
        ${arrow(prev, '‹')}${arrow(next, '›')}
        <a class="icon-btn hub-btn" href="/" title="Study Hub home"><span class="glyph" aria-hidden="true">⌂</span><span class="lbl">Hub</span></a>
        ${themeBtn}
        <div class="read-progress" aria-hidden="true"><i id="readBar"></i></div>`;
    } else {
      bar.innerHTML = `${menu}
        <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">◆</span><span class="brand-name">Study Hub</span></a>
        <span class="spacer"></span>${themeBtn}`;
    }
    paintThemeBtn();
    $('#themeBtn').addEventListener('click', toggleTheme);
    $('#menuBtn').addEventListener('click', toggleNav);
  }

  /* ════════════ side menu ════════════ */
  function tocHtml() {
    if (!sections.length) return '';
    return `<ol class="sn-toc" aria-label="On this page">${sections.map(s =>
      `<li><a href="#${s.id}" data-sec="${s.id}"><span class="n">${s.tag}</span><span>${esc(s.title)}</span></a></li>`).join('')}</ol>`;
  }
  function chapterLinks(course, hereN, withToc) {
    return course.chapters.map(c => {
      const here = c.n === hereN;
      return `<li><a class="sn-link${here ? ' here' : ''}" href="${chHref(course, c.n)}"${here ? ' aria-current="page"' : ''}>
          <span class="sn-num">${c.n}</span><span class="sn-t">${esc(c.title)}</span>${isDone(course.code, c.n) ? '<span class="sn-mark" title="Studied">✓</span>' : '<span></span>'}</a>
          ${here && withToc ? tocHtml() : ''}</li>`;
    }).join('');
  }
  const toolLinks = course => (course.tools || []).map(t =>
    `<li><a class="sn-link" href="${t.href}"><span class="sn-num tool">${t.icon}</span><span class="sn-t">${esc(t.title)}<small>${esc(t.kind)}</small></span><span class="sn-mark ext" aria-hidden="true">→</span></a></li>`).join('');

  function renderNav() {
    const nav = $('#sidenav'); if (!nav) return;
    const keep = $('.sn-body', nav) ? $('.sn-body', nav).scrollTop : 0;
    const cur = ctx && ctx.course;
    const last = store.get('last', null);
    let h = `<div class="sn-head"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">◆</span><span class="brand-name">Study Hub</span></a>
      <button class="icon-btn sn-close" id="navClose" type="button" aria-label="Close menu"><span class="glyph" aria-hidden="true">✕</span></button></div>
      <div class="sn-body">`;
    if (cur) {
      const nd = cur.chapters.filter(c => isDone(cur.code, c.n)).length;
      h += `<div class="sn-course" data-course="${cur.code}"><a href="/#c-${cur.code}"><span>${badge(cur)}</span><span class="sn-course-t">${esc(cur.title)}</span></a>
          <div class="sn-prog"><span class="pbar"><i style="width:${cur.chapters.length ? Math.round(100 * nd / cur.chapters.length) : 0}%"></i></span><span>${nd}/${cur.chapters.length} studied</span></div></div>
        <div class="sn-sec">Chapters</div><ol class="sn-list">${chapterLinks(cur, ctx.n, true)}</ol>`;
      if ((cur.tools || []).length) h += `<div class="sn-sec">Practice &amp; prep</div><ul class="sn-list">${toolLinks(cur)}</ul>`;
    }
    const others = SITE.courses.filter(c => c !== cur);
    h += `<div class="sn-sec">${cur ? 'Other courses' : 'Courses'}</div>` + others.map(c => {
      const open = !cur && last && last.course === c.code;
      return `<details class="sn-group" data-course="${c.code}"${open ? ' open' : ''}>
          <summary>${badge(c)}<span>${esc(c.title)}</span></summary>
          <ul class="sn-list">${chapterLinks(c, null, false)}${toolLinks(c)}</ul></details>`;
    }).join('');
    h += `<div class="sn-foot"><a class="sn-link" href="/"${page === 'home' ? ' aria-current="page"' : ''}><span class="sn-num">⌂</span><span class="sn-t">Study Hub home<small>All courses · upcoming tests · progress</small></span></a></div></div>`;
    nav.innerHTML = h;
    $('.sn-body', nav).scrollTop = keep;
    $('#navClose').addEventListener('click', () => setNavOpen(false));
  }

  /* drawer on phones/homepage; pinned column on wide lesson pages (☰ then collapses it) */
  const mqWide = matchMedia('(min-width: 1100px)');
  const pinned = () => isLesson && mqWide.matches;
  let navOpen = false, lastFocus = null;
  function syncNav() {
    const nav = $('#sidenav'), btn = $('#menuBtn'), scrim = $('#scrim'), main = $('#main');
    if (!nav || !btn) return;
    if (pinned()) {
      const collapsed = root.classList.contains('nav-collapsed');
      nav.classList.remove('open'); nav.inert = collapsed;
      nav.removeAttribute('role'); nav.removeAttribute('aria-modal');
      if (scrim) scrim.hidden = true;
      if (main) main.inert = false;
      body.classList.remove('noscroll');
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.title = collapsed ? 'Show the chapter sidebar' : 'Hide the chapter sidebar';
    } else {
      nav.classList.toggle('open', navOpen); nav.inert = !navOpen;
      if (navOpen) { nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); } else { nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); }
      if (scrim) scrim.hidden = !navOpen;
      if (main) main.inert = navOpen;
      body.classList.toggle('noscroll', navOpen);
      btn.setAttribute('aria-expanded', String(navOpen));
      btn.title = navOpen ? 'Close menu' : 'Open menu';
    }
  }
  function setNavOpen(open) {
    if (pinned()) return;
    navOpen = open;
    if (open) lastFocus = document.activeElement;
    syncNav();
    const nav = $('#sidenav');
    if (open) {
      const here = $('.sn-link.here', nav) || $('.sn-link', nav);
      if (here) { here.focus({ preventScroll: true }); centerIn($('.sn-body', nav), here); }
    } else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function toggleNav() {
    if (pinned()) {
      const collapsed = !root.classList.contains('nav-collapsed');
      root.classList.toggle('nav-collapsed', collapsed);
      raw.set('nav', collapsed ? 'closed' : null);
      syncNav();
      return;
    }
    setNavOpen(!navOpen);
  }
  function centerIn(box, el) {
    if (!box || !el) return;
    const b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (r.top < b.top + 48 || r.bottom > b.bottom - 48) box.scrollTop += (r.top - b.top) - b.height / 2 + r.height / 2;
  }

  /* ════════════ lesson page ════════════ */
  function renderHeroLinks() {
    const hero = $('.lesson-hero'); if (!hero || !ctx) return;
    let row = $('.hero-links', hero);
    if (!row) { row = document.createElement('div'); row.className = 'hero-links'; hero.appendChild(row); }
    const { course, n } = ctx;
    const chips = practiseChips(course, n);
    let h = chips ? '<span class="lbl">Practise:</span>' + chips : '';
    if (isDone(course.code, n)) h += '<span class="chip ok">✓ Studied</span>';
    row.innerHTML = h;
    row.hidden = !h;
  }

  function renderPager() {
    const pager = $('#pager'); if (!pager || !ctx) return;
    const { course, n, prev, next } = ctx;
    const done = isDone(course.code, n);
    let h = `<div class="pager-studied">
        <div class="q">${done ? 'Chapter studied ✓' : 'Finished this chapter?'}<small>${done ? 'It shows as done on the hub and in the side menu.' : 'Mark it studied to track your progress on the hub (saved on this device).'}</small></div>
        <button class="btn study-btn${done ? ' is-on' : ''}" type="button" aria-pressed="${done}">${done ? '✓ Studied' : '○ Mark as studied'}</button></div>
      <div class="pager-grid">`;
    if (prev) h += `<a class="pcard prev" href="${chHref(course, prev.n)}"><span class="k">← Previous</span><span class="t">Chapter ${prev.n}</span><span class="s">${esc(prev.title)}</span></a>`;
    h += next
      ? `<a class="pcard next" href="${chHref(course, next.n)}"><span class="k">Next →</span><span class="t">Chapter ${next.n}</span><span class="s">${esc(next.title)}</span></a>`
      : `<a class="pcard next" href="/#c-${course.code}"><span class="k">That's the latest chapter</span><span class="t">Back to ${courseName(course)}</span><span class="s">Chapter ${n + 1} isn't published yet — see everything for this course on the hub</span></a>`;
    h += '</div>';
    const tl = toolsFor(course, n);
    if (tl.length) {
      h += '<div class="pager-prep"><div class="eyebrow">Practise this chapter</div>' + tl.map(({ t, links }) => links.length
        ? `<div class="pcard tool"><span class="ico" aria-hidden="true">${t.icon}</span><span class="txt"><a class="t" href="${t.href}" style="color:inherit;text-decoration:none">${esc(t.title)}</a><span class="s">${t.desc}</span>
             <span class="links">${links.map(([hash, label]) => `<a class="chip cc" href="${t.href}${hash}">${esc(label)} →</a>`).join('')}</span></span></div>`
        : `<a class="pcard tool" href="${t.href}"><span class="ico" aria-hidden="true">${t.icon}</span><span class="txt"><span class="t">${esc(t.title)}</span><span class="s">${t.desc}</span></span></a>`).join('') + '</div>';
    }
    pager.innerHTML = h;
    $('.study-btn', pager).addEventListener('click', toggleStudied);
  }

  function toggleStudied() {
    const { course, n } = ctx;
    const d = store.get('done', {}), k = doneKey(course.code, n);
    if (d[k]) delete d[k]; else d[k] = Date.now();
    store.set('done', d);
    renderPager(); renderHeroLinks(); renderNav(); spy.paint(true);
    const b = $('#pager .study-btn'); if (b) b.focus({ preventScroll: true });
    toast(d[k] ? 'Chapter ' + n + ' marked as studied ✓' : 'Chapter ' + n + ' unmarked');
  }

  /* scroll tracking: active section in sidebar + top bar, reading progress, back-to-top, "continue" bookmark */
  const spy = {
    active: null,
    init() {
      if (!isLesson) return;
      this.bar = $('#readBar'); this.crumb = $('#crumbSec'); this.top = $('#toTop');
      let ticking = false;
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; this.update(); }); } };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll, { passive: true });
      this.update(true);
    },
    update(force) {
      const y = scrollY, max = root.scrollHeight - innerHeight;
      if (this.bar) this.bar.style.width = (max > 0 ? Math.min(100, Math.max(0, 100 * y / max)) : 0).toFixed(2) + '%';
      if (this.top) this.top.classList.toggle('on', y > innerHeight * 1.5);
      const line = ($('#topbar') ? $('#topbar').offsetHeight : 56) + 110;
      let cur = sections[0] || null;
      for (const s of sections) { if (s.el.getBoundingClientRect().top - line <= 0) cur = s; else break; }
      if (sections.length && max > 0 && max - y < 4) cur = sections[sections.length - 1];
      if (cur !== this.active || force) { this.active = cur; this.paint(); this.save(); }
    },
    paint(fromRender) {
      const cur = this.active;
      $$('.sn-toc a').forEach(a => {
        const on = !!cur && a.dataset.sec === cur.id;
        a.classList.toggle('active', on);
        if (on) { a.setAttribute('aria-current', 'location'); if (pinned() || fromRender) centerIn($('#sidenav .sn-body'), a); } else a.removeAttribute('aria-current');
      });
      if (this.crumb) this.crumb.textContent = cur ? cur.title : '';
    },
    save() {
      if (!ctx) return;
      const cur = this.active;
      store.set('last', { course: ctx.course.code, n: ctx.n, sec: cur ? cur.id : '', secTitle: cur ? cur.title : '', t: Date.now() });
    }
  };

  /* figure zoom */
  function openLightbox(img) {
    const lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', img.alt ? 'Figure: ' + img.alt : 'Figure');
    const big = img.cloneNode(false); big.removeAttribute('style');
    const x = document.createElement('button');
    x.className = 'icon-btn lb-close'; x.type = 'button'; x.setAttribute('aria-label', 'Close figure'); x.innerHTML = '<span class="glyph" aria-hidden="true">✕</span>';
    lb.append(big, x); body.appendChild(lb); body.classList.add('noscroll');
    const close = () => { lb.remove(); body.classList.remove('noscroll'); document.removeEventListener('keydown', onKey, true); img.focus && img.focus({ preventScroll: true }); };
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    lb.addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);
    x.focus();
  }

  function initLesson() {
    /* a few older callout titles carry their own symbol ("⚠ Common mistake:") — don't add a second one */
    $$('.callout > strong:first-child').forEach(el => { if (/^[^\p{L}\p{N}"“‘'(]/u.test(el.textContent.trim())) el.classList.add('own-icon'); });
    renderHeroLinks();
    renderPager();
    const toTop = document.createElement('a');
    toTop.id = 'toTop'; toTop.className = 'to-top'; toTop.href = '#main'; toTop.setAttribute('aria-label', 'Back to top'); toTop.innerHTML = '<span aria-hidden="true">↑</span>';
    toTop.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0 }); history.replaceState(null, '', location.pathname + location.search); });
    body.appendChild(toTop);
    spy.init();
    $$('main.page figure img').forEach(img => { img.tabIndex = 0; img.setAttribute('role', 'button'); img.title = 'Click to enlarge'; });
    document.addEventListener('click', e => { const img = e.target.closest('main.page figure img'); if (img) openLightbox(img); });
    document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('main.page figure img')) { e.preventDefault(); openLightbox(e.target); } });
    /* in-page links from the drawer close it (phones) */
    $('#sidenav').addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (a && !pinned()) setNavOpen(false); });
    /* base64 figures can shift layout while decoding — re-land a deep link (e.g. "Resume at §5") once loaded */
    if (location.hash) {
      const y0 = scrollY;
      addEventListener('load', () => {
        const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t && Math.abs(scrollY - y0) < 8) t.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, { once: true });
    }
  }

  /* ════════════ homepage ════════════ */
  function renderHome() {
    const app = $('#main'); if (!app) return;
    const now = new Date();
    const done = store.get('done', {});
    const last = store.get('last', null);
    const evs = upcoming(now);
    const nCh = SITE.courses.reduce((a, c) => a + c.chapters.length, 0);
    const tools = SITE.courses.flatMap(c => (c.tools || []).map(t => ({ c, t })));
    const nDone = SITE.courses.reduce((a, c) => a + c.chapters.filter(ch => done[doneKey(c.code, ch.n)]).length, 0);

    /* continue reading (or a short how-to on first visit) */
    let lastCourse = last && courseByCode(last.course);
    let lastCh = lastCourse && lastCourse.chapters.find(c => c.n === last.n);
    const lastDone = lastCh ? lastCourse.chapters.filter(c => done[doneKey(lastCourse.code, c.n)]).length : 0;
    const left = lastCh
      ? `<section class="card continue" data-course="${lastCourse.code}" aria-labelledby="contH">
          <div class="eyebrow" id="contH">Continue where you left off</div>
          <div>${badge(lastCourse)}</div>
          <div class="ct">Chapter ${lastCh.n} · ${esc(lastCh.title)}</div>
          <div class="cs">${last.secTitle ? 'Last read: <b>' + esc(last.secTitle) + '</b> · ' : ''}${ago(last.t)}</div>
          <div class="sn-prog"><span class="pbar"><i style="width:${Math.round(100 * lastDone / lastCourse.chapters.length)}%"></i></span><span>${lastDone} of ${lastCourse.chapters.length} ${courseName(lastCourse)} chapters studied</span></div>
          ${practiseChips(lastCourse, lastCh.n) ? `<div class="cont-links"><span class="muted">Practise:</span>${practiseChips(lastCourse, lastCh.n)}</div>` : ''}
          <div class="row"><a class="btn primary" href="${chHref(lastCourse, lastCh.n)}${last.sec ? '#' + encodeURIComponent(last.sec) : ''}">Resume reading →</a>
            <a class="btn ghost" href="${chHref(lastCourse, lastCh.n)}">Start of chapter</a></div>
        </section>`
      : `<section class="card" aria-labelledby="howH">
          <div class="panel-h"><h2 id="howH">How this hub works</h2></div>
          <ol class="start-list">
            <li><span class="n">1</span><span><b>Read a chapter.</b> Each lesson is a taught walkthrough — worked examples, figures, memory aids and five practice problems with hidden answers.</span></li>
            <li><span class="n">2</span><span><b>Test yourself.</b> The interactive practice tests and SME prep hub give instant feedback and timed practice.</span></li>
            <li><span class="n">3</span><span><b>Track progress.</b> Mark chapters as studied; the hub remembers where you left off (on this device).</span></li>
          </ol></section>`;

    const soonest = evs.slice(0, 4);
    const right = `<section class="card" aria-labelledby="evH">
        <div class="panel-h"><h2 id="evH">Upcoming tests</h2><span class="muted" style="font-size:12.5px">Fall 2026 · from the course outlines</span></div>
        ${soonest.length ? `<ul class="events">${soonest.map(e => {
          const c = courseByCode(e.course) || { code: e.course, dept: '' };
          const soon = dayDiff(e.s, now) <= 7;
          return `<li class="event${soon ? ' soon' : ''}" data-course="${c.code}">
            <span class="date" aria-hidden="true"><span class="m">${e.s.toLocaleDateString('en-CA', { month: 'short' }).replace('.', '')}</span><span class="d">${e.s.getDate()}</span></span>
            <span><span class="et">${badge(c)}${esc(e.title)}</span>
              <span class="es"><span class="when">${whenText(e, now)}</span> · ${fmtDate(e.s)}, ${fmtTime(e.s)} · ${esc(e.scope || '')}</span></span>
            ${e.tool ? `<a class="btn${soon ? ' primary' : ''}" href="${e.tool}">Practise</a>` : `<a class="btn ghost" href="#c-${c.code}">Chapters</a>`}
          </li>`;
        }).join('')}</ul>` : '<p class="muted" style="margin:0">No upcoming tests listed.</p>'}
      </section>`;

    const toolCards = tools.map(({ c, t }) => {
      const ev = evs.find(e => e.tool === t.href);
      return `<a class="tcard" href="${t.href}" data-course="${c.code}">
          <span class="top"><span class="ico" aria-hidden="true">${t.icon}</span>${badge(c)}<span class="chip">${esc(t.kind)}</span></span>
          <h3>${esc(t.title)}</h3><p>${t.desc}</p>
          <span class="foot">${ev ? `<span class="chip cc">${esc(ev.title)} · ${whenText(ev, now)}</span>` : '<span class="chip">Interactive</span>'}<span class="go">Open →</span></span>
        </a>`;
    }).join('');

    const courseCards = SITE.courses.map(c => {
      const nd = c.chapters.filter(ch => done[doneKey(c.code, ch.n)]).length;
      const ev = evs.find(e => e.course === c.code);
      const rows = c.chapters.map(ch => {
        const isD = !!done[doneKey(c.code, ch.n)], isL = last && last.course === c.code && last.n === ch.n;
        return `<a class="ch-row${isD ? ' done' : ''}${isL ? ' last' : ''}" href="${chHref(c, ch.n)}">
            <span class="n">${isD ? '✓' : ch.n}</span><span class="t">Chapter ${ch.n}: ${esc(ch.title)}${isL && !isD ? '<small>Reading now</small>' : ''}</span>
            ${isD ? '<span class="state">Studied</span>' : '<span class="arr" aria-hidden="true">→</span>'}</a>`;
      }).join('');
      const trows = (c.tools || []).map(t => `<a class="ch-row tool" href="${t.href}">
            <span class="n" aria-hidden="true">${t.icon}</span><span class="t">${esc(t.title)}<span class="tag">Interactive</span><small>${t.desc}</small></span><span class="arr" aria-hidden="true">→</span></a>`).join('');
      return `<article class="ccard" id="c-${c.code}" data-course="${c.code}" aria-labelledby="h-${c.code}">
          <header class="ccard-head">
            <div class="row1">${badge(c)}${ev ? `<span class="chip cc">${esc(ev.title)} · ${fmtDate(ev.s)}</span>` : ''}</div>
            <h3 id="h-${c.code}">${esc(c.title)}</h3>
            <div class="book">${c.book || ''}</div>
            <div class="prog"><span class="pbar"><i style="width:${c.chapters.length ? Math.round(100 * nd / c.chapters.length) : 0}%"></i></span><span>${nd} of ${c.chapters.length} chapters studied</span></div>
          </header>
          <div class="ccard-body">${rows}${trows}</div>
        </article>`;
    }).join('');

    app.innerHTML = `
      <section class="hero">
        <span class="eyebrow">McMaster University · Year 1 · Fall 2026</span>
        <h1>Economics <span class="grad">Study Hub</span></h1>
        <p class="lede">Taught chapter lessons with worked examples, figures and practice problems — plus interactive test prep. Pick up where you left off, or choose a course below.</p>
        <div class="hero-meta">
          <span class="chip">${SITE.courses.length} courses</span>
          <span class="chip">${nCh} chapter lessons</span>
          <span class="chip">${tools.length} interactive prep tools</span>
          ${nDone ? `<span class="chip ok">✓ ${nDone} studied</span>` : ''}
        </div>
      </section>
      <div class="home-top">${left}${right}</div>
      ${tools.length ? `<div class="section-title"><h2>Interactive prep</h2><p>Practice tests with instant feedback, timed exam mode and graph drills</p></div>
      <div class="tools">${toolCards}</div>` : ''}
      <div class="section-title"><h2>Courses</h2><p>Every chapter is a full taught lesson — open one to get the chapter sidebar</p></div>
      <div class="courses">${courseCards}</div>
      <footer class="home-foot">
        <p>Textbooks: ${SITE.courses.map(c => c.book).filter(Boolean).join(' &nbsp;|&nbsp; ')}</p>
        <p>Progress and “continue reading” are saved in this browser only. <button class="link" type="button" id="resetProg">Reset progress</button></p>
      </footer>`;

    $('#resetProg').addEventListener('click', () => {
      if (!confirm('Clear your studied chapters and reading position on this device?')) return;
      store.set('done', null); store.set('last', null); renderHome(); renderNav(); toast('Progress cleared');
    });
    /* land on a course card when arriving from a lesson's "back to course" link */
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView({ behavior: 'instant', block: 'start' }); }
  }

  /* ════════════ boot ════════════ */
  renderTopbar();
  renderNav();
  syncNav();
  mqWide.addEventListener('change', () => { navOpen = false; syncNav(); });
  const scrim = $('#scrim'); if (scrim) scrim.addEventListener('click', () => setNavOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && navOpen) setNavOpen(false); });
  if (isLesson && ctx) initLesson();
  if (page === 'home') renderHome();
  /* keep the homepage fresh when returning via the back button (bfcache) */
  addEventListener('pageshow', e => { if (e.persisted && page === 'home') { renderHome(); renderNav(); } });
})();
