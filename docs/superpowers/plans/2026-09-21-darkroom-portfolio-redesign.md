# Darkroom Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved Darkroom Cinema concept into Amir Bahador Rostami's production Astro portfolio, with five documented projects, seven experiments, Baha music, a curated career timeline, resilient contact paths, and two progressive PixiJS experiences.

**Architecture:** Keep the current static Astro application and content collections as the source of truth. Extend the content layer with typed project media and experiments, then rebuild production routes from focused Astro components; PixiJS is dynamically bundled only for the homepage hero and BioWords, while all essential copy, fallbacks, navigation, and media labels remain server-rendered HTML.

**Tech Stack:** Astro 6 static output, TypeScript 5.9, Astro content collections with Zod, PixiJS 8, self-hosted Outfit Variable and IBM Plex Mono, Vitest, Playwright, axe-core, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-21-darkroom-portfolio-redesign-design.md`

## Global Constraints

- Work only on `codex/darkroom-portfolio`; preserve `codex/six-concept-design-lab` unchanged.
- Use Node 24. Run Node commands with `PATH=/Users/amirbahadorrostami/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/usr/local/bin:/usr/bin:/bin` when the shell does not already resolve Node 24.
- Keep Astro static output and GitHub Pages compatibility. Add no server, database, CMS, authentication, analytics, or exposed secret.
- Keep exactly five Work entries in this order: Encounters, Luminous Trails, Ephemeral Pulses of a Finite Scroll, BioWords, Person Is a Data Structure.
- Keep exactly seven Experiments entries: Cellular Automata followed by Experiment 02 through Experiment 07. Do not invent metadata for the six unnamed studies.
- Keep exactly seven Baha tracks and exactly thirteen experience records.
- Keep the homepage flagship and selected-music sections as wrapping grids, never carousels or horizontal scrolling rows.
- Use near-black, graphite, warm off-white, and deep red as the only signal colour. Use Outfit Variable for display/body and IBM Plex Mono for technical metadata.
- Do not introduce purple gradients, glossy 3D blobs, colourful feature rows, generic icon grids, system-only typography, rounded-everything UI, card shadows, or scroll hijacking.
- Preserve semantic HTML, visible focus, keyboard operation, 44px touch targets, WCAG 2.1 AA contrast, reduced-motion equivalents, and zero horizontal overflow at 320 CSS pixels.
- Never autoplay audio. Videos must not autoplay with sound. Third-party players load only after explicit activation.
- Keep complete narrative content usable without JavaScript, WebGL, animation, third-party embeds, or optional media.
- Keep email addresses, phone numbers, credentials, participant locations, and backend data out of generated output. BioWords input stays in browser memory and is never stored or transmitted.
- Use deep red `#a71414` as the production `--signal`; do not carry the old p5 `nameAnimation` into production.
- Keep the design lab unlinked and add `noindex, nofollow` to all `/design-lab/` pages.
- Use `PUBLIC_CONTACT_FORM_ENDPOINT` as the only direct-form endpoint. When it is absent, show LinkedIn as the fallback without exposing an email address.
- Required final command: `npm test`. It must pass unit tests, Astro diagnostics/build, browser tests, and the unconfigured-contact suite.

## File Structure and Responsibilities

### Content and domain files

- `src/content.config.ts`: validates projects, project media, experiments, music, and experience.
- `src/content/projects/*/index.md`: owns project facts and editorial narrative; no component contains project-specific copy.
- `src/content/experiments/*.json`: owns the seven-entry experiment inventory and its media readiness.
- `src/lib/content.ts`: sorts and validates collection-level inventory.
- `src/lib/project-media.ts`: defines render-facing project-media helpers and YouTube parsing.
- `src/lib/experiments.ts`: defines experiment video/source fallbacks.
- `src/lib/ten-print.ts`: creates deterministic diagonal-grid geometry without importing PixiJS.
- `src/lib/biowords/model.ts`: owns deterministic, framework-independent BioWords simulation state.
- `src/lib/biowords/controller.ts`: maps accessible HTML controls to model transitions and renderer calls.
- `src/lib/biowords/renderer.ts`: owns PixiJS drawing only; it does not tokenize or decide survival.

### Production components and routes

- `src/styles/global.css`: Darkroom tokens, global type, focus, container, and motion primitives.
- `src/layouts/BaseLayout.astro`: metadata, font imports, page shell, and optional robots directive.
- `src/layouts/ProjectLayout.astro`: numbered flagship/short case-study sequence.
- `src/components/interactive/TenPrintField.astro`: static hero fallback plus progressive PixiJS mount.
- `src/components/interactive/BioWordsExperience.astro`: accessible controls, status, result, static fallback, and renderer mount.
- `src/components/projects/ProjectMedia.astro`: renders typed ready media and labelled missing-media frames.
- `src/components/experiments/ExperimentCard.astro`: renders ready video or intentional study frame.
- `src/components/experiments/ExperimentGrid.astro`: seven-entry editorial grid.
- `src/pages/experiments.astro`: Experiments archive.
- `src/pages/work/remote-realities/index.astro`: static compatibility redirect.
- `src/pages/work/cellular-automata/index.astro`: static compatibility redirect.
- Existing production routes and components are restyled in place; the design-lab component is a reference, not copied into production.

---

### Task 1: Establish the production content contracts and inventory

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/content.config.ts`
- Modify: `src/lib/content.ts`
- Create: `src/content/experiments/01-cellular-automata.json`
- Create: `src/content/experiments/02-experiment-02.json`
- Create: `src/content/experiments/03-experiment-03.json`
- Create: `src/content/experiments/04-experiment-04.json`
- Create: `src/content/experiments/05-experiment-05.json`
- Create: `src/content/experiments/06-experiment-06.json`
- Create: `src/content/experiments/07-experiment-07.json`
- Delete: `src/content/projects/cellular-automata/index.md`
- Test: `tests/unit/content-contract.test.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: Astro `defineCollection`, `glob`, and Zod image helpers.
- Produces: collection `experiments`; nested `projectMedia` and `mediaSource` schemas; `EXPECTED_PROJECT_SLUGS`; `EXPECTED_EXPERIMENT_TITLES`; `getPublishedExperiments(): Promise<CollectionEntry<'experiments'>[]>`.

- [ ] **Step 1: Add failing content-contract tests**

```ts
const expectedProjects = [
  'encounters',
  'luminous-trails',
  'ephemeral-pulses-of-a-finite-scroll',
  'biowords',
  'person-is-a-data-structure',
];

const expectedExperiments = [
  'Cellular Automata',
  'Experiment 02',
  'Experiment 03',
  'Experiment 04',
  'Experiment 05',
  'Experiment 06',
  'Experiment 07',
];

it('keeps the approved work and experiment inventories separate', async () => {
  expect((await getCollection('projects')).map(({ id }) => id).sort()).toEqual(
    [...expectedProjects].sort(),
  );
  const experiments = sortByOrder(await getCollection('experiments'));
  expect(experiments.map(({ data }) => data.title)).toEqual(expectedExperiments);
  expect(experiments.map(({ data }) => data.state)).toEqual([
    'ready', 'placeholder', 'placeholder', 'placeholder', 'placeholder', 'placeholder', 'placeholder',
  ]);
});

it('requires every project media record to describe its fallback', async () => {
  for (const { data } of await getCollection('projects')) {
    for (const media of data.media) {
      expect(media).toEqual(expect.objectContaining({
        id: expect.any(String),
        type: expect.stringMatching(/^(image|video|diagram)$/),
        aspectRatio: expect.stringMatching(/^\d+\s*\/\s*\d+$/),
        alt: expect.any(String),
        caption: expect.any(String),
        intention: expect.any(String),
        state: expect.stringMatching(/^(ready|placeholder)$/),
      }));
    }
  }
});
```

- [ ] **Step 2: Run the focused tests and verify the new inventory fails**

Run: `npm run test:unit -- tests/unit/content-contract.test.ts tests/unit/content.test.ts`

Expected: FAIL because the `experiments` collection and renamed project slug do not exist and projects do not expose `media`.

- [ ] **Step 3: Add PixiJS and IBM Plex Mono with the Node 24 runtime**

Run: `npm install pixi.js@^8 @fontsource-variable/ibm-plex-mono@^5.3.0`

Expected: `package.json` and `package-lock.json` add only these two production dependencies.

- [ ] **Step 4: Define nested media and experiment schemas**

