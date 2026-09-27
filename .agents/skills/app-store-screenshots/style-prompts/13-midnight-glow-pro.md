---
name: midnight-glow-pro
description: Premium dark "pro tool" launch-page look. Near-black canvas with a faint dot grid, one indigo-violet light beam from above spilling onto a large upright rim-lit phone standing on a floor glow, dark-glass cards with lit gradient borders, keycap shortcut chips, and a white-to-grey gradient headline with one beam-lit word. Inspired by Linear, Raycast and Vercel.
inspiration: Linear, Raycast, Vercel, Arc, Superhuman launch pages
feel: precise, fast, expensive, "built by people who care about milliseconds"
---

# Midnight Glow Pro

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Background is near-black `#07080B`, never pure `#000`, never navy.** Build it as a 4-stop vertical `#0B0D13 → #08090D (38%) → #07080B (70%) → #050608`. Any pixel outside the beam lighter than lum 0.02 (≈ `#1A1C24`) is a fail; a flat `#000` slide is a fail.
- **Exactly ONE light source per slide:** a conic beam from above the top edge (origin 100–240 px above the canvas), indigo `#8F8CFF` → violet `#A77BFF`. Two beams, side lights, or colored blobs = fail. The beam must visibly land on the phone (hero/feature) or the command palette (closer).
- **The beam is dim where the type is.** Beam alpha at the headline band ≤ 30% of its peak; it reaches full strength only below the headline (≥ 60 px under the last text line). Worst measured background under the headline must stay ≤ lum 0.055.
- **Headline:** Inter Tight 600, **140–160 px**, `letter-spacing: -0.035em`, `line-height: 1.02`, max 2 lines, sentence case, ends with a period. Fill is a vertical text gradient `#FFFFFF 0% → #FFFFFF 38% → #B9BDC9 100%` (never below `#B9BDC9` at the bottom — that is the 4.5:1 floor, measured 5.4:1 worst case).
- **Exactly one beam-lit word/phrase** per headline: gradient `#E2E0FF → #C2BFFF → #B3AFFF`. Its darkest stop `#B3AFFF` is 10.0:1 on void and ≥ 5.0:1 against the brightest beam pixel measured under a headline. Never use `#8F8CFF` (beam core) as text on the beam — it drops to 3.6:1.
- **Phone upright, 0° tilt, always.** Width **980–1080 px**; visible height **69–75%** of canvas (1996–2159 px bezel height). Either stands on the floor line (bottom edge at y 2760–2790, hero/closer-style) or bleeds off the bottom 4–8% (feature-style). Never floats with space above and below.
- **Rim light on the lit side only.** The bezel edge facing the beam gets a 5 px blurred lavender halo + a masked screen-blend tint over the frame fading out within 14% of the phone height. The shadow side gets nothing. Glow on all four sides = fail (it reads as "neon", which is style 09).
- **Dark glass only:** every card/chip is `#11131A`-family at 80–86% alpha, `backdrop-filter: blur(26px) saturate(140%)`, a **2 px gradient border that is brightest (≥ 90% lavender) on the edge facing the beam** and fades to 5% white, an inset 1 px top highlight, and a black contact shadow. Light/white glass = fail (that is style 07).
- **Mono eyebrow on every slide:** Geist Mono 500, 26–30 px, UPPERCASE, `letter-spacing: .14–.16em`, `#A7ACBA` (8.8:1) with one lavender token.
- **Decoration density: editorial, 2–4 per slide** (grid, beam, horizon and floor are background, not decorations). Allowed: glow chip, keycap chip, command-palette card, comet beam line.
- **Grid never runs under text.** The dot grid is masked out of the headline + subline band (feathered 30–40 px). Grid dots under glyph edges were the measured worst-case contrast pixel.
- **Grain 4–6%** (`mix-blend-mode: overlay`) on every slide — kills 8-bit banding in the beam. Zero grain = visible banding = fail.

## Vibe summary

Midnight Glow Pro is the launch page of a tool made by people who care about milliseconds. The room is dark — not moody-dark, *studio*-dark — with a faint engineering dot grid that fades out into nothing. A single cool beam of indigo light falls from above the frame, passes behind a crisp, white, tightly-tracked headline, and lands on the phone, catching the top of the bezel like a stage light on hardware. Around it float a few pieces of dark glass: a status chip, a keycap shortcut, a ⌘K command palette. Everything is aligned, quiet and exact. The copy is short and confident — a statement, then a precise fact. It should feel fast without moving, premium without gold, and technical without code.

## Global palette

