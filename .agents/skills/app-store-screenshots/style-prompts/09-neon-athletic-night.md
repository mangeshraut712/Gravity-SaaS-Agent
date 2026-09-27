---
name: neon-athletic-night
description: Near-black stadium-night slides, one electric volt accent, huge slanted condensed UPPERCASE headlines, giant metric numerals as proof, speed streaks and diagonal slash bands, phones tilted with a volt rim-light. Inspired by Nike Run Club, Strava, Whoop.
inspiration: Nike Run Club, Strava, Whoop, Oura, Gatorade / Nike night-run campaign posters
feel: high-energy, coached, "lights on, clock running, go"
---

# Neon Athletic Night

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Background is near-black, never pure black and never grey.** Base `#0A0B0D`, built as a 3-stop linear `#17191D → #0E0F12 → #0A0B0D` (172°) plus one cool floodlight radial from a top corner and a faint volt spill behind the phone. A flat `#000` slide is a fail; a slide lighter than `#1D2025` anywhere outside the floodlight is a fail.
- **ONE accent: volt `#D4FF3A`.** It must show up on every slide in exactly these jobs: the one emphasis word/number in the headline, the phone rim-light, and at most 2 decorative shapes (streak, slash band, bar). A secondary hot orange `#FF5A1F` may be used **once per deck** (a "PB" badge, one pace bar, one dot). Any third hue in the chrome = fail.
- **Headline = condensed display, UPPERCASE, slanted, huge.** Anton 400 with `transform: skewX(-9deg)` (Anton has no italic; skew the whole block from `transform-origin: 0 100%`), or Barlow Condensed 800 *italic*. Size **230–290 px** at 1320 wide (cap height ≥ 190 px). `line-height: 0.88`, `letter-spacing: -0.005em`. Slant range −8° to −12°. Below 220 px = fail.
- **Line width ≤ 88% of canvas** (≤ 1160 px) per headline line, measured after skew. Two or three lines; hand-break so every line is one or two words.
- **Exactly one volt emphasis per headline** — usually the last word or the number. Never two volt words, never a volt full headline.
- **Phone tilt 6–12°** on every phone-bearing slide, alternating direction across the deck (e.g. −8°, +6°/−6°, −10°). Upright = fail; >12° = fail.
- **Volt rim-light behind every phone** — two layers: a tight rim (`blur(18px)`, 55% opacity, inset −0.6%) and a wide bloom (`blur(90px)`, 40–45% opacity, inset −2%, nudged 30–50 px toward the light side). Without it the black bezel vanishes into the black bg.
- **Phone size:** tilted bounding box visible on canvas = **68–78% of canvas height**; phone width 960–1080 px. Bleed off the bottom edge up to 10% and off one side ≤ 15% of phone width. Never crop through the key metric in the screenshot.
- **Giant metric numeral** (≥ 170 px Anton, skewed) appears on at least 2 of 5 slides, as the proof for the headline. Units (`MG`, `KM`, `BPM`, `H`) sit beside it at 30% of the numeral size in steel `#A3A8AF`.
- **Contrast target is AAA (7:1)** for all text: chalk `#F4F5F0` on night = 18.3:1, volt on night = 17.0:1, steel `#A3A8AF` on night = 8.2:1. Orange is **never** used as text on night (6.3:1) — only as a fill with night text on top.
- **Motion blur/chromatic fringe on decorations only.** Never blur, fringe or glow a letter. Headline gets only a soft dark `text-shadow: 0 6px 30px rgba(0,0,0,.5)`.
- **Grain** at 8–10% opacity (overlay blend) plus a 118° hairline "carbon" texture at ≤ 2.5% white. Zero texture = fail.

## Vibe summary

