/* Last year's Assignment #2 (Nov 2025, Dr. McAteer's section): the question sheet + model answers.
   Answers are written from the 13th-ed textbook (the required text) and Dr. Kassaye's slides.
   Each part: l (label), q (question), marks, full (complete answer), short (mark-hitting summary), ed13 (optional). */
SME.addPaper({
  id: 'a2',
  title: 'Last year’s Assignment #2',
  source: 'November 2025 question sheet (Dr. McAteer’s section). The answers follow the 13th-ed textbook and Dr. Kassaye’s slides.',
  questions: [

    /* ───────────────────────── Q1 · DECISION MAKING ───────────────────────── */
    { n: 1, week: 'w5', topic: 'Decision Making',
      setup: 'You are a consultant hired by an executive who has recently transitioned into a new role that requires a lot of high-impact decision-making. Interested in learning about how individuals go through the decision-making process and what can impact or hinder this process, they seek out guidance from you.',
      parts: [
        { l: 'a', marks: 2,
          q: 'Describe, in the correct order, the different steps in the rational decision-making process.',
          full: `<p>The rational model (Exhibit 11.1, slide 6) has <b>seven steps</b>, in this order:</p>
<ol>
<li><b>Identify the problem:</b> recognize a <i>perceived gap</i> between the existing state and the desired state (e.g., customers now wait 20 minutes, and the goal is 5).</li>
<li><b>Search for relevant information:</b> gather information about the causes of the gap and possible responses.</li>
<li><b>Develop alternative solutions</b> to the problem.</li>
<li><b>Evaluate the alternative solutions:</b> judge each one’s value and its likelihood of working.</li>
<li><b>Choose the best solution.</b></li>
<li><b>Implement the chosen solution.</b></li>
<li><b>Monitor and evaluate</b> the chosen solution: check whether the gap actually closed.</li>
</ol>
<p>If problems turn up at any stage, the process <b>recycles</b> to earlier steps. Memory aid: “I See Dave Eat Cake In Montreal.”</p>`,
          short: `<ul>
<li>Identify problem → search for information → develop alternatives → evaluate alternatives (1)</li>
<li>→ choose best → implement → monitor &amp; evaluate; the process recycles if something goes wrong (1)</li>
</ul>` },

        { l: 'b', marks: 1.5,
          q: 'Compare the three descriptors of perfect rationality versus the three descriptors of bounded rationality.',
          full: `<p><b>Perfect rationality</b> describes the “Economic Person,” an ideal decision maker who is:</p>
<ul>
<li><b>Completely informed:</b> gathers all the information needed, at no cost.</li>
<li><b>Perfectly logical:</b> preferences are consistent (if A is preferred to B and B to C, then A is preferred to C).</li>
<li><b>Oriented to economic gain:</b> one criterion, maximizing return.</li>
</ul>
<p><b>Bounded rationality</b> (Herbert Simon) describes how real managers decide. Their decisions:</p>
<ul>
<li>rely on <b>limited information</b>;</li>
<li>reflect <b>time constraints</b>;</li>
<li>reflect <b>political considerations</b>, such as the need to please others in the organization.</li>
</ul>
<p>Paired up: complete information vs limited information; unlimited, costless processing vs time pressure; a single economic criterion vs political and social considerations. As a result, bounded decision makers <b>satisfice</b> (accept the first solution that clears an acceptable threshold) rather than maximize.</p>`,
          short: `<ul>
<li>Perfect: completely informed · perfectly logical · economic-gain oriented (0.75)</li>
<li>Bounded (Simon): limited information · time constraints · political considerations, so people <b>satisfice</b> (0.75)</li>
</ul>` },

        { l: 'b', sub: 'ii', marks: 0.5,
          q: 'Explain why perfect rationality is considered problematic.',
          full: `<p>The three descriptors don’t match real decision makers. Information costs time and money, cognitive capacity is limited, decisions face deadlines, and organizations are political. So the rational model shows how decisions <i>should</i> be made, but it is only a <b>partial description of how they are made</b>. Real decisions run into framing, cognitive biases, escalation and mood, and many fail; one study found that about half of 356 organizational decisions failed. Insisting on maximizing would also be impractical: you would never finish the search.</p>`,
          short: `<ul><li>No one has complete information, unlimited time or a purely economic, apolitical goal; the model is prescriptive, not descriptive, so real people satisfice (0.5)</li></ul>` },

        { l: 'c', marks: 5,
          q: 'Describe, with examples, your choice of any five reasons for why bounded rationality occurs.',
          full: `<p>The “reasons why bounded rationality occurs” come from Dr. Kassaye’s Week 5A list of <b>nine</b>. They follow the stages of the rational model: framing, cognitive biases, problem identification, information search, alternative development/evaluation/choice, risk, implementation, solution evaluation, and emotion and mood. Five of them, with examples:</p>
<ol>
<li><b>Framing:</b> the aspects of a problem a decision maker focuses on shape the decision. Example: the same $10,000 outlay framed as a <i>cost</i> gets cut, while framed as an <i>investment</i> it gets approved.</li>
<li><b>Cognitive biases</b> (tendencies to process information in ways that cause errors). Example: one vivid customer complaint about price (<i>availability bias</i>) convinces a manager that price is why customers leave.</li>
<li><b>Problem identification:</b> perceptual defence, defining the problem as a solution (“we need more advertising”), or treating a symptom (“sales are down”) as the problem. Memory aid: the four S’s (shield, silo, solution, symptom).</li>
<li><b>Information search:</b> <i>confirmation bias</i> (reading only the reviews that support your view), <i>information overload</i>, or acquiring too much or too little information. Example: a hiring manager stops checking references once a candidate “feels right.”</li>
<li><b>Alternative development, evaluation and choice:</b> not all alternatives are known, and people <i>satisfice</i> or <i>anchor</i>. Example: a buyer anchors on a seller’s opening price of $10,000 for an oven, happily pays $8,000, and never learns it is worth $6,000.</li>
</ol>
<p>Other valid choices:</p>
<ul>
<li><b>Solution evaluation:</b> <i>escalation of commitment</i> and sunk costs, e.g., continuing a failing IT project because $8M is already spent.</li>
<li><b>Emotion and mood:</b> a good mood leads people to overestimate good outcomes.</li>
<li><b>Implementation:</b> success depends on others carrying the decision out.</li>
<li><b>Risk</b> (see d).</li>
</ul>`,
          short: `<ul>
<li><b>Framing:</b> same spend seen as a “cost” vs an “investment” (1)</li>
<li><b>Cognitive biases:</b> availability, e.g., one vivid complaint drives the decision (1)</li>
<li><b>Problem identification:</b> defining the problem as a solution or a symptom (the four S’s) (1)</li>
<li><b>Information search:</b> confirmation bias or information overload (1)</li>
<li><b>Alternatives and choice:</b> anchoring on an opening price; satisficing (1)</li>
<li><i>Alternatives you could swap in:</i> escalation and sunk costs · emotion and mood · implementation · risk</li>
</ul>`,
          ed13: 'The 13th edition adds new illustrations you can use as examples: <b>Peloton</b> overestimating post-pandemic demand (overconfidence), <b>herding</b> when information volume passes a threshold, the <b>Site C dam</b> (escalation and sunk costs), and crypto/NFT “giddy” moods. It also adds how to reduce emotion’s negative impact: <b>delay the decision</b> (a cooldown) and <b>reframe rather than suppress</b> the emotion.' },

        { l: 'd', marks: 1,
          q: 'How do individuals behave when risk is involved? Explain.',
          full: `<p>Behaviour under risk depends on how the choice is <b>framed</b>. When a choice is framed as a choice between <b>losses</b>, people become <b>risk-seeking</b>: they gamble to avoid a sure loss (most people prefer a 50% chance of losing $50M to a certain loss of $25M). When it is framed as a choice between <b>gains</b>, they become <b>conservative</b> and take the sure thing. This is why escalation happens: a failing project is seen as a sure loss, so throwing good money after bad looks attractive. The lecture adds that people differ in their <b>attitude to risk</b>: <b>risk-averse</b> (prefer a certain outcome over a gamble with the same expected value), <b>risk-neutral</b> and <b>risk-taking</b>.</p>`,
          short: `<ul><li>Loss frame → risky (gamble to avoid a sure loss); gain frame → conservative; individuals also vary (risk-averse / neutral / taking) (1)</li></ul>`,
          ed13: 'New in the 13th edition: <b>risk cultures</b>. Organizations differ in how much risk they tolerate and how they frame gains vs losses. That culture is shaped by the <b>tone from the top</b> (CEO personality) and by <b>industry and regulation</b> (a crypto exchange vs a bank). Adding “individuals take more or less risk depending on their organization’s risk culture” strengthens the answer.' }
      ] },

    /* ───────────────────────── Q2 · COMMUNICATION ───────────────────────── */
    { n: 2, week: 'w5', topic: 'Communication',
      setup: 'You have been hired by a client to facilitate a workshop on Communication.',
      parts: [
        { l: 'a', marks: 1,
          q: 'In preparing for your workshop, define effective communication.',
          full: `<p><b>Communication</b> is the process by which information is exchanged between a sender and a receiver. It is <b>effective</b> when the <b>right people</b> receive the <b>right information</b> in a <b>timely</b> manner. Violate any of the three (the wrong people, distorted or incomplete information, or information that arrives too late) and communication is ineffective.</p>`,
          short: `<ul><li>Exchange of information between sender and receiver; effective = <b>right people, right information, on time</b> (1)</li></ul>` },

        { l: 'b', marks: 1.5,
          q: 'Describe the 6-Stage Communication Model and each of its components.',
          full: `<p>The model traces a message from sender to receiver:</p>
<ol>
<li><b>Encoding:</b> the sender turns thoughts into a transmittable form (words, tone, an email).</li>
<li><b>Transmitting:</b> the message is sent through a channel or medium.</li>
<li><b>Perceiving:</b> the receiver notices the message.</li>
<li><b>Decoding:</b> the receiver interprets it.</li>
<li><b>Understanding:</b> the receiver arrives at the intended meaning, if decoding was accurate.</li>
<li><b>Feedback:</b> the receiver signals that the message was received and understood, which starts the loop again.</li>
</ol>
<p>The model’s value is that it shows <b>every point where errors creep in</b>. For example, humour encoded in an email is easily decoded wrongly.</p>
<p><b>On the stage count:</b> the textbook describes the model in prose and never numbers it. Dr. Kassaye’s slide 4 uses <b>seven</b> steps, with <b>Thinking</b> before encoding. For a “6-stage” question, give these six; mention that thinking (forming the idea) comes first if you have room.</p>`,
          short: `<ul>
<li>Encode → transmit → perceive (0.5)</li>
<li>→ decode → understand → feedback (0.5)</li>
<li>Each stage is a place errors can happen, e.g., humour decoded wrongly by email (0.5)</li>
</ul>` },

        { l: 'c', marks: 1,
          q: 'Explain the meaning of both psychological safety and voice.',
          full: `<p><b>Psychological safety</b> is a <b>shared belief that it is safe to take social risks</b>: to question the status quo, suggest a new idea or disagree, without fear of embarrassment or punishment. <b>Voice</b> is the <b>constructive expression of disagreement or concern</b> about work-unit or organizational practices, i.e., speaking up. Safety is the climate; voice is the behaviour that climate makes possible.</p>`,
          short: `<ul>
<li><b>Psychological safety:</b> a shared belief it’s safe to take social risks (disagree, raise ideas) (0.5)</li>
<li><b>Voice:</b> constructively speaking up with disagreement or concern (0.5)</li>
</ul>` },

        { l: 'c', sub: 'ii', marks: 1,
          q: 'What happens when employees don’t feel each?',
          full: `<p>Without psychological safety, employees don’t exercise voice. They fall into <b>silence</b> (withholding relevant information) and the <b>mum effect</b> (avoiding passing on bad news). Problems stay hidden, upward communication is filtered, managers decide on incomplete information, mistakes repeat, and employees disengage. A single symbolic story of someone punished for speaking up is enough to silence a whole team.</p>`,
          short: `<ul><li><b>Silence</b> and the <b>mum effect</b>: bad news and ideas are withheld, so problems stay hidden and decisions worsen (1)</li></ul>`,
          ed13: 'The 13th edition adds that leaders are <b>10 times more likely to be criticized for undercommunicating</b> than overcommunicating. Ch 7’s new <b>Sandoz</b> case also shows psychological safety can be raised cheaply: manager one-on-ones about employees’ individual priorities. Either is a good example to cite.' },

        { l: 'd', marks: 2,
          q: 'Explain the pros and cons of the organization’s grapevine.',
          full: `<p>The <b>grapevine</b> is the organization’s <b>informal communication network</b>, which cuts across the formal chain of command.</p>
<p><b>Pros:</b></p>
<ul>
<li>It keeps employees informed about important matters such as job security.</li>
<li>It lets management test reactions to proposed changes without formal commitment.</li>
<li>It is fast, and mostly accurate for non-controversial organizational information (around 75% or more).</li>
<li>Dr. Kassaye’s slide adds a third pro: it can be an informal recruiting source.</li>
</ul>
<p><b>Cons:</b></p>
<ul>
<li>It becomes a pipeline for <b>rumours</b> (unverified beliefs in general circulation). Rumours spread fastest when information is <b>ambiguous</b>, <b>important</b> and <b>credible</b>, and the recipient is <b>anxious</b>.</li>
<li>Personal and emotional information is the most distorted.</li>
<li>It can undermine official messages.</li>
</ul>`,
          short: `<ul>
<li><b>Pros:</b> keeps people informed (e.g., job security) · lets management test reactions · fast and mostly accurate on non-controversial facts (1)</li>
<li><b>Cons:</b> spreads <b>rumours</b> (ambiguous, important, credible, anxious recipients) · distorts personal or emotional content (1)</li>
</ul>`,
          ed13: 'The 13th edition adds that sharing information on the grapevine builds <b>social solidarity</b> (a pro), while <b>negative gossip</b> is linked to bad outcomes for individuals, relationships and the organization (a con).' },

        { l: 'e', marks: 2.5,
          q: 'Define information richness and describe its two dimensions using examples.',
          full: `<p><b>Information richness</b> is the <b>potential information-carrying capacity</b> of a communication medium. Its two dimensions:</p>
<ol>
<li><b>Synchronicity:</b> whether the medium allows real-time, two-way exchange with immediate feedback. A face-to-face conversation or phone call is highly synchronous. A memo, report or email is essentially one-way, and replies come later.</li>
<li><b>Non-verbal and para-verbal cues:</b> how far the receiver can pick up body language and facial expression (non-verbal) and tone of voice (para-verbal). In person and on video you get both. On the phone you get tone only. In a text or email you get neither, which is why sarcasm and humour misfire.</li>
</ol>
<p>Media therefore range from rich (face-to-face, video) through the phone to lean (email, memos, bulletins).</p>`,
          short: `<ul>
<li>Definition: a medium’s potential <b>information-carrying capacity</b> (0.5)</li>
<li><b>Synchronicity:</b> two-way, real-time feedback, e.g., face-to-face or phone vs one-way email or memo (1)</li>
<li><b>Non-verbal and para-verbal cues:</b> body language and tone, e.g., all on video, tone only on the phone, none in a text (1)</li>
</ul>`,
          ed13: 'The 13th edition updates the examples to <b>Zoom</b> alongside face-to-face as rich media. It also adds a framework comparing face-to-face (physicality, accessibility, latency), digital media (interdependence, synchronicity) and social media (permanence, verifiability, anonymity).' },

        { l: 'f', marks: 1,
          q: 'What information medium should you leverage when you want to achieve high information richness? Explain why.',
          full: `<p>Use <b>face-to-face communication</b>, or live video (e.g., Zoom) if people are remote. It scores highest on <b>both</b> dimensions: it is fully synchronous, so questions and misunderstandings are resolved on the spot, and it carries the full range of non-verbal and para-verbal cues. Rich media suit messages that are <b>non-routine, ambiguous, controversial or emotional</b>, such as restructurings, bad news or conflict. Lean media (email) suit routine, impersonal information.</p>`,
          short: `<ul><li><b>Face-to-face</b> (or video): highest on both dimensions (instant feedback and full cues), so use it for non-routine, controversial or emotional messages (1)</li></ul>`,
          ed13: 'The 13th edition lists <b>important decisions, intended changes, controversial messages, emotional issues and consensus building</b> as calling for <b>face-to-face or Zoom</b>. It warns that text-based media can sap energy and damage future effectiveness.' }
      ] },

    /* ───────────────────────── Q3 · GROUPS ───────────────────────── */
    { n: 3, week: 'w7', topic: 'Groups, Teams & Groupthink',
      setup: 'As a new manager in a medium-sized corporation, you are particularly interested in knowing and practicing as much as you can about effectively managing groups.',
      parts: [
        { l: 'a', marks: 3,
          q: 'Explain the two models on group dynamics discussed in 1BA3, and be sure to identify all the stages from both models.',
          full: `<p><b>1. The five-stage model of group development</b> (for new groups):</p>
<ul>
<li><b>Forming:</b> members test the waters; ambiguity about purpose and others.</li>
<li><b>Storming:</b> conflict and criticism as roles and responsibilities get sorted out.</li>
<li><b>Norming:</b> issues are resolved, norms are agreed, cohesiveness grows and information flows.</li>
<li><b>Performing:</b> energy goes to the task.</li>
<li><b>Adjourning:</b> groups with a set lifespan, or groups hit by layoffs, disperse, often with rites and rituals.</li>
</ul>
<p><b>2. The punctuated equilibrium model</b> (Gersick), for groups with a <b>deadline</b>:</p>
<ul>
<li><b>First meeting:</b> sets the group’s assumptions, approach and precedents.</li>
<li><b>Phase 1:</b> a long period of inertia, with little visible progress.</li>
<li><b>Midpoint transition:</b> at about the halfway point in time, the group realizes time is running out and changes its approach.</li>
<li><b>Phase 2:</b> the new approach is carried out.</li>
<li><b>Completion:</b> a final burst of activity at the deadline.</li>
</ul>`,
          short: `<ul>
<li><b>Five-stage:</b> forming → storming → norming → performing → adjourning (1.5)</li>
<li><b>Punctuated equilibrium</b> (deadline groups): first meeting → Phase 1 (inertia) → midpoint transition → Phase 2 → final burst at the deadline (1.5)</li>
</ul>` },

        { l: 'b', marks: 1,
          q: 'What do these two models tell organizations about managing groups?',
          full: `<p><b>Five-stage model:</b></p>
<ul>
<li>Groups develop over time, and early friction (storming) is normal, so managers shouldn’t panic.</li>
<li>They should help groups through it by clarifying roles and helping set norms.</li>
<li>Groups whose members already know each other, or that are highly structured, can skip stages.</li>
</ul>
<p><b>Punctuated equilibrium model:</b></p>
<ul>
<li>For deadline-driven groups, the <b>first meeting</b> and the <b>midpoint</b> are the moments of greatest leverage.</li>
<li>Prepare the first meeting carefully, don’t expect radical progress in Phase 1, and use the midpoint to re-evaluate the approach.</li>
<li>Don’t move the deadline, because it drives the transition.</li>
</ul>`,
          short: `<ul><li>Development takes time and storming is normal (manage roles and norms early); for deadline groups the first meeting and the midpoint are the key moments to steer (1)</li></ul>` },

        { l: 'c', marks: 3,
          q: 'Explain what social loafing is and how it affects groups. Outline, with examples, two ways to overcome it.',
          full: `<p><b>Social loafing</b> is the tendency to <b>withhold physical or intellectual effort</b> when performing a group task. It comes in two forms:</p>
<ul>
<li><b>Free rider effect:</b> lowering effort to ride on others’ work.</li>
<li><b>Sucker effect:</b> lowering effort because you believe others are free riding.</li>
</ul>
<p><b>Effect on groups:</b> it is a <b>process loss</b>, so the group performs below its potential. It also breeds resentment, and it spreads as others cut back.</p>
<p><b>Two ways to overcome it:</b></p>
<ol>
<li><b>Make individual performance visible:</b> keep the group small and assign named sections. Example: each student presents their own part of the report and is graded on it.</li>
<li><b>Make each person’s contribution indispensable and the task engaging:</b> give each member a unique, necessary input, and make the work interesting. Example: one member owns the financial model the whole project depends on.</li>
</ol>
<p>Other fixes from the text: provide performance feedback, and reward group achievement.</p>`,
          short: `<ul>
<li>Definition: withholding effort on group tasks; free rider vs sucker effect (1)</li>
<li>Effect: a process loss, so lower performance and resentment that spreads (0.5)</li>
<li>Fix 1: make individual work <b>visible</b>, e.g., named sections and individual presentations, small groups (0.75)</li>
<li>Fix 2: make each member <b>indispensable</b> and the task interesting, with feedback and group rewards (0.75)</li>
</ul>`,
          ed13: 'The 13th edition stresses that social loafing is <b>“not natural and inevitable”: it depends on the context</b>. Use that line to justify why a manager’s fixes work.' },

        { l: 'd', marks: 3,
          q: 'Explain what groupthink is and describe, with examples, two reasons why it may occur.',
          full: `<p><b>Groupthink</b> (Janis) is the capacity for group pressure to damage the <b>mental efficiency, reality testing and moral judgment</b> of decision-making groups. Unanimity becomes more important than decision quality. Symptoms include:</p>
<ul>
<li>an illusion of invulnerability;</li>
<li>rationalization;</li>
<li>an illusion of morality;</li>
<li>stereotypes of outsiders;</li>
<li>pressure for conformity and self-censorship;</li>
<li>an illusion of unanimity;</li>
<li>mindguards.</li>
</ul>
<p><b>Two reasons it occurs:</b></p>
<ol>
<li><b>High cohesiveness and concern for the group’s approval:</b> members who value belonging censor their doubts to stay accepted. Example: a close-knit executive team that has worked together for years and never challenges its own plans. Dr. Kassaye’s slide 27 lists cohesiveness first.</li>
<li><b>A leader who promotes a particular decision,</b> which the textbook calls the strongest cause, often alongside <b>isolation from outside information</b>. Example: in NASA’s Hubble telescope mirror case, a dominant leader isolated the project team from outside information, and warning signs were explained away. Another: a CEO signals the acquisition they want, and the board “unanimously” agrees.</li>
</ol>`,
          short: `<ul>
<li>Definition: group pressure damages mental efficiency, reality testing and moral judgment; unanimity beats quality (Janis) (1)</li>
<li>Reason 1: <b>high cohesiveness</b>, so members self-censor to stay accepted, e.g., a close-knit executive team (1)</li>
<li>Reason 2: <b>a leader promoting a decision</b> plus <b>isolation</b>, e.g., NASA Hubble mirror team (1)</li>
</ul>` }
      ] },

    /* ───────────────────────── Q4 · CULTURE & SOCIALIZATION ───────────────────────── */
    { n: 4, week: 'w8', topic: 'Culture & Socialization',
      setup: '',
      parts: [
        { l: 'i', marks: 1,
          q: 'What is organizational culture?',
          full: `<p><b>Organizational culture</b> is the <b>shared beliefs, values and assumptions</b> that exist in an organization. They determine the norms that develop and the patterns of behaviour that emerge. Culture gives an organization its uniqueness and social identity; it is a “way of life” for members, and it is fairly stable over time.</p>`,
          short: `<ul><li>The shared beliefs, values and assumptions in an organization, which shape its norms and behaviour (1)</li></ul>`,
          ed13: 'The 13th edition adds a fifth characteristic of culture: it is a <b>“toolkit”</b> that members draw on to solve problems, make decisions and build strategies of action.' },

        { l: 'ii', marks: 1.5,
          q: 'What are three ways of quickly diagnosing an organization’s culture?',
          full: `<ol>
<li><b>Symbols:</b> any object, act, event, quality or relation that conveys meaning. Examples: Chaparral Steel employees walk through HR to reach their lockers; a hospital CEO hung his office doors in the lobby to signal openness.</li>
<li><b>Rites, rituals and ceremonials:</b> planned events and standardized routines that recognize accomplishments and express the culture. Examples: Mary Kay’s pink Cadillacs and seminars; a team lunch in a new hire’s first week.</li>
<li><b>Stories:</b> narratives about past events, often part truth and part fiction, retold to newcomers to show “how things work.” Examples: Ray Kroc cancelling a franchise over a single fly; the FedEx driver who cut a frozen drop box free to make the plane.</li>
</ol>`,
          short: `<ul>
<li><b>Symbols:</b> objects or layout that convey meaning, e.g., walking through HR (0.5)</li>
<li><b>Rites, rituals and ceremonials:</b> e.g., awards nights, Mary Kay’s pink Cadillacs (0.5)</li>
<li><b>Stories:</b> e.g., Ray Kroc and the fly (0.5)</li>
</ul>`,
          ed13: 'The 13th edition renames the middle category <b>rites, rituals and ceremonials</b> (the 12th said “rituals”) and defines each. A <b>rite</b> is a planned, dramatic event for an audience; a <b>ritual</b> is standardized actions recognizing an event or accomplishment; a <b>ceremonial</b> is several rites tied to one occasion. It also adds rites of passage, integration and enhancement, plus new examples (the hospital doors, FedEx).' },

        { l: 'iii', marks: 1,
          q: 'How are RJPs helpful for both an organization and potential/new employees?',
          full: `<p>A <b>realistic job preview</b> gives applicants a balanced picture of a job’s positive <i>and</i> negative aspects.</p>
<p><b>For the organization:</b> it lowers inflated expectations, so there is less reality shock and less early <b>turnover</b>. Poor-fit candidates <b>self-select out</b>. It improves performance, helps prevent psychological contract breach, and is a cheap way to come across as honest and trustworthy.</p>
<p><b>For applicants and new employees:</b> they get <b>accurate expectations</b> and can decide on real PJ and PO fit. They also adjust more easily once hired, because what they meet matches what they were told.</p>`,
          short: `<ul>
<li><b>Organization:</b> less reality shock and turnover; poor fits self-select out; fewer breaches (0.5)</li>
<li><b>Employees:</b> accurate expectations, a fit-based decision, and an easier adjustment (0.5)</li>
</ul>` },

        { l: 'iv', marks: 2,
          q: 'Explain the psychological contract and its breach.',
          full: `<p>The <b>psychological contract</b> is the <b>beliefs employees hold about the reciprocal obligations and promises</b> between themselves and their organization. Example: “If I work hard and stay late, I’ll get training and promotion.” It forms during recruiting and early socialization, and it is unwritten.</p>
<p><b>Breach</b> is the employee’s perception that the organization has <b>failed to fulfill one or more of those promises</b>. Breach is common, and its consequences are serious:</p>
<ul>
<li><b>Feelings:</b> anger, betrayal and mistrust.</li>
<li><b>Attitudes:</b> lower job satisfaction and commitment, and higher intention to quit.</li>
<li><b>Behaviour:</b> lower organizational citizenship behaviour and lower performance.</li>
</ul>
<p>It often happens because recruiters overpromise or because the two sides understand the promises differently. RJPs and accurate socialization help prevent it.</p>`,
          short: `<ul>
<li>Contract: an employee’s beliefs about <b>reciprocal obligations and promises</b> with the organization (unwritten) (1)</li>
<li>Breach: the perception the organization broke a promise, leading to mistrust, lower satisfaction and commitment, intent to quit, and lower OCB and performance (1)</li>
</ul>` },

        { l: 'v', marks: 3,
          q: 'Discuss the three stages of socialization that a new employee could encounter.',
          full: `<p>Feldman’s three stages:</p>
<ol>
<li><b>Anticipatory socialization</b> (before entry): learning that happens before joining, both formal (college or university) and informal (summer jobs, media, recruiting events). The employee forms expectations, which may be <b>unrealistic</b>; an RJP can correct them.</li>
<li><b>Encounter</b> (on entry): day-to-day reality meets expectations, and inconsistencies emerge. Formal orientation covers policies, benefits, introductions and job duties; informally, the newcomer learns the boss’s and co-workers’ styles. The organization looks for acceptable conformity, the recruit wants their needs met, and the newcomer <b>complies</b> and begins to <b>identify</b>.</li>
<li><b>Role management</b> (settling in): fine-tuning and actively managing the role, building connections beyond the work group, and balancing work and non-work roles. The newcomer moves from “outsider” to “insider” and begins to <b>internalize</b> the organization’s norms and values. If they don’t align, dissatisfaction and turnover follow.</li>
</ol>`,
          short: `<ul>
<li><b>Anticipatory</b> (pre-entry): school, jobs and recruiting shape expectations, which may be unrealistic (fix with an RJP) (1)</li>
<li><b>Encounter</b> (entry): reality meets expectations; orientation and learning the boss and co-workers; comply and begin to identify (1)</li>
<li><b>Role management:</b> fine-tune the role, balance work and life, go from outsider to insider, internalize norms (1)</li>
</ul>`,
          ed13: 'The 13th edition adds <b>role clarity</b> (a clear understanding of your responsibilities, goals and priorities) as a key proximal outcome of socialization and an indicator of newcomer adjustment. Saying that the encounter and role-management stages build role clarity earns credit.' },

        { l: 'vi', marks: 0.5,
          q: 'If an organization provides a new employee with a mentor, what would be the mentor’s two primary functions?',
          full: `<ol>
<li><b>Career functions:</b> sponsorship, exposure and visibility, coaching and feedback, and developmental assignments.</li>
<li><b>Psychosocial functions:</b> role modelling, acceptance and confirmation, and counselling.</li>
</ol>`,
          short: `<ul><li><b>Career</b> (sponsorship, visibility, coaching, assignments) and <b>psychosocial</b> (role modelling, acceptance, counselling) (0.5)</li></ul>` },

        { l: 'vii', marks: 1,
          q: 'Identify and discuss four possible proactive socialization behaviors.',
          full: `<p><b>Proactive socialization</b> is newcomers taking an active role in their own socialization. Four of the eight behaviours (Exhibit 8.6):</p>
<ol>
<li><b>Feedback seeking:</b> asking how you’re performing.</li>
<li><b>Information seeking:</b> asking about your job, role, group and organization.</li>
<li><b>Relationship building:</b> starting social interactions and relationships with others in your area.</li>
<li><b>Positive framing:</b> viewing the new situation positively, as opportunities rather than threats.</li>
</ol>
<p>The others are general socializing, boss-relationship building, networking and job change negotiation. Feedback and information seeking matter most for <b>sensemaking</b>.</p>`,
          short: `<ul><li>Feedback seeking · information seeking · relationship building · positive framing (others: networking, boss-relationship building, general socializing, job change negotiation) (1)</li></ul>`,
          ed13: 'The 13th edition reports that <b>positive framing</b> is the <b>strongest predictor</b> of most socialization outcomes and job change negotiation the weakest, so positive framing is the best one to include. Note: Dr. Kassaye’s slide 24 lists seven behaviours and leaves positive framing out.' }
      ] },

    /* ───────────────────────── Q5 · LEADERSHIP ───────────────────────── */
    { n: 5, week: 'w9', topic: 'Leadership (path–goal)',
      setup: 'Support your arguments with sound reasoning and examples.',
      parts: [
        { l: 'a', marks: 7,
          q: 'What are the components and lessons of House’s Path-Goal Theory of leadership?',
          full: `<p><b>Path–goal theory</b> (Robert House) says the most important thing a leader does is <b>clarify the paths</b> to goals employees value (a promotion, a sense of accomplishment, a pleasant climate). Doing so raises <b>job satisfaction, acceptance of the leader and effort</b>. It has three components (Exhibit 9.3).</p>
<p><b>1. Leader behaviours.</b> There are four:</p>
<ul>
<li><b>Directive:</b> schedules work, sets standards and makes expectations clear (like initiating structure).</li>
<li><b>Supportive:</b> friendly, approachable and concerned for employees’ welfare (like consideration).</li>
<li><b>Participative:</b> consults employees and considers their opinions.</li>
<li><b>Achievement-oriented:</b> sets challenging goals, encourages high effort and expresses confidence that employees can reach them.</li>
</ul>
<p><b>2. Situational factors.</b> There are two classes:</p>
<ul>
<li><b>Employee characteristics.</b> High need achievers work well under achievement-oriented leadership. Employees who prefer being told what to do respond to directive leadership. Those with low perceived task ability appreciate directive leadership and coaching; capable employees find it redundant and irritating.</li>
<li><b>Environmental factors.</b> For clear, routine tasks, directive and participative leadership add little and feel like an imposition. For challenging, ambiguous tasks, directive and participative leadership help clarify the path. For routine, frustrating or dissatisfying jobs, supportive leadership helps most.</li>
</ul>
<p><b>3. Employee outcomes:</b> job satisfaction, acceptance of the leader and effort.</p>
<p><b>Lessons:</b></p>
<ul>
<li>There is <b>no one best style</b>; effectiveness depends on fit with the employees and the work.</li>
<li>A behaviour helps when it supplies something the situation lacks, and hurts when it is <b>redundant</b>.</li>
<li>Good leaders use the motivating and satisfying parts of a job and <b>offset the demotivating ones</b>.</li>
<li>Leaders must diagnose before they act and change style as the situation changes.</li>
<li>The theory predicts satisfaction and leader acceptance better than job performance.</li>
</ul>`,
          short: `<ul>
<li>Core idea: leaders <b>clarify paths</b> to valued goals, which raises satisfaction, leader acceptance and effort (1)</li>
<li>Four behaviours: <b>directive · supportive · participative · achievement-oriented</b>, each defined in a phrase (2)</li>
<li>Employee characteristics: need for achievement → achievement-oriented; prefers direction → directive; low ability → directive and coaching (1.5)</li>
<li>Environment: clear routine task → directive is redundant; ambiguous task → directive or participative; frustrating job → supportive (1.5)</li>
<li>Lessons: no one best style; avoid redundant behaviour; offset what demotivates; better at predicting satisfaction than performance (1)</li>
</ul>` },

        { l: 'b', marks: 3,
          q: 'Use House’s Path-Goal Theory to explain how your leadership style would differ in the following situations: (1) you are acting as a supervisor for incoming junior associates at a top law firm; (2) you are leading an information technology (IT) team during a major system outage; (3) you are a manager overseeing a recruitment event that your assistant manager has been planning for weeks.',
          full: `<ol>
<li><b>Junior associates at a top law firm: directive (with coaching), plus achievement-oriented.</b> They are new, so their perceived task ability is low, and legal work is challenging and ambiguous. The theory says such employees appreciate directive leadership and coaching: set clear standards, explain how work is reviewed, and show the path to advancement. Associates at a top firm are likely high need achievers, so add challenging goals and express confidence. Add supportive behaviour for the long hours. As their ability grows, ease off directive behaviour before it becomes redundant.</li>
<li><b>IT team during a major outage: directive, then supportive.</b> The situation is urgent and ambiguous, so clarify the path at once: who does what, the priorities, the timelines and the communication plan. Consult the technical experts briefly, because they hold knowledge you need, but don’t run a slow participative process in a crisis. Don’t micromanage the technical fix of capable engineers. Afterwards, be supportive, because outages are stressful and frustrating.</li>
<li><b>Recruitment event your assistant manager has planned for weeks: participative and achievement-oriented, not directive.</b> The assistant manager is capable and owns the plan, so directive leadership would be redundant and irritating, lowering their satisfaction and acceptance of you. Consult them, ask what they need, express confidence in them, and stay available with supportive help if problems arise.</li>
</ol>`,
          short: `<ul>
<li><b>Law-firm juniors:</b> directive and coaching (low ability, ambiguous work) + achievement-oriented (high achievers); ease off as they learn (1)</li>
<li><b>IT outage:</b> directive (an urgent, ambiguous task: assign roles and priorities); brief expert input; supportive afterwards (1)</li>
<li><b>Assistant manager’s event:</b> participative + achievement-oriented; directive would be redundant and irritating for a capable owner of the plan (1)</li>
</ul>` }
      ] }
  ]
});
