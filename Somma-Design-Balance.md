---
title: Somma Design Balance
tags: [somma, design-system, landing-page, spec]
status: draft
updated: 2026-11-14
sources: [SIWES_Philemon_Olusegun.html, siwes-presentation-five.vercel.app, landing-page-design skill, Somma repo @9d28307]
---

# Somma Design Balance

> *"A false balance is abomination to the LORD: but a just weight is his delight."* — Proverbs 11:1
> Dieter Rams' sixth principle: good design is **honest**. It does not make a product look more powerful or proven than it is.

**The rule in one line:** borrow the SIWES decks' *grammar*, obey the skill's *craft rules*, and keep Somma's *identity*. Don't average the three.

---

## 0. What I could and could not verify

| Source | What I read | Confidence |
|---|---|---|
| Uploaded deck (`SIWES_Philemon_Olusegun.html`) | Full CSS and JS (fonts and images were base64, stripped) | **High**. This is a *different author's* deck ("Thirteen Weeks in the Field", Neo Cloud Technologies, Abuja). |
| Live site (`siwes-presentation-five`) | Rendered text, structure, asset names | **Medium for structure, none for tokens.** The fetch tool returns text, not the stylesheet. |
| Somma | Landing code at `9d28307` (13 files, 2,587 LOC) and an earlier-phase screenshot | **High for code.** The screenshot predates the current hero copy. |

> [!question] To verify the live site's palette, fonts and radius, open it, DevTools → Elements → `:root`, and paste the variables here (or save the page as HTML). Until then, every token comparison below is for the uploaded deck only.

---

## 1. What the two SIWES systems share (verified in both)

| Pattern | Live site | Uploaded deck | Take for Somma? |
|---|---|---|---|
| **Deck chrome:** a `NN / NN` counter | "01 / 09" | `01 / 12` (generated in JS) | ✅ as a scroll indicator |
| **Index of sections** | "01 HERO 02 RESIDENCE … 09 CONCLUSION" | `#index` overlay, key `O` | ✅ as the landing nav and scroll spy |
| **Uppercase small labels with numbers** | "02 \| PLACE OF RESIDENCE / ORGANIZATION" | uppercase on 61 rules; "01 / Trainee" | ✅ for section eyebrows |
| **Evidence over adjectives** | QR codes, project screenshots, an "Evidences" gallery | "9 labs. 3 case files. 1 live assessment."; 16 images, all with alt text | ✅ the strongest idea to borrow |
| **Short declarative fragments** | "No guessing. No random coding. Structure first." | "ONE DESK. two roles."; "Seven steps. Zero exploitation." | ✅ for headlines, within the copy rules |
| **Esc closes overlays** | "press ESC to close" | `Escape` handler | ✅ already a plan item |
| **Light and dark both exist** | "LIGHT" toggle, two ASCII videos | alternating cream and ink slides | ✅ Somma already has a theme system |
| **Closing slide with counts** | "03 Months Completed · 02 Core Projects" | "The field report." | ➖ not for a product page |

Both come from the same cohort (matric numbers `24/10MSS047` and `24/10MSS048`) and share the same deck skeleton. I can't tell which came first. Keep the **structure**; don't lift the other deck's palette or type pairing wholesale, since those are its signature.

## 2. Where they differ (so we don't blend them)

| | Uploaded deck | Live site |
|---|---|---|
| Palette | cream `#f2ede1`, ink `#10100f`, **red-orange `#e8482f`**, mint `#9df5d8` | *unverified* (dark-first) |
| Type | Space Grotesk + JetBrains Mono + Instrument Serif (3 families) | *unverified* |
| Shape and surface | square corners (only `50%`), **0 shadows**, 1px hairlines and 2px ink rules | *unverified* |
| Background | faint blueprint grid made of gradients | ASCII-art video (dark and light) |
| Display type | giant uppercase, tracking `-.075em`, line height `.82` | *unverified* |
| Motion | `clip-path` wipes, `.2s` to `.8s`, two custom curves, 1 reduced-motion rule | *unverified* |
| Layout | fixed stage, one slide per screen, keyboard navigation | numbered sections with counter |