It is 9 pm, the track floodlights just came on, and the app is your coach. Every slide reads like a Nike night-run poster crossed with a Whoop recovery screen: near-black stadium air, a single volt color that feels electric against it, and headlines so large and slanted they seem to be moving. Proof comes as numbers — a split, a milligram count, a streak — set in the same condensed display as the headline, big enough to read from across a gym. Speed streaks and one diagonal slash band give the sense of forward motion; phones lean into the run with a volt glow bleeding off their edges. The voice is a coach's: short, imperative, no hedging. It should feel fast, disciplined and a little loud — never chaotic.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--night` | `#0A0B0D` | Base bg, darkest stop, text on volt/orange |
| `--night-top` | `#17191D` | Top gradient stop (floodlit sky) |
| `--carbon` | `#131519` | Chips, stat cards, split rows fill |
| `--graphite` | `#1D2025` | Raised cards, bar tracks (`rgba(244,245,240,.08)` alt) |
| `--hairline` | `rgba(244,245,240,.14)` | Row dividers, chip borders |
| `--floodlight` | `rgba(226,232,240,.13)` | Cool stadium-light radial from a top corner |
| `--chalk` | `#F4F5F0` | Headline, primary numerals (never pure `#FFF`) |
| `--steel` | `#A3A8AF` | Labels, units, body copy (8.2:1 on night) |
| `--volt` | `#D4FF3A` | The ONE accent: emphasis word, rim-light, streaks, bars |
| `--volt-deep` | `#9FCC12` | Volt shadow side on slash bands / glow core |
| `--flare` | `#FF5A1F` | Secondary, max 1× per deck, fill only |
| `--fringe-a` / `--fringe-b` | `#FF3DA0` / `#3AE7FF` | Chromatic fringe on streaks only, 15–18% opacity |

Color philosophy: black + chalk + volt. If a slide looks "colorful" you have used too much volt. Volt on white/light backgrounds is banned (1.1:1). A full-volt slide with night text is allowed as the deck's single inverted slide.

## Typography

- **Display (headlines + giant numerals):** Google Fonts first — **Anton** 400 (skewed −9°), **Barlow Condensed** 800 italic, or **Oswald** 700 (skewed −10°). Commercial alternates: Nike Futura Condensed ExtraBold (licensed only), Druk Wide/Druk Condensed Super Italic, Tungsten Black, Obviously Condensed Black Italic.
  - Headline 230–290 px, numerals 170–300 px, `line-height: .88` (numerals `.9`), tracking `-0.005em`, always UPPERCASE via `text-transform`.
- **Labels / eyebrows / units:** Barlow Condensed 700 italic, UPPERCASE, 30–44 px, tracking `.12–.14em`, steel (or volt for the app-name part of the eyebrow).
- **Body / subhead (optional, max one line of ≤ 8 words):** Barlow 500, 40–46 px, steel, `line-height 1.3`. Commercial alternates: Söhne, GT America Standard.
- **Eyebrow format (every slide, top-left at 96 px / 118 px):** `APPNAME / FEATURE` — app name in volt, feature in steel, 42 px. This is the style's lockup; do not replace with a logo wordmark except on the closer.
- **Font loading:** `display=block` (never `swap`) so exports never capture the fallback face.

**Size ladder at 1320 × 2868 (scale by canvas width for other devices):**

| Role | Face | Size | Leading | Tracking | Color |
|---|---|---|---|---|---|
| Hero headline (3 lines) | Anton, skew −9° | 250–290 px | 0.88 | −0.005em | chalk + 1 volt word |
| Slide headline (2 lines) | Anton, skew −9° | 230–250 px | 0.88 | −0.005em | chalk + 1 volt word |
| Proof numeral | Anton, skew −9° | 170–320 px | 0.90 | 0 | volt (first) / chalk |
| Numeral unit | Anton, skew −9° | 30% of numeral | 1 | 0 | steel |
| Splits-row action | Anton, skew −9° | 110–128 px | 1 | 0 | chalk |
| Eyebrow | Barlow Cond. 700 i | 40–44 px | 1 | 0.14em | volt / steel |
| Stat label | Barlow Cond. 700 i | 30–34 px | 1.1 | 0.12em | steel |
| Body line | Barlow 500 | 40–46 px | 1.3 | 0 | steel |

Never set display type below 110 px or labels below 30 px — thumbnails eat anything smaller.

## Headline emphasis (signature)

The emphasis is **color, not a font change**: one word (or one number) goes volt, the rest stays chalk. Same face, same size, same slant.