| Token | Hex / value | Use |
|---|---|---|
| `--void` | `#07080B` | Base background, editor `bg` |
| `--void-top` | `#0B0D13` | Top gradient stop (a hair cooler) |
| `--void-deep` | `#050608` | Bottom gradient stop, keycap drop edge |
| `--panel` | `#11131A` | Glass card base (use at 80–86% alpha) |
| `--panel-hi` | `#181A24` | Glass card top stop, keycap top |
| `--hairline` | `rgba(255,255,255,.08)` | Dividers inside cards |
| `--text` | `#F4F5F8` | Card titles, keycap labels on dark (18.4:1) |
| `--text-2` | `#B4B9C6` | Sublines, descriptions (10.2:1 on void, 9.5:1 on panel) |
| `--text-3` | `#8B91A0` | Meta, mono timestamps (6.4:1 void / 5.9:1 panel) |
| `--eyebrow` | `#A7ACBA` | Mono eyebrow (8.8:1) |
| `--head-end` | `#B9BDC9` | Bottom stop of headline gradient (10.7:1 on void) |
| `--beam` | `#8F8CFF` | Beam core, glows, progress fills — **not for text on the beam** |
| `--beam-2` | `#A77BFF` | Violet shoulder of the beam cone |
| `--beam-lit` | `#B3AFFF` | Lit-word darkest stop, lavender tokens (10.0:1) |
| `--beam-hi` | `#E2E0FF` | Lit-word top stop, horizon core, comet head |
| `--beam-deep` | `#5B57E8` | Progress-bar start, selected icon tile |
| `--rim` | `rgba(200,196,255,.95)` | Phone halo, lit border edge |

Color philosophy: black, three greys, one hue. The beam hue may change per brand (see Adapting), but there is never a second hue in the chrome. The screenshot is the only place warm or brand color appears.

## Typography

- **Headline:** Google Fonts **Inter Tight 600** (primary) or **Geist 600**. Commercial alternates: Inter Display SemiBold, Söhne Halbfett, SF Pro Display Semibold, Neue Montreal Medium.
- **Body/subline/card text:** **Inter 400/500** (Google). Alternates: Söhne Buch, SF Pro Text.
- **Mono (eyebrows, keycaps, timestamps, footers):** **Geist Mono 500** (Google), fallback **JetBrains Mono 500**. Alternates: Berkeley Mono, Söhne Mono, SF Mono.
- Load with `display=block` so exports never capture fallback faces.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=Geist+Mono:wght@400;500&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
```

```ts
// template/src/app/layout.tsx
import { Inter, Inter_Tight, Geist_Mono } from "next/font/google";
const display = Inter_Tight({ subsets: ["latin"], weight: ["500", "600", "700"], display: "block", variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "block", variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "block", variable: "--font-mono" });
// <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
```

| Role | Face | Size @1320 | Leading | Tracking | Color |
|---|---|---|---|---|---|
| Hero headline (2 lines) | Inter Tight 600 | 150–160 px | 1.02 | −0.035em | gradient white → `#B9BDC9` |
| Slide headline | Inter Tight 600 | 140–150 px | 1.02 | −0.035em | same |
| Subline (1 line) | Inter 400 | 40–44 px | 1.32 | −0.01em | `#B4B9C6` |
| Eyebrow | Geist Mono 500 | 26–30 px | 1 | 0.14–0.16em | `#A7ACBA` + 1 lavender token |
| Card title | Inter Tight 600 | 44–48 px | 1.1 | −0.02em | `#F4F5F8` |
| Card row / description | Inter 400–500 | 32–36 px | 1.25 | −0.005em | `#B4B9C6` / `#D9DCE4` |
| Keycap label | Geist Mono 500 | 22–28 px | 1 | 0 | `#D5D8E2` |
| Card meta / footer | Geist Mono 500 | 22–26 px | 1 | 0.08–0.1em | `#8B91A0` |

Nothing under 22 px anywhere. The headline never goes bold 700+ — 600 with tight tracking is the look.

## Headline emphasis (signature)

The whole headline is lit from above (white top → cool grey bottom); one word is lit **by the beam** (lavender). Same face, same weight, same size — only the fill changes.

```css
.h1{font:600 150px/1.02 'Inter Tight',sans-serif;letter-spacing:-.035em;padding-bottom:.08em;
  background:linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 38%,#B9BDC9 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.h1 .lit{background:linear-gradient(180deg,#E2E0FF 0%,#C2BFFF 55%,#B3AFFF 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
```

- The gradient spans the **whole block**, so line 2 is visibly greyer than line 1 — that falloff is the point.
- The lit word is the product noun or the payoff: "Brew at **peak.** / Every bag.", "Every pour, / **called on time.**", "you brew. **Fast.**". A full lit second line is allowed once per deck (feature slide).
- The period after the lit word is lit too.
- `padding-bottom:.08em` is mandatory — without it descenders (p, y, g) are clipped by `background-clip:text`.
- No text-shadow, no glow on letters, no italics, no underline, no outline.

