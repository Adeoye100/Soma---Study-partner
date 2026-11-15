import { useEffect, useRef } from 'react';
import { animate, cubicBezier, stagger } from 'animejs';

// Custom cubic-bezier easings for high-precision tactile motion
export const easePower4Out = cubicBezier(0.16, 1, 0.3, 1);
export const easeSpringOvershoot = cubicBezier(0.34, 1.56, 0.64, 1);
export const easeDecel = cubicBezier(0.22, 1, 0.36, 1);

/**
 * useMagneticHover
 * Gives CTA buttons or interactive elements a subtle magnetic pull (±6px cursor tracking)
 * with spring overshoot recoil on release.
 */
export function useMagneticHover<T extends HTMLElement>(options?: {
  strength?: number;
  disabled?: boolean;
}) {
  const ref = useRef<T>(null);
  const { strength = 6, disabled = false } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const pullX = Math.max(-strength, Math.min(strength, deltaX * strength));
      const pullY = Math.max(-strength, Math.min(strength, deltaY * strength));

      animate(el, {
        translateX: pullX,
        translateY: pullY,
        duration: 150,
        ease: 'easeOutQuad',
      });
    };

    const handleMouseLeave = () => {
      animate(el, {
        translateX: [null, 0],
        translateY: [null, 0],
        duration: 500,
        ease: easeSpringOvershoot,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  return ref;
}

/**
 * useTactile3DTilt
 * Gives cards a subtle 3D tilt with spring recoil on mouse leave.
 */
export function useTactile3DTilt<T extends HTMLElement>(options?: {
  maxTilt?: number;
  scale?: number;
  disabled?: boolean;
}) {
  const ref = useRef<T>(null);
  const { maxTilt = 4, scale = 1.012, disabled = false } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      const rotY = normX * maxTilt;
      const rotX = -normY * maxTilt;

      animate(el, {
        rotateX: rotX,
        rotateY: rotY,
        scale: scale,
        duration: 180,
        ease: 'easeOutQuad',
      });
    };

    const handleMouseLeave = () => {
      animate(el, {
        rotateX: [null, 0],
        rotateY: [null, 0],
        scale: [null, 1],
        duration: 550,
        ease: easeSpringOvershoot,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, scale, disabled]);

  return ref;
}

/**
 * useTactilePress
 * Snappy tactile press compression and spring bounce on pointer up.
 */
export function useTactilePress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleDown = () => {
      animate(el, {
        scale: 0.96,
        duration: 100,
        ease: 'easeOutQuad',
      });
    };

    const handleUp = () => {
      animate(el, {
        scale: [0.96, 1.02, 1],
        duration: 350,
        ease: easeSpringOvershoot,
      });
    };

    el.addEventListener('pointerdown', handleDown);
    el.addEventListener('pointerup', handleUp);
    el.addEventListener('pointercancel', handleUp);

    return () => {
      el.removeEventListener('pointerdown', handleDown);
      el.removeEventListener('pointerup', handleUp);
      el.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  return ref;
}

/**
 * useSvgLineDraw
 * Uses Anime.js to draw SVG stroke paths dynamically on intersection.
 */
export function useSvgLineDraw<T extends SVGSVGElement>(options?: {
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<T>(null);
  const played = useRef(false);
  const { duration = 1200, delay = 100 } = options ?? {};

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>('path, line, circle, rect, polyline'));
    if (!paths.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    paths.forEach((p) => {
      if ('getTotalLength' in p) {
        const len = (p as SVGPathElement).getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      }
    });

    const observer = new IntersectionObserver((entries) => {
      if (played.current) return;
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      played.current = true;
      observer.disconnect();

      paths.forEach((p, idx) => {
        animate(p, {
          strokeDashoffset: [null, 0],
          duration,
          delay: delay + idx * 80,
          ease: easePower4Out,
        });
      });
    }, { threshold: 0.1 });

    observer.observe(svg);
    return () => observer.disconnect();
  }, [duration, delay]);

  return ref;
}

/**
 * animeSpringStagger
 * Runs an Anime.js stagger reveal on target elements with spring deceleration.
 */
export function animeSpringStagger(
  targets: HTMLElement[] | string,
  options?: {
    translateY?: number;
    staggerMs?: number;
    duration?: number;
    delay?: number;
  }
) {
  const {
    translateY = 24,
    staggerMs = 35,
    duration = 650,
    delay = 0,
  } = options ?? {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  animate(targets, {
    opacity: [0, 1],
    translateY: [translateY, 0],
    duration,
    delay: stagger(staggerMs, { start: delay }),
    ease: easePower4Out,
  });
}
