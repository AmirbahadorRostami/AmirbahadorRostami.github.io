import { expect, test } from '@playwright/test';
import {
  findProjectCardGeometryViolations,
  measureProjectCards,
} from './helpers/project-card-geometry';

const projectTitles = [
  'Encounters',
  'Luminous Trails',
  'Ephemeral Pulses of a Finite Scroll',
  'BioWords',
  'Person Is a Data Structure',
];

test('lists exactly the five approved work entries without filters', async ({ page }) => {
  await page.goto('/work/');

  await expect(page.locator('[data-project-card]')).toHaveCount(5);
  await expect(page.locator('[data-work-filter]')).toHaveCount(0);
  await expect(page.locator('[data-project-card] h2')).toHaveText(projectTitles);
});

test('presents the approved archive introduction and editorial card metadata', async ({ page }) => {
  await page.goto('/work/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Things to enter, follow, swing, listen to, and occasionally get lost inside.',
  );
  await expect(page.locator('.work-archive__intro')).toHaveText(
    'Interactive installations, augmented worlds, living simulations, and the technical systems that make them possible.',
  );

  const cards = page.locator('[data-project-card]');
  expect(await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-depth')))).toEqual([
    'flagship', 'flagship', 'flagship', 'short', 'short',
  ]);
  await expect(cards.locator('[data-project-index]')).toHaveText(['01', '02', '03', '04', '05']);
  await expect(cards.locator('[data-project-year]')).toHaveText(['2023', '2022', '2020', '2019', '2018']);
  await expect(cards.locator('[data-project-role]')).toHaveText([
    'Co-creator',
    'Lead Technical Architect',
    'Co-creator',
    'Solo creator',
    'Technical artist',
  ]);
  expect(await cards.locator('[data-case-study-link]').evaluateAll((nodes) => (
    nodes.map((node) => node.getAttribute('href'))
  ))).toEqual([
    '/work/encounters/',
    '/work/luminous-trails/',
    '/work/ephemeral-pulses-of-a-finite-scroll/',
    '/work/biowords/',
    '/work/person-is-a-data-structure/',
  ]);

  await expect(page.getByRole('list', { name: 'Projects' }).getByRole('listitem')).toHaveCount(5);
  expect(await cards.evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).borderRadius))).toEqual([
    '0px', '0px', '0px', '0px', '0px',
  ]);
});

test('archive cards keep compact 4:3 image geometry on desktop and mobile', async ({ page }) => {
  const measurements = await measureProjectCards(page, '/work/', '.work-archive');
  const violations = findProjectCardGeometryViolations(measurements);

  expect(violations, JSON.stringify(measurements, null, 2)).toEqual([]);
});