## Phone / device frame treatment

- **Always the template's default iPhone bezel** (`public/mockup.png` via the `Phone` component in `device-frames.tsx`). The bezel's titanium frame stays; you only add light around it.
- **Upright 0°.** Width 980–1080 px. Hero: 980 px, left 170, top 784, bottom 2780 on the floor line. Feature: 1060 px, left 360, top 812, bleeding 103 px off the bottom and 100 px off the right.
- **Rim-light stack** (all inside a wrapper with `aspect-ratio:1022/2082`):

```css
.halo{position:absolute;inset:-5px;border-radius:13.4%/6.6%;filter:blur(9px);
  background:linear-gradient(180deg,rgba(200,196,255,.95) 0%,rgba(160,156,255,.55) 6%,rgba(143,140,255,0) 26%)} /* behind phone; 200deg when the beam comes from top-right */
.rimtint{position:absolute;inset:0;z-index:1;mix-blend-mode:screen;   /* between bezel (z1) and screen (z2) */
  -webkit-mask:url(/mockup.png) center/100% 100% no-repeat;mask:url(/mockup.png) center/100% 100% no-repeat;
  background:linear-gradient(180deg,rgba(200,196,255,.75) 0%,rgba(150,146,255,.22) 5%,transparent 14%)}
.phone-bloom{position:absolute;left:10%;right:10%;top:-120px;height:420px;filter:blur(70px);
  background:radial-gradient(ellipse at 50% 60%,rgba(143,140,255,.55),transparent 70%)}
.phone{filter:drop-shadow(0 60px 70px rgba(0,0,0,.8)) drop-shadow(0 8px 16px rgba(0,0,0,.6))}
```

- **Floor + reflection (floor-standing phones):** a 2 px floor line across the canvas at the phone's bottom y (`linear-gradient(90deg,transparent 4%,rgba(185,182,255,.45) 30%,rgba(210,208,255,.7) 50%,…,transparent 96%)`), an ellipse glow 1200×200 px centered under the phone (`rgba(124,120,255,.30)`, blur 20 px), and a vertically flipped copy of the phone at 16% opacity masked to its first 6% (`mask: linear-gradient(0deg,#000 0%,transparent 6%)`).
- **Screenshots:** light or dark UI both work; light UI becomes the brightest object on the slide, which is correct. Never tint, dim or recolor the screenshot.
- **Two-phone slides:** back phone 88% scale, 200–260 px offset, rim light at 50%, both upright, both on the same floor line.

## Background treatment

Layer order (bottom → top), all `position:absolute; inset:0; pointer-events:none`:

```css
.base{background:linear-gradient(180deg,#0B0D13 0%,#08090D 38%,#07080B 70%,#050608 100%)}
.grid{background-image:radial-gradient(circle at 1.5px 1.5px,rgba(255,255,255,.13) 1.3px,transparent 1.9px);
  background-size:44px 44px;background-position:22px 10px;
  /* fade radially from the light, AND cut a hole under the text band (y 250–700 on the hero) */
  -webkit-mask:radial-gradient(ellipse 62% 42% at 50% 30%,#000 10%,rgba(0,0,0,.35) 55%,transparent 80%),
               linear-gradient(180deg,#000 0,#000 220px,transparent 250px,transparent 700px,#000 740px);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.horizon{top:0;height:2px;background:linear-gradient(90deg,transparent 8%,rgba(185,182,255,.35) 30%,rgba(230,228,255,.95) 50%,rgba(185,182,255,.35) 70%,transparent 92%)}
.horizon-bloom{left:-200px;right:-200px;top:-260px;height:520px;filter:blur(30px);
  background:radial-gradient(ellipse 34% 50% at 50% 50%,rgba(130,124,255,.55),rgba(130,124,255,.12) 55%,transparent 75%)}
/* beam: element is inset:-240px so the blur never shows an edge; origin = slide (660,-180) => (900px,60px) */
.beam{position:absolute;inset:-240px;mix-blend-mode:screen}
.beam.wide{filter:blur(46px);background:conic-gradient(from 160deg at 900px 60px,transparent 0deg,
  rgba(110,106,255,.10) 9deg,rgba(150,120,255,.22) 20deg,rgba(110,106,255,.10) 31deg,transparent 40deg);
  -webkit-mask:linear-gradient(180deg,rgba(0,0,0,.55) 0%,#000 30%,#000 55%,transparent 88%)}
.beam.core{filter:blur(16px);background:conic-gradient(from 173.5deg at 900px 60px,transparent 0deg,
  rgba(150,146,255,.20) 4deg,rgba(196,188,255,.30) 6.5deg,rgba(150,146,255,.20) 9deg,transparent 13deg);
  -webkit-mask:linear-gradient(180deg,rgba(0,0,0,.28) 0px,rgba(0,0,0,.34) 860px,#000 1010px,#000 1500px,transparent 2300px)}
.vig{background:radial-gradient(ellipse 120% 80% at 50% 38%,transparent 55%,rgba(0,0,0,.55) 100%)}
/* + .grain at opacity .05, mix-blend-mode:overlay (fractal noise SVG) */
```

