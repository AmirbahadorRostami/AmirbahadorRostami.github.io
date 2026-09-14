# Six-Concept Design Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an unlinked, static Astro design lab containing one comparison hub and six complete responsive portfolio homepage concepts.

**Architecture:** A typed manifest defines the six routes and concept metadata. A dedicated layout isolates lab typography and metadata from the production site, while six independent Astro concept components share only real content data and progressive GSAP motion utilities. A dynamic `[concept].astro` route statically generates all concepts for GitHub Pages.

**Tech Stack:** Astro 6, TypeScript 5.9, Astro content collections, GSAP with ScrollTrigger, self-hosted Fontsource variable fonts, Vitest, Playwright, axe-core.

**Spec:** `docs/superpowers/specs/2026-09-14-six-concept-design-lab.md`

## Global Constraints

- Production routes and the production header/footer must remain unchanged.
- Lab routes are unlinked from production navigation and use `noindex, nofollow`.
- Use only existing local project/profile media and existing portfolio content.
- Use exactly six concepts: `poster-index`, `type-image-collision`, `darkroom-cinema`, `printed-signal-lab`, `coral-broadcast`, and `clau-poster-wall`.
- No purple gradients, glossy 3D SaaS blobs, generic stock photography, rounded-everything UI, icon feature rows, Inter/system-only typography, or evenly distributed rainbow palettes.
- Every concept follows Navigation, Attention, Interest, Desire, Action and renders its hero in no more than three lines at 1440 CSS pixels.
- Every dense grid uses `grid-auto-flow: dense` and complete twelve-column row spans.
- Reduced-motion mode exposes all content without pinning, scrubbing, continuous movement, or hidden intermediate states.

---

### Task 1: Define and validate the concept manifest

**Files:**
- Create: `src/design-lab/manifest.ts`
- Create: `tests/unit/design-lab-manifest.test.ts`

**Interfaces:**
- Produces: `DesignConcept`, `DESIGN_CONCEPTS`, `designConceptBySlug(slug: string): DesignConcept | undefined`.
- Consumes: no application interfaces.

- [ ] **Step 1: Write the failing manifest test**

```ts
import { describe, expect, it } from 'vitest';
import { DESIGN_CONCEPTS, designConceptBySlug } from '../../src/design-lab/manifest';

describe('design lab manifest', () => {
  it('defines the six approved concepts in comparison order', () => {
    expect(DESIGN_CONCEPTS.map(({ slug }) => slug)).toEqual([
      'poster-index',
      'type-image-collision',
      'darkroom-cinema',
      'printed-signal-lab',
      'coral-broadcast',
      'clau-poster-wall',
    ]);
  });

  it('uses a non-system display family and resolves every slug', () => {
    expect(new Set(DESIGN_CONCEPTS.map(({ font }) => font)).size).toBe(4);
    expect(DESIGN_CONCEPTS.every(({ slug }) => designConceptBySlug(slug)?.slug === slug)).toBe(true);
    expect(DESIGN_CONCEPTS.every(({ font }) => !/inter|system-ui/i.test(font))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test:unit -- tests/unit/design-lab-manifest.test.ts`

Expected: FAIL because `src/design-lab/manifest.ts` does not exist.

- [ ] **Step 3: Implement the typed manifest**

Define the exact fields `slug`, `name`, `shortName`, `referenceUrl`, `description`, `palette`, `font`, `hero`, and `motion`. Export the six immutable records in approved order and implement lookup with `Array.prototype.find`.

- [ ] **Step 4: Run the manifest test and verify GREEN**

Run: `npm run test:unit -- tests/unit/design-lab-manifest.test.ts`

Expected: PASS with two tests.

- [ ] **Step 5: Commit**

```bash
git add src/design-lab/manifest.ts tests/unit/design-lab-manifest.test.ts
git commit -m "feat: define design lab concepts"
```

### Task 2: Add the isolated lab layout and route contract

**Files:**
- Create: `src/layouts/DesignLabLayout.astro`
- Create: `src/design-lab/styles/base.css`
- Create: `src/pages/design-lab/index.astro`
- Create: `src/pages/design-lab/[concept].astro`
- Create: `tests/e2e/design-lab.spec.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `DESIGN_CONCEPTS` and `designConceptBySlug` from Task 1.
- Produces: static routes for the hub and all six concepts; layout props `title`, `description`, `conceptSlug?`, and `bodyClass?`.

- [ ] **Step 1: Add the failing route test**

```ts
import { expect, test } from '@playwright/test';

