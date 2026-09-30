import { expect, test } from '@playwright/test';

const projects = [
  {
    slug: 'encounters', title: 'Encounters', depth: 'flagship', heroStem: 'encounters-header',
    heroAlt: 'An underwater world of luminous blue light and a floating white figure in Encounters',
    premise: 'An augmented-reality social experience that guides Congress participants through public space toward shared virtual bodies of water.',
    narrative: 'I implemented the complete client application and its AR experience.',
    chapters: ['01 Premise', '02 Experience', '03 My contribution', '04 Technical system', '05 Process', '06 Credits', '07 Documentation'],
    media: 8,
  },
  {
    slug: 'luminous-trails', title: 'Luminous Trails', depth: 'flagship', heroStem: 'luminous-trails-card',
    heroAlt: 'A luminous figure surrounded by neon-colored wireframe terrain and glowing sculptural forms',
    premise: "An augmented-reality experience that translates participants' movement through Toronto into visible geolocated trails.",
    narrative: 'I architected the backend; another team member implemented it.',
    chapters: ['01 Premise', '02 Experience', '03 My contribution', '04 Technical system', '05 Process', '06 Credits', '07 Documentation'],
    media: 7,
  },
  {
    slug: 'ephemeral-pulses-of-a-finite-scroll', title: 'Ephemeral Pulses of a Finite Scroll', depth: 'flagship', heroStem: 'remote-realities-card',
    heroAlt: 'A visitor beside a suspended translucent installation in a blue-lit gallery',
    premise: 'A sound installation in which wireless swing units complete a chord when their movement reaches rhythmic and harmonic synchronization.',
    narrative: 'Remote Realities names the program; the artwork is Ephemeral Pulses of a Finite Scroll.',
    chapters: ['01 Premise', '02 Experience', '03 My contribution', '04 Technical system', '05 Process', '06 Credits', '07 Documentation'],
    media: 8,
  },
  {
    slug: 'biowords', title: 'BioWords', depth: 'short', heroStem: 'biowords-hero',
    heroAlt: 'Small line-drawn BioWord creatures arranged across a white field',
    premise: "An artificial-life work that turns words from participants' sentences into biomorphs whose sentiment and DNA shape flocking, community, and survival.",
    narrative: 'The result contains only original surviving words, ordered by survival time, longest-lived first, then by remaining energy.',
    chapters: ['01 Premise', '02 Experience', '04 Technical system', '06 Credits', '07 Documentation'],
    media: 2,
  },
  {
    slug: 'person-is-a-data-structure', title: 'Person Is a Data Structure', depth: 'short', heroStem: 'person-is-a-data-structure-card',
    heroAlt: 'A dark installation of clustered monitors displaying fragmented close-ups of faces',
    premise: 'A collaborative university installation connecting facial data, cameras, displays, sensors, and physical systems.',
    narrative: 'I shared the integration of cameras, displays, sensors, networked components, and physical systems with the team.',
    chapters: ['01 Premise', '02 Experience', '03 My contribution', '06 Credits', '07 Documentation'],
    media: 4,
  },
] as const;