- **Aiming the beam:** `from` angle = (direction to target, clockwise from north) − half the spread. Hero (straight down): wide `from 160deg` (40° spread), core `from 173.5deg` (13°). Top-right origin (slide 1150,−160) aimed at the phone: wide `from 173deg`, core `from 187deg`; move the horizon peak and the grid's radial center to the same x.
- The core mask values in px are element coordinates (slide y + 240). Keep the 0.28–0.34 "dim" zone ending 60+ px below the last text line.
- Vignette yes (subtle), no bokeh, no stars, no mesh blobs, no second color.

## Decorative accents

Density: **2–4 per slide**, each doing a job. Recipes:

```css
.glass{position:absolute;border-radius:28px;
  background:linear-gradient(180deg,rgba(24,26,36,.86),rgba(15,17,24,.80));
  backdrop-filter:blur(26px) saturate(140%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 0 0 1px rgba(0,0,0,.55),
             0 40px 80px -20px rgba(0,0,0,.85),0 0 60px -10px rgba(124,120,255,.22)}
.glass::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:2px;pointer-events:none;
  background:var(--edge,linear-gradient(180deg,rgba(206,202,255,.95) 0%,rgba(255,255,255,.14) 38%,rgba(255,255,255,.05) 100%));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude}   /* rotate --edge toward the beam */
.kbd{display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:58px;padding:0 16px;
  border-radius:13px;font:500 28px/1 'Geist Mono',monospace;color:#D5D8E2;
  background:linear-gradient(180deg,#262A35,#171A22);border:1px solid rgba(255,255,255,.10);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -4px 0 rgba(0,0,0,.45),0 2px 0 #040507,0 8px 18px rgba(0,0,0,.55)}
.kbd.lit{color:#0B0C12;background:linear-gradient(180deg,#D3D1FF,#9F9BFF);border-color:rgba(255,255,255,.5);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -4px 0 rgba(60,50,180,.45),0 2px 0 #2B2780,0 0 28px rgba(143,140,255,.55)}
.comet{position:absolute;height:2px;background:linear-gradient(90deg,transparent,rgba(185,182,255,.15) 35%,rgba(210,208,255,.75) 88%,#F2F1FF)}
.comet::after{content:"";position:absolute;right:-8px;top:-7px;width:16px;height:16px;border-radius:50%;background:#F2F1FF;
  box-shadow:0 0 10px 3px rgba(200,196,255,.95),0 0 44px 12px rgba(143,140,255,.55)}
```

1. **Glow chip** (status card) — 520–600 px wide, 28 px radius, padding 34/36 px: mono status line (`● AT PEAK` lavender + `DAY 16` grey, 24 px), a 44 px Inter Tight title, a 10 px progress track with a `#5B57E8 → #B9B6FF` fill + `0 0 18px` beam glow, mono labels under it. Overlaps a phone bezel edge by 300–400 px, never the screenshot's focal row.
2. **Keycap chip** — a glass pill (24 px radius, 18/22 px padding) holding 1–2 `.kbd` (one may be `.lit`) + a 32 px Inter 500 label ("Quick brew"). Best parked over the screenshot's empty status-bar strip at a phone corner.
3. **Command-palette card** — header row (lavender `›`, 34–40 px query text, `⌘` `K` keycaps), 1 px hairline, 4–6 rows (icon or state glyph, text, mono meta or keycap), one row selected (`linear-gradient(90deg,rgba(143,140,255,.20),rgba(143,140,255,.06))` + `inset 0 0 0 1px rgba(185,182,255,.28)`, 16–22 px radius), mono footer (`↑ ↓ NAVIGATE  ⏎ OPEN`). Rows repeat real app data only.
4. **Comet beam line** — 2 px line with a 16 px glowing head, 360–900 px long, running on a grid row/column or along the floor line; head points at the thing it introduces.
5. **Icon tiles** (inside palettes only) — 84 px, 20 px radius, `#232633 → #161820`, 1.9 px stroke line icons in `#C9CCD8`; the selected tile becomes `#3B3888 → #24225A` with a 24 px beam glow.

