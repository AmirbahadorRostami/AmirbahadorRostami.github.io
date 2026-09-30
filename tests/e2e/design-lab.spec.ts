import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator } from '@playwright/test';
import { findFocusClippingViolations } from './helpers/focus-clipping';

const slugs = [
  'poster-index',
  'type-image-collision',
  'darkroom-cinema',
  'printed-signal-lab',
  'coral-broadcast',
  'clau-poster-wall',
];

const requiredContent = [
  'Creative tinkerer. Musician. Professional maker of curious things.',
  'I create immersive experiences, software, and sound that bring people together in unexpected ways.',
  'Toronto',
  'Open to employment and freelance work.',
  'Encounters',
  'Luminous Trails',
  'Remote Realities',
  'Float',
  'Flow',
  'La Paloma',
  'Mobile Software Engineer',
  'Co-Founder and Lead Engineer',
  'R&D Software Engineer',
];

const requiredProjectImageAlts = [
  'A luminous letter E floating above layered blue lines in the Encounters artwork',
  'A luminous figure surrounded by neon-colored wireframe terrain and glowing sculptural forms',
  'A visitor beside a suspended translucent installation in a blue-lit gallery',
];

const conceptNavigationLabels = ['Back to all concepts', 'Work', 'Music', 'Experience', 'Contact'];

async function contrastRatio(target: Locator, background: Locator): Promise<number> {
  return target.evaluate((element, backgroundElement) => {
    const parse = (color: string) => color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
    const luminance = (color: string) => {
      const channels = parse(color).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const style = getComputedStyle(element);
    const foreground = luminance(style.color);
    const targetBackground = style.backgroundColor;
    const paintedBackground = (start: Element) => {
      let current: Element | null = start;
      while (current) {
        const color = getComputedStyle(current).backgroundColor;
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
        current = current.parentElement;
      }
      return 'rgb(255, 255, 255)';
    };
    const surfaceColor = targetBackground === 'rgba(0, 0, 0, 0)' || targetBackground === 'transparent'
      ? paintedBackground(backgroundElement as Element)
      : targetBackground;
    const surface = luminance(surfaceColor);
    return (Math.max(foreground, surface) + 0.05) / (Math.min(foreground, surface) + 0.05);
  }, await background.elementHandle());
}

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

for (const slug of slugs) {
  test(`${slug} accessibility has no serious or critical Axe violations`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);

    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter(
      ({ impact }) => impact === 'critical' || impact === 'serious',
    );

    expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);
  });

  test(`${slug} accessibility keeps the skip link, semantic headings, and descriptive local images`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const headingLevels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((headings) => headings.map(
      (heading) => Number.parseInt(heading.tagName.slice(1), 10),
    ));
    expect(headingLevels[0]).toBe(1);
    expect(headingLevels.every((level, index) => index === 0 || level <= headingLevels[index - 1] + 1)).toBe(true);

    await expect(page.locator('[data-lab-project] img').evaluateAll((images) => images.map(
      (image) => image.getAttribute('alt'),
    ))).resolves.toEqual(requiredProjectImageAlts);

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test(`${slug} navigation exposes every section and a visible focus indicator`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);
    const navigation = page.getByRole('navigation', { name: 'Design lab' });

    for (const label of conceptNavigationLabels) {
      await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible();
    }

    const firstNavigationLink = navigation.getByRole('link').first();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(firstNavigationLink).toBeFocused();
    const focusStyle = await firstNavigationLink.evaluate((link) => {
      const style = getComputedStyle(link);
      return { outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth) };
    });
    expect(focusStyle.outlineStyle).not.toBe('none');
    expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  });

  test(`${slug} navigation returns to the concept hub`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);
    await page.getByRole('link', { name: 'Back to all concepts', exact: true }).click();
    await expect(page).toHaveURL(/\/design-lab\/$/);
  });

  test(`${slug} reduced motion keeps projects readable and continuous marquees static`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/design-lab/${slug}/`);

    const hiddenProjects = await page.locator('[data-lab-project]').evaluateAll((projects) => projects.flatMap((project) => (
      Array.from(project.querySelectorAll<HTMLElement>('h3, button, a')).flatMap((target) => {
        if (target.closest('[hidden]')) return [];
        const style = getComputedStyle(target);
        return style.opacity !== '1' || style.transform !== 'none' || !target.checkVisibility()
          ? [{ text: target.textContent?.trim(), opacity: style.opacity, transform: style.transform }]
          : [];
      })
    )));
    expect(hiddenProjects, JSON.stringify(hiddenProjects)).toEqual([]);

    const marqueeTransforms = await page.locator('[data-lab-marquee]').evaluateAll((marquees) => marquees.map(
      (marquee) => getComputedStyle(marquee).transform,
    ));
    expect(marqueeTransforms).toEqual(Array.from({ length: marqueeTransforms.length }, () => 'none'));
    await expect(page.locator('.pin-spacer, .gsap-pin-spacer')).toHaveCount(0);

    const nonStaticMotionLayout = await page.locator('[data-lab-pin], [data-lab-stack]').evaluateAll((elements) => elements.flatMap((element) => {
      if (element.closest('[hidden]')) return [];
      const style = getComputedStyle(element);
      return style.position !== 'static' || style.opacity !== '1' || style.transform !== 'none'
        ? [{ position: style.position, opacity: style.opacity, transform: style.transform }]
        : [];
    }));
    expect(nonStaticMotionLayout, JSON.stringify(nonStaticMotionLayout)).toEqual([]);
  });
}

test('every concept music section links to the full music archive', async ({ page }) => {
  for (const slug of slugs) {
    await page.goto(`/design-lab/${slug}/`);
    const musicSection = page.locator('#music');
    const archiveLink = musicSection.getByRole('link', { name: /full music archive/i });
    await expect(archiveLink, slug).toHaveAttribute('href', '/music/');
  }
});

for (const slug of slugs) {
  test(`${slug} retains the complete approved portfolio content`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);
    const routeText = (await page.locator('body').textContent() ?? '').replace(/\s+/g, ' ');

    for (const content of requiredContent) expect(routeText).toContain(content);
  });
}

for (const slug of ['coral-broadcast', 'clau-poster-wall'] as const) {
  test(`${slug} exposes its focus-to-pause marquee as a named region`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/design-lab/${slug}/`);

    const marquee = page.getByRole('region', { name: 'Moving featured music titles' });
    await expect(marquee).toBeVisible();
    const rect = await marquee.evaluate((element) => element.getBoundingClientRect());
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);
  });
}

