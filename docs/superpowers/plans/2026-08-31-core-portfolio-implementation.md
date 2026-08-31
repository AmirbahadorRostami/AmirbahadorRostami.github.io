# Core Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy static portfolio with a responsive, accessible, content-driven Astro site that launches on GitHub Pages and presents Amir's work, music, experience, and private contact path.

**Architecture:** Astro generates static HTML from typed local content collections. Reusable components render the homepage, work archive, two project depths, Music, About/Timeline, Contact, and 404 pages; small client-side modules handle navigation, filters, motion preferences, and contact-form state. GitHub Actions builds and deploys `dist/`, while provider-specific contact delivery remains behind one public endpoint variable.

**Tech Stack:** Astro 6, TypeScript, Astro content collections, CSS custom properties, Vitest, Playwright, `@axe-core/playwright`, Sharp, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-31-personal-portfolio-design.md`

## Global Constraints

- Launch as a static Astro site on GitHub Pages from this repository.
- Preserve hosting neutrality; do not use provider-specific page or content APIs.
- Keep Amir's email address and phone number out of generated HTML, JavaScript, repository configuration, and public metadata.
- Include all six launch projects; Encounters, Luminous Trails, and Remote Realities are flagship case studies.
- Use the Curious Signal visual direction: near-black, warm off-white, mint/teal signals, coral metadata accents, bold sans-serif display type, and monospaced labels.
- Present selected work as a three-card homepage grid and selected music as a four-tile homepage grid.
- Music never autoplays.
- Meet WCAG 2.1 AA for the launch experience and honor `prefers-reduced-motion`.
- Produce no horizontal page overflow at a 320 CSS-pixel viewport.
- Keep BioWords' future demo behind an optional `LiveExperimentSlot`; porting the Processing source is outside this plan.
- Use structured content for projects, music, and experience; do not duplicate content in page components.
- Update the living spec status, checklists, and decision log as implementation decisions become final.

## File and Responsibility Map

```text
package.json                         Commands and pinned dependency ranges
astro.config.mjs                    Static output, canonical site, sitemap
tsconfig.json                       Strict Astro TypeScript configuration
vitest.config.ts                    Unit-test configuration
playwright.config.ts                Production-preview browser tests
.env.example                        Public contact endpoint contract
.github/workflows/deploy.yml        GitHub Pages build and deployment
scripts/prepare-media.mjs           Deterministic source-media optimization
src/config/site.ts                  Public identity, navigation, platform links
src/content.config.ts               Project, music, and experience schemas
src/content/projects/**             Project metadata and narrative Markdown
src/content/music/*.json            Music records
src/content/experience/*.json       Curated timeline records
src/assets/**                       Optimized build-time images
src/layouts/BaseLayout.astro        Document shell and route metadata
src/layouts/ProjectLayout.astro     Shared flagship/short project composition
src/components/layout/**            Header, footer, navigation, skip link
src/components/projects/**          Cards, grids, facts, media, next-project UI
src/components/music/**             Music cards and listening grid
src/components/timeline/**          Timeline list and entries
src/components/contact/**           Contact form and status UI
src/components/interactive/**       Future-demo boundary and motion field
src/lib/content.ts                  Sorted collection queries and categories
src/lib/contact.ts                  Validation, payload, and form-state logic
src/lib/urls.ts                     Canonical and internal URL helpers
src/pages/**                        Static routes and generated project routes
src/styles/global.css               Tokens, reset, utilities, shared responsive rules
tests/unit/**                        Pure TypeScript behavior tests
tests/e2e/**                         Route, accessibility, responsive, and form tests
public/documents/**                 Public resume
public/og.png                       Site-wide social preview
README.md                           Setup, content editing, testing, deployment
```

---

### Task 1: Astro Foundation and Test Harness

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/config/site.ts`
- Create: `src/pages/index.astro`
- Create: `vitest.config.ts`
- Create: `tests/unit/site-config.test.ts`
- Create: `.gitignore`
- Generate: `package-lock.json`

**Interfaces:**
- Produces: `SITE` with `name`, `title`, `description`, `origin`, `location`, `navigation`, and optional public platform URLs.
- Produces: npm scripts `dev`, `build`, `preview`, `check`, `test`, `test:unit`, and `test:e2e`.
- Consumes: no earlier task output.

- [ ] **Step 1: Create a feature branch and ignore local/generated state**

Run:

```bash
git switch -c codex/portfolio-rebuild
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.superpowers/
playwright-report/
test-results/
.env
.DS_Store
```

- [ ] **Step 2: Add the Astro package contract**

Create `package.json`:

```json
{
  "name": "amir-rostami-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "npm run test:unit && npm run build && npm run test:e2e",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.0",
    "@astrojs/sitemap": "^3.0.0",
    "astro": "^6.0.0",
    "sharp": "^0.34.0",
    "typescript": "^5.9.0"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.10.0",
    "@playwright/test": "^1.55.0",
    "vitest": "^3.2.0"
  }
}
```

Run:

```bash
npm install
npx playwright install chromium
```

Expected: `package-lock.json` exists and npm exits successfully.

- [ ] **Step 3: Write the failing public-site configuration test**

Create `tests/unit/site-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SITE } from '../../src/config/site';

describe('SITE', () => {
  it('contains only public contact details', () => {
    expect(SITE.location).toBe('Toronto, Canada');
    expect(JSON.stringify(SITE)).not.toMatch(/427-2821|bahador\.rostami95@gmail\.com/i);
  });

  it('exposes the approved global navigation in order', () => {
    expect(SITE.navigation.map((item) => item.label)).toEqual([
      'Work',
      'Music',
      'About',
      'Contact',
    ]);
  });
});
```

- [ ] **Step 4: Run the test and verify the missing-module failure**

Run:

```bash
npm run test:unit -- tests/unit/site-config.test.ts
```

Expected: FAIL because `src/config/site.ts` does not exist.

- [ ] **Step 5: Implement the site configuration and Astro shell**

Create `src/config/site.ts`:

```ts
export const SITE = {
  name: 'Amir Rostami',
  title: 'Amir Rostami — Creative Technologist & Musician',
  description:
    'Creative tinkerer, musician, and maker of immersive experiences, software, and sound.',
  origin: 'https://amirbahadorrostami.github.io',
  location: 'Toronto, Canada',
  navigation: [
    { label: 'Work', href: '/work/' },
    { label: 'Music', href: '/music/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  linkedInUrl: '',
  spotifyUrl: '',
  soundCloudUrl: 'https://soundcloud.com/amir-bahador-rostami',
} as const;
```

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amirbahadorrostami.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create `src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

Create `src/pages/index.astro`:

```astro
---
import { SITE } from '../config/site';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={SITE.description} />
    <title>{SITE.title}</title>
  </head>
  <body>
    <main><h1>Professional maker of curious things.</h1></main>
  </body>
</html>
```

Create `vitest.config.ts`:

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({ test: { include: ['tests/unit/**/*.test.ts'] } });
```

- [ ] **Step 6: Verify the foundation**

Run:

```bash
npm run test:unit -- tests/unit/site-config.test.ts
npm run build
```

Expected: unit tests PASS; Astro check and build PASS; `dist/index.html` exists.

- [ ] **Step 7: Commit the foundation**

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src/env.d.ts src/config/site.ts src/pages/index.astro tests/unit/site-config.test.ts
git commit -m "build: establish Astro portfolio foundation"
```

