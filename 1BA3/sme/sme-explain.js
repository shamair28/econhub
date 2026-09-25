/* 1BA3/sme/sme-explain.js — "✦ Explain with AI" on the SME Prep hub.
 *
 * Uses the shared panel from /site/explain.js (window.HubExplain) and changes nothing in sme.js:
 * it watches #app and decorates whatever the engine renders.
 *   Study tab        "✦ Explain" on every concept card (beside "Got it") + the highlight chip
 *   Self-Quiz        "✦ Explain more" under the answer explanation (why right / why the others are wrong)
 *   Answer Practice  "✦ AI feedback on my draft" — judged against Name → Define → Apply → Recommend
 *                    and the scenario's model answer (sent as grading context, not shown)
 * Everything stays hidden unless the /api/explain endpoint is configured.
 */
(function () {
  'use strict';
  const X = window.HubExplain, app = document.getElementById('app');
  if (!X || !app) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const COURSE = 'COMM 1BA3 · Organizational Behaviour — group-assignment SME prep';
  const STUDY_MODES = [['explain', 'Explain deeper'], ['simpler', 'Simpler'], ['example', 'New example'], ['quiz', 'Quiz me']];
  const QUIZ_MODES = [['why', 'Why this answer'], ['simpler', 'Simpler'], ['example', 'Another example'], ['quiz', 'Quiz me']];
  const DRAFT_MODES = [['feedback', 'Re-check my draft'], ['explain', 'Explain the concepts'], ['quiz', 'Quiz me']];

  function week() {
    const h = $('.wk-hero h1');
    if (!h) return null;
    const num = ((($('.wk-hero .wnum') || {}).textContent || '').match(/Week\s*\d+/) || ['Week'])[0];
    return { label: `${num}: ${h.textContent.trim()}`, readings: X.textOf($('.wk-hero .readings')), brief: X.textOf($('#brief ol')) };
  }
  const base = (w, section, context, extra = {}) => ({
    course: COURSE, chapter: 'SME Prep — ' + w.label, section, context,
    objectives: [w.brief && 'Week brief:\n' + w.brief, w.readings && 'Readings: ' + w.readings].filter(Boolean).join('\n\n'),
    ...extra
  });
  function itemTitle(item) {
    const t = $('.ititle', item);
    if (!t) return 'This concept';
    const c = t.cloneNode(true);
    $$('.kind, .badge', c).forEach(e => e.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  }
  const secTitle = el => { const s = el.closest('.sec'); return s ? (($('.sec-head h2', s) || {}).textContent || '').trim() : ''; };
  function forItem(item, selection = '') {
    const title = itemTitle(item), sec = item.closest('.sec');
    return {
      title,
      build: () => base(week(), [secTitle(item), title].filter(Boolean).join(' › '),
        `Concept card: ${title}\n${X.textOf(item)}\n\nOther cards in this section:\n${X.textOf(sec)}`, { selection })
    };
  }

  /* ── decorate what the engine rendered ── */
  function decorate() {
    if (!week()) return;
    $$('.item:not([data-xp])').forEach(item => {
      item.dataset.xp = '1';
      const head = $('.ihead', item);
      if (!head) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'xp-item'; b.dataset.xpBtn = '';
      b.innerHTML = '<span aria-hidden="true">✦</span><span class="xp-lbl">Explain</span>';
      b.setAttribute('aria-label', 'Explain with AI: ' + itemTitle(item));
      b.addEventListener('click', () => X.open({ ...forItem(item), modes: STUDY_MODES, start: ['explain', 'Explain this concept'] }));
      head.insertBefore(b, $('.check', head));
    });

    $$('.qz-why:not([data-xp])').forEach(why => {
      why.dataset.xp = '1';
      const card = why.closest('.card');
      const row = document.createElement('div');
      row.style.marginTop = '10px'; row.dataset.xpBtn = '';
      row.innerHTML = '<button type="button" class="btn"><span aria-hidden="true">✦</span> Explain more</button>';
      why.appendChild(row);
      $('button', row).addEventListener('click', () => {
        const opts = $$('.qz-opt', card).map(o => ({ L: ($('.L', o) || {}).textContent, t: X.textOf(o.lastElementChild), right: o.classList.contains('right'), wrong: o.classList.contains('wrong') }));
        const right = opts.find(o => o.right), wrong = opts.find(o => o.wrong);
        const q = X.textOf($('.qtext', card));
        const why2 = X.textOf(why).replace(/Explain more$/, '').trim();
        X.open({
          kicker: '✦ Explain with AI', title: 'Self-quiz question', modes: QUIZ_MODES,
          start: ['why', wrong ? 'Why was my answer wrong?' : 'Why is this the answer?'],
          build: () => base(week(), 'Self-quiz question (multiple choice)',
            `Question: ${q}\n\nOptions:\n${opts.map(o => `${o.L}. ${o.t}`).join('\n')}\n\nCorrect answer: ${right ? right.L + '. ' + right.t : '?'}\n` +
            (wrong ? `The student chose: ${wrong.L}. ${wrong.t}\n` : 'The student chose the correct answer.\n') +
            `\nBuilt-in explanation shown to the student:\n${why2}`)
        });
      });
    });

    $$('.ap:not([data-xp])').forEach(card => {
      card.dataset.xp = '1';
      const tools = $('.tools', card), ta = $('textarea', card);
      if (!tools || !ta) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn'; b.dataset.xpBtn = '';
      b.innerHTML = '<span aria-hidden="true">✦</span> AI feedback on my draft';
      tools.insertBefore(b, $('[data-saved]', tools));
      b.addEventListener('click', () => {
        const n = +card.dataset.k + 1;
        const q = X.textOf($('.qtext', card));
        const model = $$('.model .mrow', card).map(r => `${X.textOf($('.k', r))}: ${X.textOf($('.v', r))}`).join('\n');
        const also = X.textOf($('.model .note', card));
        X.open({
          kicker: '✦ AI feedback', title: `Scenario ${n}`, modes: DRAFT_MODES, start: ['feedback', 'Check my draft'],
          build: () => base(week(), `Answer practice — scenario ${n}`,
            `Assignment scenario (worth 10 marks, answered in writing in class):\n${q}\n\n` +
            `Model answer (for judging the draft — don't just repeat it back):\n${model}${also ? '\n' + also : ''}`,
            { draft: ta.value })
        });
      });
    });
  }

  X.ready.then(ok => {
    if (!ok) return;
    decorate();
    let t;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(decorate, 30); }).observe(app, { childList: true, subtree: true });
    X.attachSelection({
      root: app,
      resolve({ text, node }) {
        const w = week();
        if (!w || node.closest('.toc, .tabs, .wk-hero, .qz-opts, .ap')) return null;
        const item = node.closest('.item');
        if (item) return forItem(item, text);
        const box = node.closest('.note, .sec, .card');
        if (!box) return null;
        const title = secTitle(box) || (box.matches('.card') ? 'Self-quiz' : w.label);
        return { title, modes: STUDY_MODES, build: () => base(week(), title, X.textOf(box.closest('.sec') || box), { selection: text }) };
      }
    });
  });
})();