test('non-Type/Image scrub reveals still begin with an opacity reveal', async ({ page }) => {
  await page.goto('/design-lab/printed-signal-lab/');
  const opacity = await page.locator('[data-lab-scrub-reveal]').first().evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).opacity),
  );
  expect(opacity).toBeLessThan(1);
});

test('Type/Image Collision marks its headline reveals as contrast-safe', async ({ page }) => {
  await page.goto('/design-lab/type-image-collision/');
  await expect(page.locator('[data-lab-contrast-safe-reveal]')).toHaveCount(3);
  await expect(page.locator('[data-lab-contrast-safe-reveal]').evaluateAll((targets) => targets.map(
    (target) => getComputedStyle(target).opacity,
  ))).resolves.toEqual(['1', '1', '1']);
});

test('Type/Image Collision accordion controls describe and control their panels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design-lab/type-image-collision/');

  const controls = page.locator('[data-collision-accordion] button');
  await expect(controls).toHaveCount(3);
  const malformedControls = await controls.evaluateAll((buttons) => buttons.flatMap((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
    const rect = button.getBoundingClientRect();
    return button.getAttribute('aria-expanded') === null || !panel || panel.getAttribute('aria-labelledby') !== button.id
      || rect.width < 44 || rect.height < 44
      ? [{ label: button.textContent?.trim(), width: rect.width, height: rect.height }]
      : [];
  }));
  expect(malformedControls, JSON.stringify(malformedControls)).toEqual([]);

  const panels = page.locator('[data-collision-accordion] [role="region"]');
  await expect(panels.nth(0)).toBeVisible();
  await expect(panels.nth(1)).toBeHidden();
  await controls.nth(1).click();
  await expect(panels.nth(0)).toBeHidden();
  await expect(panels.nth(1)).toBeVisible();
  await controls.nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(panels.nth(1)).toBeHidden();
  await expect(panels.nth(2)).toBeVisible();
});

