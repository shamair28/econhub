# Practice Test Framework — Question Bank Schema (v1)

The practice engine (`practice/engine.js`) loads one or more **question banks** (JSON files) and runs them one question at a time. This document is the ingest contract. Validate every bank with:

```bash
python website/practice/tools/validate_bank.py website/1B03/banks/*.json   # schema + consistency
node   website/practice/tools/check_graphs.js  website/1B03/banks/*.json   # graph tasks accept their model answer
python website/practice/tools/dump_bank.py     website/1B03/banks/1B03-mt1-f22.json   # readable dump for content review
```

## Mounting a page

```html
<link rel="stylesheet" href="../practice/graph.css">
<link rel="stylesheet" href="../practice/engine.css">
<div id="app"></div>
<script src="../practice/graph.js"></script>
<script src="../practice/engine.js"></script>
<script>
PracticeEngine.mount(document.getElementById('app'), {
  id: '1B03-midterm1',              // localStorage key — unique per page
  course: 'ECON 1B03',
  courseTitle: 'Introductory Microeconomics',
  title: 'Midterm 1 Practice',
  subtitle: 'Units 1–4 · Fall 2026',
  homeHref: '/',
  banks: ['banks/1B03-mt1-f22.json', 'banks/1B03-mt1-slides-u1.json', /* … one file per source or unit */],
  scope: { id: 'f26-mt1', label: 'Fall 2026 Midterm 1', units: [1, 2, 3, 4],
           note: 'Midterm 1 covers **Units 1–4**.' },
  unitNames: { 1: 'Introduction to Economics', 2: 'Trade-offs & Comparative Advantage', 3: 'Supply & Demand', 4: 'Market Efficiency', 5: 'Elasticity', 12: 'Externalities & Public Goods' },
  exam: { questions: 40, minutes: 80 }   // exam-simulation timing (scaled to the selected count)
});
</script>
```

Bump the `?v=` query on the framework's `<link>`/`<script>` tags in every test page whenever `engine.*` or `graph.*` change, so returning visitors don't run a cached engine against new banks. Chapter-based courses can pass `unitWord: 'Ch.', unitNoun: 'chapter'` so badges and filters say "Ch. 3" instead of "Unit 3". A question's `figure` may also be an array of figures, shown side by side.

A question is **in scope** when its `unit` is in `scope.units` and it does not carry the tag `out-of-scope` (or `"inScope": false`). Out-of-scope questions stay in the bank but are hidden unless the student turns off the scope filter, and they show a "Not on <scope label>" badge.

## Bank file

```jsonc
{
  "schema": "practice-bank/v1",
  "id": "1B03-mt1-f22",                     // unique across all banks on a page
  "course": "ECON 1B03",
  "title": "F22 Practice Midterm",          // shown as the source label when a question has none
  "description": "Optional.",
  "defaultSource": { "label": "F22 Practice Midterm", "kind": "past-test" },
  "defaultUnit": 3,                         // optional fallback for questions without `unit`
  "scenarios": { "<scenarioId>": { ... } }, // optional shared stems (see below)
  "questions": [ { ... } ]
}
```

### Source (`source`)

Every question shows a **source badge**. Bank `defaultSource` is merged with the question's `source`:

| field   | notes |
|---------|-------|
| `label` | e.g. `"F22 Practice Midterm"`, `"Unit 3 Lecture Slides"` |
| `ref`   | short locator appended to the badge: `"Q17"`, `"Lesson 2 · slide 15"` |
| `kind`  | `past-test` · `slides` · `textbook` · `generated` · `custom` (controls badge colour) |
| `note`  | optional sentence shown under the explanation ("Adapted from …") |

### Scenarios

Several questions can share one stem (like "The next four questions refer to…"). Questions that share a scenario are kept adjacent when the order is shuffled, and the scenario panel stays visible above each of them.

```jsonc
"scenarios": {
  "laptops": {
    "title": "Market for laptops",
    "body": "Suppose market demand is Q<sub>d</sub> = 10,000 + 0.8T + 0.005N − 4P …",
    "table":  { "caption": "Table 2-5", "headers": ["", "Jeans", "Sweaters"], "rows": [["Levi's", 3, 2]], "rowHeaders": true },
    "figure": { "type": "graph", "spec": { ...graph spec... }, "caption": "Figure 2-1" }
  }
}
```

`body`, `table`, `figure` are all optional.

### Text fields

