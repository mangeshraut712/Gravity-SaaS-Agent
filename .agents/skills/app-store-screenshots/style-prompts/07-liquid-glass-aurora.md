---
name: liquid-glass-aurora
description: Soft aurora mesh backgrounds with big blurred light blooms, frosted "liquid glass" cards floating over upright phones, near-black neo-grotesk headlines with one aurora-gradient word. Premium, calm, native-iOS. Inspired by Apple's Liquid Glass marketing.
inspiration: Apple iOS 26 Liquid Glass marketing pages, Things 3, Arc Search, Craft, Apple Weather/Fitness product pages
feel: premium, calm, native-iOS, "this feels like Apple made it"
---

# Liquid Glass Aurora

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Phone size**: phone width **980–1060px** on a 1320×2868 canvas (height 1996–2159px = **70–75%** of canvas height). Upright, **0° tilt, always**. Any rotation is a fail.
- **Phone anchoring**: phone top edge at **760–840px**, bottom edge within 0–60px of the canvas bottom (flush) or bleeding up to 8% off the bottom. Never floating mid-canvas with empty bands above and below.
- **Headline size**: **150–175px** (`font-size`), weight **700**, `letter-spacing: -0.032em`, `line-height: 0.98`. Max 2 lines. Measured headline width must stay ≤ 88% of canvas (≤ 1160px); typical is 58–76%.
- **Exactly ONE aurora-gradient word** per headline (see signature). It uses the deep stops `#1D46B8 → #4A2FC0 → #9A2250`. Pastel gradient text = fail. Every stop must clear **4.5:1 against the darkest background pixel under the headline** (these stops clear ≥ 4.6:1 at bg luminance 0.58; measured glyph interiors on reference renders ≥ 6.1:1).
- **Background = aurora mesh**: a 4-stop base linear gradient with a real hue shift (lavender → ice-blue → blush → apricot) PLUS **3–5 blurred blooms** (`filter: blur(120–160px)`, 800–1100px diameter). A 2-stop gradient or a flat fill = fail. Muddy mid-tones (grey-brown, olive) where blooms overlap = fail — keep every bloom a light pastel (HSL lightness ≥ 80%).
- **Glass must read as glass.** Every glass element has ALL of: (1) translucent white fill 30–62% alpha, (2) `backdrop-filter: blur(30–40px) saturate(180–190%)`, (3) 2px specular rim that is bright at top-left and fades by mid-edge, (4) inset top highlight `inset 0 2px 0 rgba(255,255,255,.95)` + inset bottom shade `inset 0 -2px 0 rgba(70,55,140,.16)`, (5) a violet-tinted outer shadow. A white box with a grey shadow = fail (§10 "glass treatment that reduces to a flat colour shift").
- **Glass must overlap something colourful or detailed** — the phone edge, a bloom, or an orb — so the blur/refraction is visible. A glass card over flat pastel looks like a white rectangle.
- **Decoration density (editorial)**: **2–4 glass elements per slide** (a multi-row glass panel counts as one). No doodles, no stickers, no emoji, no confetti.
- **Grain**: 3–4% film grain over everything (`mix-blend-mode: overlay`) to kill gradient banding. Invisible, never gritty.
- **No vignette.** This style is high-key; darkening corners kills the light.

## Vibe summary