```ts
const aspectRatio = z.string().regex(/^\d+\s*\/\s*\d+$/);
const mediaSource = z.object({
  src: nonemptyString,
  type: z.enum(['video/mp4', 'video/webm']),
});
const projectMedia = ({ image }: { image: () => z.ZodTypeAny }) => z.object({
  id: nonemptyString,
  type: z.enum(['image', 'video', 'diagram']),
  intention: nonemptyString,
  aspectRatio,
  alt: nonemptyString,
  caption: nonemptyString,
  state: z.enum(['ready', 'placeholder']),
  image: image().optional(),
  poster: image().optional(),
  sources: z.array(mediaSource).default([]),
  externalUrl: httpsUrl.optional(),
}).superRefine((media, context) => {
  if (media.state === 'ready' && media.type === 'image' && !media.image) {
    context.addIssue({ code: 'custom', message: 'Ready image media requires image.' });
  }
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experiments' }),
  schema: ({ image }) => z.object({
    title: nonemptyString,
    order: positiveOrder,
    state: z.enum(['ready', 'placeholder']),
    year: nonemptyString.optional(),
    description: nonemptyString.optional(),
    technique: nonemptyString.optional(),
    tools: z.array(nonemptyString).default([]),
    processNotes: nonemptyString.optional(),
    sourceUrl: httpsUrl.optional(),
    poster: image().optional(),
    sources: z.array(mediaSource).default([]),
  }),
});
```

Add `media: z.array(projectMedia({ image })).min(1)` to projects and export all four collections.
Remove the legacy `videos` field from the project schema after every existing video is represented as a typed `media` record with `type: video` and `externalUrl`.

- [ ] **Step 5: Create the seven experiment records and remove Cellular Automata from Work**

Use this complete ready record for Cellular Automata:

```json
{
  "title": "Cellular Automata",
  "order": 1,
  "state": "ready",
  "description": "A browser-based generative study in which simple local rules accumulate into dense, branching forms.",
  "technique": "Cellular automata",
  "tools": ["JavaScript"],
  "sourceUrl": "https://codepen.io/amirbahadorrostami/pen/GRMQewe",
  "poster": "../../assets/projects/cellular-automata/cellular-automata-card.webp",
  "sources": []
}
```

Each remaining record contains only its approved title, order, `state: "placeholder"`, and empty `tools` and `sources` arrays. Delete the Cellular Automata project Markdown file.

- [ ] **Step 6: Rename the project directory and update query constants**

Run: `mv src/content/projects/remote-realities src/content/projects/ephemeral-pulses-of-a-finite-scroll`

Then set:

```ts
export const EXPECTED_PROJECT_SLUGS = [
  'encounters',
  'luminous-trails',
  'ephemeral-pulses-of-a-finite-scroll',
  'biowords',
  'person-is-a-data-structure',
] as const;

export const EXPECTED_EXPERIMENT_TITLES = [
  'Cellular Automata', 'Experiment 02', 'Experiment 03', 'Experiment 04',
  'Experiment 05', 'Experiment 06', 'Experiment 07',
] as const;
```

Implement `getPublishedExperiments()` with `sortByOrder(await getCollection('experiments'))` and make inventory mismatch errors name the missing or unexpected records.

- [ ] **Step 7: Add the minimum valid media arrays to all five project frontmatters**

Each entry must initially contain at least its current hero as a ready image and its approved missing-media frames as `state: placeholder`. Example:

```yaml
media:
  - id: pair-using-app
    type: image
    intention: Pair using the app
    aspectRatio: 16 / 9
    alt: Two Encounters participants using the mobile experience together
    caption: Participants begin Encounters by inviting someone nearby to take the walk with them.
    state: ready
    image: ../../../assets/projects/encounters/encounters-interaction.webp
  - id: system-architecture
    type: diagram
    intention: System architecture
    aspectRatio: 16 / 9
    alt: Diagram of the Encounters mobile and backend architecture
    caption: Architecture diagram planned for the final media pass.
    state: placeholder
```

- [ ] **Step 8: Run content tests and the Astro checker**

Run: `npm run test:unit -- tests/unit/content-contract.test.ts tests/unit/content.test.ts && npm run check`

Expected: PASS with five projects, seven experiments, valid nested media, and no Astro diagnostics.

- [ ] **Step 9: Commit the content foundation**

```bash
git add package.json package-lock.json src/content.config.ts src/lib/content.ts src/content/projects src/content/experiments tests/unit/content-contract.test.ts tests/unit/content.test.ts
git commit -m "feat: define portfolio content inventories"
```

---

### Task 2: Write the five truthful project records

**Files:**
- Modify: `src/content/projects/encounters/index.md`
- Modify: `src/content/projects/luminous-trails/index.md`
- Modify: `src/content/projects/ephemeral-pulses-of-a-finite-scroll/index.md`
- Modify: `src/content/projects/biowords/index.md`
- Modify: `src/content/projects/person-is-a-data-structure/index.md`
- Test: `tests/unit/content-contract.test.ts`

**Interfaces:**
- Consumes: the project schema and `media` records from Task 1.
- Produces: complete frontmatter and Markdown sections for `ProjectLayout`; exactly three `depth: flagship` and two `depth: short` records.

- [ ] **Step 1: Add failing attribution and copy tests**

```ts
it('records the approved project titles, roles, stacks, and contexts', async () => {
  const byId = Object.fromEntries((await getCollection('projects')).map((entry) => [entry.id, entry.data]));
  expect(byId['encounters'].roles).toEqual([
    'Co-creator', 'Technical Lead', 'Systems architect', 'Client and AR developer',
  ]);
  expect(byId['encounters'].tools).toEqual([
    'Unity', 'AR Foundation', 'ARKit', 'ARCore', 'Node.js', 'AWS',
  ]);
  expect(byId['luminous-trails'].roles).toContain('Lead Technical Architect');
  expect(byId['ephemeral-pulses-of-a-finite-scroll'].tools).toEqual(expect.arrayContaining([
    'Raspberry Pi', 'MPU-6050', 'Python', 'SuperCollider', 'Surface transducer',
  ]));
  expect(byId['biowords'].context).toContain('York University');
  expect(byId['person-is-a-data-structure'].context).toContain('Eleanor Winters Art Gallery');
  expect(JSON.stringify(byId['luminous-trails'])).not.toMatch(/mysql|postgres|mongodb/i);
});
```

- [ ] **Step 2: Run the content test and verify it fails on the old records**

Run: `npm run test:unit -- tests/unit/content-contract.test.ts`

Expected: FAIL because the current roles, tools, dates, titles, and credits are incomplete.

- [ ] **Step 3: Replace Encounters with the approved factual record**

Set year `2023`, context `Main app-based artistic experience commissioned for Congress 2023 at York University's Keele Campus`, creators Amir Bahador Rostami and Elahe Rostami, producer Artifacts Lab, the four tested roles, and the six tested tools. Write Markdown under `The invitation`, `My contribution`, `The system`, and `Public context`; explain pairing, wayfinding, avatars, shared bodies of water, conversation/silence/remembrance, Amir's full client and AR implementation, and the York source link without attendance claims.

- [ ] **Step 4: Replace Luminous Trails with the approved factual record**

Set year `2022`, context `Nuit Blanche Toronto 2022`, role `Lead Technical Architect`, client stack Unity/AR Foundation/ARKit/ARCore, backend stack Node.js/AWS, and credits Artifacts Studio Ltd., Roozbeh Moayyedian, Elahe Rostami, Amir Bahador Rostami, Can Baris Candan, and Emad Moradian. State exactly: Amir built the complete client application and AR interactions; Amir architected the backend and another team member implemented it. Do not name a database.

- [ ] **Step 5: Replace Ephemeral Pulses with the approved factual record**

Use title `Ephemeral Pulses of a Finite Scroll`, year `2020`, program `Remote Realities Themed Commission`, creators Amir Rostami and Elahe Rostami, presenters Trinity Square Video and Dames Making Games, supporter EQ Bank, and the complete hardware/software stack. Explain that wireless swing units sent accelerometer/gyroscope data to a master computer, which detected rhythmic and harmonic synchronization and triggered the additional chord-completing note.

- [ ] **Step 6: Replace BioWords with the approved factual record**

Use year `2019`, solo authorship, York University final project/exhibition, original `#biwords` Twitter interaction, local sentiment, word-shaped biomorph DNA, flocking/community/environmental survival, and the result returned to Twitter. Describe the production adaptation separately: direct local text input, PixiJS, no X dependency, no storage, and a result containing only original surviving words ordered by survival time and then remaining energy.

- [ ] **Step 7: Replace Person Is a Data Structure with the approved factual record**

Use year `2018`, venue `Eleanor Winters Art Gallery, York University`, context `Collaborative university installation`, original proposal title `Thank You For Your Face`, and final title `Person Is a Data Structure`. Name Amir as technical artist and systems developer; list Microsoft Azure Face API, Max/MSP, Processing, facial-data handling, and shared integration of cameras/displays/sensors/network/physical systems. Do not call the work solo and do not name unknown collaborators.