### Task 2: Curious Signal Design System and Shared Shell

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/layout/SkipLink.astro`
- Create: `src/components/layout/SiteHeader.astro`
- Create: `src/components/layout/SiteFooter.astro`
- Create: `src/lib/urls.ts`
- Create: `tests/unit/urls.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SITE` from Task 1.
- Produces: `absoluteUrl(path: string): string` and `BaseLayout` props `{ title, description, image?, canonicalPath? }`.
- Produces: consistent header/footer landmarks and shared CSS tokens used by all later tasks.

- [ ] **Step 1: Write the failing canonical URL tests**

Create `tests/unit/urls.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { absoluteUrl, normalizePath } from '../../src/lib/urls';

describe('URL helpers', () => {
  it('normalizes internal routes with a leading and trailing slash', () => {
    expect(normalizePath('work/encounters')).toBe('/work/encounters/');
  });

  it('builds canonical URLs from the configured origin', () => {
    expect(absoluteUrl('/music/')).toBe('https://amirbahadorrostami.github.io/music/');
  });
});
```

- [ ] **Step 2: Verify the helpers are missing**

Run: `npm run test:unit -- tests/unit/urls.test.ts`  
Expected: FAIL because `src/lib/urls.ts` does not exist.

- [ ] **Step 3: Implement the helpers**

Create `src/lib/urls.ts`:

```ts
import { SITE } from '../config/site';