---

## 3. Conflict map: SIWES vs the skill vs Somma today

| Dimension | SIWES deck | Skill rule | Somma today (verified) | **Decision** |
|---|---|---|---|---|
| **Accent** | red-orange `#e8482f` | no rule | violet `245 100% 68%` | **Violet is the single "signal."** Reject red-orange (it is orange-adjacent, and you ruled orange out). |
| **Typeface** | 3 families | **one typeface**; Geist / Manrope / Poppins; Geist Mono for numeric UI only; never Inter; no italics | Tailwind `sans` = **Poppins**; `mono` = Geist Mono; `serif` = ITC Garamond (unused in landing); Sora declared; Inter + Geist installed but **not imported** | **Pick one sans** (§7, D1). Drop the serif and Sora. |
| **Corner radius** | square | Tailwind radii + nested formula | `--radius 0.75rem`; `rounded-xl` dominant (42 uses) | **Keep Somma's family.** Apply the nested formula inside cards. |
| **Surfaces** | flat, 0 shadows | flat backgrounds | flat, with glow tokens | **Flat cards, 1px full borders.** Glow only on the primary action's focus. |
| **Background gradients / grid** | grid built from gradients | **forbidden** | 0 background gradients ✅ | **Don't add the grid.** |
| **Borders** | 44 one-sided rules | never one side of a *card* | 32 one-sided | Standalone dividers are fine; **cards get a full border or none.** |
| **Motion** | wipes, `.4s`, own curves | `cubic-bezier(0.32,0.72,0,1)`, 700ms, blur fade-up on scroll | 150/200/300 ms tokens; **0 custom curves**; 23 × `transition-all`; GSAP scrub for the tagline | **Landing:** skill's curve, 700 to 800 ms, once per section. **App:** 150 to 300 ms tokens. **Exam:** none. |
| **Layout** | fixed-stage deck | Layout A (classic scroll) | scroll page, 12 sections | **Stay a scroll page.** Deck mechanics hurt mobile, SEO and accessibility. |
| **Icons** | inline SVG | Phosphor / Solar / Iconamoon | Lucide in 12 landing files, **Phosphor in 1** | **Keep Lucide** (your earlier decision, one set app-wide). Remove the stray Phosphor. Conscious deviation from the skill. |
| **Copy** | fragments, concrete | benefit first, **no hyphens**, specific, no clichés | fragments ✅; hyphens present; **unsourced stats** (see §6) | Keep the voice; fix hyphens and stats. |
| **Display type** | giant caps, `.82` line height | snap to Tailwind scale, `text-wrap: balance` | 41 arbitrary `text-[…]` sizes | **Don't borrow kinetic caps.** Uppercase only for small eyebrows. |

---

## 4. The balance

**Borrow (grammar):** numbered sections · eyebrow labels · evidence-first proof · short declarative headlines · one signal accent · hairline discipline · overlays that close with Esc.

**Obey (craft):** type scale snapping · the spacing table · nested radii · hover, active, focus, loading, empty and error states · the motion curve · the mandatory tagline reveal · content realism · ship requirements.

**Keep (identity):** violet on near-black navy · the rounded 0.75rem family · the product as hero (the mock exam card) · Lucide icons · your existing tokens as the only color source.

**Reject (costume):** cream and red-orange palette · serif and italic accents · kinetic uppercase display · square corners · blueprint grid · fixed-stage deck mechanics · three typefaces.

**Suggested dials** (my judgement, tune after seeing it):

| Surface | Mode | Variance | Motion | Density |
|---|---|---|---|---|
| Landing | Persuade | 5 | 5 | 4 |
| App shell | Operate | 3 | 3 | 5 |
| Exam screen | Focus | 2 | 0 to 1 | 6 |

---

## 5. Spec by surface