- It is almost always the final word, ending on a period: "DIAL IN / EVERY / **POUR.**"
- Numbers beat words: if the headline contains a stat, the stat is the volt part ("**5 AM.** / EVERY DAY.").
- Never underline, box, or outline the emphasis. Never add a glow to it.
- The period after the emphasis word is also volt.

Examples: "KNOW YOUR / **NUMBER.**", "TRAIN YOUR / **TASTE.**", "RUN THE / **SPLIT.**", "SLEEP LIKE / IT'S **TRAINING.**", "LIFT / **HEAVIER.**".

## Phone / device frame treatment

- **Always the template's default iPhone bezel** (`public/mockup.png` via the `Phone` component in `device-frames.tsx`). Never replace it; style only around it.
- **Tilt 6–12°**, alternate direction per slide. Rotate a wrapper that has the phone's aspect ratio (`aspect-ratio: 1022/2082`) so rotation happens around the phone's center — a zero-height wrapper rotates around its top edge and silently pushes the bottom corner into your copy.
- **Rim-light stack** (behind the bezel, same rotation): tight volt rim `inset:-0.6%; border-radius:14%/6.9%; filter:blur(18px); opacity:.55`, wide volt bloom `inset:-2%; filter:blur(90px); opacity:.42; translate(±40px,-30px)` toward the floodlight side.
- **Drop shadow:** `drop-shadow(0 70px 90px rgba(0,0,0,.75)) drop-shadow(0 10px 20px rgba(0,0,0,.6))`. On a black bg a tinted shadow is invisible — the rim-light does the separating.
- **Screenshots:** light or dark UI both work; light UI pops harder. Do not tint the screenshot.
- **Position:** anchored to the bottom edge (bleed ≤ 10%), one side bleed ≤ 15% of phone width. Headline sits above; stat column or chip may sit beside the phone, never over the screenshot's key metric.
- **Clearance math for a stat column beside a tilted phone:** with the wrapper rotating around its center, the near bezel edge moves ≈ `tan(tilt) × Δy` px per px of height (≈ 0.105 at 6°, 0.14 at 8°). Tilt so the edge moves *away* from the column as the column descends, or narrow the column; measure the gap at the column's top and bottom.
- **Two-phone slides:** back phone at 85% scale, tilted 4° more than the front one, rim-light at half opacity, offset 180–240 px; never more than two phones.
- **Screen choice:** pick screens that already contain a big number or a live state (timer, ring, chart, score). The style promises performance; a settings or empty screen breaks it.

## Background treatment

Layer order (bottom → top):
1. `linear-gradient(172deg, #17191D 0%, #0E0F12 42%, #0A0B0D 100%)`.
2. Floodlight: `radial-gradient(ellipse 70% 38% at 82% -4%, rgba(226,232,240,.13), rgba(226,232,240,.04) 45%, transparent 72%)` — move the x between 15% and 85% per slide so the light seems to pan.
3. Volt spill behind the phone: `radial-gradient(ellipse 60% 30% at 70% 60%, rgba(212,255,58,.07), transparent 70%)`.
4. Carbon hairlines: `repeating-linear-gradient(118deg, rgba(255,255,255,.022) 0 2px, transparent 2px 16px)`.
5. Vignette: `radial-gradient(ellipse 95% 70% at 50% 45%, transparent 55%, rgba(0,0,0,.55) 100%)`.
6. Film grain 8–10% (`mix-blend-mode: overlay`).

**Floodlight choreography across a 5-slide deck** (the light should seem to pan with the camera):

| Slide | Floodlight x | Volt spill (x, y) | Slash band |
|---|---|---|---|
| 1 Hero | 85% | 72%, 66% | solid, lower third, behind phone |
| 2 Differentiator | 20% | 70%, 50% | solid, bottom-left corner |
| 3 Feature | 60% | 55%, 60% | 10–20% opacity, may cross into 4 |
| 4 Proof | 50% (or flat volt if inverted) | — | night hairline on volt |
| 5 Closer | 50% | 30%, 40% | 10% opacity behind headline |

Do not add color blobs, bokeh, particles, stars, or gradient meshes. The only light sources are the floodlight and the phone's rim-light.

