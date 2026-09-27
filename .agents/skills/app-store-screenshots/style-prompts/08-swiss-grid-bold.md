---
name: swiss-grid-bold
description: Off-white paper and ink-black slides alternating, a visible hairline 12-column grid, giant flush-left heavy grotesk headlines, mono index labels, upright phones cropped hard by the slide edge, and one international-orange signal block. Inspired by the International Typographic Style.
inspiration: Josef Müller-Brockmann posters, International Typographic Style, Linear, Monzo / Revolut campaigns, Teenage Engineering
feel: rational, confident, high-contrast, "these people measure things"
---

# Swiss Grid Bold

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Phone size**: 68–78% of canvas height *visible on the canvas* (≥ 1950px of 2868). Phone width 1040–1120px. Measure after cropping, not the full device.
- **Phone tilt = 0°.** Always upright. Any rotation (even 1°) is a fail. Phones are placed like figures in a grid, not props on a table.
- **Hard crop is the signature.** Every phone-bearing slide crops the device with at least one slide edge: bottom bleed 4–15% of phone height, top bleed 8–12%, or side bleed 8–12% of phone width. A side bleed of < 60px looks like a mistake — go ≥ 100px or keep the phone fully inside. Never crop through the screenshot's focal UI (the number, the ring, the card the headline talks about).
- **Grid is visible.** Every slide renders the 12-column hairline grid: 72px outer margins, 100px column pitch (76px column + 24px gutter), 2px lines at `rgba(14,14,12,0.13)` on paper / `rgba(242,241,236,0.14)` on ink, plus a closing line at x = 1248. Zero grid = not this style.
- **Headline**: Inter Tight 800, **160–190px**, line-height **0.88–0.92**, tracking **-0.045em**, word-spacing **+0.1em** (so tight tracking doesn't glue words). Flush-left at x = 72. Never centered, never right-aligned. Widest line ≤ 88% of canvas width (≤ 1160px) — measure it.
- **One signal per slide.** International orange `#FF4F00` appears in exactly ONE element per slide: the emphasis block, the emphasis word, or one data highlight. Two orange things on one slide = fail.
- **Contrast rule for orange**: orange **text** only on ink (`#FF4F00` on `#0E0E0C` = 5.9:1). On paper, orange is never text — it is a block with ink type on it (`#0E0E0C` on `#FF4F00` = 5.9:1). Paper-colored text on orange (2.9:1) = fail.
- **Backgrounds are flat single hexes.** No gradient, no vignette, no noise, no blur. Grain overlay = fail.
- **Shadow**: one crisp contact shadow stack only — `drop-shadow(0 3px 2px rgba(14,14,12,.28)) drop-shadow(0 22px 34px rgba(14,14,12,.14))` on paper; `drop-shadow(0 3px 2px rgba(0,0,0,.6)) drop-shadow(0 22px 34px rgba(0,0,0,.4))` on ink. No long soft glows, no colored shadows.
- **Index row** on every slide: mono labels at 30px — app name left, section name at x = 472 (col 5), `NN / TT` right — with a 3px solid rule below. It sits at the top (y ≈ 92) or, if the phone bleeds off the top, directly above the headline block.

## Vibe summary

A Swiss poster that happens to sell an app. The slide is a sheet of paper with its construction grid left visible, and everything snaps to it: the headline hangs flush-left from the margin, the phone starts on a column line, labels sit on the rules. Type does the work — huge, heavy, tightly tracked grotesk with lines that nearly touch — and one orange signal block says "look here". Paper and ink slides alternate like pages of a spec sheet. Phones stand dead upright and get cropped hard by the slide edge, the way a photo gets cropped on a poster: confident, not careful. Proof is a number, set enormous. Nothing is decorative unless it's a measurement mark: grid lines, rules, arrows, registration marks, figure labels.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F2F1EC` | Light slide bg (warm off-white, never `#FFFFFF`) |
| `--ink` | `#0E0E0C` | Dark slide bg, all type on paper, type on orange |
| `--signal` | `#FF4F00` | The one accent: emphasis block / word / data highlight |
| `--grey-p` | `#5E5D57` | Secondary mono labels on paper (5.8:1) |
| `--grey-i` | `#A3A29B` | Secondary mono labels on ink (7.5:1) |
| `--rule-p` | `rgba(14,14,12,0.13)` | Grid hairlines on paper |
| `--rule-i` | `rgba(242,241,236,0.14)` | Grid hairlines on ink |
| `--rule-strong` | `#0E0E0C` / `#F2F1EC` | 3px index rules, table rules |
| `--row-rule-i` | `rgba(242,241,236,0.30)` | Minor data-table dividers on ink |

**Verified contrast pairs** (use only these):

| Foreground | Background | Ratio | Allowed for |
|---|---|---|---|
| `#0E0E0C` ink | `#F2F1EC` paper | 17.1:1 | everything |
| `#F2F1EC` paper | `#0E0E0C` ink | 17.1:1 | everything |
| `#0E0E0C` ink | `#FF4F00` signal | 5.9:1 | emphasis block text, numerals, labels ≥ 24px |
| `#FF4F00` signal | `#0E0E0C` ink | 5.9:1 | emphasis word, one highlighted data row |
| `#5E5D57` grey | `#F2F1EC` paper | 5.8:1 | secondary mono labels |
| `#A3A29B` grey | `#0E0E0C` ink | 7.5:1 | secondary mono labels |
| `#F2F1EC` paper | `#FF4F00` signal | 2.9:1 | **never** |
| `#FF4F00` signal | `#F2F1EC` paper | 2.9:1 | **never as text** (rules/blocks only) |

Brand swap: if the app has a strong brand color, it replaces `--signal` only if it clears 4.5:1 against ink (for text on ink) and ink clears 4.5:1 on it (for blocks). Otherwise keep orange and use the brand color nowhere. Never add a second accent.

## Typography

**Headline / display (Google Fonts first):**
- **Inter Tight 800** (default) / Archivo 800 / Inter Display 800. Commercial alternates: Neue Haas Grotesk Display Black, Söhne Breit Kräftig, Helvetica Now Display Black, GT America Extended Black.
- Headline 160–190px, line-height 0.88–0.92, letter-spacing -0.045em, word-spacing +0.1em. Sentence case.
- Giant numeral (proof): 700–860px, letter-spacing -0.05em (tighter than -0.06em makes digits merge), line-height 1.
- Unit beside a numeral ("days", "mg", "×"): 130–160px, same weight, baseline-aligned with the numeral.

**Sub-line / table titles:** Inter Tight 500 at 44–48px for one-line sub-lines (letter-spacing -0.01em); Inter Tight 800 at 90–100px for index-table titles.

**Mono labels (index rows, figure captions, data):** **JetBrains Mono 500** (default) / Space Mono / IBM Plex Mono. Commercial: Söhne Mono, GT America Mono. Uppercase, letter-spacing +0.02em, 24–30px for labels, 40–56px for data values (times, weights). Color ink/paper for primary, `--grey-p` / `--grey-i` for secondary.

**Type scale at 1320 wide** (scale by `cW / 1320`):

| Role | Face | Size | Leading | Tracking |
|---|---|---|---|---|
| Giant numeral | Inter Tight 800 | 700–860px | 1.0 | -0.05em |
| Headline | Inter Tight 800 | 160–190px | 0.88–0.92 | -0.045em |
| Numeral unit | Inter Tight 800 | 130–160px | 0.9 | -0.045em |
| Table title | Inter Tight 800 | 90–100px | 1.0 | -0.045em |
| Statement line | Inter Tight 700 | 56px | 1.0 | -0.02em |
| Sub-line | Inter Tight 500 | 44–48px | 1.15 | -0.01em |
| Data value | JetBrains Mono 500 | 40–56px | 1.0 | +0.02em |
| Index / caption label | JetBrains Mono 500 | 24–30px | 1.0–1.35 | +0.02em, uppercase |

**Mix rule:** exactly two families — one grotesk, one mono. No serif, no script, no italic anywhere.

**Fonts link:** `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;800&family=JetBrains+Mono:wght@500&display=block`

## Headline emphasis (signature)

One emphasis phrase per headline, treated by slide color:

1. **On paper — the signal block.** The emphasis phrase (usually the last line) sits on a solid `#FF4F00` rectangle with ink type. The block bleeds off the LEFT canvas edge (starts at x = 0, text still starts at x = 72), ends ~0.12em after the last glyph. Square corners. Block height = line box with ~0.02em top and ~0.16em bottom padding so descenders stay inside. It must not overlap the line above.
2. **On ink — the signal word.** The emphasis word is set in `#FF4F00` text; everything else is `#F2F1EC`. No block.
3. **Numeric emphasis** (proof slides): the numeral itself carries the weight; the signal becomes the full-width block behind it.

Emphasize the measurable part: "the day.", "second.", "19". Never emphasize a verb or the app name.

## Phone / device frame treatment

- Always the template's default iPhone bezel (`public/mockup.png` via the `Phone` component in `src/components/editor/device-frames.tsx`). Do not replace it, recolor it, or strip it.
- **Upright, 0°.** No perspective, no 3D.
- **Grid alignment:** the phone's left bezel edge sits on a column line (x = 172, 272, 372 …) or its right edge on x = 1248. Record which one in your layout.
- **Crop presets:**
  - Bottom bleed (hero): left 172, width 1076 (cols 2–12), top 880–920 → 70–71% visible.
  - Top + side bleed (feature): left 348, width 1100, top -220 → right edge bleeds ~128px, bottom at y ≈ 2020 (70.5%).
  - Top bleed only: left 172, width 1076, top -180 → bottom at y ≈ 2010.
- **Shadow:** crisp contact stack listed in hard rules. Nothing else.
- **Screenshot:** use the real UI as-is. Light-mode UI on ink slides is good — it becomes a bright figure on black.
- One phone per slide, max. Two phones only on a closer "comparison" layout, both upright, side by side on column lines, both cropped by the bottom edge equally.

## Background treatment

- Flat `#F2F1EC` or flat `#0E0E0C`. Default deck rhythm: paper → ink → paper → ink → paper (closer).
- Grid overlay on every slide (see hard rules), under everything. The phone covers it; that's fine.
- Optional 1–3 horizontal rules: the 3px index rule, and at most two 2px hairlines marking a baseline or section.
- No texture, no grain, no gradient, no vignette, no photos.

**Grid system (the construction every element snaps to):**
- Columns: 12 × 76px, gutters 24px, margins 72px → column n starts at `x = 72 + 100·(n−1)`, ends at `x = 148 + 100·(n−1)`; content right edge 1248.
- Key x-positions: 72 (headline, labels), 172 / 272 / 348 (phone left edges), 472 (index-row middle label), 1248 (right-aligned labels, phone right edge).
- Vertical rhythm: 8px baseline; major y-stops at 92 (index labels), 148 (index rule), ~196 (headline top), ~2090 (bottom headline block rule), ~2760 (registration mark).
- Hairlines are drawn, not implied: render the 13 vertical lines on every slide. Do not animate, dash, or fade them.

## Decorative accents

Minimal-style density (_QUALITY_BAR §9): **0 floating decorations**. Only construction marks, max **3 per slide** besides the grid and index row:

- **Registration mark**: 80px crosshair (circle r = 18 + two 72px strokes), 3px, ink or paper. One per slide, in a corner margin (x 52 or right 52, y ≈ 2700–2760).
- **Figure caption**: `FIG. N — Screen name` in mono 24–30px, horizontal above the headline block or vertical (`writing-mode: vertical-rl`, rotated 180°) in column 1 beside the phone.
- **Arrows** `→` set in type (Inter Tight 500 or mono), never drawn as curvy SVG. Used after a sub-line or at the end of a proof strip.
- **Data column**: a ruled mono list (times, weights, days) in cols 1–3 beside a side-cropped phone, one row highlighted in signal orange (on ink only). Counts as that slide's signal.
- **Signal block**: one per slide max (see emphasis).

Banned: blobs, stars, sparkles, doodles, emoji, icons floating on the bg, stickers, badges, laurels, rounded chips.

## Cross-screen moment

This style bridges the seam with structure, not illustration.

- **May cross:** the 12-column grid itself (continuous across the canvas — it's one sheet), a 3px horizontal rule, the signal block (a full-bleed orange band continuing at the same y on the neighbor), or a hard-cropped phone whose side bleed lands on the next slide (10–30% of phone width on each side, seam through the bezel or a plain UI area, never through the headline number or primary control).
- **May not cross:** headline text, giant numerals, mono index row, figure captions, data columns.
- In a 5-slide deck use one bridge: the phone of slide 2 bleeding right into slide 3, or an orange band running under the headlines of slides 4 → 5.
- Each crop must still read as a finished poster: if the half-phone on the receiving slide looks like debris, give it ≥ 20% of the width or remove the bridge.

## Copy tone

- **Voice:** blunt, numeric, declarative. Short sentences with full stops. Sounds like a spec sheet that learned to sell.
- **Structure:** noun phrase + measurement. "Fresh beans. Tracked to the day." "Every pour. To the second." Two-beat headlines are the house rhythm.
- **Vocabulary:** tracked, measured, logged, exact, per, day, second, window, index, zero, on time, in, out, → .
- **Numbers:** always digits ("19 days", "3:30", "0 missed bills"). Units lowercase. Mono for data values.
- **Avoid:** exclamation marks, questions, emoji, "revolutionary", "seamless", "effortless", "magic", "AI-powered" as a headline, "unlock", "elevate", adjective stacks.
- **Punctuation:** periods end every headline line that is a sentence. Em dash only in mono labels (`FIG. 2 — Brew timer`). Arrows are punctuation.
- **Example headlines across categories:**
  - Coffee: "Fresh beans. Tracked to the day."
  - Budgeting: "Every pound. Accounted for."
  - Dev tools: "Ship at 9. Green by 9:04."
  - Analytics: "One number. Every morning."
  - Running: "Pace. Split. Done."
  - Hardware companion: "Plug in. Tuned in 30 seconds."
  - Tasks: "Zero inbox. By Friday."
  - Sleep: "8 hours. Measured, not guessed."

## Per-slide breakdown (mandatory)

### Slide 1 — Hero (paper)
- **Bg:** `#F2F1EC` + grid.
- **Index row:** `APP` · `Category / Topic` · `01 / 05`, rule at y = 148.
- **Headline:** y = 196, Inter Tight 800 188px, 3 lines, last line in the signal block bleeding off the left edge. e.g. "Fresh beans. / Tracked to / the day."
- **Sub-line:** y ≈ 790, Inter Tight 500 46px, one line ending in `→`. e.g. "Roast date in. Peak window out. →"
- **Phone:** home/main screen, cols 2–12 (left 172, width 1076), top ≈ 900, bleeds off bottom (~7%).
- **Accents:** vertical `FIG. 1 — Home` in col 1, registration mark bottom-left.
- **Check:** headline widest line ≤ 1160px ("Fresh beans." at 188px ≈ 1055px); the signal block must not touch the line above; phone visible ≥ 1950px.

### Slide 2 — Differentiator (ink)
- **Bg:** `#0E0E0C` + grid.
- **Phone:** the signature feature screen, left 348, width 1100, top -220 — bleeds off top and right.
- **Data column:** cols 1–3, ruled mono list of the feature's real values (times, steps, amounts), the current one in `#FF4F00` with `→`.
- **Headline block:** at bottom — 3px rule at y ≈ 2092, `FIG. 2 — Name` + `02 / 05` row, headline 176px two lines with signal word ("Every pour. / To the second."), sub-line 46px listing concrete variants.
- **Accents:** registration mark bottom-right.

**Bloom example (reference render):** timer screen cropped top + right; data column `0:00 Bloom / 0:45 1st pour / 1:15 2nd pour → / 1:45 Drawdown / 3:30 Done`, row 1:15 in orange; headline "Every pour. / To the second." with "second." orange; sub-line "Guided V60, espresso, AeroPress, cold brew."

### Slide 3 — Feature (paper)
- **Bg:** paper + grid. Mirror slide 1 but phone anchored right: right bezel edge at x = 1248 or bleeding right; headline top, signal block on the key noun.
- **Phone:** a list/detail screen (inventory, history, settings of value).
- **Accents:** a horizontal mono strip of 3–4 measured facts separated by `·` under the headline.

### Slide 4 — Proof (ink)
- **Bg:** ink + grid.
- **Numeral:** one real number from the app at 700–860px in paper color, unit beside it at 140px; the signal is a 12–20px orange rule under the numeral OR the unit in orange.
- **Phone:** optional; if present, bottom-bleed in cols 6–12 with the numeral in cols 1–6, and the numeral must not overlap the phone silhouette.
- **Caption:** mono 30px stating what the number means ("Caffeine in system · 22:00").

### Slide 5 — Closer: Index (paper)
- **Bg:** paper + grid, index row `APP · Index · 05 / 05`.
- **Signal band:** full-bleed orange block y 208–1288 containing a mono label, the giant numeral + unit in ink, and a 56px Inter Tight 700 ink line with `→` flush right.
- **Index table:** y 1372 →, 5 rows × 228px, 2px ink rules: mono number (34px) in cols 1–2, feature title Inter Tight 800 96px from col 3, mono two-line descriptor right-aligned at x = 1248 in `--grey-p`. 3px closing rule.
- **Footer:** registration mark bottom-left, mono imperative bottom-right ("Scan a bag. Start at day 0.").
- **Phone:** none (allowed). If the brand needs a device, use the two-phone variant instead of the table.
- **Bloom example (reference render):** band label `PEAK WINDOW · ETHIOPIA YIRGACHEFFE`, numeral "19" + "days left.", statement "Brew it at its best. Not after. →"; table rows Shelf / Timer / Recipes / Caffeine / Widgets with descriptors "Peak window per bag", "Guided pours", "V60 · Espresso / AeroPress · Cold", "Sleep-ready time", "Home + Lock Screen".
- **Numbers must be real.** Pull the numeral from the app's actual data or screenshots. An invented statistic ("10× faster") is off-brand for a style built on measurement.

## How to apply this style

1. **Fonts** — in `src/app/layout.tsx`, load `Inter_Tight` (weights 500, 600, 800) and `JetBrains_Mono` (500) from `next/font/google`, expose them as CSS variables (`--font-display`, `--font-mono`) on `<html>`.
2. **Theme** — in `src/lib/constants.ts` add to `THEMES`: `"swiss-grid-bold": { id, name: "Swiss Grid Bold", bg: "#F2F1EC", bgAlt: "#0E0E0C", fg: "#0E0E0C", fgAlt: "#F2F1EC", accent: "#FF4F00", muted: "#5E5D57" }` (and add the id to `ThemeId` in `src/lib/types.ts`).
3. **Background** — in `slide-canvas.tsx`, `backgroundFor()` must return the flat hex (no `linear-gradient`) for this theme, and `SlideBackground` must skip the `Blob`s and render the grid div instead (`left: 72/1320·cW`, width to 1248, `background-image: linear-gradient(to right, rule 0 2px, transparent 2px)`, `background-size: (100/1320·cW)px 100%`, right border).
4. **Alternate** — set `inverted: true` on slides 2 and 4 so they use ink bg / paper text.
5. **Caption** — for this theme render the label as the mono index row (app name · section · `NN / TT`) with a 3px rule, and the headline at `unit * 0.14`, weight 800, line-height 0.9, letter-spacing -0.045em, word-spacing 0.1em, `align="left"`. Scale all px in this spec by `cW / 1320`.
6. **Emphasis** — mark the emphasis phrase in the headline text (e.g. `*the day.*`); on non-inverted slides wrap it in an orange block span bleeding to x = 0, on inverted slides color it `#FF4F00`.
7. **Phone** — use layout `device-bottom` for hero/feature and override `transforms.device` to the crop presets above (y may be negative; width 1040–1120 at 1320 scale). Rotation 0. Apply the contact-shadow filter.
8. **Accents** — add registration marks, figure captions, and data columns as `textElements` / small absolute SVGs; keep ≤ 3 per slide.
9. **Closer** — use `no-device` layout with the orange band + index table built from `textElements`.
10. **Cross-screen** — enable one bridge (phone side-bleed or orange band) per 5-slide deck in the connected canvas; check each export alone.
11. **Audit** — run `_QUALITY_BAR` §10 and §11; additionally verify: grid present, one orange element per slide, no tilt, phone ≥ 68% visible, widest headline line ≤ 1160px.

## What this style is NOT

- Not tilted. No floating, angled, or perspective phones.
- Not soft: no gradients, glows, blurred shadows, glassmorphism, rounded blobs, pastel fills.
- Not decorated: no doodles, sparkles, emoji, stickers, 3D objects, mascots, illustrations.
- Not centered. Headlines never center; layouts are asymmetric and flush-left.
- Not multicolor. One orange, used once per slide. No second accent, no rainbow charts.
- Not light-weight type. Thin or regular headlines break the poster read; use 800.
- Not serif, not script, not italic.
- Not pure white `#FFFFFF` or pure black `#000000` backgrounds.
- Not loose: default browser leading (1.2) or neutral tracking on display type is a fail.
- Not cute copy. No "Say hello to…", no exclamation marks, no questions.
- Not a Swiss pastiche with fake Helvetica logos, fake poster credits, or someone else's wordmark.