`prompt`, option `text`, `explanation`, scenario `body` accept either plain text with light markup — `**bold**`, `*italic*`, `` `code` ``, blank line = new paragraph — or HTML (`<sub>`, `<sup>`, `<b>`, `<ul>`, …). Scripts and event handlers are stripped. Use real Unicode where possible: `−` (minus), `Q₁`, `P*`, `½`.

## Question object (common fields)

```jsonc
{
  "id": "f22-q03",                 // unique within the bank (bank id is prefixed on collision)
  "type": "mc",                    // mc | multi | tf | numeric | graph
  "unit": 3,                       // course unit number (drives scope + results breakdown)
  "topic": "Inverse demand",       // short tag shown in the meta badge
  "tags": ["algebra"],             // free-form; "out-of-scope" forces exclusion from the scope filter
  "scopeNote": "Elasticity is Unit 5 in Fall 2026.",   // tooltip on the "Not on …" badge
  "difficulty": 2,                 // 1 easy · 2 medium · 3 hard
  "source": { "ref": "Q3" },
  "scenario": "laptops",           // optional scenario id from this bank
  "figure": { ... },               // optional, same shape as scenario.figure (graph | image | table)
  "prompt": "Refer to the scenario. What is the equation for the inverse demand?",
  "explanation": "Set Q<sub>d</sub> = 10,800 − 4P and solve for P …",   // shown after answering
  "shuffleOptions": false          // set true only when no option refers to another ("all of the above")
}
```

### `mc` — single answer

```jsonc
{ "type": "mc",
  "options": [ { "id": "a", "text": "supply" }, { "id": "b", "text": "demand" } ],   // or plain strings
  "answer": "b" }
```

Options may be plain strings; ids are then assigned `a, b, c…` in order. Option ids must match `answer`.

### `multi` — select all that apply (all-or-nothing)

```jsonc
{ "type": "multi", "options": ["An increase in income", "A fall in the price of a complement", "A rise in the good's own price"], "answer": ["a", "b"] }
```

### `tf` — true/false

```jsonc
{ "type": "tf", "prompt": "A price ceiling set above the equilibrium price is binding.", "answer": false }
```

### `numeric`

```jsonc
{ "type": "numeric",
  "prompt": "Demand: Q<sub>d</sub> = 140 − 2P; Supply: Q<sub>s</sub> = P + 5. Find the equilibrium price.",
  "answer": { "value": 45, "tolerance": 0.5, "prefix": "$", "display": "$45",
              "accept": [], "tolerancePct": null, "hint": "Round to the nearest dollar", "placeholder": "" } }
```

* Students may type `$1,600`, `3/2`, `1.5`, `-4`, `40%` — currency, commas, `%` and spaces are stripped; fractions are evaluated.
* `tolerance` is absolute (default 0.01); `tolerancePct` overrides it as a percentage of the value.
* `accept` lists alternative correct values. `display` overrides how the correct answer is printed.

### `graph` — draw on a graph

The student draws lines (drag → auto-straightened) or places points (tap). Grading is deliberately loose: it checks slope *direction*, shift *direction relative to a reference curve*, and *proximity* to a target — never exact coordinates.

```jsonc
{ "type": "graph",
  "prompt": "Consumer incomes rise and coffee is a normal good. Draw the new demand curve D₂ and mark the new equilibrium E₂.",
  "graph": {
    "x": { "label": "Quantity of coffee", "min": 0, "max": 100, "hideTicks": true },
    "y": { "label": "Price", "min": 0, "max": 100, "hideTicks": true },
    "curves": [
      { "id": "D", "label": "D₁", "points": [[10, 80], [80, 10]], "color": "blue" },
      { "id": "S", "label": "S",  "points": [[10, 10], [80, 80]], "color": "red" }
    ],
    "points": [ { "id": "E", "label": "E₁", "x": 45, "y": 45, "drop": "both", "dropLabels": { "x": "Q₁", "y": "P₁" } } ],
    "tasks": [
      { "id": "D2", "kind": "line",  "label": "D₂", "prompt": "Draw the new demand curve D₂",
        "expect": { "slope": "negative", "shiftOf": "D", "direction": "right" } },
      { "id": "E2", "kind": "point", "label": "E₂", "prompt": "Mark the new equilibrium E₂",
        "expect": { "atIntersection": ["user:D2", "S"], "relativeTo": { "ref": "E", "x": "+", "y": "+" } } }
    ]
  },
  "explanation": "Higher income raises demand for a normal good at every price, so D shifts right. Along the unchanged supply curve, both P and Q rise." }
```

