import { expect, test } from '@playwright/test';

const projects = [
  {
    slug: 'encounters', title: 'Encounters', depth: 'flagship', heroStem: 'encounters-card',
    heroAlt: 'A luminous letter E floating above layered blue lines in the Encounters artwork',
    premise: 'An augmented-reality social experience that guides Congress participants through public space toward shared virtual bodies of water.',
  },
  {
    slug: 'luminous-trails', title: 'Luminous Trails', depth: 'flagship', heroStem: 'luminous-trails-card',
    heroAlt: 'A person holding a phone at night among luminous trails near the CN Tower',
    premise: "An augmented-reality experience that translates participants' movement through Toronto into visible geolocated trails.",
  },
  {
    slug: 'remote-realities', title: 'Remote Realities', depth: 'flagship', heroStem: 'remote-realities-card',
    heroAlt: 'A visitor beside a suspended translucent installation in a blue-lit gallery',
    premise: 'A technology-art project preserved from the original portfolio under the titles Remote Realities and Ephemeral Pulses of a Finite Scroll.',
  },
  {
    slug: 'biowords', title: 'BioWords', depth: 'short', heroStem: 'biowords-card',
    heroAlt: 'Small line-drawn BioWord creatures arranged across a white field',
    premise: "A web-based artificial-life experience that turns participants' sentences into creatures whose behavior reflects language and sentiment.",
  },
  {
    slug: 'person-is-a-data-structure', title: 'Person Is a Data Structure', depth: 'short', heroStem: 'person-is-a-data-structure-card',
    heroAlt: 'A dark installation of clustered monitors displaying fragmented close-ups of faces',
    premise: 'An installation exploring surveillance, systems, and the relationship between individuals and the collective through connected mirror and screen spaces.',
  },
  {
    slug: 'cellular-automata', title: 'Cellular Automata', depth: 'short', heroStem: 'cellular-automata-card',
    heroAlt: 'Dense white branching cellular patterns on a black background',
    premise: "A browser-based creative-coding sketch preserved from the original portfolio's CodePen experiment.",
  },
] as const;

for (const project of projects) {
  test(`${project.title} renders its ${project.depth} project composition without a live experiment`, async ({ page }) => {
    const response = await page.goto(`/work/${project.slug}/`);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible();
    await expect(page.locator('[data-project-detail]')).toHaveAttribute('data-depth', project.depth);
    await expect(page.locator('.project-hero__premise')).toHaveText(project.premise);
    const hero = page.locator('.project-hero__image img');
    await expect(hero).toHaveAttribute('src', /\/(?:_image|_astro)\//);
    await expect(hero).toHaveAttribute('srcset', /\S/);
    await expect(hero).toHaveAttribute('alt', project.heroAlt);
    await expect(hero).toHaveAttribute('loading', 'eager');
    await expect(hero).toHaveAttribute('fetchpriority', 'high');
    await expect(page.getByRole('heading', { level: 2, name: 'Project facts' })).toBeVisible();
    await expect(page.locator('.project-facts dl')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Story' })).toBeVisible();
    await expect(page.locator('.project-story__body p').first()).not.toBeEmpty();
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      new RegExp(project.heroStem),
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Live experiment' })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Project navigation' })).toBeVisible();
  });
}

test('omits empty optional sections from the compact BioWords page', async ({ page }) => {
  await page.goto('/work/biowords/');

  await expect(page.getByRole('heading', { level: 2, name: 'Collaborators' })).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 2, name: 'Credits' })).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 2, name: 'Outcomes' })).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 2, name: 'Project links' })).toHaveCount(0);
});

test('loads privacy-enhanced Encounters video only after explicit activation', async ({ page }) => {
  const youtubeRequests: string[] = [];
  page.on('request', (request) => {
    if (/youtube(?:-nocookie)?\.com|ytimg\.com/.test(request.url())) {
      youtubeRequests.push(request.url());
    }
  });

  await page.goto('/work/encounters/');

  await expect(page.locator('iframe')).toHaveCount(0);
  expect(youtubeRequests).toEqual([]);

  const playButton = page.getByRole('button', { name: 'Play Encounters wayfinding demonstration' });
  await expect(playButton).toHaveAttribute('aria-pressed', 'false');
  await playButton.click();

  const video = page.locator('iframe');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/eJJue_cGV3E');
  await expect(video).toHaveAttribute('title', 'Encounters wayfinding demonstration');
  await expect(video).toHaveAttribute('loading', 'lazy');
  await expect(video).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  await expect(video).toHaveAttribute('allowfullscreen', '');
  await expect(video).toHaveAttribute('allow', 'encrypted-media');
  expect(youtubeRequests.some((url) => url.startsWith('https://www.youtube-nocookie.com/'))).toBe(true);
});

test('keeps Encounters videos as explicit third-party links without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/work/encounters/');

  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Watch Encounters wayfinding demonstration on YouTube' }))
    .toHaveAttribute('href', 'https://www.youtube.com/watch?v=eJJue_cGV3E');
  await context.close();
});

test('renders prepared flagship detail media with visible captions', async ({ page }) => {
  await page.goto('/work/luminous-trails/');

  await expect(page.locator('[data-project-media] figure')).toHaveCount(8);
  await expect(page.locator('[data-project-media] figcaption')).toHaveCount(8);
  await expect(page.locator('[data-project-media] img').first()).toHaveAttribute('loading', 'lazy');
});

test('wraps project navigation from the first project to the last and second', async ({ page }) => {
  await page.goto('/work/encounters/');

  await expect(page.getByRole('link', { name: 'Previous project: Cellular Automata' }))
    .toHaveAttribute('href', '/work/cellular-automata/');
  await expect(page.getByRole('link', { name: 'Next project: Luminous Trails' }))
    .toHaveAttribute('href', '/work/luminous-trails/');
});

test('wraps project navigation from the last project to the first', async ({ page }) => {
  await page.goto('/work/cellular-automata/');

  await expect(page.getByRole('link', { name: 'Next project: Encounters' }))
    .toHaveAttribute('href', '/work/encounters/');
});
