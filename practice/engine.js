/* practice/engine.js — PracticeEngine
 *
 * A reusable, single-question-at-a-time practice-test runner.
 *
 *   PracticeEngine.mount(rootElement, config)
 *
 * config:
 *   id            unique key for localStorage (e.g. '1B03-midterm1')
 *   course        'ECON 1B03'
 *   courseTitle   'Introductory Microeconomics'
 *   title         'Midterm 1 Practice'
 *   subtitle      optional
 *   homeHref      link for the back button
 *   banks         ['banks/a.json', 'banks/b.json']   – question banks (see SCHEMA.md)
 *   scope         { id, label, units:[1,2,3,4], note }  – questions whose unit is not
 *                 in `units` (or that carry tag 'out-of-scope') are excluded by default
 *   unitNames     { 1:'Introduction', ... }
 *   exam          { questions: 40, minutes: 80 }      – exam-simulation defaults
 *
 * Question types: mc | multi | tf | numeric | graph   (see SCHEMA.md)
 *
 * Depends on graph.js (window.EconGraph) for figure rendering and graph questions.
 */
(function (global) {
  'use strict';

  const LS = 'pe:';
  const KIND_LABEL = { 'past-test': 'Past test', slides: 'Lecture slides', textbook: 'Textbook', generated: 'Generated', custom: 'Custom' };
  const LETTERS = 'abcdefghij';
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ANIM_MS = REDUCED ? 0 : 220;

  // ────────────────────────────────────────────────────────────────────────
  // DOM + text helpers
  // ────────────────────────────────────────────────────────────────────────
  function h(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = sanitize(v);
      else if (k === 'text') e.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') Object.assign(e.dataset, v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return e;
  }
  // Content in banks is authored in-repo (trusted), but strip anything executable anyway.
  function sanitize(html) {
    if (html == null) return '';
    const t = document.createElement('template');
    t.innerHTML = String(html);
    t.content.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(n => n.remove());
    t.content.querySelectorAll('*').forEach(n => {
      for (const a of Array.from(n.attributes)) {
        if (/^on/i.test(a.name) || (/^(href|src)$/i.test(a.name) && /^\s*javascript:/i.test(a.value))) n.removeAttribute(a.name);
      }
    });
    return t.innerHTML;
  }
  // Minimal inline markup: **bold**, *italic*, `code`, newline → <br>, blank line → paragraph
  function md(s) {
    if (s == null) return '';
    s = String(s);
    const hasHtml = /<\/?[a-z][^>]*>/i.test(s);
    const hasBlock = /<(p|ul|ol|div|table|h\d|blockquote|pre|figure)\b/i.test(s);
    const t = hasHtml ? s : s.replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // `*` is only italic when it opens after a non-word char, so P*, Q* (equilibrium) are left alone
    const inline = p => p.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)/g, '$1<i>$2</i>')
      .replace(/`([^`]+?)`/g, '<code>$1</code>');
    if (hasBlock) return inline(t);
    return t.split(/\n{2,}/).map(p => `<p>${inline(p).replace(/\n/g, '<br>')}</p>`).join('');
  }
  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  function fmtDate(ts) { try { return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rng || Math.random)() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pct(n, d) { return d ? Math.round(100 * n / d) : 0; }
  function parseNumber(str) {
    if (str == null) return NaN;
    let s = String(str).trim().replace(/[$,%\s]/g, '').replace(/[−–]/g, '-');
    if (!s) return NaN;
    const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (frac) { const d = parseFloat(frac[2]); return d ? parseFloat(frac[1]) / d : NaN; }
    const n = Number(s);
    return isFinite(n) ? n : NaN;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Engine
  // ────────────────────────────────────────────────────────────────────────
  class Engine {
    constructor(root, config) {
      this.root = root;
      this.cfg = Object.assign({
        title: 'Practice Test', homeHref: '/', banks: [], unitNames: {},
        exam: { questions: 40, minutes: 80 }, scope: null
      }, config);
      this.banks = [];
      this.questions = [];     // normalised question list
      this.byId = {};
      this.scenarios = {};     // key `${bankId}:${scenarioId}`
      this.session = null;
      this.screen = 'start';
      this.graph = null;       // active EconGraph instance for the current question
      this._timer = null;
      this._scenarioCollapsed = {};
      this.root.classList.add('pe');
      this._onKey = this._onKey.bind(this);
    }

    async init() {
      this.root.innerHTML = '';
      this.root.appendChild(h('div', { class: 'pe-loading' }, h('div', { class: 'pe-spinner' }), h('p', { text: 'Loading question banks…' })));
      try {
        await this._loadBanks();
      } catch (err) {
        this.root.innerHTML = '';
        this.root.appendChild(h('div', { class: 'pe-error' }, h('h2', { text: 'Could not load the question banks' }), h('p', { text: String(err && err.message || err) }), h('p', { class: 'pe-muted', text: 'If you opened this file directly from disk, serve the site over HTTP instead (the banks are fetched as JSON).' })));
        return;
      }
      this.store = this._loadStore();
      document.addEventListener('keydown', this._onKey);
      this.renderStart();
    }

    // ── loading & normalisation ─────────────────────────────────────────
    async _loadBanks() {
      const list = Array.isArray(this.cfg.banks) ? this.cfg.banks : [];
      if (!list.length) throw new Error('No banks configured.');
      const loaded = await Promise.all(list.map(async (src) => {
        if (typeof src === 'object') return src;               // inline bank
        const res = await fetch(src, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${src}: HTTP ${res.status}`);
        return res.json();
      }));
      let n = 0;
      for (const bank of loaded) {
        if (!bank || !Array.isArray(bank.questions)) throw new Error('Bank is missing a "questions" array.');
        bank.id = bank.id || ('bank' + (this.banks.length + 1));
        this.banks.push(bank);
        for (const sid in (bank.scenarios || {})) this.scenarios[`${bank.id}:${sid}`] = Object.assign({ id: sid }, bank.scenarios[sid]);
        bank.questions.forEach((q, i) => {
          const nq = this._normalize(q, bank, i);
          if (this.byId[nq.id]) nq.id = `${bank.id}:${nq.id}`;
          this.byId[nq.id] = nq;
          this.questions.push(nq);
          n++;
        });
      }
      if (!n) throw new Error('The banks contain no questions.');
    }

    _normalize(q, bank, idx) {
      const nq = Object.assign({}, q);
      nq.id = q.id || `${bank.id}-q${idx + 1}`;
      nq.bankId = bank.id;
      nq.bankTitle = bank.title || bank.id;
      nq.type = q.type || 'mc';
      if (nq.type === 'tf') {
        nq.type = 'mc';
        nq.options = [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }];
        nq.answer = (q.answer === true || q.answer === 'true' || q.answer === 'a') ? 'a' : 'b';
      }
      if (Array.isArray(nq.options)) nq.options = nq.options.map((o, i) => typeof o === 'string' ? { id: LETTERS[i], text: o } : Object.assign({ id: LETTERS[i] }, o));
      nq.source = Object.assign({ label: bank.title || bank.id, kind: 'custom' }, bank.defaultSource || {}, q.source || {});
      nq.tags = Array.isArray(q.tags) ? q.tags : [];
      nq.unit = q.unit != null ? Number(q.unit) : (bank.defaultUnit != null ? Number(bank.defaultUnit) : null);
      nq.topic = q.topic || bank.defaultTopic || '';
      nq.difficulty = q.difficulty || 2;
      nq.scenarioKey = q.scenario ? `${bank.id}:${q.scenario}` : null;
      // scope
      const sc = this.cfg.scope;
      nq.inScope = true;
      if (sc && Array.isArray(sc.units)) {
        if (nq.unit != null && !sc.units.includes(nq.unit)) nq.inScope = false;
        if (nq.tags.includes('out-of-scope')) nq.inScope = false;
      }
      if (q.inScope === false) nq.inScope = false;
      return nq;
    }

    unitName(u) { return this.cfg.unitNames && this.cfg.unitNames[u] ? this.cfg.unitNames[u] : (u != null ? `Unit ${u}` : 'General'); }
    sourceText(q) { return q.source.label + (q.source.ref ? ` · ${q.source.ref}` : ''); }

    // ── persistence ─────────────────────────────────────────────────────
    _loadStore() { try { return JSON.parse(localStorage.getItem(LS + this.cfg.id)) || { history: [] }; } catch (e) { return { history: [] }; } }
    _saveStore() { try { localStorage.setItem(LS + this.cfg.id, JSON.stringify(this.store)); } catch (e) { /* ignore quota / privacy errors */ } }
    saveSession() { if (this.session && !this.session.finished) { this.store.session = this.session; this._saveStore(); } }
    clearSession() { delete this.store.session; this._saveStore(); }

    // ── start screen ────────────────────────────────────────────────────
    renderStart() {
      this.screen = 'start';
      this._stopTimer();
      const cfg = this.cfg;
      const root = this.root;
      root.innerHTML = '';

      const sources = {};
      const units = {};
      const types = {};
      for (const q of this.questions) {
        sources[q.source.label] = sources[q.source.label] || { n: 0, kind: q.source.kind, inScope: 0 };
        sources[q.source.label].n++;
        if (q.inScope) sources[q.source.label].inScope++;
        const uk = q.unit != null ? q.unit : 'none';
        units[uk] = (units[uk] || 0) + 1;
        types[q.type] = (types[q.type] || 0) + 1;
      }
      const outOfScope = this.questions.filter(q => !q.inScope).length;
      const saved = this.store.session && !this.store.session.finished ? this.store.session : null;
      // Preferences store *exclusions* so anything added to the banks later defaults to selected.
      const prefs = Object.assign({ mode: 'practice', scopeOnly: true, shuffle: true, count: 'all', sourcesOff: [], unitsOff: [], typesOff: [] }, this.store.prefs || {});
      const minus = (all, off) => new Set(all.filter(k => !off.includes(k)));
      const form = { mode: prefs.mode, scopeOnly: !!cfg.scope && prefs.scopeOnly, shuffle: prefs.shuffle, count: prefs.count,
        sources: minus(Object.keys(sources), prefs.sourcesOff), units: minus(Object.keys(units).map(String), prefs.unitsOff.map(String)), types: minus(Object.keys(types), prefs.typesOff) };

      const countEl = h('span', { class: 'pe-count-num' });
      const updateCount = () => {
        const n = this._selectQuestions(form).length;
        countEl.textContent = n;
        startBtn.disabled = n === 0;
        startBtn.textContent = n ? (form.mode === 'exam' ? `Start exam simulation` : `Start practising`) : 'No questions match';
      };

      const modeCard = (id, title, desc, icon) => {
        const el = h('button', { type: 'button', class: 'pe-mode' + (form.mode === id ? ' is-selected' : ''), 'aria-pressed': form.mode === id, onClick: () => {
          form.mode = id;
          modeWrap.querySelectorAll('.pe-mode').forEach(m => { m.classList.toggle('is-selected', m === el); m.setAttribute('aria-pressed', m === el); });
          // an exam simulation defaults to the real test's length
          if (id === 'exam' && form.count === 'all') { form.count = String(examN); const sel = root.querySelector('.pe-select'); if (sel) sel.value = form.count; }
          updateCount();
        } },
          h('span', { class: 'pe-mode-icon', text: icon }), h('span', { class: 'pe-mode-title', text: title }), h('span', { class: 'pe-mode-desc', text: desc }));
        return el;
      };
      const examN = cfg.exam && cfg.exam.questions ? cfg.exam.questions : 40;
      const examM = cfg.exam && cfg.exam.minutes ? cfg.exam.minutes : 80;
      const modeWrap = h('div', { class: 'pe-modes' },
        modeCard('practice', 'Practice', 'Instant feedback and an explanation after every question. Untimed.', '✎'),
        modeCard('exam', 'Exam simulation', `Timed like the real test (${examM} min). No feedback until you finish.`, '⏱'));

      const chip = (label, set, key, sub) => {
        const b = h('button', { type: 'button', class: 'pe-chip' + (set.has(key) ? ' is-on' : ''), 'aria-pressed': set.has(key), onClick: () => { if (set.has(key)) set.delete(key); else set.add(key); b.classList.toggle('is-on', set.has(key)); b.setAttribute('aria-pressed', set.has(key)); updateCount(); } }, label, sub ? h('span', { class: 'pe-chip-sub', text: sub }) : null);
        return b;
      };

      const unitKeys = Object.keys(units).sort((a, b) => (a === 'none') - (b === 'none') || Number(a) - Number(b));
      const typeLabel = { mc: 'Multiple choice', multi: 'Select all that apply', numeric: 'Numeric', graph: 'Graph drawing' };

      const scopeToggle = cfg.scope ? h('label', { class: 'pe-switch' },
        h('input', { type: 'checkbox', checked: form.scopeOnly, onChange: (e) => { form.scopeOnly = e.target.checked; updateCount(); } }),
        h('span', { class: 'pe-switch-track' }),
        h('span', { class: 'pe-switch-label' }, `Only ${cfg.scope.label} material`, h('span', { class: 'pe-muted' }, outOfScope ? ` — hides ${outOfScope} question${outOfScope === 1 ? '' : 's'} on topics the test doesn't cover` : ''))) : null;

      const startBtn = h('button', { type: 'button', class: 'pe-btn pe-btn-primary pe-btn-lg', onClick: () => {
        const off = (all, on) => all.filter(k => !on.has(k));
        this.store.prefs = { mode: form.mode, scopeOnly: form.scopeOnly, shuffle: form.shuffle, count: form.count,
          sourcesOff: off(Object.keys(sources), form.sources), unitsOff: off(Object.keys(units).map(String), form.units), typesOff: off(Object.keys(types), form.types) };
        this._saveStore(); this.startSession(form); } });

      const hist = (this.store.history || []).slice(-6).reverse();

      root.appendChild(h('div', { class: 'pe-shell pe-start' },
        h('header', { class: 'pe-topbar' },
          h('a', { class: 'pe-back', href: cfg.homeHref, 'aria-label': 'Back to study hub' }, '←', h('span', { text: ' Study Hub' })),
          h('div', { class: 'pe-topbar-title' }, h('span', { class: 'pe-course', text: cfg.course || '' }), h('span', { class: 'pe-topbar-sep' }), h('span', { text: cfg.title }))),
        h('main', { class: 'pe-stage' },
          h('section', { class: 'pe-card pe-card-start' },
            h('div', { class: 'pe-hero' },
              h('span', { class: 'pe-eyebrow', text: (cfg.course || '') + (cfg.courseTitle ? ' · ' + cfg.courseTitle : '') }),
              h('h1', { class: 'pe-title', text: cfg.title }),
              cfg.subtitle ? h('p', { class: 'pe-subtitle', text: cfg.subtitle }) : null,
              cfg.scope && cfg.scope.note ? h('p', { class: 'pe-note', html: md(cfg.scope.note) }) : null),

            h('div', { class: 'pe-stats' },
              h('div', { class: 'pe-stat' }, h('b', { text: this.questions.length }), h('span', { text: 'questions in the bank' })),
              ...Object.entries(sources).map(([label, s]) => h('div', { class: 'pe-stat' }, h('b', { text: s.n }), h('span', {}, h('span', { class: 'pe-badge pe-badge-' + (s.kind || 'custom'), text: label })))),
              types.graph ? h('div', { class: 'pe-stat' }, h('b', { text: types.graph }), h('span', { text: 'graph-drawing drills' })) : null),

            saved ? h('div', { class: 'pe-resume' },
              h('div', {}, h('b', { text: 'Resume your last session?' }), h('span', { class: 'pe-muted', text: ` ${saved.mode === 'exam' ? 'Exam simulation' : 'Practice'} · ${Object.keys(saved.answers).length}/${saved.order.length} answered · started ${fmtDate(saved.createdAt)}` })),
              h('div', { class: 'pe-resume-actions' },
                h('button', { type: 'button', class: 'pe-btn pe-btn-primary', onClick: () => this.resumeSession() }, 'Resume'),
                h('button', { type: 'button', class: 'pe-btn pe-btn-ghost', onClick: () => { this.clearSession(); this.renderStart(); } }, 'Discard'))) : null,

            h('h2', { class: 'pe-h2', text: 'Mode' }),
            modeWrap,

            h('h2', { class: 'pe-h2', text: 'Questions' }),
            scopeToggle,
            h('div', { class: 'pe-field' }, h('span', { class: 'pe-field-label', text: 'Sources' }),
              h('div', { class: 'pe-chips' }, ...Object.entries(sources).map(([label, s]) => chip(label, form.sources, label, String(s.n))))),
            h('div', { class: 'pe-field' }, h('span', { class: 'pe-field-label', text: 'Units' }),
              h('div', { class: 'pe-chips' }, ...unitKeys.map(u => chip(u === 'none' ? 'General' : `Unit ${u} · ${this.unitName(Number(u))}`, form.units, String(u), String(units[u]))))),
            h('div', { class: 'pe-field' }, h('span', { class: 'pe-field-label', text: 'Question types' }),
              h('div', { class: 'pe-chips' }, ...Object.keys(types).map(t => chip(typeLabel[t] || t, form.types, t, String(types[t]))))),
            h('div', { class: 'pe-field pe-field-row' },
              h('label', { class: 'pe-select-wrap' }, h('span', { class: 'pe-field-label', text: 'How many' }),
                h('select', { class: 'pe-select', onChange: (e) => { form.count = e.target.value; updateCount(); } },
                  ...['all', '10', '20', String(examN)].filter((v, i, a) => a.indexOf(v) === i).map(v => h('option', { value: v, selected: form.count === v, text: v === 'all' ? 'All matching' : v })))),
              h('label', { class: 'pe-switch' },
                h('input', { type: 'checkbox', checked: form.shuffle, onChange: (e) => { form.shuffle = e.target.checked; } }),
                h('span', { class: 'pe-switch-track' }), h('span', { class: 'pe-switch-label', text: 'Shuffle order' }))),

            h('div', { class: 'pe-start-actions' },
              h('span', { class: 'pe-count' }, countEl, ' questions selected'),
              startBtn),

            hist.length ? h('div', { class: 'pe-history' },
              h('h2', { class: 'pe-h2', text: 'Recent attempts' }),
              h('ul', {}, ...hist.map(a => h('li', {},
                h('span', { class: 'pe-history-score ' + (a.pct >= 80 ? 'is-good' : a.pct >= 60 ? 'is-ok' : 'is-low'), text: a.pct + '%' }),
                h('span', { text: `${a.correct}/${a.total} · ${a.mode === 'exam' ? 'Exam' : 'Practice'} · ${fmtDate(a.at)}` }))))) : null,

            h('p', { class: 'pe-kbd-help' }, 'Keyboard: ', h('kbd', 'A'), '–', h('kbd', 'E'), ' or ', h('kbd', '1'), '–', h('kbd', '5'), ' choose · ', h('kbd', 'Enter'), ' check / next · ', h('kbd', '←'), h('kbd', '→'), ' navigate · ', h('kbd', 'F'), ' flag')))));
      updateCount();
    }

    _selectQuestions(form) {
      return this.questions.filter(q =>
        (!form.scopeOnly || q.inScope) &&
        form.sources.has(q.source.label) &&
        form.units.has(String(q.unit != null ? q.unit : 'none')) &&
        form.types.has(q.type));
    }

    // ── session lifecycle ───────────────────────────────────────────────
    startSession(form, idsOverride) {
      let qs = idsOverride ? idsOverride.map(id => this.byId[id]).filter(Boolean) : this._selectQuestions(form);
      const seed = Date.now() & 0xffffffff;
      const rng = mulberry32(seed);
      if (form.shuffle) qs = this._shuffleKeepingScenarios(qs, rng);
      if (form.count !== 'all') qs = qs.slice(0, Number(form.count));
      const examM = this.cfg.exam && this.cfg.exam.minutes ? this.cfg.exam.minutes : 80;
      const examN = this.cfg.exam && this.cfg.exam.questions ? this.cfg.exam.questions : 40;
      this.session = {
        id: 's' + seed.toString(36), createdAt: Date.now(), mode: form.mode, seed,
        order: qs.map(q => q.id), index: 0, answers: {}, flags: {},
        optionOrder: {},   // qid → shuffled option ids (when the question allows it)
        timeLimit: form.mode === 'exam' ? Math.round(examM * 60 * qs.length / examN) : null,
        elapsed: 0, finished: false
      };
      for (const q of qs) if (q.shuffleOptions && q.options) this.session.optionOrder[q.id] = shuffle(q.options.map(o => o.id), rng);
      this._scenarioCollapsed = {};
      this.saveSession();
      this.renderQuiz();
    }

    // Shuffle questions but keep questions that share a scenario adjacent (like the real test).
    _shuffleKeepingScenarios(qs, rng) {
      const groups = [], seen = {};
      for (const q of qs) {
        const key = q.scenarioKey || ('solo:' + q.id);
        if (!seen[key]) { seen[key] = []; groups.push(seen[key]); }
        seen[key].push(q);
      }
      return shuffle(groups, rng).flat();
    }

    resumeSession() {
      this.session = this.store.session;
      this._scenarioCollapsed = {};
      this.renderQuiz();
    }

    // ── quiz screen ─────────────────────────────────────────────────────
    renderQuiz() {
      this.screen = 'quiz';
      const s = this.session;
      const root = this.root;
      root.innerHTML = '';
      this.paletteOpen = false;

      this.progressEl = h('div', { class: 'pe-progress-bar' });
      this.counterEl = h('span', { class: 'pe-counter' });
      this.timerEl = s.mode === 'exam' && !s.review ? h('span', { class: 'pe-timer', role: 'timer' }) : null;
      this.paletteBtn = h('button', { type: 'button', class: 'pe-btn pe-btn-ghost pe-btn-sm', onClick: () => this.togglePalette() }, 'Questions');
      this.paletteEl = h('div', { class: 'pe-palette', hidden: true });
      this.stageEl = h('main', { class: 'pe-stage' });

      root.appendChild(h('div', { class: 'pe-shell pe-quiz' },
        h('header', { class: 'pe-topbar' },
          h('button', { type: 'button', class: 'pe-back', onClick: () => this.confirmExit(), 'aria-label': 'Exit to start screen' }, '←', h('span', { text: ' Exit' })),
          h('div', { class: 'pe-topbar-title' }, h('span', { class: 'pe-course', text: this.cfg.course || '' }), h('span', { class: 'pe-topbar-sep' }), h('span', { text: this.cfg.title })),
          h('div', { class: 'pe-topbar-right' }, this.timerEl, this.counterEl, this.paletteBtn),
          h('div', { class: 'pe-progress' }, this.progressEl)),
        this.paletteEl,
        this.stageEl));

      this.renderQuestion(0);
      if (s.mode === 'exam' && s.timeLimit && !s.review) this._startTimer();
    }

    _startTimer() {
      this._stopTimer();
      const s = this.session;
      this._tickAt = Date.now();
      const tick = () => {
        const now = Date.now();
        s.elapsed += (now - this._tickAt) / 1000;
        this._tickAt = now;
        const left = s.timeLimit - s.elapsed;
        if (this.timerEl) {
          this.timerEl.textContent = fmtTime(left);
          this.timerEl.classList.toggle('is-warn', left <= 300);
          this.timerEl.classList.toggle('is-danger', left <= 60);
        }
        if (left <= 0) { this._stopTimer(); this.finish(true); return; }
        if (Math.round(s.elapsed) % 15 === 0) this.saveSession();
      };
      tick();
      this._timer = setInterval(tick, 1000);
    }
    _stopTimer() { if (this._timer) { clearInterval(this._timer); this._timer = null; } }

    currentQuestion() { return this.byId[this.session.order[this.session.index]]; }
    // Feedback is shown immediately in practice mode, and for every question when reviewing a finished session.
    showsFeedback() { const s = this.session; return s.mode === 'practice' || !!s.review; }

    renderQuestion(dir) {
      const s = this.session;
      const q = this.currentQuestion();
      if (!q) return;
      const total = s.order.length;
      const answered = Object.keys(s.answers).filter(id => s.order.includes(id)).length;
      this.progressEl.style.width = pct(answered, total) + '%';
      this.counterEl.textContent = `${s.index + 1} / ${total}`;
      if (this.paletteOpen) this._renderPalette();

      const old = this.stageEl.querySelector('.pe-card');
      const card = this._buildQuestionCard(q);
      const swap = () => {
        if (this.graph) { this.graph.destroy(); this.graph = null; }
        this.stageEl.innerHTML = '';
        this.stageEl.appendChild(card);
        this._mountQuestionWidgets(q, card);
        if (ANIM_MS) { card.classList.add(dir < 0 ? 'pe-enter-left' : 'pe-enter-right'); const clear = () => card.classList.remove('pe-enter-left', 'pe-enter-right'); requestAnimationFrame(() => requestAnimationFrame(clear)); setTimeout(clear, 80); }
        const focusTarget = card.querySelector('.pe-option, .pe-input, .pe-btn-primary');
        if (focusTarget && !('ontouchstart' in window)) focusTarget.focus({ preventScroll: true });
        this.stageEl.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      };
      if (old && ANIM_MS) {
        old.classList.add(dir < 0 ? 'pe-exit-right' : 'pe-exit-left');
        setTimeout(swap, ANIM_MS);
      } else swap();
    }

    _optionsFor(q) {
      const order = this.session.optionOrder[q.id];
      if (!order) return q.options;
      return order.map(id => q.options.find(o => o.id === id)).filter(Boolean);
    }

    _buildQuestionCard(q) {
      const s = this.session;
      const a = s.answers[q.id];
      const locked = this.showsFeedback() && a && a.checked;
      const meta = h('div', { class: 'pe-meta' },
        h('span', { class: 'pe-badge pe-badge-' + (q.source.kind || 'custom'), title: KIND_LABEL[q.source.kind] || '' }, this.sourceText(q)),
        q.unit != null ? h('span', { class: 'pe-badge pe-badge-unit' }, `Unit ${q.unit}${q.topic ? ' · ' + q.topic : ''}`) : (q.topic ? h('span', { class: 'pe-badge pe-badge-unit' }, q.topic) : null),
        !q.inScope && this.cfg.scope ? h('span', { class: 'pe-badge pe-badge-warn', title: q.scopeNote || '' }, `Not on ${this.cfg.scope.label}`) : null,
        h('button', { type: 'button', class: 'pe-flag' + (s.flags[q.id] ? ' is-on' : ''), 'aria-pressed': !!s.flags[q.id], title: 'Flag for review (F)', onClick: (e) => this.toggleFlag(e.currentTarget) }, '⚑', h('span', { class: 'pe-sr', text: 'Flag' })));

      const scenario = q.scenarioKey ? this._buildScenario(this.scenarios[q.scenarioKey]) : null;
      const figure = q.figure ? this._buildFigure(q.figure) : null;
      const prompt = h('div', { class: 'pe-prompt', html: md(q.prompt) });

      let answerArea;
      if (q.type === 'mc' || q.type === 'multi') {
        const multi = q.type === 'multi';
        const chosen = a ? (multi ? new Set(a.response || []) : a.response) : (multi ? new Set() : null);
        answerArea = h('div', { class: 'pe-options', role: multi ? 'group' : 'radiogroup' },
          ...this._optionsFor(q).map((o, i) => {
            const sel = multi ? chosen.has(o.id) : chosen === o.id;
            const btn = h('button', { type: 'button', class: 'pe-option' + (sel ? ' is-selected' : ''), role: multi ? 'checkbox' : 'radio', 'aria-checked': sel, dataset: { id: o.id }, disabled: locked, onClick: () => this.selectOption(q, o.id) },
              h('span', { class: 'pe-option-key', text: LETTERS[i].toUpperCase() }),
              h('span', { class: 'pe-option-text', html: md(o.text) }));
            return btn;
          }));
        if (multi) answerArea = h('div', {}, h('p', { class: 'pe-muted pe-small', text: 'Select all that apply.' }), answerArea);
      } else if (q.type === 'numeric') {
        const ans = q.answer || {};
        answerArea = h('div', { class: 'pe-numeric' },
          ans.prefix ? h('span', { class: 'pe-affix', text: ans.prefix }) : null,
          h('input', { class: 'pe-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', placeholder: ans.placeholder || 'Your answer', value: a ? a.response : '', disabled: locked, 'aria-label': 'Numeric answer', onInput: (e) => this.setResponse(q, e.target.value, false), onKeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); this.primaryAction(); } } }),
          ans.suffix ? h('span', { class: 'pe-affix', text: ans.suffix }) : null,
          ans.hint ? h('span', { class: 'pe-muted pe-small pe-inline-md', html: md(ans.hint) }) : null);
      } else if (q.type === 'graph') {
        answerArea = h('div', { class: 'pe-graph-wrap' }, h('div', { class: 'pe-graph' }));
      } else {
        answerArea = h('p', { class: 'pe-error-inline', text: `Unsupported question type "${q.type}".` });
      }

      const feedback = h('div', { class: 'pe-feedback', hidden: true });
      const actions = h('div', { class: 'pe-actions' },
        h('button', { type: 'button', class: 'pe-btn pe-btn-ghost', disabled: s.index === 0, onClick: () => this.go(-1) }, '← Previous'),
        h('div', { class: 'pe-actions-right' },
          h('button', { type: 'button', class: 'pe-btn pe-btn-primary pe-primary-action', onClick: () => this.primaryAction() }, 'Check')));

      const card = h('article', { class: 'pe-card pe-card-q', dataset: { qid: q.id } },
        meta, scenario, figure, prompt, answerArea, feedback, actions);
      this._refreshPrimary(card, q);
      if (locked) this._showFeedback(card, q, a);
      return card;
    }

    _buildScenario(sc) {
      if (!sc) return null;
      const key = sc.id;
      const body = h('div', { class: 'pe-scenario-body' },
        sc.body ? h('div', { html: md(sc.body) }) : null,
        sc.table ? this._buildTable(sc.table) : null,
        sc.figure ? this._buildFigure(sc.figure) : null);
      const det = h('details', { class: 'pe-scenario', open: !this._scenarioCollapsed[key] },
        h('summary', {}, h('span', { class: 'pe-scenario-tag', text: 'Scenario' }), h('span', { class: 'pe-scenario-title', text: sc.title || 'Refer to the following information' }), h('span', { class: 'pe-scenario-toggle', 'aria-hidden': true })),
        body);
      det.addEventListener('toggle', () => { this._scenarioCollapsed[key] = !det.open; });
      return det;
    }

    _buildTable(t) {
      return h('div', { class: 'pe-table-wrap' },
        t.caption ? h('div', { class: 'pe-table-caption', text: t.caption }) : null,
        h('table', { class: 'pe-table' },
          t.headers ? h('thead', {}, h('tr', {}, ...t.headers.map(x => h('th', { html: md(String(x)) })))) : null,
          h('tbody', {}, ...(t.rows || []).map(r => h('tr', {}, ...r.map((c, i) => h(i === 0 && t.rowHeaders ? 'th' : 'td', { html: md(String(c)) })))))));
    }

    _buildFigure(f) {
      if (!f) return null;
      if (f.type === 'image') return h('figure', { class: 'pe-figure' }, h('img', { src: f.src, alt: f.alt || '' }), f.caption ? h('figcaption', { text: f.caption }) : null);
      if (f.type === 'table') return this._buildTable(f);
      if (f.type === 'graph') return h('figure', { class: 'pe-figure pe-figure-graph' }, h('div', { class: 'pe-static-graph', dataset: { spec: JSON.stringify(f.spec || {}) } }), f.caption ? h('figcaption', { text: f.caption }) : null);
      return null;
    }

    _mountQuestionWidgets(q, card) {
      // static graphs
      card.querySelectorAll('.pe-static-graph').forEach(el => {
        try { new global.EconGraph(el, JSON.parse(el.dataset.spec), { interactive: false }); } catch (e) { el.textContent = 'Figure could not be rendered.'; }
      });
      if (q.type === 'graph') {
        const s = this.session, a = s.answers[q.id];
        const locked = this.showsFeedback() && a && a.checked;
        const host = card.querySelector('.pe-graph');
        this.graph = new global.EconGraph(host, q.graph, {
          interactive: true, showTasks: true, drawings: a ? a.response : null,
          onChange: (d) => this.setResponse(q, d, false)
        });
        if (locked) { this.graph.lock(); this.graph.showModel(); }
      }
    }

    _refreshPrimary(card, q) {
      const s = this.session;
      const btn = card.querySelector('.pe-primary-action');
      const a = s.answers[q.id];
      const last = s.index === s.order.length - 1;
      const has = a && this._hasResponse(q, a.response);
      if (s.review) { btn.textContent = last ? 'Back to results' : 'Next →'; btn.disabled = false; return; }
      if (s.mode === 'practice') {
        if (a && a.checked) btn.textContent = last ? 'Finish →' : 'Next →';
        else btn.textContent = 'Check answer';
        btn.disabled = !(a && a.checked) && !has;
        btn.classList.toggle('pe-btn-primary', true);
      } else {
        btn.textContent = last ? 'Finish exam' : 'Next →';
        btn.disabled = false;
      }
    }

    _hasResponse(q, r) {
      if (r == null) return false;
      if (q.type === 'multi') return Array.isArray(r) && r.length > 0;
      if (q.type === 'numeric') return String(r).trim() !== '';
      if (q.type === 'graph') return r && Object.keys(r).length > 0;
      return true;
    }

    // ── responses & grading ─────────────────────────────────────────────
    selectOption(q, id) {
      const s = this.session;
      const a = s.answers[q.id];
      if (s.review || (s.mode === 'practice' && a && a.checked)) return;
      let resp;
      if (q.type === 'multi') {
        const set = new Set(a && Array.isArray(a.response) ? a.response : []);
        if (set.has(id)) set.delete(id); else set.add(id);
        resp = [...set];
      } else resp = id;
      this.setResponse(q, resp, true);
    }

    setResponse(q, resp, rerender) {
      const s = this.session;
      if (s.review || s.finished) return;
      const prev = s.answers[q.id] || {};
      const entry = Object.assign({}, prev, { response: resp, at: Date.now(), checked: !!prev.checked });
      entry.graded = this.grade(q, resp);
      s.answers[q.id] = entry;
      this.saveSession();
      const card = this.stageEl.querySelector('.pe-card');
      if (card && (q.type === 'mc' || q.type === 'multi') && rerender) {
        card.querySelectorAll('.pe-option').forEach(o => {
          const sel = q.type === 'multi' ? resp.includes(o.dataset.id) : resp === o.dataset.id;
          o.classList.toggle('is-selected', sel); o.setAttribute('aria-checked', sel);
        });
      }
      if (card) this._refreshPrimary(card, q);
      if (s.mode === 'exam') { const answered = Object.keys(s.answers).length; this.progressEl.style.width = pct(answered, s.order.length) + '%'; }
    }

    grade(q, resp) {
      if (!this._hasResponse(q, resp)) return { correct: false, empty: true };
      if (q.type === 'mc') return { correct: resp === q.answer };
      if (q.type === 'multi') {
        const want = new Set(Array.isArray(q.answer) ? q.answer : [q.answer]);
        const got = new Set(resp);
        return { correct: want.size === got.size && [...want].every(x => got.has(x)) };
      }
      if (q.type === 'numeric') {
        const ans = q.answer || {};
        const n = parseNumber(resp);
        if (!isFinite(n)) return { correct: false, invalid: true };
        const targets = [ans.value].concat(ans.accept || []).filter(v => v != null);
        const ok = targets.some(v => {
          const tol = ans.tolerancePct != null ? Math.abs(v) * ans.tolerancePct / 100 : (ans.tolerance != null ? ans.tolerance : 0.01);
          return Math.abs(n - v) <= tol + 1e-9;
        });
        return { correct: ok, value: n };
      }
      if (q.type === 'graph') {
        try { const r = global.EconGraph.gradeDrawings(q.graph, resp); return { correct: r.ok, results: r.results }; }
        catch (e) { return { correct: false, error: String(e) }; }
      }
      return { correct: false };
    }

    primaryAction() {
      const s = this.session;
      const q = this.currentQuestion();
      const a = s.answers[q.id];
      if (s.review) { if (s.index === s.order.length - 1) this.renderResults(); else this.go(1); return; }
      if (s.mode === 'practice') {
        if (!(a && a.checked)) { this.checkCurrent(); return; }
      }
      if (s.index === s.order.length - 1) this.finish(false);
      else this.go(1);
    }

    checkCurrent() {
      const s = this.session;
      const q = this.currentQuestion();
      const a = s.answers[q.id];
      if (!a || !this._hasResponse(q, a.response)) return;
      a.checked = true;
      a.graded = this.grade(q, a.response);
      this.saveSession();
      const card = this.stageEl.querySelector('.pe-card');
      card.querySelectorAll('.pe-option, .pe-input').forEach(el => el.disabled = true);
      if (this.graph) { this.graph.lock(); this.graph.showModel(); }
      this._showFeedback(card, q, a);
      this._refreshPrimary(card, q);
      const btn = card.querySelector('.pe-primary-action');
      if (btn) btn.focus({ preventScroll: true });
      const answered = Object.keys(s.answers).length;
      this.progressEl.style.width = pct(answered, s.order.length) + '%';
    }

    _showFeedback(card, q, a) {
      const fb = card.querySelector('.pe-feedback');
      const g = a.graded || this.grade(q, a.response);
      fb.innerHTML = '';
      fb.hidden = false;
      fb.className = 'pe-feedback ' + (g.correct ? 'is-correct' : 'is-wrong');
      const head = h('div', { class: 'pe-feedback-head' }, h('span', { class: 'pe-feedback-icon', text: g.correct ? '✓' : '✕' }), h('b', { text: g.correct ? 'Correct' : 'Not quite' }));
      fb.appendChild(head);
      if (q.type === 'mc' || q.type === 'multi') {
        const want = new Set(Array.isArray(q.answer) ? q.answer : [q.answer]);
        const got = new Set(q.type === 'multi' ? (a.response || []) : [a.response]);
        card.querySelectorAll('.pe-option').forEach(o => {
          const id = o.dataset.id;
          if (want.has(id)) o.classList.add('is-correct');
          else if (got.has(id)) o.classList.add('is-wrong');
        });
        if (!g.correct) {
          const opts = this._optionsFor(q);
          const letters = opts.map((o, i) => want.has(o.id) ? LETTERS[i].toUpperCase() : null).filter(Boolean);
          fb.appendChild(h('p', { class: 'pe-feedback-answer' }, `Correct answer: ${letters.join(', ')}`));
        }
      } else if (q.type === 'numeric') {
        const ans = q.answer || {};
        const shown = ans.display != null ? ans.display : `${ans.prefix || ''}${ans.value}${ans.suffix || ''}`;
        if (g.invalid) fb.appendChild(h('p', { class: 'pe-feedback-answer', text: 'Your entry was not a number. ' + `Correct answer: ${shown}` }));
        else if (!g.correct) fb.appendChild(h('p', { class: 'pe-feedback-answer', text: `Correct answer: ${shown}` }));
      } else if (q.type === 'graph' && g.results) {
        fb.appendChild(h('ul', { class: 'pe-task-results' }, ...g.results.map(r => h('li', { class: r.ok ? 'is-ok' : 'is-bad' }, h('span', { class: 'pe-task-mark', text: r.ok ? '✓' : '✕' }), h('span', { html: md(r.message) })))));
        if (!g.correct) fb.appendChild(h('p', { class: 'pe-muted pe-small', text: 'The dashed green lines/points show a model answer.' }));
      }
      if (q.explanation) fb.appendChild(h('div', { class: 'pe-explanation', html: md(q.explanation) }));
      if (q.source && q.source.note) fb.appendChild(h('p', { class: 'pe-muted pe-small', html: md(q.source.note) }));
      if (ANIM_MS) { fb.classList.add('pe-pop'); }
      const bad = card.querySelector('.pe-option.is-wrong');
      if (bad && ANIM_MS) bad.classList.add('pe-shake');
    }

    toggleFlag(btn) {
      const s = this.session, q = this.currentQuestion();
      s.flags[q.id] = !s.flags[q.id];
      if (!s.flags[q.id]) delete s.flags[q.id];
      const b = btn || this.stageEl.querySelector('.pe-flag');
      if (b) { b.classList.toggle('is-on', !!s.flags[q.id]); b.setAttribute('aria-pressed', !!s.flags[q.id]); }
      this.saveSession();
      if (this.paletteOpen) this._renderPalette();
    }

    go(delta) {
      const s = this.session;
      const next = s.index + delta;
      if (next < 0 || next >= s.order.length) return;
      s.index = next;
      this.saveSession();
      this.renderQuestion(delta);
    }
    goTo(i) {
      const s = this.session;
      if (i < 0 || i >= s.order.length || i === s.index) return;
      const dir = i > s.index ? 1 : -1;
      s.index = i;
      this.saveSession();
      this.renderQuestion(dir);
    }

    togglePalette() {
      this.paletteOpen = !this.paletteOpen;
      this.paletteEl.hidden = !this.paletteOpen;
      this.paletteBtn.classList.toggle('is-on', this.paletteOpen);
      if (this.paletteOpen) this._renderPalette();
    }
    _renderPalette() {
      const s = this.session;
      this.paletteEl.innerHTML = '';
      const grid = h('div', { class: 'pe-palette-grid' }, ...s.order.map((id, i) => {
        const a = s.answers[id];
        let cls = 'pe-pal';
        if (i === s.index) cls += ' is-current';
        if (a && this._hasResponse(this.byId[id], a.response)) {
          cls += ' is-answered';
          if (this.showsFeedback() && a.checked) cls += a.graded && a.graded.correct ? ' is-correct' : ' is-wrong';
        }
        if (s.flags[id]) cls += ' is-flagged';
        return h('button', { type: 'button', class: cls, onClick: () => { this.goTo(i); this.togglePalette(); }, 'aria-label': `Question ${i + 1}` }, String(i + 1));
      }));
      const unanswered = s.order.filter(id => !(s.answers[id] && this._hasResponse(this.byId[id], s.answers[id].response))).length;
      this.paletteEl.appendChild(grid);
      this.paletteEl.appendChild(h('div', { class: 'pe-palette-foot' },
        h('span', { class: 'pe-muted pe-small', text: `${unanswered} unanswered · ${Object.keys(s.flags).length} flagged` }),
        s.review
          ? h('button', { type: 'button', class: 'pe-btn pe-btn-primary pe-btn-sm', onClick: () => this.renderResults() }, 'Back to results')
          : h('button', { type: 'button', class: 'pe-btn pe-btn-primary pe-btn-sm', onClick: () => this.finish(false) }, s.mode === 'exam' ? 'Submit exam' : 'Finish & see results')));
    }

    confirmExit() {
      if (confirm('Leave this session? Your progress is saved and you can resume it from the start screen.')) { this._stopTimer(); this.renderStart(); }
    }

    // ── finish & results ────────────────────────────────────────────────
    finish(auto) {
      const s = this.session;
      if (s.finished) { this.renderResults(); return; }
      const unanswered = s.order.filter(id => !(s.answers[id] && this._hasResponse(this.byId[id], s.answers[id].response))).length;
      if (!auto && unanswered > 0 && !confirm(`You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Finish anyway?`)) return;
      this._stopTimer();
      for (const id of s.order) {
        const q = this.byId[id];
        const a = s.answers[id] || (s.answers[id] = { response: null, at: Date.now() });
        a.checked = true;
        a.graded = this.grade(q, a.response);
      }
      s.finished = true;
      s.finishedAt = Date.now();
      const correct = s.order.filter(id => s.answers[id].graded.correct).length;
      this.store.history = (this.store.history || []).concat([{ at: s.finishedAt, mode: s.mode, correct, total: s.order.length, pct: pct(correct, s.order.length), elapsed: Math.round(s.elapsed) }]).slice(-30);
      this.store.lastResult = s;
      this.clearSession();
      this.renderResults();
    }

    renderResults() {
      this.screen = 'results';
      const s = this.session;
      const root = this.root;
      root.innerHTML = '';
      const total = s.order.length;
      const correct = s.order.filter(id => s.answers[id].graded.correct).length;
      const p = pct(correct, total);
      const missed = s.order.filter(id => !s.answers[id].graded.correct);

      const byUnit = {}, bySource = {}, byType = {};
      for (const id of s.order) {
        const q = this.byId[id], ok = s.answers[id].graded.correct;
        const bump = (m, k) => { m[k] = m[k] || { n: 0, ok: 0 }; m[k].n++; if (ok) m[k].ok++; };
        bump(byUnit, q.unit != null ? q.unit : 'none');
        bump(bySource, q.source.label);
        bump(byType, q.type);
      }
      const breakdown = (title, map, labelFn) => h('div', { class: 'pe-breakdown' },
        h('h3', { text: title }),
        ...Object.keys(map).sort((a, b) => (a === 'none') - (b === 'none') || (isNaN(a) ? a.localeCompare(b) : a - b)).map(k => {
          const r = map[k], pp = pct(r.ok, r.n);
          return h('div', { class: 'pe-bd-row' },
            h('span', { class: 'pe-bd-label', text: labelFn(k) }),
            h('span', { class: 'pe-bd-bar' }, h('span', { class: 'pe-bd-fill ' + (pp >= 80 ? 'is-good' : pp >= 60 ? 'is-ok' : 'is-low'), style: { width: pp + '%' } })),
            h('span', { class: 'pe-bd-num', text: `${r.ok}/${r.n}` }));
        }));

      const ring = (() => {
        const r = 52, c = 2 * Math.PI * r;
        const wrap = h('div', { class: 'pe-ring ' + (p >= 80 ? 'is-good' : p >= 60 ? 'is-ok' : 'is-low') });
        wrap.innerHTML = `<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="pe-ring-bg" cx="60" cy="60" r="${r}"/><circle class="pe-ring-fg" cx="60" cy="60" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}"/></svg>`;
        wrap.appendChild(h('div', { class: 'pe-ring-text' }, h('b', { text: '0%' }), h('span', { text: `${correct} / ${total}` })));
        requestAnimationFrame(() => {
          const fg = wrap.querySelector('.pe-ring-fg');
          fg.style.strokeDashoffset = c * (1 - p / 100);
          const b = wrap.querySelector('b');
          const t0 = performance.now(), dur = REDUCED ? 0 : 900;
          const step = (t) => { const k = dur ? Math.min(1, (t - t0) / dur) : 1; b.textContent = Math.round(p * (1 - Math.pow(1 - k, 3))) + '%'; if (k < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
          setTimeout(() => { b.textContent = p + '%'; }, dur + 50); // rAF can be throttled in background tabs
        });
        return wrap;
      })();

      const typeLabel = { mc: 'Multiple choice', multi: 'Select all', numeric: 'Numeric', graph: 'Graph drawing' };
      const verdict = p >= 90 ? 'Excellent — you are in great shape.' : p >= 80 ? 'Strong. Review the misses and you are there.' : p >= 65 ? 'Decent foundation — focus on the weakest units below.' : 'Keep going: work through the missed questions, then retry.';

      root.appendChild(h('div', { class: 'pe-shell pe-results' },
        h('header', { class: 'pe-topbar' },
          h('button', { type: 'button', class: 'pe-back', onClick: () => this.renderStart() }, '←', h('span', { text: ' Start screen' })),
          h('div', { class: 'pe-topbar-title' }, h('span', { class: 'pe-course', text: this.cfg.course || '' }), h('span', { class: 'pe-topbar-sep' }), h('span', { text: 'Results' }))),
        h('main', { class: 'pe-stage' },
          h('section', { class: 'pe-card pe-card-results' },
            h('div', { class: 'pe-results-hero' },
              ring,
              h('div', { class: 'pe-results-text' },
                h('h1', { class: 'pe-title', text: s.mode === 'exam' ? 'Exam simulation complete' : 'Practice complete' }),
                h('p', { class: 'pe-subtitle', text: verdict }),
                h('p', { class: 'pe-muted pe-small', text: `${s.mode === 'exam' ? 'Time used: ' + fmtTime(s.elapsed) + ' of ' + fmtTime(s.timeLimit) + ' · ' : ''}${Object.keys(s.flags).length} flagged · ${missed.length} to review` }))),
            h('div', { class: 'pe-results-actions' },
              h('button', { type: 'button', class: 'pe-btn pe-btn-primary', onClick: () => this.startReview(0) }, 'Review all questions'),
              missed.length ? h('button', { type: 'button', class: 'pe-btn', onClick: () => this.startReview(s.order.indexOf(missed[0])) }, `Review ${missed.length} missed`) : null,
              missed.length ? h('button', { type: 'button', class: 'pe-btn', onClick: () => this.startSession({ mode: 'practice', shuffle: true, count: 'all' }, missed) }, 'Retry missed questions') : null,
              h('button', { type: 'button', class: 'pe-btn pe-btn-ghost', onClick: () => this.renderStart() }, 'New session')),
            h('div', { class: 'pe-breakdowns' },
              breakdown('By unit', byUnit, k => k === 'none' ? 'General' : `Unit ${k} · ${this.unitName(Number(k))}`),
              breakdown('By source', bySource, k => k),
              breakdown('By question type', byType, k => typeLabel[k] || k)),
            missed.length ? h('div', { class: 'pe-missed' },
              h('h3', { text: 'Missed questions' }),
              h('ol', {}, ...missed.map(id => { const q = this.byId[id], i = s.order.indexOf(id); return h('li', {}, h('button', { type: 'button', class: 'pe-link', onClick: () => this.startReview(i) }, `Q${i + 1}`), ' ', h('span', { class: 'pe-badge pe-badge-' + (q.source.kind || 'custom'), text: this.sourceText(q) }), ' ', h('span', { class: 'pe-missed-text', html: md(String(q.prompt).slice(0, 140) + (q.prompt.length > 140 ? '…' : '')) })); }))) : null))));
    }

    // Review = walk through the finished session with feedback visible, inputs locked.
    startReview(index) {
      const s = this.session;
      s.index = index;
      s.review = true;
      this.renderQuiz();
      // replace the palette's finish button semantics
      this.paletteBtn.textContent = 'Questions';
      const back = this.root.querySelector('.pe-back');
      back.replaceWith(h('button', { type: 'button', class: 'pe-back', onClick: () => this.renderResults() }, '←', h('span', { text: ' Results' })));
    }

    // ── keyboard ────────────────────────────────────────────────────────
    _onKey(e) {
      if (this.screen !== 'quiz' || !this.session) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const q = this.currentQuestion();
      const k = e.key;
      if (k === 'ArrowRight') { e.preventDefault(); this.go(1); return; }
      if (k === 'ArrowLeft') { e.preventDefault(); this.go(-1); return; }
      if (k === 'Enter') { e.preventDefault(); this.primaryAction(); return; }
      if (k === 'f' || k === 'F') { e.preventDefault(); this.toggleFlag(); return; }
      if ((q.type === 'mc' || q.type === 'multi') && q.options) {
        let idx = -1;
        if (/^[1-9]$/.test(k)) idx = Number(k) - 1;
        else if (/^[a-jA-J]$/.test(k)) idx = LETTERS.indexOf(k.toLowerCase());
        const opts = this._optionsFor(q);
        if (idx >= 0 && idx < opts.length) { e.preventDefault(); this.selectOption(q, opts[idx].id); }
      }
    }
  }

  const PracticeEngine = {
    mount(root, config) { const e = new Engine(root, config); e.init(); return e; },
    _internals: { md, sanitize, parseNumber }
  };
  global.PracticeEngine = PracticeEngine;
})(window);