for (const project of projects) {
  test(`${project.title} renders its ${project.depth} composition and authored facts`, async ({ page }) => {
    const response = await page.goto(`/work/${project.slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: project.title, exact: true })).toBeVisible();
    await expect(page.locator('[data-project-detail]')).toHaveAttribute('data-depth', project.depth);
    await expect(page.locator('.project-hero__premise')).toHaveText(project.premise);
    const hero = page.locator('.project-hero__image [data-hero-art]');
    await expect(hero).toHaveAttribute('src', /\/(?:_image|_astro)\//);
    await expect(hero).toHaveAttribute('srcset', /\S/);
    await expect(hero).toHaveAttribute('alt', project.heroAlt);
    await expect(hero).toHaveAttribute('loading', 'eager');
    await expect(hero).toHaveAttribute('fetchpriority', 'high');
    await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.project-facts dl')).toBeVisible();
    await expect(page.locator('[data-case-study-chapter] > h2')).toHaveText([...project.chapters]);
    await expect(page.locator('[data-project-detail]')).toContainText(project.narrative);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', new RegExp(project.heroStem));
    await expect(page.locator('[data-live-experiment-slot]')).toHaveCount(project.slug === 'biowords' ? 1 : 0);
    await expect(page.getByRole('navigation', { name: 'Project navigation' })).toBeVisible();
    await expect(page.locator('[data-project-media]')).toHaveCount(1);
    await expect(page.locator('[data-project-media] > figure')).toHaveCount(project.media);
  });
}

test('Encounters uses the supplied title mark over its underwater hero while retaining its card art', async ({ page }) => {
  await page.goto('/work/encounters/');
  const hero = page.locator('.project-hero__image');
  await expect(hero.locator('[data-hero-art]')).toHaveAttribute('src', /encounters-header/);
  await expect(hero.locator('[data-hero-mark]')).toHaveAttribute('src', /encounters-wordmark/);
  await expect(hero.locator('[data-hero-mark]')).toHaveAttribute('alt', '');
  await page.goto('/');
  await expect(page.locator('#selected-work [data-project-card]').first().locator('img')).toHaveAttribute('src', /encounters-card/);
});

test('BioWords uses the supplied full-width artwork for its hero and opening document, keeping its work card', async ({ page }) => {
  await page.goto('/work/biowords/');
  await expect(page.locator('[data-hero-art]')).toHaveAttribute('src', /biowords-hero/);
  await expect(page.locator('[data-media-id="opening-image"] img')).toHaveAttribute('src', /biowords-hero/);
  await page.goto('/work/');
  await expect(page.locator('[data-project-card] a[href="/work/biowords/"] img')).toHaveAttribute('src', /biowords-card/);
});

test('BioWords dictionary shows the isolated LOVE letters, honest alphabet studies, and assembled word', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/biowords/');
    const dictionary = page.locator('[data-biowords-dictionary]');
    await expect(dictionary.getByRole('heading', { name: /dictionary/i })).toBeVisible();
    const tiles = dictionary.locator('figure');
    await expect(tiles).toHaveCount(9);
    for (const letter of ['L', 'O', 'V', 'E']) {
      await expect(dictionary.locator(`[data-letter-single="${letter}"] img`)).toHaveCount(1);
      await expect(dictionary.locator(`[data-letter-layered="${letter}"] img`)).toHaveCount(1);
    }
    await expect(dictionary.locator('[data-word-example="LOVE"] img')).toHaveCount(1);
    await expect(dictionary).toContainText('cumulative alphabet');
    for (const image of await dictionary.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('Encounters title mark is prominent and centered over the hero art', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/encounters/');
    const geometry = await page.locator('.project-hero__image').evaluate((figure) => {
      const hero = figure.getBoundingClientRect();
      const mark = figure.querySelector('[data-hero-mark]')!.getBoundingClientRect();
      return {
        widthFraction: mark.width / hero.width,
        horizontalOffset: Math.abs(mark.left + mark.width / 2 - (hero.left + hero.width / 2)) / hero.width,
        verticalOffset: Math.abs(mark.top + mark.height / 2 - (hero.top + hero.height / 2)) / hero.height,
      };
    });
    expect(geometry.widthFraction).toBeGreaterThan(0.28);
    expect(geometry.horizontalOffset).toBeLessThan(0.04);
    expect(geometry.verticalOffset).toBeLessThan(0.08);
  }
});

test('Encounters documentation starts with the real interaction rather than repeated card artwork', async ({ page }) => {
  await page.goto('/work/encounters/');
  await expect(page.locator('[data-media-id="opening-image"]')).toHaveCount(0);
  await expect(page.locator('[data-project-media] > figure').first()).toHaveAttribute('data-media-id', 'pair-using-app');
});

test('Luminous Trails has no unsupported App Store or system-diagram placeholders', async ({ page }) => {
  await page.goto('/work/luminous-trails/');
  await expect(page.locator('[data-case-study-chapter]')).toHaveCount(7);
  await expect(page.locator('[data-media-state="placeholder"]')).toHaveCount(0);
  await expect(page.locator('[data-media-id="app-store-material"], [data-media-id="client-backend-architecture"]')).toHaveCount(0);
});

test('owner-supplied media fills matching case-study slots and detailed diagrams open full-size', async ({ page }) => {
  const cases = [
    { slug: 'encounters', ids: ['onboarding-1', 'invitation-pairing-interface', 'pairing-demo', 'ar-wayfinding-avatar', 'system-architecture', 'campus-map-process'] },
    { slug: 'luminous-trails', ids: ['event-booth', 'participant-documentation', 'ar-trails-intersections', 'ar-avatar', 'app-journey', 'app-avatar', 'map-prototype-testing'] },
    { slug: 'ephemeral-pulses-of-a-finite-scroll', ids: ['participant-interaction', 'sound-synthesis-unit-architecture', 'hardware-components', 'fourteen-note-directional-mapping'] },
    { slug: 'biowords', ids: ['original-simulation'] },
    { slug: 'person-is-a-data-structure', ids: ['gallery-installation', 'system-overview', 'installation-trailer'] },
  ];

  for (const item of cases) {
    await page.goto(`/work/${item.slug}/`);
    for (const id of item.ids) {
      const figure = page.locator(`[data-media-id="${id}"]`);
      await expect(figure).toHaveAttribute('data-media-state', 'ready');
      await expect(figure.locator('img, video')).toHaveCount(1);
    }
  }

  await page.goto('/work/encounters/');
  const diagram = page.locator('[data-media-id="system-architecture"]');
  const fullSizeLink = diagram.getByRole('link', { name: 'Open full-size diagram' });
  await expect(fullSizeLink).toHaveAttribute('href', /\/_(?:astro|image)\//);
});

test('Encounters documentary media has a deliberate desktop scale', async ({ page }) => {
  await page.setViewportSize({ width: 2118, height: 900 });
  await page.goto('/work/encounters/');
  const widths = await page.locator('[data-project-media]').evaluate((gallery) => {
    const measure = (id: string) => {
      const figure = gallery.querySelector(`[data-media-id="${id}"]`);
      if (!figure) throw new Error(`Missing media ${id}`);
      const rect = figure.getBoundingClientRect();
      return { width: rect.width, top: rect.top, center: rect.left + rect.width / 2 };
    };
    return {
      gallery: gallery.getBoundingClientRect().width,
      galleryCenter: gallery.getBoundingClientRect().left + gallery.getBoundingClientRect().width / 2,
      pairing: measure('pairing-demo'),
      wayfinding: measure('ar-wayfinding-avatar'),
      water: measure('virtual-water-underwater-environment'),
      onboarding: measure('onboarding-1'),
      flowchart: measure('system-architecture'),
    };
  });
  expect(widths.pairing.width).toBeLessThan(widths.gallery * 0.45);
  expect(widths.wayfinding.width).toBeLessThan(widths.gallery * 0.45);
  expect(Math.abs(widths.pairing.top - widths.wayfinding.top)).toBeLessThan(4);
  expect(widths.water.width).toBeLessThan(widths.gallery * 0.5);
  expect(Math.abs(widths.water.center - widths.galleryCenter)).toBeLessThan(widths.gallery * 0.08);
  expect(widths.onboarding.width).toBeLessThan(widths.gallery * 0.5);
  expect(widths.flowchart.width).toBeGreaterThan(widths.gallery * 1.15);
});

test('Encounters portrait stills retain their full image without oversized mobile frames', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/encounters/');
    for (const id of ['onboarding-1', 'virtual-water-underwater-environment']) {
      const figure = page.locator(`[data-media-id="${id}"]`);
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator('img')).toBeVisible();
      await expect.poll(() => figure.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const geometry = await figure.evaluate((element) => {
        const frame = element.querySelector('.project-media__frame')!;
        const image = frame.querySelector('img')!;
        return {
          figureWidth: element.getBoundingClientRect().width,
          frameWidth: frame.getBoundingClientRect().width,
          imageWidth: image.getBoundingClientRect().width,
          imageHeight: image.getBoundingClientRect().height,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        };
      });
      expect(geometry.naturalWidth).toBeGreaterThan(0);
      expect(geometry.naturalHeight).toBeGreaterThan(0);
      expect(Math.abs(geometry.imageWidth - geometry.frameWidth)).toBeLessThanOrEqual(2.1);
      expect(Math.abs((geometry.imageWidth / geometry.imageHeight) - (geometry.naturalWidth / geometry.naturalHeight))).toBeLessThan(0.015);
      if (width < 500) expect(geometry.figureWidth).toBeLessThanOrEqual(384);
      expect(geometry.imageHeight).toBeGreaterThan(geometry.imageWidth);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('each project has one clear link to its public presentation', async ({ page }) => {
  for (const { slug, url } of [
    { slug: 'encounters', url: 'https://www.yorku.ca/yfile/2023/05/30/encounters-brings-augmented-reality-to-congress-2023/' },
    { slug: 'ephemeral-pulses-of-a-finite-scroll', url: 'https://remoterealities.jenniefaber.com/project/ephemeral-pulses-of-a-finite-scroll/' },
  ]) {
    await page.goto(`/work/${slug}/`);
    const link = page.locator(`a[href="${url}"]`);
    await expect(link).toHaveCount(1);
    await expect(page.locator('.project-documentation').locator(`a[href="${url}"]`)).toBeVisible();
  }
});

test('Luminous Trails portrait images stay paired and uncropped across desktop and mobile', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/luminous-trails/');
    const gallery = page.locator('[data-project-media]');
    const galleryWidth = await gallery.evaluate((element) => element.getBoundingClientRect().width);
    for (const id of ['event-booth', 'participant-documentation', 'ar-trails-intersections', 'ar-avatar', 'app-journey', 'app-avatar']) {
      const figure = page.locator(`[data-media-id="${id}"]`);
      await figure.scrollIntoViewIfNeeded();
      await expect.poll(() => figure.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const geometry = await figure.evaluate((element) => {
        const frame = element.querySelector('.project-media__frame')!.getBoundingClientRect();
        const image = element.querySelector('img')!;
        return {
          width: element.getBoundingClientRect().width,
          frameRatio: frame.width / frame.height,
          imageRatio: image.naturalWidth / image.naturalHeight,
        };
      });
      expect(Math.abs(geometry.frameRatio - geometry.imageRatio)).toBeLessThan(0.02);
      expect(geometry.width).toBeLessThanOrEqual(width < 500 ? 384 : galleryWidth * 0.5);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('Luminous Trails credits name each collaborator once and identify the event partners', async ({ page }) => {
  await page.goto('/work/luminous-trails/');
  const credits = page.locator('[data-case-study-chapter="06"]');
  const copy = await credits.innerText();
  for (const name of ['Roozbeh Moayyedian', 'Elahe Rostami', 'Amir Bahador Rostami', 'Can Baris Candan', 'Emad Moradian']) {
    expect(copy.split(name)).toHaveLength(2);
  }
  await expect(credits).toContainText('Nuit Blanche Toronto 2022');
  await expect(credits).toContainText('City of Toronto');
});

test('Ephemeral Pulses documentation images keep their full composition at deliberate sizes', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/ephemeral-pulses-of-a-finite-scroll/');
    const galleryWidth = await page.locator('[data-project-media]').evaluate((element) => element.getBoundingClientRect().width);
    for (const id of ['participant-interaction', 'sculpture-floor-layout-renders', 'sound-synthesis-unit-architecture', 'hardware-components']) {
      const figure = page.locator(`[data-media-id="${id}"]`);
      await figure.scrollIntoViewIfNeeded();
      await expect.poll(() => figure.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const geometry = await figure.evaluate((element) => {
        const frame = element.querySelector('.project-media__frame')!.getBoundingClientRect();
        const image = element.querySelector('img')!;
        return {
          figureWidth: element.getBoundingClientRect().width,
          frameRatio: frame.width / frame.height,
          imageRatio: image.naturalWidth / image.naturalHeight,
        };
      });
      expect(Math.abs(geometry.frameRatio - geometry.imageRatio)).toBeLessThan(0.025);
      if (width > 500) {
        if (id === 'participant-interaction') expect(geometry.figureWidth).toBeLessThan(galleryWidth * 0.45);
        if (id === 'sculpture-floor-layout-renders') expect(geometry.figureWidth).toBeGreaterThan(galleryWidth * 0.38);
        if (id === 'sound-synthesis-unit-architecture') expect(geometry.figureWidth).toBeLessThan(galleryWidth * 0.63);
        if (id === 'hardware-components') expect(geometry.figureWidth).toBeLessThan(galleryWidth * 0.8);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('Remote Realities appears only as program context', async ({ page }) => {
  await page.goto('/work/ephemeral-pulses-of-a-finite-scroll/');
  await expect(page.locator('.project-facts')).toContainText('Remote Realities Themed Commission');
  await expect(page.locator('body')).not.toContainText('Also presented as');
});

test('BioWords reserves its live experiment after the narrative and before related work', async ({ page }) => {
  await page.goto('/work/biowords/');
  const slot = page.locator('[data-live-experiment-slot]');
  await expect(slot).toContainText('BioWords');
  await expect(slot.locator('canvas, iframe')).toHaveCount(0);
  const order = await page.locator('[data-case-study-chapter], [data-live-experiment-slot], [data-related-work]').evaluateAll(
    (elements) => elements.map((element) => element.hasAttribute('data-live-experiment-slot') ? 'experiment' : element.hasAttribute('data-related-work') ? 'related' : 'chapter'),
  );
  expect(order.slice(-3)).toEqual(['chapter', 'experiment', 'related']);
});

test('Encounters omits the social-gathering video while keeping the local documentary clips', async ({ page }) => {
  await page.goto('/work/encounters/');
  await expect(page.locator('[data-media-id="social-gathering"]')).toHaveCount(0);
  await expect(page.locator('[data-media-id="pairing-demo"] video')).toHaveCount(1);
  await expect(page.locator('[data-media-id="ar-wayfinding-avatar"] video')).toHaveCount(1);
});

test('keeps all five narratives, facts, placeholders, and video links usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const project of projects) {
    await page.goto(`/work/${project.slug}/`);
    await expect(page.locator('[data-project-detail]')).toContainText(project.narrative);
    await expect(page.locator('.project-facts dl')).toBeVisible();
    await expect(page.locator('[data-case-study-chapter] > h2')).toHaveText([...project.chapters]);
  }
  await page.goto('/work/encounters/');
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('[data-media-id="social-gathering"]')).toHaveCount(0);
  await expect(page.locator('[data-media-id="pairing-demo"] video')).toHaveCount(1);
  await context.close();
});

test('wraps navigation through the five canonical projects', async ({ page }) => {
  await page.goto('/work/encounters/');
  await expect(page.getByRole('link', { name: 'Previous project: Person Is a Data Structure' }))
    .toHaveAttribute('href', '/work/person-is-a-data-structure/');
  await expect(page.getByRole('link', { name: 'Next project: Luminous Trails' }))
    .toHaveAttribute('href', '/work/luminous-trails/');
  await page.goto('/work/person-is-a-data-structure/');
  await expect(page.getByRole('link', { name: 'Next project: Encounters' })).toHaveAttribute('href', '/work/encounters/');
});

test('marks Work as the current primary section on project detail pages', async ({ page }) => {
  await page.goto('/work/encounters/');
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
});

test('stacks the media and chapters without overflow on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/work/ephemeral-pulses-of-a-finite-scroll/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('[data-media-id="hardware-components"] .project-media__frame')).toHaveCSS('aspect-ratio', '1920 / 1484');
});

test('keeps every placeholder requirement inside its visible frame at desktop and mobile sizes', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/encounters/');
    const clipped = await page.locator('[data-media-state="placeholder"] .project-media__frame').evaluateAll((frames) => (
      frames.filter((frame) => {
        const bounds = frame.getBoundingClientRect();
        return [...frame.querySelectorAll('h3, dt, dd')].some((detail) => detail.getBoundingClientRect().bottom > bounds.bottom + 1);
      }).map((frame) => frame.closest('figure')?.id)
    ));
    expect(clipped).toEqual([]);
  }
});