- [ ] **Step 8: Run content tests**

Run: `npm run test:unit -- tests/unit/content-contract.test.ts tests/unit/content.test.ts`

Expected: PASS, including factual attribution and the absence of an invented Luminous Trails database.

- [ ] **Step 9: Commit the editorial records**

```bash
git add src/content/projects tests/unit/content-contract.test.ts
git commit -m "content: finalize portfolio project narratives"
```

---

### Task 3: Add compatibility redirects and the five-project archive

**Files:**
- Create: `src/layouts/RedirectLayout.astro`
- Create: `src/pages/work/remote-realities/index.astro`
- Create: `src/pages/work/cellular-automata/index.astro`
- Modify: `src/pages/work/index.astro`
- Modify: `src/components/projects/ProjectGrid.astro`
- Modify: `src/components/projects/ProjectCard.astro`
- Delete: `src/components/projects/WorkFilters.astro`
- Modify: `src/config/site.ts`
- Test: `tests/unit/site-config.test.ts`
- Test: `tests/e2e/work-archive.spec.ts`
- Test: `tests/e2e/navigation.spec.ts`
- Create: `tests/e2e/redirects.spec.ts`

**Interfaces:**
- Consumes: `getPublishedProjects()` and the renamed project slug from Task 1.
- Produces: `/work/` with five cards; `/work/remote-realities/` redirecting to `/work/ephemeral-pulses-of-a-finite-scroll/`; `/work/cellular-automata/` redirecting to `/experiments/#cellular-automata`.

- [ ] **Step 1: Replace filter tests with archive and redirect tests**

```ts
const projectTitles = [
  'Encounters',
  'Luminous Trails',
  'Ephemeral Pulses of a Finite Scroll',
  'BioWords',
  'Person Is a Data Structure',
];

test('lists exactly the five approved work entries without filters', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('[data-project-card]')).toHaveCount(5);
  await expect(page.locator('[data-work-filter]')).toHaveCount(0);
  await expect(page.locator('[data-project-card] h2')).toHaveText(projectTitles);
});

for (const [source, target] of [
  ['/work/remote-realities/', '/work/ephemeral-pulses-of-a-finite-scroll/'],
  ['/work/cellular-automata/', '/experiments/#cellular-automata'],
] as const) {
  test(`${source} exposes a static compatibility redirect`, async ({ page }) => {
    await page.goto(source);
    await expect(page.locator('meta[http-equiv="refresh"]')).toHaveAttribute('content', `0;url=${target}`);
    await expect(page.getByRole('link', { name: /continue/i })).toHaveAttribute('href', target);
  });
}
```

- [ ] **Step 2: Run the browser tests and verify the six-card/filter behavior fails**

Run: `npm run test:e2e -- tests/e2e/work-archive.spec.ts tests/e2e/redirects.spec.ts tests/e2e/navigation.spec.ts`

Expected: FAIL because the archive still has filters and compatibility pages do not exist.

- [ ] **Step 3: Add Experiments to navigation and update the site title/description**

```ts
navigation: [
  { label: 'Work', href: '/work/' },
  { label: 'Experiments', href: '/experiments/' },
  { label: 'Music', href: '/music/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
],
```

Keep current public profile values; do not fabricate blank Spotify or Apple Music URLs.

- [ ] **Step 4: Build a reusable static redirect layout**

```astro
---
import BaseLayout from './BaseLayout.astro';
export interface Props { destination: string; label: string; }
const { destination, label } = Astro.props;
---
<BaseLayout title={`${label} | Amir Bahador Rostami`} canonicalPath={destination} robots="noindex, follow">
  <meta http-equiv="refresh" content={`0;url=${destination}`} slot="head" />
  <section class="container redirect-page">
    <h1>{label} has moved.</h1>
    <p><a href={destination}>Continue to the current page</a></p>
  </section>
</BaseLayout>
```

Add `head` slot and optional `robots` to `BaseLayout` in this task so the redirect is present in static HTML.

- [ ] **Step 5: Remove filtering and write the approved Work introduction**

Use heading `Things to enter, follow, swing, listen to, and occasionally get lost inside.` and introduction `Interactive installations, augmented worlds, living simulations, and the technical systems that make them possible.` Remove `getProjectCategories`, the filter component import, and all filter JavaScript.

- [ ] **Step 6: Render flagship and short cards with editorial numbering**

Add `data-depth`, a two-digit `01`–`05` index, year, role, and a direct case-study link. Use hard rectangular frames and keep the list semantic; no tags styled as pills.

- [ ] **Step 7: Run focused unit and browser tests**

Run: `npm run test:unit -- tests/unit/site-config.test.ts && npm run test:e2e -- tests/e2e/work-archive.spec.ts tests/e2e/redirects.spec.ts tests/e2e/navigation.spec.ts`

Expected: PASS with five cards, five nav items, no filters, and both compatibility targets.

- [ ] **Step 8: Commit routing and archive changes**

```bash
git add src/config/site.ts src/layouts src/pages/work src/components/projects tests/unit/site-config.test.ts tests/e2e/work-archive.spec.ts tests/e2e/navigation.spec.ts tests/e2e/redirects.spec.ts
git commit -m "feat: add work archive and compatibility routes"
```

---

### Task 4: Install the Darkroom visual foundation

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/layout/SiteHeader.astro`
- Modify: `src/components/layout/SiteFooter.astro`
- Modify: `src/layouts/DesignLabLayout.astro`
- Test: `tests/e2e/navigation.spec.ts`
- Test: `tests/e2e/accessibility.spec.ts`
- Test: `tests/e2e/metadata.spec.ts`

**Interfaces:**
- Consumes: `SITE.navigation`, optional `robots`, and the `head` slot from Task 3.
- Produces: shared `.container`, `.eyebrow`, `.chapter-label`, `.text-link`, `.button-link`, `.media-frame`, and `.reveal` primitives plus production colour/type tokens.

- [ ] **Step 1: Add failing visual-token and robots assertions**

```ts
test('production pages expose the Darkroom type and colour tokens', async ({ page }) => {
  await page.goto('/');
  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      signal: styles.getPropertyValue('--signal').trim(),
      display: styles.getPropertyValue('--font-display').trim(),
      mono: styles.getPropertyValue('--font-mono').trim(),
      radius: styles.getPropertyValue('--radius').trim(),
    };
  });
  expect(tokens.signal).toBe('#a71414');
  expect(tokens.display).toContain('Outfit Variable');
  expect(tokens.mono).toContain('IBM Plex Mono Variable');
  expect(tokens.radius).toBe('0px');
});

