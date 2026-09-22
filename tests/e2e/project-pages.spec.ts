import { expect, test } from '@playwright/test';

const projects = [
  {
    slug: 'encounters', title: 'Encounters', depth: 'flagship', heroStem: 'encounters-card',
    heroAlt: 'A luminous letter E floating above layered blue lines in the Encounters artwork',
    premise: 'An augmented-reality social experience that guides Congress participants through public space toward shared virtual bodies of water.',
    narrative: 'I implemented the complete client application and its AR experience.',
    chapters: ['01 Premise', '02 Experience', '03 My contribution', '04 Technical system', '05 Process', '06 Credits', '07 Documentation'],
    media: 8,
  },
  {
    slug: 'luminous-trails', title: 'Luminous Trails', depth: 'flagship', heroStem: 'luminous-trails-card',
    heroAlt: 'A person holding a phone at night among luminous trails near the CN Tower',
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
    media: 7,
  },
  {
    slug: 'biowords', title: 'BioWords', depth: 'short', heroStem: 'biowords-card',
    heroAlt: 'Small line-drawn BioWord creatures arranged across a white field',
    premise: "An artificial-life work that turns words from participants' sentences into biomorphs whose sentiment and DNA shape flocking, community, and survival.",
    narrative: 'The result contains only original surviving words, ordered by survival time, longest-lived first, then by remaining energy.',
    chapters: ['01 Premise', '02 Experience', '04 Technical system', '06 Credits', '07 Documentation'],
    media: 1,
  },
  {
    slug: 'person-is-a-data-structure', title: 'Person Is a Data Structure', depth: 'short', heroStem: 'person-is-a-data-structure-card',
    heroAlt: 'A dark installation of clustered monitors displaying fragmented close-ups of faces',
    premise: 'A collaborative university installation connecting facial data, cameras, displays, sensors, and physical systems.',
    narrative: 'I shared the integration of cameras, displays, sensors, networked components, and physical systems with the team.',
    chapters: ['01 Premise', '02 Experience', '03 My contribution', '06 Credits', '07 Documentation'],
    media: 1,
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
    const hero = page.locator('.project-hero__image img');
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

test('flagship chapters expose intentional media placeholders with all requirements', async ({ page }) => {
  for (const project of projects.filter(({ depth }) => depth === 'flagship')) {
    await page.goto(`/work/${project.slug}/`);
    await expect(page.locator('[data-case-study-chapter]')).toHaveCount(7);
    const placeholder = page.locator('[data-media-state="placeholder"]').first();
    await expect(placeholder).toContainText(project.title);
    await expect(placeholder).toContainText('Preferred ratio');
    await expect(placeholder).toContainText('Alt text');
    await expect(placeholder).toContainText('Placeholder');
    await expect(placeholder.locator('figcaption')).not.toBeEmpty();
    await expect(placeholder.locator('img')).toHaveCount(0);
    const processLink = page.locator('[data-case-study-chapter="05"] a').first();
    const target = await processLink.getAttribute('href');
    expect(target).toMatch(/^#media-/);
    await expect(page.locator(target!)).toHaveAttribute('data-media-state', 'placeholder');
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

test('loads privacy-enhanced Encounters video only after explicit activation', async ({ page }) => {
  const youtubeRequests: string[] = [];
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Video provider</p>' }));
  page.on('request', (request) => {
    if (/youtube(?:-nocookie)?\.com|ytimg\.com/.test(request.url())) youtubeRequests.push(request.url());
  });
  await page.goto('/work/encounters/');
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(youtubeRequests).toEqual([]);
  const caption = 'A demonstration of the wayfinding cues used during the shared walk.';
  const playButton = page.locator('[data-media-id="ar-wayfinding-avatar"]').getByRole('button', { name: `Play ${caption}` });
  await expect(playButton).toHaveAttribute('aria-pressed', 'false');
  await playButton.click();
  const video = page.locator('iframe');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/eJJue_cGV3E');
  await expect(video).toHaveAttribute('title', caption);
  await expect(video).toHaveAttribute('loading', 'lazy');
  await expect(video).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  await expect(video).toHaveAttribute('allowfullscreen', '');
  await expect(video).toHaveAttribute('allow', 'encrypted-media');
  expect(youtubeRequests.some((url) => url.startsWith('https://www.youtube-nocookie.com/'))).toBe(true);
});

test('project-media hover borders retain deep red while labels use accessible text red', async ({ page }) => {
  await page.goto('/work/encounters/');
  const playButton = page.locator('[data-video-facade][data-video-id="eJJue_cGV3E"] button');
  await playButton.hover();
  await expect(playButton).toHaveCSS('border-top-color', 'rgb(167, 20, 20)');
  await expect(playButton).toHaveCSS('color', 'rgb(207, 98, 90)');
  await expect(playButton.locator('[aria-hidden="true"]')).toHaveCSS('color', 'rgb(167, 20, 20)');
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
  await expect(page.getByRole('link', { name: 'Watch A demonstration of the wayfinding cues used during the shared walk. on YouTube' }))
    .toHaveAttribute('href', 'https://www.youtube.com/watch?v=eJJue_cGV3E');
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
  await expect(page.locator('[data-media-id="hardware-components"] .project-media__frame')).toHaveCSS('aspect-ratio', '4 / 3');
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