Liquid Glass Aurora looks like the keynote slide right after "and it's all built on a new material". The canvas is lit, not painted: a pale aurora of icy lavender, sky blue, blush and apricot, with soft light blooms drifting behind the device like morning sun through frosted windows. The phone stands perfectly upright and large, the way Apple photographs its hardware. Around and over it float one to three pieces of liquid glass — a Live-Activity-style slab, a pill chip, a round badge — each one bending and blurring whatever sits behind it, with a bright specular rim catching the light. Type is quiet and confident: near-black SF-Pro-like grotesk, two short declaratives, one word lit by an aurora gradient. Nothing shouts. Everything is calm, exact and expensive.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#16131F` | Headline + glass labels (15–17:1 on the aurora) |
| `--ink-2` | `#4A4660` | Subhead, glass meta text (≥ 5.3:1 worst case) |
| `--mist` | `#F4F1FB` | Solid fallback bg / editor theme bg |
| `--base-1` | `#EFE9FD` | Aurora base stop 0% (lavender mist) |
| `--base-2` | `#E6EEFC` | Aurora base stop ~38% (ice blue) |
| `--base-3` | `#F7ECF3` | Aurora base stop ~68% (blush) |
| `--base-4` | `#FDEBDF` | Aurora base stop 100% (apricot cream) |
| `--lav` | `#CDBBFF` | Bloom — lavender |
| `--sky` | `#AFD5FF` | Bloom — sky |
| `--peach` | `#FFCDB2` | Bloom — peach/apricot |
| `--rose` | `#FFC4D6` | Bloom — rose (optional 4th) |
| `--mint` | `#C6F0E4` | Bloom — mint (optional, small, max 1 per slide) |
| `--au-1` | `#1D46B8` | Aurora text stop — deep cobalt |
| `--au-2` | `#4A2FC0` | Aurora text stop — deep violet |
| `--au-3` | `#9A2250` | Aurora text stop — deep raspberry |
| `--glass-hi` | `rgba(255,255,255,.62)` | Glass fill, top |
| `--glass-lo` | `rgba(255,255,255,.30)` | Glass fill, middle |
| `--glass-shade` | `rgba(70,55,140,.16)` | Glass bottom inner edge, track fills |
| `--shadow` | `rgba(86,70,170,.30)` | Violet-tinted soft shadow under glass + phone |

Colour philosophy: the only saturated colour on the slide is the aurora-gradient word and small gradient accents inside glass (a progress fill, a ring, an icon stroke). Blooms are always pastel. No pure `#FFFFFF` backgrounds, no pure `#000` text.

## Typography

**Headline (primary):**
- Google Fonts: **Inter Tight 700** (preferred, closest to SF Pro Display) or **Geist 700**. Load 500/600/700.
- Commercial alternates: SF Pro Display Bold (Apple marketing only), Söhne Halbfett, Neue Haas Grotesk Display 65.
- 150–175px; `letter-spacing: -0.032em`; `line-height: 0.98`. Colour `--ink`.
- Centered on hero and closer; left-aligned at a 104px margin on feature slides for rhythm.

**Subhead:**
- Inter Tight 500, **46–50px**, `letter-spacing: -0.012em`, `line-height: 1.28`, colour `--ink-2`.
- One sentence, hand-broken into two balanced lines. Never a single-word widow.

**Glass labels (inside cards/chips):**
- Title: Inter Tight 600, 40–54px, `--ink`, tracking -0.01em.
- Meta: Inter Tight 500, 28–36px, `--ink-2`.
- Eyebrow (optional): Inter Tight 600, 28px, uppercase, `letter-spacing: .08em`, `--ink-2`.

**Mix rule:** one family, three weights. No serif, no script, no italics, no ALL-CAPS headlines.

## Headline emphasis (signature)

- Exactly one word (occasionally two short ones, e.g. "on cue") is filled with the aurora gradient: `background: linear-gradient(100deg, #1D46B8 0%, #4A2FC0 48%, #9A2250 100%); background-clip: text; color: transparent;` Add `padding-right: .04em` so the last glyph is not clipped by `background-clip`.
- Same weight and size as the rest of the headline — the colour is the only change. No underline, no glow, no italic.
- The gradient word carries the promise: the benefit adjective or the outcome noun ("peak", "guided", "Beautifully", "rested").
- If the headline sits over an unusually saturated bloom, lighten the bloom (or add a white bloom behind the headline at 55% opacity, blur 120px) — never lighten the gradient stops.

## Phone / device frame treatment

- Always the template's default iPhone bezel (`public/mockup.png` via the `Phone` component in `src/components/editor/device-frames.tsx`). Never replace it with a bezelless rectangle or a glass frame.
- Upright 0°. Width 980–1060px, horizontally centered (hero/closer) or offset right by up to 110px (feature slides, so glass can overlap the left edge).
- Shadow stack on the phone container (violet-tinted, never black): `filter: drop-shadow(0 70px 90px rgba(84,66,170,.26)) drop-shadow(0 10px 20px rgba(40,30,90,.16))`.
- Light-mode screenshots are preferred — they sit naturally in the high-key aurora. Dark-mode screenshots are allowed; add an extra sky bloom behind the phone so it doesn't read as a black hole.
- Glass elements may overlap the phone by 15–45% of their own width; they must never cover the screen's primary UI (the thing the headline talks about). Prefer covering secondary UI (a stats card, a list tail) so the glass reads as "lifted off the screen".

