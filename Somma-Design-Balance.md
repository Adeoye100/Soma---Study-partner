---
title: Somma Design Balance
tags: [somma, design-system, landing-page, spec, eleya, siwes]
status: active-rule
updated: 2026-11-14
sources:
  - "/home/ad/Documents/SIWES/index.html (Eleya Design System, Opeyemi)"
  - "/home/ad/Downloads/SIWES_Philemon_Olusegun.html (Thirteen Weeks in the Field, Philemon Olusegun)"
  - "landing-page-design skill"
  - "Somma repo"
---

# Somma Design Balance

> *"A false balance is abomination to the LORD: but a just weight is his delight."* — Proverbs 11:1  
> Dieter Rams' sixth principle: good design is **honest**. It does not make a product look more powerful or proven than it is.

**The Rule in One Line:** Synthesize the architectural discipline of the two SIWES systems—sharp square edges, hairline 1px borders, zero drop shadows, and evidence-first structure—with Somma's dedicated pairing of **Roddenberry** (Header/Display) and **Poppins** (Body/UI), executed in an uncompromising **Black & White** palette.

---

## 0. Verified Source Analysis (100% Confidence)

Both source decks have now been inspected directly from local files:

| Source | File Inspected | Design Engine & Identity | Verified System Tokens |
|---|---|---|---|
| **Author Deck** | `/home/ad/Documents/SIWES/index.html` | **Eleya Design System** (Opeyemi, SIWES 2026) | • `border-radius: 0 !important;`<br>• `box-shadow: none !important;`<br>• Dark base `#000000`, surfaces `#050505` to `#0A0A0A`<br>• Text `#FFFFFF` with alpha steps (0.55 muted, 0.30 dim)<br>• Hairline borders `rgba(255,255,255,0.14)` resting, `rgba(255,255,255,0.4)` bright<br>• Fonts: Clash Display + Poppins |
| **Peer Deck** | `/home/ad/Downloads/SIWES_Philemon_Olusegun.html` | **Editorial Field Deck** (Philemon Olusegun) | • Square corners (`border-radius: 0`, only 50% on tiny 4-6px indicator dots)<br>• Zero shadows<br>• Bone `#f2ede1`, ink `#10100f`, red-orange `#e8482f`<br>• Display type with tight line-height (.76-.82) & negative tracking<br>• Fonts: Space Grotesk + JetBrains Mono + Instrument Serif |
| **Somma (Target)** | `frontend/` | **Autonomous Academic Study Partner** | • Header: **Roddenberry** (from `assets/roddenberry/`)<br>• Body & UI: **Poppins**<br>• Palette: **Black & White only**<br>• Geometric discipline: Sharp corners, 1px hairlines, zero shadows |

---

## 1. What Both SIWES Systems Share (The Core Grammar)

1. **Brutalist Architectural Geometry:** Both explicitly reject rounded consumer bubbles (`rounded-2xl` / pills) and fuzzy drop shadows. Surfaces are defined by clean planes and razor-sharp intersections (`border-radius: 0`, `box-shadow: none`).
2. **Hairline Border Discipline:** Every card, modal, and button uses an exact `1px solid` border. In dark mode, borders rest at subtle white opacity (~14%) and illuminate to crisp white (~40-100%) on hover or focus.
3. **Micro-Typography & Chrome:**
   - Uppercase labels with wide letter tracking (`font-size: 10px-12px`, `letter-spacing: 0.12em - 0.22em`, `text-transform: uppercase`).
   - Numbered indicators: `01 / 06`, `01 HERO`, section tags, and status pills.
4. **Evidence Over Adjectives:** Proof is concrete. Instead of marketing fluff, both systems present interactive cards, test metrics, code architecture, and live interfaces.
5. **Short Declarative Copy:** Direct, punchy statements ("Structure first.", "No guessing.").
6. **Overlay & Navigation Behavior:** Modal overlays with heavy blur and clean `Escape` dismissal.

---

## 2. Where They Differ (The Divergence)

- **Eleya (`SIWES/index.html`):** Strict pitch-black (`#000000`) dark mode with monochrome white opacity tokens; geometric display header paired with clean Poppins body; dedicated interactive card tokens (`.eleya-card`).
- **Philemon Deck (`SIWES_Philemon_Olusegun.html`):** Warm bone/ink paper palette with loud red-orange signal accent; serif italic quotes; giant display headlines.

---

## 3. The Balance for Somma

By combining the strengths of the Eleya system, the landing-page craft standards, and the user's explicit directives:

### 3.1 Color: Black & White Only
No colors, no violet, no red-orange, no colored gradients.
- **Dark Mode (Default):**
  - Background Base: `#000000` (Pitch Black)
  - Surface Card (Level 1): `#050507` / `#0A0A0C`
  - Surface Elevated (Level 2): `#111114`
  - Surface Interactive (Level 3): `#18181C`
  - Text Primary: `#FFFFFF`
  - Text Muted: `rgba(255, 255, 255, 0.65)`
  - Text Dim / Labels: `rgba(255, 255, 255, 0.35)`
  - Hairline Border: `rgba(255, 255, 255, 0.14)`
  - Border Bright / Hover: `rgba(255, 255, 255, 0.45)`
  - Active / Focus: `#FFFFFF`
- **Light Mode:**
  - Background Base: `#FFFFFF` (or `#F5F3EE`)
  - Surface Card: `#FFFFFF`
  - Surface Elevated: `#F0EFEB`
  - Text Primary: `#000000`
  - Text Muted: `rgba(0, 0, 0, 0.65)`
  - Hairline Border: `rgba(0, 0, 0, 0.16)`
  - Border Bright: `rgba(0, 0, 0, 0.50)`

### 3.2 Typography: Roddenberry + Poppins
- **Header & Display (`h1` - `h6`, `.font-heading`, Display, Brand/Logo):**
  - **Roddenberry** (from `frontend/src/assets/roddenberry/`).
  - Wide, geometric, futuristic-academic command-center presence.
  - Letter spacing: `tracking-wider` or `0.04em`.
- **Body & Other Text (`p`, labels, inputs, question text, options):**
  - **Poppins** (`300`, `400`, `500`, `600`, `700`).
  - Highly legible, neutral, balanced geometry.
- **Numerals & Monospace (Timers, Section IDs, Percentages, Code):**
  - **Geist Mono** / Monospace.

### 3.3 Geometry & Surfaces: The Eleya Rule
- **Border Radius:** `border-radius: 0` (`rounded-none`). No soft bubbly roundings.
- **Drop Shadows:** `box-shadow: none` (`shadow-none`). Depth is achieved through surface tone elevation and 1px hairline borders.
- **Card Borders:** Full 4-sided `1px solid` border (`border-border`). Never 1-sided borders on cards.

### 3.4 Buttons: Precision Monochrome Primitives
All buttons adopt sharp square edges, high contrast, and micro-tracked typography:
- **Shape:** `rounded-none`, `border: 1px solid`.
- **Typography:** `font-sans uppercase tracking-[0.12em] font-semibold text-xs` (or `text-sm`).
- **Variants:**
  - `default`: Solid `#FFFFFF` background with `#000000` text. On hover: Inverts to `#000000` background with `#FFFFFF` text and `border-white`.
  - `outline`: Transparent background, `1px solid rgba(255,255,255,0.20)`, `#FFFFFF` text. On hover: `rgba(255,255,255,0.10)` background, `border-white`.
  - `secondary`: `rgba(255,255,255,0.08)` background, `#FFFFFF` text, `border-white/15`. On hover: `border-white/40`, `bg-white/15`.
  - `ghost`: Transparent background, `#FFFFFF` text. On hover: `bg-white/10`, `border-white/20`.
  - `destructive`: `#000000` background, `#FFFFFF` text, `border-white/60`. On hover: `#FFFFFF` background, `#000000` text.
- **Motion:** Spring bezier `cubic-bezier(0.32, 0.72, 0, 1)`, duration 200ms.

---

## 4. Specification by Surface

| Dimension | Landing Page | App Shell & Dashboard | Exam Screen |
|---|---|---|---|
| **Palette** | Black & White only (`#000000` / `#FFFFFF`) | Black & White only | Black & White only (zero distractions) |
| **Header Font** | Roddenberry (bold, wide, uppercase display) | Roddenberry | Roddenberry (section headers) |
| **Body Font** | Poppins (clean, readable) | Poppins | Poppins (high-legibility question reading) |
| **Shape** | Square edges (`rounded-none`) | Square edges (`rounded-none`) | Square edges (`rounded-none`) |
| **Borders** | 1px hairline (`border-white/14` → `border-white/45`) | 1px hairline | 1px hairline |
| **Buttons** | Solid white primary, sharp outline secondary | Solid white primary, outline secondary | Clean high-contrast submit/nav buttons |
| **Section Labels** | Uppercase tracked `01 / INTAKE`, `02 / GENERATE` | Uppercase tracked module headers | Minimal question counter `04 / 20` |

---

## 5. Implementation Checklist

- [x] Font assets copied and registered in `frontend/public/fonts/roddenberry/` and `@font-face` in `frontend/index.css`.
- [x] Tailwind config updated: `heading: ['Roddenberry']`, `sans: ['Poppins']`, `rounded-none` defaults.
- [x] Pure Black & White color tokens set in `frontend/index.css` (:root and light theme).
- [x] Base Button primitive updated in `frontend/src/components/ui/button.tsx` with sharp square geometry, micro-tracking, and high-contrast B&W hover inversion.
- [x] Card and container styles snapped to 0 border radius and 0 drop shadows.
- [x] Full build verification with `pnpm vite build`.
