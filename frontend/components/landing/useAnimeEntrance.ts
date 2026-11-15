import { useEffect, useRef } from 'react';
import { animate, stagger, cubicBezier } from 'animejs';

export const easeSpring = cubicBezier(0.22, 1, 0.36, 1);

/**
 * useAnimeEntrance
 *
 * Watches an element entering the viewport via IntersectionObserver and runs
 * an animejs stagger-reveal on its children matching the given selector.
 *
 * Uses only transform + opacity (compositor-only, no layout thrash).
 * Respects prefers-reduced-motion by skipping animation and snapping to end state.
 *
 * Returns the ref to attach to the container element.
 */
export function useAnimeEntrance<T extends HTMLElement>(
  childSelector = '[data-anime]',
  options?: {
    translateY?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: ReturnType<typeof cubicBezier> | string;
  },
) {
  const ref = useRef<T>(null);
  const played = useRef(false);

  const {
    translateY = 28,
    duration = 700,
    stagger: staggerMs = 60,
    delay = 0,
    ease = easeSpring,
  } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(el.querySelectorAll<HTMLElement>(childSelector));
    if (!targets.length) return;

    // Set initial hidden state
    if (!prefersReduced) {
      targets.forEach((t) => {
        t.style.opacity = '0';
        t.style.transform = `translateY(${translateY}px)`;
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (played.current) return;
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        played.current = true;
        observer.disconnect();

        if (prefersReduced) {
          targets.forEach((t) => {
            t.style.opacity = '1';
            t.style.transform = 'none';
          });
          return;
        }

        animate(targets, {
          opacity: [0, 1],
          translateY: [translateY, 0],
          duration,
          delay: stagger(staggerMs, { start: delay }),
          ease,
        });
      },
      { threshold: 0.12, rootMargin: '-40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [childSelector, translateY, duration, staggerMs, delay, ease]);

  return ref;
}

/**
 * animeHeroIn
 *
 * One-shot hero entrance — called on mount, not scroll-triggered.
 * Staggers the headline words, then subheadline, then CTAs.
 */
export function animeHeroIn(container: HTMLElement) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const words = Array.from(container.querySelectorAll<HTMLElement>('[data-hero-word]'));
  const sub = container.querySelector<HTMLElement>('[data-hero-sub]');
  const ctas = Array.from(container.querySelectorAll<HTMLElement>('[data-hero-cta]'));

  if (prefersReduced) {
    [...words, sub, ...ctas].forEach((el) => {
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    return;
  }

  // Words: clip up from below
  if (words.length) {
    words.forEach((w) => {
      w.style.opacity = '0';
      w.style.transform = 'translateY(100%)';
    });
    animate(words, {
      opacity: [0, 1],
      translateY: ['100%', '0%'],
      duration: 650,
      delay: stagger(38, { start: 0 }),
      ease: easeSpring,
    });
  }

  // Subheadline
  if (sub) {
    sub.style.opacity = '0';
    sub.style.transform = 'translateY(14px)';
    animate(sub, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 650,
      delay: words.length * 38 + 60,
      ease: easeSpring,
    });
  }

  // CTAs
  if (ctas.length) {
    ctas.forEach((c) => { c.style.opacity = '0'; c.style.transform = 'translateY(14px)'; });
    animate(ctas, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 550,
      delay: stagger(80, { start: words.length * 38 + 160 }),
      ease: easeSpring,
    });
  }
}