const slugs = [
  'poster-index',
  'type-image-collision',
  'darkroom-cinema',
  'printed-signal-lab',
  'coral-broadcast',
  'clau-poster-wall',
];

test('design lab exposes a six-concept comparison hub', async ({ page }) => {
  await page.goto('/design-lab/');
  await expect(page.getByRole('heading', { level: 1, name: 'Six ways this portfolio could feel.' })).toBeVisible();
  await expect(page.locator('[data-concept-link]')).toHaveCount(6);
});

for (const slug of slugs) {
  test(`${slug} is statically reachable and noindexed`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.getByRole('link', { name: 'Back to all concepts' })).toBeVisible();
  });
}
```

- [ ] **Step 2: Run the route test and verify RED**

Run: `npx playwright test tests/e2e/design-lab.spec.ts`

Expected: FAIL with a 404 for `/design-lab/`.

- [ ] **Step 3: Install motion and font dependencies**

Run: `npm install gsap @fontsource-variable/satoshi @fontsource-variable/cabinet-grotesk @fontsource-variable/outfit @fontsource-variable/geist`

Expected: `package.json` and `package-lock.json` contain the five new runtime dependencies.

- [ ] **Step 4: Implement the layout, hub, and static dynamic route**

The layout must render a skip link, canonical metadata, `noindex, nofollow`, and a `<main class="lab-page">` with horizontal overflow containment. The dynamic route must export `getStaticPaths()` using all six manifest records and map each slug to its concept component without network access.

- [ ] **Step 5: Run route tests and build**

Run: `npx playwright test tests/e2e/design-lab.spec.ts && npm run build`

Expected: all seven route assertions pass and Astro outputs seven lab pages.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/layouts/DesignLabLayout.astro src/design-lab/styles/base.css src/pages/design-lab tests/e2e/design-lab.spec.ts
git commit -m "feat: scaffold design lab routes"
```

### Task 3: Build the shared content adapter and motion initializer

**Files:**
- Create: `src/design-lab/content.ts`
- Create: `src/design-lab/motion.ts`
- Create: `tests/unit/design-lab-content.test.ts`

**Interfaces:**
- Produces: `loadDesignLabContent(): Promise<DesignLabContent>` containing `projects`, `music`, and `experience`; `initializeDesignLabMotion(root?: ParentNode): () => void`.
- Consumes: Astro content collections and DOM elements carrying `data-lab-pin`, `data-lab-scale`, `data-lab-reveal`, `data-lab-stack`, and `data-lab-marquee`.

- [ ] **Step 1: Write the failing content adapter test**

```ts
import { describe, expect, it } from 'vitest';
import { FEATURED_PROJECT_IDS, FEATURED_TRACK_TITLES } from '../../src/design-lab/content';

describe('design lab content contract', () => {
  it('keeps the approved flagship and music order', () => {
    expect(FEATURED_PROJECT_IDS).toEqual(['encounters', 'luminous-trails', 'remote-realities']);
    expect(FEATURED_TRACK_TITLES).toEqual(['Float', 'Flow', 'La Paloma']);
  });
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run: `npm run test:unit -- tests/unit/design-lab-content.test.ts`

Expected: FAIL because `src/design-lab/content.ts` does not exist.

- [ ] **Step 3: Implement the adapter and progressive motion API**

Load and order the real collections with existing `sortByOrder`. Register ScrollTrigger once, return a cleanup function that kills only lab-owned triggers, skip all animated setup when `prefers-reduced-motion: reduce` matches, and scope selectors to the supplied root.

- [ ] **Step 4: Run unit tests and type checking**

Run: `npm run test:unit -- tests/unit/design-lab-content.test.ts && npm run check`

Expected: PASS with no TypeScript or Astro diagnostics.

- [ ] **Step 5: Commit**

```bash
git add src/design-lab/content.ts src/design-lab/motion.ts tests/unit/design-lab-content.test.ts
git commit -m "feat: add design lab content and motion core"
```

### Task 4: Implement Poster Index and Type/Image Collision

**Files:**
- Create: `src/design-lab/concepts/PosterIndex.astro`
- Create: `src/design-lab/concepts/TypeImageCollision.astro`
- Modify: `src/pages/design-lab/[concept].astro`
- Modify: `tests/e2e/design-lab.spec.ts`

**Interfaces:**
- Consumes: `DesignLabContent`, the shared layout, and motion data attributes.
- Produces: complete pages for `/poster-index/` and `/type-image-collision/`.

- [ ] **Step 1: Add failing shared-content and geometry assertions**

For both routes assert one H1, exactly three `[data-lab-project]` elements, three `[data-lab-track]` elements, a visible contact link, and `document.documentElement.scrollWidth <= document.documentElement.clientWidth` at 390 and 1440 pixels.

- [ ] **Step 2: Run the two-route tests and verify RED**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "Poster Index|Type/Image"`

