---
name: bento-keynote-grid
description: Every slide is a bento box of rounded tiles on a cool light-grey ground. One tall stage tile holds a large upright phone that the tile edge crops; smaller tiles hold one huge stat, a real widget PNG, an icon with a two-word label, or a mini chart. Keynote headline with one orange-to-magenta gradient phrase. Inspired by Apple keynote bento recap slides.
inspiration: Apple keynote "bento" recap slides (iPhone / Apple Watch launch recaps), Apple.com product-page feature grids, Notion and Framer feature grids, Linear changelog tiles
feel: exact, generous, feature-dense but calm, "here is everything it does, at a glance"
---

# Bento Keynote Grid

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md). The universal quality rules apply to this style.

## Hard quality rules (this style)

- **The grid is the decoration.** Every slide is built from rounded tiles on a 12-column grid: **56px outer margins, 40px gutters (horizontal AND vertical), 64px columns, 104px column pitch**. Every tile edge sits on a column edge or on the 40px vertical rhythm. A tile that is 10px off the grid is a fail. Nothing floats between tiles.
- **Tile radius = 60px** on every tile (the stage too). Allowed range 56–64px, but one radius per deck. Inner padding = **48px** on all four sides (40–44px only in 300px crown tiles). Mixed radii or mixed padding on one slide = fail.
- **Ground = flat `#F5F5F7`.** No gradient, no grain, no vignette, no blobs. Tiles are flat fills too. The only gradient on the slide is the headline phrase.
- **Phone visible height ≥ 68% of canvas (≥ 1956px of 2868)** on phone slides, measured from the phone's top edge to the stage tile's bottom edge (the visible part). Phone width **1060–1120px**, upright **0°**, always.
- **The stage tile crops the phone** (`overflow:hidden`). The phone rises from the stage's top padding and the stage's bottom edge cuts it off. The cut line must fall in a **gap between UI rows** of the screenshot. Never cut through a text row, a button, or halfway through the tab bar: show the tab bar whole or hide it whole.
- **Exactly one saturated brand tile per slide** (`--brand`, default `#B4441C`, white text 5.55:1). Exactly **one gradient phrase** per headline. Two brand tiles, or a brand tile plus a brand-coloured stage, = fail.
- **Stat numerals are huge:** 180–260px Inter Tight 700 (crown tiles ≥ 180px, 640px-tall tiles 240–260px). A stat under 180px is a caption, not a stat. Only **one stat per tile**.
- **Tile count per slide: 4–9** including the stage. **Floating decorations: 0.** No stickers, blobs, sparkles, arrows or doodles. Tiles don't count as decorations (§9: this is a minimal style).
- **Real assets in tiles.** Widget tiles use the app's real widget PNGs, and list/card tiles use real carousel cards or real strings from the app. Never draw a fake widget.
- **Headline:** Inter Tight 700, **132–150px**, line-height 0.98, tracking −0.035em, max 2 lines (3 only in the split-crown layout, at 120–128px). Measured width ≤ 1160px (88%). Ink `#1D1D1F` = 15.5:1 on the ground.
- **Contrast is measured, not assumed:** gradient stops ≥ 4.8:1 on `#F5F5F7`; eyebrows on brand use `#FFF0E8` (≥ 4.9:1), never white at 80% opacity (4.07:1 = fail).

## Vibe summary

It looks like the recap slide at the end of a keynote segment, the one where the presenter says "so, to recap" and everything the product does sits in one tidy box. The ground is Apple's cool paper grey. On it, rounded tiles lock together with the same 40px gap everywhere. One tall tile is a stage: the phone stands in it, huge and upright, and the tile's bottom edge crops it like a product shot on apple.com. Around the stage, small tiles each say one thing loudly: a numeral set at 240px, a real Home Screen widget, a line icon with two words, a tiny chart. One tile is saturated in the brand colour, so there's always a single warm point of focus. The headline sits above the grid in near-black SF-like grotesk, with one phrase lit orange-to-magenta. Nothing is decorated because the arrangement itself is the design.