test('Type/Image Collision keeps project content available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/design-lab/type-image-collision/');

  const panels = page.locator('[data-collision-accordion] [role="region"]');
  await expect(panels).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) await expect(panels.nth(index)).toBeVisible();
  await context.close();
});

test('Poster Index pinning responds to the 900px breakpoint and cleans up', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/poster-index/');
  await expect(page.locator('.pin-spacer, .gsap-pin-spacer')).toHaveCount(1);

  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.locator('.pin-spacer, .gsap-pin-spacer')).toHaveCount(0);
  await page.setViewportSize({ width: 901, height: 900 });
  await expect(page.locator('.pin-spacer, .gsap-pin-spacer')).toHaveCount(1);

  const track = page.locator('[data-poster-marquee] [data-lab-marquee]');
  await page.evaluate(() => document.dispatchEvent(new Event('astro:before-swap')));
  await expect(page.locator('.pin-spacer, .gsap-pin-spacer')).toHaveCount(0);
  const stopped = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.toBe(stopped);
});

test('Coral Broadcast removes its sticky stack in reduced-motion mode', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/coral-broadcast/');
  await expect(page.locator('[data-broadcast-project]').evaluateAll((projects) => projects.map(
    (project) => getComputedStyle(project).position,
  ))).resolves.toEqual(['relative', 'relative', 'relative']);
  const misplacedOverlays = await page.locator('[data-broadcast-project]').evaluateAll((projects) => projects.flatMap((project) => {
    const projectBox = project.getBoundingClientRect();
    const overlayBox = project.querySelector<HTMLElement>('.broadcast-project__copy')?.getBoundingClientRect();
    if (!overlayBox) return ['missing overlay'];
    return overlayBox.top >= projectBox.top - 1
      && overlayBox.right <= projectBox.right + 1
      && overlayBox.bottom <= projectBox.bottom + 1
      && overlayBox.left >= projectBox.left - 1
      ? []
      : ['overlay outside project'];
  }));
  expect(misplacedOverlays).toEqual([]);
});

test('interactive color states retain AA text contrast', async ({ page }) => {
  await page.goto('/design-lab/poster-index/');
  const posterLink = page.locator('[data-poster-marquee] a').first();
  await posterLink.hover({ force: true });
  expect(await contrastRatio(posterLink, page.locator('.poster-marquee'))).toBeGreaterThanOrEqual(4.5);
  await posterLink.focus();
  expect(await contrastRatio(posterLink, page.locator('.poster-marquee'))).toBeGreaterThanOrEqual(4.5);

  await page.goto('/design-lab/coral-broadcast/');
  const coralLink = page.locator('.broadcast-tracks a').first();
  const coralText = coralLink.locator('strong');
  await coralLink.hover();
  expect(await contrastRatio(coralText, page.locator('.broadcast-music'))).toBeGreaterThanOrEqual(4.5);
  await coralLink.focus();
  expect(await contrastRatio(coralText, page.locator('.broadcast-music'))).toBeGreaterThanOrEqual(4.5);

  await page.goto('/design-lab/clau-poster-wall/');
  const clauLink = page.locator('.clau-project h3 a').first();
  await clauLink.hover();
  expect(await contrastRatio(clauLink, page.locator('.clau-work'))).toBeGreaterThanOrEqual(4.5);
  await clauLink.focus();
  expect(await contrastRatio(clauLink, page.locator('.clau-work'))).toBeGreaterThanOrEqual(4.5);
});