Polish gates for every accent: two tones (gradient fill + lit edge), volume (inset top highlight + inset bottom shade on keycaps), contact shadow, grain over all. A flat grey rectangle with a 1 px border is not this style.

## Layout grid & safe zones

All values at 1320 × 2868.

| Zone | Rectangle (x, y, w, h) | Rule |
|---|---|---|
| Outer margin | 84–96 px left/right, 150 px top | Text never inside the margin |
| Eyebrow / announcement pill | (0–1320, 150–230) | Centered (hero/closer) or left at x 96 (feature) |
| Headline block | (88, 240, 1144, ≤ 340) | 2 lines, ends ≤ y 610 |
| Subline | (88, 590–700, 1144, 60) | One line, ≥ 16 px below headline |
| Dim-beam text band | y 240–700 | Beam ≤ 30% peak, no grid, no decorations |
| Phone box (floor) | (170, 760–800, 980, to y 2780) | Floor line at phone bottom ± 2 px |
| Phone box (bleed) | (300–360, 800–880, 1060–1080, to canvas bottom) | Bleed 4–8% bottom, ≤ 10% one side |
| Decoration lanes | (40–640, 1400–2800) left, (840–1300, 780–1000 and 2100–2700) right | Chips overlap bezel 300–400 px max |
| No-go | Screenshot focal row (hero metric, timer ring, primary CTA) | Nothing overlaps it |
| Palette (closer) | (84, 640, 1152, ≈1490) | Ends ≤ y 2160 |
| Lockup (closer) | (0, 2300–2520, 1320) | Icon 168 px + wordmark 78 px tall |

No empty band > 400 px (14%) on any slide; measured worst on the sample deck is ~370 px below the closer lockup.

## Cross-screen moment

- **May cross the seam:** the floor line and its comet (it continues at the same y into the neighbor — the strongest and cheapest move), the horizon line, the wide beam cone's soft edge, a phone corner of a bleed-layout phone (≤ 15% of its width), the dot grid.
- **May not cross:** headlines, the lit word, keycaps, glass chips, the command palette, the app icon/wordmark, or any screen content the headline depends on.
- Use once in a 5–6 slide deck (usually hero → differentiator: the floor line runs through both and the comet head sits just past the seam). Put the seam through an empty part of the floor line, never through the comet head. Each crop must still read alone.

## Copy tone

- **Voice:** a senior engineer writing the changelog headline. Declarative, exact, a little dry. Short statement + precise fact. Confident enough to use one-word sentences ("Fast.").
- **Vocabulary:** fast, instant, exact, precise, built for, zero, every, down to, on time, in one keystroke, live, synced, tracked, measured, called, shipped, craft.
- **Banned words:** effortless, seamless, magical, revolutionary, game-changer, unleash, supercharge, empower, journey, vibes, ultimate, best-in-class, AI-powered (unless the product literally is), "we", "our".
- **Punctuation:** sentence case; every headline line ends with a period or comma; no exclamation marks, no question marks, no emoji, no ellipses in headlines. Mono eyebrows are UPPERCASE; keycap glyphs (⌘ ⏎ ↑ ↓ ␣) are allowed in chips only.
- **Length:** 3–6 words per headline, 2 lines; subline ≤ 8 words stating a fact ("Roast date in. Freshness window out.").
- **Formula:** `[Outcome]. [Scope].` or `[Thing], [precise verb].` — the lit word is the outcome or the precision.
- **Example headlines:**
  - Coffee: "Brew at **peak.** / Every bag."
  - Coffee (timer): "Every pour, / **called on time.**"
  - Closer (any): "Built for the way / you brew. **Fast.**"
  - Dev tool: "Ship on **Friday.** / Sleep anyway."
  - AI assistant: "Ask once. / **Done in seconds.**"
  - Productivity: "Your week, / in **one keystroke.**"
  - Finance: "Every dollar, / **accounted for.**"
  - Crypto: "Markets move. / **You're faster.**"
  - Email: "Inbox zero. / **By 9 AM.**"
  - Notes: "Think it. / **Find it instantly.**"
  - Calendar: "Meetings, **handled.** / Focus, kept."
  - Fitness data: "Every rep, / **measured.**"
  - Password manager: "Signed in. / **Zero friction.**"

## Per-slide breakdown (mandatory)