test('design lab routes remain noindexed and unlinked', async ({ page }) => {
  await page.goto('/design-lab/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await page.goto('/');
  await expect(page.getByRole('link', { name: /design lab/i })).toHaveCount(0);
});
```

- [ ] **Step 2: Run the tests and verify current teal/system-mono tokens fail**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts tests/e2e/metadata.spec.ts`

Expected: FAIL on signal colour, font family, square-edge token, and design-lab robots coverage.

- [ ] **Step 3: Import self-hosted fonts and set the page shell**

```astro
---
import '@fontsource-variable/outfit';
import '@fontsource-variable/ibm-plex-mono';
export interface Props {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  flushMain?: boolean;
  robots?: string;
}
const { robots = 'index, follow' } = Astro.props;
---
<meta name="robots" content={robots} />
<slot name="head" />
```

- [ ] **Step 4: Replace global tokens and primitives**

```css
:root {
  color-scheme: dark;
  --ink: #070707;
  --surface: #0d0d0d;
  --surface-raised: #151515;
  --paper: #f1ede4;
  --muted: #a7a199;
  --signal: #a71414;
  --signal-bright: #d12a22;
  --line: #34302c;
  --control-border: #777067;
  --focus: #fff0b3;
  --radius: 0px;
  --content: 88rem;
  --font-display: 'Outfit Variable', sans-serif;
  --font-mono: 'IBM Plex Mono Variable', monospace;
}
```

Create square buttons/frames, mono metadata, oversized display headings, asymmetric 12-column utilities, 44px control minimums, and a reduced-motion rule that shows `.reveal` content without transitions.

- [ ] **Step 5: Rebuild header and footer as a screening-room frame**

Keep the existing accessible mobile menu behavior. Render a compact `AMIR / ROSTAMI` wordmark, numbered nav labels `01`–`05`, a visible current-page signal line, Toronto, and public profile links. Use borders and spacing, not rounded containers or icons.

- [ ] **Step 6: Mark the design lab noindex through its layout**

Ensure every design-lab page receives `<meta name="robots" content="noindex, nofollow">` while production pages default to `index, follow`.

- [ ] **Step 7: Run navigation, metadata, and accessibility tests**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts tests/e2e/metadata.spec.ts tests/e2e/accessibility.spec.ts`

Expected: PASS with Darkroom tokens, keyboard menu behavior, current-page state, noindex lab pages, and no serious Axe violations.

- [ ] **Step 8: Commit the design system**

```bash
git add src/layouts src/styles/global.css src/components/layout tests/e2e/navigation.spec.ts tests/e2e/metadata.spec.ts tests/e2e/accessibility.spec.ts
git commit -m "feat: establish darkroom production design system"
```

---

### Task 5: Build data-driven cinematic project pages

**Files:**
- Create: `src/lib/project-media.ts`
- Modify: `src/layouts/ProjectLayout.astro`
- Modify: `src/components/projects/ProjectFacts.astro`
- Modify: `src/components/projects/ProjectMedia.astro`
- Modify: `src/components/projects/NextProject.astro`
- Modify: `src/components/interactive/LiveExperimentSlot.astro`
- Test: `tests/unit/project-media.test.ts`
- Test: `tests/unit/project-navigation.test.ts`
- Modify: `tests/e2e/project-pages.spec.ts`

**Interfaces:**
- Consumes: `project.data.media` from Task 1 and rendered Markdown from Task 2.
- Produces: `parseYouTubeUrl(url: string): { videoId: string } | undefined`; the `ProjectMedia` component contract `Props { project: CollectionEntry<'projects'> }`; numbered case-study chapters and labelled media placeholders.

- [ ] **Step 1: Write failing helper and component tests**

```ts
function projectWithMedia(
  media: CollectionEntry<'projects'>['data']['media'],
): CollectionEntry<'projects'> {
  return {
    id: 'media-test',
    collection: 'projects',
    data: {
      title: 'Media test',
      summary: 'A project used to verify media rendering.',
      cardSummary: 'A media rendering fixture.',
      depth: 'short',
      order: 1,
      featured: false,
      categories: ['test'],
      roles: ['Tester'],
      tools: ['Vitest'],
      hero: {} as ImageMetadata,
      heroAlt: 'Test hero',
      collaborators: [],
      credits: [],
      externalLinks: [],
      media,
      liveExperiment: false,
      outcomes: [],
      draft: false,
    },
  } as CollectionEntry<'projects'>;
}

it('parses only approved YouTube URLs', () => {
  expect(parseYouTubeUrl('https://www.youtube.com/embed/eJJue_cGV3E')).toEqual({ videoId: 'eJJue_cGV3E' });
  expect(parseYouTubeUrl('https://vimeo.com/123')).toBeUndefined();
  expect(parseYouTubeUrl('javascript:alert(1)')).toBeUndefined();
});

it('renders an intentional frame for missing documentary media', async () => {
  const placeholder = {
    id: 'system-architecture',
    type: 'diagram',
    intention: 'System architecture',
    aspectRatio: '16 / 9',
    alt: 'Diagram of the project architecture',
    caption: 'Architecture diagram planned for the final media pass.',
    state: 'placeholder',
    sources: [],
  } as const;
  const project = projectWithMedia([placeholder]);
  const container = await AstroContainer.create();
  const html = await container.renderToString(ProjectMedia, { props: { project } });
  expect(html).toContain('data-media-state="placeholder"');
  expect(html).toContain('System architecture');
  expect(html).toContain('16 / 9');
  expect(html).not.toContain('<img');
});
```

- [ ] **Step 2: Run focused tests and verify hard-coded media mapping fails**

Run: `npm run test:unit -- tests/unit/project-media.test.ts tests/unit/project-navigation.test.ts`

Expected: FAIL because `parseYouTubeUrl` is not exported and `ProjectMedia` does not read the content record.

- [ ] **Step 3: Implement safe project-media helpers**

```ts
export function parseYouTubeUrl(raw: string): { videoId: string } | undefined {
  let url: URL;
  try { url = new URL(raw); } catch { return undefined; }
  if (url.protocol !== 'https:') return undefined;
  const host = url.hostname.toLowerCase();
  const match = host === 'youtu.be'
    ? url.pathname.match(/^\/([\w-]{11})\/?$/)
    : url.pathname.match(/^\/(?:embed|watch)\/?([\w-]{11})?$/);
  const videoId = host === 'youtu.be' ? match?.[1] : url.searchParams.get('v') ?? match?.[1];
  return /^(?:www\.)?youtube(?:-nocookie)?\.com$/.test(host) || host === 'youtu.be'
    ? videoId && /^[\w-]{11}$/.test(videoId) ? { videoId } : undefined
    : undefined;
}
```

Keep unsupported HTTPS video URLs as outbound-only links with `noopener noreferrer`.

- [ ] **Step 4: Rebuild the project layout around numbered chapters**

Flagship order: `01 Premise`, `02 Experience`, `03 My contribution`, `04 Technical system`, `05 Process`, `06 Credits`, `07 Documentation`, then related work. Short projects omit empty chapters but preserve numbering and facts. Keep one visible `h1`, a one-sentence premise, year/context/roles/tools, and complete Markdown body in static HTML.

- [ ] **Step 5: Render content-owned media and truthful placeholders**

Ready images use Astro `Image`; ready video uses a poster-first `<video controls preload="none">` for local sources or a click-to-load YouTube facade for supported external URLs. Placeholder frames render project title, `intention`, type, ratio, caption, and status. Set CSS `aspect-ratio` from the validated string and use full-bleed alternating spans on desktop.

- [ ] **Step 6: Put BioWords only in its dedicated live-experiment slot**

Set BioWords `liveExperiment: true`; all other projects remain false. Render the slot after its project narrative and before related work, with no blank region for disabled projects.

- [ ] **Step 7: Update project-page browser assertions**

```ts
test('flagship pages expose narrative chapters and media states', async ({ page }) => {
  for (const slug of ['encounters', 'luminous-trails', 'ephemeral-pulses-of-a-finite-scroll']) {
    await page.goto(`/work/${slug}/`);
    await expect(page.locator('[data-case-study-chapter]')).toHaveCount(7);
    await expect(page.locator('[data-project-media]')).toHaveCount(1);
    await expect(page.locator('[data-media-state="placeholder"]')).not.toHaveCount(0);
  }
});
```

- [ ] **Step 8: Run project tests**

Run: `npm run test:unit -- tests/unit/project-media.test.ts tests/unit/project-navigation.test.ts && npm run test:e2e -- tests/e2e/project-pages.spec.ts`

Expected: PASS for five canonical projects, case-study depth, media fallbacks, safe embeds, and previous/next navigation.

- [ ] **Step 9: Commit the case-study system**

```bash
git add src/lib/project-media.ts src/layouts/ProjectLayout.astro src/components/projects src/components/interactive/LiveExperimentSlot.astro tests/unit/project-media.test.ts tests/unit/project-navigation.test.ts tests/e2e/project-pages.spec.ts
git commit -m "feat: build cinematic project case studies"
```

---

### Task 6: Recompose the homepage narrative and grids

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/home/Hero.astro`
- Modify: `src/components/home/SelectedWork.astro`
- Modify: `src/components/home/SelectedMusic.astro`
- Modify: `src/components/home/ExperiencePreview.astro`
- Create: `src/components/home/ExperimentsInvitation.astro`
- Modify: `src/components/home/ContactCallout.astro`
- Test: `tests/e2e/homepage.spec.ts`
- Test: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: three featured projects, three featured music records, and three featured experience records.
- Produces: section order `hero`, `selected-work`, `selected-music`, `experience`, `experiments-invitation`, `contact-invitation`.

- [ ] **Step 1: Update homepage tests to the approved copy and section order**

```ts
const sectionOrder = [
  'hero', 'selected-work', 'selected-music', 'experience',
  'experiments-invitation', 'contact-invitation',
];

test('homepage presents the approved Darkroom narrative', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Part engineer. Part musician. Entirely too curious.',
  );
  await expect(page.locator('#hero')).toContainText(
    'I design and build interactive systems, immersive artworks, and digital experiences that explore how technology can change the way people connect.',
  );
  expect(await page.locator('main > section').evaluateAll((sections) =>
    sections.map((section) => section.id),
  )).toEqual(sectionOrder);
});
```

Also assert CTA labels `See what I've been building` and `Work with me`, the renamed third flagship, a three-column project grid at 1440px, a three-column music grid at 1440px, and one column for both at 390px.

- [ ] **Step 2: Run the homepage tests and verify old copy/order fails**

Run: `npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/responsive.spec.ts`

Expected: FAIL on headline, copy, experiments section, renamed flagship, and music-grid desktop columns.

- [ ] **Step 3: Write the approved hero and CTA copy**

Use eyebrow `Creative technologist / musician / nerd`, headline `Part engineer. Part musician. Entirely too curious.`, the approved supporting statement, Toronto/availability facts, and links to `#selected-work` and `/contact/` with the approved CTA labels. Keep all text above the interactive canvas in source order.

- [ ] **Step 4: Build the three-project cinematic grid**

Use `Things to enter, follow, swing, listen to, and occasionally get lost inside.` as the section heading and the approved Work introduction. Render exactly Encounters, Luminous Trails, and Ephemeral Pulses; use asymmetric spans while preserving a three-column computed grid and natural wrapping.

- [ ] **Step 5: Build the three-track Baha listening grid**

Keep Float, Flow, and La Paloma in that order. Render three equal grid cells on desktop, one column on mobile, outbound links, and a separate text gateway to `/music/`; do not render a fourth pseudo-card.

- [ ] **Step 6: Add experience, experiments, and contact invitations**

Keep three featured experience entries. Add an Experiments section with heading `Small systems making big, strange pictures.` and link `/experiments/`. Use contact heading `Have a role, a commission, or a strange problem worth solving?`, approved opportunity copy, and link label `Send the signal`.

- [ ] **Step 7: Run homepage and responsive tests**

Run: `npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/responsive.spec.ts`

Expected: PASS for six-section narrative order, exact inventories, grid geometry, first-viewport actions, and 320px overflow.

- [ ] **Step 8: Commit the homepage composition**

```bash
git add src/pages/index.astro src/components/home tests/e2e/homepage.spec.ts tests/e2e/responsive.spec.ts
git commit -m "feat: compose darkroom portfolio homepage"
```

---

### Task 7: Replace the hero background with a resilient PixiJS 10 PRINT field

**Files:**
- Create: `src/lib/ten-print.ts`
- Create: `src/components/interactive/TenPrintField.astro`
- Create: `public/media/ten-print-fallback.svg`
- Modify: `src/components/home/Hero.astro`
- Delete: `src/components/interactive/SignalField.astro`
- Create: `tests/unit/ten-print.test.ts`
- Modify: `tests/e2e/homepage.spec.ts`
- Modify: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: hero mount dimensions, `prefers-reduced-motion`, `document.visibilityState`, and `IntersectionObserver`.
- Produces: `mulberry32(seed: number): () => number`; `createTenPrintCells(options: { width: number; height: number; cellSize: number; seed: number; probability?: number }): TenPrintCell[]`; `[data-ten-print]` states `fallback`, `ready`, `paused`, or `error`.

- [ ] **Step 1: Write deterministic geometry tests**

```ts
it('creates deterministic cells that cover the viewport', () => {
  const options = { width: 320, height: 180, cellSize: 40, seed: 42, probability: 0.5 };
  const first = createTenPrintCells(options);
  const second = createTenPrintCells(options);
  expect(first).toEqual(second);
  expect(first).toHaveLength(8 * 5);
  expect(first.every(({ direction, alpha }) =>
    (direction === 'forward' || direction === 'backward') && alpha >= 0.24 && alpha <= 0.84,
  )).toBe(true);
});

it('caps invalid probabilities and rejects non-positive dimensions', () => {
  expect(() => createTenPrintCells({ width: 0, height: 20, cellSize: 10, seed: 1 })).toThrow();
  expect(createTenPrintCells({ width: 20, height: 20, cellSize: 10, seed: 1, probability: 9 }))
    .toHaveLength(4);
});
```

- [ ] **Step 2: Run unit tests and verify the module is missing**

Run: `npm run test:unit -- tests/unit/ten-print.test.ts`

Expected: FAIL because `src/lib/ten-print.ts` does not exist.

- [ ] **Step 3: Implement pure seeded grid geometry**

```ts
export interface TenPrintCell {
  x: number;
  y: number;
  size: number;
  direction: 'forward' | 'backward';
  alpha: number;
  tone: number;
}

export function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
```

Generate `ceil(width / cellSize) * ceil(height / cellSize)` cells, clamp probability to 0–1, and derive direction, alpha, and deep-red tone from the seeded generator.

- [ ] **Step 4: Build an HTML-first field with static SVG fallback**

`TenPrintField.astro` must render the fallback `<img src="/media/ten-print-fallback.svg" alt="" aria-hidden="true">` before its canvas mount. The mount remains decorative, starts at `data-render-state="fallback"`, and keeps the image visible unless Pixi initializes successfully.

- [ ] **Step 5: Progressively initialize PixiJS and draw once**

```ts
const { Application, Graphics } = await import('pixi.js');
const app = new Application();
await app.init({
  backgroundAlpha: 0,
  antialias: true,
  autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  resizeTo: mount,
});
app.ticker.stop();
```

Draw all cells into one `Graphics` object, render once, regenerate after a debounced resize, skip resize work while offscreen/hidden, destroy the application on `astro:before-swap`, and catch initialization failures by setting `data-render-state="error"` while retaining the SVG.

- [ ] **Step 6: Add lifecycle and fallback browser tests**

```ts
test('TenPrint keeps static art without JavaScript and pauses offscreen', async ({ browser, page }) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto('/');
  await expect(noJsPage.locator('[data-ten-print] img')).toBeVisible();
  await noJs.close();

  await page.goto('/');
  await expect(page.locator('[data-ten-print]')).toHaveAttribute('data-render-state', 'ready');
  await page.locator('#contact-invitation').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-ten-print]')).toHaveAttribute('data-render-state', 'paused');
});
```

Reduced motion must set a complete static `ready` field without progressive drawing.

- [ ] **Step 7: Run hero tests**

Run: `npm run test:unit -- tests/unit/ten-print.test.ts && npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/navigation.spec.ts`

Expected: PASS for deterministic geometry, JS-disabled fallback, reduced motion, offscreen pause, and hero content visibility.

- [ ] **Step 8: Commit the PixiJS hero**

```bash
git add src/lib/ten-print.ts src/components/interactive src/components/home/Hero.astro public/media/ten-print-fallback.svg tests/unit/ten-print.test.ts tests/e2e/homepage.spec.ts tests/e2e/navigation.spec.ts
git commit -m "feat: add pixi ten print hero"
```

---

### Task 8: Build the seven-entry Experiments screening room

**Files:**
- Create: `src/lib/experiments.ts`
- Create: `src/components/experiments/ExperimentCard.astro`
- Create: `src/components/experiments/ExperimentGrid.astro`
- Create: `src/pages/experiments.astro`
- Create: `tests/unit/experiments.test.ts`
- Create: `tests/e2e/experiments.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: `getPublishedExperiments()` and experiment schema from Task 1.
- Produces: `experimentAnchor(title: string): string`; a seven-entry grid; poster-first ready video; explicit neutral placeholder frames.

- [ ] **Step 1: Write failing inventory and fallback tests**

```ts
it('creates stable lower-case anchors', () => {
  expect(experimentAnchor('Cellular Automata')).toBe('cellular-automata');
  expect(experimentAnchor('Experiment 02')).toBe('experiment-02');
});

test('renders exactly seven experiments without invented metadata', async ({ page }) => {
  await page.goto('/experiments/');
  const cards = page.locator('[data-experiment-card]');
  await expect(cards).toHaveCount(7);
  await expect(cards.locator('h2')).toHaveText([
    'Cellular Automata', 'Experiment 02', 'Experiment 03', 'Experiment 04',
    'Experiment 05', 'Experiment 06', 'Experiment 07',
  ]);
  await expect(cards.locator('[data-experiment-state="placeholder"]')).toHaveCount(6);
  await expect(page.locator('video[autoplay]')).toHaveCount(0);
});
```

- [ ] **Step 2: Run the tests and verify the route/module is missing**

Run: `npm run test:unit -- tests/unit/experiments.test.ts && npm run test:e2e -- tests/e2e/experiments.spec.ts`

Expected: FAIL because `/experiments/` and `experimentAnchor` do not exist.

- [ ] **Step 3: Implement stable anchors and safe video-source selection**

```ts
export const experimentAnchor = (title: string) => title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const hasPlayableSources = (sources: { src: string; type: string }[]) =>
  sources.some(({ src, type }) => src.startsWith('/') && /^video\/(mp4|webm)$/.test(type));
```

- [ ] **Step 4: Render ready and placeholder studies without fabricated details**

Ready entries show poster, technique/tools only when present, a `<video controls preload="none" playsinline>` only when local sources exist, and an outbound source link when present. Placeholder entries show two-digit sequence, title, `Video study`, preferred `16 / 9`, and `Media pending`; they must not render a description, year, technique, or tools.

- [ ] **Step 5: Write the approved archive introduction and responsive grid**

Use heading `Small systems making big, strange pictures.` and the approved description. Use a two-column asymmetric screening grid above 48rem and one column below it, hard frames, mono numbering, and no scrolling strip. Set the Cellular Automata card id to `cellular-automata` for the compatibility redirect.

- [ ] **Step 6: Add the route to accessibility and overflow matrices**

Audit `/experiments/` at 320, 390, 768, and 1440 CSS pixels. Under reduced motion, posters stay visible and no video begins playback.

- [ ] **Step 7: Run experiment, accessibility, and responsive tests**

Run: `npm run test:unit -- tests/unit/experiments.test.ts && npm run test:e2e -- tests/e2e/experiments.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts`

Expected: PASS with seven studies, six neutral pending frames, a stable Cellular Automata anchor, no autoplay, no serious Axe violations, and no overflow.

- [ ] **Step 8: Commit the Experiments archive**

```bash
git add src/lib/experiments.ts src/components/experiments src/pages/experiments.astro tests/unit/experiments.test.ts tests/e2e/experiments.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts
git commit -m "feat: add generative experiments archive"
```

---

### Task 9: Restyle Music as Baha's listening archive

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/pages/music.astro`
- Modify: `src/components/music/MusicGrid.astro`
- Modify: `src/components/music/MusicCard.astro`
- Modify: `src/lib/music-embed.ts`
- Modify: `tests/unit/music-card.test.ts`
- Modify: `tests/unit/music-embed.test.ts`
- Modify: `tests/e2e/music.spec.ts`

**Interfaces:**
- Consumes: seven existing music records and optional public profile URLs.
- Produces: ordered profile labels `SoundCloud`, `Spotify`, `Apple Music`; click-to-load privacy facades; seven square-edged track cells.

- [ ] **Step 1: Add failing Baha copy, profile-order, and no-autoplay tests**

```ts
test('presents all seven releases as Music by Baha', async ({ page }) => {
  await page.goto('/music/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Music by Baha');
  await expect(page.locator('.music-archive__intro')).toHaveText(
    'Baha is the musical project of Amir Bahador Rostami—a place where electronic and acoustic instruments drift into the same orbit, forming spacey textures, vibrant colours, and sweet harmonies across big landscapes.',
  );
  await expect(page.locator('[data-music-card]')).toHaveCount(7);
  await expect(page.locator('iframe')).toHaveCount(0);
});
```

Unit tests must verify generated Spotify and SoundCloud embed URLs contain no autoplay parameter and unsupported/invalid URLs stay outbound-only.

- [ ] **Step 2: Run music tests and verify the old page title/copy fails**

Run: `npm run test:unit -- tests/unit/music-card.test.ts tests/unit/music-embed.test.ts && npm run test:e2e -- tests/e2e/music.spec.ts`

Expected: FAIL on `Music by Baha`, approved biography, and platform contract.

- [ ] **Step 3: Add optional Apple Music profile configuration**

Add `appleMusicUrl: ''` to `SITE`. Render only configured URLs, but always preserve this label order: SoundCloud, Spotify, Apple Music. Empty URLs produce no dead anchors.

- [ ] **Step 4: Rebuild the page and cards in the Darkroom visual language**

Use the approved heading and biography, keep `Featured tracks` and `More music`, number tracks `01`–`07`, remove rounded surfaces, and use a three/two/one-column responsive grid. Each card keeps its outbound listening link even after a player loads.

- [ ] **Step 5: Preserve explicit player activation and privacy**

The only iframe creation path remains a user click. Keep `loading="lazy"`, `referrerPolicy="no-referrer"`, no autoplay permissions, and SoundCloud/Spotify host allowlists. Rename `Load private player` only if the test asserts an equally explicit action such as `Load player`.

- [ ] **Step 6: Run music tests**

Run: `npm run test:unit -- tests/unit/music-card.test.ts tests/unit/music-embed.test.ts && npm run test:e2e -- tests/e2e/music.spec.ts`

Expected: PASS with seven tracks, exact Baha copy, profile order, no initial iframe, and no autoplay.

- [ ] **Step 7: Commit the Baha archive**

```bash
git add src/config/site.ts src/pages/music.astro src/components/music src/lib/music-embed.ts tests/unit/music-card.test.ts tests/unit/music-embed.test.ts tests/e2e/music.spec.ts
git commit -m "feat: present music under the Baha alias"
```

---

### Task 10: Finalize About, timeline, and Contact

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/components/timeline/Timeline.astro`
- Modify: `src/components/timeline/TimelineEntry.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/components/contact/ContactForm.astro`
- Modify: `src/components/home/ContactCallout.astro`
- Modify: `tests/e2e/about.spec.ts`
- Modify: `tests/e2e/contact.spec.ts`
- Modify: `tests/e2e/contact-fallback.spec.ts`

**Interfaces:**
- Consumes: thirteen ordered experience entries, `SITE.linkedInUrl`, `PUBLIC_CONTACT_FORM_ENDPOINT`, and current contact validation helpers.
- Produces: approved About biography, numbered thirteen-stop timeline, and the same contact state machine with approved labels/copy.

- [ ] **Step 1: Update failing About and Contact copy tests**

```ts
test('about uses the approved pulse biography', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'I build systems with a pulse: software that remembers where people have walked, sculptures that listen to movement, and small virtual organisms born from language.',
  );
  await expect(page.locator('[data-about-biography]')).toContainText(
    "My name is Amir. I'm an engineer, artist, musician, and persistent tinkerer working in Toronto.",
  );
  await expect(page.locator('[data-timeline-entry]')).toHaveCount(13);
});