## Global palette

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--ground` | `#F5F5F7` | Slide background (flat) | — |
| `--tile` | `#FFFFFF` | Default tile fill | — |
| `--ink` | `#1D1D1F` | Headline, stats, labels | 15.5:1 on ground, 16.8:1 on white |
| `--ink-2` | `#5E5E63` | Eyebrows, captions on light tiles | 5.9 ground · 6.5 white · 5.5 tints |
| `--brand` | `#B4441C` | The ONE saturated tile per slide (swap per app) | white on it 5.55:1 |
| `--brand-eyebrow` | `#FFF0E8` | Eyebrow text on the brand tile | ≥ 4.9:1 |
| `--night` | `#1D1D1F` | Optional dark tile or dark stage (max one per slide) | `#F5F5F7` on it 15.5:1 |
| `--night-eyebrow` | `#A1A1A6` | Eyebrow on night | 6.5:1 |
| `--tint-warm` | `#F6EBE1` | Stage / soft tile (warm apps) | ink 14.3:1 |
| `--tint-sage` | `#E6F0E6` | Soft tile | ink-2 5.5:1 |
| `--tint-sky` | `#E5EDF7` | Soft tile | ink-2 5.5:1 |
| `--widget-fill` | `#FAF6F0` | Tile fill behind widget PNGs (sample from the widget's own bg) | — |
| `--hairline` | `rgba(29,29,31,.12)` | 2px dividers inside list tiles | — |
| `--grad-1` | `#C43A0E` | Headline gradient stop 0% (orange) | 4.87:1 |
| `--grad-2` | `#D0224A` | Stop 52% (red-pink) | 4.81:1 |
| `--grad-3` | `#B5179E` | Stop 100% (magenta) | 5.39:1 |

**Fill distribution per slide:** 1 brand tile (required), 0–1 night tile, ≥ 1 white tile, ≤ 2 tint families. Two tiles with the same fill never sit side by side, except widget tiles, which always use `--widget-fill`. The stage takes either a tint (warm apps, light screenshots) or night (to make a light screenshot pop). Never brand.

## Typography

**Google Fonts (default):**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=Inter:wght@500;600;700&display=block" rel="stylesheet">
```
```ts
// src/app/layout.tsx
import { Inter, Inter_Tight } from "next/font/google";
const display = Inter_Tight({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display", display: "block" });
const text = Inter({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-text", display: "block" });
// <body className={`${display.variable} ${text.variable}`}>
```
**Commercial alternates:** SF Pro Display / SF Pro Text (only where your licence allows marketing use), Söhne / Söhne Breit, Neue Haas Unica, Helvetica Now Display. One family pair per deck. No serifs, scripts or monos.

| Role | Face | Size @1320 | Leading | Tracking | Colour |
|---|---|---|---|---|---|
| Headline | Inter Tight 700 | 132–150px (120–128 split-crown) | 0.98 | −0.035em | `--ink` + gradient phrase |
| Stat numeral | Inter Tight 700 | 180–260px | 0.80 | −0.045em | ink / white on brand, night |
| Stat unit | Inter Tight 700 | 0.30–0.37× numeral (44–90px) | 1 | −0.03em | same as numeral |
| Tile label (2 words) | Inter Tight 700 | 56–76px | 1.0 | −0.03em | ink |
| List item (recipes etc.) | Inter Tight 700 | 60–66px | 1.0 | −0.03em | ink, 22px row padding |
| Caption | Inter 600 | 38–40px | 1.14 | −0.018em | ink / white |
| Eyebrow | Inter 600 | 30–32px | 1.1 | −0.01em | `--ink-2` / `--brand-eyebrow` / `--night-eyebrow` |

Rules: sentence case everywhere. The unit is baseline-aligned to the numeral with an 8–18px gap (`display:flex; align-items:baseline`). Numerals use proportional figures (default). Never letter-space a numeral wider than −0.045em, or digits touch.

## Headline emphasis (signature)

One phrase per headline (1–3 words, usually the number or the payoff) takes the keynote gradient. Same weight and size as the rest; colour is the only change.

```css
.g{background:linear-gradient(90deg,#C43A0E 0%,#D0224A 52%,#B5179E 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  padding-right:.05em;margin-right:-.05em} /* stops the last glyph being clipped */
```
- Measured: the lightest interpolated colour along the gradient is 4.81:1 on `#F5F5F7`. Glyph-interior pixels on the reference renders measured 4.80:1 at the 1st percentile, median 15.5:1 for ink.
- Gradient runs left→right across the span only (not the whole headline), so short phrases still show orange *and* magenta.
- Brand swap: replace the stops only with a pair where every stop is ≥ 4.5:1 on `#F5F5F7` (see the category table). Never pastel stops, never a glow, underline or italic.

## Layout grid & safe zones

Column x-starts: col *n* starts at `56 + (n−1)·104`. Spans: 3 = 272, 4 = 376, 5 = 480, 6 = 584, 7 = 688, 8 = 792, 12 = 1208px. Vertical gutters are 40px. Tile heights come from this set: **300** (crown), **376** (square / widget row), **600–640** (feature tiles), stage (fills to y = 2812).

| Zone | Rect (x, y, w, h) | Rule |
|---|---|---|
| Top margin | 0, 0, 1320, 88–96 | Empty ground |
| Headline block | 56, 94, 1208, 144–280 | Text only, nothing overlaps |
| Grid area | 56, headline-bottom + 40–48, 1208, → 2812 | Tiles only |
| Bottom margin | 0, 2812, 1320, 56 | Empty ground, always exactly 56px |
| Side margins | 0–56 and 1264–1320 | Never occupied (no bleed in this style) |

Nothing may be placed on the ground between tiles. Decorations aren't allowed anywhere. The phone lives only inside the stage tile.

**Phone clip formula** (template bezel, aspect 1022:2082): phone height `H = 2.0372·W`, screen top `= phoneTop + 0.0450·W`, screen height `= 1.9472·W`. Clip fraction of the screenshot `= (stageBottom − screenTop) / (1.9472·W)`. Pick `W` and `phoneTop` so that fraction lands in a gap between UI rows (measure the screenshot's row bands first).

### The four bento layouts (reusable recipes)

**L1 · Crown + Stage** (hero, general features). 2-line headline, then a 3-tile crown and a full-width stage.
```
headline  y 96–370   centered, 140px
crown     y 412–712  [4 cols 376][4 cols 376][4 cols 376]   h 300
stage     y 752–2812 [12 cols 1208]  phone W 1120, left 44, top 80 → abs 832, visible 1980 = 69.0%
```

**L1b · Widget crown + Stage** (proof/ecosystem, second feature). 1-line headline, a 376px crown sized for widgets.
```
headline  y 94–236   left x 56, 142px, one line
crown     y 272–648  [8 cols 792 medium widget][4 cols 376 small widget]   (or 4/4/4 squares)
stage     y 688–2812 phone W 1080, left 64, top 56 → abs 744, visible 2068 = 72.1%
```

**L2 · Stage + Floor** (feature). 1-line headline, the stage first, and a row of square tiles at the bottom.
```
headline  y 94–236   left x 56, 142px
stage     y 272–2396 [12 cols] phone W 1060, left 74, top 56 → abs 328, visible 2068 = 72.1%
floor     y 2436–2812 [4 cols 376][4 cols 376][4 cols 376]  h 376 (stat · widget · icon+label)
```

**L3 · Mosaic** (closer, no phone). 2-line headline and four tile rows that alternate wide/narrow.
```
headline  y 96–355   centered, 132px
row A     y 400–1040  [7 cols 688 brand stat][5 cols 480 icon+label]
row B     y 1080–1456 [8 cols 792 medium widget][4 cols 376 small widget]
row C     y 1496–2136 [5 cols 480 stat + mini ring][7 cols 688 list tile]
row D     y 2176–2812 [4 cols 376 app icon + name][8 cols 792 night "Lock Screen" tile]
```

**L4 · Split crown** (differentiator). 3-line headline flush-left in cols 1–7 beside one tall brand tile.
```
headline  x 56 w 688, y 96–480, 124px, 3 lines (≤ 13 chars/line)
inline    x 56 w 688, y 528–712 (184 tall) one tile: icon 104 + one short line, OR a lock-inline widget
brand     x 784 w 480, y 96–712 (616 tall): eyebrow + 240px stat + caption
stage     y 752–2812  phone W 1110–1120, top 80 → visible ≥ 1980 = 69%
```

## Phone / device frame treatment

- Always the template's default bezel (`public/mockup.png` via the `Phone` component in `src/components/editor/device-frames.tsx`). Never a bezelless rectangle, a clay device or a custom frame.
- Upright 0°. Horizontally centred in the stage (side padding 44–74px). Top padding 56–80px.
- The stage is `overflow:hidden`. The crop at the stage's bottom edge IS the treatment ("rising out of the tile").
- Shadow inside the stage:
```css
.stage .phone{filter:drop-shadow(0 34px 44px rgba(40,24,12,.16)) drop-shadow(0 4px 8px rgba(40,24,12,.12))}
.stage.night .phone{filter:drop-shadow(0 30px 60px rgba(0,0,0,.45)) drop-shadow(0 4px 8px rgba(0,0,0,.40))}
```
- Breakout (optional, L2/L1b only): the phone may rise **≤ 96px above** the stage's top edge into the gutter when nothing but the headline sits above. It must stay ≥ 48px clear of the headline's bounding box. Never break out sideways over another tile. The first test render did exactly that and cut the neighbouring tiles' text in half.
- Light screenshots: warm tint or night stage. Dark screenshots: white or `--tint-sky` stage, never night-on-night.

## Background treatment

`background:#F5F5F7` on the slide. That's it: no gradient, grain, blur or vignette. Depth comes from the tiles:
```css
.tile{position:absolute;border-radius:60px;background:#fff;overflow:hidden;
  box-shadow:0 1px 2px rgba(29,29,31,.04),0 8px 20px -12px rgba(29,29,31,.10)}
.tile.brand{background:var(--brand);color:#fff}
.tile.night{background:#1D1D1F;color:#F5F5F7}
.tile.tint{background:#F6EBE1}.tile.sage{background:#E6F0E6}.tile.sky{background:#E5EDF7}
.tile.widget{background:#FAF6F0}         /* match the widget PNG's own bg */
.tile .pad{position:absolute;inset:48px} /* 40px 44px in 300px crown tiles */
```
The shadow is intentionally almost invisible: it only separates white tiles from the grey ground at full size. Anything darker than 10% or longer than 20px blur turns the grid into floating cards (see failure modes).

## Decorative accents (the tile types)

Floating decorations: **0**. Tiles per slide: **4–9**. Each small tile has exactly ONE job:

1. **Stat tile:** eyebrow top-left, numeral bottom-left (or below the eyebrow), optional unit and ≤ 2-line caption.
```html
<div class="tile brand" style="left:56px;top:2436px;width:376px;height:376px"><div class="pad">
  <div class="eyebrow">Sleep-ready in</div>
  <div style="position:absolute;left:0;bottom:0;display:flex;align-items:baseline;gap:8px">
    <span class="stat" style="font-size:196px">10</span><span class="unit" style="font-size:72px">h</span></div></div></div>
```
2. **Widget tile:** the real widget PNG *is* the tile. A small widget goes on a 376×376 tile and a medium widget on a 792×376 tile, with `object-fit:contain` on a `--widget-fill` background. iOS widget corners are ≈ 15.7% of widget width (80px at 510px native), which is ≈ 59px at 376px. That matches the 60px tile radius, so the widget reads as a tile. Never add a caption inside a widget tile.
3. **Icon + two words:** 104×104 icon well (radius 30px, white on tints, `#F5F5F7` on white), a line icon at 58px, stroke 2 in a 24 viewBox (≈ 4.8px), round caps. Label pinned bottom-left at 56–76px: "Scan a bag." / "Bedtime aware." Two words plus a period.
4. **Mini chart:** one tiny, honest chart drawn in the app's own colours, e.g. a freshness bar or a segmented progress ring:
```html
<svg width="288" height="60"><rect y="22" width="288" height="16" rx="8" fill="#EDEDF0"/>
  <rect x="66" y="22" width="150" height="16" fill="#2B7A4B"/><rect y="22" width="72" height="16" rx="8" fill="#D9C7B6"/>
  <rect x="210" y="22" width="78" height="16" rx="8" fill="#E7B9B0"/>
  <circle cx="150" cy="30" r="20" fill="#fff" stroke="#1D1D1F" stroke-width="5"/></svg>
<!-- ring: r 68, stroke 16, track rgba(29,29,31,.10); segments stroke-dasharray "88 340" offset 0/-107/-214, round caps, centre label Inter Tight 700 36px -->
```
5. **List tile:** eyebrow + 3–4 rows of Inter Tight 700 at 60–66px, 22px vertical padding, 2px `--hairline` dividers. Real names from the app only.
6. **Identity tile** (closer only): app icon at 240px (radius 54px, shadow `0 12px 24px -8px rgba(brand,.35)`), app name in Inter Tight 700 72px and a 32px eyebrow tagline.

Polish (§3): tiles are flat by design. The volume cue is the tile shadow plus the phone's two-shadow stack, the real widget PNGs carry their own detail, and the mini charts use 3+ tones. Don't draw illustrations in this style.

## Cross-screen moment

- **Default: none.** Every slide is a self-contained bento. Tiles cut by a seam look like layout bugs.
- **Allowed in 5+ slide decks (max one):** a *bridge tile*, a single flat tint or brand tile whose only content in the crossing part is a continuous mini-chart line (e.g. a freshness timeline) spanning two slides. 10–30% of its width sits on the neighbour, and all its text sits on one side ≥ 80px from the seam. Its rounded corners belong to the two outer ends. The seam cuts only flat fill plus the line.
- **Never crosses:** the headline, the gradient phrase, the stage, the phone, stats, widget tiles, labels, the app icon.

## Copy tone

- **Voice:** Apple keynote. Short declaratives, benefit + number. Two beats: a claim, then a payoff with a figure ("Peak flavor. 19 days of it."). Present tense, calm certainty.
- **Vocabulary:** every, all day, at a glance, in one place, to the second, right on time, one tap, all of it, days, hours, minutes, the real unit of the app (mg, km, $, tasks).
- **Numbers:** always digits in tiles and headlines ("4 pours", "19 days"). Numbers must be true for the screenshot or the app's real behaviour.
- **Punctuation:** sentence case, a period at the end of each sentence. Commas pair parallels ("Caffeine, clocked."). No question marks, exclamation marks, emoji, ALL CAPS or ampersands.
- **Tile labels:** two words and a period ("Scan a bag.", "Bedtime aware."). Captions stay ≤ 7 words.
- **Banned words:** revolutionary, ultimate, best, #1, game-changing, supercharge, unlock, seamless, next-level, AI-powered (as a headline), "and more", "all-new", "world's first", free (in art), download now.
- **Example headlines (12, across categories):**
  - Coffee: "Peak flavor. **19 days** of it." / "Caffeine, **clocked.**" / "Your whole ritual. **One app.**"
  - Productivity: "Your week. **Planned in 5 minutes.**" / "Every task. **One inbox.**"
  - Health: "Sleep, **scored nightly.**" / "Heart rate. **Every beat.**"
  - Finance: "Every dollar. **Accounted for.**" / "Bills paid. **Right on time.**"
  - Smart home: "The whole house. **One tap.**"
  - Fitness: "12 weeks. **One stronger you.**"
  - Utilities / weather: "Rain in **14 minutes.**"
  - Travel: "Every gate change. **Instantly.**"

## Per-slide breakdown (mandatory)

### Slide 1 · Hero (L1 Crown + Stage)
- **Background:** `#F5F5F7`.
- **Headline:** centered, top 96px, 140px, 2 lines: "Peak flavor. / **19 days** of it." (gradient on the number phrase).
- **Crown (y 412, h 300):** brand stat "5 bags" (eyebrow "On your shelf", numeral 190px) · white mini-chart tile "Freshness / At peak" + freshness bar · sage icon tile "Scan a bag.".
- **Stage:** 12 cols, y 752–2812, warm tint. Phone 1120 wide, left 44, top 80 (abs 832), main screen (`home`), cropped in the row gap at 88.5% of the screenshot. Visible 1980px = **69.0%**.
- **Must be true:** at 220px wide you can read the headline, the number, and one crown tile. The crop falls between UI rows.

### Slide 2 · Differentiator (L4 Split crown)
- **Headline:** flush-left x 56, top 96, 124px, 3 lines: "Every bag. / Its own / **clock.**".
- **Inline tile:** x 56, y 528, 688×184, white: icon well + "Scan the bag. Done." at 52px Inter Tight 700.
- **Brand tile:** x 784, y 96, 480×616: eyebrow "Ethiopia Yirgacheffe", numeral "10" at 240px + unit "days", caption "left at peak".
- **Stage:** y 752–2812, `--tint-sky`, phone 1110 at top 80, detail screen (`coffee-detail`), cropped in a gap. Visible ≥ 1980px = 69%.
- **Must be true:** the brand tile and the headline share one top line (y 96). The grid reads as two columns above the stage.

### Slide 3 · Feature (L2 Stage + Floor)
- **Headline:** flush-left x 56, top 94, 142px, 1 line: "Caffeine, **clocked.**".
- **Stage:** y 272–2396, **night**, phone 1060 wide, left 74, top 56 (abs 328), `caffeine` screen cropped just below the tab bar. Visible 2068px = **72.1%**.
- **Floor (y 2436, h 376):** brand stat "10h / Sleep-ready in" · white stat "In your system / 128 / mg, right now." (the same number the phone shows; 180px numeral, caption `white-space:nowrap`) · sky icon tile "Bedtime aware.".
- **Must be true:** the night stage is the only dark tile. Floor tiles are exact squares.

### Slide 4 · Feature (L1b Widget crown + Stage)
- **Headline:** flush-left, 1 line, 142px: "Pour by pour. **4 of them.**" (≤ 1160px measured; drop to 132px if needed).
- **Crown (y 272, h 376):** `widget-quickbrew-medium` on a 792×376 widget tile · brand stat "4" + "pours" (numeral 240px).
- **Stage:** y 688–2812, warm tint, phone 1080 wide, left 64, top 56 (abs 744), `timer` screen. Crop at ≈ 96% of the screenshot, below the Resume buttons (UI band 0.885–0.946). Visible 2068px = **72.1%**.
- **Must be true:** the crop never touches the buttons. There's one brand tile and no second stat.

### Slide 5 · Proof / ecosystem (L1b)
- **Headline:** 1 line: "Glanceable. **Everywhere.**".
- **Crown:** `widget-shelfwatch-medium` 792×376 · `widget-brewpulse-small` 376×376. (No brand tile in the crown? Then the stage takes night and one crown tile swaps to a brand stat tile. Keep exactly one brand tile.)
- **Stage:** phone showing `homescreen-widgets` or `lockscreen-widgets`, visible ≥ 72%.
- **Must be true:** the widgets in the crown are the same widgets visible inside the phone, which proves they're real.

### Slide 6 · Closer (L3 Mosaic, no phone)
- **Headline:** centered, top 96, 132px: "Your whole ritual. / **One app.**".
- **Rows:** as in L3. A brand "19 days / of peak flavor, for every bag." (260px numeral) · white "Scan any bag." · medium + small widgets · sky "Brew timer 4 / guided pours, to the second." + segmented ring · sage recipe list (V60 / Espresso / AeroPress / Cold brew) · white identity tile (icon + "Bloom / Coffee, kept.") · night "Lock Screen" tile (9:41 at 150px + the lock widgets).
- **Must be true:** 8–9 tiles, all edges on the grid, bottom margin exactly 56px, no empty band > 22%. At thumbnail size it reads as a keynote recap.

### Reference render measurements (Bloom sample deck)

| Slide | Layout | Phone W / visible H | Visible % | Headline max width | Worst headline contrast |
|---|---|---|---|---|---|
| Hero | L1 | 1120 / 1980px | 69.0% | 726px (55%) | 4.80:1 (gradient glyph p1), ink 15.5:1 |
| Feature | L2 | 1060 / 2068px | 72.1% | 1100px (83.3%) | 4.80:1 gradient, ink 15.5:1 |
| Closer | L3 | no phone | n/a | 970px (73.5%) | 4.83:1 gradient, ink 15.5:1 |

Use these as the calibration target: if your numbers are far off, re-check the layout recipe before styling.

## Adapting to other app categories

| Category | `--brand` (white text) | Gradient stops (all ≥ 4.5 on ground) | Stat ideas | Tile motif / copy angle |
|---|---|---|---|---|
| Coffee / food | `#B4441C` (5.55) | `#C43A0E → #D0224A → #B5179E` | days fresh, mg, pours | widgets, recipe list; flavor + timing |
| Productivity | `#3F4BD1` (6.69) | `#2D5BD8 → #6A3FC8 → #B0306A` | tasks done, hours saved | today widget, streak ring; calm control |
| Health / sleep | `#C8175D` (5.62) | `#C8175D → #8A2BB8 → #5B3FC8` | bpm, hours slept, score | ring charts, lock widget; body numbers |
| Finance | `#1F7A4D` (5.32) | `#1F7A4D → #0B6E8A → #1F57C3` | $ saved, bills, % | balance widget, bar chart; certainty |
| Smart home | `#0066CC` (5.57) | `#0066CC → #5B3FC8 → #A13BC0` | °C, devices, kWh | room tiles as icon tiles; one tap |
| Fitness | `#2F6B3A` (6.39) | `#C43A0E → #D0224A → #B5179E` | km, reps, weeks | activity ring mini chart; progress |
| Weather / utility | `#1D6FA5` (5.43) | `#1D6FA5 → #5B3FC8 → #A13BC0` | minutes to rain, UV | hourly bar chart tile; precision |
| Travel | `#006E5A` (6.22) | `#006E5A → #1F57C3 → #6A3FC8` | gate, minutes, km | boarding-pass widget tile; readiness |

Keep the ground, tile radius, grid, type and tile types. Swap only the brand hex, the gradient stops, the tints (use pale tints of the brand's neighbours) and the stats.

## Dark / inverted & localization notes

- **Inverted slide (allowed once per deck):** ground `#000000`, tiles `#1C1C1E`, secondary tiles `#2C2C2E`, ink `#F5F5F7` (on `#1C1C1E` 15.6:1), eyebrow `#A1A1A6`. The gradient becomes lighter stops `#FF8A3D → #FF4F7B → #E15BD0` (8.9 / 6.7 / 6.6:1 on `#000`). The brand tile stays brand. The stage becomes `#1C1C1E`, and the phone shadow switches to `rgba(0,0,0,.6)` plus a 1px `rgba(255,255,255,.06)` tile hairline.
- **Long German/French lines:** shrink the headline in 4px steps down to 120px. If it still overflows 1160px, break into the L4 split-crown (3 lines) or shorten. Tile labels: allow 3 words and drop to 52px. Numerals never shrink below 180px. Move the caption to 2 lines instead.
- **CJK:** Noto Sans JP/SC/KR 700 for headlines, `letter-spacing:0`, line-height 1.12, size −8% (≈ 128px). Captions line-height 1.3. Units in the local form (日, 分). The gradient works as-is.
- **RTL (Arabic/Hebrew):** mirror the grid: column 1 starts at the right, split-crown brand tile on the left, eyebrows and numerals right-aligned. Keep the phone centred. Noto Sans Arabic / Hebrew 700, `letter-spacing:0`, line-height 1.15. Numerals stay LTR (`direction:ltr; unicode-bidi:isolate` on the stat span). Flip the gradient direction to 270deg so the "start" colour leads.

## Style-specific QA checklist

- [ ] Every tile x-edge equals `56 + k·104` or `56 + k·104 − 40` (a column edge); every vertical gap is 40px.
- [ ] All tiles share one radius (60px) and one inner padding (48px; 40–44px in 300px crowns).
- [ ] Ground is flat `#F5F5F7`: no gradient, grain or blobs anywhere.
- [ ] Exactly one brand-filled tile on the slide; at most one night tile.
- [ ] Exactly one gradient phrase in the headline, and its lightest interpolated colour is ≥ 4.5:1 on the ground.
- [ ] Every stat numeral is 180–260px and there is only one stat per tile.
- [ ] Widget tiles use real PNGs at native aspect, filling their tile, with no caption inside.
- [ ] Every number on the slide agrees: headline, tiles, widgets and the phone screenshot never show conflicting values.
- [ ] The phone sits inside the stage, upright, and its visible height is ≥ 1956px (68.2%).
- [ ] The stage crop falls in a UI gap; the tab bar is fully shown or fully hidden.
- [ ] Nothing sits on the ground between tiles; no floating decoration; no side bleed.
- [ ] Bottom margin is exactly 56px on every slide and matches the side margins.
- [ ] Brand-tile eyebrow uses `#FFF0E8` (not translucent white); night eyebrow `#A1A1A6`.
- [ ] At 220px wide: headline legible, the single brand tile is the first thing the eye hits after the headline, and at least one number reads.

## Common failure modes

1. **Phone overlapping neighbouring tiles.** A 1000px phone in an 8-column stage with a side rail covers the rail's text (this was render pass 1). **Fix:** stages are 12 columns wide. Put the small tiles in a crown above or a floor below, never beside a ≥ 1060px phone.
2. **Shrinking the phone to fit the bento.** A 740px phone in a half-width tile looks tidy and fails §1 (52%). **Fix:** use L1/L1b/L2/L4 and compute visible height with the clip formula.
3. **Cropping through UI.** The stage edge slices a text row or half the tab bar. **Fix:** measure the screenshot's row bands and pick `W`/`top` so the clip fraction lands in a gap (hero: 0.885 between rows 0.873 and 0.896).
4. **Card soup instead of a grid.** Heavy shadows (`0 20px 40px rgba(0,0,0,.2)`), mixed radii, 24px gaps here and 56px there make it read as floating cards. **Fix:** the one tile shadow in the recipe, 40px everywhere, radius 60 everywhere.
5. **Rainbow tiles.** Every tile a different saturated colour looks like a kids' app. **Fix:** one brand tile, the rest white/tint/cream, ≤ 1 night.
6. **Tiny stats.** Numbers set at 96–120px because the tile is small. **Fix:** fewer words, not smaller numbers. 180px minimum, and change the tile span if a 3-digit number doesn't fit.
7. **Fake widgets.** Drawing a widget from scratch in CSS. **Fix:** use the app's real widget PNGs, or a real screenshot crop, as the tile.
8. **Pastel gradient word.** `#FF9A62 → #FF6FA8` looks Apple-ish and measures 1.9–2.4:1. **Fix:** the deep stops above, measured.
9. **Liquid-glass drift.** Adding blur, blooms or translucent tiles turns this into style 07. **Fix:** all tiles are opaque and flat.
10. **Swiss drift.** Visible grid lines, mono index labels or square corners turn it into style 08. **Fix:** the grid is implied by gaps only; radius 60; no mono.
11. **Conflicting numbers from real assets.** Real assets captured at different times show conflicting numbers on one slide, e.g. a caffeine widget reading "142 mg" under a phone reading "128 mg". **Fix:** make every number on a slide agree. Rebuild the tile as a stat tile with the phone's number, or pick a real widget that states no competing figure.

## How to apply this style

1. **Fonts:** in `src/app/layout.tsx`, load `Inter_Tight` (600/700) as `--font-display` and `Inter` (500/600/700) as `--font-text` with the snippet above. Captions use `--font-display`; tile text uses both.
2. **Theme:** add `bento-keynote-grid` to `THEMES` in `src/lib/constants.ts`: `bg #F5F5F7`, `bgAlt #1D1D1F`, `fg #1D1D1F`, `fgAlt #F5F5F7`, `accent #B4441C`, `muted #5E5E63`.
3. **Grid helper:** in `src/components/editor/slide-canvas.tsx`, add `col(n) = cW·(56 + (n−1)·104)/1320` and `span(k) = cW·(64k + 40(k−1))/1320` plus a 40px vertical rhythm, so tiles snap to the grid at any export size.
4. **Background:** give `SlideBackground` a flat `#F5F5F7` branch for this theme with no blobs, noise or gradient.
5. **Tiles:** add a `Tile` element type (fill: white | tint | sage | sky | brand | night | widget; radius 60·s; padding 48·s; the shadow recipe). Positions come from `col/span` and the layout recipes (L1–L4). Tiles render below the caption and never overlap each other.
6. **Stage + phone:** the stage is a `Tile` with `overflow:hidden`. Render the existing `Phone` inside it (width 1060–1120 on 1320, 0° rotation, top padding 56–80) and apply the stage shadow stack. Run the clip formula against the screenshot's row gaps before export.
7. **Caption:** Inter Tight 700 at `cW × 0.100–0.114`, tracking −0.035em, leading 0.98; wrap the emphasis phrase in a span with the `.g` gradient. Centred for L1/L3, flush-left at x = 56 for L1b/L2/L4.
8. **Tile content:** stat (numeral + unit + eyebrow), widget PNG (`object-fit:contain` on `--widget-fill`), icon + two words, mini chart (inline SVG), list, identity. One job per tile.
9. **Measure:** headline width ≤ 1160px, every text box inside its tile (DOM `getBoundingClientRect` vs the tile's rect), visible phone ≥ 1956px, gradient ≥ 4.5:1 on the ground, brand-tile text ≥ 4.5:1.
10. **Audit:** run the QA checklist above plus `_QUALITY_BAR.md` §10–11 on every export.

## What this style is NOT

- Not liquid glass (07): no blur, translucency, blooms or specular rims. Tiles are opaque.
- Not Swiss grid (08): no visible grid lines, mono labels, square corners or hard phone bleed off the canvas. The grid shows only through equal gaps and rounded tiles.
- Not a dashboard: no tables, dense charts, axis labels or UI chrome drawn outside the phone.
- Not tilted, floating or clay: the phone is upright and cropped by its tile, never hovering over the grid.
- Not colourful: one brand tile, one gradient phrase; everything else is white, grey or a pale tint.
- Not decorated: no stickers, doodles, emoji, sparkles, blobs, confetti, badges, ratings or laurels.
- Not a serif, script or mono style.
- Not Apple-branded: never reproduce Apple logos, product names as headlines, SF Symbols verbatim or keynote slide chrome. Borrow the structure, not the brand.