## Decorative accents

Density: **editorial, 3–5 per slide** (eyebrow and rim-light are not counted). Allowed kit:

- **Speed streaks** — 2–3 rounded bars angled −9° (matching the headline slant), 5–10 px thick, 300–620 px long: one solid volt, one chalk at 55%, one volt at 60% with horizontal blur (`feGaussianBlur stdDeviation="10 1"`). The solid volt streak gets two fringe copies (`#FF3DA0` offset −10/−4 px, `#3AE7FF` offset +10/+4 px, 15–18% opacity, blurred). Place them trailing off the end of the headline, never through it.
- **Diagonal slash band** — one parallelogram running edge to edge at ~27° upward-right, 180–240 px thick, solid volt, with a blurred 35% duplicate offset −40 px (motion smear) and a thin 16–20 px parallel volt line 90 px away at 45–50%. Sits **behind** the phone. On text-heavy slides drop it to 10% opacity.
- **Stat chip** — `#131519` at 92%, 2 px hairline, 28 px radius, 10 px volt bar on the leading edge, rotated to match the phone; label 32 px steel + numeral 140 px volt. 380–440 px wide. May overlap the phone bezel edge, not the screen's key metric.
- **Pace / progress bars** — 12–14 px tall, skewed −20°, volt fill on `rgba(244,245,240,.08)` track.
- **PB / record badge** — the single allowed orange: `#FF5A1F` fill, night text, Barlow Condensed 800 italic 40 px, 8 px radius.

Polish gates for streaks and bands: two tones (solid + blurred duplicate), texture (grain on top), volume cue (motion smear). Never use icons, emoji, trophies, flames, or lightning-bolt clipart.

## Cross-screen moment

- **May cross the seam:** the diagonal slash band (it is designed to continue at the same angle into the next slide), a speed-streak cluster, the floodlight/volt spill gradient, or a tilted phone corner bleeding ≤ 20% of its width into the neighbor.
- **May not cross:** headlines, numerals, stat chips, the PB badge, eyebrow lockups, or any screen content the headline depends on.
- Align the band so it exits one slide and enters the next at the same y and angle; the seam should cut it through a plain volt section, never through its blurred smear end.
- In a 5-slide deck use one crossing (usually slide 2 → 3). Each export must still read alone.

## Copy tone

- **Voice:** a coach on the sideline. Imperative verbs, second person implied, zero hedging. Short enough to shout.
- **Vocabulary:** dial in, hit, nail, own, train, split, pace, PR/PB, streak, rep, zone, recover, peak, clock, every, no days off, lock in.
- **Avoid:** "effortless", "seamless", "journey", "wellness", "unlock", "empower", questions, emoji, exclamation marks, lowercase headlines, words longer than 10 letters in the headline.
- **Punctuation:** every headline ends with a period. Numbers as digits, units uppercase (`128 MG`, `5K`, `7H 42M`).
- **Length:** 2–4 words per headline, max 3 lines. Body line optional, ≤ 8 words, sentence case.
- **Labels and metrics** read like a scoreboard: `IN YOUR SYSTEM`, `LOGGED TODAY`, `PEAK WINDOW`, `SPLIT`, `RATIO`, `STREAK`, `AVG PACE`. Two words max, no verbs.
- **Formula:** `VERB + (THE/YOUR/EVERY) + NOUN.` — the noun is the volt word. If a line needs an adjective to make sense, the headline is too long.
- **Example headlines (across categories):**
  - Running: "RUN THE / **SPLIT.**"
  - Strength: "ADD THE / **PLATE.**"
  - Sleep/recovery: "RECOVER / LIKE A / **PRO.**"
  - Coffee/brewing: "DIAL IN / EVERY / **POUR.**"
  - Nutrition: "HIT YOUR / **PROTEIN.**"
  - Habit/streaks: "DON'T / BREAK THE / **CHAIN.**"
  - Cycling: "OWN THE / **CLIMB.**"
  - Caffeine/health: "KNOW YOUR / **NUMBER.**"
  - Closer: "TRAIN YOUR / **TASTE.**"

## Per-slide breakdown (mandatory)

