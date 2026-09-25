/* site/explain.js — "✦ Explain" on lesson pages (loaded by site/site.js on lesson pages only).
 *
 * Adds an Explain button to each content section and an "Explain" chip when text is highlighted.
 * Both open a panel that streams an answer from POST /api/explain (worker/index.js → Gemini),
 * sending the section's text, the highlighted passage and the chapter's learning objectives as
 * context. Modes: explain deeper · simpler · new example · quiz me, plus free-text follow-ups.
 * The whole feature stays hidden unless GET /api/explain says { ready: true }.
 */
(function () {
  'use strict';
  const ENDPOINT = '/api/explain';
  const main = document.querySelector('main.page');
  if (!document.body.classList.contains('lesson') || !main) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MODES = [
    ['explain', 'Explain deeper'], ['simpler', 'Simpler'], ['example', 'New example'], ['quiz', 'Quiz me']
  ];
  const SKIP = new Set(['practice']); // problem sets: explaining would just give answers away

  fetch(ENDPOINT, { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : null))
    .then(j => { if (j && j.ready) init(); })
    .catch(() => { /* no endpoint (e.g. plain static server) → feature stays hidden */ });

  /* ── page context ── */
  const chapterTitle = () => ($('h1.lesson-title') || {}).textContent || document.title;
  const courseName = () => (($('.course-tag') || {}).textContent || '').replace(/\s+/g, ' ').trim();
  const objectives = () => $$('.objectives-box li').map(li => '- ' + li.textContent.trim()).join('\n');
  function sectionLabel(sec) {
    const n = $('.section-number', sec), h = $('h2', sec);
    const num = n && (n.textContent.match(/\d+/) || [])[0];
    return (num ? '§' + num + ' ' : '') + (h ? h.textContent.trim() : sec.id);
  }
  function sectionText(sec) {
    const c = sec.cloneNode(true);
    $$('.xp-sec, button, script, style', c).forEach(e => e.remove());
    $$('img', c).forEach(i => i.replaceWith(document.createTextNode(`\n[Figure: ${i.alt || 'diagram'}]\n`)));
    $$('p, li, h2, h3, h4, pre, tr, blockquote, figure, .rule-head, .example-label, .callout > strong:first-child', c).forEach(e => e.append('\n'));
    $$('td, th', c).forEach(e => e.append(' | '));
    return c.textContent.replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 16000);
  }

  /* ── tiny, safe Markdown → HTML (input is escaped first) ── */
  function md(src) {
    const inline = s => s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|\W)_([^_\n]+)_(?=\W|$)/g, '$1<em>$2</em>');
    const out = []; let para = [], list = null;
    const flushPara = () => { if (para.length) { out.push('<p>' + para.map(inline).join('<br>') + '</p>'); para = []; } };
    const flushList = () => { if (list) { out.push(`<${list.tag}>` + list.items.map(i => '<li>' + inline(i) + '</li>').join('') + `</${list.tag}>`); list = null; } };
    for (const raw of esc(src).split('\n')) {
      const line = raw.trimEnd();
      let m;
      if (!line.trim()) { flushPara(); flushList(); continue; }
      if ((m = line.match(/^\s*#{1,4}\s+(.*)$/))) { flushPara(); flushList(); out.push('<h4>' + inline(m[1]) + '</h4>'); continue; }
      if ((m = line.match(/^\s*[-*•]\s+(.*)$/)) || (m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
        const tag = /^\s*\d/.test(line) ? 'ol' : 'ul';
        flushPara(); if (list && list.tag !== tag) flushList();
        if (!list) list = { tag, items: [] };
        list.items.push(m[1]); continue;
      }
      if (list && /^\s{2,}\S/.test(raw)) { list.items[list.items.length - 1] += ' ' + line.trim(); continue; }
      flushList(); para.push(line.trim());
    }
    flushPara(); flushList();
    return out.join('');
  }

  /* ── state ── */
  let panel, focus = null, history = [], ctrl = null;

  function init() {
    $$('main.page > section[id]').forEach(sec => {
      if (SKIP.has(sec.id) || !$('h2', sec)) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'xp-sec';
      b.innerHTML = '<span aria-hidden="true">✦</span> Explain';
      b.setAttribute('aria-label', 'Explain this section with AI: ' + sectionLabel(sec));
      b.addEventListener('click', () => open({ section: sec, selection: '' }, 'explain'));
      sec.prepend(b);
    });
    buildPanel();
    initSelectionChip();
  }

  function buildPanel() {
    panel = document.createElement('aside');
    panel.className = 'xp'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', 'xpTitle');
    panel.innerHTML = `
      <header class="xp-head">
        <div class="xp-h"><span class="xp-kicker"><span aria-hidden="true">✦</span> Explain with AI</span><h2 id="xpTitle" tabindex="-1"></h2></div>
        <button class="icon-btn xp-close" type="button" aria-label="Close explanation panel"><span class="glyph" aria-hidden="true">✕</span></button>
      </header>
      <div class="xp-body">
        <blockquote class="xp-quote" hidden></blockquote>
        <div class="xp-thread" aria-live="polite"></div>
      </div>
      <div class="xp-foot">
        <div class="xp-modes" role="group" aria-label="Ask for">${MODES.map(([k, l]) => `<button type="button" class="xp-mode" data-mode="${k}">${l}</button>`).join('')}</div>
        <form class="xp-ask">
          <textarea rows="1" maxlength="800" placeholder="Ask a follow-up about this…" aria-label="Ask a follow-up question"></textarea>
          <button class="btn primary xp-send" type="submit">Ask</button>
        </form>
        <p class="xp-note">Answers by Google Gemini (free tier) — they can be wrong, so check them against the lesson. Google may use free-tier prompts to improve its products; don't type personal info.</p>
      </div>`;
    document.body.appendChild(panel);
    $('.xp-close', panel).addEventListener('click', close);
    $$('.xp-mode', panel).forEach(b => b.addEventListener('click', () => ask(b.dataset.mode, MODES.find(m => m[0] === b.dataset.mode)[1])));
    const ta = $('textarea', panel);
    $('.xp-ask', panel).addEventListener('submit', e => { e.preventDefault(); const q = ta.value.trim(); if (!q) return; ta.value = ''; autosize(ta); ask('ask', q, q); });
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('.xp-ask', panel).requestSubmit(); } });
    ta.addEventListener('input', () => autosize(ta));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && !document.querySelector('.lightbox')) close(); });
  }
  const autosize = ta => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'; };

  function open(f, mode) {
    focus = f; history = [];
    if (ctrl) ctrl.abort();
    $('#xpTitle', panel).textContent = sectionLabel(f.section);
    const q = $('.xp-quote', panel);
    q.hidden = !f.selection; q.textContent = f.selection ? '“' + f.selection + '”' : '';
    $('.xp-thread', panel).innerHTML = '';
    panel.hidden = false;
    document.body.classList.add('xp-open');
    requestAnimationFrame(() => panel.classList.add('on'));
    $('#xpTitle', panel).focus({ preventScroll: true });
    ask(mode, f.selection ? 'Explain the highlighted passage' : 'Explain this section');
  }
  function close() {
    if (ctrl) ctrl.abort();
    panel.classList.remove('on'); document.body.classList.remove('xp-open');
    setTimeout(() => { if (!panel.classList.contains('on')) panel.hidden = true; }, 220);
  }

  async function ask(mode, label, question = '') {
    if (!focus) return;
    if (ctrl) ctrl.abort();
    const thread = $('.xp-thread', panel);
    const you = document.createElement('div'); you.className = 'xp-you'; you.textContent = label;
    const ans = document.createElement('div'); ans.className = 'xp-ans is-loading';
    ans.innerHTML = '<span class="xp-dots" aria-label="Thinking"><i></i><i></i><i></i></span>';
    thread.append(you, ans);
    you.scrollIntoView({ block: 'nearest' });
    setBusy(true);
    ctrl = new AbortController();
    const my = ctrl;
    const payload = {
      mode, question,
      course: courseName(), chapter: chapterTitle(), section: sectionLabel(focus.section),
      objectives: objectives(), context: sectionText(focus.section), selection: focus.selection,
      history: history.slice(-6)
    };
    let text = '';
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: my.signal });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Something went wrong (' + res.status + ').');
      }
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        ans.classList.remove('is-loading');
        ans.innerHTML = md(text) + '<span class="xp-caret" aria-hidden="true"></span>';
      }
      if (!text.trim()) throw new Error('No answer came back — try again.');
      ans.innerHTML = md(text);
      history.push({ role: 'user', text: mode === 'ask' ? question : label }, { role: 'model', text });
    } catch (e) {
      if (e.name === 'AbortError') { ans.innerHTML = text ? md(text) + '<p class="xp-muted">(stopped)</p>' : '<p class="xp-muted">(stopped)</p>'; }
      else { ans.classList.remove('is-loading'); ans.classList.add('xp-err'); ans.textContent = e.message; }
    } finally {
      if (ctrl === my) { ctrl = null; setBusy(false); }
    }
  }

  function setBusy(busy) {
    const send = $('.xp-send', panel);
    $$('.xp-mode', panel).forEach(b => { b.disabled = busy; });
    send.textContent = busy ? 'Stop' : 'Ask';
    send.type = busy ? 'button' : 'submit';
    send.onclick = busy ? () => { if (ctrl) ctrl.abort(); } : null;
  }

  /* ── "Explain" chip on highlighted text ── */
  function initSelectionChip() {
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'xp-chip'; chip.hidden = true;
    chip.innerHTML = '<span aria-hidden="true">✦</span> Explain';
    document.body.appendChild(chip);
    let pending = null;
    const current = () => {
      const sel = getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
      const text = sel.toString().replace(/\s+/g, ' ').trim();
      if (text.length < 12 || text.length > 2500) return null;
      const r = sel.getRangeAt(0);
      const node = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement;
      if (!node || !main.contains(node) || node.closest('.xp, .pager, .lesson-hero')) return null;
      const section = node.closest('main.page > section[id]') || (r.startContainer.parentElement || node).closest('main.page > section[id]');
      if (!section || SKIP.has(section.id)) return null;
      return { text, rect: r.getBoundingClientRect(), section };
    };
    const place = () => {
      pending = current();
      if (!pending) { chip.hidden = true; return; }
      const touch = matchMedia('(pointer: coarse)').matches;
      const { rect } = pending;
      chip.hidden = false;
      const w = chip.offsetWidth, h = chip.offsetHeight;
      let x = Math.min(Math.max(8, rect.left + rect.width / 2 - w / 2), innerWidth - w - 8);
      let y = touch ? rect.bottom + 12 : rect.top - h - 8;   // below on phones (native menu sits above)
      if (y < 60) y = rect.bottom + 8;
      chip.style.left = x + 'px'; chip.style.top = Math.min(y, innerHeight - h - 8) + 'px';
    };
    let t;
    document.addEventListener('selectionchange', () => { clearTimeout(t); t = setTimeout(place, 180); });
    addEventListener('scroll', () => { if (!chip.hidden) place(); }, { passive: true });
    chip.addEventListener('mousedown', e => e.preventDefault()); // keep the selection
    chip.addEventListener('click', () => {
      if (!pending) return;
      const f = { section: pending.section, selection: pending.text };
      pending = null; chip.hidden = true;
      getSelection().removeAllRanges(); // the passage is quoted in the panel; stops the chip re-appearing
      open(f, 'explain');
    });
  }
})();
