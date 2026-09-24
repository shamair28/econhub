/* COMM 1BA3 — SME Prep hub engine.
   Week content lives in week1.js … week4.js, each calling SME.addWeek({...}).
   Routes (hash): #/  ·  #/w1  ·  #/w1/cards  ·  #/w1/quiz  ·  #/w1/practice          */
(function () {
  'use strict';

  /* ── storage (per-device conveniences only) ── */
  const NS = 'sme1ba3:';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  const WEEKS = [];
  const byId = {};
  const slug = s => String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const strip = s => String(s || '').replace(/<[^>]+>/g, '');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  window.SME = {
    addWeek(w) {
      const seen = {};
      w.sections.forEach(sec => sec.items.forEach(it => {
        if (it.t === 'note') return;
        let id = w.id + ':' + slug(it.term || it.title);
        if (seen[id]) id += '-' + (++seen[id]); else seen[id] = 1;
        it.id = id;
      }));
      WEEKS.push(w); byId[w.id] = w;
      WEEKS.sort((a, b) => a.num - b.num);
    }
  };

  /* ── assignment config (from Dr. Kassaye's announcement) ── */
  const ASSIGNMENTS = [
    {
      id: 'practice', name: 'Practice Assignment', stakes: 'Rehearsal — not graded',
      when: 'C08 · Thu Oct 1 &nbsp;·&nbsp; C07 · Fri Oct 2',
      qs: [['w1', 'Intro to OB'], ['w1', 'Intro to OB'], ['w2', 'Abilities, Personality, Values, Attitudes'], ['w2', 'Abilities, Personality, Values, Attitudes'], ['w3', 'Perception']]
    },
    {
      id: 'a1', name: 'Assignment #1', stakes: '10% of your grade',
      when: 'As posted: C08 · Oct 9 &nbsp;·&nbsp; C07 · Oct 8',
      qs: [['w1', 'Intro to OB'], ['w2', 'Abilities, Personality, Values, Attitudes'], ['w3', 'Perception'], ['w4', 'Motivation'], ['w4', 'Motivation']]
    }
  ];

  /* ── state ── */
  let known = store.get('known', {});
  let claims = store.get('claims', {});
  const isKnown = id => !!known[id];
  function setKnown(id, v) { if (v) known[id] = 1; else delete known[id]; store.set('known', known); }
  function checkables(w) { const out = []; w.sections.forEach(s => s.items.forEach(it => { if (it.t !== 'note') out.push(it); })); return out; }
  function progress(w) { const c = checkables(w); const k = c.filter(it => isKnown(it.id)).length; return { k, n: c.length, pct: c.length ? Math.round(100 * k / c.length) : 0 }; }
  function myWeeks() { const s = new Set(); ASSIGNMENTS.forEach(a => { const q = claims[a.id]; if (q != null && a.qs[q]) s.add(a.qs[q][0]); }); return s; }

  /* ── theme ── */
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); const b = $('#themeBtn'); if (b) b.textContent = t === 'dark' ? '☀ Light' : '☾ Dark'; }
  applyTheme(store.get('theme', 'dark'));

  /* ── toast ── */
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1800); }

  /* ── ring ── */
  function ring(pct, size = 64, color = 'var(--acc)') {
    const r = size / 2 - 5, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-label="${pct}% marked as known">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="6"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})" style="transition:stroke-dashoffset .4s"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="var(--text)" font-size="${size / 4.4}" font-weight="800">${pct}%</text></svg>`;
  }

  /* ── side menu: chapter lesson pages + weeks ── */
  const CHAPTERS = [
    { n: 1, t: 'Organizational Behaviour and Management', wk: [['w1', '']] },
    { n: 2, t: 'Personality and Learning', wk: [['w2', 'Personality §2.1–2.3'], ['w4', 'Learning §2.4–2.8']] },
    { n: 3, t: 'Perception, Attribution, and Diversity', wk: [['w3', '']] },
    { n: 4, t: 'Values, Attitudes, and Work Behaviour', wk: [['w2', '']] },
    { n: 5, t: 'Theories of Work Motivation', wk: [['w2', '§5.2 abilities'], ['w4', '§5.1, 5.3–5.6']] },
    { n: 6, t: 'Motivation in Practice', wk: [['w4', '']] }
  ];
  let drawerOpen = false, lastFocus = null;
  function renderDrawer() {
    const cur = (location.hash.replace(/^#\/?/, '').split('/')[0]) || '';
    const nav = $('#drawerNav'); if (!nav) return;
    nav.innerHTML = `
      <div class="dsec">Chapter lesson pages <span class="muted">· open in a new tab</span></div>
      ${CHAPTERS.map(c => {
        const here = c.wk.some(([w]) => w === cur);
        return `<a class="dlink ch ${here ? 'here' : ''}" href="/1BA3/ch${c.n}" target="_blank" rel="noopener">
          <span class="dnum">${c.n}</span>
          <span class="dtxt"><span class="dt">${c.t}</span>
            <span class="dw">${c.wk.map(([w, part]) => `<span class="wtag ${w === cur ? 'on' : ''}" style="--wk:var(--${w})">Week ${byId[w] ? byId[w].num : w.slice(1)}${part ? ' · ' + part : ''}</span>`).join('')}</span></span>
          <span class="dext" aria-hidden="true">↗</span>
        </a>`;
      }).join('')}
      <div class="dsec">SME Prep weeks</div>
      <a class="dlink ${cur === '' ? 'here' : ''}" href="#/"><span class="dnum">★</span><span class="dtxt"><span class="dt">Overview &amp; question map</span></span></a>
      ${WEEKS.map(w => `<a class="dlink ${cur === w.id ? 'here' : ''}" href="#/${w.id}" style="--wk:var(--${w.id})"><span class="dnum wk">W${w.num}</span><span class="dtxt"><span class="dt">${w.title}</span><span class="dw muted">${w.chapterLine}</span></span></a>`).join('')}
      <div class="dsec">Site</div>
      <a class="dlink" href="/"><span class="dnum">⌂</span><span class="dtxt"><span class="dt">Study hub home</span><span class="dw muted">All courses</span></span></a>`;
  }
  function setDrawer(open) {
    drawerOpen = open;
    const d = $('#drawer'), sc = $('#scrim'), b = $('#menuBtn');
    if (open) { renderDrawer(); lastFocus = document.activeElement; }
    d.classList.toggle('open', open); d.setAttribute('aria-hidden', String(!open)); d.inert = !open;
    sc.hidden = !open; b.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('noscroll', open);
    if (open) { const f = $('.dlink.here', d) || $('.dlink', d); if (f) f.focus({ preventScroll: true }); }
    else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ── router ── */
  const app = () => $('#app');
  let cleanup = [];
  function route() {
    cleanup.forEach(f => f()); cleanup = [];
    const h = location.hash.replace(/^#\/?/, '');
    const [wid, tab] = h.split('/');
    if (wid && byId[wid]) renderWeek(byId[wid], tab || 'study');
    else renderLanding();
  }
  window.addEventListener('hashchange', () => {
    route();
    const html = document.documentElement; html.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); html.style.scrollBehavior = '';
  });

  function setCrumbs(html, acc) {
    $('#crumbs').innerHTML = html;
    document.documentElement.style.setProperty('--acc', acc || 'var(--w1)');
  }

  /* ════════════════ LANDING ════════════════ */
  function renderLanding() {
    setCrumbs('<span>Group Assignment SME Prep</span>', 'var(--w1)');
    document.title = 'SME Prep · COMM 1BA3';
    const mine = myWeeks();
    const qmap = a => `
      <div class="card qmap">
        <h3>${a.name}</h3>
        <div class="sub">${a.stakes} · ${a.when}</div>
        ${a.qs.map(([wid, topic], i) => {
          const w = byId[wid]; const isMine = claims[a.id] === i;
          return `<div class="qrow ${isMine ? 'mine' : ''}" style="--wk:var(--${wid})">
            <span class="qn">Q${i + 1}</span>
            <a class="qt" href="#/${wid}" style="color:var(--text)">${topic}<small>Week ${w.num} · ${w.chapterLine}</small></a>
            <button class="claim" data-a="${a.id}" data-q="${i}" aria-pressed="${isMine}">${isMine ? '✓ Selected' : 'Select'}</button>
          </div>`;
        }).join('')}
      </div>`;

    app().innerHTML = `
      <section class="hero">
        <div class="eyebrow">COMM 1BA3 · Organizational Behaviour · Fall 2026</div>
        <h1>Become the <span class="grad">Subject Matter Expert</span> for your week.</h1>
        <p class="lede">Each group member owns one question topic. You won't see the question ahead of time, so this page gives you everything for your week in one place: key definitions, models, lists with memory aids, exam traps, a self-quiz and timed answer practice. You don't need to jump between chapter pages.</p>
        <div class="hero-meta">
          <span class="chip">Johns &amp; Saks · Ch 1–6</span>
          <span class="chip">Lecture slides Weeks 1–3 folded in</span>
          <span class="chip">Progress saves on this device</span>
        </div>
      </section>

      <div class="grid-2">
        <div class="card">
          <div class="eyebrow">How the assignment works</div>
          <ul class="how-list">
            <li><span class="n">1</span><div><b>Choose your question now.</b> Each group member selects one question number and its topic, e.g. "Q3 · Perception" (map below). You become the SME for that topic.</div></li>
            <li><span class="n">2</span><div><b>The question itself is handed out in class.</b> Until then you only know its topic, so study <i>everything</i> from class and the textbook for it. Any concept from that week is fair game.</div></li>
            <li><span class="n">3</span><div><b>In the room: 50 minutes, closed book, one pink booklet.</b> The group writes all five answers in a single booklet, which works out to about 10 minutes per question.</div></li>
            <li><span class="n">4</span><div><b>Name the course concepts.</b> Each question is worth 10 marks and is "usually drawn from the textbook and in-class discussions" (course outline). Naming and defining the concept is the clearest way to show you know it; a general business answer doesn't.</div></li>
          </ul>
          <div class="facts">
            <div class="fact"><div class="k">Format</div><div class="v">5 questions × 10 marks</div></div>
            <div class="fact"><div class="k">Time</div><div class="v">50 min · closed book</div></div>
            <div class="fact"><div class="k">Assignment #1</div><div class="v">10% · Weeks 1–4</div></div>
            <div class="fact"><div class="k">Group</div><div class="v">Same 5 all term</div></div>
          </div>
        </div>
        <div class="card">
          <div class="eyebrow">The 10-mark answer formula</div>
          <p class="muted" style="margin:8px 0 0;font-size:14px">A structure for every answer, so nothing the question asks for gets skipped:</p>
          <div class="formula-steps">
            <div><b>Name</b>the course concept(s)</div>
            <div><b>Define</b>it in one exact sentence</div>
            <div><b>Apply</b>it to the scenario's specifics</div>
            <div><b>Recommend</b>what to do &amp; why</div>
          </div>
          <div class="note tip" style="margin-top:14px"><span class="nt">SME tip</span>Name <b>two</b> concepts when you can. For example, "this is <i>low instrumentality</i> (expectancy theory) <i>and</i> an <i>equity</i> problem." A second relevant concept, used correctly, shows the depth an SME is expected to have.</div>
          <div class="note trap" style="margin-top:10px"><span class="nt">Date check</span>The announcement lists Assignment #1 as C08 on Oct 9 (a Friday) and C07 on Oct 8 (a Thursday). C08 meets M/W/Th and C07 meets M/W/F, so those two dates look swapped. The course outline's schedule also differs (Practice in Week 5, Assignment #1 in Week 7, Oct 19–23); the announcement is newer. Confirm with Dr. Kassaye.</div>
        </div>
      </div>

      <div class="section-title"><h2>Question → week map</h2><span class="muted" style="font-size:13.5px">Click <b>Select</b> to mark your question. Your weeks get highlighted and the choice is saved on this device.</span></div>
      <div class="qmaps">${ASSIGNMENTS.map(qmap).join('')}</div>

      <div class="section-title"><h2>Pick your week</h2><span class="muted" style="font-size:13.5px">Chapters and textbook sections per the course outline's e-text reading list</span></div>
      <div class="weeks">
        ${WEEKS.map(w => {
          const p = progress(w);
          return `<a class="wcard" href="#/${w.id}" style="--wk:var(--${w.id})">
            ${mine.has(w.id) ? '<span class="mine-flag">YOUR WEEK</span>' : ''}
            <div class="wnum">Week ${w.num}</div>
            <h3>${w.title}</h3>
            <div class="dates">${w.dates}</div>
            <ul>${w.chapters.map(c => `<li><span class="c">${c.c}</span><span>${c.t}${c.s ? ` <span class="muted">· ${c.s}</span>` : ''}</span></li>`).join('')}</ul>
            <div class="keys">${w.keys.map(k => `<span>${k}</span>`).join('')}</div>
            <div class="foot"><div class="pbar"><i style="width:${p.pct}%"></i></div><span class="ptext">${p.pct}%</span><span class="go">Study →</span></div>
          </a>`;
        }).join('')}
      </div>

      <div class="section-title"><h2>Coverage notes</h2></div>
      <div class="stack">
        <div class="note info"><span class="nt">Where Chapter 5 lives</span>The outline starts Chapter 5 ("Intro to Motivation") in Week 3, but the Week 3 lecture deck covered Chapter 3 only, and the assignment labels Week 3 "Perception" and Week 4 "Motivation." So all of Chapter 5's motivation theory (§5.1, 5.3–5.6) is on the <a href="#/w4">Week 4 page</a>. The one exception is <b>§5.2 abilities</b> (cognitive ability and EI), which was a Week 2 reading and is on the <a href="#/w2">Week 2 page</a>.</div>
        <div class="note info"><span class="nt">Week 4 also includes Learning (Ch 2, §2.4–2.8)</span>The outline pairs the second half of Chapter 2 (operant learning, reinforcement, social cognitive theory) with Chapter 6 under "Motivation cont." It's on the Week 4 page in its own section. A Motivation question could ask you to reinforce behaviour just as easily as to redesign a job.</div>
        <div class="note tip"><span class="nt">Two people on one week? Split the depth</span>Practice Q1/Q2 are both Week 1, Q3/Q4 are both Week 2, and Assignment #1 Q4/Q5 are both Week 4. Each week page suggests a split so the two SMEs cover everything between them, while each still reads the other half.</div>
      </div>


      <div class="footer">Built from the Johns &amp; Saks text (12th ed., which the course's Week 1 deck names; the outline names the 13th, and chapter/section numbering matches), Dr. Kassaye's Week 2–3 slides and the Week 1 handout. Lecture-only content is tagged <span class="badge lec">Lecture</span> or <span class="badge hand">Handout</span>. Chapter lesson pages: <a href="/1BA3/ch1">Ch 1</a> · <a href="/1BA3/ch2">Ch 2</a> · <a href="/1BA3/ch3">Ch 3</a> · <a href="/1BA3/ch4">Ch 4</a> · <a href="/1BA3/ch5">Ch 5</a> · <a href="/1BA3/ch6">Ch 6</a> · <a href="/">Study hub home</a></div>
    `;

    $$('.claim', app()).forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      const a = b.dataset.a, q = +b.dataset.q;
      if (claims[a] === q) { delete claims[a]; toast('Selection cleared'); }
      else { claims[a] = q; const w = byId[ASSIGNMENTS.find(x => x.id === a).qs[q][0]]; toast(`Selected Q${q + 1}: you're the Week ${w.num} SME`); }
      store.set('claims', claims); renderLanding();
    }));
  }

  /* ════════════════ WEEK ════════════════ */
  function srcBadge(it) {
    if (it.src === 'lec') return '<span class="badge lec">Lecture</span>';
    if (it.src === 'hand') return '<span class="badge hand">Handout</span>';
    return '';
  }
  const KIND = { def: 'Definition', list: 'List', groups: 'Framework', flow: 'Model · process', cmp: 'Compare', formula: 'Formula' };
  const p = s => s ? (/^\s*</.test(s) ? s : `<p>${s}</p>`) : '';

  function itemBody(it) {
    let h = '';
    if (it.intro) h += p(it.intro);
    switch (it.t) {
      case 'def': h += p(it.def); break;
      case 'list':
        h += `<ol class="ilist ${it.bullets ? 'bul' : ''}">${it.items.map(x => `<li><div>${x}</div></li>`).join('')}</ol>`; break;
      case 'groups':
        h += `<div class="groups">${it.groups.map(g => `<div class="group"><h4>${g.name}</h4><ul>${g.items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`; break;
      case 'flow':
        h += `<div class="flow ${it.loop ? 'loop' : ''}">${it.steps.map((s, i) => (i ? '<span class="arr">→</span>' : '') + `<div class="step"><b>${s.h}</b>${s.d || ''}</div>`).join('')}${it.loop ? '<span class="arr">↺</span>' : ''}</div>`; break;
      case 'cmp':
        h += `<div class="tbl-wrap"><table class="cmp"><thead><tr>${it.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${it.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; break;
      case 'formula':
        h += `<div class="formula">${it.f}</div>`; if (it.body) h += p(it.body); break;
    }
    if (it.after) h += p(it.after);
    return h;
  }

  function renderItem(it) {
    if (it.t === 'note') return `<div class="note ${it.tone || 'info'}" data-search><span class="nt">${it.title}</span>${p(it.body)}</div>`;
    const k = isKnown(it.id);
    return `<article class="item ${k ? 'known' : ''}" id="i-${it.id.replace(/[^a-z0-9-]/gi, '-')}" data-search>
      <div class="ihead">
        <div class="ititle"><div class="kind">${KIND[it.t]}${it.ref ? ' · ' + it.ref : ''}</div>${it.term || it.title}${srcBadge(it)}</div>
        <button class="check" data-id="${it.id}" aria-pressed="${k}" title="Mark as known"><span class="box"></span>Got it</button>
      </div>
      <div class="body">${itemBody(it)}</div>
      ${it.mnem ? `<div class="mnem"><div>${it.mnem}</div></div>` : ''}
      ${it.more ? `<details class="more"><summary>${it.moreLabel || 'More detail'}</summary><div class="dbody">${p(it.more)}</div></details>` : ''}
    </article>`;
  }

  function renderWeek(w, tab) {
    const acc = `var(--${w.id})`;
    setCrumbs(`<a href="#/" style="color:var(--muted)">SME Prep</a><span>›</span><span style="color:var(--text)">Week ${w.num} · ${w.title}</span>`, acc);
    document.title = `Week ${w.num} · ${w.title} · SME Prep`;
    const pr = progress(w);
    const slots = [];
    ASSIGNMENTS.forEach(a => a.qs.forEach(([wid], i) => { if (wid === w.id) slots.push(`${a.id === 'a1' ? 'A#1' : 'Practice'} Q${i + 1}`); }));
    const nCards = buildDeck(w).length;
    const tabs = [['study', 'Study', checkables(w).length], ['cards', 'Flashcards', nCards], ['quiz', 'Self-Quiz', w.quiz.length], ['practice', 'Answer Practice', w.prompts.length]];

    app().innerHTML = `
      <header class="wk-hero">
        <div class="wnum">Week ${w.num} · ${w.dates}</div>
        <h1>${w.title}</h1>
        <div class="readings">${w.chapters.map(c => `<div><b>${c.c}</b> ${c.t}${c.s ? ` <span class="muted">· ${c.s}</span>` : ''}${c.note ? ` <span class="muted">(${c.note})</span>` : ''}</div>`).join('')}</div>
        <div class="row">
          ${slots.map(s => `<span class="chip acc">${s}</span>`).join('')}
          ${w.sources.map(s => `<span class="chip">${s}</span>`).join('')}
        </div>
        <div class="ring">${ring(pr.pct, 70)}<div class="lbl">${pr.k}/${pr.n} known</div></div>
      </header>
      <nav class="tabs" role="tablist">${tabs.map(([id, label, n]) => `<a class="tab ${tab === id ? 'on' : ''}" href="#/${w.id}${id === 'study' ? '' : '/' + id}" role="tab" aria-selected="${tab === id}">${label}<span class="ct">${n}</span></a>`).join('')}</nav>
      <div id="tabBody"></div>`;

    const body = $('#tabBody');
    if (tab === 'cards') renderCards(w, body);
    else if (tab === 'quiz') renderQuiz(w, body);
    else if (tab === 'practice') renderPractice(w, body);
    else renderStudy(w, body);
  }

  /* ── Study tab ── */
  function renderStudy(w, body) {
    const traps = []; const mnems = [];
    w.sections.forEach(s => s.items.forEach(it => {
      if (it.t === 'note' && it.tone === 'trap') traps.push({ it, sec: s });
      if (it.mnem) mnems.push({ it, sec: s });
    }));
    const secCount = s => { const c = s.items.filter(i => i.t !== 'note'); return [c.filter(i => isKnown(i.id)).length, c.length]; };

    body.innerHTML = `
      <div class="study">
        <aside class="toc">
          <input class="search" id="q" type="search" placeholder="Search this week…" aria-label="Search this week">
          <ol>
            <li><a href="#brief" data-sec="brief"><span>60-second brief</span></a></li>
            ${w.sections.map(s => { const [k, n] = secCount(s); return `<li><a href="#s-${s.id}" data-sec="s-${s.id}"><span>${s.title}</span><small class="${k === n && n ? 'done' : ''}">${k}/${n}</small></a></li>`; }).join('')}
            <li><a href="#s-traps" data-sec="s-traps"><span>Trap board</span><small>${traps.length}</small></a></li>
            <li><a href="#s-mnem" data-sec="s-mnem"><span>Memory-aid index</span><small>${mnems.length}</small></a></li>
          </ol>
          <div class="toc-foot">
            <a class="btn" href="#/${w.id}/quiz">Take the self-quiz →</a>
            <button class="btn ghost" id="printBtn">Print cheat sheet</button>
            <button class="btn ghost" id="resetBtn" style="font-size:12.5px">Reset "Got it" marks</button>
          </div>
        </aside>
        <div>
          <section class="brief sec" id="brief" style="margin-top:0">
            <h2>60-second brief <span class="chip acc">If you only read one thing</span></h2>
            <ol>${w.brief.map(b => `<li><div>${b}</div></li>`).join('')}</ol>
            ${w.split ? `<div class="note tip split-tip"><span class="nt">Two SMEs on this week? Suggested split</span>${p(w.split)}</div>` : ''}
            ${w.lens ? `<div class="note info split-tip"><span class="nt">How this week tends to show up in a question</span>${p(w.lens)}</div>` : ''}
          </section>
          ${w.sections.map(s => `
            <section class="sec" id="s-${s.id}" data-secwrap>
              <div class="sec-head"><h2>${s.title}</h2>${s.ref ? `<span class="ref">${s.ref}</span>` : ''}${s.src ? srcBadge(s) : ''}</div>
              ${s.lede ? `<p class="sec-lede">${s.lede}</p>` : ''}
              <div class="items">${s.items.map(renderItem).join('')}</div>
            </section>`).join('')}
          <section class="sec" id="s-traps" data-secwrap>
            <div class="sec-head"><h2>Trap board</h2><span class="ref">Every trap on this page in one place. Re-read these right before the assignment</span></div>
            <div class="trapboard">${traps.map(({ it, sec }) => `<div class="note trap" data-search><span class="nt">${it.title} <span class="muted" style="font-weight:500;font-size:12.5px">· ${sec.title}</span></span>${p(it.body)}</div>`).join('') || '<div class="empty">No traps flagged.</div>'}</div>
          </section>
          <section class="sec" id="s-mnem" data-secwrap>
            <div class="sec-head"><h2>Memory-aid index</h2><span class="ref">Say each one out loud, then expand it from memory</span></div>
            <div class="trapboard">${mnems.map(({ it }) => `<div class="mnem" data-search style="margin:0"><div><b>${strip(it.term || it.title)}</b><br>${it.mnem}</div></div>`).join('')}</div>
          </section>
          <div id="noHits" class="empty hide" style="margin-top:20px">Nothing on this page matches that search. Try a shorter word.</div>
        </div>
      </div>`;

    // got-it toggles
    body.addEventListener('click', e => {
      const b = e.target.closest('.check'); if (!b) return;
      const id = b.dataset.id; const v = !isKnown(id); setKnown(id, v);
      const art = b.closest('.item'); art.classList.toggle('known', v); b.setAttribute('aria-pressed', v);
      refreshCounts(w);
    });
    $('#printBtn').onclick = () => { $$('details', body).forEach(d => d.open = true); window.print(); };
    $('#resetBtn').onclick = () => {
      if (!confirm(`Clear all "Got it" marks for Week ${w.num}?`)) return;
      checkables(w).forEach(it => setKnown(it.id, false)); route();
    };

    // search
    const q = $('#q');
    q.addEventListener('input', () => {
      const term = q.value.trim().toLowerCase();
      let hits = 0;
      $$('[data-secwrap]', body).forEach(sec => {
        let any = false;
        $$('[data-search]', sec).forEach(el => {
          const m = !term || el.textContent.toLowerCase().includes(term);
          el.classList.toggle('hide', !m); if (m) any = true;
        });
        const head = $('.sec-head', sec).textContent.toLowerCase();
        if (term && head.includes(term)) { $$('[data-search]', sec).forEach(el => el.classList.remove('hide')); any = true; }
        sec.classList.toggle('hide', !any); if (any) hits++;
      });
      $('#brief').classList.toggle('hide', !!term);
      $('#noHits').classList.toggle('hide', hits > 0);
    });

    // toc links: smooth scroll without touching the route hash
    $$('.toc a[data-sec]', body).forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); const t = document.getElementById(a.dataset.sec); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    // scrollspy
    if ('IntersectionObserver' in window) {
      const links = {}; $$('.toc a[data-sec]', body).forEach(a => links[a.dataset.sec] = a);
      const io = new IntersectionObserver(ents => {
        ents.forEach(en => { if (en.isIntersecting) { Object.values(links).forEach(l => l.classList.remove('active')); const l = links[en.target.id]; if (l) l.classList.add('active'); } });
      }, { rootMargin: '-130px 0px -65% 0px' });
      $$('.sec', body).forEach(s => io.observe(s));
      cleanup.push(() => io.disconnect());
    }
  }

  function refreshCounts(w) {
    const pr = progress(w);
    const r = $('.wk-hero .ring'); if (r) r.innerHTML = ring(pr.pct, 70) + `<div class="lbl">${pr.k}/${pr.n} known</div>`;
    w.sections.forEach(s => {
      const a = $(`.toc a[data-sec="s-${s.id}"] small`); if (!a) return;
      const c = s.items.filter(i => i.t !== 'note'); const k = c.filter(i => isKnown(i.id)).length;
      a.textContent = `${k}/${c.length}`; a.classList.toggle('done', k === c.length && c.length > 0);
    });
  }

  /* ── Flashcards ── */
  function buildDeck(w) {
    const deck = [];
    w.sections.forEach(s => s.items.forEach(it => {
      if (it.t === 'note' || it.noCard) return;
      let front = strip(it.term || it.title), hint = s.title, back;
      switch (it.t) {
        case 'def': back = it.def; hint = 'Define it'; break;
        case 'list': back = `<ol style="margin:0;padding-left:20px;display:grid;gap:4px">${it.items.map(x => `<li>${x}</li>`).join('')}</ol>`; hint = `Name all ${it.items.length}`; break;
        case 'groups': back = it.groups.map(g => `<div style="margin-bottom:8px"><b>${g.name}:</b> ${g.items.map(strip).join(' · ')}</div>`).join(''); hint = 'Recall every group and its members'; break;
        case 'flow': back = `<ol style="margin:0;padding-left:20px;display:grid;gap:4px">${it.steps.map(x => `<li><b>${x.h}</b>${x.d ? ' — ' + x.d : ''}</li>`).join('')}</ol>`; hint = 'Put the steps in order'; break;
        case 'cmp': back = `<div class="tbl-wrap" style="margin:0"><table class="cmp" style="min-width:0"><thead><tr>${it.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${it.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; hint = 'Explain the difference'; break;
        case 'formula': back = `<div class="formula" style="margin:0 0 10px">${it.f}</div>${p(it.body || '')}`; hint = 'Write the formula'; break;
      }
      if (it.mnem) back += `<div class="mnem"><div>${it.mnem}</div></div>`;
      deck.push({ id: it.id, front, hint, back });
    }));
    return deck;
  }

  function renderCards(w, body) {
    const all = buildDeck(w);
    const key = 'fc:' + w.id;
    let marks = store.get(key, {});
    let mode = 'all', order = all.slice(), i = 0, flipped = false;
    const pool = () => mode === 'learn' ? order.filter(c => marks[c.id] !== 'yes') : order;

    body.innerHTML = `<div class="fc-wrap">
      <div class="fc-bar">
        <div class="left">
          <div class="seg" id="fcMode"><button data-m="all" class="on">All cards</button><button data-m="learn">Not yet known</button></div>
          <button class="btn ghost" id="fcShuf">⇄ Shuffle</button>
        </div>
        <span class="muted" style="font-size:12.5px"><kbd>Space</kbd> flip · <kbd>←</kbd> still learning · <kbd>→</kbd> got it</span>
      </div>
      <div id="fcBox"></div>
    </div>`;

    function draw() {
      const list = pool(); const box = $('#fcBox');
      if (!list.length) {
        box.innerHTML = `<div class="card" style="margin-top:16px;text-align:center;padding:40px"><div style="font-size:40px">🎉</div><h2 style="margin-top:6px">Every card marked "got it."</h2><p class="muted">Switch to "All cards" to run the full deck again, or try the <a href="#/${w.id}/quiz">self-quiz</a>.</p></div>`;
        return;
      }
      if (i >= list.length) i = 0;
      const c = list[i]; flipped = false;
      const nYes = all.filter(x => marks[x.id] === 'yes').length;
      box.innerHTML = `
        <div class="fc-stage"><div class="fc" id="fc" tabindex="0" aria-label="Flashcard, press space to flip">
          <div class="fc-face front"><div class="eyebrow" style="margin-bottom:10px">${c.hint}</div><div class="t">${c.front}</div><div class="s">Click or press space to flip</div></div>
          <div class="fc-face back"><div class="t">${c.front}</div><div>${c.back}</div></div>
        </div></div>
        <div class="fc-ctl">
          <button class="btn no" id="fcNo">← Still learning</button>
          <button class="btn" id="fcFlip">Flip</button>
          <button class="btn yes" id="fcYes">Got it →</button>
        </div>
        <div class="fc-meta">Card ${i + 1} of ${list.length} · ${nYes}/${all.length} marked "got it" (also ticks it on the Study tab)</div>`;
      const fc = $('#fc');
      fc.onclick = flip; $('#fcFlip').onclick = flip;
      $('#fcYes').onclick = () => mark('yes'); $('#fcNo').onclick = () => mark('no');
    }
    function flip() { const fc = $('#fc'); if (!fc) return; flipped = !flipped; fc.classList.toggle('flip', flipped); }
    function mark(v) {
      const list = pool(); const c = list[i]; if (!c) return;
      marks[c.id] = v; store.set(key, marks); setKnown(c.id, v === 'yes');
      if (!(mode === 'learn' && v === 'yes')) i++;
      draw();
    }
    $$('#fcMode button').forEach(b => b.onclick = () => { mode = b.dataset.m; i = 0; $$('#fcMode button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
    $('#fcShuf').onclick = () => { order = shuffle(all); i = 0; draw(); toast('Deck shuffled'); };
    const onKey = e => {
      if (drawerOpen || e.target.matches('input, textarea')) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowRight') mark('yes');
      else if (e.key === 'ArrowLeft') mark('no');
    };
    document.addEventListener('keydown', onKey); cleanup.push(() => document.removeEventListener('keydown', onKey));
    draw();
  }

  /* ── Quiz ── */
  function renderQuiz(w, body) {
    const bestKey = 'best:' + w.id;
    let qs = [], i = 0, answers = [];
    body.innerHTML = `<div class="qz-wrap" id="qz"></div>`;
    const box = $('#qz');

    function start(set) {
      qs = set.map(q => { const idx = shuffle(q.o.map((_, k) => k)); return { ...q, opts: idx.map(k => q.o[k]), ans: idx.indexOf(q.a) }; });
      i = 0; answers = []; draw();
    }
    function intro() {
      const best = store.get(bestKey, null);
      const n = w.quiz.length;
      box.innerHTML = `<div class="card qz-start">
        <div class="eyebrow">Week ${w.num} self-quiz</div>
        <h2>${n} scenario-style multiple-choice questions</h2>
        <p>Each answer comes with the reasoning, including why the distractors are wrong. The midterm is all multiple choice, so this doubles as exam practice.${best ? `<br><b>Your best: ${best.s}/${best.n}</b>` : ''}</p>
        <div class="opts">
          <button class="btn primary" id="qAll">Start all ${n}</button>
          <button class="btn" id="qTen">Quick 10 (random)</button>
        </div>
        <p class="muted" style="font-size:12.5px;margin-top:14px"><kbd>1</kbd>–<kbd>4</kbd> to answer · <kbd>Enter</kbd> for next</p>
      </div>`;
      $('#qAll').onclick = () => start(shuffle(w.quiz));
      $('#qTen').onclick = () => start(shuffle(w.quiz).slice(0, Math.min(10, n)));
    }
    function draw() {
      const q = qs[i]; const done = answers[i] != null;
      const score = answers.filter((a, k) => a === qs[k].ans).length;
      box.innerHTML = `<div class="card">
        <div class="qz-top"><span class="muted" style="font-size:13px;font-weight:700">Q${i + 1}/${qs.length}</span><div class="pbar"><i style="width:${100 * (i + (done ? 1 : 0)) / qs.length}%"></i></div><span class="muted" style="font-size:13px;font-weight:700">✓ ${score}</span></div>
        <div class="qz-q"><div class="qtext">${q.q}</div>
          <div class="qz-opts">${q.opts.map((o, k) => {
            let cls = ''; if (done) { if (k === q.ans) cls = 'right'; else if (k === answers[i]) cls = 'wrong'; }
            return `<button class="qz-opt ${cls}" data-k="${k}" ${done ? 'disabled' : ''}><span class="L">${'ABCD'[k]}</span><span>${o}</span></button>`;
          }).join('')}</div>
          ${done ? `<div class="note ${answers[i] === q.ans ? 'tip' : 'trap'} qz-why"><span class="nt">${answers[i] === q.ans ? 'Correct' : 'Not quite. The answer is ' + 'ABCD'[q.ans]}</span>${p(q.why)}</div>` : ''}
        </div>
        <div class="qz-nav">
          <button class="btn ghost" id="qQuit">✕ Quit</button>
          ${done ? `<button class="btn primary" id="qNext">${i === qs.length - 1 ? 'See results' : 'Next →'}</button>` : '<span class="muted" style="font-size:13px">Pick an answer</span>'}
        </div>
      </div>`;
      $$('.qz-opt', box).forEach(b => b.onclick = () => choose(+b.dataset.k));
      $('#qQuit').onclick = intro;
      const n = $('#qNext'); if (n) { n.onclick = next; n.focus({ preventScroll: true }); }
    }
    function choose(k) { if (answers[i] != null) return; answers[i] = k; draw(); }
    function next() { if (i < qs.length - 1) { i++; draw(); window.scrollTo({ top: $('.tabs').offsetTop - 60, behavior: 'smooth' }); } else results(); }
    function results() {
      const s = answers.filter((a, k) => a === qs[k].ans).length;
      const best = store.get(bestKey, null);
      if (qs.length === w.quiz.length && (!best || s / qs.length >= best.s / best.n)) store.set(bestKey, { s, n: qs.length });
      const missed = qs.filter((q, k) => answers[k] !== q.ans);
      const pct = Math.round(100 * s / qs.length);
      box.innerHTML = `<div class="card qz-res">
        <div class="eyebrow">Result</div>
        <div class="score">${s}/${qs.length}</div>
        <p class="muted">${pct >= 85 ? "You're ready to be the SME for this week." : pct >= 65 ? 'Close. Review the misses below, then retry them.' : 'Go back through the Study tab (start with the Trap board), then retry.'}</p>
        <div class="opts" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
          ${missed.length ? `<button class="btn primary" id="qRetry">Retry the ${missed.length} missed</button>` : ''}
          <button class="btn" id="qAgain">New full run</button>
          <a class="btn ghost" href="#/${w.id}">Back to Study</a>
        </div>
        <div class="qz-review">${qs.map((q, k) => `<div class="rv ${answers[k] === q.ans ? 'good' : 'bad'}"><div class="q">${k + 1}. ${q.q}</div><div class="a"><b>${q.opts[q.ans]}</b>${answers[k] !== q.ans ? ` <span style="color:var(--bad)">· you chose: ${q.opts[answers[k]]}</span>` : ''}</div>${answers[k] !== q.ans ? `<div class="a" style="margin-top:6px">${q.why}</div>` : ''}</div>`).join('')}</div>
      </div>`;
      const r = $('#qRetry'); if (r) r.onclick = () => start(shuffle(missed.map(m => w.quiz.find(x => x.q === m.q))));
      $('#qAgain').onclick = () => start(shuffle(w.quiz));
    }
    const onKey = e => {
      if (drawerOpen || !qs.length || !$('.qz-opts', box) || e.target.matches('input, textarea')) return;
      const n = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 }[e.key.toLowerCase()];
      if (n != null && answers[i] == null && n < qs[i].opts.length) choose(n);
      else if (e.key === 'Enter' && answers[i] != null) { e.preventDefault(); next(); }
    };
    document.addEventListener('keydown', onKey); cleanup.push(() => document.removeEventListener('keydown', onKey));
    intro();
  }

  /* ── Answer practice ── */
  function renderPractice(w, body) {
    const dk = 'draft:' + w.id;
    const drafts = store.get(dk, {});
    body.innerHTML = `<div class="ap-wrap">
      <div class="note info"><span class="nt">How to use this</span>These are assignment-style scenarios for your week. Start the 10-minute timer (your in-room budget per question), draft an answer using <b>Name → Define → Apply → Recommend</b>, then reveal the model answer and compare which concepts you named. Drafts save on this device.</div>
      ${w.prompts.map((pr, k) => `
        <div class="card ap" data-k="${k}">
          <div class="ph"><span class="chip acc">Scenario ${k + 1}</span><span class="timer" data-t="600">10:00</span></div>
          <div class="qtext">${pr.q}</div>
          <textarea placeholder="Name the concept → define it → apply it to the scenario → recommend…" aria-label="Your draft answer">${''}</textarea>
          <div class="tools">
            <button class="btn" data-act="timer">▶ Start timer</button>
            <button class="btn primary" data-act="reveal">Reveal model answer</button>
            <span class="muted" style="font-size:12.5px" data-saved></span>
          </div>
          <div class="model hide">
            <div class="mrow"><div class="k">Name</div><div class="v">${pr.name}</div></div>
            <div class="mrow"><div class="k">Define</div><div class="v">${pr.define}</div></div>
            <div class="mrow"><div class="k">Apply</div><div class="v">${pr.apply}</div></div>
            <div class="mrow"><div class="k">Recommend</div><div class="v">${pr.recommend}</div></div>
            ${pr.also ? `<div class="note tip" style="margin-top:4px"><span class="nt">Other concepts that would also earn marks</span>${p(pr.also)}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>`;

    const timers = [];
    $$('.ap', body).forEach(card => {
      const k = card.dataset.k; const ta = $('textarea', card); ta.value = drafts[k] || '';
      let saveT; ta.addEventListener('input', () => { clearTimeout(saveT); saveT = setTimeout(() => { drafts[k] = ta.value; store.set(dk, drafts); $('[data-saved]', card).textContent = 'Draft saved'; }, 400); });
      const tEl = $('.timer', card); let left = 600, h = null;
      const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      $('[data-act="timer"]', card).onclick = e => {
        const b = e.currentTarget;
        if (h) { clearInterval(h); h = null; b.textContent = '▶ Resume'; return; }
        if (left <= 0) { left = 600; tEl.classList.remove('low'); }
        b.textContent = '❚❚ Pause';
        h = setInterval(() => { left--; tEl.textContent = fmt(left); tEl.classList.toggle('low', left <= 60); if (left <= 0) { clearInterval(h); h = null; b.textContent = '↻ Restart'; toast("Time's up. Move to the next question."); } }, 1000);
        timers.push(() => clearInterval(h));
      };
      $('[data-act="reveal"]', card).onclick = e => { const m = $('.model', card); m.classList.toggle('hide'); e.currentTarget.textContent = m.classList.contains('hide') ? 'Reveal model answer' : 'Hide model answer'; };
    });
    cleanup.push(() => timers.forEach(f => f()));
  }

  /* ── boot ── */
  document.addEventListener('DOMContentLoaded', () => {
    $('#themeBtn').onclick = () => { const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; store.set('theme', t); applyTheme(t); };
    applyTheme(store.get('theme', 'dark'));
    $('#menuBtn').onclick = () => setDrawer(!drawerOpen);
    $('#drawerClose').onclick = () => setDrawer(false);
    $('#scrim').onclick = () => setDrawer(false);
    $('#drawerNav').addEventListener('click', e => { const a = e.target.closest('a'); if (a && a.getAttribute('href').startsWith('#')) setDrawer(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawerOpen) setDrawer(false); });
    route();
  });
})();
