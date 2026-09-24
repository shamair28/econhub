/* Week 2 — Abilities, Personality, Values, Attitudes (Ch 2.1–2.3, Ch 4, Ch 5.2 + Week 2 slides) */
SME.addWeek({
  id: 'w2', num: 2, title: 'Abilities, Personality, Values & Attitudes', dates: 'Sept 14–18',
  chapterLine: 'Ch 2 (Part A), 4, 5.2',
  chapters: [
    { c: 'Ch 2', t: 'Personality', s: '§2.1–2.3', note: 'Part A only; Learning is Week 4' },
    { c: 'Ch 4', t: 'Values, Attitudes, and Work Behaviour', s: '§4.1–4.5' },
    { c: 'Ch 5', t: 'General Cognitive Ability & Emotional Intelligence', s: '§5.2 only' },
    { c: 'Slides', t: 'MBTI · Goleman’s EI model · CQ four sub-skills' }
  ],
  sources: ['Textbook Ch 2, 4, 5.2', 'Week 2 lecture deck'],
  keys: ['Big Five', 'Locus of control', 'CSE', 'Hofstede', '3 fairness types', 'Meyer & Allen', 'EI', 'CQ'],

  brief: [
    '<b>Abilities</b> are what you <i>can</i> do. The lecture groups three: <b>cognitive ability</b> (predicts performance in nearly every job, more so in complex ones), <b>emotional intelligence</b> (textbook: Salovey &amp; Mayer’s 4 branches; lecture: Goleman’s 4 domains) and <b>cultural intelligence</b> (text: 3 parts; lecture: 4 sub-skills). Ability and motivation combine <b>additively</b>, not multiplicatively.',
    '<b>Personality</b>: the modern view is <b>interactionist</b> (disposition × situation). Traits matter most in <b>weak situations</b>. The <b>Big Five</b> (conscientiousness is the best all-round predictor of performance), locus of control, self-monitoring, self-esteem, PA/NA (independent, not opposites), proactive personality, GSE, and <b>core self-evaluations</b> (4 traits). The lecture adds the <b>MBTI</b>.',
    '<b>Values</b> are broad preferences. Know <b>Hofstede’s 5 dimensions</b> with Canada’s profile (low power distance, weak uncertainty avoidance, individualist, short-term, middling masculinity), plus generations and person–organization fit.',
    '<b>Attitudes</b>: <b>belief + value → attitude → behaviour</b>. Job satisfaction comes from <b>discrepancy</b>, <b>fairness</b> (distributive = outcome · procedural = process · interactional = treatment), <b>disposition</b> and <b>mood/emotion</b> (emotional contagion, emotional labour).',
    '<b>Consequences</b>: satisfaction links weakly to absence, moderately to turnover (honeymoon–hangover), and to performance, OCB and customer satisfaction. <b>Commitment</b> (Meyer &amp; Allen): <b>affective</b> = want to · <b>continuance</b> = have to (the bad one for performance) · <b>normative</b> = ought to.'
  ],
  split: 'For Practice Q3 + Q4: <b>SME A</b> takes <b>Abilities + Personality</b> (§5.2 GCA &amp; EI, Goleman, §2.1–2.3, MBTI). <b>SME B</b> takes <b>Values + Attitudes</b> (all of Ch 4: Hofstede, CQ, job satisfaction, fairness, emotional labour, OCB, commitment). Ch 4 is the bigger half, but its lists are more scenario-friendly. Both should know the <b>three fairness types</b> and <b>three commitment types</b> cold.',
  lens: 'Typical asks: "Using the Big Five, which traits fit this role and how should the firm hire?"; "An employee got a fair raise but is still angry. Explain using fairness types"; "Why hasn’t this dissatisfied worker quit? (continuance commitment, turnover model)"; "A Canadian manager is posted to a high-power-distance, collectivist culture. What should they expect?"',

  sections: [
    {
      id: 'abilities', title: 'Abilities: cognitive, emotional, cultural', ref: '§5.2 + Week 2 slides',
      items: [
        { t: 'cmp', title: 'Ability vs personality', src: 'lec', head: ['', 'Ability', 'Personality'],
          rows: [['What it is', 'What a person is <b>capable of</b>', 'The relatively stable set of psychological characteristics that shapes how a person thinks, feels and behaves'],
                 ['Lecture’s three', 'Cognitive · emotional · cultural intelligence', 'Big Five, locus of control, self-monitoring, … (and the MBTI)']] },
        { t: 'def', term: 'General cognitive ability (GCA)', ref: '§5.2', def: 'A person’s basic <b>information-processing capacities</b> and cognitive resources: verbal, numerical, spatial and reasoning abilities. It predicts learning, training success and job performance in <b>virtually all jobs</b>, <b>more strongly in complex jobs</b>.', after: 'Lecture examples of cognitive-ability tests: <b>GMAT, LSAT, MCAT</b>.' },
        { t: 'def', term: 'Emotional intelligence (EI)', ref: '§5.2', def: 'The ability to understand and manage your own and others’ feelings and emotions. It predicts job and academic performance <b>beyond</b> cognitive ability and the Big Five. It’s most valuable in <b>high-emotional-labour jobs</b> and for people with <b>lower cognitive ability</b>.', after: 'Lecture: EI is positively correlated with <b>perceptions of leadership, coping with stress and job performance</b>.' },
        { t: 'flow', title: 'Salovey & Mayer’s four-branch EI model (textbook)', ref: '§5.2', intro: 'A hierarchy from lowest to highest:',
          steps: [{ h: '1 · Perceiving', d: 'emotions accurately in self and others' }, { h: '2 · Using', d: 'emotions to facilitate thinking' }, { h: '3 · Understanding', d: 'emotions, their causes and signals' }, { h: '4 · Managing', d: 'emotions in self and others to reach goals' }],
          mnem: '<b>"PUUM" (Please Use Understanding to Manage).</b> Perceive → Use → Understand → Manage, bottom to top.' },
        { t: 'groups', title: 'Goleman’s EI competency model (lecture)', src: 'lec', intro: 'Slide 5 ("Goleman, 2003: Emotional Intelligence and Leadership"). Four domains of <i>learnable leadership competencies</i>:',
          groups: [
            { name: 'Self-awareness', items: ['Emotional self-awareness', 'Accurate self-assessment', 'Self-confidence'] },
            { name: 'Self-management', items: ['Emotional self-control', 'Transparency', 'Adaptability', 'Achievement', 'Initiative', 'Optimism'] },
            { name: 'Social awareness', items: ['Empathy', 'Organizational awareness', 'Service'] },
            { name: 'Relationship mgmt', items: ['Inspiring leadership', 'Influence', 'Developing others', 'Change catalyst', 'Conflict management', 'Building bonds', 'Teamwork & collaboration'] }
          ],
          after: 'Speaker notes: <b>self-awareness is the core</b>. Highly effective leaders show strength in <b>≥ 6 competencies, with ≥ 1 in each domain</b>. Self-awareness enables empathy and self-management, and those two together build relationships.',
          mnem: 'It’s a 2 × 2: <b>Self</b> vs <b>Social</b> × <b>Awareness</b> vs <b>Management</b>. Self-awareness → Self-management → Social awareness → Relationship management.' },
        { t: 'note', tone: 'trap', title: 'Two EI models: don’t mix the lists', body: '"Branches," or the perceiving → managing sequence, means <b>Salovey &amp; Mayer</b> (textbook, an ability hierarchy). Self-management, social awareness or relationship management means <b>Goleman</b> (lecture, leadership competencies). Same construct, different purposes.' },
        { t: 'note', tone: 'trap', title: 'Ability × motivation? No, additive', body: 'Research does <b>not</b> support the popular multiplicative model (Performance = Ability × Motivation, which predicts near-zero performance when either is low). Evidence supports an <b>additive</b> model: the two contribute independently and can partly compensate for each other.' },
        { t: 'cmp', title: 'Cultural intelligence (CQ): textbook 3 vs lecture 4', ref: '§4.1 + slides 7–8', head: ['Textbook (3)', 'Lecture (4 sub-skills)', 'Meaning'],
          rows: [['—', '<b>CQ-Strategy</b> (metacognitive)', 'How you interpret and make sense of intercultural experiences: planning, monitoring'],
                 ['Knowledge', '<b>CQ-Knowledge</b>', 'Understanding how cultures are similar and different (Hofstede lives here)'],
                 ['Motivation', '<b>CQ-Motivation</b> (Drive)', 'Interest in experiencing other cultures and people'],
                 ['Behaviour', '<b>CQ-Behaviour</b> (Action)', 'Adapting your own verbal and nonverbal behaviour to different cultures']],
          after: 'CQ = the capability to function effectively in culturally diverse situations. Canadians score relatively high, plausibly because of multicultural cities.',
          mnem: '<b>"Smart Knowledge Drives Action"</b>: Strategy · Knowledge · Drive · Action. <b>Strategy</b> is the one that’s only in the lecture version, so it’s the likeliest "which is NOT" item.' }
      ]
    },
    {
      id: 'personality', title: 'Personality', ref: '§2.1–2.3',
      items: [
        { t: 'def', term: 'Personality', ref: '§2.1', def: 'The relatively <b>stable</b> set of psychological characteristics that influences how a person interacts with their environment and how they feel, think and behave. It’s shaped by genetics <i>and</i> long-term learning history.' },
        { t: 'cmp', title: 'Dispositional vs situational vs interactionist', ref: '§2.1', head: ['Approach', 'Claim'],
          rows: [['Dispositional', 'Stable individual traits drive attitudes and behaviour'], ['Situational', 'The setting (rewards, punishments, task features) drives feelings and behaviour'], ['<b>Interactionist</b> ✓ modern view', 'Behaviour is a function of <b>both</b> disposition and situation']],
          after: '<b>Weak situations</b> (loose roles, few rules, weak contingencies) let personality show. <b>Strong situations</b> (clear roles, rules and contingencies) mute it. <b>Trait activation theory</b>: a trait produces behaviour only when the situation makes that trait relevant.' },
        { t: 'cmp', title: 'The Big Five (Five-Factor Model)', ref: '§2.2', head: ['Dimension', 'High end', 'Matters most for'],
          rows: [['<b>O</b>penness to experience', 'Curious, flexible, receptive to new ideas', 'Jobs needing learning and creativity'],
                 ['<b>C</b>onscientiousness ★', 'Responsible, dependable, achievement-oriented', '<b>All jobs</b>: the strongest, most consistent predictor of performance'],
                 ['<b>E</b>xtraversion', 'Outgoing, sociable, energetic', 'Interpersonal jobs (sales, management)'],
                 ['<b>A</b>greeableness', 'Warm, cooperative, friendly', 'Helping and teamwork jobs'],
                 ['<b>N</b>euroticism / emotional stability', 'Stable, confident (vs anxious, insecure)', 'Stressful, feedback-heavy work']],
          after: 'The five are <b>relatively independent</b>: you can be high or low on any combination.',
          mnem: '<b>OCEAN.</b> For "best predictor across all jobs," the answer is always <b>C</b>onscientiousness.' },
        { t: 'def', term: 'Locus of control', ref: '§2.2', def: 'Beliefs about where the factors that control your behaviour lie. <b>Internals</b> believe they control their own outcomes: more satisfaction, commitment, pay and career planning, and less stress. <b>Externals</b> believe luck, fate or powerful others are in control.' },
        { t: 'def', term: 'Self-monitoring', ref: '§2.2', def: 'How much people observe and regulate how they appear and behave in social settings. <b>High</b> self-monitors adapt to social cues. They suit sales, law, PR and politics and are more likely to emerge as leaders, but they feel more role stress and less commitment. <b>Low</b> self-monitors "wear their heart on their sleeve."' },
        { t: 'def', term: 'Self-esteem & behavioural plasticity', ref: '§2.2', def: 'Self-esteem is how positive your self-evaluation is. <b>Behavioural plasticity theory</b>: people with <b>low</b> self-esteem are more susceptible to external and social influence (more pliable) and react worse to negative feedback.' },
        { t: 'def', term: 'Positive & negative affectivity (PA / NA)', ref: '§2.2', def: 'Enduring, largely genetic emotional dispositions. They are <b>independent dimensions, not opposite ends of one scale</b>. High-PA people see the world positively (higher satisfaction, performance and engagement; PA is the strongest trait predictor of engagement). High-NA people see it negatively (more stress, counterproductive and withdrawal behaviour).' },
        { t: 'def', term: 'Proactive personality', ref: '§2.3', def: 'A stable disposition to <b>take initiative</b> across situations and change one’s environment for the better. It’s linked to satisfaction, performance, engagement, OCBs, leadership and career success.' },
        { t: 'def', term: 'General self-efficacy (GSE)', ref: '§2.3', def: 'A general, motivational <b>trait</b>: belief in your ability to succeed across a <i>variety</i> of challenging situations, built up over a lifetime of successes and failures. (Task-specific self-efficacy is the Week 4 learning version.)' },
        { t: 'list', title: 'Core self-evaluations (CSE): 4 traits', ref: '§2.3', intro: 'Judge, Locke &amp; Durham’s broad concept, and among the best dispositional predictors of job satisfaction and performance.',
          items: ['<b>Self-esteem</b>', '<b>General self-efficacy</b>', '<b>Locus of control</b>', '<b>Neuroticism</b> (i.e., emotional stability)'],
          mnem: 'A high-CSE person says: <b>"I’m worthy, I’m capable, I’m in control, I’m calm."</b> Self-esteem · GSE · internal locus · emotional stability. Extraversion and conscientiousness are the usual "NOT" distractors.' },
        { t: 'groups', title: 'Myers-Briggs Type Indicator (MBTI)', src: 'lec', intro: 'From <b>Carl Jung</b>: behaviour reflects a stable pattern of <b>preferences</b>, and people in the same occupation often share preferences. You sort to one side of each pair, and four letters give one of <b>16 types</b> (e.g., ESTJ).',
          groups: [
            { name: 'E / I', items: ['Where you direct energy: outward to people (E) or inward to ideas (I)'] },
            { name: 'S / N', items: ['How you take in information: concrete facts (S) or patterns and possibilities (N)'] },
            { name: 'T / F', items: ['How you decide: impersonal logic (T) or values and people (F)'] },
            { name: 'J / P', items: ['How you handle the world: plans and closure (J) or flexibility (P)'] }
          ] },
        { t: 'note', tone: 'trap', title: 'MBTI vs Big Five', body: 'The Big Five are <b>traits on continuous scales</b> (more or less conscientious) with research links to performance. The MBTI sorts people into <b>categorical preferences</b> (T <i>or</i> F). Asked which the textbook and research treat as the best-supported predictor of performance? <b>Big Five.</b> Only E/I loosely overlaps with a Big Five dimension.' },
        { t: 'note', tone: 'trap', title: 'CSE isn’t the answer just because locus of control is mentioned', body: 'If a scenario only shows a person blaming luck, the precise answer is <b>external locus of control</b>, not "low CSE." CSE is a four-trait bundle, and the scenario gives no evidence on the other three.' }
      ]
    },
    {
      id: 'values', title: 'Values & culture', ref: '§4.1',
      items: [
        { t: 'def', term: 'Values', ref: '§4.1', def: 'A <b>broad tendency to prefer certain states of affairs over others</b>. Values are motivational (what to seek or avoid) and normative (how you should behave), but they’re too broad to predict behaviour in any one situation. They’re mostly learned through reinforcement (parents, teachers, religious figures).' },
        { t: 'cmp', title: 'Generations at work', ref: '§4.1', head: ['Generation', 'Born', 'Formative events'],
          rows: [['Traditionalists', '1925–1945', 'Depression, WWII'], ['Baby Boomers', '1946–1964', 'Vietnam, civil rights'], ['Generation X', '1965–1980', 'Dot-com boom'], ['Millennials (Gen Y)', '1981–2000', '9/11, Great Recession'], ['Generation Z', '2001–2020', 'The internet, Columbine']],
          after: '<b>Key finding: there’s more similarity than difference</b> in core work attitudes and work ethic. Later generations value status and fast career growth, leisure and work–life balance more, and the <i>expression</i> of shared values differs ("respect" means deference to older workers and being listened to for younger ones).' },
        { t: 'def', term: 'Person–organization fit', ref: '§4.1', def: 'The match between an individual’s values and the organization’s. Good fit predicts positive attitudes and behaviour, including <b>lower quit rates</b>.' },
        { t: 'def', term: 'Work centrality', ref: '§4.1', def: 'How central work is to a person’s identity. <b>Japan highest, Britain lowest</b>, with the US and Belgium in the middle. Higher centrality means more hours and less vacation.' },
        { t: 'cmp', title: 'Hofstede’s 5 cultural dimensions', ref: '§4.1', intro: 'From a survey of 116,000+ IBM employees in 40+ countries. This is the most examinable model in Ch 4.',
          head: ['Dimension', 'What it measures', 'High / examples', 'Canada & US'],
          rows: [['<b>Power distance</b>', 'Acceptance of an unequal distribution of power', 'Large: Philippines, Russia, Mexico · Small: Denmark, NZ, Israel, Austria', '<b>Low</b>'],
                 ['<b>Uncertainty avoidance</b>', 'Discomfort with ambiguity; preference for rules and security', 'Strong: Japan, Greece, Portugal · Weak: Singapore, Denmark, Sweden', '<b>Weak</b>'],
                 ['<b>Masculinity / femininity</b>', 'Sharp gender roles, performance and dominance vs fluid roles, quality of life', 'Masculine: Slovakia, Japan · Feminine: Scandinavia', 'Canada <b>mid</b>; US <b>more masculine</b>'],
                 ['<b>Individualism / collectivism</b>', 'Independence and initiative vs loyalty to family or clan', 'Individualist: US, Australia, UK, Canada · Collective: Venezuela, Colombia, Pakistan', '<b>Highly individualist</b>'],
                 ['<b>Long- / short-term orientation</b>', 'Persistence, thrift, status vs stability, face-saving, social niceties', 'Long: China, HK, Taiwan, Japan, S. Korea', '<b>Short-term</b>']],
          after: 'The long-term dimension was added later with Canadian researcher <b>Michael Bond</b>.',
          mnem: '<b>"Please Understand My Individual Leanings"</b>: Power distance · Uncertainty avoidance · Masculinity · Individualism · Long-term. Canada = <b>low, weak, middle, individual, short</b>. Canada and the US match on everything except <b>masculinity</b>.' },
        { t: 'list', title: 'Other culture concepts', ref: '§4.1', bullets: true,
          items: ['<b>GLOBE project</b> (Robert House, 62 societies): verified and extended Hofstede. It splits masculinity into assertiveness + gender egalitarianism, and individualism into resource distribution + group loyalty.', '<b>Cultural distance</b>: how much two cultures differ in values. Greater distance makes communication, negotiation, mergers and expatriate adjustment harder.', '<b>Tightness vs looseness</b>: tight cultures (Pakistan, Singapore, South Korea) have strong, sanctioned norms. Loose cultures (Netherlands, Brazil, Australia, Canada, US) tolerate deviation.'] },
        { t: 'list', title: 'Implications of cultural variation', ref: '§4.1',
          items: ['<b>Exporting OB theories</b>: participative decisions and individual recognition may fail in high-power-distance or collectivist cultures.', '<b>Importing OB theories</b>: Japanese quality circles and JIT assume different values (e.g., high job security).', '<b>Appreciating global customers</b>: Disneyland Paris’s early struggles; Samsung’s recalled calendar.', '<b>Developing global employees</b>: select and train for cross-cultural competence (CQ).'] }
      ]
    },
    {
      id: 'attitudes', title: 'Attitudes & job satisfaction', ref: '§4.2–4.3',
      items: [
        { t: 'def', term: 'Attitude', ref: '§4.2', def: 'A fairly stable <b>evaluative tendency</b> to respond consistently to a specific object, situation, person or category. Attitudes are more specific than values and only weakly linked to behaviour. The link is strongest when the person has <b>direct experience</b> and holds the attitude <b>strongly and confidently</b>.' },
        { t: 'flow', title: 'The attitude chain', ref: '§4.2',
          steps: [{ h: 'Belief', d: '"My job interferes with my family"' }, { h: '+ Value', d: '"I dislike anything that hurts my family"' }, { h: 'Attitude', d: '"I dislike my job" (low satisfaction)' }, { h: 'Behaviour', d: '"I’ll look for another job" (turnover)' }],
          mnem: '<b>B + V → A → B</b>: "Beliefs plus Values make Attitudes, which drive Behaviour."' },
        { t: 'def', term: 'Job satisfaction (facet vs overall)', ref: '§4.3', def: 'A collection of attitudes about one’s job. <b>Facet</b> satisfaction is about specific aspects (pay, supervision, co-workers, the work itself, career opportunities…). <b>Overall</b> satisfaction is a summary across facets. Two people can report the same overall level for different reasons. Measures: the Job Descriptive Index and the Minnesota Satisfaction Questionnaire.' },
        { t: 'list', title: 'What determines job satisfaction', ref: '§4.3 · Exhibit 4.6',
          items: ['<b>Discrepancy</b>: the gap between the outcomes you <i>want</i> (values) and the outcomes you <i>perceive</i> you get (beliefs).', '<b>Fairness</b>: distributive, procedural, interactional (next item).', '<b>Disposition</b>: evidence from twins raised apart and from satisfaction staying stable across employers. Extraversion and conscientiousness go with higher satisfaction, neuroticism with lower.', '<b>Mood &amp; emotion</b>: affective events theory, emotional contagion, emotional labour.'],
          mnem: '<b>"Don’t Forget Daily Moods"</b>: Discrepancy · Fairness · Disposition · Mood/emotion.' },
        { t: 'cmp', title: 'The three kinds of fairness (justice)', ref: '§4.3', head: ['Type', 'Judges the fairness of…', 'Key detail'],
          rows: [['<b>Distributive</b>', 'The <b>outcomes</b> received', 'Explained by <b>equity theory</b>: my outcomes ÷ my inputs vs another person’s ratio'],
                 ['<b>Procedural</b>', 'The <b>process</b> used to decide outcomes', '4 boosters: consistent procedures · accurate, unbiased information · two-way communication · welcoming appeals. When it’s violated, people <b>blame the system</b>'],
                 ['<b>Interactional</b>', 'The <b>interpersonal treatment</b> when outcomes are explained', 'Respectful and informative communication. When it’s violated, people <b>blame the boss</b>']],
          mnem: '<b>What · How · How you were treated.</b> Outcome → distributive. Process → procedural. Manner → interactional.' },
        { t: 'note', tone: 'trap', title: 'Discrepancy theory vs equity theory', body: 'Both are "gap" theories. <b>Discrepancy</b> compares what <i>you</i> want with what <i>you</i> get. <b>Equity</b> compares your outcome/input <i>ratio</i> with <i>someone else’s</i>. Being on the "short end" (high inputs, low outcomes relative to the comparison other) is the most dissatisfying.' },
        { t: 'def', term: 'Affective events theory', ref: '§4.3', def: '(Weiss &amp; Cropanzano) Jobs are streams of events that provoke <b>emotions</b> (intense, short-lived, tied to an event) or shape <b>moods</b> (less intense, longer-lasting, diffuse), which in turn shape satisfaction.' },
        { t: 'def', term: 'Emotional contagion', ref: '§4.3', def: 'Moods and emotions <b>spreading between people</b>, including to and from customers.' },
        { t: 'def', term: 'Emotional labour', ref: '§4.3', def: 'The requirement to conform to emotional <b>display rules</b> whatever you actually feel, either by <b>exaggerating positive emotion</b> or by <b>suppressing negative emotion</b>. Suppressing negative emotion is draining (lower satisfaction, more stress). Genuinely expressing positive emotion tends to raise satisfaction.' },
        { t: 'list', title: 'Key contributors to job satisfaction', ref: '§4.3',
          items: ['<b>Mentally challenging work</b>', '<b>Meaningful work</b> (a positive impact on others)', '<b>Adequate compensation</b> (people overestimate pay’s importance and underestimate meaningful work’s)', '<b>Career opportunities</b>', '<b>People</b>: friendly, helpful co-workers and supervisors'],
          after: '<b>Dirty work</b> (physically, socially or morally stigmatized jobs) can still be satisfying through occupational solidarity and low expectations.',
          mnem: '<b>"Challenge, Meaning, Money, Moving up, People."</b>' }
      ]
    },
    {
      id: 'consequences', title: 'Consequences of job satisfaction', ref: '§4.4',
      items: [
        { t: 'cmp', title: 'Satisfaction → outcomes', ref: '§4.4', head: ['Outcome', 'Link', 'Key point'],
          rows: [['Absence', '<b>Weak</b>', 'Constrained by unavoidable absence, attendance policies and "absence culture" norms'],
                 ['Turnover', '<b>Moderate</b>', 'Runs through turnover intentions. "Shocks" (a job offer, a breakup) can trigger quitting. <b>Honeymoon–hangover</b>: satisfaction rises after a job change, then falls'],
                 ['Performance', 'Positive', 'Strongest for the content of the work and for complex, high-autonomy jobs. More often satisfaction ← performance (via rewards)'],
                 ['OCB', 'Positive', 'Driven especially by <b>procedural and interactional</b> fairness'],
                 ['Customer satisfaction & profit', 'Positive', 'Via less absence and turnover, more OCB, and mood contagion to customers']] },
        { t: 'def', term: 'Organizational citizenship behaviour (OCB)', ref: '§4.4', def: 'Voluntary, informal behaviour that helps organizational effectiveness and isn’t usually captured by formal evaluation. Four forms: <b>helping</b>, <b>conscientiousness</b>, <b>being a good sport</b>, <b>courtesy and cooperation</b>.', mnem: '<b>"Help, Conscientiously, as a good Sport, with Courtesy."</b> There is no "civic virtue" in this textbook’s list.' },
        { t: 'flow', title: 'Withdrawal progression', ref: 'Exhibit 4.9',
          steps: [{ h: 'Less OCB' }, { h: 'Lateness' }, { h: 'Absenteeism' }, { h: 'Turnover' }] },
        { t: 'def', term: 'Counterproductive work behaviour (CWB)', ref: '§4.4', def: '<b>Intentional</b> behaviour meant to harm the organization or people in it: theft, abusive supervision, incivility, bullying. It’s rooted in dissatisfaction plus personality and context.' },
        { t: 'note', tone: 'tip', title: '"Why hasn’t the unhappy employee quit?"', body: 'Use the turnover model (Exhibit 4.7): dissatisfaction runs through <i>intentions</i> and is weighed against alternatives, so a weak job market or community ties can keep people. Add <b>continuance commitment</b> (a pension, no alternatives). That’s a two-concept answer.' }
      ]
    },
    {
      id: 'commitment', title: 'Organizational commitment', ref: '§4.5',
      items: [
        { t: 'cmp', title: 'Meyer & Allen’s three types of commitment', ref: '§4.5', intro: 'Commitment is an attitude reflecting the strength of the link between an employee and the organization.',
          head: ['Type', 'Based on', 'Stay because…', 'Grows with'],
          rows: [['<b>Affective</b>', 'Identification and involvement', 'They <b>want to</b>', 'Interesting, satisfying work; role clarity; met expectations'],
                 ['<b>Continuance</b>', 'Costs of leaving', 'They <b>have to</b>', 'Tenure; pensions; few alternatives'],
                 ['<b>Normative</b>', 'Ideology or obligation', 'They <b>ought to</b>', 'Tuition reimbursement; mission identification; loyalty-focused socialization']],
          mnem: '<b>Want to · Have to · Ought to</b> (A · C · N). "<b>A</b>ffection, <b>C</b>osts, <b>N</b>orms."' },
        { t: 'list', title: 'Commitment: consequences', ref: '§4.5', bullets: true,
          items: ['<b>All three</b> types reduce turnover.', '<b>Affective</b> commitment raises performance and satisfaction.', '<b>Continuance</b> commitment is <b>negatively</b> related to performance. High continuance with low affective commitment is the <b>worst</b> combination for both sides.', '<b>Profiles</b>: fully committed (high on all three) and affective/normative-dominant profiles beat affective-only, so the types work together.', '<b>Very high</b> commitment has downsides: family–work conflict, going along with unethical behaviour, resisting needed change.'] },
        { t: 'note', tone: 'trap', title: '"Commitment" isn’t always good', body: 'In everyday speech commitment sounds positive, but <b>continuance commitment</b> predicts <i>worse</i> performance. Don’t assume every form helps the organization.' }
      ]
    }
  ],

  quiz: [
    { q: 'Which Big Five dimension predicts job performance most consistently across virtually all occupations?', o: ['Conscientiousness', 'Extraversion', 'Openness to experience', 'Agreeableness'], a: 0, why: '<b>Conscientiousness</b> is the strongest, most universal predictor. Extraversion matters mostly in interpersonal jobs, openness in creative ones, and agreeableness in helping and teamwork jobs.' },
    { q: 'Deja believes her promotions depend on connections and luck, so she rarely bothers with extra training. She is displaying:', o: ['An external locus of control', 'High self-monitoring', 'Low core self-evaluations', 'Negative affectivity'], a: 0, why: 'Beliefs that outside forces control outcomes = <b>external locus of control</b>. CSE is a four-trait bundle, and the scenario gives no evidence on the other three.' },
    { q: 'Which is NOT one of the four core self-evaluation traits?', o: ['Extraversion', 'Self-esteem', 'Locus of control', 'Neuroticism'], a: 0, why: 'CSE = self-esteem, general self-efficacy, locus of control and neuroticism. <b>Extraversion</b> is the classic distractor.' },
    { q: 'According to the textbook, positive and negative affectivity are:', o: ['Relatively independent dimensions', 'Opposite ends of one continuum', 'Learned through reinforcement only', 'The same as moods'], a: 0, why: 'PA and NA are <b>independent</b>, not opposites. This is a common true/false trap.' },
    { q: 'Personality traits are most likely to influence behaviour in:', o: ['Weak situations with loosely defined roles and few rules', 'Strong situations with clear rules and rewards', 'Any situation equally', 'Only highly stressful situations'], a: 0, why: '<b>Weak situations</b> let personality show. Strong situations constrain it (interactionist view).' },
    { q: 'An employee got the raise she felt she deserved, but her manager announced it curtly in front of others and wouldn’t answer questions. Which fairness type was violated?', o: ['Interactional', 'Distributive', 'Procedural', 'Equity'], a: 0, why: 'The outcome was fine (distributive OK). The <b>manner of treatment and explanation</b> was the problem, which is <b>interactional</b>. People who experience it tend to blame the boss personally.' },
    { q: 'Staff are upset because raises were decided without any consultation, with no explanation of criteria and no way to appeal. Which fairness type is at issue?', o: ['Procedural', 'Distributive', 'Interactional', 'Normative'], a: 0, why: 'The complaint is about the <b>process</b>: no two-way communication, no appeals. That’s <b>procedural</b> fairness.' },
    { q: 'Marco stays at his company only because leaving would cost him a generous pension and he sees no other job options. This is:', o: ['Continuance commitment', 'Affective commitment', 'Normative commitment', 'Organizational citizenship'], a: 0, why: 'Staying because of the <b>costs of leaving</b> ("have to") is <b>continuance</b>. It’s also the type that’s negatively related to performance.' },
    { q: 'Which type of commitment is negatively related to job performance?', o: ['Continuance', 'Affective', 'Normative', 'None: all commitment improves performance'], a: 0, why: '<b>Continuance</b> commitment is negatively related to performance. Affective commitment boosts it.' },
    { q: 'Canada and the US have similar Hofstede profiles on every dimension except:', o: ['Masculinity', 'Power distance', 'Individualism', 'Long-term orientation'], a: 0, why: 'Both are low power distance, weak uncertainty avoidance, individualist and short-term. The <b>US is more masculine</b> than Canada.' },
    { q: 'A culture that stresses rules, security and conformity, and treats hard work as a virtue, is high on:', o: ['Uncertainty avoidance', 'Power distance', 'Individualism', 'Short-term orientation'], a: 0, why: 'Discomfort with ambiguity and a preference for rules = <b>strong uncertainty avoidance</b> (e.g., Japan, Greece, Portugal).' },
    { q: 'A call-centre agent must stay cheerful with rude callers and hide her irritation. This requirement is:', o: ['Emotional labour', 'Emotional contagion', 'Affective commitment', 'Negative affectivity'], a: 0, why: 'Conforming to display rules regardless of true feelings is <b>emotional labour</b>. Suppressing negative emotion is the draining form.' },
    { q: 'A server’s bad mood spreads to her table of customers. This illustrates:', o: ['Emotional contagion', 'Emotional labour', 'Projection', 'Affective events theory’s display rules'], a: 0, why: 'Moods spreading between people = <b>emotional contagion</b>.' },
    { q: 'Which of the following is NOT one of the textbook’s forms of OCB?', o: ['Civic virtue', 'Helping', 'Being a good sport', 'Courtesy and cooperation'], a: 0, why: 'This text lists helping, conscientiousness, being a good sport, and courtesy/cooperation. <b>Civic virtue</b> isn’t in it.' },
    { q: 'In Salovey & Mayer’s four-branch model, the highest-level branch is:', o: ['Managing emotions', 'Perceiving emotions', 'Using emotions to facilitate thinking', 'Understanding emotions'], a: 0, why: 'Perceive → Use → Understand → <b>Manage</b> (PUUM), lowest to highest.' },
    { q: '"Empathy, organizational awareness and service" make up which domain of Goleman’s competency model (lecture)?', o: ['Social awareness', 'Self-awareness', 'Self-management', 'Relationship management'], a: 0, why: 'Those three are <b>social awareness</b>. Relationship management is influence, conflict management, teamwork and the rest.' },
    { q: 'Which cultural-intelligence sub-skill appears in the lecture’s four-factor model but NOT in the textbook’s three components?', o: ['CQ-Strategy', 'CQ-Knowledge', 'CQ-Motivation', 'CQ-Behaviour'], a: 0, why: 'The text lists knowledge, motivation and behaviour. The lecture adds <b>Strategy</b> (metacognitive).' },
    { q: 'Research on ability and motivation supports which model of performance?', o: ['An additive model where each contributes independently', 'A multiplicative model: Ability × Motivation', 'Ability matters only when motivation is high', 'Motivation matters only for low-ability workers'], a: 0, why: 'The evidence supports an <b>additive</b> model, not the popular multiplicative one.' },
    { q: 'Two employees report the same overall job satisfaction, but one loves the pay and hates the boss and the other the reverse. This illustrates:', o: ['The difference between facet and overall satisfaction', 'Discrepancy theory failing', 'Emotional contagion', 'Continuance commitment'], a: 0, why: '<b>Facet</b> satisfactions can differ while the <b>overall</b> summary is the same.' },
    { q: 'A friend quits a job she hated. Six months into the new job, her satisfaction has dropped again. This is the:', o: ['Honeymoon–hangover effect', 'Halo effect', 'Withdrawal progression', 'Discrepancy effect'], a: 0, why: 'Satisfaction rises after a job change (honeymoon), then falls as the new job’s flaws show (<b>hangover</b>).' },
    { q: 'An MBTI "T" versus "F" describes:', o: ['How you make decisions: logic versus values and people', 'Where you direct energy', 'How you take in information', 'How you handle the outside world'], a: 0, why: 'T/F is the <b>deciding</b> preference. E/I = energy, S/N = information, J/P = handling the world.' }
  ],

  prompts: [
    { q: 'Jordan is a talented graphic designer. His creative work is excellent, but he resists team brainstorming, rarely adapts his style for different clients, and gets visibly frustrated when a client rejects a first concept. He has just been moved into a client-facing account role. <b>Using personality concepts, explain the problem and recommend what the agency should do.</b>',
      name: '<b>Big Five</b>: low <b>agreeableness</b>, low <b>emotional stability</b> (high neuroticism). Also low <b>self-monitoring</b>, and the <b>interactionist</b> view / person–job fit.',
      define: 'The Big Five are five relatively independent trait dimensions. Agreeableness = warm and cooperative. Emotional stability = calm and confident rather than anxious. Self-monitoring = adjusting behaviour to social cues.',
      apply: 'Resisting brainstorming and not adapting to clients point to low agreeableness and low self-monitoring. Frustration at rejection points to low emotional stability. The client role is a <b>strong demand</b> for exactly those traits, so it activates his weaknesses (trait activation).',
      recommend: 'Move Jordan back toward production work that uses his openness and conscientiousness. For future client-facing hires, screen for agreeableness and emotional stability with structured behavioural questions ("tell me about a time a client rejected your work").',
      also: 'Openness to experience (his creative strength); person–organization fit.' },
    { q: 'A company gives every employee the same 3% raise. Top performers are furious, even though several of them admit 3% is "fine" in dollar terms. The decision was made by HR alone and announced in a one-line email. <b>Explain the reaction and recommend changes.</b>',
      name: 'Organizational fairness: <b>distributive</b> (equity theory), <b>procedural</b> and <b>interactional</b> fairness.',
      define: 'Distributive fairness is about outcomes, judged with equity theory by comparing your outcome/input ratio with others’. Procedural fairness is about the process (consistency, accurate information, voice, appeals). Interactional fairness is about respectful, informative treatment.',
      apply: 'Top performers put in more but get the same outcome, so their ratio is worse than low performers’ and they feel distributive <b>inequity</b>. No consultation or appeal means a procedural failure. A one-line email means an interactional failure. Low procedural and interactional fairness also reduces OCB.',
      recommend: 'Tie raises to performance criteria that are communicated in advance. Give employees a voice and an appeal channel. Have managers explain decisions in person, respectfully. Expect higher satisfaction and OCB and lower turnover intentions.',
      also: 'Discrepancy theory; OCB; turnover model.' },
    { q: 'Sofia, a Canadian manager, is transferred to run a team in a country Hofstede rates as high power distance, collectivist and long-term oriented. In her first month she holds open brainstorms, praises individuals publicly and asks everyone to challenge her ideas. The team seems uncomfortable. <b>Explain and advise.</b>',
      name: '<b>Hofstede’s dimensions</b> (power distance, individualism/collectivism, long-term orientation), <b>exporting OB theories</b>, and <b>cultural intelligence</b>.',
      define: 'Power distance = acceptance of unequal power. Individualism/collectivism = independence vs loyalty to the group. Cultural intelligence = the capability to function effectively across cultures.',
      apply: 'In high power distance, employees expect direction, and challenging the boss feels inappropriate. In a collectivist culture, singling out individuals for praise can embarrass them. These are Canadian (low PD, individualist) practices being exported where they don’t fit.',
      recommend: 'Build CQ: learn the norms (Knowledge), plan interactions (Strategy), and adapt behaviour (Action), for example by recognizing team achievements and gathering input in smaller or private settings. Adjust gradually rather than abandoning participation altogether.',
      also: 'Cultural distance; the four CQ sub-skills (lecture).' },
    { q: 'A hospital’s nurses report low job satisfaction. Pay is at market, but nurses say they must "smile through everything" with difficult patients, and a recent survey shows many are thinking of quitting. <b>Diagnose using Week 2 concepts and recommend two actions.</b>',
      name: '<b>Emotional labour</b>, <b>affective events theory</b>, the <b>turnover process model</b> and <b>affective commitment</b>.',
      define: 'Emotional labour is conforming to emotional display rules regardless of what you feel. Suppressing negative emotion drains people and lowers satisfaction.',
      apply: 'Constantly suppressing frustration is the draining form of emotional labour, and each difficult patient is an "affective event" that pulls satisfaction down. Low satisfaction feeds turnover intentions (Exhibit 4.7).',
      recommend: '(1) Reduce the cost of emotional labour: debriefs, rotation away from the most difficult cases, and room for genuine rather than faked emotion. (2) Build <b>affective commitment</b> through meaningful work (show the patient impact), role clarity and met expectations, which reduces turnover.',
      also: 'Emotional contagion; meaningful work as a contributor to satisfaction.' },
    { q: 'A firm is choosing between two finalists for a complex analyst role: one with top cognitive-test scores, the other with slightly lower scores but outstanding emotional intelligence. The role involves heavy client negotiation. <b>Advise the firm.</b>',
      name: '<b>General cognitive ability</b>, <b>emotional intelligence</b> (four-branch model and/or Goleman), and the <b>additive</b> model of ability.',
      define: 'GCA is basic information-processing capacity. It predicts performance in all jobs, more strongly in complex ones. EI is the ability to perceive, use, understand and manage emotions, and it predicts performance beyond GCA and the Big Five.',
      apply: 'The role is complex (favouring GCA) <i>and</i> emotionally demanding (favouring EI). EI adds predictive power on top of GCA, and it’s most valuable in high-emotional-labour work, which client negotiation is.',
      recommend: 'Don’t choose on GCA alone. Assess both, and because ability effects are additive, the high-EI candidate’s slightly lower GCA is partly offset. Consider structured role-plays to test the relationship-management competencies.',
      also: 'Goleman’s domains (lecture); cultural intelligence if the clients are international.' }
  ]
});
