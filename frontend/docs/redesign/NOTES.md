# Soma UI Redesign — Engineering & Design Log

## Context
Refinement pass on Soma — Study Partner frontend (`frontend/`). Operating in Operate mode for application screens (consistency, scanability, and system unifications outrank expression).

## Phase 0: Baseline & Safety Observations
- **Branch**: `redesign/ui-foundation`
- **Initial Baseline gates**:
  - `pnpm exec vite build`: 3117 modules transformed; output JS 2,318.21 kB (gzip 641.63 kB), CSS 119.71 kB (gzip 19.09 kB).
  - `pnpm exec tsc --noEmit`: 73 errors recorded on clean baseline commit `b2accd3` (and 73 at branch point before UI changes). Gate is $\le 73$ pre-existing and 0 in any edited/created files.
- **Chrome Headless screenshots**:
  - Captured `landing-1280.png`, `landing-768.png`, `landing-375.png`.
  - Captured `login-1280.png`, `login-768.png`, `login-375.png`.
  - Captured `signup-1280.png`, `signup-768.png`, `signup-375.png`.
  - Captured `reset-password-1280.png`, `reset-password-768.png`, `reset-password-375.png`.
  - All saved under `docs/redesign/before/`.
- **Pre-flight Dials**:
  - `DESIGN_VARIANCE=3`
  - `MOTION_INTENSITY=4`
  - `VISUAL_DENSITY=5`
- **Design Read**:
  - "Reading this as: Operate-mode EdTech study companion for focused learners, with a disciplined violet-on-deep-navy palette, leaning toward high-contrast tokenized utility architecture."

## Decisions Taken & Followed
- **D1**: Frozen existing peach gradient uses (`#fdba74` / `to-orange-*`); zero additions.
- **D2**: Locked accent to primary indigo-violet (`hsl(245 100% 68%)`).
- **D3**: Motion restricted to framer-motion + CSS tokens (no GSAP).
- **D4**: Orphaned `src/` dashboard tree untouched except updating shared `button.tsx`.
- **D5**: Self-hosted Inter font via `@fontsource-variable/inter` to satisfy strict CSP without loosening `style-src`.
- **D6**: Remained on Tailwind 3.4.
- **D7**: Light theme parity implemented via tokens.