test('contact invites the approved opportunity set', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Have a role, a commission, or a strange problem worth solving?',
  );
  await expect(page.getByRole('button', { name: 'Send the signal' })).toBeVisible();
});
```

- [ ] **Step 2: Run About and Contact suites and verify old copy fails**

Run: `npm run test:e2e -- tests/e2e/about.spec.ts tests/e2e/contact.spec.ts tests/e2e/contact-fallback.spec.ts`

Expected: FAIL on headings, biography, and submit label while existing state-machine tests continue to describe required behavior.

- [ ] **Step 3: Recompose About with approved text and a numbered timeline**

Use the complete approved two-paragraph About copy, the existing portrait and résumé, timeline heading `A trail through systems, studios, labs, and classrooms.`, and the approved thirteen-stop introduction. Add two-digit entry numbers while keeping the ordered list, period, organization, role, summary, education, and skills content.

- [ ] **Step 4: Recompose Contact without changing transport behavior**

Use the approved heading and opportunity paragraph. Change the primary configured submit label to `Send the signal`; keep sending, success, failure, retry, validation, honeypot, and unconfigured behavior. When configured, show a secondary `Find me on LinkedIn` only if `SITE.linkedInUrl` exists; when unconfigured, the LinkedIn link is the visible fallback.

- [ ] **Step 5: Keep privacy assertions on every public path**

Retain tests that page HTML and the public résumé contain no email/phone. Add the homepage contact callout and About page to the same privacy assertion without printing the matching private value in test output.

- [ ] **Step 6: Run About and both Contact configurations**

Run: `npm run test:e2e -- tests/e2e/about.spec.ts tests/e2e/contact.spec.ts && npm run test:e2e:contact-fallback`

Expected: PASS for thirteen entries, portrait geometry, résumé privacy, configured contact states, and unconfigured LinkedIn fallback.

- [ ] **Step 7: Commit About and Contact**

```bash
git add src/pages/about.astro src/pages/contact.astro src/components/timeline src/components/contact/ContactForm.astro src/components/home/ContactCallout.astro tests/e2e/about.spec.ts tests/e2e/contact.spec.ts tests/e2e/contact-fallback.spec.ts
git commit -m "feat: finalize about timeline and contact paths"
```

---

### Task 11: Build the deterministic BioWords simulation core

**Files:**
- Create: `src/lib/biowords/model.ts`
- Create: `src/lib/biowords/sentiment.ts`
- Create: `tests/unit/biowords-model.test.ts`
- Create: `tests/unit/biowords-sentiment.test.ts`

**Interfaces:**
- Consumes: raw visitor text up to 280 UTF-16 code units and a numeric seed.
- Produces: `tokenizeOriginalWords(input: string): string[]`; `scoreSentiment(words: string[]): number`; `createSimulation(input: string, seed: number): SimulationState`; `stepSimulation(state: SimulationState, deltaMs: number): SimulationState`; `runToCompletion(state: SimulationState): SimulationState`; `survivorSentence(state: SimulationState): string`.

- [ ] **Step 1: Write tokenization, determinism, and survivor-order tests**

```ts
it('keeps only original word tokens and preserves spelling', () => {
  expect(tokenizeOriginalWords("Hello, strange world—hello!")).toEqual([
    'Hello', 'strange', 'world', 'hello',
  ]);
});

