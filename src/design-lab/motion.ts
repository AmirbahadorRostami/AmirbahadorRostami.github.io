import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let scrollTriggerRegistered = false;

function registerScrollTrigger(): void {
  if (scrollTriggerRegistered) return;

  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
}

export function initializeDesignLabMotion(root?: ParentNode): () => void {
  if (
    typeof window === 'undefined'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => undefined;
  }

  registerScrollTrigger();

  const scope = root ?? document;
  const animations: gsap.core.Animation[] = [];
  const triggers = new Set<ScrollTrigger>();
  const pinTriggers = new Set<ScrollTrigger>();
  const pinMedia = window.matchMedia('(min-width: 901px)');

  const ownAnimation = <T extends gsap.core.Animation>(animation: T): T => {
    animations.push(animation);
    if (animation.scrollTrigger) triggers.add(animation.scrollTrigger);
    return animation;
  };

  const clearPins = () => {
    pinTriggers.forEach((trigger) => trigger.kill());
    pinTriggers.clear();
  };

  const syncPins = () => {
    clearPins();
    if (!pinMedia.matches) return;

    scope.querySelectorAll<HTMLElement>('[data-lab-pin]').forEach((element) => {
      pinTriggers.add(ScrollTrigger.create({
        trigger: element,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: '+=100%',
      }));
    });
  };

  pinMedia.addEventListener('change', syncPins);
  syncPins();

  scope.querySelectorAll<HTMLElement>('[data-lab-scale]').forEach((element) => {
    ownAnimation(gsap.fromTo(
      element,
      { opacity: 0.65, scale: 1.08 },
      {
        opacity: 1,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    ));
  });

  scope.querySelectorAll<HTMLElement>('[data-lab-reveal]').forEach((element) => {
    ownAnimation(gsap.from(element, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }));
  });

  scope.querySelectorAll<HTMLElement>('[data-lab-scrub-reveal-group]').forEach((element) => {
    const targets = Array.from(element.querySelectorAll<HTMLElement>('[data-lab-scrub-reveal]'));
    const contrastSafeTargets = Array.from(element.querySelectorAll<HTMLElement>('[data-lab-contrast-safe-reveal]'));

    if (targets.length) {
      ownAnimation(gsap.fromTo(
        targets,
        { opacity: 0, yPercent: 20 },
        {
          opacity: 1,
          yPercent: 0,
          ease: 'none',
          stagger: 0.16,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 35%',
            scrub: true,
          },
        },
      ));
    }

    if (contrastSafeTargets.length) {
      ownAnimation(gsap.fromTo(
        contrastSafeTargets,
        { opacity: 1, yPercent: 20 },
        {
          opacity: 1,
          yPercent: 0,
          ease: 'none',
          stagger: 0.16,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 35%',
            scrub: true,
          },
        },
      ));
    }
  });

  scope.querySelectorAll<HTMLElement>('[data-lab-stack]').forEach((element, index) => {
    ownAnimation(gsap.from(element, {
      opacity: 0,
      y: 48 + index * 12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    }));
  });

  scope.querySelectorAll<HTMLElement>('[data-lab-marquee]').forEach((element) => {
    ownAnimation(gsap.to(element, {
      xPercent: -50,
      duration: 24,
      ease: 'none',
      repeat: -1,
    }));
  });

  return () => {
    pinMedia.removeEventListener('change', syncPins);
    clearPins();
    triggers.forEach((trigger) => trigger.kill());
    animations.forEach((animation) => animation.revert());
    triggers.clear();
    animations.length = 0;
  };
}

export function registerDesignLabCleanup(cleanup: () => void): () => void {
  let active = true;
  const dispose = () => {
    if (!active) return;
    active = false;
    document.removeEventListener('astro:before-swap', dispose);
    cleanup();
  };

  document.addEventListener('astro:before-swap', dispose, { once: true });
  import.meta.hot?.dispose(dispose);
  return dispose;
}
