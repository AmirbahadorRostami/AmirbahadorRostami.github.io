import { expect, test } from '@playwright/test';
import { findFocusClippingViolations } from './helpers/focus-clipping';

test('reports an inset focus outline crossing an overflow-hidden boundary', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 480 });
  await page.setContent(`
    <style>
      #clipper {
        position: absolute;
        inset: 100px auto auto 100px;
        width: 120px;
        height: 100px;
        overflow: hidden;
      }

      #crossing-focus-target {
        width: 160px;
        height: 44px;
        margin-top: 20px;
        outline: 3px solid currentColor;
        outline-offset: -3px;
      }
    </style>
    <div id="clipper">
      <button id="crossing-focus-target" type="button">Crossing inset outline</button>
    </div>
  `);

  await expect(findFocusClippingViolations(page)).resolves.toMatchObject([
    {
      label: 'Crossing inset outline',
      outlineWidth: 3,
      outlineOffset: -3,
      clippingAncestor: 'div#clipper',
      clippedEdges: ['right'],
    },
  ]);
});

test('expands a positive-offset outline before checking its clipping boundary', async ({ page }) => {
  await page.setContent(`
    <style>
      #clipper {
        position: absolute;
        inset: 100px auto auto 100px;
        width: 120px;
        height: 100px;
        overflow: hidden;
      }

      #outset-focus-target {
        position: absolute;
        inset: 20px auto auto 5px;
        width: 110px;
        height: 44px;
        outline: 3px solid currentColor;
        outline-offset: 4px;
      }
    </style>
    <div id="clipper">
      <button id="outset-focus-target" type="button">Outset outline</button>
    </div>
  `);

  await expect(findFocusClippingViolations(page)).resolves.toMatchObject([
    {
      label: 'Outset outline',
      outlineWidth: 3,
      outlineOffset: 4,
      clippingAncestor: 'div#clipper',
      clippedEdges: ['left', 'right'],
    },
  ]);
});
