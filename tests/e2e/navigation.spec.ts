import { expect, test } from '@playwright/test';

function contrastRatio(foreground: string, background: string): number {
  const luminance = (color: string) => {
    const channels = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number);
    if (!channels || channels.length !== 3) throw new Error(`Expected RGB color, received ${color}`);
    const [red, green, blue] = channels.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test('the skip link receives focus first and moves focus to the main landmark', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('the mobile menu opens and closes with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Menu' });
  await menuButton.focus();
  await page.keyboard.press('Enter');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();
});

test('every project filter is reachable with Tab', async ({ page }) => {
  await page.goto('/work/');

  const expectedFilters = await page.locator('[data-work-filter]').evaluateAll((filters) => (
    filters.map((filter) => filter.getAttribute('data-category'))
  ));
  const reachedFilters: string[] = [];

  for (let step = 0; step < 30 && reachedFilters.length < expectedFilters.length; step += 1) {
    await page.keyboard.press('Tab');
    const activeCategory = await page.evaluate(() => (
      document.activeElement?.getAttribute('data-category')
    ));
    if (activeCategory && !reachedFilters.includes(activeCategory)) reachedFilters.push(activeCategory);
  }

  expect(reachedFilters).toEqual(expectedFilters);
});

test('SignalField reports a reduced-motion state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('[data-signal-field]')).toHaveAttribute('data-motion', 'reduced');
});

test('mobile controls meet the 44px touch-target minimum', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ['/', '/work/', '/music/', '/contact/']) {
    await page.goto(route);
    const undersized = await page.locator('button').evaluateAll((buttons) => (
      buttons
        .map((button) => ({ label: button.textContent?.trim(), rect: button.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width < 44 || rect.height < 44)
        .map(({ label, rect }) => ({ label, width: rect.width, height: rect.height }))
    ));
    expect(undersized, `${route}: ${JSON.stringify(undersized)}`).toEqual([]);
  }
});

test('button boundaries maintain 3:1 contrast against their surfaces', async ({ page }) => {
  for (const route of ['/', '/work/', '/music/', '/contact/']) {
    await page.goto(route);
    const buttonColors = await page.locator('button').evaluateAll((buttons) => buttons.map((button) => {
      let surface: Element | null = button.parentElement;
      while (surface && getComputedStyle(surface).backgroundColor === 'rgba(0, 0, 0, 0)') {
        surface = surface.parentElement;
      }
      return {
        border: getComputedStyle(button).borderTopColor,
        surface: getComputedStyle(surface ?? document.documentElement).backgroundColor,
      };
    }));
    const ratios = buttonColors.map(({ border, surface }) => contrastRatio(border, surface));
    expect(ratios.every((ratio) => ratio >= 3), `${route}: ${JSON.stringify(buttonColors)}`).toBe(true);
  }
});
