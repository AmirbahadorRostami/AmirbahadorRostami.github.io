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

test('utility labels use the active bundled page family', async ({ page }) => {
  await page.goto('/design-lab/');
  for (const selector of ['.lab-label', '.concept-number', '.concept-font']) {
    await expect(page.locator(selector).first()).toHaveCSS('font-family', '"Outfit Variable", sans-serif');
  }

  await page.goto('/design-lab/poster-index/');
  await expect(page.locator('.poster-kicker')).toHaveCSS('font-family', '"Space Grotesk Variable", sans-serif');
});

for (const slug of slugs) {
  test(`${slug} is statically reachable and noindexed`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.getByRole('link', { name: 'Back to all concepts' })).toBeVisible();
  });
}

for (const [slug, title] of [
  ['poster-index', 'Poster Index'],
  ['type-image-collision', 'Type/Image Collision'],
] as const) {
  test(`${title} keeps its portfolio content visible without horizontal overflow`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/design-lab/${slug}/`);

      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('[data-lab-project]')).toHaveCount(3);
      await expect(page.locator('[data-lab-track]')).toHaveCount(3);
      await expect(page.locator('a[href="/contact/"]')).toBeVisible();
      await expect.poll(() => page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      )).toBe(true);
    }
  });
}

test('Poster Index keeps the desktop hero headline to two intentional lines', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/poster-index/');

  await expect(page.locator('.poster-hero__headline-line')).toHaveCount(2);
  await expect(page.locator('.poster-hero__headline-line').evaluateAll(
    (lines) => new Set(lines.map((line) => line.getBoundingClientRect().top)).size,
  )).resolves.toBe(2);
});

test('Poster Index pauses its marquee only when the marquee itself is hovered', async ({ page }) => {
  await page.goto('/design-lab/poster-index/');
  const marquee = page.locator('[data-poster-marquee]');
  const track = marquee.locator('[data-lab-marquee]');

  await page.mouse.move(240, 240);
  const before = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.not.toBe(before);

  await marquee.hover();
  const paused = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.toBe(paused);
});

test('Type/Image Collision places the image between hero type layers', async ({ page }) => {
  await page.goto('/design-lab/type-image-collision/');

  const background = page.locator('[data-collision-type-layer="background"]');
  const image = page.locator('.collision-hero__image');
  const foreground = page.locator('[data-collision-type-layer="foreground"]');
  await expect(background).toHaveCount(1);
  await expect(foreground).toHaveCount(1);
  await expect(image).toHaveCount(1);
  const heroChildren = await page.locator('.collision-hero').evaluate((hero) => Array.from(hero.children).map(
    (child) => child.getAttribute('data-collision-type-layer') ?? child.className,
  ));
  expect(heroChildren.indexOf('background')).toBeLessThan(heroChildren.indexOf('collision-hero__image'));
  expect(heroChildren.indexOf('collision-hero__image')).toBeLessThan(heroChildren.indexOf('foreground'));
});

test('Type/Image Collision restores the complete shared identity and scrub targets', async ({ page }) => {
  await page.goto('/design-lab/type-image-collision/');

  await expect(page.getByText('Creative technologist. Musician. Professional maker of curious things.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-lab-scrub-reveal]')).toHaveCount(3);
});

test('Darkroom Cinema presents three cinematic project chapters', async ({ page }) => {
  await page.goto('/design-lab/darkroom-cinema/');

  await expect(page.locator('[data-cinema-chapter]')).toHaveCount(3);
});

test('Darkroom Cinema preserves the exact approved identity', async ({ page }) => {
  await page.goto('/design-lab/darkroom-cinema/');

  await expect(page.locator('#darkroom-title')).toHaveText(
    'Creative technologist. Musician. Professional maker of curious things.',
  );
});

test('Darkroom Cinema uses spacing and typography without borders or item panels', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/design-lab/darkroom-cinema/');

    await expect(page.locator('.darkroom, .darkroom *').evaluateAll((elements) => elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const borders = [
        ['top', style.borderTopWidth, style.borderTopStyle],
        ['right', style.borderRightWidth, style.borderRightStyle],
        ['bottom', style.borderBottomWidth, style.borderBottomStyle],
        ['left', style.borderLeftWidth, style.borderLeftStyle],
      ];
      const borderedSides = borders.filter(([, borderWidth, borderStyle]) => (
        Number.parseFloat(borderWidth) > 0 && borderStyle !== 'none'
      )).map(([side]) => side);

      return borderedSides.length
        ? [`${element.tagName.toLowerCase()}.${element.className}:${borderedSides.join(',')}`]
        : [];
    }))).resolves.toEqual([]);

    await expect(page.locator(
      '.darkroom-work__index a, .darkroom-listening a, .darkroom-experience li',
    ).evaluateAll((elements) => elements.map(
      (element) => getComputedStyle(element).backgroundColor,
    ))).resolves.toEqual([
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0)',
    ]);
  }
});

test('Printed Signal Lab packs its technical sheet into complete twelve-column rows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/printed-signal-lab/');

  await expect(page.locator('[data-grid-span]')).toHaveCount(6);
  await expect(page.locator('[data-grid-span]').evaluateAll((elements) => elements.map(
    (element) => getComputedStyle(element).gridColumnEnd,
  ))).resolves.toEqual(['span 7', 'span 5', 'span 4', 'span 8', 'span 6', 'span 6']);
});

for (const [slug, title] of [
  ['darkroom-cinema', 'Darkroom Cinema'],
  ['printed-signal-lab', 'Printed Signal Lab'],
] as const) {
  test(`${title} keeps the approved portfolio content visible without horizontal overflow`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/design-lab/${slug}/`);

      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('[data-lab-project]')).toHaveCount(3);
      await expect(page.locator('[data-lab-track]')).toHaveCount(3);
      await expect(page.locator('#experience li')).toHaveCount(3);
      await expect(page.locator('a[href="/contact/"]')).toBeVisible();
      await expect.poll(() => page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      )).toBe(true);
    }
  });
}