it('creates deterministic genomes and movement from a seed', () => {
  expect(createSimulation('soft machines remember us', 17))
    .toEqual(createSimulation('soft machines remember us', 17));
});

it('orders surviving originals by survival time then remaining energy', () => {
  const creature = (
    word: string, alive: boolean, survivalMs: number, energy: number,
  ): BioWordCreature => ({
    id: word,
    word,
    genome: [0.5],
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    energy,
    survivalMs,
    community: 1,
    alive,
  });
  const state: SimulationState = {
    seed: 1,
    sentiment: 0,
    elapsedMs: 1400,
    status: 'complete',
    creatures: [
      creature('second', true, 900, 80),
      creature('first', true, 1200, 10),
      creature('third', true, 900, 20),
      creature('gone', false, 1400, 0),
    ],
  };
  expect(survivorSentence(state)).toBe('first second third');
});
```

- [ ] **Step 2: Write lifecycle and bounds tests**

```ts
it('finishes with one stable community or the 30 second safety limit', () => {
  const result = runToCompletion(createSimulation('we gather around a quiet signal', 9));
  expect(result.status).toBe('complete');
  expect(result.elapsedMs).toBeLessThanOrEqual(30_000);
  expect(result.creatures.some(({ alive }) => alive)).toBe(true);
});

