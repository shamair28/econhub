/* Week 3 — Perception (Ch 3 + Week 3 slides) */
SME.addWeek({
  id: 'w3', num: 3, title: 'Perception', dates: 'Sept 21–25',
  chapterLine: 'Ch 3',
  chapters: [
    { c: 'Ch 3', t: 'Perception, Attribution, and Diversity', s: '§3.1–3.7' },
    { c: 'Slides', t: 'Five-stage perceptual process · 8 perceptual errors · attribution vocabulary · review questions' }
  ],
  sources: ['Textbook Ch 3', 'Week 3 lecture deck (28 slides)'],
  keys: ['Bruner’s model', '5-stage process', '8 perceptual errors', 'Attribution cues', 'FAE vs actor–observer', 'Rater errors', 'Trust', 'POS'],

  brief: [
    '<b>Perception</b> is interpreting sensory messages to give the environment order and meaning. People act on their <i>interpretation</i>, not on reality. Three components: <b>perceiver</b> (experience, needs, emotions → perceptual defence), <b>target</b> (ambiguity) and <b>situation</b> (context).',
    'There are <b>two perceptual models</b>. <b>Bruner</b> (textbook) describes impression formation: openness → familiar cues → crude categorization → selective cue search → categorization strengthened. The <b>five-stage process</b> (lecture) is stimuli → observation → selection → organization → interpretation ("SOS, Oh I see").',
    '<b>Eight perceptual errors</b> (lecture list): primacy, recency, central traits, implicit personality theories, projection, stereotyping, <b>self-fulfilling prophecy</b>, <b>halo</b>. Group them with the <b>three T’s</b>: Timing · Trait-spread · Transfer.',
    '<b>Attribution</b>: dispositional (internal) vs situational (external), judged from <b>consistency, consensus and distinctiveness</b>. High consistency + low consensus + low distinctiveness = dispositional. Know the biases: <b>fundamental attribution error</b>, <b>actor–observer effect</b>, <b>self-serving bias</b>.',
    '<b>In organizations</b>: diversity (stereotype threat, valuing vs tolerating), <b>trust</b> (ability, benevolence, integrity), <b>POS</b> (norm of reciprocity), and HR (signalling theory, interview biases such as contrast effects, and rater errors: leniency, harshness, central tendency, halo, similar-to-me).'
  ],
  lens: 'Dr. Kassaye’s own review questions (slide 28) are the best preview. A question will likely ask you to explain an inaccurate judgment (an interview, an appraisal, a new co-worker) using <b>either perceptual model</b> plus <b>named errors</b>, or to work out an attribution from the three cues. See the Answer Practice tab.',

  sections: [
    {
      id: 'basics', title: 'What perception is', ref: '§3.1',
      items: [
        { t: 'def', term: 'Perception', ref: '§3.1', def: 'The process of interpreting the messages of our senses to provide <b>order and meaning</b> to the environment. People act on their <i>interpretation</i> of reality, not necessarily on reality itself.' },
        { t: 'groups', title: 'Three components of perception', ref: 'Exhibit 3.1',
          groups: [
            { name: 'Perceiver', items: ['<b>Experience</b> builds expectations', '<b>Needs</b> unconsciously bias what’s noticed', '<b>Emotions</b> colour interpretation. <b>Perceptual defence</b> is the perceptual system protecting you from unpleasant emotions'] },
            { name: 'Target', items: ['<b>Ambiguous</b> targets are especially open to interpretation', 'More information about the target doesn’t automatically make perception more accurate'] },
            { name: 'Situation', items: ['The same perceiver and target can be seen very differently depending on context'] }
          ],
          mnem: '<b>"Who’s looking, at what, and where."</b> Perceiver · Target · Situation.' },
        { t: 'flow', title: 'The five-stage perceptual process (lecture)', src: 'lec', ref: 'slides 12–14',
          steps: [{ h: '1 · Environmental stimuli', d: 'Everything out there' }, { h: '2 · Observation', d: 'Taking it in through the senses' }, { h: '3 · Perceptual selection', d: 'Only some stimuli get through. <b>Sensory overload</b> happens when there are too many. Driven by external factors (size, intensity, contrast) and internal ones (familiarity, source credibility)' }, { h: '4 · Organization', d: 'Construction and <b>perceptual grouping</b> (proximity, similarity), shaped partly by what others perceive' }, { h: '5 · Interpretation', d: 'Assigning meaning. This is where attribution errors come in' }],
          after: 'Slides 16–17 compress it to three checks when judging a person: <b>Selection/attention? Construction? Interpretation?</b>',
          mnem: '<b>"SOS, Oh I see"</b>: Stimuli → Observation → Selection → Organization → Interpretation.' },
        { t: 'flow', title: 'Bruner’s model of the perceptual process (textbook)', ref: 'Exhibit 3.3 · slide 15',
          steps: [{ h: 'Unfamiliar target', d: 'A new co-worker' }, { h: 'Openness to cues', d: 'Search for information' }, { h: 'Familiar cues', d: 'He’s a Stanford grad' }, { h: 'Target categorized', d: '"Good man, good potential"' }, { h: 'Cue selectivity', d: 'Declining performance is ignored' }, { h: 'Categorization strengthened', d: 'Still "good potential"' }],
          after: 'This shows three properties of perception: <b>selectivity</b> (not all cues are used equally), <b>perceptual constancy</b> (the target is seen the same way over time) and <b>perceptual consistency</b> (cues are selected, ignored or distorted to keep one consistent picture).',
          mnem: 'Picture a <b>funnel</b>: wide open at first, then narrowing into a fixed, self-confirming impression.' },
        { t: 'note', tone: 'trap', title: 'Which model is the question about?', body: 'Wording like "categorization," "cue selectivity," or a new co-worker being pigeonholed points to <b>Bruner</b>. "Sensory overload," "perceptual selection," or "grouping" points to the <b>five-stage process</b>. Slide 28 asks you to use "<i>either</i> perceptual model discussed in class," so know both.' },
        { t: 'cmp', title: 'Bruner vs the five-stage process', head: ['', 'Bruner (text)', 'Five-stage (lecture)'],
          rows: [['About', 'Forming an <b>impression of a person</b>', 'How <b>any</b> perception is built from raw sensory input'],
                 ['Signature words', 'Categorization, cue selectivity, constancy, consistency', 'Sensory overload, selection, grouping, interpretation'],
                 ['Explains bad judgments by', 'Early categorization, then selective confirmation', 'Selection driven by salience, not relevance; then distorted interpretation']] }
      ]
    },
    {
      id: 'identity', title: 'Social identity theory', ref: '§3.2',
      items: [
        { t: 'def', term: 'Social identity theory', ref: '§3.2', def: 'People form self-perceptions from a <b>personal identity</b> (their own interests, abilities and traits) and a <b>social identity</b> (membership in categories like gender, nationality or occupation). We categorize ourselves and others to make sense of the social world, and we see category members as fitting <b>prototypes</b> (the most typical attributes of the category).',
          more: 'Social identities are <b>relational and comparative</b> (they only mean something relative to other categories) and <b>situation-dependent</b>. The same person is "professor" in class and "Baby Boomer" to a neighbour.' }
      ]
    },
    {
      id: 'errors', title: 'Perceptual errors (8 on the lecture list)', ref: '§3.3 + slides 24–26',
      lede: 'The textbook’s "basic biases" list has six. The lecture’s list has <b>eight</b>: it adds self-fulfilling prophecy and the halo effect. Be ready for eight.',
      items: [
        { t: 'def', term: 'Primacy effect', ref: '§3.3', def: 'Relying on <b>early cues</b> or first impressions. It lasts because of perceptual constancy. <i>Slide example: the first moments of an interview outweigh the rest.</i>' },
        { t: 'def', term: 'Recency effect', ref: '§3.3', def: 'Relying on the <b>most recent cues</b> or last impressions. <i>Slide example: the last point made in an argument sways the verdict.</i> Primacy tends to dominate short, high-stakes encounters, and recency can dominate longer relationships.' },
        { t: 'def', term: 'Reliance on central traits', ref: '§3.3', def: 'Characteristics of <b>special interest to the perceiver</b> organize the whole impression. Physical attractiveness is a common one (the "beauty premium"). <i>Slides: appearance, height, weight.</i>' },
        { t: 'def', term: 'Implicit personality theories', ref: '§3.3', def: 'Personal theories about <b>which traits go together</b>, e.g., "hardworking people are also honest" or "organized, therefore reliable."' },
        { t: 'def', term: 'Projection', ref: '§3.3', def: 'Attributing <b>your own</b> thoughts and feelings to others. It can be efficient (assuming others are like you) or a form of <b>perceptual defence</b> (seeing your undesirable traits in others). <i>Slides: a dishonest person assumes others are dishonest.</i>' },
        { t: 'list', title: 'Stereotyping: 3 steps', ref: '§3.3', intro: 'Generalizing about a social category and ignoring the variation within it:',
          items: ['Distinguish a <b>category</b> of people.', 'Assume individuals in that category share certain <b>traits</b>.', 'Assume <b>everyone</b> in the category has those traits.'] },
        { t: 'def', term: 'Self-fulfilling prophecy', src: 'lec', ref: 'slides 24–26', def: 'Our <b>expectations</b> about a person lead that person to behave consistently with those expectations. (The text describes the mechanism when explaining why stereotypes persist but doesn’t list it as a named bias.)' },
        { t: 'def', term: 'Halo effect', src: 'lec', ref: 'slides + §3.7', def: 'One trait shapes the <b>general impression</b>: a well-dressed person is assumed to be more competent with no evidence. The textbook puts halo under <i>performance-appraisal rater errors</i>. The lecture treats it as a general perceptual error.' },
        { t: 'groups', title: 'The eight errors, grouped', noCard: false,
          groups: [
            { name: 'Timing (2)', items: ['Primacy', 'Recency'] },
            { name: 'Trait-spread (3)', items: ['Halo', 'Central traits', 'Implicit personality theories'] },
            { name: 'Transfer (3)', items: ['Projection', 'Stereotyping', 'Self-fulfilling prophecy'] }
          ],
          mnem: '<b>The three T’s. Timing</b> (when the cue arrived) · <b>Trait-spread</b> (one trait or cluster spreads to the whole impression) · <b>Transfer</b> (something from the perceiver or the category is transferred onto the target). 2 + 3 + 3 = 8.' },
        { t: 'note', tone: 'trap', title: 'Not all stereotypes are wrong or negative', body: 'The text says <i>most</i> stereotypes are inaccurate, especially when applied to individuals, but some are accurate (professors’ education levels), and people hold <b>favourable</b> stereotypes of their in-groups. Stereotypes develop most when the perceiver <i>lacks</i> good information.' },
        { t: 'note', tone: 'lec', title: 'The lecture opener', body: 'Students described a bartender, car salesperson, programmer and banker (stereotyping by occupation), then picked "who would you rather work for" from photos: <b>Billy McFarland</b> (Fyre Festival, wire fraud) vs <b>Jack Welch</b> (GE), and <b>Indra Nooyi</b> (PepsiCo) vs <b>Elizabeth Holmes</b> (Theranos). The point: appearance and first impressions drive judgments that the facts later contradict (central traits, halo, primacy).' }
      ]
    },
    {
      id: 'attribution', title: 'Attribution', ref: '§3.4 + slides 18–21',
      items: [
        { t: 'cmp', title: 'Dispositional vs situational attribution', ref: '§3.4', head: ['', 'Dispositional', 'Situational'],
          rows: [['Also called (slides)', '<b>Internal</b> attribution', '<b>External</b> attribution'],
                 ['Cause lies in…', 'The person’s personality or intellect (the "true person")', 'The environment; the person had little control'],
                 ['Slide examples', 'Intelligence, greed, friendliness, laziness', 'Bad weather, good luck, proper tools, poor advice']],
          after: 'Slide 18’s test question: "Is high performance on the exam due to ability or easy questions?"' },
        { t: 'cmp', title: 'The three attribution cues', ref: '§3.4', head: ['Cue', 'Question it asks', 'Points to disposition when…'],
          rows: [['<b>Consistency</b>', 'Does the person behave this way <b>regularly over time</b>?', '<b>High</b>'],
                 ['<b>Consensus</b>', 'Do <b>other people</b> behave this way in the same situation?', '<b>Low</b> (the behaviour is unusual)'],
                 ['<b>Distinctiveness</b>', 'Does it happen <b>only in this situation</b>, or across many?', '<b>Low</b> (it shows up across situations)']],
          mnem: 'Dispositional = <b>"High-Low-Low"</b> (consistency high, consensus low, distinctiveness low). "Always does it, nobody else does, does it everywhere → it’s <i>them</i>."' },
        { t: 'cmp', title: 'The Roshani / Mika / Sam exercise', ref: 'Exhibit 3.4 · slides 20–21', head: ['Person', 'Consistency', 'Consensus', 'Distinctiveness', 'Attribution'],
          rows: [['Roshani', 'High', 'Low', 'Low', '<b>Dispositional</b>'], ['Mika', 'High', '<b>High</b>', '<b>High</b>', '<b>Situational</b>'], ['Sam', '<b>Low</b>', 'High', 'Low', '<b>Temporary</b> situational']],
          after: 'Consistency is high for <b>both</b> Roshani and Mika. It’s <b>consensus and distinctiveness</b> that flip between dispositional and situational.' },
        { t: 'note', tone: 'trap', title: 'Distinctiveness: the slide’s wording vs the textbook', body: 'Slide 19 says "<i>High</i> distinctiveness across situations is attributed to disposition." Taken literally, that contradicts the text: behaviour that shows up <b>across</b> situations is <b>low</b> distinctiveness, and that points to disposition. The slide’s own exercise follows the textbook. On the exam, <b>reason from the behaviour</b>: many situations means low distinctiveness, which means dispositional.' },
        { t: 'cmp', title: 'Three attribution biases', ref: '§3.4', head: ['Bias', 'Whose behaviour', 'What happens'],
          rows: [['<b>Fundamental attribution error</b>', '<b>Other people’s</b>', 'Over-emphasizing dispositional explanations and discounting the situation (partly because we discount social roles and see others in constant situations)'],
                 ['<b>Actor–observer effect</b>', 'The <b>same</b> behaviour from two viewpoints', 'Actors explain their own behaviour <b>situationally</b>. Observers explain it <b>dispositionally</b>. Strongest for negative events'],
                 ['<b>Self-serving bias</b>', '<b>Your own</b> successes and failures', 'Success → disposition ("I’m skilled"). Failure → situation ("the test was unfair")']],
          mnem: '<b>FAE = "blame them." A–O = "two people, one event." SSB = "my wins, not my losses."</b>' },
        { t: 'note', tone: 'trap', title: 'Read whose perspective it is', body: 'If a vignette has a manager calling a late employee "irresponsible" <i>while</i> the employee blames the bus, that’s the <b>actor–observer effect</b> (two perspectives on one event). Self-serving bias is about one person explaining their <i>own</i> success vs failure.' }
      ]
    },
    {
      id: 'diversity', title: 'Perception & workforce diversity', ref: '§3.5',
      items: [
        { t: 'def', term: 'Workforce diversity', ref: '§3.5', def: 'Differences among employees or recruits in characteristics such as gender, race, age, religion, cultural background, physical ability or sexual orientation.', after: 'Slide 27 framing: the 15 Percent Pledge, Black Lives Matter, and the projection that visible minorities will be <b>30.6%</b> of Canada’s population by 2031.' },
        { t: 'def', term: 'Stereotype threat', ref: '§3.5', def: 'Members of a group fear they’ll be judged by a stereotype and that their own behaviour will <b>confirm it</b>, and that fear itself depresses performance (e.g., on tests when demographic identity is made salient).' },
        { t: 'note', tone: 'trap', title: 'Stereotyping vs stereotype threat', body: '<b>Stereotyping</b> is a bias held by the <b>perceiver</b>. <b>Stereotype threat</b> affects the <b>target’s own performance</b>. They’re easy to swap on a "define X" question.' },
        { t: 'cmp', title: 'Tolerating vs valuing diversity', ref: '§3.5', head: ['', 'Tolerating', 'Valuing'],
          rows: [['Approach', 'Fair hiring, then help minority members "fit in" to a narrow mainstream culture', 'Treats diversity as a <b>strategic, competitive advantage</b>'],
                 ['Cox & Blake arguments', '—', 'Cost · resource acquisition · marketing · creativity · problem solving · system flexibility']] },
        { t: 'list', title: 'Managing diversity in practice', ref: '§3.5', bullets: true,
          items: ['Recruit enough minority members to get past <b>"token" status</b>.', 'Develop an <b>employment equity plan</b>.', 'Offer <b>flexible work arrangements</b>.', 'Encourage <b>cross-group teamwork</b>.', 'Base career decisions on <b>accurate information</b>, not hearsay.', 'Pair <b>awareness training with skills training</b>. Awareness-only training can backfire by activating bias without changing behaviour.'] },
        { t: 'def', term: 'Diversity climate', ref: '§3.5', def: 'How much an organization advocates fair HR policies, promotes equal opportunity and inclusion, and <b>socially integrates</b> underrepresented employees. It relates positively to satisfaction, commitment, engagement and performance, and negatively to turnover.' }
      ]
    },
    {
      id: 'ob', title: 'Perceptions in OB: climate, trust, support', ref: '§3.6',
      items: [
        { t: 'def', term: 'Organizational climate', ref: '§3.6', def: 'Employees’ <b>shared perceptions</b> of the organization’s policies, practices and procedures, and of which behaviours are expected, supported and rewarded. Types include diversity, safety, service and ethical climate.' },
        { t: 'list', title: 'Trust: 3 perceptions it’s built on', ref: '§3.6', intro: '<b>Trust</b> is a psychological state involving a <b>willingness to be vulnerable</b> and take risks, based on positive expectations of another party (the slides use that phrase).',
          items: ['<b>Ability</b>: management’s competence and skill.', '<b>Benevolence</b>: management is seen as caring about employees’ interests.', '<b>Integrity</b>: management sticks to acceptable values and principles.'],
          mnem: '<b>ABI: "Able, Benevolent, Integrity."</b> Can they, do they care, will they do right?' },
        { t: 'def', term: 'Perceived organizational support (POS)', ref: '§3.6', def: 'Employees’ general belief that the organization <b>values their contributions and cares about their well-being</b>. <b>Organizational support theory</b>: employees with strong POS feel obligated to care about the organization in return, the <b>norm of reciprocity</b>. <b>Perceived supervisor support (PSS)</b> is a key antecedent, because supervisors act as the organization’s representatives.' },
        { t: 'note', tone: 'trap', title: 'Don’t merge trust and POS, and don’t drag in justice', body: 'Trust (ability, benevolence, integrity) and POS (reciprocity) are separate frameworks. Distributive, procedural and interactional <b>justice</b> are Chapter 4 concepts (Week 2), not Chapter 3.' }
      ]
    },
    {
      id: 'hrm', title: 'Perception in HRM', ref: '§3.7',
      items: [
        { t: 'def', term: 'Signalling theory', ref: '§3.7', def: 'Job applicants, lacking full information, read their recruitment and selection experiences (the tone of questions, fairness of tests, how they’re treated) as <b>signals</b> of what the organization and job are really like. This shapes whether they accept an offer.' },
        { t: 'list', title: 'Employment-interview biases', ref: '§3.7',
          items: ['Comparing applicants to a (possibly inaccurate) stereotype of the <b>"ideal applicant."</b>', '<b>Primacy</b>: early information (even a pre-interview résumé scan) has an outsized effect.', '<b>Negative information</b> is weighted more heavily than positive.', '<b>Contrast effects</b>: earlier applicants distort how the current one is seen. An average candidate looks worse after two excellent ones and better after two weak ones.'],
          after: '<b>Fix: structured interviews</b>, with standardized numeric scoring, job-related behavioural and situational questions, a consistent question order, and limited off-topic rapport-building.' },
        { t: 'cmp', title: 'Performance-appraisal rater errors', ref: '§3.7', head: ['Error', 'What it looks like'],
          rows: [['<b>Leniency</b>', 'Rating everyone especially <b>favourably</b>'], ['<b>Harshness</b>', 'Rating everyone especially <b>unfavourably</b>'], ['<b>Central tendency</b>', 'Rating almost everyone in the <b>middle</b>, avoiding extremes'], ['<b>Halo effect</b>', 'A rating on one trait <b>colours</b> ratings on unrelated traits'], ['<b>Similar-to-me</b>', 'Favouring ratees who share the rater’s background or attitudes']],
          after: '<b>Fixes:</b> <b>BARS</b> (behaviourally anchored rating scales, with specific behavioural examples anchoring each level) and <b>frame-of-reference (FOR) training</b> (raters practise applying a shared standard and get feedback on their accuracy).',
          mnem: 'Leniency, harshness and central tendency are about <b>where ratings cluster</b> (high / low / middle). Halo is <b>one trait bleeding into others</b>. Similar-to-me is <b>rater–ratee similarity</b>.' }
      ]
    }
  ],

  quiz: [
    { q: 'Aiden misses a deadline every week. His teammates rarely miss deadlines, and he missed them regularly at his last co-op too. His manager will most likely attribute this to:', o: ['Aiden’s disposition', 'A temporary situational factor', 'The team’s workload', 'Poor training'], a: 0, why: 'High consistency (every week) + low consensus (teammates don’t) + low distinctiveness (the last job too) = <b>dispositional</b>. If workload were the cause, teammates would miss deadlines too.' },
    { q: 'A manager calls a chronically late employee "irresponsible," ignoring that the bus route was cancelled. The employee blames the bus schedule. This pair of reactions illustrates:', o: ['The actor–observer effect', 'Self-serving bias only', 'Stereotype threat', 'Perceptual defence'], a: 0, why: 'Actor = situational, observer = dispositional, for the <b>same</b> behaviour. That’s the <b>actor–observer effect</b>.' },
    { q: 'A store manager rates nearly every employee "average," rarely using "excellent" or "poor" even though performance clearly varies. This is:', o: ['Central tendency', 'Halo effect', 'Leniency', 'Similar-to-me effect'], a: 0, why: 'Clustering ratings in the <b>middle</b> is <b>central tendency</b>. Leniency clusters at the high end.' },
    { q: 'An interviewer sees two outstanding candidates, then rates an average third candidate "below average." This is most likely:', o: ['A contrast effect', 'The recency effect', 'Projection', 'The self-fulfilling prophecy'], a: 0, why: 'The earlier candidates distorted the perception of the current one. That’s a <b>contrast effect</b>.' },
    { q: 'Which statement about stereotypes is TRUE, according to the textbook?', o: ['Some stereotypes are accurate, and people hold favourable stereotypes of their in-groups', 'All stereotypes are inaccurate', 'Stereotypes always involve unfavourable traits', 'Stereotyping is most likely when the perceiver has extensive information'], a: 0, why: 'The text says <i>most</i>, not all, are inaccurate. Favourable ones exist, and stereotyping thrives when the perceiver <i>lacks</i> information.' },
    { q: 'A student takes full credit for an A ("I studied hard") but blames a C on "unfair questions." This is:', o: ['Self-serving bias', 'Fundamental attribution error', 'Actor–observer effect', 'Implicit personality theory'], a: 0, why: 'Success → disposition, failure → situation, for <b>one’s own</b> outcomes. That’s <b>self-serving bias</b>.' },
    { q: 'A new co-worker is labelled "high potential" because of his Stanford degree. Later, his declining performance is ignored. Which model best describes this?', o: ['Bruner’s model of the perceptual process', 'The five-stage perceptual process', 'Signalling theory', 'Social identity theory'], a: 0, why: 'Categorization, then <b>cue selectivity</b>, then categorization strengthened is <b>Bruner’s model</b>. This is the textbook’s own example.' },
    { q: 'In the lecture’s five-stage perceptual process, "sensory overload" happens at which stage?', o: ['Perceptual selection', 'Observation', 'Organization', 'Interpretation'], a: 0, why: 'Too many stimuli to process is a <b>selection</b> problem (stage 3). Remember "SOS, Oh I see."' },
    { q: 'A manager expects a new hire to struggle, gives her fewer chances to shine, and she ends up performing poorly. This illustrates:', o: ['The self-fulfilling prophecy', 'The halo effect', 'Projection', 'The primacy effect'], a: 0, why: 'Expectations led the person to behave <b>consistently with them</b>. That’s a <b>self-fulfilling prophecy</b> (on the lecture’s list).' },
    { q: 'A dishonest employee assumes all his co-workers are padding their expense claims too. This is:', o: ['Projection', 'Stereotyping', 'Implicit personality theory', 'Central traits'], a: 0, why: 'Attributing <b>your own</b> thoughts and feelings to others is <b>projection</b>, and here it may also work as perceptual defence.' },
    { q: 'An interviewer assumes a candidate who arrives very well-dressed must also be competent and reliable, with no evidence. Which error is on the lecture list but filed under rater errors in the textbook?', o: ['Halo effect', 'Contrast effect', 'Recency effect', 'Stereotype threat'], a: 0, why: 'One trait shaping the general impression is the <b>halo effect</b>.' },
    { q: 'Women told a math test "shows gender differences" score lower than women who weren’t told. This is:', o: ['Stereotype threat', 'Stereotyping', 'Self-serving bias', 'Perceptual defence'], a: 0, why: 'Fear of confirming a stereotype lowers the <b>target’s own</b> performance. That’s <b>stereotype threat</b>.' },
    { q: 'Employees believe management is competent, cares about their interests and sticks to sound principles. These are the three bases of:', o: ['Trust', 'Perceived organizational support', 'Diversity climate', 'Organizational commitment'], a: 0, why: 'Ability + benevolence + integrity = <b>trust</b> ("ABI").' },
    { q: 'Because the company supported her through a family crisis, Leila now volunteers for extra projects to "give back." This best reflects:', o: ['POS and the norm of reciprocity', 'The halo effect', 'Signalling theory', 'Continuance commitment'], a: 0, why: 'Strong <b>perceived organizational support</b> creates a felt obligation to reciprocate (organizational support theory).' },
    { q: 'An applicant turns down an offer because the interviewer was dismissive and the tests felt unfair: "That’s probably what working there is like." This illustrates:', o: ['Signalling theory', 'Contrast effects', 'Projection', 'Stereotype threat'], a: 0, why: 'Applicants read the selection experience as <b>signals</b> of what the organization is really like.' },
    { q: 'Which pattern of cues produces a SITUATIONAL attribution in the textbook’s example (Mika)?', o: ['High consistency, high consensus, high distinctiveness', 'High consistency, low consensus, low distinctiveness', 'Low consistency, high consensus, low distinctiveness', 'Low consistency, low consensus, high distinctiveness'], a: 0, why: 'Mika: <b>High/High/High → situational</b>. High/Low/Low is Roshani (dispositional). Low/High/Low is Sam (temporary situational).' },
    { q: 'Which is the best way to reduce rater errors like halo and leniency?', o: ['Frame-of-reference training and BARS', 'More awareness-only diversity training', 'Longer, unstructured interviews', 'Letting managers rate from memory at year end'], a: 0, why: '<b>FOR training</b> and <b>behaviourally anchored rating scales</b> are the textbook’s fixes.' },
    { q: 'The tendency to overemphasize dispositional explanations for OTHER people’s behaviour is:', o: ['The fundamental attribution error', 'The actor–observer effect', 'Self-serving bias', 'The primacy effect'], a: 0, why: 'That’s the definition of the <b>fundamental attribution error</b>.' },
    { q: 'The perceiver’s tendency to screen out or distort information that would provoke unpleasant emotions is called:', o: ['Perceptual defence', 'Perceptual constancy', 'Sensory overload', 'Projection'], a: 0, why: '<b>Perceptual defence</b> is part of the perceiver component.' }
  ],

  prompts: [
    { q: '<i>(Dr. Kassaye’s slide 28, Q4)</i> <b>Using either perceptual model discussed in class, explain why performance appraisals and interviewer judgments are frequently inaccurate. Recommend how an organization can improve them.</b>',
      name: '<b>Bruner’s model</b> (or the five-stage process), plus named errors: <b>primacy</b>, <b>halo</b>, <b>similar-to-me</b>, <b>contrast effects</b>, <b>central tendency / leniency</b>.',
      define: 'Bruner’s model: faced with an unfamiliar target, the perceiver picks up familiar cues, crudely categorizes the person, then searches cues selectively to confirm that category, which strengthens even when contradictory cues appear.',
      apply: 'An interviewer categorizes early from the résumé or the first minutes (primacy), then notices only confirming cues (cue selectivity), so the judgment reflects the category, not performance. In appraisals, a single strong trait colours every rating (halo), and similar ratees get favoured (similar-to-me). With the five-stage model: selection is driven by salience (size, intensity, contrast) rather than job relevance, and interpretation is then distorted by attribution errors.',
      recommend: 'Use <b>structured interviews</b> (standard questions, numeric scoring, the same order) and score each candidate immediately to avoid contrast effects. For appraisals, use <b>BARS</b> and <b>frame-of-reference training</b> so raters apply a shared, behaviour-based standard.',
      also: 'Signalling theory (bad interviews also cost you candidates); stereotyping; implicit personality theories.' },
    { q: 'Every Monday, Nadia submits her sales report late. Her colleagues submit theirs on time, and Nadia was also late with reports at her previous company. Her manager is unsure whether to discipline her or change the reporting process. <b>Use attribution theory to advise the manager.</b>',
      name: '<b>Attribution theory</b>: consistency, consensus and distinctiveness cues. Beware the <b>fundamental attribution error</b> and the <b>actor–observer effect</b>.',
      define: 'Attribution is assigning causes to behaviour, either dispositional (internal) or situational (external), judged from three cues: consistency (over time), consensus (compared with others), and distinctiveness (across situations).',
      apply: 'Every Monday = <b>high consistency</b>. Colleagues are on time = <b>low consensus</b>. Late at her last job too = <b>low distinctiveness</b> (the behaviour appears across situations). High-Low-Low points to a <b>dispositional</b> cause, which matches Roshani in the textbook.',
      recommend: 'Address it with Nadia directly (goal-setting, clear expectations, feedback), not with a process change. But ask her side first: the manager is an observer and prone to the FAE, and Nadia may give situational reasons (actor–observer effect) that are worth checking.',
      also: 'Self-serving bias if Nadia blames the process; perceptual defence.' },
    { q: '<i>(Slide 28, Q5 + Q3)</i> <b>Give two reasons people project their beliefs and values onto others, and explain how someone can improve the impression they leave on others in an organization.</b>',
      name: '<b>Projection</b>, <b>perceptual defence</b>, the <b>primacy effect</b>, <b>central traits</b>, <b>target ambiguity</b>.',
      define: 'Projection is attributing your own thoughts and feelings to others. The primacy effect is relying on early cues. Central traits are the characteristics the perceiver cares most about, and they organize the whole impression.',
      apply: 'Reason 1: projection is an efficient default. With little information, assuming others are like us is a quick guess. Reason 2: projection works as <b>perceptual defence</b>. Seeing our undesirable traits in others protects us from acknowledging them. For impressions: first encounters carry outsized weight (primacy, perceptual constancy), and ambiguous targets get filled in by the perceiver’s own categories.',
      recommend: 'Invest in first encounters. Give clear, unambiguous cues about competence (reduce target ambiguity). Learn which central traits the key perceivers value (e.g., reliability, preparation) and show them early and consistently.',
      also: 'Stereotyping; implicit personality theories; Bruner’s model (categorization sticks).' },
    { q: 'A consulting firm has a written non-discrimination policy, but employees from underrepresented groups report feeling excluded, and turnover among them is high. Leadership wants to improve its "diversity climate." <b>Recommend two actions and justify them.</b>',
      name: '<b>Diversity climate</b>, <b>valuing vs tolerating diversity</b>, <b>token status</b>, <b>stereotype threat</b>, <b>POS</b>.',
      define: 'Diversity climate is the extent to which an organization advocates fair HR policies, promotes equal opportunity and inclusion, and socially integrates underrepresented employees. It’s shared perception, not written policy.',
      apply: 'A policy alone is "tolerating." Employees perceive exclusion, so the climate is weak, which predicts lower commitment and higher turnover. Small numbers (token status) make stereotypes salient and can trigger stereotype threat.',
      recommend: '(1) Recruit past token status and build an employment equity plan, so coworkers focus on individual accomplishment. (2) Pair awareness training with <b>skills</b> training (structured interviews, FOR rater training), since awareness-only training can backfire. Also strengthen <b>POS</b> through supervisor support (PSS).',
      also: 'Cox & Blake’s competitive-advantage arguments (creativity, problem solving, marketing).' },
    { q: '<i>(Slide 28, Q1–Q2)</i> Think about your first class of this course. <b>What factors shaped your perception of the course and instructor on day one? Describe a time a perception of yours was wrong and name the errors that caused it.</b>',
      name: 'The <b>three components</b> of perception (perceiver, target, situation), the <b>primacy effect</b>, plus two of the eight errors (e.g., stereotyping, halo).',
      define: 'Perception is interpreting sensory messages to give the environment order and meaning. It’s shaped by the perceiver (experience, needs, emotions), the target (ambiguity) and the situation (context).',
      apply: 'Perceiver: expectations from friends and past courses, your needs (an easy A?), your mood that day. Target: an unfamiliar instructor is ambiguous, so your categories fill the gaps. Situation: a large lecture hall at 4:30 pm. Primacy then makes that first impression stick. Wrong-perception example: judging a groupmate lazy after one missed meeting (primacy + FAE) when they’d been sick.',
      recommend: 'Deliberately re-check first impressions after new information (fight constancy and consistency), and separate the observed behaviour from your interpretation of it (five-stage: interpretation is where errors enter).',
      also: 'Bruner’s model; the fundamental attribution error.' }
  ]
});