### Slide 1 — Hero ("the launch page")
- **Background:** full stack, beam straight down from (660, −180), horizon peak centered, grid centered at 50% 30% with the text-band hole y 250–700.
- **Eyebrow:** glass announcement pill centered at top 150, height 76 px: glowing 14 px dot, `NEW` (27 px mono, `#D2D5DF`), 1 px divider, `Peak windows, per bag →` (`#A7ACBA`).
- **Headline:** centered, top 268, 150–160 px, e.g. "Brew at **peak.** / Every bag." Subline centered at top 618, 42 px: "Roast date in. Freshness window out."
- **Phone:** 980 px, left 170, top 784, standing on the floor line at y 2780 (69.6% of canvas), top rim-lit, bloom behind its top edge, reflection below.
- **Decorations (3):** glow chip at (56, 1452, 560 w) overlapping the left bezel; keycap chip at (884, 840) over the empty status strip; comet on the floor line (0 → 470).
- **Must be true:** at 220 px wide you read the headline, see the lavender word and a big lit phone.

### Slide 2 — Differentiator ("the number")
- **Background:** beam from top-left (x 20%), horizon peak at 20%, grid center 25% 25%.
- **Eyebrow:** `01 / FRESHNESS` left at (96, 176), 30 px mono, `01` lavender.
- **Headline:** left at (88, 246), 150 px: "Know the day / it **peaks.**" Subline (96, 596): the one proof fact.
- **Phone:** 1000 px, left 60, top 820, bleed bottom 6%; lit on its left edge (`halo` gradient 160deg).
- **Decorations (3):** a tall glow chip at right (840, 1300, 440 w) with one oversized 120 px Inter Tight numeral + mono unit (`16 DAYS`) repeating a number visible in the screenshot; comet on grid column x 1232 pointing down into the chip; floor line crossing into slide 3 (cross-screen moment).
- **Must be true:** the numeral in the chip is identical to one in the screenshot.

### Slide 3 — Feature ("the tool")
- **Background:** beam from top-right (1150, −160), wide `from 173deg`, core `from 187deg`, horizon peak at 86%.
- **Eyebrow:** `02 / BREW TIMER` at (96, 176).
- **Headline:** left at (88, 246), 150 px, full lit second line: "Every pour, / **called on time.**" Subline (96, 596), single line.
- **Phone:** 1060 px, left 360, top 812, bleeding bottom 103 px and right 100 px (71.7% visible), right/top rim-lit.
- **Decorations (2–3):** command-palette card at (56, 2176, 548 w) listing the real steps with the current one selected and a lit `⏎` keycap; vertical comet at x 88 from y 1240 to 2090 landing on the card.
- **Must be true:** the palette does not cover the screenshot's main label ("Second Pour") or ring.

### Slide 4 — Feature ("in the flow")
- **Background:** beam straight down but offset to x 60%; grid center 60% 28%.
- **Headline:** centered, top 250, 140 px: "Scan a bag. / **Details fill in.**"
- **Phone:** 1000 px centered on the floor line (bottom 2780).
- **Decorations (2):** a glass result card (500 w) emerging from the phone's right bezel at y 1800 showing fields the scanner fills (origin, roast date) in mono; a keycap chip `⌘ ⇧ S` at the phone's top-left corner.
- **Must be true:** the card's fields are real UI fields; beam lands on the phone's top edge, not on the card.

### Slide 5 — Proof / ecosystem ("everywhere")
- **Background:** beam straight down; floor line at y 2600.
- **Headline:** centered, top 250, 140 px: "Glance. / **Already synced.**"
- **Composition:** two upright phones on one floor line — front 960 px (home/lock-screen widgets), back 845 px offset 240 px left, rim at 50% — OR one phone + 2 widget PNGs framed as glass chips (360–520 w) standing on the floor beside it.
- **Decorations (2–3):** widget chips; one comet on the floor.
- **Must be true:** both phones upright and on the same floor; front phone ≥ 68% canvas height.

### Slide 6 — Closer ("⌘K")
- **Background:** beam straight down onto the palette's top edge; bloom `rgba(143,140,255,.55)` 800×360 behind the palette top.
- **Eyebrow:** `EVERYTHING IN BLOOM` centered at top 170 (app name lavender).
- **Headline:** centered, top 238, 140 px: "Built for the way / you brew. **Fast.**"
- **Palette:** (84, 640, 1152 w): header `› Search Bloom…` + `⌘ K`; 6 rows × 204 px (84 px icon tile, 46 px title, 32 px description, `⌘ n` keycaps), row 1 selected with lit keycaps; footer `↑ ↓ NAVIGATE  ⏎ OPEN   6 RESULTS`.
- **Lockup:** app icon 168 px (38 px radius, `0 0 60px rgba(143,140,255,.35)` glow) + wordmark 78 px tall + mono 26 px feature line, centered at y 2330; floor line + comet at y 2600.
- **No phone** (allowed). **Must be true:** palette rows are the app's real features, and the beam visibly lights the palette's top border.

## Adapting to other app categories

