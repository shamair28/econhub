/* Week 4 — Motivation (Ch 5 §5.1, 5.3–5.6 · Ch 6 · Ch 2 §2.4–2.8 Learning) */
SME.addWeek({
  id: 'w4', num: 4, title: 'Motivation', dates: 'Sept 28 – Oct 2',
  chapterLine: 'Ch 5, 6 + Ch 2 Learning',
  chapters: [
    { c: 'Ch 5', t: 'Theories of Work Motivation', s: '§5.1, 5.3–5.6', note: 'the outline starts it in Week 3; §5.2 is on the Week 2 page' },
    { c: 'Ch 6', t: 'Motivation in Practice', s: '§6.1–6.8' },
    { c: 'Ch 2', t: 'Learning', s: '§2.4–2.8', note: 'Part B, paired with Ch 6 under "Motivation cont."' }
  ],
  sources: ['Textbook Ch 5, 6, 2 (Part B)', 'Week 4 slides not yet posted'],
  keys: ['Maslow / ERG', 'McClelland', 'SDT', 'Expectancy', 'Equity', 'Goal setting', 'JCM + MPS', 'Pay plans', 'Reinforcement'],

  brief: [
    '<b>Motivation</b> is the extent to which <b>persistent effort is directed toward a goal</b> (effort · persistence · direction · goals). It’s <b>not</b> the same as performance, which also depends on ability, personality, EI, task understanding and chance.',
    '<b>Need theories</b> say <i>what</i> motivates: <b>Maslow</b> (5 levels), <b>Alderfer’s ERG</b> (adds <b>frustration-regression</b>), <b>McClelland</b> (n Ach, n Aff, n Pow; effective managers = high n Pow, <b>low</b> n Aff), and <b>SDT</b> (competence, autonomy, relatedness → autonomous vs controlled motivation).',
    '<b>Process theories</b> say <i>how</i>: <b>Expectancy</b> (Force = Σ(V × I) × E; expectancy = effort→performance, instrumentality = performance→outcome), <b>Equity</b> (ratio comparison; 5 ways to restore equity), and <b>Goal setting</b> (specific, challenging, committed, with feedback; 4 mechanisms).',
    '<b>In practice (Ch 6)</b>: pay (piece-rate problems: <b>"Lousy Deals Ruin Incentive Rates"</b>; merit pay fails when <b>Low, Small, Secret</b>; team plans: <b>PEGS</b>), job design (<b>JCM</b>: <b>"a VISA Fee"</b> → 3 psychological states; <b>MPS</b>), enrichment vs enlargement, MBO, flexible work.',
    '<b>Learning (Ch 2B)</b>: operant learning. Positive reinforcement (add good) and negative reinforcement (remove bad) both <b>increase</b> behaviour. Punishment adds bad to decrease it, and extinction removes the reinforcer. Also <b>social cognitive theory</b>: observational learning, self-efficacy (4 sources), self-regulation.'
  ],
  split: 'Assignment #1 Q4 and Q5 are <b>both</b> Motivation. <b>SME A: Ch 5 theories</b> (need + process theories, culture, the integrative model). <b>SME B: Ch 6 practice + Ch 2 Learning</b> (pay plans, JCM/MPS, enrichment, MBO, flex work, reinforcement, SCT). Both should know <b>expectancy theory</b> and the <b>JCM</b>: a Q4/Q5 pair will very likely pit "diagnose why they’re unmotivated" (theory) against "redesign the job or pay" (practice).',
  lens: 'The classic setup: a demotivated person or team. <b>Diagnose</b> with a Ch 5 theory (is it low expectancy, low instrumentality, low valence, or inequity? an unmet need?), then <b>fix</b> with a Ch 6 practice (job enrichment raising specific JCM characteristics, a better pay plan, MBO goals) or reinforcement. Naming the theory and the practice turns an 8-mark answer into a 10.',

  sections: [
    {
      id: 'basics', title: 'What motivation is', ref: '§5.1',
      items: [
        { t: 'list', title: 'The four properties of motivation', ref: '§5.1', intro: 'Motivation = the extent to which <b>persistent effort is directed toward a goal</b>.',
          items: ['<b>Effort</b>: the strength or amount of work-related behaviour.', '<b>Persistence</b>: sustaining effort over time, not just in bursts.', '<b>Direction</b>: channelling effort toward outcomes that help the organization ("working smart as well as hard").', '<b>Goals</b>: what motivated behaviour aims at. A goal can be dysfunctional for the organization (absenteeism, sabotage) and still be motivated.'],
          mnem: '<b>"Every Person Directs Goals"</b>: Effort · Persistence · Direction · Goals.' },
        { t: 'cmp', title: 'Intrinsic vs extrinsic motivation', ref: '§5.1', head: ['', 'Intrinsic', 'Extrinsic'],
          rows: [['Source', 'The direct relationship between worker and task; usually self-applied', 'The work environment outside the task; usually applied by others'],
                 ['Examples', 'Achievement, competence, interest in the task', 'Pay, benefits, supervision, policy'],
                 ['Predicts', 'Performance <b>quality</b>, complex tasks', 'Performance <b>quantity</b>']],
          after: 'Some rewards are both (a promotion, a compliment). Extrinsic rewards can undermine intrinsic motivation only under narrow, avoidable conditions. <b>Motivation purity bias</b>: candidates who mention extrinsic rewards are unfairly seen as less intrinsically motivated.' },
        { t: 'def', term: 'Performance (≠ motivation)', ref: '§5.1 · Exhibit 5.1', def: 'The extent to which a member contributes to organizational objectives. It depends on <b>motivation</b> plus <b>personality, general cognitive ability, emotional intelligence, task understanding and chance</b>. High motivation doesn’t guarantee high performance.' }
      ]
    },
    {
      id: 'needs', title: 'Need theories: what motivates', ref: '§5.3',
      lede: 'Need theories: NEEDS → BEHAVIOUR → INCENTIVES &amp; GOALS. Process theories (next section) explain <i>how</i> motivation happens.',
      items: [
        { t: 'list', title: 'Maslow’s hierarchy of needs', ref: '§5.3', intro: 'From lowest to highest. The <b>lowest unsatisfied need</b> motivates most, and a satisfied need stops motivating, except self-actualization, a "growth" need that gets <i>stronger</i> as it’s fulfilled.',
          items: ['<b>Physiological</b>: food, water, shelter (minimum survival pay).', '<b>Safety</b>: security, stability (safe conditions, job security, insurance).', '<b>Belongingness</b>: social interaction, friendship (teamwork, supportive supervision).', '<b>Esteem</b>: competence, recognition (mastery, awards, promotions).', '<b>Self-actualization</b>: developing your true potential (creative, growth-oriented work).'],
          after: 'The textbook calls the pyramid a <b>misconception</b> Maslow never endorsed. A <b>ladder</b> is more accurate (you can move up and down and be partly satisfied at several levels). Research support is weak for five rigid levels, but fair for a two-level lower/higher split.',
          mnem: '<b>"Please Stop Being Egotistical, Sam"</b>: Physiological · Safety · Belongingness · Esteem · Self-actualization.' },
        { t: 'cmp', title: 'Alderfer’s ERG vs Maslow', ref: '§5.3', head: ['ERG need', '≈ Maslow levels', 'Meaning'],
          rows: [['<b>Existence</b>', 'Physiological + material safety', 'Material and physiological needs'], ['<b>Relatedness</b>', 'Belongingness + interpersonal esteem', 'Open, honest interpersonal exchange'], ['<b>Growth</b>', 'Self-actualization + achievement-based esteem', 'Fully using and developing one’s abilities']],
          after: 'ERG’s two premises: (1) the more lower-level needs are gratified, the more higher-level satisfaction is desired (same as Maslow); (2) <b>the less higher-level needs are gratified, the more lower-level satisfaction is desired</b>. This is <b>frustration-regression</b>, the key departure from Maslow. ERG has better research support because it doesn’t force a fixed order.' },
        { t: 'note', tone: 'trap', title: 'Maslow vs Alderfer', body: 'Only <b>Alderfer</b> says a frustrated higher need makes <i>lower</i> needs regain strength (e.g., blocked from growth → demands more pay). Maslow says a satisfied need simply stops motivating.' },
        { t: 'cmp', title: 'McClelland’s three needs', ref: '§5.3', intro: 'Non-hierarchical: under what conditions does each need produce which behaviour pattern?',
          head: ['Need', 'Behaviour signature', 'Best fit'],
          rows: [['<b>Achievement (n Ach)</b>', 'Wants challenging tasks done well; prefers personal responsibility, moderately difficult goals with calculated risk, and feedback', 'Sales, entrepreneurship'],
                 ['<b>Affiliation (n Aff)</b>', 'Wants friendly, compatible relationships; avoids conflict and competition; conforms', 'Social work, customer relations'],
                 ['<b>Power (n Pow)</b>', 'Wants to influence others and make an impact; seeks influential settings', 'Management, journalism']],
          mnem: '<b>Effective managers = high n Pow + LOW n Aff</b>, with power directed at organizational goals. The intuitive answer (high affiliation) is the trap.' },
        { t: 'def', term: 'Self-determination theory (SDT)', ref: '§5.3', def: 'Three <b>universal</b> psychological needs: <b>competence</b>, <b>autonomy</b> and <b>relatedness</b>. When they’re satisfied, motivation is <b>autonomous</b> (self-motivated: the task is interesting or chosen, and internally regulated). When they aren’t, it’s <b>controlled</b> (done for a reward, to avoid punishment, or because you’re watched). SDT is about motivation <i>quality</i>, not quantity.',
          more: '<b>Autonomy support</b> (the manager gives a rationale, offers choice, acknowledges perspectives and encourages initiative) is the key predictor of need satisfaction and autonomous motivation, and it can be trained.',
          mnem: 'SDT needs = <b>"CAR"</b>: Competence · Autonomy · Relatedness. Driving your own <b>CAR</b> = autonomous motivation.' },
        { t: 'note', tone: 'trap', title: 'Autonomous/controlled ≈ but ≠ intrinsic/extrinsic', body: 'SDT’s lens is the <b>degree of internal vs external regulation</b>. It’s close to intrinsic/extrinsic, but not interchangeable on a precisely worded MC question.' }
      ]
    },
    {
      id: 'process', title: 'Process theories: how motivation works', ref: '§5.4',
      items: [
        { t: 'groups', title: 'Expectancy theory (Vroom): components', ref: '§5.4',
          groups: [
            { name: 'Outcomes', items: ['<b>First-level</b>: e.g., high vs average productivity', '<b>Second-level</b>: personally relevant consequences (pay, accomplishment, peer acceptance, fatigue)'] },
            { name: 'Expectancy (E)', items: ['Probability that <b>effort → first-level outcome</b> (performance)', 'Text: a machinist is certain she can do 15 units/day (E = 1.0) but less sure about 20 (E = 0.6)'] },
            { name: 'Instrumentality (I)', items: ['Probability that <b>performance → second-level outcome</b>', 'Text: a bank teller figures a good rating leads to a raise 50:50 (I = 0.5)'] },
            { name: 'Valence (V) & Force', items: ['<b>Valence</b>: how attractive an outcome is to <i>this</i> person', '<b>Force</b>: the resulting effort directed toward an outcome'] }
          ],
          mnem: '<b>E</b> = "Can I do it?" (Effort → Performance). <b>I</b> = "Will I get it?" (Performance → Outcome). <b>V</b> = "Do I want it?"' },
        { t: 'formula', title: 'Expectancy theory force formula', ref: '§5.4', f: 'Force = Σ (Valence × Instrumentality) × Expectancy',
          body: 'People are motivated toward outcomes that are attractive <b>and</b> that they believe they can achieve. If expectancy ≈ 0, <b>no valence can compensate</b>: the whole product collapses. <b>Manager levers:</b> boost expectancies (training, clear procedures, proper tools); clarify reward contingencies (make instrumentalities explicit and honour them); appreciate diverse valences (individualize rewards).' },
        { t: 'note', tone: 'trap', title: 'Expectancy vs instrumentality (reversed constantly)', body: '"She doesn’t think she <i>can</i> hit the target" is low <b>expectancy</b>. "She doesn’t believe hitting it will <i>get her the bonus</i>" is low <b>instrumentality</b>. "She doesn’t care about the bonus" is low <b>valence</b>.' },
        { t: 'formula', title: 'Equity theory (Adams)', ref: '§5.4', f: 'My outcomes ÷ My inputs  vs  Other’s outcomes ÷ Other’s inputs',
          body: 'Inequity is unpleasant, and people are motivated to reduce it. <b>Underpayment</b> effects are well supported (workers lower effort or, under piece-rate, raise low-quality output). <b>Overpayment</b> predictions are weakly supported (people tolerate it or rationalize it). <b>Gender:</b> men and women tend to pick same-sex comparison others, which may help sustain pay gaps.' },
        { t: 'list', title: 'Five ways to restore equity', ref: '§5.4',
          items: ['<b>Distort your own</b> inputs or outcomes (perceptually).', '<b>Distort the comparison other’s</b> inputs or outcomes.', '<b>Choose a different</b> comparison person or group.', '<b>Alter your own</b> inputs or outcomes (behaviourally: work less, ask for a raise).', '<b>Leave</b> the relationship.'],
          mnem: 'The first three happen <b>in your head</b>; the last two are <b>actions</b>. "Distort me, distort them, swap them, change me, leave."' },
        { t: 'list', title: 'Goal-setting theory (Locke & Latham): what makes goals motivating', ref: '§5.4',
          items: ['<b>Specific</b>', '<b>Challenging</b>', 'Backed by <b>commitment</b>', 'Accompanied by <b>feedback</b>'],
          after: '<b>Goal commitment</b> is boosted by participation (mainly when trust is low or information is needed) and by management support (coercion kills it). It’s largely independent of money.',
          mnem: '<b>"SCCF: Set Clear, Challenging goals, Commit, get Feedback."</b>' },
        { t: 'list', title: 'Four mechanisms: how goals improve performance', ref: '§5.4 · Exhibit 5.6',
          items: ['They <b>direct attention</b>.', 'They <b>increase effort</b>.', 'They <b>increase persistence</b>.', 'They prompt <b>task strategies</b> (discovering and using task-relevant strategies).'],
          mnem: '<b>"Aim, Energy, Persistence, Strategy."</b> The first three mirror the properties of motivation (direction, effort, persistence). Strategy is the extra one goals add.' },
        { t: 'cmp', title: 'Goal orientation & goal proximity', ref: '§5.4', head: ['Concept', 'Meaning', 'Research link'],
          rows: [['<b>Learning</b> goal orientation', 'Focus on acquiring skill and mastery', '<b>Positive</b> for learning and performance'],
                 ['<b>Performance-prove</b>', 'Focus on demonstrating competence and earning favourable judgments', '<b>Not reliably</b> linked (the "null" one)'],
                 ['<b>Performance-avoid</b>', 'Focus on avoiding negative judgments', '<b>Negative</b>'],
                 ['<b>Distal</b> vs <b>proximal</b> goals', 'Long-term end goals vs short-term sub-goals', 'Proximal goals matter most for <b>novel or complex</b> tasks (more frequent feedback). Pair them when learning something new']],
          after: 'Specific, difficult <b>performance</b> goals work best on tasks people already know. On novel or complex tasks, a specific <b>learning</b> goal beats a performance goal.' }
      ]
    },
    {
      id: 'culture', title: 'Culture & the integrative model', ref: '§5.5–5.6',
      items: [
        { t: 'cmp', title: 'Do the theories travel across cultures?', ref: '§5.5', head: ['Theory', 'Cross-cultural verdict'],
          rows: [['Maslow / Alderfer', 'Assume individualist self-actualization is the "top," which doesn’t hold in collectivist cultures'],
                 ['SDT', '<b>Cross-culturally valid</b> (the three needs matter everywhere; their relative weight varies)'],
                 ['Equity', 'The fairness norm is cultural: collectivist cultures often prefer <b>equality</b> over equity'],
                 ['Expectancy', 'Inherently flexible, because it’s about individual perceptions'],
                 ['Goal setting', 'Generalizes, but use <b>group goals</b> in collectivist cultures and watch face-saving around difficult public goals']] },
        { t: 'flow', title: 'Integrating the theories (Exhibit 5.7)', ref: '§5.6',
          steps: [{ h: 'Expectancy + goal-setting', d: 'perceptions (Boxes 1–2)' }, { h: 'Motivation', d: 'amount, persistence, direction; autonomous or controlled (Box 3)' }, { h: '+ GCA, EI, personality, task understanding, chance', d: '(Box 4)' }, { h: 'Performance', d: '(Box 5)' }, { h: 'Rewards', d: 'intrinsic ones more reliably tied to performance (Box 6)' }, { h: 'Equity → satisfaction', d: 'feeds back into motivation (Boxes 7–8)' }],
          loop: true },
        { t: 'note', tone: 'tip', title: 'Answer-writing shortcut', body: 'Exhibit 5.7 is a checklist for diagnosis. Walk the chain. Is the person unsure they can perform (expectancy)? Are goals vague (goal setting)? Is ability missing (Box 4, which motivation can’t fix)? Are rewards not tied to performance (instrumentality)? Do they feel under-rewarded (equity)?' }
      ]
    },
    {
      id: 'pay', title: 'Pay as a motivator', ref: '§6.1–6.4',
      items: [
        { t: 'def', term: 'Money as a motivator & variable pay', ref: '§6.1', def: 'Pay is a genuinely strong motivator, and people underestimate it. It can satisfy needs at every level (need theories), and it motivates most when <b>clearly tied to performance</b> (expectancy theory). <b>Variable pay</b> (pay for performance) is any portion of pay tied to a performance measure.' },
        { t: 'def', term: 'Piece-rate & wage incentive plans', ref: '§6.2', def: '<b>Piece-rate</b>: a set sum per unit produced (pure, or a base wage plus a differential). Broader schemes are <b>wage incentive plans</b>, with group versions where individual output can’t be isolated. They reliably raise productivity (a median of about 30% is cited).' },
        { t: 'list', title: 'Five problems with wage incentives', ref: '§6.2',
          items: ['<b>Lowered quality</b>: especially in "people-processing" work.', '<b>Differential opportunity</b>: unequal materials or equipment make the incentive unfair (an expectancy problem).', '<b>Reduced cooperation</b>: hoarding tools and tricks, neglecting shared tasks.', '<b>Incompatible job design</b>: output can’t be attributed to individuals, and large teams dilute the effort–pay link.', '<b>Restriction of productivity</b>: workers informally cap output for fear management will "cut the rate." Less likely when trust is high.'],
          mnem: '<b>"Lousy Deals Ruin Incentive Rates."</b> Restriction of productivity is a <b>social</b> problem (a group norm), not a design problem.' },
        { t: 'list', title: 'Three reasons merit pay fails (white-collar jobs)', ref: '§6.3',
          items: ['<b>Low discrimination</b>: managers rate almost everyone as equal to avoid conflict.', '<b>Small increases</b>: raises too small to matter. A <b>lump-sum bonus</b> (one-time, not built into base pay) is more visible.', '<b>Pay secrecy</b>: employees can’t verify the pay–performance link, and they invent estimates (overestimating peers’ and subordinates’ pay, underestimating the boss’s).'],
          mnem: '<b>Merit pay fails when it’s "Low, Small, and Secret."</b> Low and small damage <b>instrumentality and valence</b>. Secrecy damages <b>equity perceptions</b>.' },
        { t: 'cmp', title: 'Four pay plans for teamwork', ref: '§6.4 · Exhibit 6.3', head: ['Plan', 'How it works', '+ Advantage', '– Disadvantage'],
          rows: [['<b>P</b>rofit sharing', 'A share of <b>company profits</b> (cash or deferred)', 'Ownership; aligns goals', 'Profits are driven by things employees can’t control (the economy); impact is hard to see in big firms'],
                 ['<b>E</b>SOPs', 'Employees buy company <b>shares</b>, sometimes matched', 'Legal and psychological ownership', 'Share price depends on much more than effort; weak in downturns'],
                 ['<b>G</b>ainsharing', 'Bonus for measurable, <b>controllable unit-level gains</b> (e.g., less scrap). Classic form: the <b>Scanlon Plan</b>', 'Rewards genuine cooperation; built with worker participation', 'Can pay out without overall profit; goals outside the formula get neglected'],
                 ['<b>S</b>kill-based pay', 'Pay rises as employees <b>learn more skills</b>', 'Flexibility; a broader view of the work', 'Higher training and labour costs']],
          mnem: '<b>PEGS</b>: in this order, line of sight runs from weakest (company-wide profit) to most individual (your own skills). Gainsharing rewards <b>unit</b> gains, not company profit.' },
        { t: 'note', tone: 'trap', title: 'Merit pay vs lump-sum · profit sharing vs gainsharing', body: 'Merit pay is a <b>permanent</b> raise folded into base salary, while a lump-sum bonus is <b>one-time</b>. Profit sharing = <b>firm profits</b>; gainsharing = <b>unit productivity or cost gains</b>. And restriction of productivity (wage incentives) ≠ pay secrecy (merit pay): they belong to different lists.' }
      ]
    },
    {
      id: 'jobdesign', title: 'Job design & the Job Characteristics Model', ref: '§6.5',
      items: [
        { t: 'def', term: 'Job design & job scope', ref: '§6.5', def: '<b>Job design</b> is the structure, content and configuration of a person’s tasks and roles. The traditional view (Taylor) pursued simplification and specialization. <b>Job scope = breadth</b> (number of different activities) <b>× depth</b> (discretion over how the work is done). High on both = <b>high-scope</b> (manager, professor). Low on both = low-scope (assembly line).',
          more: 'Ways to raise scope: <b>stretch assignments</b> (bigger, more challenging projects) and <b>job rotation</b> (moving through different tasks or departments).' },
        { t: 'flow', title: 'The Job Characteristics Model (Hackman & Oldham)', ref: '§6.5',
          steps: [{ h: 'Skill variety + Task identity + Task significance', d: '→' }, { h: 'Experienced meaningfulness', d: '' }, { h: 'Autonomy → Experienced responsibility', d: '' }, { h: 'Feedback → Knowledge of results', d: '' }, { h: 'Outcomes', d: 'High internal work motivation · high growth satisfaction · high general job satisfaction · high work effectiveness' }],
          after: '<b>Moderators:</b> knowledge &amp; skill · <b>growth need strength</b> (how much the person wants higher-order satisfaction <i>from the job</i>) · context satisfactions (pay, supervision, policy). The strongest research support is for <b>experienced meaningfulness</b> as the pivotal state.' },
        { t: 'list', title: 'JCM: five core job characteristics', ref: '§6.5',
          items: ['<b>Skill variety</b>: range of skills and activities used (≈ breadth).', '<b>Task identity</b>: doing a <b>whole, identifiable</b> piece of work from start to finish.', '<b>Task significance</b>: the job’s <b>impact on other people</b>.', '<b>Autonomy</b>: freedom to schedule work and choose methods (≈ depth).', '<b>Feedback</b>: information about performance that comes from the job itself.'],
          mnem: '<b>"a VISA Fee"</b>: Variety · Identity · Significance · Autonomy · Feedback. The <b>3-1-1</b> mapping: V + I + S → meaningfulness; A → responsibility; F → knowledge of results.' },
        { t: 'formula', title: 'Motivating Potential Score (MPS)', ref: '§6.5', f: 'MPS = [(SV + TI + TS) ÷ 3] × A × F',
          body: 'Each item is rated 1–7, so MPS ranges from <b>1 to 343</b> (the text’s sample average is <b>128</b> across 6,930 employees in 876 jobs). Variety, identity and significance are <b>averaged</b>, so they compensate for each other. Autonomy and feedback are <b>multiplied</b>, so a zero on either collapses the whole score. That’s the same logic as the expectancy formula.' },
        { t: 'note', tone: 'trap', title: 'Task identity vs task significance', body: '<b>Identity</b> = a whole, identifiable piece of work ("I build the whole chair"). <b>Significance</b> = impact on others ("my chairs go to a children’s hospital").' },
        { t: 'list', title: 'Job enrichment: 6 principles', ref: '§6.5', intro: '<b>Job enrichment</b> redesigns jobs to raise their core characteristics, and with them intrinsic motivation and <b>job involvement</b>.',
          items: ['<b>Combine tasks</b> → variety, identity (e.g., four specialists become "chair makers").', '<b>Establish external client relationships</b> → significance, feedback.', '<b>Establish internal client relationships</b> → significance, feedback.', '<b>Reduce supervision / reliance on others</b> → autonomy.', '<b>Form work teams</b> → variety, autonomy.', '<b>Make feedback more direct</b> → feedback (e.g., the assembler’s contact info travels with the product).'],
          mnem: '<b>The five C’s</b>: Combine · Connect to clients (external <i>and</i> internal = two principles) · Cut supervision · Create teams · Close the feedback loop.' },
        { t: 'note', tone: 'trap', title: 'Job enrichment ≠ job enlargement', body: '<b>Enlargement</b> just adds more tasks at the <b>same level</b> (breadth only), with no real motivational gain. It’s a common enrichment failure. <b>Enrichment</b> raises the core characteristics, especially depth: autonomy, identity, significance.' },
        { t: 'list', title: 'Problems with job enrichment', ref: '§6.5', bullets: true,
          items: ['<b>Poor diagnosis</b>: half-hearted changes, or "over-enriching" already-rich jobs (job engorgement → role overload).', '<b>Lack of desire or skill</b> among some workers.', '<b>Demand for rewards</b>: more responsibility means people want more pay.', '<b>Union resistance</b>: unions have historically favoured narrow job classifications.', '<b>Supervisory resistance</b>: enrichment can "dis-enrich" the supervisor’s own job.'] },
        { t: 'groups', title: 'Beyond the JCM', ref: '§6.5',
          groups: [
            { name: 'Work design (Morgeson & Humphrey)', items: ['<b>Motivational</b>: task + knowledge characteristics', '<b>Social</b>: support, interdependence, feedback from others (even more strongly tied to turnover intentions and commitment)', '<b>Work context</b>: ergonomics, physical demands, conditions'] },
            { name: 'Relational job design (Adam Grant)', items: ['The <b>relational architecture</b> of jobs builds <b>prosocial motivation</b>', 'Call-centre fundraisers who met a scholarship recipient sharply raised their persistence and performance'] },
            { name: 'Job crafting (employee-initiated)', items: ['↑ Social job resources', '↑ Structural job resources (most important)', '↑ Challenging job demands', '↓ Hindering job demands'] }
          ] }
      ]
    },
    {
      id: 'mbo', title: 'MBO, flexible work & perspective', ref: '§6.6–6.8',
      items: [
        { t: 'flow', title: 'Management by Objectives (Drucker)', ref: '§6.6', intro: 'An elaborate application of <b>goal-setting theory</b>: organization-wide objectives cascade down to individuals.', loop: true,
          steps: [{ h: '1 · Set objectives jointly', d: 'Specific, quantified where possible, time-framed, prioritized, written' }, { h: '2 · Periodic progress meetings', d: 'Revise objectives as needed' }, { h: '3 · Appraisal meeting', d: 'Diagnose success or failure as learning' }, { h: '4 · Repeat the cycle', d: '' }],
          after: 'It works <b>only with top-management commitment</b>: a <b>56%</b> average productivity gain with high commitment vs <b>6%</b> with low. Otherwise it becomes "a bunch of paperwork." Other failure modes: overemphasis on easily quantified goals, short-termism, and punitive appraisals.' },
        { t: 'cmp', title: 'Flexible work arrangements', ref: '§6.7', intro: 'The main purpose is <b>not</b> boosting effort. It’s meeting diverse workforce needs and supporting retention, satisfaction and lower absenteeism.',
          head: ['Arrangement', 'What it flexes', 'Evidence'],
          rows: [['<b>Flex-time</b>', '<b>When</b>: flexible start and end around core hours', '↑ productivity and satisfaction; ↓ absenteeism and turnover. Best in offices, not tightly interdependent work'],
                 ['<b>Compressed workweek</b>', '<b>How many days</b> (e.g., 4 × 10 hours = "4–40")', '↑ job and schedule satisfaction; fatigue on long days; no reliable effect on absenteeism or performance'],
                 ['<b>Job sharing</b>', '<b>By whom</b>: two part-timers split one full-time job', 'Retains people who want reduced hours; needs strong coordination'],
                 ['<b>Work sharing</b>', '<b>How much</b>: everyone’s hours cut to <b>avoid layoffs</b>', 'In Canada, often topped up by EI through a federal program'],
                 ['<b>Telecommuting</b>', '<b>Where</b>', '↑ autonomy, satisfaction, performance; ↓ work–family conflict. Heavy telecommuting can hurt visibility and promotion, cause isolation and burnout, and push workload onto others']],
          after: 'Exhibit 6.9 flex-time example: start any time after 7 a.m., leave by 6 p.m., work 8 hours, and be present for core time <b>9:15–noon and 2:00–4:15</b>.',
          mnem: '<b>Sort them by what they flex</b>: When (flex-time) · How many days (compressed) · How much / by whom (job and work sharing) · Where (telecommuting).' },
        { t: 'note', tone: 'trap', title: 'Job sharing vs work sharing', body: '<b>Job sharing</b>: two people voluntarily split <b>one</b> ongoing role. <b>Work sharing</b>: <b>everyone’s</b> hours are temporarily reduced to <b>avoid layoffs</b>.' },
        { t: 'list', title: 'Choosing a motivational practice: contingency factors', ref: '§6.8 · Exhibit 6.10', intro: 'There’s no single correct practice. Effective firms combine several (e.g., performance pay <i>and</i> enrichment), chosen by:',
          items: ['<b>Employee needs</b>', '<b>Nature of the job</b> (individual vs group work)', '<b>Organization characteristics</b> (strategy, culture)', '<b>Desired outcome</b> (performance vs retention vs satisfaction)'] }
      ]
    },
    {
      id: 'learning', title: 'Learning: reinforcement & social cognitive theory', ref: 'Ch 2 §2.4–2.8',
      lede: 'Taught this week under "Motivation cont." A Motivation question can just as easily ask how to <i>reinforce</i> the right behaviour.',
      items: [
        { t: 'def', term: 'Learning', ref: '§2.4', def: 'Occurs when <b>practice or experience</b> leads to a <b>relatively permanent change in behaviour potential</b>. Changes from drugs or biological maturation don’t count.', after: 'What employees learn: <b>practical skills</b> · <b>intrapersonal skills</b> (problem solving, critical thinking) · <b>interpersonal skills</b> · <b>cultural awareness</b>.' },
        { t: 'def', term: 'Operant learning theory (Skinner)', ref: '§2.5', def: 'The learner "operates" on the environment to get consequences. <b>Behaviour is controlled by the consequences that follow it.</b> A <b>reinforcer</b> is a stimulus that follows a behaviour and increases or maintains its probability.' },
        { t: 'cmp', title: 'Reinforcement, punishment, extinction', ref: '§2.5–2.6', head: ['', 'Stimulus is ADDED', 'Stimulus is REMOVED'],
          rows: [['Behaviour <b>INCREASES</b>', '<b>Positive reinforcement</b>: add something pleasant (praise after good work)', '<b>Negative reinforcement</b>: remove something unpleasant (nagging stops once you comply)'],
                 ['Behaviour <b>DECREASES</b>', '<b>Punishment</b>: add something aversive (the worst task after lateness)', '<b>Extinction</b>: remove the reinforcer that was maintaining it (stop laughing at the class clown)']],
          mnem: '<b>Reinforcement always INCREASES behaviour.</b> "Positive/negative" means <b>add/remove</b>, not good/bad. Negative reinforcement ≠ punishment.' },
        { t: 'note', tone: 'trap', title: 'Negative reinforcement is the most-missed concept', body: 'Expect "which is TRUE" questions built on the fact that <b>negative reinforcement increases behaviour</b>. If something unpleasant is <i>added</i> to stop a behaviour, that’s <b>punishment</b>.' },
        { t: 'cmp', title: 'Reinforcement schedules', ref: 'Exhibit 2.3', head: ['Strategy', 'Learning speed', 'Persistence once reinforcement stops'],
          rows: [['<b>Continuous, immediate</b>', '<b>Fast</b> acquisition', '<b>Low</b>: extinguishes quickly'], ['<b>Partial, delayed</b>', 'Slower', '<b>High</b>: harder to extinguish']],
          mnem: '<b>"Fast in, fast out."</b> Train with continuous reinforcement, then maintain with partial.' },
        { t: 'list', title: 'Three reinforcement errors organizations make', ref: '§2.5',
          items: ['<b>Confusing rewards with reinforcers</b>: rewards not contingent on the desired behaviour (e.g., seniority-based overtime) reinforce nothing.', '<b>Neglecting diversity in preferences</b>: people and generations value different reinforcers.', '<b>Neglecting important sources of reinforcement</b>: especially <b>performance feedback</b> and <b>social recognition</b>.'] },
        { t: 'list', title: 'Using punishment effectively', ref: '§2.6', bullets: true,
          items: ['Provide an <b>acceptable alternative</b> behaviour.', 'Control your emotions and <b>avoid punishing in front of others</b>.', 'Make sure it’s genuinely <b>aversive to that person</b>.', 'Punish <b>immediately</b>.', 'Don’t <b>reward</b> the unwanted behaviour before or after.', 'Don’t inadvertently <b>punish desirable behaviour</b> (e.g., cutting the budget of a department that didn’t overspend).'] },
        { t: 'groups', title: 'Social cognitive theory (Bandura)', ref: '§2.7', intro: 'Cognitive processes in learning and self-regulation. Behaviour follows <b>triadic reciprocal causation</b>: person, environment and behaviour all influence one another. It complements operant theory.',
          groups: [
            { name: 'Observational learning', items: ['Imitating <b>models</b> instead of learning only by direct experience', 'Involves <b>self</b>-reinforcement', 'Effective models: attractive, credible, competent, high-status, memorable'] },
            { name: 'Self-efficacy beliefs', items: ['<b>Task-specific</b> beliefs about your ability to do a particular task', 'Four sources: performance mastery · observation of others · verbal persuasion &amp; social influence · physiological / emotional state'] },
            { name: 'Self-regulation', items: ['Self-observation → self-evaluation → self-reinforcement', '<b>Discrepancy reduction</b> (close the goal gap) and <b>discrepancy production</b> (set a higher goal once one is reached)'] }
          ],
          mnem: 'Four sources of self-efficacy: <b>"My Old Very Positive"</b> (Mastery · Observation · Verbal persuasion · Physiological state).' },
        { t: 'note', tone: 'trap', title: 'General self-efficacy (Week 2) vs self-efficacy beliefs (Week 4)', body: 'GSE is a stable personality <b>trait</b> across situations. SCT self-efficacy is <b>task-specific</b>. You can have high GSE and still low self-efficacy for one particular task.' },
        { t: 'list', title: 'Organizational learning practices', ref: '§2.8', bullets: true,
          items: ['<b>O.B. Mod</b>: systematic use of learning principles (e.g., feedback charts plus praise raised safe work practices from 74% to about 97%). Money, feedback and social recognition <b>together</b> work best.', '<b>Employee recognition programs</b>: formal, public recognition of specific behaviours. <b>Peer recognition</b> lets employees recognize each other.', '<b>Training</b> (current job) vs <b>development</b> (future responsibilities).', '<b>Behaviour modelling training (BMT)</b>: describe the behaviours → model them → practise → feedback and reinforcement → transfer to the job.'] }
      ]
    }
  ],

  quiz: [
    { q: 'A sales manager says: "I don’t care how many calls you make. I care whether you close deals." Which property of motivation is she emphasizing?', o: ['Direction', 'Effort', 'Persistence', 'Goals'], a: 0, why: 'Channelling effort toward the outcomes that matter is <b>direction</b> ("working smart as well as hard").' },
    { q: 'Denied a promotion she wanted for growth, Ana suddenly starts pushing hard for a bigger salary. Which theory best explains this?', o: ['Alderfer’s ERG (frustration-regression)', 'Maslow’s hierarchy', 'McClelland’s need theory', 'Goal-setting theory'], a: 0, why: 'A frustrated higher need (growth) makes a lower need (existence) stronger. That’s <b>frustration-regression</b>, which is unique to ERG.' },
    { q: 'According to McClelland, the most effective managers typically have:', o: ['High need for power and low need for affiliation', 'High need for affiliation and low need for power', 'High need for achievement only', 'Equal levels of all three needs'], a: 0, why: '<b>High n Pow, low n Aff</b>, with power directed at organizational goals. High affiliation is the intuitive trap.' },
    { q: 'An employee believes that no matter how hard she works, she can’t hit the new quota. In expectancy terms, the problem is low:', o: ['Expectancy', 'Instrumentality', 'Valence', 'Equity'], a: 0, why: 'The <b>effort → performance</b> link is <b>expectancy</b>. With E ≈ 0, force ≈ 0 no matter the valence.' },
    { q: 'Staff hit their targets, but past bonuses were often "forgotten" by management. Motivation is falling. Which component is damaged?', o: ['Instrumentality', 'Expectancy', 'Valence', 'Growth need strength'], a: 0, why: 'The <b>performance → outcome</b> link is <b>instrumentality</b>. The fix is to make reward contingencies explicit and honour them.' },
    { q: 'A worker learns a peer with the same job and effort earns more. Instead of complaining, she decides the peer "must have skills I don’t see." Which equity-restoring tactic is this?', o: ['Distorting the comparison other’s inputs', 'Altering her own outcomes', 'Leaving the relationship', 'Choosing a new comparison other'], a: 0, why: 'She perceptually inflates the other person’s <b>inputs</b>, which is distorting the comparison other.' },
    { q: 'Which is NOT one of goal-setting theory’s four mechanisms?', o: ['Guaranteeing extrinsic rewards', 'Directing attention', 'Increasing persistence', 'Prompting task strategies'], a: 0, why: 'The four are attention, effort, persistence and strategies. Goal commitment is largely <b>independent of money</b>.' },
    { q: 'Which goal orientation is NOT reliably related to learning or performance?', o: ['Performance-prove', 'Learning', 'Performance-avoid', 'None: all three are strongly positive'], a: 0, why: 'Learning orientation is positive, performance-avoid is negative, and <b>performance-prove</b> is the null result.' },
    { q: 'SDT’s three universal needs are:', o: ['Competence, autonomy, relatedness', 'Existence, relatedness, growth', 'Achievement, affiliation, power', 'Safety, esteem, self-actualization'], a: 0, why: 'SDT = <b>CAR</b>. ERG = existence/relatedness/growth. McClelland = achievement/affiliation/power.' },
    { q: 'In the MPS formula, which change would drop a job’s score to near zero?', o: ['Autonomy falls to 1 out of 7 (near zero)', 'Skill variety falls from 7 to 4', 'Task identity falls from 6 to 3', 'Task significance falls from 5 to 3'], a: 0, why: 'Autonomy and feedback are <b>multiplied</b>. Variety, identity and significance are <b>averaged</b>, so they partly compensate for each other.' },
    { q: 'A furniture plant turns four specialists (cutting, sanding, assembly, finishing) into "chair makers" who each build whole chairs. This mainly raises:', o: ['Task identity and skill variety', 'Task significance only', 'Autonomy only', 'Feedback only'], a: 0, why: '<b>Combining tasks</b> raises variety and identity (a whole, identifiable piece of work).' },
    { q: 'A cashier is given more register duties at the same skill level and calls it "enrichment." It is actually:', o: ['Job enlargement', 'Job enrichment', 'Job crafting', 'Relational job design'], a: 0, why: 'Adding more same-level tasks (breadth only) is <b>enlargement</b>, which doesn’t raise the core characteristics.' },
    { q: 'A plant pays a bonus when its own scrap and energy costs fall below a target formula, designed with heavy worker participation. This is:', o: ['Gainsharing', 'Profit sharing', 'An ESOP', 'Skill-based pay'], a: 0, why: 'Bonuses for <b>controllable unit-level gains</b> are <b>gainsharing</b> (e.g., the Scanlon Plan). Profit sharing uses company-wide profits.' },
    { q: 'Piece-rate workers informally agree never to produce more than 80 units a day, fearing management will "cut the rate." This problem is:', o: ['Restriction of productivity', 'Differential opportunity', 'Reduced cooperation', 'Pay secrecy'], a: 0, why: 'An informal group output ceiling is <b>restriction of productivity</b>, a social problem on the wage-incentive list.' },
    { q: 'A firm cuts everyone’s hours by 20% for six months instead of laying people off. This is:', o: ['Work sharing', 'Job sharing', 'A compressed workweek', 'Flex-time'], a: 0, why: 'Reducing hours to <b>avoid layoffs</b> is <b>work sharing</b>. Job sharing is two people splitting one role.' },
    { q: 'According to the research, MBO produces large productivity gains mainly when:', o: ['Top management is highly committed to it', 'Objectives are vague and flexible', 'Appraisals are punitive', 'Only quantitative goals are used'], a: 0, why: 'There was a 56% gain with high top-management commitment vs 6% with low.' },
    { q: 'A manager stops nagging an employee once the employee files reports on time, and on-time filing increases. This is:', o: ['Negative reinforcement', 'Punishment', 'Extinction', 'Positive reinforcement'], a: 0, why: '<b>Removing</b> something unpleasant (nagging) to <b>increase</b> a behaviour = negative reinforcement.' },
    { q: 'Every time an employee is late, the supervisor assigns the most unpleasant task, and lateness stops. This is:', o: ['Punishment', 'Negative reinforcement', 'Extinction', 'Positive reinforcement'], a: 0, why: '<b>Adding</b> an aversive stimulus to <b>decrease</b> behaviour = punishment.' },
    { q: 'A trainee praised after every correct task learns fast, but her performance drops quickly once praise stops. Why?', o: ['Continuous, immediate reinforcement produces fast learning but low persistence', 'Extinction is impossible under continuous reinforcement', 'She has low core self-evaluations', 'The trainer used negative reinforcement'], a: 0, why: 'Continuous reinforcement means <b>fast in, fast out</b>. Partial reinforcement produces more persistent behaviour.' },
    { q: 'Which is NOT a source of self-efficacy beliefs in social cognitive theory?', o: ['Job enlargement', 'Performance mastery', 'Observation of others', 'Verbal persuasion'], a: 0, why: 'The four sources are mastery, observation, verbal persuasion and physiological state.' },
    { q: 'Flexible work arrangements are framed in the text as primarily intended to:', o: ['Meet diverse workforce needs and aid retention and satisfaction', 'Maximize individual output', 'Replace pay-for-performance', 'Reduce job scope'], a: 0, why: 'Unlike pay and job design, flex arrangements aren’t mainly about effort. They serve <b>diverse needs, work–life balance and retention</b>.' },
    { q: 'Which merit-pay problem mainly damages employees’ equity perceptions?', o: ['Pay secrecy', 'Low discrimination', 'Small increases', 'Lowered quality'], a: 0, why: 'Without real information, employees <b>invent</b> salary estimates (overestimating peers’ pay), which damages <b>equity</b>. Low discrimination and small increases mainly hit instrumentality and valence.' }
  ],

  prompts: [
    { q: 'A call-centre team’s sales have dropped. Interviews show agents think the new targets are "impossible," bonuses were paid late or not at all last quarter, and several say the bonus "isn’t worth the stress anyway." <b>Diagnose using a motivation theory and recommend fixes.</b>',
      name: '<b>Expectancy theory</b> (Vroom): low expectancy, low instrumentality, low valence.',
      define: 'Expectancy theory says motivation (force) = Σ(valence × instrumentality) × expectancy. Expectancy is the perceived effort → performance link, instrumentality the performance → outcome link, and valence the attractiveness of the outcome.',
      apply: '"Impossible targets" = low <b>expectancy</b>. Late or missing bonuses = low <b>instrumentality</b>. "Not worth the stress" = low <b>valence</b>. Because the terms multiply, weakness in all three pushes force toward zero.',
      recommend: 'Raise expectancy (training, better scripts and tools, <b>realistic</b> targets that are specific and challenging but achievable, per goal-setting). Restore instrumentality (pay bonuses on time, with transparent rules). Raise valence (individualized rewards: time off, recognition, development).',
      also: 'Goal-setting theory (goal commitment is destroyed by coercion); SDT (controlled vs autonomous motivation); equity.' },
    { q: 'Data-entry clerks at an insurer each key in one section of claim forms all day. Absenteeism is high and errors are rising. <b>Use the Job Characteristics Model to diagnose the job and propose a redesign.</b>',
      name: '<b>Job Characteristics Model</b> (Hackman &amp; Oldham), <b>MPS</b>, and <b>job enrichment</b> (vs enlargement).',
      define: 'The JCM says five core characteristics (skill variety, task identity, task significance, autonomy, feedback) create three psychological states (meaningfulness, responsibility, knowledge of results), which produce motivation, satisfaction and effectiveness. MPS = [(SV + TI + TS) / 3] × A × F.',
      apply: 'One form section all day: low variety, low <b>identity</b> (never a whole claim), low significance (no link to the policyholder), little <b>autonomy</b>, and no <b>feedback</b> on errors. Because A and F multiply, the MPS is very low, and low meaningfulness and knowledge of results explain the absenteeism and errors.',
      recommend: 'Enrich, don’t enlarge. <b>Combine tasks</b> (each clerk processes whole claims), <b>connect to clients</b> (assign clerks to specific agents or policyholders), <b>cut supervision</b> (clerks check their own work), and <b>close the feedback loop</b> (daily error reports). Check the moderators: train skills and watch growth need strength.',
      also: 'Work design (social characteristics); job crafting; Maslow/ERG (growth needs).' },
    { q: 'A consulting firm gives everyone an annual merit raise of about 2%. Ratings cluster at "meets expectations," and salaries are confidential. Top performers are leaving. <b>Explain why the merit system fails and recommend a better pay approach.</b>',
      name: '<b>Merit pay problems</b> (low discrimination, small increases, pay secrecy), <b>equity theory</b>, <b>expectancy theory</b>, and alternatives: <b>lump-sum bonus</b> or team plans.',
      define: 'Merit pay links periodic performance ratings to raises folded into base pay. It fails when ratings don’t discriminate, increases are small, and pay is secret.',
      apply: 'Clustered ratings = <b>low discrimination</b> (and central tendency, a Week 3 rater error). 2% = <b>small increases</b> (low valence). Secrecy = employees can’t see the pay–performance link (low <b>instrumentality</b>) and overestimate peers’ pay (<b>inequity</b>). Top performers’ outcome/input ratio looks worst of all, so they leave.',
      recommend: 'Train raters (BARS, FOR training) so ratings discriminate. Use a visible <b>lump-sum bonus</b> for top performers. Make the pay structure more transparent (open-book pay, as at Whole Foods). For collaborative project work, consider <b>gainsharing</b> or profit sharing alongside individual rewards.',
      also: 'Turnover model (Week 2); rater errors (Week 3).' },
    { q: 'Warehouse workers keep skipping a safety-check step. The manager ignores it day-to-day but publicly yells at workers when a spot audit finds a problem. <b>Using learning theory, explain why this isn’t working and design a better approach.</b>',
      name: '<b>Operant learning theory</b>: positive reinforcement, punishment (and how to use it), <b>reinforcement schedules</b>, <b>O.B. Mod</b>.',
      define: 'Operant learning says behaviour is controlled by its consequences. Reinforcement (positive: add a pleasant stimulus; negative: remove an unpleasant one) increases behaviour. Punishment (add an aversive stimulus) decreases it.',
      apply: 'Skipping the check is never followed by an immediate consequence, and it saves time, so skipping is effectively reinforced. The desired behaviour is never reinforced. The punishment breaks every rule: delayed, inconsistent, public, emotional, and it offers no alternative.',
      recommend: 'Use <b>positive reinforcement</b> for the desired behaviour: immediate feedback and praise, a visible feedback chart (O.B. Mod raised safe practices from 74% to about 97%). Reinforce continuously at first (fast learning), then switch to partial (persistence). If punishment is ever used: immediate, private, calm, with a clear alternative.',
      also: 'Social recognition and feedback as neglected reinforcers; BMT; goal setting.' },
    { q: 'A software startup lets developers work fully remotely, but several now feel isolated and are missing promotion opportunities, while in-office staff complain about picking up extra work. <b>Evaluate the arrangement and recommend changes.</b>',
      name: '<b>Flexible work arrangements</b> (telecommuting vs flex-time, compressed workweek), the <b>contingency approach</b> to motivational practices (Exhibit 6.10), and <b>SDT</b> relatedness.',
      define: 'Telecommuting is working remotely while connected by technology. Its main purpose is meeting diverse needs and improving retention and satisfaction, not raising effort.',
      apply: 'The research fits: telework raises autonomy and satisfaction, but <b>heavy</b> telecommuting cuts informal visibility (hurting promotion), causes isolation, loneliness and burnout, and pushes workload onto non-telecommuters. Isolation also frustrates SDT’s <b>relatedness</b> need.',
      recommend: 'Move to a hybrid model (career outcomes are best with occasional rather than extensive telework), combined with flex-time core hours for collaboration. Make promotion criteria visible and output-based. Rebalance workloads. Choose the mix using Exhibit 6.10: employee needs, the nature of the job, the organization’s culture, and the desired outcome.',
      also: 'Job sharing / work sharing distinctions; POS (Week 3).' }
  ]
});