export function normalizePath(path: string): string {
  const clean = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  return clean === '' ? '/' : `${clean}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizePath(path), SITE.origin).toString();
}
```

- [ ] **Step 4: Build the design tokens and accessibility baseline**

Create `src/styles/global.css` with these required tokens and rules:

```css
:root {
  color-scheme: dark;
  --ink: #08090b;
  --surface: #101216;
  --surface-raised: #171a20;
  --paper: #f6f1e8;
  --muted: #a2a7b1;
  --signal: #77f1da;
  --coral: #ff6c57;
  --line: #2a2e36;
  --focus: #fff4a8;
  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --content: 76rem;
  --font-display: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

*, *::before, *::after { box-sizing: border-box; }
html { background: var(--ink); color: var(--paper); scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; font-family: var(--font-display); line-height: 1.5; }
img, video, iframe { display: block; max-width: 100%; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 4px; }
.container { width: min(calc(100% - 2rem), var(--content)); margin-inline: auto; }
.eyebrow { color: var(--signal); font-family: var(--font-mono); font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 5: Create the shared layout components**

Implement:

```ts
// BaseLayout props
export interface Props {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
}
```

`BaseLayout.astro` must import `global.css`, emit canonical/Open Graph/X metadata, include `SkipLink`, `SiteHeader`, a `<main id="main-content">` slot, and `SiteFooter`. `SiteHeader.astro` must use a real `<nav aria-label="Primary">`, indicate the current route with `aria-current="page"`, and use a button with `aria-expanded` for its mobile menu. `SiteFooter.astro` must omit LinkedIn or Spotify links while their configured URLs are empty.

- [ ] **Step 6: Render the homepage through `BaseLayout`**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <section class="container">
    <p class="eyebrow">Creative technologist / musician / tinkerer</p>
    <h1>Professional maker of curious things.</h1>
  </section>
</BaseLayout>
```

- [ ] **Step 7: Verify and commit the shell**

Run:

```bash
npm run test:unit -- tests/unit/urls.test.ts
npm run build
```

Expected: PASS with one generated homepage and no Astro diagnostics.

```bash
git add src/styles src/layouts src/components/layout src/lib/urls.ts src/pages/index.astro tests/unit/urls.test.ts
git commit -m "feat: add Curious Signal site shell"
```

### Task 3: Typed Content Collections and Launch Records

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/encounters/index.md`
- Create: `src/content/projects/luminous-trails/index.md`
- Create: `src/content/projects/remote-realities/index.md`
- Create: `src/content/projects/biowords/index.md`
- Create: `src/content/projects/person-is-a-data-structure/index.md`
- Create: `src/content/projects/cellular-automata/index.md`
- Create: `src/content/music/*.json`
- Create: `src/content/experience/*.json`
- Create: `tests/unit/content-contract.test.ts`

**Interfaces:**
- Produces collections `projects`, `music`, and `experience`.
- Project schema exposes `title`, `alternateTitle`, `year`, `summary`, `cardSummary`, `depth`, `order`, `featured`, `categories`, `roles`, `tools`, `hero`, `heroAlt`, `context`, `collaborators`, `credits`, `externalLinks`, `liveExperiment`, `outcomes`, and `draft`.
- Music schema exposes `title`, `platform`, `url`, `order`, `featured`, `duration`, `description`, and `draft`.
- Experience schema exposes `role`, `organization`, `period`, `order`, `summary`, `category`, and `featured`.

- [ ] **Step 1: Write the failing launch-inventory contract**

Create `tests/unit/content-contract.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { EXPECTED_PROJECT_SLUGS } from '../../src/lib/content';

describe('launch inventory', () => {
  it('contains the six approved project slugs', () => {
    expect(EXPECTED_PROJECT_SLUGS).toEqual([
      'encounters',
      'luminous-trails',
      'remote-realities',
      'biowords',
      'person-is-a-data-structure',
      'cellular-automata',
    ]);
  });
});
```

Run: `npm run test:unit -- tests/unit/content-contract.test.ts`  
Expected: FAIL because `src/lib/content.ts` does not exist.

- [ ] **Step 2: Define the content schemas**

Create `src/content.config.ts` using Astro's `glob()` loader and Zod schemas. Use the exact enums:

```ts
depth: z.enum(['flagship', 'short']),
platform: z.enum(['spotify', 'soundcloud', 'bandcamp', 'direct']),
category: z.enum(['engineering', 'creative-technology', 'research', 'teaching', 'education']),
```

Make collaborator, credit, link, video, and outcome arrays default to `[]`; make `liveExperiment`, `featured`, and `draft` default to `false`. Require nonempty title, summary, cardSummary, hero alt text, roles, tools, and categories for every project.

- [ ] **Step 3: Add the six project records with honest launch copy**

Each Markdown file must contain complete required frontmatter and an existing-source narrative. Use these public titles and depths:

```yaml
# encounters/index.md
title: Encounters
year: "2023"
depth: flagship
order: 1
featured: true
categories: [augmented-reality, social-experience, public-space]
roles: [Creative technologist, XR developer]
liveExperiment: false
draft: false
```

```yaml
# luminous-trails/index.md
title: Luminous Trails
depth: flagship
order: 2
featured: true
```

```yaml
# remote-realities/index.md
title: Remote Realities
alternateTitle: Ephemeral Pulses of a Finite Scroll
depth: flagship
order: 3
featured: true
```

```yaml
# biowords/index.md
title: BioWords
depth: short
order: 4
liveExperiment: false
```

```yaml
# person-is-a-data-structure/index.md
title: Person Is a Data Structure
depth: short
order: 5
```

```yaml
# cellular-automata/index.md
title: Cellular Automata
depth: short
order: 6
```

Unknown collaborators and outcomes must be empty arrays, not invented facts. The UI will hide empty optional sections. Copy and edit the existing project text for grammar without adding unverified claims.

For the Task 3 build, point each required `hero` field at the existing source asset so schema validation passes before optimization:

```yaml
# Exact temporary hero mapping, relative to each nested project Markdown file
encounters: ../../../../Media/img-tester/Encounter.png
luminous-trails: ../../../../Media/img-tester/Luminous.png
remote-realities: ../../../../Media/img-tester/Remote.jpg
biowords: ../../../../Media/img-tester/BioWords.gif
person-is-a-data-structure: ../../../../Media/img-tester/Data.jpg
cellular-automata: ../../../../Media/img-tester/CATumbnail.png
```

Task 4 replaces these temporary source references with optimized `src/assets` references before any page component uses them.

- [ ] **Step 4: Seed music and timeline collections**

Add JSON records for the known SoundCloud works `La Paloma`, `Float`, `Flow`, `Idk`, and `Googoosh - Lalai (Bahador Remake)` using the existing URLs. Mark `Float`, `Flow`, and `La Paloma` as featured unless Amir supplies a different order before this task executes. Resolve the two existing Spotify embed IDs through Spotify's public oEmbed response; add their returned titles as records only when the title response succeeds.

Add timeline records from the approved resume with chronological `order`, concise summaries, and categories. Do not include the resume's public email or phone in any record.

- [ ] **Step 5: Implement the inventory constant and verify schema validity**

Create the initial `src/lib/content.ts` export:

```ts
export const EXPECTED_PROJECT_SLUGS = [
  'encounters',
  'luminous-trails',
  'remote-realities',
  'biowords',
  'person-is-a-data-structure',
  'cellular-automata',
] as const;
```

Run:

```bash
npm run test:unit -- tests/unit/content-contract.test.ts
npm run build
```

Expected: PASS; Astro reports no content-schema errors.

- [ ] **Step 6: Commit the typed content foundation**

```bash
git add src/content.config.ts src/content src/lib/content.ts tests/unit/content-contract.test.ts
git commit -m "feat: add typed portfolio content collections"
```

### Task 4: Optimized Media Pipeline

**Files:**
- Create: `scripts/prepare-media.mjs`
- Create: `src/assets/projects/**`
- Create: `src/assets/profile/amir-rostami.webp`
- Modify: project content files from Task 3
- Modify: `package.json`
- Test: `tests/unit/media-manifest.test.ts`

**Interfaces:**
- Produces deterministic optimized master files no wider than 1920 pixels, quality 82, with stable kebab-case names.
- Project content consumes relative build-time image paths validated by Astro's `image()` schema helper.

- [ ] **Step 1: Write the failing media-manifest test**

Create `tests/unit/media-manifest.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MEDIA_JOBS } from '../../scripts/prepare-media.mjs';

describe('media manifest', () => {
  it('has a hero image for every launch project', () => {
    expect(new Set(MEDIA_JOBS.map((job) => job.project))).toEqual(
      new Set(['encounters', 'luminous-trails', 'remote-realities', 'biowords', 'person-is-a-data-structure', 'cellular-automata', 'profile']),
    );
  });
});
```

- [ ] **Step 2: Verify the pipeline is missing**

Run: `npm run test:unit -- tests/unit/media-manifest.test.ts`  
Expected: FAIL because the script does not exist.

- [ ] **Step 3: Implement deterministic image preparation**

Create `scripts/prepare-media.mjs` exporting `MEDIA_JOBS`, with exact source mappings from the current repository. For static images, use Sharp:

```js
await sharp(source)
  .rotate()
  .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(destination);
```

Copy `BioWords.gif` without conversion so its animation remains intact. Include Encounter card/header/interaction/pond, Luminous card and selected detail images, Remote card image, Data image for Person Is a Data Structure, Cellular Automata thumbnail, and Amir's profile portrait.

Add the script:

```json
"media:prepare": "node scripts/prepare-media.mjs"
```

- [ ] **Step 4: Generate assets and wire project hero paths**

Run:

```bash
npm run media:prepare
```

Update every project record's `hero` and `heroAlt`. Use specific alt text, for example:

```yaml
hero: ../../../assets/projects/encounters/encounters-card.webp
heroAlt: A luminous letter E floating above layered blue lines in the Encounters artwork
```

- [ ] **Step 5: Verify output size and build-time image validation**

Run:

```bash
npm run test:unit -- tests/unit/media-manifest.test.ts
npm run build
du -sh src/assets
```

Expected: tests and build PASS; optimized assets are materially smaller than the current 87 MB `Media/` directory.

- [ ] **Step 6: Commit the pipeline and optimized masters**

```bash
git add scripts/prepare-media.mjs package.json package-lock.json src/assets src/content/projects tests/unit/media-manifest.test.ts
git commit -m "perf: add optimized portfolio media pipeline"
```

### Task 5: Work Archive and Project Query Layer

**Files:**
- Modify: `src/lib/content.ts`
- Create: `src/components/projects/ProjectCard.astro`
- Create: `src/components/projects/ProjectGrid.astro`
- Create: `src/components/projects/WorkFilters.astro`
- Create: `src/pages/work/index.astro`
- Create: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `sortByOrder<T extends { data: { order: number } }>(entries: T[]): T[]`.
- Produces: `getPublishedProjects()`, `getFeaturedProjects()`, and `getProjectCategories()`.
- `ProjectCard` consumes a single `CollectionEntry<'projects'>`.

- [ ] **Step 1: Write failing sort/filter tests**

Create `tests/unit/content.test.ts` with fixtures asserting ascending `order`, exclusion of `draft: true`, exactly three featured projects, and de-duplicated alphabetical categories.

```ts
expect(sortByOrder([{ data: { order: 2 } }, { data: { order: 1 } }])).toEqual([
  { data: { order: 1 } },
  { data: { order: 2 } },
]);
```

- [ ] **Step 2: Run the tests and verify missing exports**

Run: `npm run test:unit -- tests/unit/content.test.ts`  
Expected: FAIL because the query exports do not exist.

- [ ] **Step 3: Implement the query layer**

Use `getCollection('projects', ({ data }) => !data.draft)` and return new sorted arrays rather than mutating Astro collection results. `getFeaturedProjects()` must filter `featured` and slice to three; throw a build-time error unless the result length is exactly three.

- [ ] **Step 4: Build the archive components**

`ProjectCard.astro` must render an Astro `<Image layout="constrained">`, project title, year, card summary, categories, and a descriptive link to `/work/{id}/`. `ProjectGrid.astro` must use a three-column grid at large sizes and one column below 42rem.

`WorkFilters.astro` must render buttons with `aria-pressed`; its inline module toggles the `hidden` attribute on cards using `data-categories`. With JavaScript unavailable, all projects remain visible.

- [ ] **Step 5: Build and verify `/work/`**

Create `src/pages/work/index.astro` using `BaseLayout`, `getPublishedProjects()`, `getProjectCategories()`, `WorkFilters`, and `ProjectGrid`.

Run:

```bash
npm run test:unit -- tests/unit/content.test.ts
npm run build
```

Expected: PASS; `dist/work/index.html` contains all six project titles.

- [ ] **Step 6: Commit the work archive**

```bash
git add src/lib/content.ts src/components/projects src/pages/work/index.astro tests/unit/content.test.ts
git commit -m "feat: add filterable work archive"
```

### Task 6: Flagship and Short Project Pages

**Files:**
- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/components/projects/ProjectFacts.astro`
- Create: `src/components/projects/ProjectMedia.astro`
- Create: `src/components/projects/NextProject.astro`
- Create: `src/components/interactive/LiveExperimentSlot.astro`
- Create: `src/pages/work/[...slug].astro`
- Create: `tests/unit/project-navigation.test.ts`
- Modify: `src/lib/content.ts`

**Interfaces:**
- Produces: `getAdjacentProject(projectId: string)` returning `{ previous, next }` published entries.
- `ProjectLayout` consumes `{ project, previous, next }` and renders the Markdown body slot.
- `LiveExperimentSlot` consumes `{ enabled: boolean, title: string }` and renders nothing when disabled.

- [ ] **Step 1: Write failing wraparound-navigation tests**

Test that the first ordered project points back to the last and forward to the second, and the last points forward to the first. Use fixture IDs rather than querying Astro in the pure function.

- [ ] **Step 2: Implement adjacent-project selection**

Add a pure `adjacentEntries(entries, currentId)` helper and use it inside `getAdjacentProject`. Throw a descriptive build-time error when the current project is absent.

- [ ] **Step 3: Implement the two-depth project composition**

`ProjectLayout.astro` must:

- Apply `data-depth={project.data.depth}`.
- Render hero, premise, facts, Markdown story, optional collaborators/credits/outcomes, optional links, optional live-experiment slot, and next-project navigation.
- Show extended story/media spacing for `flagship` and compact spacing for `short`.
- Omit optional sections when arrays are empty.
- Use captions and iframe titles for media.

`LiveExperimentSlot.astro` must reserve the interface without suggesting the demo exists:

```astro
{enabled && <section aria-labelledby="live-experiment-title"><h2 id="live-experiment-title">Live experiment</h2><slot /></section>}
```

- [ ] **Step 4: Generate every project route**

`src/pages/work/[...slug].astro` must export `getStaticPaths()` from `getPublishedProjects()`, render the collection entry body, and pass adjacent projects to `ProjectLayout`.

- [ ] **Step 5: Verify routes and commit**

Run:

```bash
npm run test:unit -- tests/unit/project-navigation.test.ts
npm run build
find dist/work -name index.html | sort
```

Expected: seven work HTML files: archive plus six detail pages.

```bash
git add src/layouts/ProjectLayout.astro src/components/projects src/components/interactive src/pages/work src/lib/content.ts tests/unit/project-navigation.test.ts
git commit -m "feat: add flagship and short project pages"
```

### Task 7: Narrative Homepage with Project and Music Grids

**Files:**
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/SelectedWork.astro`
- Create: `src/components/home/SelectedMusic.astro`
- Create: `src/components/home/ExperiencePreview.astro`
- Create: `src/components/home/ContactCallout.astro`
- Create: `src/components/interactive/SignalField.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: exactly three featured projects, exactly three featured music records, and featured experience records.
- Produces: the approved five-section homepage order.

- [ ] **Step 1: Add a failing homepage structure test**

Create `tests/e2e/homepage.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('homepage presents the approved narrative order', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Professional maker of curious things');
  const sections = await page.locator('main > section').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(sections).toEqual(['hero', 'selected-work', 'selected-music', 'experience', 'contact-invitation']);
});
```

- [ ] **Step 2: Implement the homepage components**

Use semantic sections and the approved copy. `SelectedWork` renders a three-card `ProjectGrid`. `SelectedMusic` renders three track cards plus a fourth `/music/` gateway card. `ExperiencePreview` renders no more than three entries. `ContactCallout` links to `/contact/` with employment, freelance, commission, exhibition, and residency language.

`SignalField.astro` must be decorative (`aria-hidden="true"`), use CSS or a small canvas module, stop animation when offscreen, and render a static state under reduced motion.

- [ ] **Step 3: Compose the page in the approved order**

`src/pages/index.astro` imports all five sections and queries content once in frontmatter. Do not duplicate project, music, or timeline copy in the page file.

- [ ] **Step 4: Configure Playwright and verify the homepage**

Create `playwright.config.ts` with Chromium, `baseURL: 'http://127.0.0.1:4321'`, and a `webServer` running `npm run preview -- --host 127.0.0.1` after the production build.

Run:

```bash
npm run build
npm run test:e2e -- tests/e2e/homepage.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the homepage**

```bash
git add playwright.config.ts src/components/home src/components/interactive/SignalField.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: build narrative portfolio homepage"
```

### Task 8: Music Page and Listening Cards

**Files:**
- Create: `src/components/music/MusicCard.astro`
- Create: `src/components/music/MusicGrid.astro`
- Create: `src/pages/music.astro`
- Create: `tests/e2e/music.spec.ts`

**Interfaces:**
- Consumes: sorted, non-draft `music` collection records.
- `MusicCard` consumes one music entry and never starts playback automatically.

- [ ] **Step 1: Write the failing no-autoplay test**

```ts
test('music page has no autoplaying media', async ({ page }) => {
  await page.goto('/music/');
  await expect(page.locator('[autoplay]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('sound');
});
```

- [ ] **Step 2: Implement custom listening cards**

Each card renders title, description, platform, optional duration, an explicit outbound link, and an optional user-triggered embed. If an embed fails, the title and outbound link remain. Do not load Spotify/SoundCloud iframe scripts in the initial HTML unless the user activates a card.

- [ ] **Step 3: Build the Music page**

Use the heading `Things I make with sound.` and a short statement connecting music to Amir's broader creative practice. Render featured tracks first and the remaining catalog after them. Show Spotify/SoundCloud platform buttons only when their `SITE` URLs are nonempty.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run build
npm run test:e2e -- tests/e2e/music.spec.ts
```

Expected: PASS; no autoplay attributes and no third-party iframe network request before interaction.

```bash
git add src/components/music src/pages/music.astro tests/e2e/music.spec.ts
git commit -m "feat: add authored music listening room"
```

### Task 9: About Page, Curated Timeline, and Resume

**Files:**
- Create: `src/components/timeline/Timeline.astro`
- Create: `src/components/timeline/TimelineEntry.astro`
- Create: `src/pages/about.astro`
- Create: `public/documents/Amir-Rostami-Resume.pdf`
- Create: `tests/e2e/about.spec.ts`

**Interfaces:**
- Consumes: ordered `experience` records and `src/assets/profile/amir-rostami.webp`.
- Produces: public resume URL `/documents/Amir-Rostami-Resume.pdf` without exposing resume contact details in page text.

- [ ] **Step 1: Write the failing timeline and download test**

```ts
test('about page exposes a curated timeline and resume download', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('curious');
  await expect(page.locator('[data-timeline-entry]')).toHaveCount(13);
  await expect(page.getByRole('link', { name: /download.*résumé/i })).toHaveAttribute('href', '/documents/Amir-Rostami-Resume.pdf');
});
```

- [ ] **Step 2: Copy the supplied resume and build timeline components**

Run:

```bash
mkdir -p public/documents
cp /Users/amirbahadorrostami/Desktop/Resume/Amir_Rostami_Resume.pdf public/documents/Amir-Rostami-Resume.pdf
```

Render timeline entries as an ordered list. Each entry displays period, role, organization, and concise summary; it must not reproduce every resume bullet.

- [ ] **Step 3: Build the About page**

Use the approved identity `Part engineer. Part artist. Entirely curious.` as a working section heading, the optimized portrait, a biography connecting technology and human connection, the timeline, education, contextual skills, and the resume download.

- [ ] **Step 4: Verify the public page and PDF**

Run:

```bash
npm run build
npm run test:e2e -- tests/e2e/about.spec.ts
test -s dist/documents/Amir-Rostami-Resume.pdf
```

Expected: PASS and a nonempty deployed PDF.

- [ ] **Step 5: Commit the About experience**

```bash
git add src/components/timeline src/pages/about.astro public/documents/Amir-Rostami-Resume.pdf tests/e2e/about.spec.ts
git commit -m "feat: add curated experience timeline and resume"
```

### Task 10: Private Contact Form with Replaceable Delivery

**Files:**
- Create: `src/lib/contact.ts`
- Create: `src/components/contact/ContactForm.astro`
- Create: `src/pages/contact.astro`
- Create: `.env.example`
- Create: `tests/unit/contact.test.ts`
- Create: `tests/e2e/contact.spec.ts`

**Interfaces:**
- Produces: `ContactFields`, `ContactErrors`, `ContactState`, `validateContact(fields)`, and `toContactPayload(fields)`.
- Consumes: `PUBLIC_CONTACT_FORM_ENDPOINT` at build time; an empty value renders a LinkedIn/configuration fallback rather than a broken submit action.

- [ ] **Step 1: Write failing validation tests**

```ts
import { expect, test } from 'vitest';
import { validateContact } from '../../src/lib/contact';

test('requires a valid reply address and meaningful message', () => {
  expect(validateContact({ name: '', email: 'bad', intent: 'employment', message: 'hi' })).toEqual({
    name: 'Tell me your name.',
    email: 'Enter a valid reply email.',
    message: 'Please include at least 20 characters.',
  });
});
```

- [ ] **Step 2: Implement contact types and pure validation**

Use:

```ts
export type ContactIntent = 'employment' | 'commission' | 'residency' | 'other';
export type ContactState = 'ready' | 'sending' | 'success' | 'error' | 'unconfigured';
export interface ContactFields { name: string; email: string; intent: ContactIntent; message: string; }
export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

export function validateContact(fields: ContactFields): ContactErrors;
export function toContactPayload(fields: ContactFields): Record<string, string>;
```

Trim all values, require name, validate email with a conservative pattern, require a 20-character message, cap name at 100 and message at 4000 characters, and include a hidden honeypot value in the payload.

- [ ] **Step 3: Build accessible form states**

`ContactForm.astro` must include visible labels, an intent `<select>`, inline error IDs referenced with `aria-describedby`, a polite status region, disabled sending state, success reset, retry-preserving error state, and a LinkedIn fallback only when configured.

Create `.env.example`:

```dotenv
PUBLIC_CONTACT_FORM_ENDPOINT=
```

When the endpoint is empty, set state to `unconfigured`, disable submission, and explain that the direct form is being connected; do not expose a recipient address.

- [ ] **Step 4: Add browser tests for success and failure**

Use Playwright route interception for the configured form URL. Assert that a 200 response produces the success message, a 500 response preserves field values and exposes retry, invalid local fields make no request, and generated HTML contains neither the private email nor phone number.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run test:unit -- tests/unit/contact.test.ts
npm run build
npm run test:e2e -- tests/e2e/contact.spec.ts
rg -n "bahador\.rostami95@gmail\.com|416.?427.?2821" dist && exit 1 || true
```

Expected: all tests PASS and the privacy search returns no matches.

```bash
git add .env.example src/lib/contact.ts src/components/contact src/pages/contact.astro tests/unit/contact.test.ts tests/e2e/contact.spec.ts
git commit -m "feat: add private resilient contact flow"
```

### Task 11: Metadata, Social Preview, Sitemap, and 404

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/ProjectLayout.astro`
- Create: `src/pages/404.astro`
- Create: `public/og.png`
- Create: `tests/e2e/metadata.spec.ts`

**Interfaces:**
- Consumes: `absoluteUrl()`, site metadata, and project-specific hero images.
- Produces: canonical, Open Graph, and X metadata on every route; sitemap from `@astrojs/sitemap`.

- [ ] **Step 1: Write failing metadata tests**

Test `/`, `/work/encounters/`, `/music/`, and `/404.html`. Require one canonical URL, nonempty description, `og:title`, `og:description`, `og:image`, and matching X card fields. Require the Encounters page title/description/image to come from its record rather than the site default.

- [ ] **Step 2: Generate one site-wide social preview**

Create a 1200x630 Curious Signal card using the approved title, palette, and project imagery. Inspect the generated image for correct spelling and legible text before saving it to `public/og.png`. Project pages must use their own hero image for social metadata rather than `og.png`.

- [ ] **Step 3: Complete metadata rendering and 404 recovery**

`BaseLayout` must render absolute canonical/image URLs. `ProjectLayout` passes project-specific title, summary, and hero. `404.astro` offers visible links to Work, Music, About, and Contact and returns no misleading project content.

- [ ] **Step 4: Verify output and commit**

Run:

```bash
npm run build
npm run test:e2e -- tests/e2e/metadata.spec.ts
test -s dist/sitemap-0.xml
```

Expected: PASS with nonempty sitemap and social metadata.

```bash
git add src/layouts src/pages/404.astro public/og.png tests/e2e/metadata.spec.ts
git commit -m "feat: add portfolio metadata and discovery files"
```

### Task 12: Responsive, Accessibility, and Performance Verification

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/navigation.spec.ts`
- Modify: components/styles found by failing checks

**Interfaces:**
- Consumes: every launch route and shared component.
- Produces: enforced WCAG smoke coverage, keyboard navigation checks, reduced-motion checks, and 320-pixel overflow protection.

- [ ] **Step 1: Add automated accessibility checks**

Use `AxeBuilder` from `@axe-core/playwright` on `/`, `/work/`, all three flagship routes, `/work/biowords/`, `/music/`, `/about/`, and `/contact/`. Fail on any `critical` or `serious` violation.

- [ ] **Step 2: Add responsive overflow checks**

At widths 320, 390, 768, and 1440, assert:

```ts
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
expect(overflow).toBeLessThanOrEqual(0);
```

Also assert the flagship grid has three columns at 1440 and one column at 390 using computed styles.

- [ ] **Step 3: Add keyboard and reduced-motion checks**

Tab from the addressable document start, verify the skip link becomes visible, activate it, confirm focus reaches `#main-content`, open/close the mobile menu with keyboard, and confirm every filter button is reachable. Emulate `reducedMotion: 'reduce'` and assert the SignalField reports a static state through `data-motion="reduced"`.

- [ ] **Step 4: Run the full quality suite and fix only observed failures**

Run:

```bash
npm run test
```

Expected: unit, build, route, accessibility, responsive, navigation, metadata, and contact tests PASS.

- [ ] **Step 5: Commit verified refinements**

```bash
git add src tests/e2e
git commit -m "test: verify portfolio accessibility and responsiveness"
```

### Task 13: GitHub Pages Deployment and Living Documentation

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Modify: `docs/superpowers/specs/2026-08-31-personal-portfolio-design.md`
- Modify: this plan file as tasks complete

**Interfaces:**
- Consumes: the successful `npm run build` output.
- Produces: GitHub Pages deployment from `main` using the official Astro and GitHub Pages actions.

- [ ] **Step 1: Add the official GitHub Pages workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: withastro/action@v6
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Document setup and content editing**

`README.md` must contain:

- Node 24 prerequisite
- `npm install`, `npm run dev`, `npm run media:prepare`, `npm run build`, and `npm run test`
- Where project/music/experience records live
- How optional fields are hidden
- How to add a project image and alt text
- How to configure `PUBLIC_CONTACT_FORM_ENDPOINT` without committing `.env`
- How GitHub Pages deployment works
- How to replace the contact provider or hosting later
- Link to the design spec and this implementation plan

- [ ] **Step 3: Update the living design document**

Set its status to `Core portfolio implemented; content completion and launch review in progress` when Tasks 1-12 pass. Check completed content/acceptance items only when verified. Add decision-log rows for the final contact provider, public project title, selected tracks, and domain when those decisions exist.

- [ ] **Step 4: Verify the clean production build**

Run:

```bash
npm ci
npm run test
git status --short
```

Expected: tests PASS; status lists only intentional documentation checkbox updates.

- [ ] **Step 5: Commit deployment and documentation**

```bash
git add .github/workflows/deploy.yml README.md docs/superpowers
git commit -m "ci: deploy portfolio through GitHub Pages"
```

- [ ] **Step 6: Review, merge, and verify production**

Review the complete branch diff, then merge through the repository's normal review path. In GitHub repository settings, set Pages source to **GitHub Actions**. After the workflow finishes, verify `/`, `/work/`, all six project pages, `/music/`, `/about/`, `/contact/`, `/404.html`, the resume download, sitemap, and social metadata on the deployed origin.

## Execution Checkpoints

- After Task 2: first meaningful local preview of the shared Curious Signal shell.
- After Task 6: review the work archive and both project depths with Amir.
- After Task 9: review homepage, Music, and About content with Amir.
- After Task 10: obtain or confirm the form endpoint before launch acceptance.
- After Task 12: complete visual and content review before merging.
- After Task 13: production smoke test and update the living specification.

## Separate Follow-up Plan

The BioWords live demo requires its own specification and implementation plan after Amir provides the original Processing/Java source. That plan will cover behavioral inventory, p5.js/Canvas feasibility, porting tests, mobile controls, performance budgets, reduced-motion behavior, and visual comparison with the original. The core portfolio includes only the tested `LiveExperimentSlot` boundary.