| Category | Beam hue (core / lit stop) | Motif swap | Copy angle |
|---|---|---|---|
| AI assistant | indigo `#8F8CFF` / `#B3AFFF` (default) | palette = prompt box with streaming answer row | "Ask once. Done in seconds." |
| Dev tool / CI | cyan `#4FD1E8` / `#8FE6F5` | palette = commands, mono log line in chip | "Ship on Friday. Sleep anyway." |
| Finance / budgeting | emerald `#3FD69B` / `#8BEBC4` | glow chip = balance + sparkline | "Every dollar, accounted for." |
| Crypto dashboard | amber `#F5B544` / `#F8CF7F` | keycap chip = `⌘ B` buy; chip = price ticker | "Markets move. You're faster." |
| Email / calendar | blue `#5C9DFF` / `#9CC3FF` | palette = triage shortcuts (E, R, ⌘⇧A) | "Inbox zero. By 9 AM." |
| Notes / PKM | rose-violet `#C084FC` / `#DDB8FF` | palette = search results with highlights | "Think it. Find it instantly." |
| Fitness data | teal `#34D3C0` / `#86E8DC` | chip = metric + mono unit | "Every rep, measured." |

Rule when swapping: replace every `rgba(143,140,255,…)`/`#8F8CFF` family value with the new hue at the same alpha, re-measure the lit stop ≥ 4.5:1 against the brightest beam pixel under the headline, and keep everything else (void, greys, glass) unchanged.

## Dark / inverted & localization notes

- **Inverted slide (max 1 per deck, optional):** "daylight" variant — bg `#F4F5F8`, headline gradient `#0B0C12 → #3A3D4A`, lit word `#3B38C8` (7.5:1 on `#F4F5F8`), glass becomes white 70% with the same lit top border in `#8F8CFF`, beam drawn at 12% as a multiply-blend indigo shadow cone. Use only for a proof/ecosystem slide; never the hero.
- **Long German/French lines:** drop headline size in 8 px steps to 128 px floor, then break into 3 lines max; keep −0.035em tracking (never widen). Measure each line ≤ 1144 px.
- **CJK:** use Noto Sans JP/SC/KR 700 (600 reads light), `letter-spacing: -0.01em` (not −0.035), `line-height: 1.12`, 130–140 px. The lit phrase is 2–4 characters. Mono eyebrow stays Latin UPPERCASE or switches to the CJK face at 26 px with 0.08em tracking.
- **RTL (Arabic/Hebrew):** mirror layouts: feature phone bleeds left, palette on the right, comet heads point left, `⌘` keycaps stay LTR glyphs. Use IBM Plex Sans Arabic 600 / Heebo 600, `letter-spacing: 0`.
- Keycap glyphs are Mac-native; for Android-first decks swap `⌘` for `Ctrl` in mono, same keycap recipe.

## How to apply this style

1. **Fonts** — in `template/src/app/layout.tsx` load Inter Tight, Inter and Geist Mono via `next/font/google` (snippet above), `display: "block"`, and expose `--font-display`, `--font-body`, `--font-mono` on `<body>`.
2. **Theme** — in `template/src/lib/constants.ts` add `THEMES["midnight-glow-pro"]` (`bg #07080B`, `bgAlt #F4F5F8`, `fg #F4F5F8`, `fgAlt #0B0C12`, `accent #B3AFFF`, `muted #B4B9C6`) and add the id to the `ThemeId` union in `lib/types.ts`.
3. **Background** — in `slide-canvas.tsx`, make `backgroundFor()` return the 4-stop void gradient for this theme; in `SlideBackground` replace the two `Blob`s with the grid, horizon, horizon-bloom, beam.wide, beam.core, vignette and grain layers above (per-slide beam origin/angle stored on the slide or derived from the device x).
4. **Caption** — in `Caption`, headline: `fontFamily: var(--font-display)`, `fontWeight: 600`, `fontSize: cW * 0.114` (≈150 px), `lineHeight: 1.02`, `letterSpacing: "-0.035em"`, `paddingBottom: "0.08em"`, the white→`#B9BDC9` `backgroundImage` with `WebkitBackgroundClip: "text"` and `color: "transparent"`. Parse `*word*` in the copy into a `<span>` with the lit gradient. Label → mono eyebrow (`var(--font-mono)`, 0.15em, `#A7ACBA`, UPPERCASE).
5. **Measure** each headline line after fonts load; if any > 0.867 × cW (1144 px), step down 8 px to a 128 px floor, then re-break.
6. **Phone** — keep `Phone`; in `renderDevice` wrap it with the `halo` (behind), `phone-bloom` (behind), `rimtint` (masked by the mockup, between bezel and screen) and, on floor layouts, the floor line/glow/reflection. Rotation stays 0.
7. **Decorations** — build glow chips, keycap chips and palettes as positioned text/HTML elements (the `.glass`, `.kbd` recipes) above the device; the comet as a 2 px div on the background layer.
8. **Grid hole** — compute the caption rect and add it as the second mask layer on `.grid` so dots never sit under text.
9. **Closer** — use the `no-device` layout; render the palette rows from the deck's feature list (one selected), then the icon + wordmark lockup.
10. **Audit** — run `_QUALITY_BAR.md` §10 + §11 and the QA checklist below; render a copy with the caption hidden and measure contrast against the real pixels.