## Background treatment

Build in this order (all `position:absolute`, inside the slide):
1. **Base**: `linear-gradient(172deg, #EFE9FD 0%, #E6EEFC 38%, #F7ECF3 68%, #FDEBDF 100%)`. Rotate 170–185° per slide for variety; keep stop colours.
2. **Blooms**: 3–5 ellipses, 800–1100px, `border-radius: 50%`, `filter: blur(140px)`, opacity .8–.95. Place one lavender top-left, one sky mid-right (behind the phone's upper half), one peach lower-left, optional rose lower-right. Blooms may bleed off-canvas by up to 40%.
3. **Headline halo**: one white ellipse (~800×560px, opacity .55, blur 120px) behind the headline to guarantee contrast.
4. **Refraction orbs (optional, closer/no-phone slides)**: 1–2 tighter orbs (500px, blur 40px, `radial-gradient` lavender→sky or peach→rose) placed so a glass panel's edge crosses them — this is what makes the glass visibly bend colour.
5. **Grain**: SVG `feTurbulence` noise at 3–4% opacity, `mix-blend-mode: overlay`.

## Decorative accents

The ONLY decorations are liquid-glass objects. **2–4 per slide.** Types:
- **Glass slab** (Live Activity / notification): 900–1150px wide, 300–400px tall, radius 80–88px. App icon (128px, radius 30px) + title + meta + a gradient progress bar with a white knob.
- **Glass pill chip**: 400–480px × 150px, radius 75px. 76–82px icon or gradient ring + two-line label.
- **Glass panel / list**: 560–1100px wide, radius 72–88px, 3–5 rows with 2px `rgba(70,55,140,.10)` dividers.
- **Glass icon tile**: 260–300px square, radius 78px, app icon inset at 72%.

Glass recipe (copy exactly):

```css
.glass{position:absolute;isolation:isolate;
  background:linear-gradient(165deg,rgba(255,255,255,.62),rgba(255,255,255,.30) 55%,rgba(255,255,255,.40));
  backdrop-filter:blur(34px) saturate(185%);-webkit-backdrop-filter:blur(34px) saturate(185%);
  box-shadow:inset 0 2px 0 rgba(255,255,255,.95), inset 0 -2px 0 rgba(70,55,140,.16),
    inset 0 0 28px rgba(255,255,255,.45), 0 40px 80px -18px rgba(86,70,170,.30), 0 10px 24px rgba(60,48,120,.12)}
.glass::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:2px;pointer-events:none;
  background:linear-gradient(155deg,#fff 0%,rgba(255,255,255,.25) 32%,transparent 55%,rgba(170,150,255,.35) 85%,rgba(255,255,255,.7));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.glass::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:radial-gradient(120% 70% at 30% 0%,rgba(255,255,255,.38),transparent 60%)}
```

Icons inside glass: SF-Symbols-like line icons, 4.5–5.5px stroke, round caps/joins, stroked in `--ink` or with the aurora gradient (`stroke="url(#au)"`). Never filled clip-art, never emoji.

### Glass content & legibility

- Glass text is always `--ink` / `--ink-2` — never white. The frosted fill guarantees ≥ 7:1 even over a busy screenshot; verify anyway when a slab covers dark UI (dark photos, dark-mode cards).
- Padding: 44–64px inside slabs/panels, 34–36px horizontal inside pills. Corner radius ≥ 36% of the element height for pills, 64–88px for slabs.
- Gradient accents inside glass (progress fill, ring, active dot, icon stroke) use the same `#1D46B8 → #4A2FC0 → #9A2250` stops. One gradient accent per glass element.
- Progress knobs: 34–38px white circle, `box-shadow: 0 4px 10px rgba(60,40,120,.3), inset 0 -2px 0 rgba(70,55,140,.15)`.
- Mini glass tiles inside panels (icon wells): 132px, radius 40px, `linear-gradient(160deg, rgba(255,255,255,.9), rgba(255,255,255,.45))` + inset top highlight — a glass-within-glass cue.
- The copy on glass must restate or extend the headline (a status, a stat, the next step). Never lorem, never a duplicate of a label that is fully visible on the screen right behind it.
- Polish gates (§3): the recipe above delivers two fill tones, a cast shadow, a specular streak and a volume cue — skip any layer and the element drops below the gate.

### Contrast verification (do this, don't eyeball)

Render the slide once with the caption hidden, sample the darkest background pixel inside the caption's bounding box, and compute each gradient stop's ratio against it. On the reference renders the darkest bg pixel had luminance ≈ 0.58, and all three stops passed (4.6–5.1:1); glyph interiors measured ≥ 6.1:1. If a bloom pushes the bg darker, move or lighten the bloom.

## Cross-screen moment

- **May cross the seam**: an aurora bloom (the easiest, 30–50% across), or ONE glass chip/slab straddling the boundary with 10–30% of its width on the neighbour. Place the seam through the chip's empty right third — never through its label.
- **May not cross**: headlines, the aurora word, the phone, app icons, any glass text, progress bars the copy refers to.
- Frequency: one bridge per 5+ slide deck (per `_QUALITY_BAR.md` §2). Usually hero → slide 2 via a shared sky bloom.

## Copy tone

- **Voice**: calm, confident, Apple-like. Two short declaratives, or a noun phrase + a verdict. Present tense. Periods, not exclamation marks.
- **Vocabulary**: every, perfectly, beautifully, effortless, at a glance, on cue, just right, all in one place, quietly, made for.
- **Avoid**: "revolutionary", "ultimate", "best-in-class", "supercharge", "unlock", "AI-powered" as a headline, exclamation marks, question marks, emoji, ALL CAPS, hashtags, more than 8 words per headline.
- **Punctuation**: sentence case; each sentence ends with a period; a comma may join a parallel pair ("Every pour, guided.").
- **Example headlines**:
  - Coffee: "Every bag. At its **peak**." / "Every pour, **guided**."
  - Sleep: "Wind down. Wake **rested**."
  - Finance: "Your money. **Clearly** sorted."
  - AI assistant: "Ask anything. Get **answers**."
  - Tasks: "Your day, **quietly** planned."
  - Fitness: "Every rep. **Counted**."
  - Weather: "Tomorrow, **at a glance**."
  - Notes: "Think it. **Keep** it."
  - Health: "Your heart, **beautifully** tracked."

## Per-slide breakdown (mandatory)

### Slide 1 — Hero (main benefit)
- **Background**: base 172°; blooms lavender TL, sky mid-right, peach lower-left, rose lower-right; white halo behind headline.
- **Headline**: centered, top 190px, 160–165px, two lines ("Every bag. / At its **peak**.").
- **Subhead**: centered, top ~560px, 48px, two balanced lines.
- **Phone**: centered, width 1000px, top 800px (≈71% of H), flush bottom.
- **Glass (2)**: a slab lifted off the screen (left 44px, ~57% down, 1150px wide) with app icon + status + gradient progress bar; a pill chip on the right edge of the phone (~40% down) with a gradient ring + short stat.
- **Effect**: slab overlaps both bezel edges so the bezel shows through blurred. Place it over secondary UI (a stats card) so it reads as a Live Activity lifted off the screen.
- **Avoid**: covering the screen's headline card or tab bar; a third glass element on the hero.

### Slide 2 — Differentiator
- **Background**: base rotated 180°, sky bloom top-right, lavender left.
- **Headline**: left-aligned at 104px, one line + aurora line ("Knows your **beans**.").
- **Phone**: offset right (left 268px), width 1000px, flush bottom, showing the differentiating screen.
- **Glass (2–3)**: a pill chip on the left edge + a round badge; optional cross-screen bloom continuing from slide 1.

### Slide 3 — Feature
- **Background**: base 185°, sky TR, lavender left, peach lower-right, mint lower-left.
- **Headline**: left-aligned, 170px ("Every pour, / **guided**."), subhead 48px two lines.
- **Phone**: offset right, width 1000px, top 800px.
- **Glass (2)**: pill chip overlapping the phone's left edge at ~62% height (context: recipe/ratio); a panel bottom-left (720px wide) listing the feature's steps with the current step in ink 600 + gradient dot.
- **Effect**: the panel should straddle the phone bezel and/or a bloom so its blur picks up a dark or coloured smear — that smear is the proof it's glass.
- **Avoid**: letting the panel's edge cut through a UI label or button; resize or move the panel until labels are either fully covered or fully clear.

### Slide 4 — Feature / proof
- **Background**: base 175°, peach TR, lavender lower-left.
- **Headline**: centered ("Sleep, **on schedule**.").
- **Phone**: centered, width 1000px.
- **Glass (2–3)**: stat slab with one big number (Inter Tight 700, 96px) + meta; optional widget PNG set inside a glass tile.

### Slide 5 — Closer (no phone allowed)
- **Background**: base 175°, blooms in all four quadrants + 2 refraction orbs crossing the panel edges.
- **Glass icon tile**: 292px, centered, top 190px.
- **Headline**: centered, top ~590px, 140–150px ("All your coffee. / **Beautifully** kept.").
- **Glass list panel**: 1100px wide, top ~1060px, 5 rows × 288px: gradient-stroked icon in a mini glass tile (132px) + title 54px + meta 36px.
- **Effect**: the refraction orbs must visibly tint the panel's corner (violet top-right, apricot bottom-left); without them the panel reads as a white card.
- **Bottom margin**: panel ends 260–320px above the canvas bottom; no empty band > 22%.
- Alternative closer: two phones side by side (each ≥ 900px wide, bleeding off opposite edges) with one glass chip bridging them.

## How to apply this style

1. **Fonts** — in `src/app/layout.tsx`, import `Inter_Tight` from `next/font/google` with `weight: ["500","600","700"]`, expose it as a CSS variable (`--font-display`) and use it for captions and glass labels.
2. **Theme** — add a `liquid-glass-aurora` entry to `THEMES` in `src/lib/constants.ts` (`bg #F4F1FB`, `fg #16131F`, `accent #4A2FC0`, `muted #4A4660`, `bgAlt #16131F`, `fgAlt #F4F1FB`).
3. **Background** — in `src/components/editor/slide-canvas.tsx`, give `SlideBackground` an aurora branch for this theme: base 4-stop gradient + 3–5 absolutely positioned blurred bloom divs (positions in % of canvas so they scale) + a white halo behind the caption + a 3.5% grain overlay. Replace the default `Blob` accents for this theme.
4. **Caption** — render the headline at `cW × 0.12–0.13` px, weight 700, tracking -0.032em, leading 0.98. Wrap the emphasis word in a span with the aurora `background-clip: text` gradient.
5. **Phone** — keep the `Phone` component; set its width to `cW × 0.76` (≈1000px on 1320), top at 28% of canvas height, and apply the violet `drop-shadow` stack via a wrapper filter. Rotation 0.
6. **Glass** — add a `GlassCard` element type (or text element with a `glass` style flag) using the recipe above. Position with the existing `Movable` rects; allow it to overlap the device rect and sit above it in z-order.
7. **Measure** — verify headline width ≤ 88% of canvas and sample worst-case contrast of each gradient stop against the background behind the caption (≥ 4.5:1).
8. **Cross-screen** — in `DeckCanvas`, let one bloom or glass chip straddle a seam; keep all text inside its own slide.
9. **Audit** — every slide: aurora bg with ≥ 3 blooms, one gradient word, upright large phone (or closer tile + panel), 2–4 glass elements that visibly blur something, 3–4% grain, no doodles.

## What this style is NOT

- Not flat pastel. A single-colour or 2-stop background is a different (weaker) style.
- Not glassmorphism-2021: no heavy 1px white borders on every card, no rainbow blobs, no neon.
- Not dark mode. No black or navy backgrounds; no vignette.
- Not tilted. Phones are upright 0°, always.
- Not playful: no doodles, stickers, mascots, emoji, confetti, hand-lettering or scripts.
- Not a serif or italic style. One grotesk family, three weights.
- Not pastel gradient text — the gradient word uses deep stops that pass 4.5:1.
- Not "white boxes": glass without backdrop blur, specular rim and tinted shadow is a fail.
- Not crowded: more than 4 glass elements per slide breaks the calm.
- Not Apple-branded: never reproduce Apple logos, SF Symbols verbatim, or "Designed by Apple" lockups — evoke the material, don't borrow the brand.
- Not loud copy: no exclamation marks, no superlatives, no questions.