### Slide 1 — Hero ("the poster")
- **Background:** full stack, floodlight top-right (x 85%).
- **Eyebrow:** `APP / CORE FEATURE` at (96, 118), 42 px.
- **Headline:** 3 lines, left-aligned at x 92, top 210, 250–270 px Anton skewed −9°. Volt on the last word.
- **Phone:** tilt −8°, left ≈ 215 px, width ≈ 1030 px, top ≈ 935 px, bleeding off the bottom and ≤ 10% off the right. Shows the app's single most "performance" screen (timer, live workout, score).
- **Decorations (3):** speed-streak cluster trailing from the headline's short last line, one volt slash band behind the lower phone, one stat chip bottom-left overlapping the bezel edge.
- **Test:** at 220 px wide the headline, the volt word and the tilted glowing phone must all read.
- **Composition check:** headline block ends around y 880–940; the phone's highest corner may rise to the headline's last-line baseline only on the side opposite the text. No band without headline, phone, or chip taller than 400 px.

### Slide 2 — Differentiator ("the number")
- **Headline:** 2 lines ("KNOW YOUR / **NUMBER.**"), 230–250 px.
- **Phone:** tilt the opposite way (+6° to +10°) or −6° with the stat column on the other side; width 960–1000 px.
- **Stat column** beside the phone: 3 stacked metrics (172 px numerals + 52 px unit + 32 px label + pace bar), 330–350 px apart, left at 78 px. First numeral volt, the rest chalk. The column must clear the tilted bezel by ≥ 24 px at every y.
- **Decorations (3):** slash band crossing the bottom-left corner behind the phone, one streak pair off the headline, pace bars.
- **Numbers must match the screenshot** (the same 128 MG the phone shows) — the column amplifies the UI, it does not invent data.
- **Copy example:** "KNOW YOUR / **NUMBER.**", "READ YOUR / **RECOVERY.**", "WATCH THE / **PACE.**"

### Slide 3 — Feature (one specific tool)
- **Headline** top, 2–3 lines. Phone centered-right, tilt −10°, a second screen element (a card from the app, a widget PNG) floating off the bezel edge with the stat-chip treatment.
- **Decorations (3–4):** streak cluster, slash band at 10–20% opacity (seam crossing into slide 4 if used), one chip, grain.
- **Floating card:** a real UI card (widget, notification, list row) exported from the app, scaled to 520–640 px wide, given the stat-chip frame (carbon fill, volt leading bar, 28 px radius) and rotated with the phone. It overlaps the bezel by 60–120 px, never the screen's focal element.
- **Copy example:** "SCAN IT. / **BREW IT.**", "LOG EVERY / **REP.**"

### Slide 4 — Proof (inverted or numeral-led)
- Either the **one inverted slide**: solid volt `#D4FF3A` bg, night headline, night numeral 300 px, phone with a **night** rim instead of volt glow; or a numeral-led night slide where one giant metric (280–320 px) sits above the phone as the headline itself ("**1:15** / TO BLOOM.").
- **Decorations (3):** night-colored streaks on volt, one hairline band, grain.
- **Inverted-slide rules:** text is night `#0A0B0D` (17:1 on volt); streaks become night at 70%; the phone keeps the default bezel with a night-tinted shadow `0 60px 90px rgba(10,11,13,.45)` and no glow; grain drops to 6%. Never put chalk or steel text on volt.
- **Copy example:** "**7H 42M.** / EARNED.", "**5K** / BEFORE WORK."

### Slide 5 — Closer ("your splits")
- **No phone** (allowed). Headline 2 lines at 238 px at the top.
- **Splits board:** 5 rows, each 270 px tall, divided by 2 px hairlines: row number (Barlow Condensed 800 italic 44 px volt), action (Anton 118 px skewed, chalk, 2–3 words, e.g. "SCAN THE BAG"), right-aligned metric (Anton 84 px volt) + 32 px steel label, and a skewed pace bar growing row by row (22% → 100%).
- The single orange `PB` badge may sit after one action.
- Bottom lockup: app icon 190 px with a 3 px volt ring + 60 px volt glow, wordmark (chalk) and a 36 px steel label listing 3–4 features.
- **Decorations (3):** 10%-opacity slash band behind the headline, one streak cluster bottom-left, the pace bars.
- **Alternate closer:** two phones (see phone treatment) under "EVERY DAY. / **NO DAYS OFF.**" when the app has fewer than 5 nameable features.
- **Copy example:** "TRAIN YOUR / **TASTE.**", "SHOW UP. / **SCORE.**"

