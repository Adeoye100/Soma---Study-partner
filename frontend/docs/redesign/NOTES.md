# Soma UI Redesign — Engineering & Design Log

## Context
Refinement pass on Soma — Study Partner frontend (`frontend/`). Operating in Operate mode for application screens (consistency, scanability, and system unifications outrank expression).

## Phase 0: Baseline & Safety Observations
- **Branch**: `redesign/ui-foundation`
- **Initial Baseline gates**:
  - `pnpm exec vite build`: 3117 modules transformed; output JS 2,318.21 kB (gzip 641.63 kB), CSS 119.71 kB (gzip 19.09 kB).
  - `pnpm exec tsc --noEmit`: 73 errors recorded on clean baseline commit `b2accd3` (and 73 at branch point before UI changes, plus 6 on backend pre-existing = 79). Gate is $\le 79$ total pre-existing and 0 in any edited/created files.
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

## Phase 1: Foundations Implementation
- **Self-hosted Inter font**: Added `@fontsource-variable/inter` in `src/main.tsx`, deleted external Google Fonts `@import` in `index.css`, and configured `Inter Variable` stack in `tailwind.config.js`. Strict CSP compliance preserved.
- **ThemeProvider & useTheme Context**: Created `context/ThemeContext.tsx` supporting `dark`, `light`, and `system` modes with dynamic OS preference listening (`prefers-color-scheme`). Storage key: `soma-theme`. Re-exported in `@/context/ThemeContext`.
- **No-Flash Theme Init**: Created sync `public/theme-init.js` and loaded via `<script src="/theme-init.js">` in `index.html`. Sets `color-scheme` property on `<html>` and toggles `.dark`/`.light` classes before React hydration.
- **App.tsx & MainApp.tsx Cleanups**: Removed forced dark `useEffect` and dead `theme`/`toggleTheme` state from `App.tsx` and `MainApp.tsx`. Replaced hard-coded wrapper backgrounds (`bg-slate-900 text-slate-50`) with `bg-background text-foreground`.
- **Tokenize Dark-only CSS**: Replaced hardcoded borders and shadows in `.recharts-default-tooltip` and `.card-surface` with token-based definitions.
- **Motion Tokens**: Added 150ms / 200ms / 300ms duration tokens and `ui` / `ui-inout` bezier easing curves in Tailwind and CSS `:root`. Added global `@media (prefers-reduced-motion: reduce)` in `index.css` and wrapped app root with Framer Motion `<MotionConfig reducedMotion="user">`.
- **Toaster Theme**: Updated `src/components/ui/sonner.tsx` to read theme reactively from `useTheme()` provider.

## Phase 2: Button Primitive & Auth Pilot
- **Upgraded Button Primitive (`src/components/ui/button.tsx`)**:
  - Added `loading?: boolean` prop that renders Lucide `Loader2` spinner with `aria-hidden`, sets `aria-busy="true"`, and disables the button.
  - Replaced `transition-all` with targeted `transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-ui`.
  - Added tactile press feedback: `active:scale-[0.98] motion-reduce:transform-none`.
  - Added touch target padding: `[@media(pointer:coarse)]:min-h-11` (ensuring 44px min touch target on mobile).
- **ThemeToggle Component (`components/ThemeToggle.tsx`)**:
  - Created ghost icon button cycling `dark` → `light` → `system`.
  - Renders Lucide `Moon`, `Sun`, or `Monitor` depending on current active state.
  - Dynamic `aria-label` announcing current mode and next state.
  - Mounted directly in `components/Header.tsx` next to user avatar and logout.
- **Auth Module Migration**:
  - `components/forms/EmailField.tsx`: Tokenized input borders (`border-input`), card background (`bg-card`), foreground text, error states (`text-destructive`, `border-destructive`), and added accessibility attributes (`aria-invalid`, `aria-describedby`).
  - `components/forms/PasswordField.tsx`: Replaced inline SVGs with Lucide `Eye`/`EyeOff`, tokenized input and focus rings, added `aria-label` to toggle button.
  - `components/ForgotPasswordForm.tsx`: Migrated submit button to `<Button loading={loading}>` ("Send reset link"), navigation link to `<Button variant="link">`, tokenized alert banners and inputs.
  - `components/forms/LoginForm.tsx`: Migrated submit button to `<Button loading={loading}>` ("Log in"), Google auth button to `<Button variant="outline">` ("Sign in with Google"), tokenized checkboxes, divider, and text.
  - `components/forms/SignupForm.tsx`: Migrated submit button to `<Button loading={loading}>` ("Sign up"), tokenized inputs, selects, error states, and helper links ("Log in", "Terms & Support").
  - `components/ResetPasswordForm.tsx`: Replaced 5 inline SVGs with Lucide `Eye`/`EyeOff` and `<Button>` spinner, removed multi-layer slate gradients in favor of `bg-background` and `bg-card border-border`, migrated submit button to `<Button loading={loading}>` ("Reset password").
  - `components/forms/AuthContainer.tsx`: Tokenized icon colors (`text-primary`) and subtitle (`text-muted-foreground`).
  - `components/PasswordStrengthIndicator.tsx`: Tokenized criteria states (`text-success`, `text-muted-foreground`) and standardized transitions to `duration-200`.
  - `pages/auth/callback.tsx`: Tokenized inline hex backgrounds and borders to `bg-background text-foreground border-primary`.

## Verification & Gates

| Gate Metric | Baseline (Commit b2accd3) | After Phase 2 (Commit 5e2ad32) | Status |
| :--- | :--- | :--- | :--- |
| **Vite Build** | Passed (3117 modules) | **Passed (3522 modules, 0 errors)** | ✅ PASS |
| **TSC Errors (`tsc --noEmit`)** | 73 (79 with branch backend) | **78 total (0 new errors, -1 error)** | ✅ PASS |
| **Broken `primary-NNN` classes** | 106 across project | **0 in Auth module & foundations** | ✅ PASS |
| **Forbidden colors (orange/amber)** | Existing peach frozen | **0 additions (+0)** | ✅ PASS |
| **Button Primitive Adoption** | 0 uses in live code | **100% in Auth module & Header** | ✅ PASS |
| **Inline SVGs in Auth** | 8 inline SVGs | **0 inline SVGs (all Lucide)** | ✅ PASS |
| **Theme System Flash** | N/A (dark hardcoded) | **Zero flash via `theme-init.js`** | ✅ PASS |
| **Touch Targets on Mobile** | Hand-rolled <40px | **>=44px (`min-h-11`)** | ✅ PASS |

## Screenshots Captured
- **Before**: `docs/redesign/before/` (`landing-*.png`, `login-*.png`, `signup-*.png`, `reset-password-*.png` at 1280px, 768px, 375px)
- **After**: `docs/redesign/after/`
  - `login-dark-1280.png`, `login-dark-375.png`
  - `login-light-1280.png`, `login-light-375.png`
  - `signup-dark-1280.png`, `signup-dark-375.png`
  - `signup-light-1280.png`, `signup-light-375.png`
  - `reset-password-dark-1280.png`, `reset-password-dark-375.png`
  - `reset-password-light-1280.png`, `reset-password-light-375.png`