test('Coral Broadcast keeps its coral signal concentrated and card-free', async ({ page }) => {
  await page.goto('/design-lab/coral-broadcast/');

  await expect(page.locator('[data-coral-broadcast]').evaluate((element) => (
    getComputedStyle(element).getPropertyValue('--broadcast-accent').trim()
  ))).resolves.toBe('#ff7777');
  await expect(page.locator('[data-lab-project]')).toHaveCount(3);
  await expect(page.locator('.card')).toHaveCount(0);
});

test('Clau Poster Wall keeps its field solid and card-free', async ({ page }) => {
  await page.goto('/design-lab/clau-poster-wall/');

  await expect(page.locator('[data-clau-poster-wall]').evaluate((element) => (
    getComputedStyle(element).getPropertyValue('--poster-field').trim()
  ))).resolves.toBeTruthy();
  await expect(page.locator('.clau-hero').evaluate((element) => (
    getComputedStyle(element).backgroundImage
  ))).resolves.toBe('none');
  await expect(page.locator('[data-lab-project]')).toHaveCount(3);
  await expect(page.locator('.card')).toHaveCount(0);
});

test('Clau Poster Wall pauses its marquee only inside its own hover or focus region', async ({ page }) => {
  await page.goto('/design-lab/clau-poster-wall/');
  const marquee = page.getByLabel('Moving featured music titles');
  const track = marquee.locator('[data-lab-marquee]');

  await page.mouse.move(16, 16);
  const before = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.not.toBe(before);

  await marquee.hover();
  const hoverPaused = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.toBe(hoverPaused);

  await page.mouse.move(16, 16);
  await marquee.evaluate((element) => (element as HTMLElement).focus());
  const focusPaused = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.toBe(focusPaused);
});

test('Clau Poster Wall scrubs individual project words around their image apertures', async ({ page }) => {
  await page.goto('/design-lab/clau-poster-wall/');

  await expect(page.locator('.clau-project h3[data-lab-scrub-reveal]')).toHaveCount(0);
  await expect(page.locator('.clau-project h3 [data-lab-scrub-reveal]')).toHaveCount(5);
  await expect(page.locator('.clau-project__aperture')).toHaveCount(3);
});

test('Coral Broadcast recomputes its active project when scrolling backward', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/coral-broadcast/');
  const projectTops = await page.locator('[data-broadcast-project]').evaluateAll((elements) => elements.map(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  ));

  await page.evaluate((top) => window.scrollTo({ top }), projectTops[2]);
  await expect(page.locator('[data-broadcast-index-link]').nth(2)).toHaveAttribute('data-active', '');

  await page.evaluate((top) => window.scrollTo({ top }), projectTops[0]);
  await expect(page.locator('[data-broadcast-index-link]').nth(0)).toHaveAttribute('data-active', '');
  await expect(page.locator('[data-broadcast-index-link]').nth(2)).not.toHaveAttribute('data-active', '');
});

test('Coral Broadcast and Clau Poster Wall expose exactly three project anchors', async ({ page }) => {
  await page.goto('/design-lab/coral-broadcast/');
  await expect(page.locator('[data-broadcast-projects] a[href^="/work/"]')).toHaveCount(3);

  await page.goto('/design-lab/clau-poster-wall/');
  await expect(page.locator('[data-clau-project-wall] a[href^="/work/"]')).toHaveCount(3);
});

for (const [slug, title] of [
  ['coral-broadcast', 'Coral Broadcast'],
  ['clau-poster-wall', 'Clau Poster Wall'],
] as const) {
  test(`${title} preserves complete content without horizontal overflow`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/design-lab/${slug}/`);

      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const projectCollection = slug === 'coral-broadcast'
        ? page.locator('[data-broadcast-projects]')
        : page.locator('[data-clau-project-wall]');
      await expect(projectCollection.locator('a[href^="/work/"]')).toHaveCount(3);
      await expect(page.locator('[data-lab-track]')).toHaveCount(3);
      await expect(page.locator('#experience li')).toHaveCount(3);
      await expect(page.locator('a[href="/contact/"]')).toBeVisible();
      await expect.poll(() => page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      )).toBe(true);
    }
  });
}