## Style-specific QA checklist

- [ ] Background base is `#07080B`-family; no pure black, no navy, no second hue anywhere in the chrome?
- [ ] Exactly one beam, and it visibly lands on the phone top / palette top?
- [ ] Beam dim (≤ 30% peak) in the headline band; worst bg under the headline ≤ lum 0.055?
- [ ] Headline Inter Tight 600, 140–160 px, −0.035em, white→`#B9BDC9` gradient, no descender clipping?
- [ ] Exactly one lit word/phrase, darkest stop `#B3AFFF` or lighter, measured ≥ 4.5:1?
- [ ] Phone upright 0°, 980–1080 px wide, 69–75% of canvas height, standing on the floor line or bleeding 4–8%?
- [ ] Rim light only on the side facing the beam; shadow side dark?
- [ ] Every glass element has a 2 px gradient border brightest toward the beam + inset top highlight + contact shadow?
- [ ] Keycaps have top highlight, bottom inset shade and a 2 px drop edge (they look pressable)?
- [ ] Dot grid fades radially and is absent under the headline/subline?
- [ ] Mono eyebrow present, UPPERCASE, ≥ 26 px?
- [ ] 2–4 decorations; none covers the screenshot's focal element?
- [ ] Palette rows / chip numbers match real app data?
- [ ] Grain 4–6% present; no visible banding in the beam at 100% zoom?

## Common failure modes

1. **Neon creep** — glow on all sides of the phone, glowing letters, saturated violet blobs. *Fix:* one beam, rim on the lit side only, no text-shadow/glow on type; if it looks like a club flyer, halve every glow alpha.
2. **Lit word fails contrast on the beam** — using `#8F8CFF` or a mid violet for the emphasis where the beam is brightest (measured 3.4–3.8:1). *Fix:* lit stops `#E2E0FF → #B3AFFF` only, and dim the beam core in the text band with the px mask.
3. **Grid under text** — dot grid pixels become the worst contrast point and make headlines look dirty. *Fix:* intersect the grid mask with a band hole around the caption.
4. **Grey-card syndrome** — cards as flat `#1A1A1A` rectangles with a 1 px grey border. *Fix:* use the `.glass` recipe: translucent gradient fill, blur, lit 2 px gradient border, inset highlight, deep contact shadow.
5. **Beam that goes nowhere** — a vertical glow stripe that ends in empty space or hits the headline only. *Fix:* aim the cone (angle math above) so its brightest part meets the phone's top edge; add the phone-top bloom.
6. **Descenders clipped** — `background-clip:text` without bottom padding chops p/y/g. *Fix:* `padding-bottom: .08em` on the headline element.
7. **Small phone on a big dark void** — a 800 px phone centered with dark bands above and below. *Fix:* 980–1080 px, floor at y 2760–2790 or bleed the bottom.
8. **Liquid-glass confusion** — white frosted cards or pastel beams make it look like style 07. *Fix:* all glass is dark `#11131A`-family; the only light-colored surfaces are the screenshot and lit keycaps.
9. **Fake shortcuts everywhere** — keycaps on every element. *Fix:* max one keycap chip per slide outside the palette; one lit keycap per slide.

## What this style is NOT

- Not Neon Athletic Night (09): no volt, no uppercase condensed slanted type, no tilted phones, no speed streaks or slash bands.
- Not Liquid Glass Aurora (07): no light pastel aurora, no white frosted glass, no near-black text on light.
- Not cyberpunk: no magenta/cyan duotone, no glitch, no scanlines, no glowing letters.
- Not a gradient-mesh dark mode: the light is one directional beam, not blurred purple/blue blobs.
- Not tilted, not floating: phones are upright and grounded.
- Not multi-accent: one beam hue per deck; brand color lives only in the screenshot and app icon.
- Not bold-shouty: no 800/900 weights, no all-caps headlines, no exclamation marks.
- Not a code screenshot: no fake terminal windows, no invented metrics, no invented shortcuts that contradict the app.
- Not a brand copy: never reproduce the Linear, Raycast, Vercel, Arc or Superhuman logos, wordmarks, or product UI.
