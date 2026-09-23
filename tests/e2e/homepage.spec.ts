import { expect, test } from '@playwright/test';
import {
  findProjectCardGeometryViolations,
  measureProjectCards,
} from './helpers/project-card-geometry';

const sectionOrder = [
  'hero',
  'selected-work',
  'selected-music',
  'experience',
  'experiments-invitation',
  'contact-invitation',
];

test('homepage presents the approved Darkroom narrative', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Part engineer. Part musician. Entirely too curious.',
  );
  await expect(page.locator('#hero')).toContainText(
    'I design and build interactive systems, immersive artworks, and digital experiences that explore how technology can change the way people connect.',
  );
  await expect(page.locator('#hero')).toContainText('Toronto, Canada');
  await expect(page.locator('#hero')).toContainText('Open to employment and freelance work.');
  await expect(page.locator('#hero').getByRole('link', { name: "See what I've been building" })).toHaveAttribute(
    'href',
    '#selected-work',
  );
  await expect(page.locator('#hero').getByRole('link', { name: 'Work with me' })).toHaveAttribute(
    'href',
    '/contact/',
  );

  const sections = await page
    .locator('main > section')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(sections).toEqual(sectionOrder);
});

test('hero keeps its readable content before the decorative field in document order', async ({ page }) => {
  await page.goto('/');

  const contentPrecedesField = await page.locator('#hero').evaluate((hero) => {
    const content = hero.querySelector('.hero__content');
    const field = hero.querySelector('[data-ten-print]');

    if (!content || !field) throw new Error('Hero content or decorative field is missing.');

    return Boolean(content.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING);
  });

  expect(contentPrecedesField).toBe(true);
});

test('homepage facts and both actions remain inside representative first viewports', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1280, height: 720 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const facts = await page.locator('#hero .hero__facts').boundingBox();
    const actions = page.locator('#hero .hero__actions a');

    await expect(actions).toHaveCount(2);
    await expect(actions.first()).toHaveAttribute('href', '#selected-work');
    await expect(actions.last()).toHaveAttribute('href', '/contact/');
    expect(facts, JSON.stringify(viewport)).not.toBeNull();
    expect(facts!.y + facts!.height, JSON.stringify(viewport)).toBeLessThanOrEqual(viewport.height);

    for (const action of await actions.all()) {
      const box = await action.boundingBox();
      expect(box, JSON.stringify(viewport)).not.toBeNull();
      expect(box!.y + box!.height, JSON.stringify(viewport)).toBeLessThanOrEqual(viewport.height);
    }
  }
});

test('homepage renders the exact selected work and music inventories', async ({ page }) => {
  await page.goto('/');

  const selectedProjects = page.locator('#selected-work [data-project-card]');
  await expect(page.locator('#selected-work').getByRole('heading', { level: 2 }).first()).toHaveText(
    'Things to enter, follow, swing, listen to, and occasionally get lost inside.',
  );
  await expect(page.locator('#selected-work')).toContainText(
    'Interactive installations, augmented worlds, living simulations, and the technical systems that make them possible.',
  );
  await expect(selectedProjects).toHaveCount(3);
  await expect(selectedProjects.getByRole('heading', { level: 2 })).toHaveText([
    'Encounters',
    'Luminous Trails',
    'Ephemeral Pulses',
  ]);

  const selectedMusic = page.locator('#selected-music [data-music-card]');
  await expect(page.locator('#selected-music').getByRole('heading', { level: 2 })).toHaveText(
    'Music by Baha',
  );
  await expect(selectedMusic).toHaveCount(3);
  await expect(selectedMusic.getByRole('heading', { level: 3 })).toHaveText([
    'Float',
    'Flow',
    'La Paloma',
  ]);
  await expect(page.locator('#selected-music [data-music-gateway]')).toHaveCount(1);
  await expect(page.locator('#selected-music [data-music-gateway]')).toHaveAttribute(
    'href',
    '/music/',
  );
  await expect(page.locator('#selected-music [data-music-grid] [data-music-gateway]')).toHaveCount(0);
});

test('selected work and music use wrapping grid layouts instead of horizontal strips', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const desktopLayouts = await page.evaluate(() => {
    const measure = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      return {
        columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
        display: getComputedStyle(element).display,
        overflows: element.scrollWidth > element.clientWidth,
      };
    };

    return {
      work: measure('#selected-work .project-grid'),
      music: measure('#selected-music [data-music-grid]'),
    };
  });

  expect(desktopLayouts.work).toEqual({ columns: 3, display: 'grid', overflows: false });
  expect(desktopLayouts.music).toEqual({ columns: 3, display: 'grid', overflows: false });
  const projectWidths = await page.locator('#selected-work .project-grid > li').evaluateAll(
    (items) => items.map((item) => item.getBoundingClientRect().width),
  );
  expect(projectWidths[0]).toBeGreaterThan(projectWidths[1] * 1.5);
  expect(projectWidths[2]).toBeGreaterThan(projectWidths[1] * 1.5);

  await page.setViewportSize({ width: 390, height: 844 });

  const mobileLayouts = await page.evaluate(() => {
    const measure = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      return {
        columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
        overflows: element.scrollWidth > element.clientWidth,
      };
    };

    return {
      work: measure('#selected-work .project-grid'),
      music: measure('#selected-music [data-music-grid]'),
    };
  });

  expect(mobileLayouts.work).toEqual({ columns: 1, overflows: false });
  expect(mobileLayouts.music).toEqual({ columns: 1, overflows: false });
});

