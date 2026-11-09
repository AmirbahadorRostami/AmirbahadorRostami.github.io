import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { globSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

const posts = [...globSync('**/*.md', { cwd: 'src/content/blog' })].map((file) => {
  const [, frontmatter] = readFileSync(`src/content/blog/${file}`, 'utf8').split(/^---\s*$/m);
  return { slug: file.replace(/\.md$/, ''), ...parse(frontmatter) };
});
const published = posts.filter((post) => post.draft === false)
  .sort((a, b) => b.pubDate.localeCompare(a.pubDate) || a.slug.localeCompare(b.slug));

test('blog navigation opens the archive and displays published posts or an honest empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Blog', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Blog', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page');
  if (published.length === 0) {
    await expect(page.getByText('The first entry is still taking shape.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore the work' })).toHaveAttribute('href', '/work/');
  } else {
    expect(await page.locator('.blog-post h2 a').allTextContents()).toEqual(published.map((post) => post.title));
  }
});

test('drafts have no archive link, generated page, or sitemap entry', async ({ page, request }) => {
  await page.goto('/blog/');
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const post of posts.filter((post) => post.draft !== false)) {
    const path = `/blog/${post.slug}/`;
    await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
    expect((await request.get(path)).status()).toBe(404);
    expect(sitemap).not.toContain(path);
  }
});

test('the blog is readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/blog/');
    await expect(page.getByRole('heading', { level: 1, name: 'Blog', exact: true })).toBeVisible();
    for (const post of published) {
      await page.goto(`/blog/${post.slug}/`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
      await expect(page.locator('.blog-prose')).not.toBeEmpty();
    }
  } finally {
    await context.close();
  }
});

for (const path of ['/blog/', ...published.map((post) => `/blog/${post.slug}/`)]) {
  test(`${path} stays within the viewport and has no serious accessibility violations`, async ({ page }) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    }
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([]);
  });
}

for (const post of published) {
  test(`${post.slug} renders Markdown with article metadata and a return link`, async ({ page }) => {
    await page.goto('/blog/');
    await page.getByRole('heading', { level: 2, name: post.title, exact: true }).getByRole('link').click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
    await expect(page.locator('.blog-prose')).not.toBeEmpty();
    await expect(page.locator('time')).toHaveAttribute('datetime', post.pubDate);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', post.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://amirbahadorrostami.github.io/blog/${post.slug}/`);
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page');
    await page.getByRole('link', { name: 'All posts', exact: true }).click();
    await expect(page).toHaveURL(/\/blog\/$/);
  });
}