Expected: FAIL because both concept components are absent.

- [ ] **Step 3: Implement Poster Index**

Use Satoshi, espresso/bone/mint, an asymmetric two-line hero, one inline image mask, three interlocking project plates, an infinite music marquee, pinned work heading, and scale/fade media. Keep all non-image surfaces square.

- [ ] **Step 4: Implement Type/Image Collision**

Use Cabinet Grotesk, black/white, a layered editorial hero, three keyboard-operable horizontal accordion panels, a restrained music carousel, scrubbed word reveal, and scale/fade media.

- [ ] **Step 5: Run responsive tests and verify GREEN**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "Poster Index|Type/Image"`

Expected: PASS at desktop and mobile projects.

- [ ] **Step 6: Commit**

```bash
git add src/design-lab/concepts/PosterIndex.astro src/design-lab/concepts/TypeImageCollision.astro src/pages/design-lab/[concept].astro tests/e2e/design-lab.spec.ts
git commit -m "feat: add first design lab concepts"
```

### Task 5: Implement Darkroom Cinema and Printed Signal Lab

**Files:**
- Create: `src/design-lab/concepts/DarkroomCinema.astro`
- Create: `src/design-lab/concepts/PrintedSignalLab.astro`
- Modify: `src/pages/design-lab/[concept].astro`
- Modify: `tests/e2e/design-lab.spec.ts`

**Interfaces:**
- Consumes: the same shared content and motion contract as Task 4.
- Produces: complete pages for `/darkroom-cinema/` and `/printed-signal-lab/`.

- [ ] **Step 1: Add failing tests for cinematic chapters and dense grid math**

Assert Darkroom Cinema has three `[data-cinema-chapter]` sections and Printed Signal Lab has six `[data-grid-span]` elements whose desktop `grid-column-end` spans resolve to `7,5,4,8,6,6` in DOM order.

- [ ] **Step 2: Run the two-route tests and verify RED**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "Darkroom|Printed Signal"`

Expected: FAIL because the concept components are absent.

- [ ] **Step 3: Implement Darkroom Cinema**

Use Geist, full-bleed real project media, a centered maximum-three-line hero, three media chapters, a pinned project index, and a minimal listening strip. Avoid borders that turn chapters into cards.

- [ ] **Step 4: Implement Printed Signal Lab**

Use Outfit, parchment/carbon/oxide, a flat SVG moiré instrument, complete twelve-column rows, waveform music rows, scrubbed type, and stacked work plates. The SVG must use strokes and flat fills only.

- [ ] **Step 5: Run responsive tests and verify GREEN**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "Darkroom|Printed Signal"`

Expected: PASS with complete grid spans and no horizontal overflow.

- [ ] **Step 6: Commit**

```bash
git add src/design-lab/concepts/DarkroomCinema.astro src/design-lab/concepts/PrintedSignalLab.astro src/pages/design-lab/[concept].astro tests/e2e/design-lab.spec.ts
git commit -m "feat: add cinematic and print concepts"
```

### Task 6: Implement Coral Broadcast and Clau Poster Wall

**Files:**
- Create: `src/design-lab/concepts/CoralBroadcast.astro`
- Create: `src/design-lab/concepts/ClauPosterWall.astro`
- Modify: `src/pages/design-lab/[concept].astro`
- Modify: `tests/e2e/design-lab.spec.ts`

**Interfaces:**
- Consumes: the same shared content and motion contract as Task 4.
- Produces: complete pages for `/coral-broadcast/` and `/clau-poster-wall/`.

- [ ] **Step 1: Add failing tests for concentrated palettes and anti-card structure**

Assert Coral Broadcast exposes CSS variable `--broadcast-accent: #ff7777`; Clau Poster Wall exposes a solid `--poster-field` value and no `linear-gradient` or `radial-gradient` in computed hero background images; both routes contain three project links without elements matching `.card`.