| | **Landing** | **App** | **Exam** |
|---|---|---|---|
| Color | tokens only; violet accent; hero heading uses the skill's white → `#9B9B9B` **text** gradient; status colors from `success` / `warning` / `destructive` only | tokens only | tokens only; no accent except the selected state |
| Type | one sans; Geist Mono for numerals only (section index, scores, timer); weights up to 700; no italics | same | same; larger body for reading |
| Shape | `rounded-2xl` sections and cards, nested `rounded-lg`; pills for nav and chips | `rounded-xl` | `rounded-xl` |
| Motion | scroll fade-up (`translate-y-16 blur-md opacity-0` → rest), 800 ms, custom curve, IntersectionObserver | 150 / 200 / 300 ms tokens | none beyond focus and selection feedback |
| Navigation | floating pill nav (already built) + section index counter | sidebar or header | exit confirmation only |
| Copy | fragments + specific numbers + benefit first | plain and direct | plain and direct; no exclamation marks |

**Spacing allowed (skill → Tailwind):** 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px → `0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24`. Disallowed steps: `5, 7, 9, 11, 14, 18`.

---

## 6. Gaps in the current landing code (verified counts)

- [ ] **Fonts:** one sans decided; unused `@font-face` (Sora, ITC Garamond ×2 names) and unused fontsource packages removed.
- [ ] **Unsourced numbers.** I found no data source in the repo for: *14,280+ questions generated*, *89.4% avg retention*, *340 courses*, *1,420 key concepts indexed*, *98.6% / 98.8%*, *"94% on midterm"*, *"78% to 91%"*, *+34% vs reread*, *38% faster than class average* (6 files: Hero, SocialProof, Bento, PlatformWorkloads, HowItWorks, LevelUp). If they are placeholders, label them "Sample data" or remove them. If real, point each at its source.
- [ ] **Amber (3 uses)** in `BentoFeatureGrid` and `HowItWorksTimeline`: move to the `warning` token or an indigo/semantic color. Also replace raw `emerald-500` with `success`.
- [ ] **41 arbitrary text sizes** (`text-[…]`) and **47 arbitrary px/rem values** → nearest Tailwind step below. (Data-driven bar widths like `w-[94%]` are legitimate.)
- [ ] **19 off-scale spacing classes** → nearest allowed step.
- [ ] **23 `transition-all`** → targeted properties; landing gets the custom curve.
- [ ] **32 one-sided borders:** keep dividers, fix card borders.
- [ ] **Hyphens in visible copy:** "THREE-STEP PIPELINE" → "Three step pipeline"; "One-click" → "One click"; "Wrong-Answer Explanations" → "Wrong answer explanations"; the `somma-exam-runner // bio301-glycolysis` label. Scientific names (Phosphofructokinase-1) are content, not style.
- [ ] **One icon set:** remove the one Phosphor import.
- [ ] **Tagline reveal:** already compliant (two lines, word by word, reduced motion handled). It uses GSAP ScrollTrigger scrub, which is fine. Note GSAP is now a dependency, which reverses the earlier "no GSAP" default; confirm that's intended.
- [ ] **Ship checklist** (unverified): privacy and terms links, branded 404, `og:image`, favicon, meta description.

## 7. Decisions for you

- [?] **D1: Typeface.** Recommended: **Geist** (variable, in the skill's allowed list, and its mono is the same family for timers and scores). Alternative: **keep Poppins** (allowed, already the Tailwind default, zero migration). Either way: one sans, delete the rest.
- [?] **D2: Stats.** Real, labelled sample data, or removed?
- [?] **D3: Icons.** Confirm Lucide stays despite the skill's Phosphor preference.
- [?] **D4: Peach gradient.** With the hero heading on the skill's white-to-grey text gradient, the peach is no longer needed anywhere. Retire it.
- [?] **D5: Live-site tokens.** Paste its `:root` variables so §1 and §2 can be completed.

---

## 8. Mentor's margin

- *The Elements of Typographic Style* (Bringhurst): one family, used well, beats three used loudly.
- *Refactoring UI* (Wathan and Schoger): hierarchy comes from size, weight and color, not from more fonts.
- Dieter Rams, *Ten Principles of Good Design*: "less, but better," and honest.
- Your SIWES audience (assessors and hiring engineers) will click through to the live product. A real number they can verify is worth more than a large number they can't.
