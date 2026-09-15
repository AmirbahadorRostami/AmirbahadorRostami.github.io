import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const slugs = [
  'poster-index',
  'type-image-collision',
  'darkroom-cinema',
  'printed-signal-lab',
  'coral-broadcast',
  'clau-poster-wall',
];

const requiredContent = [
  'Professional maker of curious things',
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
  'A person holding a phone at night among luminous trails near the CN Tower',
  'A visitor beside a suspended translucent installation in a blue-lit gallery',
];

const conceptNavigationLabels = ['Back to all concepts', 'Work', 'Music', 'Experience', 'Contact'];

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
      const style = getComputedStyle(element);
      return style.position !== 'static' || style.opacity !== '1' || style.transform !== 'none'
        ? [{ position: style.position, opacity: style.opacity, transform: style.transform }]
        : [];
    }));
    expect(nonStaticMotionLayout, JSON.stringify(nonStaticMotionLayout)).toEqual([]);
  });
}

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

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    for (const route of routes) {
      await page.goto(route);
      const clippedFocusRings = await page.locator('body').evaluate(async () => {
        const focusables = Array.from(document.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ));
        const clipped = [];

        for (const element of focusables) {
          if (!element.checkVisibility()) continue;
          element.scrollIntoView({ block: 'center', inline: 'center' });
          element.focus();
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

          const style = getComputedStyle(element);
          const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
          const outlineOffset = Number.parseFloat(style.outlineOffset) || 0;
          const label = element.getAttribute('aria-label')
            ?? element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80)
            ?? element.tagName;
          if (style.outlineStyle === 'none' || outlineWidth < 2) {
            clipped.push({ label, outlineWidth, outlineOffset, clippingAncestor: 'missing visible outline' });
            continue;
          }

          const extent = Math.max(0, outlineWidth + outlineOffset);
          if (extent === 0) continue;
          const ring = element.getBoundingClientRect();

          const viewportClipsHorizontally = ring.width <= window.innerWidth
            && (ring.left - extent < 0 || ring.right + extent > window.innerWidth);
          const viewportClipsVertically = ring.height <= window.innerHeight
            && (ring.top - extent < 0 || ring.bottom + extent > window.innerHeight);

          let ancestor = element.parentElement;
          let ancestorClips = false;
          let clippingAncestor = '';
          while (ancestor && ancestor !== document.body) {
            const ancestorStyle = getComputedStyle(ancestor);
            const clipsX = ['hidden', 'clip', 'scroll', 'auto'].includes(ancestorStyle.overflowX);
            const clipsY = ['hidden', 'clip', 'scroll', 'auto'].includes(ancestorStyle.overflowY);
            if (clipsX || clipsY) {
              const boundary = ancestor.getBoundingClientRect();
              if ((clipsX && (ring.left - extent < boundary.left || ring.right + extent > boundary.right))
                || (clipsY && ring.height <= boundary.height
                  && (ring.top - extent < boundary.top || ring.bottom + extent > boundary.bottom))) {
                ancestorClips = true;
                clippingAncestor = `${ancestor.tagName.toLowerCase()}${ancestor.id ? `#${ancestor.id}` : ''}`;
                break;
              }
            }
            ancestor = ancestor.parentElement;
          }

          if (viewportClipsHorizontally || viewportClipsVertically || ancestorClips) {
            clipped.push({ label, outlineWidth, outlineOffset, clippingAncestor });
          }
        }

        return clipped;
      });

      expect(clippedFocusRings, `${route} at ${viewport.width}x${viewport.height}`).toEqual([]);
    }
  }
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

  await expect(page.getByText('Creative technologist. Musician. Professional maker of curious things.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-lab-contrast-safe-reveal]')).toHaveCount(3);
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