- [ ] **Step 2: Run the two-route tests and verify RED**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "Coral Broadcast|Clau"`

Expected: FAIL because the concept components are absent.

- [ ] **Step 3: Implement Coral Broadcast**

Use Cabinet Grotesk, black/bone/coral, a two-line asymmetric hero, vertically cropped work transmissions, a focus-pausing title marquee, pinned active-state changes, and stacked project layers.

- [ ] **Step 4: Implement Clau Poster Wall**

Use Satoshi, solid periwinkle/black/signal green, a centered poster hero, monumental project names with inline image apertures, an anti-card poster wall, large music marquee, scrubbed text, and image scale/fade. Do not add gradients, shadows, or rounded containers.

- [ ] **Step 5: Run responsive tests and verify GREEN**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "Coral Broadcast|Clau"`

Expected: PASS with the required palette variables and no overflow.

- [ ] **Step 6: Commit**

```bash
git add src/design-lab/concepts/CoralBroadcast.astro src/design-lab/concepts/ClauPosterWall.astro src/pages/design-lab/[concept].astro tests/e2e/design-lab.spec.ts
git commit -m "feat: add broadcast and poster concepts"
```

### Task 7: Add accessibility, reduced-motion, and lab navigation coverage

**Files:**
- Modify: `tests/e2e/design-lab.spec.ts`
- Modify: `src/design-lab/motion.ts`
- Modify: `src/design-lab/styles/base.css`
- Modify: concept files only where an assertion identifies a defect.

**Interfaces:**
- Consumes: all six completed concept routes.
- Produces: verified keyboard, reduced-motion, heading, contrast, and navigation behavior.

- [ ] **Step 1: Add failing accessibility and motion assertions**

For every route, run axe, confirm exactly one H1, tab to the first navigation link and assert a visible focus indicator, emulate reduced motion and assert every project heading is visible with `opacity: 1`, then activate “Back to all concepts” and verify `/design-lab/`.

- [ ] **Step 2: Run the accessibility tests and verify RED where defects exist**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "accessibility|reduced motion|navigation"`

Expected: any failure must identify a specific semantic, focus, contrast, or animation-state defect.

- [ ] **Step 3: Implement only the fixes demonstrated by failing tests**

Keep focus outlines at least 2 CSS pixels, restore all transformed content in reduced-motion mode, and ensure interactive accordion regions use buttons with `aria-expanded` and controlled panel IDs.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npx playwright test tests/e2e/design-lab.spec.ts --grep "accessibility|reduced motion|navigation"`

Expected: PASS for every route.

- [ ] **Step 5: Commit**

```bash
git add src/design-lab src/pages/design-lab tests/e2e/design-lab.spec.ts
git commit -m "test: harden design lab accessibility"
```

### Task 8: Complete regression, visual review, and documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-08-31-personal-portfolio-design.md`
- Modify: `README.md`
- Modify: lab files only when verification demonstrates a defect.

**Interfaces:**
- Consumes: the complete lab.
- Produces: documented local viewing instructions and a verified branch ready for user review.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`

Expected: unit, Astro check/build, standard end-to-end, contact fallback, accessibility, and design-lab tests pass with no warnings.

- [ ] **Step 2: Review all routes at four widths**

Inspect the hub and six routes at 390×844, 768×1024, 1024×768, and 1440×900. Confirm no four-line desktop hero, clipped focus outline, empty dense-grid cell, unreadable media overlay, or horizontal overflow.

- [ ] **Step 3: Verify production isolation**

Compare `/`, `/work/`, `/music/`, `/about/`, and `/contact/` against the main-branch behavior. Confirm production navigation contains no design-lab link and the existing tests remain unchanged except for the new lab test file.

- [ ] **Step 4: Update durable documentation**

Document `npm run dev`, the `/design-lab/` path, the unlinked/noindex limitation, the six concept slugs, and the rule that one direction must be selected before production components are replaced.

- [ ] **Step 5: Run final verification**

Run: `git diff --check && npm test && git status --short`

Expected: no whitespace errors, all tests pass, and only intended documentation or implementation files remain uncommitted.

- [ ] **Step 6: Commit**

```bash
git add README.md docs src tests package.json package-lock.json
git commit -m "docs: finalize six-concept design lab"
```

## Self-review

- Spec coverage: all six concepts, shared content, motion, typography, accessibility, responsive behavior, GitHub Pages generation, production isolation, and comparison workflow map to Tasks 1–8.
- Placeholder scan: the plan contains no deferred implementation markers or unspecified test requests.
- Type consistency: the manifest, content adapter, layout, dynamic route, motion initializer, and test selectors use one naming contract throughout.

