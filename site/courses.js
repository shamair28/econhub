/* site/courses.js — the Study Hub site map.
 *
 * Single source of truth for the homepage, the lesson-page side menu, the prev/next
 * chapter links and the "practise this chapter" links. Adding a chapter page means:
 * add it to `chapters` below + add its `_redirects` line. Nothing else links by hand.
 *
 *   courses[].chapters  { n, title }                  → page lives at /<code>/ch<n>
 *   courses[].tools     interactive prep pages for the course (title/kind/short = text, desc = HTML)
 *       chapters: [1, 2, 3]                            → chapters this tool covers (links to href)
 *       chapters: { 2: [['#/w2', 'Week 2 · §2.1–2.3']] } → per-chapter deep links (href + hash)
 *   events              upcoming tests; shown on the homepage until they are over
 *
 * Course colours live in site.css (--c-<code>).
 */
window.HUB_SITE = {
  courses: [
    {
      code: '1B03', dept: 'ECON',
      title: 'Introductory Microeconomics',
      book: '<em>Microeconomics</em> — Hubbard, O’Brien, Serletis &amp; Childs, 4th Canadian Ed.',
      chapters: [
        { n: 1, title: 'Economics: Foundations and Models' },
        { n: 2, title: 'Trade-offs, Comparative Advantage, and the Market System' },
        { n: 3, title: 'Where Prices Come From: The Interaction of Supply and Demand' }
      ],
      tools: [
        {
          href: '/1B03/midterm1', icon: '✎', kind: 'Practice test',
          title: 'Midterm 1 Practice',
          desc: 'Units 1–4 · F22 practice midterm + lecture-slide questions · graph-drawing drills · timed exam mode',
          chapters: [1, 2, 3, 4]
        }
      ]
    },
    {
      code: '1BB3', dept: 'ECON',
      title: 'Introductory Macroeconomics',
      book: '<em>Macroeconomics</em> — Hubbard, O’Brien, Serletis &amp; Childs, 4th Canadian Ed.',
      chapters: [
        { n: 1, title: 'Economics: Foundations and Models' },
        { n: 2, title: 'Trade-offs, Comparative Advantage, and the Market System' },
        { n: 3, title: 'Where Prices Come From: The Interaction of Supply and Demand' },
        { n: 4, title: 'GDP: Measuring Total Production and Income' }
      ],
      tools: [
        {
          href: '/1BB3/test1', icon: '✎', kind: 'Practice test',
          title: 'Term Test 1 Practice',
          desc: 'Chapters 1–3 · Practice Test #1 + lecture-slide questions · graph-drawing drills · timed exam mode',
          chapters: [1, 2, 3]
        }
      ]
    },
    {
      code: '1BA3', dept: 'COMM',
      title: 'Organizational Behaviour',
      book: '<em>Organizational Behaviour</em> — Johns &amp; Saks, 13th Ed.',
      chapters: [
        { n: 1, title: 'Organizational Behaviour and Management' },
        { n: 2, title: 'Personality and Learning' },
        { n: 3, title: 'Perception, Attribution, and Diversity' },
        { n: 4, title: 'Values, Attitudes, and Work Behaviour' },
        { n: 5, title: 'Theories of Work Motivation' },
        { n: 6, title: 'Motivation in Practice' }
      ],
      tools: [
        {
          href: '/1BA3/sme', icon: '★', kind: 'Assignment prep',
          title: 'Group Assignment SME Prep',
          short: 'SME Prep',
          desc: 'Weeks 1–4 · pick your week · key concepts, traps &amp; memory aids · flashcards · self-quiz · timed answer practice',
          /* same chapter ↔ week map as the SME page's own side menu (1BA3/sme/sme.js) */
          chapters: {
            1: [['#/w1', 'Week 1']],
            2: [['#/w2', 'Week 2 · §2.1–2.3'], ['#/w4', 'Week 4 · §2.4–2.8']],
            3: [['#/w3', 'Week 3']],
            4: [['#/w2', 'Week 2']],
            5: [['#/w2', 'Week 2 · §5.2'], ['#/w4', 'Week 4 · §5.1, 5.3–5.6']],
            6: [['#/w4', 'Week 4']]
          }
        }
      ]
    },
    {
      code: '1ME3', dept: 'ECON',
      title: 'Introduction to Mathematical Economics',
      book: '<em>Mathematics for Economists</em> — Pemberton &amp; Rau, 4th Ed.',
      chapters: [
        { n: 1, title: 'Linear Equations' },
        { n: 2, title: 'Linear Inequalities' },
        { n: 3, title: 'Sets and Functions' },
        { n: 4, title: 'Quadratics, Indices and Logarithms' },
        { n: 5, title: 'Sequences, Series and Limits' }
      ],
      tools: []
    }
  ],

  /* Fall 2026 dates from the official course outlines. Local (Hamilton) time. */
  events: [
    { course: '1BB3', title: 'Term Test 1', start: '2026-09-26T09:00', end: '2026-09-26T10:00', scope: 'Ch. 1–3', tool: '/1BB3/test1' },
    { course: '1B03', title: 'Midterm Test 1', start: '2026-10-03T12:30', scope: 'Units 1–4 (Ch. 1–4)', tool: '/1B03/midterm1' },
    { course: '1BA3', title: 'Midterm', start: '2026-10-29T19:30', end: '2026-10-29T21:30', scope: 'Ch. 1–6, 10, 11.1–11.5' },
    { course: '1BB3', title: 'Term Test 2', start: '2026-11-07T09:00', end: '2026-11-07T10:20', scope: 'Ch. 4–8' },
    { course: '1B03', title: 'Midterm Test 2', start: '2026-11-07T12:30', scope: 'Units 5–8' }
  ]
};
