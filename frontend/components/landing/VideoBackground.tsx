import React, { useEffect, useRef } from 'react';

/**
 * VideoBackground
 *
 * Full-bleed ascii video behind the landing page, Moonsworth-style.
 * The video is fixed to the viewport and sits beneath all content (z-0).
 * A multi-layer gradient scrim keeps text legible in both themes.
 *
 * Performance: only opacity/transform animated, will-change on video,
 * autoplay blocked gracefully, paused on prefers-reduced-motion.
 */
export const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      video.pause();
      return;
    }

    const play = () => {
      video.play().catch(() => {
        // Autoplay blocked (mobile low-power mode) — poster frame stays visible
      });
    };

    if (video.readyState >= 3) {
      play();
    } else {
      video.addEventListener('canplaythrough', play, { once: true });
    }

    return () => {
      video.removeEventListener('canplaythrough', play);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Video layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform', transform: 'scale(1.02)' }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/ascii-bg.webm" type="video/webm" />
        <source src="/ascii-bg.mp4" type="video/mp4" />
      </video>

      {/*
        Dark-mode scrim (default):
        - Radial fade softens the center
        - Bottom ramp darkens beneath text sections
        - Flat base at ~60% keeps WCAG AA contrast
      */}
      <div
        className="dark-scrim absolute inset-0 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(ellipse 85% 65% at 50% 38%,
              transparent 0%,
              rgba(14,16,21,0.42) 100%
            ),
            linear-gradient(180deg,
              rgba(14,16,21,0.28) 0%,
              transparent 32%,
              transparent 52%,
              rgba(14,16,21,0.80) 100%
            ),
            rgba(14,16,21,0.60)
          `,
        }}
      />

      {/*
        Light-mode scrim: warm alabaster overlay.
        Activated via .light & .light-scrim and [data-theme=light] in index.css.
      */}
      <div
        className="light-scrim absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(ellipse 85% 65% at 50% 38%,
              transparent 0%,
              rgba(250,248,245,0.52) 100%
            ),
            linear-gradient(180deg,
              rgba(250,248,245,0.32) 0%,
              transparent 38%,
              rgba(250,248,245,0.72) 100%
            ),
            rgba(250,248,245,0.65)
          `,
        }}
      />
    </div>
  );
};

export default VideoBackground;
