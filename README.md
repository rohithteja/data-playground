# Data Playground

A local Next.js study site for newcomers to data science. The EPITA slide decks are grouped into eight subjects and 51 short topics. Each topic has a plain-language lesson, a worked example, a vector diagram to manipulate, a practice question, and a source reference.

## Run locally

Use Node.js 20 or later and npm. From the project folder, run:

```sh
npm ci
npm run dev
```

Open [Data Playground](http://127.0.0.1:3000/). For a local production build, stop the dev server and run:

```sh
npm run build
npm start
```

Both servers listen on the loopback address. Practice completion is stored in the browser for that address and port. The site uses local code and SVGs and requires no account or API key.

## Curriculum and sources

| Subject | Core topics |
| --- | --- |
| Computing Foundations | Pseudocode, conditions, traces, stacks and queues, graphs, containers |
| Introduction to Python | Types, loops, containers, text files, functions, classes and exceptions |
| Probabilistic Reasoning | Center and spread, events and independence, Bayes, distributions, expected value, correlation |
| Exploratory Data Analysis | Dataset inspection, data quality, chart choice, grouping, joins, reporting |
| Mathematics for Machine Learning | Vectors, similarity, feature scaling, squared error, gradients, training |
| Algorithms & Data Structures | Complexity, arrays, recursion, binary search, sorting, hashing |
| Data & Analytics Ecosystem | Metrics, keys, segments, leakage, baselines, model evaluation |
| Engineering Tools | Terminal, pipes, Git, environments, debugging |

The [source inventory](content/source-inventory.json) lists 29 PDF and PowerPoint decks found in the eight subject folders. It includes the General and SE/DSA editions of Harmonisation Week. Probability lessons use the image-based slides and their companion notebooks. The curriculum groups related concepts and uses original small examples. It is a beginner path through the slide material.

## Add new slides and topics

1. Put PDF or PPTX decks in a course’s `slides` folder. Use the inventory command to identify new decks and extract review text. Image-based PDF pages are flagged for manual review or OCR.
2. Add a topic to the matching module in `content/`. For a new subject, create a module with the same structure and register it in `content/index.mjs`.
3. Write one main idea, one worked example, and one quick question. Add the source deck and page or slide range. Reuse a diagram from `content/visual-kinds.mjs`, or pass a sequence of frames with `steps(...frames)`. Keep IDs stable so existing links and progress still work.
4. Run `npm run check:content` and open the new topic in the browser. The navigation, topic counts, and progress denominator come from the content modules.

To extract slide text, install `pypdf` in your Python environment. The default scan root is the parent of this project. You can also pass a different root as a positional argument.

```sh
npm run scan:slides -- --output /tmp/data-playground-slide-review
```

The scanner inventories decks and extracts text for review. Turning a deck into lessons is a separate authoring step, so each new topic can be checked for accuracy and suited to a beginner.

A minimal topic in a subject module:

```js
import { lesson, steps } from './lesson.mjs';

const joinTopic = lesson(
  'matching-ids',
  'Match rows by ID',
  4,
  'See how two rows become one result.',
  'A join connects records that share the same key.',
  'An order with customer ID A matches the customer named Ada.',
  steps(['Read order', 'Customer ID A', ''], ['Find the match', 'A → Ada', 'Ada']),
  'Which column should connect the two records?',
  ['Customer ID', 'Order amount', 'Customer name'],
  0,
  'Both records carry the customer ID.',
  'New deck · slides 3–5'
);
```

Add `joinTopic` to the subject’s `topics` array. The answer index starts at zero. To add several questions, supply a `questions` array of objects with `question`, `choices`, `answer`, and `feedback` fields.
