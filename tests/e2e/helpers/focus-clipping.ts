import type { Page } from '@playwright/test';

export interface FocusClippingViolation {
  label: string;
  outlineWidth: number;
  outlineOffset: number;
  clippingAncestor: string;
  clippedEdges: string[];
  outlineRect?: { left: number; right: number; top: number; bottom: number };
  clippingRect?: { left: number; right: number; top: number; bottom: number };
}

export async function findFocusClippingViolations(page: Page): Promise<FocusClippingViolation[]> {
  return page.locator('body').evaluate(async () => {
    const rootScrollBehavior = document.documentElement.style.scrollBehavior;
    const bodyScrollBehavior = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    const clippingValues = ['hidden', 'clip', 'scroll', 'auto'];
    const getClientBoundary = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left + element.clientLeft,
        right: rect.left + element.clientLeft + element.clientWidth,
        top: rect.top + element.clientTop,
        bottom: rect.top + element.clientTop + element.clientHeight,
      };
    };
    const revealOnClippedAxes = (element: HTMLElement) => {
      let ancestor = element.parentElement;
      while (ancestor && ancestor !== document.body && ancestor !== document.documentElement) {
        const style = getComputedStyle(ancestor);
        const clipsX = clippingValues.includes(style.overflowX);
        const clipsY = clippingValues.includes(style.overflowY);
        const boundary = getClientBoundary(ancestor);
        const rect = element.getBoundingClientRect();

        if (clipsX && rect.width <= boundary.right - boundary.left) {
          if (rect.left < boundary.left) ancestor.scrollLeft -= boundary.left - rect.left;
          else if (rect.right > boundary.right) ancestor.scrollLeft += rect.right - boundary.right;
        }
        if (clipsY && rect.height <= boundary.bottom - boundary.top) {
          if (rect.top < boundary.top) ancestor.scrollTop -= boundary.top - rect.top;
          else if (rect.bottom > boundary.bottom) ancestor.scrollTop += rect.bottom - boundary.bottom;
        }
        ancestor = ancestor.parentElement;
      }

      const rect = element.getBoundingClientRect();
      let deltaX = 0;
      let deltaY = 0;
      if (rect.width <= window.innerWidth) {
        if (rect.left < 0) deltaX = rect.left;
        else if (rect.right > window.innerWidth) deltaX = rect.right - window.innerWidth;
      }
      if (rect.height <= window.innerHeight) {
        if (rect.top < 0) deltaY = rect.top;
        else if (rect.bottom > window.innerHeight) deltaY = rect.bottom - window.innerHeight;
      }
      if (deltaX || deltaY) window.scrollBy(deltaX, deltaY);
    };

    const focusables = Array.from(document.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ));
    const clipped: FocusClippingViolation[] = [];

    for (const element of focusables) {
      if (!element.checkVisibility()) continue;
      element.focus();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      revealOnClippedAxes(element);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      revealOnClippedAxes(element);

      const style = getComputedStyle(element);
      const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
      const outlineOffset = Number.parseFloat(style.outlineOffset) || 0;
      const label = element.getAttribute('aria-label')
        ?? element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80)
        ?? element.tagName;
      if (style.outlineStyle === 'none' || outlineWidth < 2) {
        clipped.push({
          label,
          outlineWidth,
          outlineOffset,
          clippingAncestor: 'missing visible outline',
          clippedEdges: [],
        });
        continue;
      }

      const elementRect = element.getBoundingClientRect();
      const outerOutlineOffset = outlineWidth + outlineOffset;
      const outlineRect = {
        left: elementRect.left - outerOutlineOffset,
        right: elementRect.right + outerOutlineOffset,
        top: elementRect.top - outerOutlineOffset,
        bottom: elementRect.bottom + outerOutlineOffset,
      };
      const tolerance = 0.5;
      let clippedEdges = [
        outlineRect.left < -tolerance && 'left',
        outlineRect.right > window.innerWidth + tolerance && 'right',
        outlineRect.top < -tolerance && 'top',
        outlineRect.bottom > window.innerHeight + tolerance && 'bottom',
      ].filter((edge): edge is string => Boolean(edge));
      const viewportClips = clippedEdges.length > 0;
      let clippingRect = {
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: window.innerHeight,
      };

      let ancestor = element.parentElement;
      let ancestorClips = false;
      let clippingAncestor = '';
      while (ancestor) {
        const ancestorStyle = getComputedStyle(ancestor);
        const clipsX = clippingValues.includes(ancestorStyle.overflowX);
        const clipsY = clippingValues.includes(ancestorStyle.overflowY);
        if (clipsX || clipsY) {
          const boundary = getClientBoundary(ancestor);
          const ancestorClippedEdges = [
            clipsX && outlineRect.left < boundary.left - tolerance && 'left',
            clipsX && outlineRect.right > boundary.right + tolerance && 'right',
            clipsY && outlineRect.top < boundary.top - tolerance && 'top',
            clipsY && outlineRect.bottom > boundary.bottom + tolerance && 'bottom',
          ].filter((edge): edge is string => Boolean(edge));
          if (ancestorClippedEdges.length > 0) {
            ancestorClips = true;
            clippedEdges = ancestorClippedEdges;
            clippingRect = boundary;
            const classes = Array.from(ancestor.classList).map((name) => `.${name}`).join('');
            clippingAncestor = `${ancestor.tagName.toLowerCase()}${ancestor.id ? `#${ancestor.id}` : classes}`;
            break;
          }
        }
        ancestor = ancestor.parentElement;
      }

      if (viewportClips || ancestorClips) {
        const roundRect = (rect: typeof outlineRect) => ({
          left: Number(rect.left.toFixed(2)),
          right: Number(rect.right.toFixed(2)),
          top: Number(rect.top.toFixed(2)),
          bottom: Number(rect.bottom.toFixed(2)),
        });
        clipped.push({
          label,
          outlineWidth,
          outlineOffset,
          clippingAncestor: clippingAncestor || 'viewport',
          clippedEdges,
          outlineRect: roundRect(outlineRect),
          clippingRect: roundRect(clippingRect),
        });
      }
    }

    document.documentElement.style.scrollBehavior = rootScrollBehavior;
    document.body.style.scrollBehavior = bodyScrollBehavior;
    return clipped;
  });
}
