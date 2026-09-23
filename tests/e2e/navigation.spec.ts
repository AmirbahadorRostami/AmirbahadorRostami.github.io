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

test('Escape never hides the always-visible desktop primary navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const menu = page.getByRole('navigation', { name: 'Primary' });
  await expect(menu).toBeVisible();
  await expect(menu).not.toHaveAttribute('hidden');

  await page.keyboard.press('Escape');
  await expect(menu).toBeVisible();
  await expect(menu).not.toHaveAttribute('hidden');
});

test('primary navigation exposes the five approved destinations in order', async ({ page }) => {
  await page.goto('/');

  const navigation = page.getByRole('navigation', { name: 'Primary' });
  const links = navigation.getByRole('link');
  for (const [index, label] of ['Work', 'Experiments', 'Music', 'About', 'Contact'].entries()) {
    await expect(links.nth(index)).toHaveAccessibleName(label);
  }
  await expect(links.locator('[aria-hidden="true"]')).toHaveText(['01', '02', '03', '04', '05']);
  expect(await navigation.getByRole('link').evaluateAll((links) => (
    links.map((link) => link.getAttribute('href'))
  ))).toEqual([
    '/work/',
    '/experiments/',
    '/music/',
    '/about/',
    '/contact/',
  ]);
});

test('production pages expose the Darkroom type and colour tokens', async ({ page }) => {
  await page.goto('/');
  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      signal: styles.getPropertyValue('--signal').trim(),
      display: styles.getPropertyValue('--font-display').trim(),
      mono: styles.getPropertyValue('--font-mono').trim(),
      radius: styles.getPropertyValue('--radius').trim(),
    };
  });
  expect.soft(tokens.signal).toBe('#a71414');
  expect.soft(tokens.display).toContain('Outfit Variable');
  expect.soft(tokens.mono).toContain('IBM Plex Mono');
  expect.soft(tokens.mono).not.toContain('IBM Plex Mono Variable');
  expect.soft(tokens.radius).toBe('0px');

  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      display: (await document.fonts.load('500 16px "Outfit Variable"')).length,
      monoRegular: (await document.fonts.load('400 16px "IBM Plex Mono"')).map((face) => face.weight),
      monoMedium: (await document.fonts.load('500 16px "IBM Plex Mono"')).map((face) => face.weight),
    };
  });
  expect(fonts.display).toBeGreaterThan(0);
  expect(fonts.monoRegular).toContain('400');
  expect(fonts.monoMedium).toContain('500');
});

test('the production frame shows a compact wordmark, location and public profiles', async ({ page }) => {
  await page.goto('/');
  const brand = page.getByRole('banner').getByRole('link', { name: 'Amir Bahador Rostami — Home' });
  await expect(brand).toHaveText('AMIR / ROSTAMI');
  await expect(brand).toHaveAttribute('href', '/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByText('Toronto, Canada', { exact: true })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'SoundCloud' })).toHaveAttribute('href', 'https://soundcloud.com/amir-bahador-rostami');
  await expect(footer.locator('a[href=""]')).toHaveCount(0);
});

test('current section navigation includes a visible signal line on detail pages', async ({ page }) => {
  await page.goto('/work/encounters/');
  const currentLink = page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="page"]');
  await expect(currentLink).toHaveAccessibleName('Work');
  const line = await currentLink.evaluate((link) => {
    const style = getComputedStyle(link, '::after');
    return { color: style.backgroundColor, height: parseFloat(style.height), opacity: style.opacity };
  });
  expect(line.color).toBe('rgb(167, 20, 20)');
  expect(line.height).toBeGreaterThanOrEqual(2);
  expect(line.opacity).toBe('1');
});

test('10 PRINT art loads only on the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-ten-print]')).toHaveCount(1);
  await page.goto('/about/');
  await expect(page.locator('[data-ten-print]')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('foundation primitives keep asymmetric columns and square accessible controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('main').evaluate((main) => {
    const fixture = document.createElement('section');
    fixture.className = 'container grid-12';
    fixture.dataset.foundationFixture = '';
    fixture.innerHTML = '<div class="col-span-4"><p class="chapter-label">01 / Selected work</p><a class="button-link" href="/work/">View work</a></div><figure class="media-frame col-span-6 col-start-7"><figcaption>Project still</figcaption></figure>';
    main.prepend(fixture);
  });
  const fixture = page.locator('[data-foundation-fixture]');
  const columns = await fixture.locator(':scope > *').evaluateAll((elements) => elements.map((element) => {
    const { width, x, y } = element.getBoundingClientRect();
    return { width, x, y };
  }));
  expect(columns[1].width).toBeGreaterThan(columns[0].width * 1.4);
  expect(columns[1].y).toBe(columns[0].y);

  const button = fixture.getByRole('link', { name: 'View work' });
  await expect(button).toHaveCSS('border-radius', '0px');
  await expect(fixture.locator('.media-frame')).toHaveCSS('border-radius', '0px');
  const target = await button.boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await button.hover();
  await expect(button).toHaveCSS('border-top-color', 'rgb(167, 20, 20)');

  await page.setViewportSize({ width: 390, height: 844 });
  const stacked = await fixture.locator(':scope > *').evaluateAll((elements) => elements.map((element) => {
    const { width, x, y } = element.getBoundingClientRect();
    return { width, x, y };
  }));
  expect(stacked[1].width).toBe(stacked[0].width);
  expect(stacked[1].x).toBe(stacked[0].x);
  expect(stacked[1].y).toBeGreaterThan(stacked[0].y);
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

test('mobile primary navigation links meet the 44px touch-target minimum', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();

  const undersized = await page.getByRole('navigation', { name: 'Primary' }).locator('a').evaluateAll(
    (links) => links
      .map((link) => ({ label: link.textContent?.trim(), rect: link.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 44 || rect.height < 44)
      .map(({ label, rect }) => ({ label, width: rect.width, height: rect.height })),
  );
  expect(undersized, JSON.stringify(undersized)).toEqual([]);
});

test('only control boundaries use the high-contrast control token', async ({ page }) => {
  for (const route of ['/', '/work/', '/work/encounters/']) {
    await page.goto(route);
    const line = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--line').trim());
    expect(line).toBe('#34302c');
    const buttonColors = await page.locator('[data-menu-button], [data-work-filter], [data-video-facade] button').evaluateAll((buttons) => buttons.map((button) => {
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