#### Graph spec

| key | description |
|-----|-------------|
| `x`, `y` | `{ label, min, max, step?, ticks?: [n or {at,label}], hideTicks? }` |
| `width`, `height` | SVG size (default 560×400); `grid: false` hides gridlines |
| `curves[]` | `{ id, label, color, style: "solid"\|"dashed", points: [[x,y],…] }` **or** `{ …, linear: { intercept, slope } }` (y = intercept + slope·x, clipped). Add `smooth: true` for a curved PPF. `labelPos: "start"\|"end"`. `hidden: true` keeps a curve out of the drawing but available as a grading reference (e.g. a horizontal line at P* for price-control tasks) |
| `points[]` | `{ id, label, x, y, color, drop: "both"\|"x"\|"y", dropLabels: {x, y}, hollow }` |
| `regions[]` | `{ points: [[x,y],…], fill: "blue", opacity: 0.18, label: "CS", labelAt: [x,y] }` — shaded polygons for CS/PS/DWL |
| `guides[]` | `{ axis: "y", at: 60, label: "P ceiling", dashed: true, toX? }` / `{ axis: "x", at: 40, label: "Q*", toY? }` |
| `tasks[]` | what the student must draw (below). Omit for a static figure. |
| `caption`, `alt` | figure caption / accessible description |

Colours: `blue red green purple amber gray slate pink teal orange indigo` or any CSS colour.

#### Tasks

`{ id, kind: "line"|"point", label, prompt, color?, expect, model?, hints?, success? }`

**Line expectations** (`expect`), all optional and combinable:

| key | meaning |
|-----|---------|
| `slope` | `negative` · `positive` · `flat` · `vertical` · `any` (thresholds: ±12° = flat, ±78° = vertical) |
| `shiftOf`, `direction` | reference curve id and `right` · `left` · `up` · `down`. Mean displacement must exceed `minShift` (default 0.05 of the axis range) with a consistent sign |
| `through` | `[{ x, y, tol?, label? }]` — line must pass near each point |

**Point expectations**, one target plus optional `relativeTo`:

| key | meaning |
|-----|---------|
| `near` | `{ x, y }` — within `tol` (default 0.08 of the axis ranges) |
| `atIntersection` | `[refA, refB]` — refs are curve ids, `"user:<taskId>"` (the student's own line) or `"model:<taskId>"` |
| `onCurve` + `atX`/`atY` | on a curve at a given coordinate; omit `atX/atY` to accept anywhere on the curve |
| `region` | `{ xmin?, xmax?, ymin?, ymax? }` in data units |
| `side` | `{ of: "ppf", which: "above"\|"below", minGap?: 0.03 }` — point must lie above/below a curve (measured vertically against the curve). For a downward PPF, `above` = beyond the frontier (unattainable), `below` = inside it (attainable but inefficient). Prefer this over `region` for PPF questions |
| `relativeTo` | `{ ref: "E", x: "+"\|"-"\|"0"\|"any", y: … }` — compare to a defined point or `"user:<taskId>"` |

`model` (optional) overrides the dashed "model answer" overlay: lines `{ points: [[x,y],[x,y]] }` or `{ shift: 0.2 }` (fraction of range); points `{ x, y }`. Without it the engine derives a model from `expect` (a shifted copy of the reference, the intersection, etc.).

`hints` lets you override the automatic feedback message per check: `{ slope, shift, through, near, intersection, missing, relative }`. `success` overrides the ✓ message.

## Authoring guidelines for question writers

1. **One concept per question.** Prompt ≤ 60 words unless it needs data. Four options for `mc` (a–d) to mirror the real test.
2. **Explanations are mandatory** and must teach: state the rule, show the calculation, and say why the tempting distractor is wrong.
3. **Numbers must check out.** Solve every numeric/algebra question in the explanation; the validator cannot do the economics for you.
4. **Tag scope honestly** — `unit` must reflect the *course's* unit numbering for the term the page targets.
5. **Cite the source**: `source.ref` should point to a slide/lesson or the original question number.
6. Don't use `shuffleOptions: true` when any option says "all/none of the above", "both a and b", etc.
7. For graph questions, keep axes qualitative (`hideTicks: true`) unless the numbers matter; keep reference curves well inside the plot so shifted curves fit.
8. Keep `id`s stable — session history and resumed sessions key on them.
