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

  const ownAnimation = <T extends gsap.core.Animation>(animation: T): T => {
    animations.push(animation);
    if (animation.scrollTrigger) triggers.add(animation.scrollTrigger);
    return animation;
  };

  scope.querySelectorAll<HTMLElement>('[data-lab-pin]').forEach((element) => {
    triggers.add(ScrollTrigger.create({
      trigger: element,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: '+=100%',
    }));
  });

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
    if (!targets.length) return;

    ownAnimation(gsap.fromTo(
      targets,
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
    triggers.forEach((trigger) => trigger.kill());
    animations.forEach((animation) => animation.revert());
    triggers.clear();
    animations.length = 0;
  };
}
