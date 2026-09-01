import { expect, test } from '@playwright/test';

const projects = [
  { slug: 'encounters', title: 'Encounters', depth: 'flagship' },
  { slug: 'luminous-trails', title: 'Luminous Trails', depth: 'flagship' },
  { slug: 'remote-realities', title: 'Remote Realities', depth: 'flagship' },
  { slug: 'biowords', title: 'BioWords', depth: 'short' },
  { slug: 'person-is-a-data-structure', title: 'Person Is a Data Structure', depth: 'short' },
  { slug: 'cellular-automata', title: 'Cellular Automata', depth: 'short' },
] as const;

for (const project of projects) {
  test(`${project.title} renders its ${project.depth} project composition without a live experiment`, async ({ page }) => {
    const response = await page.goto(`/work/${project.slug}/`);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible();
    await expect(page.locator('[data-project-detail]')).toHaveAttribute('data-depth', project.depth);
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

test('uses descriptive, privacy-conscious video embeds on Encounters', async ({ page }) => {
  await page.goto('/work/encounters/');

  const videos = page.locator('iframe');
  await expect(videos).toHaveCount(2);
  await expect(videos.nth(0)).toHaveAttribute('title', 'Encounters wayfinding demonstration');
  await expect(videos.nth(1)).toHaveAttribute('title', 'Encounters gathering demonstration');
  for (const video of await videos.all()) {
    await expect(video).toHaveAttribute('loading', 'lazy');
    await expect(video).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    await expect(video).toHaveAttribute('allowfullscreen', '');
  }
});

test('renders prepared flagship detail media with visible captions', async ({ page }) => {
  await page.goto('/work/luminous-trails/');

  await expect(page.locator('[data-project-media] figure')).toHaveCount(8);
  await expect(page.locator('[data-project-media] figcaption')).toHaveCount(8);
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
