import { expect, test } from '@playwright/test';

const sectionOrder = [
  'hero',
  'selected-work',
  'selected-music',
  'experience',
  'contact-invitation',
];

test('homepage presents the approved narrative order and introduction', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Creative tinkerer. Musician. Professional maker of curious things.',
  );
  await expect(page.locator('#hero')).toContainText(
    'I create immersive experiences, software, and sound that bring people together in unexpected ways.',
  );

  const sections = await page
    .locator('main > section')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(sections).toEqual(sectionOrder);
});

test('homepage renders the exact selected work and music inventories', async ({ page }) => {
  await page.goto('/');

  const selectedProjects = page.locator('#selected-work [data-project-card]');
  await expect(selectedProjects).toHaveCount(3);
  await expect(selectedProjects.getByRole('heading', { level: 2 })).toHaveText([
    'Encounters',
    'Luminous Trails',
    'Remote Realities',
  ]);

  const selectedMusic = page.locator('#selected-music [data-music-card]');
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
});

test('selected work and music use wrapping grid layouts instead of horizontal strips', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
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
  expect(desktopLayouts.music).toEqual({ columns: 2, display: 'grid', overflows: false });

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

test('experience preview stays focused and the contact invitation welcomes the full opportunity set', async ({ page }) => {
  await page.goto('/');

  const experienceEntries = page.locator('#experience [data-experience-entry]');
  await expect(experienceEntries).toHaveCount(3);
  await expect(experienceEntries.locator('[data-experience-organization]')).toHaveText([
    'Product Madness',
    'Artifacts Lab',
    'Antimodular Research',
  ]);

  const contact = page.locator('#contact-invitation');
  await expect(contact.getByRole('heading', { level: 2 })).toContainText(/employment/i);
  await expect(contact.getByRole('heading', { level: 2 })).toContainText(/freelance/i);
  await expect(contact).toContainText(/commissions/i);
  await expect(contact).toContainText(/exhibitions/i);
  await expect(contact).toContainText(/residencies/i);
  await expect(contact.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
    'href',
    '/contact/',
  );
});

test('SignalField is decorative and defaults to a static no-JavaScript state', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');

  const signalField = page.locator('[data-signal-field]');
  await expect(signalField).toHaveAttribute('aria-hidden', 'true');
  await expect(signalField).toHaveAttribute('data-animation-state', 'static');
  await expect(signalField.locator('[data-signal-orb]').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );

  await context.close();
});

test('SignalField follows intersection and live reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const signalField = page.locator('[data-signal-field]');
  const firstOrb = signalField.locator('[data-signal-orb]').first();
  await expect(signalField).toHaveAttribute('data-animation-state', 'static');
  await expect(firstOrb).toHaveCSS('animation-play-state', 'paused');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await signalField.scrollIntoViewIfNeeded();
  await expect(signalField).toHaveAttribute('data-animation-state', 'running');
  await expect(firstOrb).toHaveCSS('animation-play-state', 'running');

  await page.locator('#contact-invitation').scrollIntoViewIfNeeded();
  await expect(signalField).toHaveAttribute('data-animation-state', 'paused');
  await expect(firstOrb).toHaveCSS('animation-play-state', 'paused');

  await signalField.scrollIntoViewIfNeeded();
  await expect(signalField).toHaveAttribute('data-animation-state', 'running');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(signalField).toHaveAttribute('data-animation-state', 'static');
  await expect(firstOrb).toHaveCSS('animation-play-state', 'paused');
});