it('rejects empty input and input above 280 characters', () => {
  expect(() => createSimulation('   ', 1)).toThrow('Enter at least one word.');
  expect(() => createSimulation('x'.repeat(281), 1)).toThrow('Keep the text to 280 characters.');
});
```

- [ ] **Step 3: Run unit tests and verify modules are missing**

Run: `npm run test:unit -- tests/unit/biowords-model.test.ts tests/unit/biowords-sentiment.test.ts`

Expected: FAIL because the BioWords model does not exist.

- [ ] **Step 4: Implement a small local sentiment lexicon**

Export immutable positive and negative word sets and calculate a clamped `-1..1` score from matched original tokens. Tests must cover positive, negative, mixed, unknown, case-insensitive, and zero-match input. No external request or storage API is allowed.

- [ ] **Step 5: Implement typed state and letter-derived genomes**

```ts
export interface BioWordCreature {
  id: string;
  word: string;
  genome: number[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  survivalMs: number;
  community: number;
  alive: boolean;
}

export interface SimulationState {
  seed: number;
  sentiment: number;
  elapsedMs: number;
  status: 'ready' | 'running' | 'paused' | 'complete';
  creatures: BioWordCreature[];
}
```

Derive normalized genome values from Unicode code points; never replace `word` with generated text.

- [ ] **Step 6: Implement bounded flocking, energy, selection, and completion**

For each fixed 50ms step, apply separation, alignment, cohesion, boundary steering, compatibility energy gain, isolation/environment energy drain, and death at zero. Clamp velocity/position/energy. Complete when one non-empty stable community persists for 2 seconds or at 30 seconds; if all creatures would die, retain the highest-survival creature so the result is never fabricated or empty.

- [ ] **Step 7: Run BioWords model tests**

Run: `npm run test:unit -- tests/unit/biowords-model.test.ts tests/unit/biowords-sentiment.test.ts`

Expected: PASS for tokenization, sentiment, genome derivation, deterministic stepping, lifecycle limit, and survivor ordering.

- [ ] **Step 8: Commit the simulation core**

```bash
git add src/lib/biowords tests/unit/biowords-model.test.ts tests/unit/biowords-sentiment.test.ts
git commit -m "feat: model the biowords lifecycle"
```

---

### Task 12: Add the accessible PixiJS BioWords experience

**Files:**
- Create: `src/lib/biowords/renderer.ts`
- Create: `src/lib/biowords/controller.ts`
- Create: `src/components/interactive/BioWordsExperience.astro`
- Modify: `src/pages/work/[...slug].astro`
- Modify: `src/layouts/ProjectLayout.astro`
- Create: `tests/unit/biowords-controller.test.ts`
- Create: `tests/e2e/biowords.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: Task 11 model functions and BioWords page slot.
- Produces: `createBioWordsController(options: { input: string; seed: number }): BioWordsController`; `mountBioWords(root: HTMLElement): () => void`; HTML controls `input`, `begin`, `pause`, `resume`, `restart`, `skip`; live status/result; Pixi renderer with `render(state)`, `resize(width, height)`, and `destroy()`.

- [ ] **Step 1: Write controller state-transition tests**

```ts
it('supports begin, pause, resume, restart, and skip without network or storage', () => {
  const controller = createBioWordsController({ input: 'signals gather softly', seed: 4 });
  controller.begin();
  expect(controller.snapshot().status).toBe('running');
  controller.pause();
  expect(controller.snapshot().status).toBe('paused');
  controller.resume();
  expect(controller.snapshot().status).toBe('running');
  controller.skip();
  expect(controller.snapshot().status).toBe('complete');
  expect(controller.result().split(' ').every((word) =>
    ['signals', 'gather', 'softly'].includes(word),
  )).toBe(true);
  controller.restart();
  expect(controller.snapshot().status).toBe('ready');
});
```

- [ ] **Step 2: Write browser tests for labels, live results, reduced motion, and privacy**

```ts
test('BioWords runs from accessible controls and announces only original survivors', async ({ page }) => {
  await page.goto('/work/biowords/');
  await page.getByLabel('Words for the ecosystem').fill('bright little signals gather');
  await page.getByRole('button', { name: 'Begin' }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  const result = (await page.locator('[data-biowords-result]').innerText()).trim().split(/\s+/);
  expect(result.every((word) => ['bright', 'little', 'signals', 'gather'].includes(word))).toBe(true);
});

test('reduced motion exposes immediate completion and no continuous ticker', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/biowords/');
  await expect(page.locator('[data-biowords]')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.getByRole('button', { name: 'Skip to Result' })).toBeVisible();
});
```

Intercept all requests during interaction and assert there is no request caused by input, begin, stepping, or completion.

- [ ] **Step 3: Run the focused tests and verify the controller/UI is missing**

Run: `npm run test:unit -- tests/unit/biowords-controller.test.ts && npm run test:e2e -- tests/e2e/biowords.spec.ts`

Expected: FAIL because the controller and live experience do not exist.

- [ ] **Step 4: Implement the renderer as a drawing-only adapter**

```ts
export interface BioWordsRenderer {
  render(state: SimulationState): void;
  resize(width: number, height: number): void;
  destroy(): void;
}

export async function createBioWordsRenderer(
  mount: HTMLElement,
): Promise<BioWordsRenderer> {
  const { Application, Container, Graphics, Text } = await import('pixi.js');
  // Initialize with capped DPR, create one container per creature, and expose only render/resize/destroy.
}
```

The renderer must not import sentiment or decide which creature lives. Cap DPR at 2, pause animation on hidden/offscreen states, and leave the HTML controls/status/results intact if Pixi initialization fails.

- [ ] **Step 5: Implement the controller with fixed-step timing**

```ts
export interface BioWordsController {
  begin(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  skip(): void;
  snapshot(): SimulationState;
  result(): string;
  destroy(): void;
}

export function createBioWordsController(
  options: { input: string; seed: number },
): BioWordsController {
  let state = createSimulation(options.input, options.seed);
  let destroyed = false;
  const assertActive = () => {
    if (destroyed) throw new Error('BioWords controller has been destroyed.');
  };

  return {
    begin() { assertActive(); state = { ...state, status: 'running' }; },
    pause() { assertActive(); state = { ...state, status: 'paused' }; },
    resume() { assertActive(); state = { ...state, status: 'running' }; },
    restart() { assertActive(); state = createSimulation(options.input, options.seed); },
    skip() { assertActive(); state = runToCompletion(state); },
    snapshot() { assertActive(); return structuredClone(state); },
    result() { assertActive(); return survivorSentence(state); },
    destroy() { destroyed = true; },
  };
}
```

Use `requestAnimationFrame` only in full-motion running state, accumulate time into 50ms model steps, stop at complete/paused/hidden, and render after each step. In reduced motion, advance in 500ms steps only after explicit interaction; `Skip to Result` calls `runToCompletion` synchronously. Return a cleanup function that cancels frames, observers, and the renderer.

- [ ] **Step 6: Render the complete accessible experience on BioWords only**

Use a labelled textarea with `maxlength="280"`, live character count, buttons Begin/Pause/Resume/Restart/Skip to Result, a `role="status" aria-live="polite"` lifecycle message, and a separate result with `aria-live="polite"`. Default copy must explain that text stays in the browser and that only surviving original words return.

- [ ] **Step 7: Wire the dynamic project route slot**

In `[...slug].astro`, render `<BioWordsExperience slot="live-experiment" />` only when `project.id === 'biowords'`. No PixiJS import or BioWords markup may be emitted on the other four project pages.

- [ ] **Step 8: Run BioWords, accessibility, and responsive tests**

Run: `npm run test:unit -- tests/unit/biowords-controller.test.ts tests/unit/biowords-model.test.ts && npm run test:e2e -- tests/e2e/biowords.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts`

Expected: PASS for every control, original-word-only results, local-only execution, fallback behavior, reduced motion, Axe, and 320px layout.

- [ ] **Step 9: Commit BioWords**

```bash
git add src/lib/biowords src/components/interactive/BioWordsExperience.astro 'src/pages/work/[...slug].astro' src/layouts/ProjectLayout.astro tests/unit/biowords-controller.test.ts tests/e2e/biowords.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts
git commit -m "feat: add accessible pixi biowords experience"
```

---

### Task 13: Harden metadata, 404 recovery, privacy, and route-level performance

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/404.astro`
- Modify: `astro.config.mjs`
- Modify: `tests/e2e/metadata.spec.ts`
- Create: `tests/e2e/privacy.spec.ts`
- Create: `tests/e2e/performance-contract.spec.ts`
- Modify: `tests/unit/github-pages-deployment.test.ts`

**Interfaces:**
- Consumes: all final production routes and built `dist` assets.
- Produces: route-specific canonical/social metadata, a Darkroom 404, private-safe static output, and a bundle contract that keeps PixiJS off unrelated pages.

- [ ] **Step 1: Add failing route, privacy, and bundle assertions**

```ts
const productionRoutes = [
  '/', '/work/', '/work/encounters/', '/work/luminous-trails/',
  '/work/ephemeral-pulses-of-a-finite-scroll/', '/work/biowords/',
  '/work/person-is-a-data-structure/', '/experiments/', '/music/', '/about/', '/contact/',
];

for (const route of productionRoutes) {
  test(`${route} has canonical and social metadata`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
  });
}