for (const slug of ['coral-broadcast', 'clau-poster-wall'] as const) {
  test(`${slug} mobile marquee control meets the 44px target minimum`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/design-lab/${slug}/`);

    const undersizedControls = await page.locator('[data-lab-marquee]').evaluateAll((marquees) => marquees.map((marquee) => {
      const control = marquee.parentElement as HTMLElement;
      const rect = control.getBoundingClientRect();
      return { label: control.getAttribute('aria-label'), width: rect.width, height: rect.height };
    }).filter(({ width, height }) => width < 44 || height < 44));
    expect(undersizedControls, JSON.stringify(undersizedControls)).toEqual([]);
  });
}

test('concept navigation links meet the 44px mobile target minimum', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const slug of slugs) {
    await page.goto(`/design-lab/${slug}/`);
    const undersizedLinks = await page.getByRole('navigation', { name: 'Design lab' }).locator('a').evaluateAll((links) => links.map((link) => {
      const rect = link.getBoundingClientRect();
      return { label: link.textContent?.trim(), width: rect.width, height: rect.height };
    }).filter(({ width, height }) => width < 44 || height < 44));
    expect(undersizedLinks, `${slug}: ${JSON.stringify(undersizedLinks)}`).toEqual([]);
  }
});

test('design-lab focus rings stay inside clipping boundaries at every review viewport', async ({ page }) => {
  test.setTimeout(120_000);
  const routes = ['/design-lab/', ...slugs.map((slug) => `/design-lab/${slug}/`)];
  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ];
  const failures = [];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    for (const route of routes) {
      await page.goto(route);
      const clippedFocusRings = await findFocusClippingViolations(page);
      if (clippedFocusRings.length > 0) {
        failures.push({ route, viewport, clippedFocusRings });
      }
    }
  }

  expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
});

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

  await expect(page.getByText('Creative tinkerer. Musician. Professional maker of curious things.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-lab-contrast-safe-reveal]')).toHaveCount(3);
});

test('Type/Image Collision uses expanding horizontal work panels and overlapping square music art on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/type-image-collision/');

  await expect(page.locator('.collision-accordions')).toHaveCSS('display', 'flex');
  const projects = page.locator('.collision-project');
  const widths = await projects.evaluateAll((elements) => elements.map(
    (element) => element.getBoundingClientRect().width,
  ));
  expect(widths[0]).toBeGreaterThan(widths[1] * 2);

  const thumbnails = page.locator('.collision-track-thumbnail');
  await expect(thumbnails).toHaveCount(3);
  const boxes = await thumbnails.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
  }));
  expect(boxes.every(({ width, height }) => Math.abs(width - height) < 1)).toBe(true);
  expect(boxes[1].left).toBeLessThan(boxes[0].right);
  expect(boxes[2].left).toBeLessThan(boxes[1].right);
});

test('Type/Image Collision returns its accordion and music art to a readable mobile flow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design-lab/type-image-collision/');

  await expect(page.locator('.collision-accordions')).toHaveCSS('display', 'block');
  const projectTops = await page.locator('.collision-project').evaluateAll((elements) => elements.map(
    (element) => element.getBoundingClientRect().top,
  ));
  expect(projectTops[0]).toBeLessThan(projectTops[1]);
  expect(projectTops[1]).toBeLessThan(projectTops[2]);
  await expect(page.locator('.collision-track-thumbnail')).toHaveCount(3);
});

test('Darkroom Cinema presents three cinematic project chapters', async ({ page }) => {
  await page.goto('/design-lab/darkroom-cinema/');

  await expect(page.locator('[data-cinema-chapter]')).toHaveCount(3);
});

test('Darkroom Cinema preserves the exact approved identity', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design-lab/darkroom-cinema/');

  await expect(page.locator('#darkroom-title')).toHaveText(
    'Creative tinkerer. Musician. Professional maker of curious things.',
  );
  const overflowingLines = await page.locator('#darkroom-title > span').evaluateAll((lines) => lines.flatMap((line) => {
    const text = line.firstChild;
    if (!text) return [];
    const range = document.createRange();
    range.selectNodeContents(text);
    const textBox = range.getBoundingClientRect();
    return textBox.left < -1 || textBox.right > window.innerWidth + 1
      ? [line.textContent?.trim()]
      : [];
  }));
  expect(overflowingLines).toEqual([]);
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
