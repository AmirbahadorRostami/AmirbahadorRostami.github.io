import type { Page } from '@playwright/test';

export const projectCardViewports = [
  { name: 'desktop', width: 1100, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

export type ProjectCardMeasurement = {
  viewport: (typeof projectCardViewports)[number];
  cards: Array<{
    cardHeight: number;
    imageBoxHeight: number;
    imageBoxWidth: number;
    imageDisplay: string;
    imageHeight: number;
    imageObjectFit: string;
    imageWidth: number;
    title: string;
  }>;
};

export async function measureProjectCards(
  page: Page,
  path: string,
  rootSelector: string,
): Promise<ProjectCardMeasurement[]> {
  const measurements: ProjectCardMeasurement[] = [];

  for (const viewport of projectCardViewports) {
    await page.setViewportSize(viewport);
    await page.goto(path);

    const cards = await page.locator(`${rootSelector} [data-project-card]`).evaluateAll((nodes) => (
      nodes.map((node) => {
        const card = node as HTMLElement;
        const imageBox = card.querySelector<HTMLElement>('.project-card__image-link');
        const image = imageBox?.querySelector<HTMLImageElement>('img');
        const title = card.querySelector('h2')?.textContent?.trim() ?? 'Untitled project';

        if (!imageBox || !image) throw new Error(`Missing project image for ${title}`);

        const cardRect = card.getBoundingClientRect();
        const imageBoxRect = imageBox.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        const imageStyle = getComputedStyle(image);

        return {
          cardHeight: cardRect.height,
          imageBoxHeight: imageBoxRect.height,
          imageBoxWidth: imageBoxRect.width,
          imageDisplay: imageStyle.display,
          imageHeight: imageRect.height,
          imageObjectFit: imageStyle.objectFit,
          imageWidth: imageRect.width,
          title,
        };
      })
    ));

    measurements.push({ viewport, cards });
  }

  return measurements;
}

export function findProjectCardGeometryViolations(
  measurements: ProjectCardMeasurement[],
): string[] {
  return measurements.flatMap(({ viewport, cards }) => cards.flatMap((card) => {
    const violations: string[] = [];
    const label = `${viewport.name}/${card.title}`;
    const imageBoxRatio = card.imageBoxWidth / card.imageBoxHeight;

    if (Math.abs(imageBoxRatio - (4 / 3)) > 0.03) {
      violations.push(`${label}: image box ratio ${imageBoxRatio.toFixed(3)} is not approximately 4:3`);
    }
    if (Math.abs(card.imageWidth - card.imageBoxWidth) > 1) {
      violations.push(`${label}: image width ${card.imageWidth} does not fill box width ${card.imageBoxWidth}`);
    }
    if (Math.abs(card.imageHeight - card.imageBoxHeight) > 1) {
      violations.push(`${label}: image height ${card.imageHeight} does not fill box height ${card.imageBoxHeight}`);
    }
    if (card.imageDisplay !== 'block') {
      violations.push(`${label}: image display is ${card.imageDisplay}, not block`);
    }
    if (card.imageObjectFit !== 'cover') {
      violations.push(`${label}: image object-fit is ${card.imageObjectFit}, not cover`);
    }
    if (card.cardHeight > viewport.height * 1.35) {
      violations.push(`${label}: card height ${card.cardHeight} exceeds ${viewport.height * 1.35}`);
    }

    return violations;
  }));
}