test('selected work cards keep compact 4:3 image geometry on desktop and mobile', async ({ page }) => {
  const measurements = await measureProjectCards(page, '/', '#selected-work');
  const violations = findProjectCardGeometryViolations(measurements);

  expect(violations, JSON.stringify(measurements, null, 2)).toEqual([]);
});

test('experience preview and closing invitations preserve the approved content and links', async ({ page }) => {
  await page.goto('/');

  const experienceEntries = page.locator('#experience [data-experience-entry]');
  await expect(experienceEntries).toHaveCount(3);
  await expect(experienceEntries.locator('[data-experience-organization]')).toHaveText([
    'Product Madness',
    'Artifacts Lab',
    'Antimodular Research',
  ]);

  const experiments = page.locator('#experiments-invitation');
  await expect(experiments.getByRole('heading', { level: 2 })).toHaveText(
    'Small systems making big, strange pictures.',
  );
  await expect(experiments).toContainText(
    'A collection of generative video studies built from cellular automata, simulations, procedural rules, and other algorithms left alone long enough to become interesting.',
  );
  await expect(experiments.getByRole('link')).toHaveAttribute('href', '/experiments/');

  const contact = page.locator('#contact-invitation');
  await expect(contact.getByRole('heading', { level: 2 })).toHaveText(
    'Have a role, a commission, or a strange problem worth solving?',
  );
  await expect(contact).toContainText(
    "I'm open to employment, freelance collaborations, exhibitions, commissions, and residencies. Tell me what you're working on, what you need, and where you think I might fit.",
  );
  await expect(contact.getByRole('link', { name: 'Send the signal' })).toHaveAttribute(
    'href',
    '/contact/',
  );
});

test('10 PRINT retains its static art without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');

  const field = page.locator('[data-ten-print]');
  await expect(field).toHaveAttribute('aria-hidden', 'true');
  await expect(field).toHaveAttribute('data-render-state', 'fallback');
  await expect(field.locator('img')).toBeVisible();
  expect(await field.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

  await context.close();
});

test('10 PRINT renders a complete still field under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const field = page.locator('[data-ten-print]');
  await expect(field).toHaveAttribute('data-motion', 'reduced');
  await expect(field).toHaveAttribute('data-render-state', 'ready');
  await expect(field.locator('canvas')).toBeVisible();
  await expect(field.locator('img')).toBeHidden();
});

test('10 PRINT preserves the static image when graphics initialization fails', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/');

  const field = page.locator('[data-ten-print]');
  await expect(field).toHaveAttribute('data-render-state', 'error');
  await expect(field.locator('img')).toBeVisible();
});

test('10 PRINT pauses offscreen and resumes without restarting its field', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('[data-ten-print]');
  await expect(field).toHaveAttribute('data-render-state', 'ready');
  const canvas = field.locator('canvas');
  const initialPixels = await canvas.evaluate((element: HTMLCanvasElement) => ({ width: element.width, height: element.height }));
  expect(initialPixels.width).toBeGreaterThan(0);
  expect(initialPixels.height).toBeGreaterThan(0);

  await page.locator('#contact-invitation').scrollIntoViewIfNeeded();
  await expect(field).toHaveAttribute('data-render-state', 'paused');

  await field.scrollIntoViewIfNeeded();
  await expect(field).toHaveAttribute('data-render-state', 'ready');
  expect(await canvas.evaluate((element: HTMLCanvasElement) => ({ width: element.width, height: element.height })))
    .toEqual(initialPixels);
});

test('10 PRINT defers resize work offscreen and redraws on return', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');

  const field = page.locator('[data-ten-print]');
  await expect(field).toHaveAttribute('data-render-state', 'ready');
  const canvas = field.locator('canvas');
  const originalWidth = await canvas.evaluate((element: HTMLCanvasElement) => element.width);

  await page.locator('#contact-invitation').scrollIntoViewIfNeeded();
  await expect(field).toHaveAttribute('data-render-state', 'paused');
  await page.setViewportSize({ width: 800, height: 600 });
  await page.waitForTimeout(200);
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.width)).toBe(originalWidth);

  await field.scrollIntoViewIfNeeded();
  await expect(field).toHaveAttribute('data-render-state', 'ready');
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.width)).toBeLessThan(originalWidth);
});