test('unrelated routes do not request a PixiJS chunk', async ({ page }) => {
  for (const route of ['/work/', '/music/', '/about/', '/contact/']) {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(route);
    expect(requests.some((url) => /pixi|webgl/i.test(url))).toBe(false);
  }
});
```

Scan built HTML/PDF-visible text for email/phone patterns and scan HTML/JS for `localStorage`, `sessionStorage`, and BioWords fetch endpoints.

- [ ] **Step 2: Run build and focused tests to expose remaining gaps**

Run: `npm run build && npm run test:e2e -- tests/e2e/metadata.spec.ts tests/e2e/privacy.spec.ts tests/e2e/performance-contract.spec.ts`

Expected: FAIL until new routes have tailored descriptions, the 404 is updated, and route-level Pixi/privacy assertions are satisfied.

- [ ] **Step 3: Complete metadata and 404 copy**

Provide explicit title/description/canonical values for Work, Experiments, Music, About, Contact, and every project. Keep absolute Open Graph image URLs. Rebuild 404 with heading `That signal went somewhere else.`, links to Work, Experiments, Music, and Contact, and no JavaScript dependency.

- [ ] **Step 4: Verify static sitemap and GitHub Pages paths**

Assert `dist/sitemap-0.xml` contains canonical production routes and the renamed project; exclude compatibility redirects and design-lab pages from indexed sitemap output by using the sitemap filter in `astro.config.mjs`.

- [ ] **Step 5: Verify route-level Pixi isolation**

Inspect built page module references as well as network requests: homepage may load the TenPrint chunk, BioWords may load the BioWords/Pixi chunk, and `/work/`, `/experiments/`, `/music/`, `/about/`, `/contact/`, and non-BioWords projects must not request either.

- [ ] **Step 6: Run metadata, deployment, privacy, and performance checks**

Run: `npm run test:unit -- tests/unit/github-pages-deployment.test.ts && npm run build && npm run test:e2e -- tests/e2e/metadata.spec.ts tests/e2e/privacy.spec.ts tests/e2e/performance-contract.spec.ts`

Expected: PASS for static routes, sitemap policy, metadata, 404 recovery, private-safe output, and route-scoped PixiJS.

- [ ] **Step 7: Commit release hardening**

```bash
git add src/layouts/BaseLayout.astro src/pages/404.astro astro.config.mjs tests/e2e/metadata.spec.ts tests/e2e/privacy.spec.ts tests/e2e/performance-contract.spec.ts tests/unit/github-pages-deployment.test.ts
git commit -m "test: harden portfolio metadata privacy and bundles"
```

---

### Task 14: Run the complete release gate and update living documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-08-31-personal-portfolio-design.md`
- Modify: `docs/superpowers/specs/2026-09-21-darkroom-portfolio-redesign-design.md`
- Modify: `README.md`
- Test: all `tests/unit/**/*.test.ts`
- Test: all `tests/e2e/**/*.spec.ts`

**Interfaces:**
- Consumes: the complete production build from Tasks 1–13.
- Produces: verified release documentation, a clean branch, and a reproducible media-pass checklist.

- [ ] **Step 1: Run the complete automated suite from a clean build**

Run: `npm test`

Expected: all unit tests pass; `astro check` reports 0 errors, 0 warnings, and 0 hints; all static pages build; all Playwright projects pass; the unconfigured-contact suite passes.

- [ ] **Step 2: Run explicit artifact audits**

Run: `rg -n -i 'TODO|TBD|amir[^< ]*@|\+?1?[ .()-]*[0-9]{3}[ .()-]*[0-9]{3}[ .-]*[0-9]{4}' dist src --glob '!src/design-lab/**'`

Expected: no unfinished markers, public email address, or phone-number-shaped text in production source/output. Intentional labels `Experiment 02` through `Experiment 07` and `state: placeholder` are valid content, not unfinished implementation.

- [ ] **Step 3: Inspect representative pages at four widths**

Use Playwright screenshots or the local browser for `/`, `/work/`, one flagship, `/work/biowords/`, `/experiments/`, `/music/`, `/about/`, and `/contact/` at 320×568, 390×844, 768×1024, and 1440×900. Verify readable hierarchy, single-column mobile sequence, visible focus, complete placeholder labels, no clipped headings, and no horizontal scroll.

- [ ] **Step 4: Update the living portfolio document**

Mark Darkroom Cinema as the chosen production direction. Record the implemented routes, exact Work/Experiments counts, Baha alias, hero/BioWords Pixi architecture, redirects, contact endpoint behavior, tests, and the remaining owner-supplied media/profile URLs listed in the approved spec.

- [ ] **Step 5: Update README setup and deployment instructions**

Document Node 24, `npm install`, `npm run dev`, `npm test`, `PUBLIC_CONTACT_FORM_ENDPOINT`, GitHub Pages static deployment, content locations, project-media record shape, experiment readiness states, and how the final media pass replaces an intentional missing-media frame without changing templates.

- [ ] **Step 6: Mark the approved spec implemented only after verification**

Change the detailed spec status to `Implemented and verified` and record the Task 13 implementation commit SHA after the release gate passes. If any release-gate assertion fails, leave the status as `Approved for implementation planning` and record the failing command in the living document.

- [ ] **Step 7: Confirm branch scope and cleanliness**

Run: `git status --short --branch && git diff --check && git log --oneline --decorate -15`

Expected: no unstaged or untracked production work, no whitespace errors, and one reviewable commit per task on `codex/darkroom-portfolio`.

- [ ] **Step 8: Commit verified documentation**

```bash
git add README.md docs/superpowers/specs/2026-08-31-personal-portfolio-design.md docs/superpowers/specs/2026-09-21-darkroom-portfolio-redesign-design.md
git commit -m "docs: record verified darkroom portfolio release"
```

## Final Acceptance Checklist

- [ ] Five Work entries and seven Experiments entries render in approved order.
- [ ] Three flagship projects have full case studies; BioWords and Person Is a Data Structure use short studies.
- [ ] Remote Realities and Cellular Automata compatibility URLs lead to their new canonical destinations.
- [ ] Homepage order, copy, two CTAs, three-project grid, and three-track grid match the approved spec.
- [ ] All routes use Outfit/IBM Plex Mono, square editorial geometry, near-black surfaces, warm off-white copy, and deep-red signal accents.
- [ ] Hero and BioWords preserve full static HTML/fallbacks with JavaScript or WebGL unavailable.
- [ ] BioWords results contain only original surviving words ordered by survival time, then remaining energy.
- [ ] No audio autoplays; video never autoplays with sound; third-party players require activation.
- [ ] Contact configured and unconfigured paths both work without public email or phone output.
- [ ] Design-lab routes remain unlinked and `noindex, nofollow`.
- [ ] PixiJS is absent from unrelated routes.
- [ ] WCAG checks, 44px targets, reduced motion, 320px overflow, metadata, sitemap, privacy, and full build all pass.