## How to apply this style

1. **Fonts** — in `template/src/app/layout.tsx`, load `Anton` (400), `Barlow_Condensed` (700, 800; `style: ["italic"]`) and `Barlow` (500, 600) from `next/font/google` with `display: "block"`; expose them as CSS variables (`--font-display`, `--font-label`, `--font-body`) on `<body>`.
2. **Theme** — in `template/src/lib/constants.ts` add a `THEMES["neon-athletic-night"]` entry (`bg #0A0B0D`, `bgAlt #D4FF3A`, `fg #F4F5F0`, `fgAlt #0A0B0D`, `accent #D4FF3A`, `muted #A3A8AF`) and add the id to the `ThemeId` union in `lib/types.ts`.
3. **Background** — in `slide-canvas.tsx`, make `backgroundFor()` return the 3-stop night gradient + floodlight + volt spill for this theme, and replace the two `Blob`s in `SlideBackground` with the carbon-hairline, vignette and grain layers. Inverted slides use flat `bgAlt` volt.
4. **Caption** — in `Caption`, switch the headline to `var(--font-display)`, `textTransform: "uppercase"`, `lineHeight: 0.88`, `transform: "skewX(-9deg)"`, `transformOrigin: "0 100%"`, `fontSize: cW * 0.19` (≈ 250 px), left-aligned. Render the label as the eyebrow (`APP / FEATURE`, Barlow Condensed italic, accent color). Wrap the emphasis word (`*word*` in the copy) in a span colored `theme.accent`.
5. **Measure** every headline line after skew; if any line > 0.88 × cW, step the font size down in 8 px increments to a floor of 220 px, then re-break the line.
6. **Phone** — pass `rotation` (6–12°, alternating) through the device transform; wrap the `Frame` in a container with the rim + bloom layers (same border-radius as the bezel) via `renderDevice`'s `extraStyle`/wrapper. Keep the default bezel.
7. **Decorations** — build streaks and the slash band as inline SVG layers at z-index below the device; chips and stat columns as positioned divs above the background, below the headline.
8. **Numerals** — for proof slides, add text elements with `var(--font-display)` at 170–300 px, skewed −9°, units in steel at 30%.
9. **Closer** — use the `no-device` layout and render the splits board as text elements (one per row) plus pace-bar divs.
10. **Audit** — run `_QUALITY_BAR.md` §10 + §11: exactly one volt emphasis per headline, orange ≤ 1× per deck, phone 68–78% of height with rim-light, no text on the slash band, no blurred text.

## What this style is NOT

- Not a neon/cyberpunk style — no magenta/cyan palettes, no grids, no glitch text, no glow on type.
- Not a gradient-mesh dark mode — the bg is near-black with one light source, not purple-blue blobs.
- Not multi-accent: volt is the accent; orange appears once or not at all.
- Not serif, script, rounded, or lowercase. No sentence-case headlines, no thin weights.
- Not calm: no upright phones, no centered floating phones with empty bands above and below.
- Not dense maximalism: no sticker swarms, no badges row, no trophy/flame/bolt clipart, no emoji.
- Not volt on light: never volt text or volt shapes on white, cream, or light UI cards.
- Not motion-blurred text: blur, fringe and smear belong to streaks and bands only.
- Not a brand copy: never reproduce the Nike swoosh, Strava chevrons, Whoop strap, or any third-party logo or wordmark.
- Not a stock-fitness photo deck: no sweaty-athlete photos, no gym stock imagery; the numbers and the phone carry the energy.
- Not a light-mode style: there is no cream, white, or pastel slide. The only non-night slide is the single optional volt inversion.
- Not a place for fake claims: every numeral must come from the app's real UI or real product facts (recipe times, limits, counts), never invented records or ratings.
