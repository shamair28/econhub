/* Week 1 — Intro to OB (Ch 1 + Week 1 handout) */
SME.addWeek({
  id: 'w1', num: 1, title: 'Intro to OB', dates: 'Sept 8–11',
  chapterLine: 'Ch 1',
  chapters: [
    { c: 'Ch 1', t: 'Organizational Behaviour and Management', s: '§1.1–1.7' },
    { c: 'Handout', t: 'S + T = R and the thermostat analogy', s: 'Week 1 thinking tools' }
  ],
  sources: ['Textbook Ch 1', 'Week 1 handout'],
  keys: ['Mintzberg’s 10 roles', 'Weber’s bureaucracy', 'Hawthorne', 'Contingency', '5 concerns', 'S + T = R'],

  brief: [
    '<b>OB</b> is the study of the attitudes and behaviours of individuals and groups in organizations. It has three goals: <b>predict</b> behaviour, <b>explain</b> it (harder, because behaviour has several causes that shift over time), and <b>manage</b> it. <b>Management</b> means getting things done in organizations <i>through others</i>, ideally using <b>evidence-based management</b>.',
    'Management thought moved from <b>classical</b> (Fayol; Taylor’s <b>scientific management</b>; Weber’s <b>bureaucracy</b>: specialization and central control) to the <b>human relations movement</b> (started by the <b>Hawthorne studies</b>: social and psychological factors drive productivity) to the <b>contingency approach</b> (no one best way; the right style fits the situation).',
    '<b>What managers do:</b> Mintzberg’s <b>10 roles in 3 categories</b> (informational, interpersonal, decisional) is the most-tested list. Also know Luthans’ <b>4 activities</b> (networkers get promoted fastest, HR-focused managers run the most effective units), Kotter’s <b>3 agenda elements</b>, and how managers use intuition.',
    '<b>Five contemporary concerns:</b> diversity · employee health &amp; well-being (mindfulness, spirituality, POB/PsyCap) · talent management &amp; engagement · alternative work arrangements (precarious work) · CSR (internal vs external).',
    '<b>Handout tools:</b> <b>S + T = R</b> (people respond to their <i>thinking</i> about a situation) and the <b>thermostat</b> (current state, then desired state, then close the gap, then measure and repeat). They give a group-assignment answer a diagnose-then-fix structure.'
  ],
  split: 'For Practice Q1 + Q2: <b>SME A</b> takes §1.1–1.5 (what OB is, the three goals, classical → human relations → contingency) plus the handout’s <b>S + T = R</b> schools table. <b>SME B</b> takes §1.6–1.7 (Mintzberg, Luthans, Kotter, intuition, the five contemporary concerns) plus the <b>thermostat</b>. Both should know Mintzberg’s 10 roles cold, since it’s the most likely question.',
  lens: 'Expect either (a) a manager’s day described in a paragraph ("which of Mintzberg’s roles is she playing and why?"), (b) a firm choosing a management style ("classical or human relations? use the contingency approach to recommend"), or (c) an open "what should this company do about X" question, where one of the five contemporary concerns is the concept to name.',

  sections: [
    {
      id: 'what', title: 'What organizations & OB are', ref: '§1.1–1.3',
      items: [
        { t: 'list', title: 'Organizations: 3 defining features', ref: '§1.1', intro: 'Organizations are <b>social inventions for accomplishing common goals through group effort</b>.',
          items: ['<b>Social inventions</b>: built on the coordinated presence of <i>people</i>, not necessarily buildings or capital.', '<b>Goal accomplishment</b>: including the basic goals of survival and adaptation to change.', '<b>Group effort</b>: formal teamwork <i>and</i> informal alliances among employees.'] },
        { t: 'def', term: 'Organizational behaviour (OB)', ref: '§1.2', def: 'The attitudes and behaviours of individuals and groups in organizations. OB studies them systematically and provides insight into managing and changing them, and into structuring organizations more effectively.' },
        { t: 'def', term: 'Human resources management (HRM)', ref: '§1.2', def: 'The programs, practices and systems used to <b>acquire, develop, motivate and retain</b> employees. OB supplies the theory under HRM practice: personality theory underlies selection, and learning theory underlies training.' },
        { t: 'cmp', title: 'Human capital vs social capital', ref: '§1.2', head: ['', 'Human capital', 'Social capital'],
          rows: [['What it is', 'Knowledge, skills and abilities (KSAs) embodied in employees: education, training, experience', 'Social resources gained from participating in a social structure: relationships, networks'],
                 ['Split', '—', '<b>Internal</b> (relationships inside your organization) vs <b>external</b> (relationships with outside constituents)'],
                 ['Why it matters', 'Strongly, positively related to organizational performance', 'Gives access to information, influence and support']] },
        { t: 'list', title: 'The three goals of OB', ref: '§1.3',
          items: ['<b>Predicting</b>: anticipating when and whether a behaviour will occur.', '<b>Explaining</b>: understanding <i>why</i> it occurs. This is harder than prediction because a behaviour can have several causes, and they shift over time.', '<b>Managing</b>: using that understanding to take effective action.'],
          mnem: '<b>P → E → M</b> climbs in difficulty. You can <i>predict</i> without explaining (ancient societies predicted sunsets without knowing why), but you can’t <i>manage</i> well without explaining.' },
        { t: 'def', term: 'Management', ref: '§1.3', def: 'The art of getting things accomplished in organizations <b>through others</b>.' },
        { t: 'def', term: 'Evidence-based management', ref: '§1.3', def: 'Translating principles based on the <b>best scientific evidence</b> into organizational practice, instead of relying on personal preference, unsystematic experience or a "quick fix."' },
        { t: 'note', tone: 'trap', title: 'Predicting ≠ explaining', body: 'If a scenario says the manager can <i>anticipate</i> a behaviour but "has never figured out why," the goal is <b>predicting</b>. "Contingency planning" is a distractor and isn’t one of the three goals.' },
        { t: 'note', tone: 'trap', title: 'Evidence-based ≠ experience-based', body: 'Distractors swap in "intuition-based" or "experience-based" management. The text defines evidence-based management <i>against</i> unsystematic experience and quick fixes.' }
      ]
    },
    {
      id: 'history', title: 'Early prescriptions: classical → human relations', ref: '§1.4',
      items: [
        { t: 'def', term: 'Classical viewpoint', ref: '§1.4', def: 'Early-1900s prescription (<b>Fayol, Mooney, Urwick</b>): a high degree of <b>specialization of labour</b> and <b>intensive coordination</b> through <b>centralized decision making</b> at the top.' },
        { t: 'def', term: 'Scientific management (Frederick Taylor)', ref: '§1.4', def: 'The part of the classical school focused on <b>job design and shop-floor work</b>. It used careful research (not rules of thumb) to find the best degree of specialization and standardization, with written instructions and standardized movements and breaks.',
          more: '<b>Functional foremanship</b>: Taylor even specialized supervision. One supervisor trains, another disciplines, and so on. This term is a favourite distractor in Kotter and Mintzberg questions.' },
        { t: 'list', title: 'Weber’s bureaucracy: 5 qualities', ref: '§1.4', intro: 'Max Weber’s "ideal type" for rationally managing complex organizations. It standardizes behaviour and gives workers security in exchange for conformity.',
          items: ['A strict <b>chain of command</b>: everyone reports to a single superior.', '<b>Selection and promotion on impersonal technical skill</b>, not nepotism or favouritism.', 'Detailed <b>rules, regulations and procedures</b>, so the job gets done whoever does it.', 'Strict <b>specialization</b> that matches duties to technical competence.', '<b>Centralization</b> of power at the top.'],
          mnem: '<b>"Can Smart Rules Stop Chaos?"</b> Chain of command · Skill-based selection · Rules · Specialization · Centralization.' },
        { t: 'note', tone: 'trap', title: 'Taylor vs Weber', body: '<b>Scientific management</b> (Taylor) is about designing <i>individual jobs and tasks</i>. <b>Bureaucracy</b> (Weber) is about the <i>whole organization’s structure</i>: chain of command, promotion rules, centralization. "Which is NOT a quality of bureaucracy" questions like to slip in "decentralized decision making" or "participative management."' },
        { t: 'def', term: 'Human relations movement', ref: '§1.4', def: 'A critique of classical management and bureaucracy that argued for more <b>people-oriented, participative</b> management. It began with the <b>Hawthorne studies</b>.',
          more: '<b>Hawthorne studies</b> (1920s–30s, Western Electric’s Hawthorne plant near Chicago; Elton Mayo and Fritz Roethlisberger of Harvard, William Dickson of Hawthorne) found that <i>psychological and social processes</i>, not just physical conditions like lighting, affect productivity and adjustment to work. Postwar critics: <b>Argyris, Gouldner, Likert</b>.' },
        { t: 'list', title: 'Human relations critique: 4 problems with bureaucracy', ref: '§1.4',
          items: ['<b>Strict specialization</b> conflicts with people’s needs for growth and achievement, which leads to <b>alienation</b>.', '<b>Strong centralization</b> wastes the creative knowledge of lower-level members. This hurts learning and innovation and increases resistance to change.', '<b>Impersonal rules become a performance ceiling</b>: the minimum acceptable level becomes the norm.', '<b>Specialization</b> makes members lose sight of the organization’s overall goals (the <b>"red-tape mentality"</b>).'],
          mnem: '<b>A-W-C-R: "Alienated Workers Can’t Rise."</b> Alienation · Wasted knowledge · Ceiling · Red tape.' },
        { t: 'cmp', title: 'Three schools at a glance', head: ['', 'Classical', 'Human relations', 'Contingency'],
          rows: [['Core idea', 'One best way: specialize, standardize, centralize', 'People are social; participation and morale drive productivity', 'No one best way; fit the style to the situation'],
                 ['Names', 'Fayol, Taylor, Weber', 'Hawthorne (Mayo), Argyris, Likert', '—'],
                 ['Fits best', 'Routine, error-intolerant work', 'Work needing commitment and ideas', 'Diagnose first, then choose']] }
      ]
    },
    {
      id: 'contingency', title: 'The contingency approach', ref: '§1.5',
      items: [
        { t: 'def', term: 'Contingency approach', ref: '§1.5', def: 'There is <b>no one best way</b> to manage. The appropriate style depends on the <b>demands of the situation</b>. This resolves the classical vs human relations debate.',
          more: 'Textbook example: a <b>payroll department</b> (routine, error-intolerant) is usually managed more bureaucratically than an <b>R&amp;D department</b> (which needs flexibility and creativity). Use this pair in any "same style for two departments?" question.' },
        { t: 'note', tone: 'tip', title: 'Answer pattern', body: 'For "should the firm roll out one management style everywhere?", <b>name</b> the contingency approach, <b>define</b> it, <b>apply</b> it by contrasting the routine unit (bureaucratic fits) with the creative unit (looser fits), then <b>recommend</b> different styles per unit.' }
      ]
    },
    {
      id: 'managers', title: 'What managers do', ref: '§1.6',
      items: [
        { t: 'groups', title: 'Mintzberg’s 10 managerial roles', ref: '§1.6', intro: 'From Henry Mintzberg’s study of managers. It’s the single most testable list in Week 1.',
          groups: [
            { name: 'Interpersonal', items: ['<b>Figurehead</b>: symbolic duties (signing documents, entertaining clients, ribbon-cuttings)', '<b>Leader</b>: selects, mentors, rewards and disciplines employees', '<b>Liaison</b>: keeps horizontal contacts inside and outside the organization'] },
            { name: 'Informational', items: ['<b>Monitor</b>: scans the environment and gathers information and trends', '<b>Disseminator</b>: sends information <i>inside</i> the organization', '<b>Spokesperson</b>: sends information <i>outside</i> (media, stockholders)'] },
            { name: 'Decisional', items: ['<b>Entrepreneur</b>: turns problems and opportunities into plans for change', '<b>Disturbance handler</b>: deals with conflicts and threats to resources or turf', '<b>Resource allocator</b>: decides how time, money and people are deployed', '<b>Negotiator</b>: conducts major negotiations with other parties'] }
          ],
          mnem: '<b>3 + 3 + 4.</b> Interpersonal: <b>"FLL"</b> (Figurehead, Leader, Liaison). Informational follows the flow of information: <b>Monitor</b> brings it IN, <b>Disseminator</b> passes it AROUND inside, <b>Spokesperson</b> sends it OUT. Decisional: <b>"Every Decision Requires Negotiation"</b> (Entrepreneur, Disturbance handler, Resource allocator, Negotiator).' },
        { t: 'note', tone: 'trap', title: 'Monitor vs disseminator vs spokesperson', body: 'Attending a conference to learn trends = <b>monitor</b>. Briefing <i>your team</i> on what you learned = <b>disseminator</b>. Talking to the <i>media or shareholders</i> = <b>spokesperson</b>. Also: liaison is about <i>contacts</i>, not relaying information.' },
        { t: 'list', title: 'Luthans et al.: 4 managerial activities', ref: '§1.6',
          items: ['<b>Routine communication</b>: formal information exchange, paperwork.', '<b>Traditional management</b>: planning, decision making, controlling.', '<b>Networking</b>: interacting with outsiders, plus informal socializing and politicking with insiders.', '<b>Human resource management</b>: motivating, disciplining, staffing, training.'],
          after: '<b>Key finding:</b> managers who <b>network</b> most get <b>promoted fastest</b>, but managers who spend more time on <b>HRM</b> (and less on networking) run the <b>most effective units</b> with the most satisfied employees. That’s a real trade-off between personal advancement and team performance.' },
        { t: 'list', title: 'Kotter: 3 elements of what effective general managers do', ref: '§1.6',
          items: ['<b>Agenda setting</b>: informal, unwritten, people-focused goals, often set before formally starting the role.', '<b>Networking</b>: a wide formal and informal network inside and outside the organization.', '<b>Agenda implementation</b>: using the network plus many influence tactics (from direct orders to subtle stories) to get the agenda done.'] },
        { t: 'note', tone: 'trap', title: '"Networking" is in two lists', body: 'Networking appears in both <b>Luthans</b> (4 activities) and <b>Kotter</b> (3 elements), but the lists are otherwise different and come from different researchers. <b>Functional foremanship</b> belongs to Taylor, not Kotter.' },
        { t: 'list', title: 'Managerial intuition (Simon & Isenberg): 4 uses', ref: '§1.6', intro: 'Intuition is <i>not</i> the opposite of rationality. Experienced managers use it to:',
          items: ['Sense that a problem exists.', 'Perform well-learned mental tasks rapidly.', 'Synthesize isolated pieces of information.', 'Double-check more formal or mechanical analyses.'] },
        { t: 'def', term: 'Culture and the manager’s role (Hofstede)', ref: '§1.6', def: 'National culture shapes the role of "manager." Managers are cultural heroes in individualist North America but are downplayed elsewhere: next to engineers (Germany), group solidarity (Japan), modesty and consensus (Netherlands), or family control (Taiwan, Singapore). National culture is one of OB’s most important <b>contingency variables</b>.' }
      ]
    },
    {
      id: 'concerns', title: 'Five contemporary management concerns', ref: '§1.7',
      lede: 'A common question gives you a term (PsyCap, precarious work, engagement, external CSR) and asks which concern it belongs under. Learn the concerns <i>with</i> their sub-terms.',
      items: [
        { t: 'groups', title: 'The five concerns and what sits under each', ref: '§1.7',
          groups: [
            { name: '1 · Diversity: local & global', items: ['Driven by changing demographics and globalization'] },
            { name: '2 · Health & well-being', items: ['Mindfulness', 'Workplace spirituality', 'Organizational care', 'Positive OB (POB) → PsyCap', 'Thriving at work'] },
            { name: '3 · Talent mgmt & engagement', items: ['Talent management', 'Work engagement (vigour, dedication, absorption)'] },
            { name: '4 · Alternative work arrangements', items: ['Precarious work'] },
            { name: '5 · CSR', items: ['External CSR (community, environment, consumers)', 'Internal CSR (the workforce)', 'ESG'] }
          ],
          mnem: '<b>"Do Healthy Teams Act Responsibly?"</b> Diversity · Health &amp; well-being · Talent &amp; engagement · Alternative arrangements · Responsibility (CSR).' },
        { t: 'def', term: 'Mindfulness', ref: '§1.7', def: 'Being highly aware of and attentive to the present moment.' },
        { t: 'def', term: 'Workplace spirituality', ref: '§1.7', def: 'A workplace that provides <b>meaning, purpose, community and connection</b>. It is <i>not</i> religion.' },
        { t: 'def', term: 'Positive organizational behaviour (POB) & PsyCap', ref: '§1.7', def: 'POB is the study and application of positive human-resource strengths. It rests on <b>psychological capital (PsyCap)</b>: <b>self-efficacy, optimism, hope and resilience</b>. The related idea of <b>thriving at work</b> is a joint sense of <b>vitality and learning</b>.',
          mnem: 'PsyCap = <b>HERO</b>: Hope · Efficacy · Resilience · Optimism.' },
        { t: 'def', term: 'Talent management', ref: '§1.7', def: 'An organization’s processes for <b>attracting, developing, retaining and deploying</b> people with the skills it needs.' },
        { t: 'def', term: 'Work engagement', ref: '§1.7', def: 'A positive work-related state characterized by <b>vigour, dedication and absorption</b>.', mnem: 'Engaged workers have <b>VDA</b>: Vigour, Dedication, Absorption.' },
        { t: 'def', term: 'Precarious work', ref: '§1.7', def: 'Work that is <b>risky, uncertain and unpredictable</b>: unstable, low or unreliable pay, no benefits, few protections. It falls disproportionately on women, immigrants and racialized workers.' },
        { t: 'def', term: 'Corporate social responsibility (CSR)', ref: '§1.7', def: 'An organization taking responsibility for the impact of its decisions and actions on its <b>stakeholders</b>. <b>External CSR</b> covers community, environment and consumers. <b>Internal CSR</b> covers the workforce. It’s linked to <b>ESG</b> (environmental, social, governance) evaluation.' },
        { t: 'note', tone: 'tip', title: 'Real examples to drop into an answer', body: '<b>Klick Health</b> (donated masks and intubation boxes, a DE&amp;I council, pay-equity reviews): diversity + well-being + CSR in one firm. <b>Tim Hortons</b> franchisees cutting benefits after Ontario’s minimum-wage hike, which led to boycotts: a quick fix rather than evidence-based management.' }
      ]
    },
    {
      id: 'handout', title: 'Week 1 handout: S + T = R and the thermostat', src: 'hand',
      lede: 'Not in the textbook, but handed out in Week 1 as tools for the whole term, especially for consulting-style group-assignment questions.',
      items: [
        { t: 'formula', title: 'S + T = R', src: 'hand', f: 'Situation + Thinking = Response (behaviour)', body: 'People respond to their <b>interpretation</b> of a situation, not to the situation itself. Each management school is a different set of manager beliefs (T) that produces a different management style (R).' },
        { t: 'cmp', title: 'S + T = R across the management schools', src: 'hand', head: ['School', 'Manager’s thinking (T)', 'Resulting style (R)'],
          rows: [['Classical / traditional', 'Work must be tightly specified; employees need rules and close control', 'Narrow roles, detailed job descriptions, rules and regulations'],
                 ['Human relations', 'Employees have social and psychological needs; satisfied, recognized people are productive', 'Attention to morale, recognition, participation'],
                 ['Human resources <span class="badge hand">handout only</span>', 'Employees are capable, self-directed resources to be developed', 'Delegation, development, involvement'],
                 ['Contingency / systems', 'No one best way; the organization is a system of interrelated parts', 'Diagnose the situation, then fit the style']] },
        { t: 'note', tone: 'trap', title: 'Three schools or four?', body: 'The <b>textbook</b> teaches three (classical, human relations, contingency). The <b>handout</b> adds "human resources" and "systems." Also, the human resources <i>perspective</i> is not the same thing as human resources <i>management</i> (HRM).' },
        { t: 'flow', title: 'The thermostat analogy: 4-step change cycle', src: 'hand', loop: true,
          steps: [{ h: '1 · Current state', d: 'The current temperature. Diagnose it with a <b>SWOT</b> analysis.' }, { h: '2 · Desired state', d: 'The setting: a concrete target (lowest-cost producer, most innovative team…)' }, { h: '3 · Close the gap', d: 'Size the gap, set goals and action steps, carry them out.' }, { h: '4 · Measure & repeat', d: 'How close did you get? Start again.' }],
          mnem: '<b>"Read, Set, Close, Check."</b> It’s a loop: step 4 feeds step 1.' },
        { t: 'note', tone: 'tip', title: 'Using both in a group answer', body: '<b>S + T = R</b> explains <i>why</i> the current state looks the way it does, which is how you do step 1 well. The <b>thermostat</b> structures <i>what to do about it</i>. A strong answer: diagnose the thinking → name the desired state → propose steps using a chapter concept → say how you’d measure success. For any case, ask what the person might be <i>thinking</i> that makes them demotivated or dissatisfied. Later chapters supply the candidate T’s: perception (Ch 3), fairness (Ch 4), expectancy and equity (Ch 5).' }
      ]
    }
  ],

  quiz: [
    { q: 'During a staff meeting, a marketing director spends 20 minutes telling her team what she learned at last week’s industry conference. Which Mintzberg role is she performing?', o: ['Disseminator', 'Spokesperson', 'Monitor', 'Liaison'], a: 0, why: 'She is sending information to people <b>inside</b> the organization. Spokesperson sends it <i>outside</i>. Monitor was the act of gathering it at the conference, which already happened. Liaison is about keeping horizontal contacts.' },
    { q: 'A manager flies to a trade show mainly to learn what competitors are launching next year. Which role?', o: ['Monitor', 'Disseminator', 'Entrepreneur', 'Figurehead'], a: 0, why: '<b>Monitor</b>: scanning the environment for information and trends. Disseminating would be sharing it internally afterwards.' },
    { q: 'A CEO gives a televised interview explaining the firm’s quarterly results. Which role?', o: ['Spokesperson', 'Disseminator', 'Figurehead', 'Negotiator'], a: 0, why: '<b>Spokesperson</b> sends information into the <i>external</i> environment (media, shareholders). Figurehead is symbolic duty, not information transmission.' },
    { q: 'A supervisor steps in to stop a shouting match between two reps and then decides who gets first pick of overtime. Which two decisional roles?', o: ['Disturbance handler and resource allocator', 'Leader and negotiator', 'Liaison and entrepreneur', 'Monitor and disturbance handler'], a: 0, why: 'Handling conflict = <b>disturbance handler</b>. Deploying a scarce resource (overtime) = <b>resource allocator</b>. Both are decisional roles.' },
    { q: 'Which of the following is NOT one of Weber’s qualities of bureaucracy?', o: ['Decentralized decision making by front-line employees', 'A strict chain of command', 'Selection and promotion based on technical skill', 'Detailed rules and procedures'], a: 0, why: 'Weber called for <b>centralization</b> of power at the top. Decentralization is the opposite, and it’s what the human relations critics wanted.' },
    { q: 'The Hawthorne studies are most closely associated with the rise of:', o: ['The human relations movement', 'Scientific management', 'Bureaucracy', 'Evidence-based management'], a: 0, why: 'Hawthorne showed that social and psychological factors affect productivity, and that launched the <b>human relations movement</b>.' },
    { q: 'A manager can reliably tell when two senior developers will threaten to quit after a product launch, but has no idea why. This illustrates which goal of OB?', o: ['Predicting', 'Explaining', 'Managing', 'Contingency planning'], a: 0, why: 'Anticipating behaviour without knowing the cause is <b>predicting</b>. "Contingency planning" isn’t one of the three goals.' },
    { q: 'A firm manages its payroll unit with tight procedures and its R&D unit with loose, flexible rules. This best reflects:', o: ['The contingency approach', 'The classical viewpoint', 'Scientific management', 'The human relations movement'], a: 0, why: 'Matching the style to the demands of each unit’s situation is the <b>contingency approach</b>, and this is the textbook’s own example.' },
    { q: 'Which is NOT one of Kotter’s three elements of what effective general managers do?', o: ['Functional foremanship', 'Agenda setting', 'Networking', 'Agenda implementation'], a: 0, why: '<b>Functional foremanship</b> is Taylor’s idea (supervisors specialize by function).' },
    { q: 'According to Luthans and colleagues, managers who spend the most time networking tend to:', o: ['Be promoted fastest, though their units aren’t the most effective', 'Run the most effective units', 'Have the most satisfied employees', 'Avoid routine communication entirely'], a: 0, why: 'Networking brings the <b>fastest promotion</b>. Time on <b>HRM</b> brings the most effective units and the most satisfied employees. It’s a trade-off.' },
    { q: 'Psychological capital (PsyCap) falls under which contemporary management concern?', o: ['Employee health and well-being', 'Talent management and engagement', 'Corporate social responsibility', 'Diversity'], a: 0, why: 'PsyCap (hope, efficacy, resilience, optimism) is the basis of <b>positive OB</b>, which sits under <b>employee health and well-being</b>.' },
    { q: 'Work that is risky, uncertain and unpredictable, with low or unreliable pay and few protections, is called:', o: ['Precarious work', 'Workplace spirituality', 'Internal CSR', 'Job crafting'], a: 0, why: '<b>Precarious work</b>, which falls under <b>alternative work arrangements</b>.' },
    { q: 'Work engagement is characterized by:', o: ['Vigour, dedication and absorption', 'Hope, efficacy and resilience', 'Meaning, purpose and community', 'Vitality and learning'], a: 0, why: 'Engagement = <b>vigour, dedication, absorption</b>. Hope/efficacy/resilience/optimism is PsyCap. Meaning/purpose/community is spirituality. Vitality + learning is thriving.' },
    { q: 'Which is part of the human relations critique of bureaucracy?', o: ['Impersonal rules become a performance ceiling: the minimum becomes the norm', 'Promotion on technical skill encourages nepotism', 'Centralization improves learning and innovation', 'Specialization increases commitment to overall goals'], a: 0, why: 'Rules set a minimum acceptable level that turns into the <b>ceiling</b>. The other options reverse the critique: centralization <i>wastes</i> ideas, and specialization <i>causes</i> the red-tape mentality.' },
    { q: 'Taylor’s scientific management focused mainly on:', o: ['Designing and standardizing individual jobs on the shop floor', 'Organization-wide chain of command and promotion rules', 'Participative, people-oriented management', 'Adapting management to each situation'], a: 0, why: 'Taylor = <b>job design</b> and standardizing physical work. Chain of command and promotion rules are Weber’s bureaucracy.' },
    { q: 'In the handout’s S + T = R, the "T" stands for:', o: ['Thinking: the person’s interpretation of the situation', 'Task: the work itself', 'Training received', 'Time pressure'], a: 0, why: '<b>Situation + Thinking = Response.</b> People respond to how they interpret a situation, not to the situation itself.' },
    { q: 'In the thermostat analogy, what comes first, and with what tool?', o: ['Assess the current state with a SWOT analysis', 'Set the desired state with a mission statement', 'Close the gap with an action plan', 'Measure results with a balanced scorecard'], a: 0, why: '<b>Read, Set, Close, Check</b>: step 1 is the <b>current state</b>, diagnosed with <b>SWOT</b>.' },
    { q: 'A firm donates to local shelters and cuts packaging waste. It also runs pay-equity reviews for its own staff. The pay-equity reviews are an example of:', o: ['Internal CSR', 'External CSR', 'Talent management', 'Workplace spirituality'], a: 0, why: 'CSR aimed at the <b>workforce</b> is <b>internal CSR</b>. The community and environment work is external CSR.' }
  ],

  prompts: [
    { q: 'Priya manages a small customer-service team. She spends mornings answering teammates’ informal questions, updates her boss on team morale, sometimes breaks up arguments between reps, and decides who gets first pick of overtime shifts. <b>Using Mintzberg’s framework, identify and explain two or more roles Priya performs, and recommend how she could manage her time better.</b>',
      name: '<b>Mintzberg’s managerial roles</b>: disseminator (informational), disturbance handler and resource allocator (decisional).',
      define: 'Mintzberg found managers perform 10 roles in three categories: interpersonal, informational and decisional. The disseminator passes information to others inside the organization. The disturbance handler deals with conflicts and threats. The resource allocator decides how time, money and people are deployed.',
      apply: 'Updating her boss on morale = <b>disseminator</b> (relaying information gathered from the team). Breaking up arguments = <b>disturbance handler</b>. Assigning overtime = <b>resource allocator</b> (a scarce resource). Answering questions could also be <b>leader</b> (mentoring).',
      recommend: 'She is playing several roles reactively. She should separate them: set times for informational duties, and deliberately schedule resource decisions (a transparent overtime rota) so they don’t get squeezed between interruptions. Tie this to Luthans: more time on HRM activities predicts unit effectiveness.',
      also: 'Luthans’ HRM activity; leader role; contingency approach.' },
    { q: 'A mid-sized accounting firm runs a year-end tax-filing department (high volume, zero tolerance for error, strict deadlines) and a new advisory division (small teams solving novel client problems). The COO wants one management style everywhere: detailed procedures, tight supervision, standardized workflows. <b>Evaluate the plan.</b>',
      name: '<b>Contingency approach</b>, contrasted with the <b>classical viewpoint</b>/bureaucracy and the <b>human relations</b> critique.',
      define: 'The contingency approach says there is no one best way to manage. The right style depends on the demands of the situation.',
      apply: 'Tax filing looks like the textbook’s payroll example: routine and error-intolerant, so a bureaucratic style (rules, specialization, centralized control) fits. The advisory division looks like R&amp;D: tight rules would suppress creativity and waste front-line knowledge, and rules would become a performance ceiling.',
      recommend: 'Keep standardized, closely supervised workflows in tax. Give advisory teams autonomy, looser rules and decentralized decisions. Review fit over time (thermostat: measure and repeat).',
      also: 'Weber’s five qualities; human relations critique of bureaucracy (alienation, wasted knowledge).' },
    { q: 'A retail chain’s store managers complain that part-time staff "just don’t care." Head office asks your group to diagnose the problem and propose a fix. <b>Use course concepts to structure your answer.</b>',
      name: '<b>S + T = R</b> and the <b>thermostat analogy</b> (handout), plus the <b>human relations movement</b> and <b>evidence-based management</b>.',
      define: 'S + T = R: people respond to their interpretation (thinking) of a situation, not to the situation itself. The thermostat is a four-step change cycle: current state, desired state, close the gap, measure and repeat.',
      apply: 'Current state: staff behaviour (R) reflects what they think (T). Maybe they think effort goes unrecognized, or that the rules treat them as interchangeable (a classical-style T from managers). Diagnose with a SWOT and by asking staff. Desired state: a concrete target, e.g. lower turnover and better service scores.',
      recommend: 'Close the gap with human-relations practices: recognition, participation, attention to morale. Measure turnover and satisfaction each quarter and repeat. Base the changes on evidence (surveys, data), not a quick fix.',
      also: 'Talent management and engagement; health and well-being (contemporary concerns).' },
    { q: 'A tech company wants to be known as a "great place to work" and asks your group what it should focus on. <b>Recommend a plan using the contemporary management concerns.</b>',
      name: 'The <b>five contemporary management concerns</b>, especially <b>health &amp; well-being</b> (POB/PsyCap), <b>talent management &amp; engagement</b>, and <b>internal CSR</b>.',
      define: 'Work engagement is a positive state of vigour, dedication and absorption. Talent management is attracting, developing, retaining and deploying people with needed skills. Internal CSR is responsibility toward the workforce.',
      apply: 'Reputation as an employer comes from how employees experience the firm: well-being programs (e.g. Sun Life’s "wellness dollars"), development paths, fair and diverse hiring (diversity), and flexible arrangements that avoid precarious work.',
      recommend: 'Pick two or three concerns and give each a concrete program plus a metric: an engagement survey, retention rates, a diversity climate measure. Link it to <b>evidence-based management</b>: run pilots, measure, and keep what works.',
      also: 'Diversity; alternative work arrangements; evidence-based management.' }
  ]
});
