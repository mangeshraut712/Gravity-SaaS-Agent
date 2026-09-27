---
name: risograph-zine
description: Two riso inks (fluorescent pink + medium blue, optional yellow) overprinting on off-white newsprint. Visible misregistration, multiply overprint, real halftone dot gradients, speckled ink, huge condensed caps with one word knocked out of a solid ink block. Stapled tickets, hand stamps, cut-paper arrows. Indie gig-flyer energy. Inspired by Hato Press and riso zines.
inspiration: Hato Press, Colorama, It's Nice That covers, indie record-shop flyers, gig posters, risograph zines
feel: indie, loud, handmade-in-print, "someone ran this off at the print shop at 2am and it slaps"
---

# Risograph Zine

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md). The universal quality rules apply to this style.

## Hard quality rules (this style)

- **Max 3 inks: two by default, three at most.** Default set: fluoro pink `#FF48B0` + medium blue `#3255A4`. Fluoro yellow `#FFE800` is an optional third ink that you may use only on tickets, one swatch and one halftone. If you add a fourth hue (green chips, orange icons, a gradient) the style fails.
- **Overprint must be real.** Every ink layer uses `mix-blend-mode: multiply` so overlaps create the third colour: pink × blue = violet `#321871`, blue × yellow = olive `#324D00`, pink × yellow = red-orange `#FF4100`. Do not paint overlap colours by hand, and never use opacity to fake them.
- **Misregistration is visible but controlled.** On display type and solid shapes, offset the second plate by **+8 to +10px x, +6 to +8px y** and rotate it **0.3–0.8°**. Keep offsets under 6px and it reads as a mistake. Push them past 14px and the type turns to mush at thumbnail size.
- **Halftones are true dot screens.** Dot radius must change with tone (`r = cell·√(coverage/π)·1.12`). Cell size is **18–24px**. Screen angles are **pink 75°, blue 15°, yellow 0°**. Faking a halftone with a dot pattern whose opacity fades, or with a radial gradient, fails.
- **Ink texture on every ink element.** Apply the `#riso` SVG filter to text plates, halftones and decorations (speckle holes, 0.88–1.0 coverage, 4px edge wobble). Solid floods and knockout blocks use the calmer `#flood` filter. Use `#stamp` for stamps only. Crisp vector ink = fail.
- **Paper, never white.** The background is newsprint `#F4F0E6` with a fibre and fleck layer (multiply, darkening ≤ 14%) and a 10% overlay grain. `#FFFFFF` anywhere outside the phone screen is a fail.
- **Headline = Anton, ALL CAPS, huge.** Use 240–280px on phone slides, 300–340px on flood slides, `line-height: .9`, `letter-spacing: -0.005em`. The widest line must measure ≤ 1160px (88%). Keep the headline to 2 lines, or 3 only on flood or no-phone slides.
- **Exactly one knockout word per headline.** That word is paper-coloured `#F4F0E6` text inside a solid blue block. A misregistered pink block sits under the blue block and the overlap shows as violet. Two knockouts, or a knockout in pink (2.7:1), = fail.
- **Contrast is measured on the key plate.** Text on paper is blue `#3255A4` (6.2:1) or the violet overprint (12.3:1). Knockout text is paper on blue (6.2:1) or on violet (12.3:1). Fluoro pink `#FF48B0` never carries words on paper (2.7:1). Pink is used for plates, fringes, halftones and shapes only.
- **Phone size and tilt:** visible phone height is **68–72%** of the canvas (1000–1060px wide), upright or tilted **≤ 3°** (5° is the absolute max). Anchor it to the top or bottom edge with 40–110px of bleed. The in-phone screenshot is never tinted, halftoned or blended.
- **Decoration density: 4–7 per slide** (between editorial and maximal), at least one of them a halftone field. Decorations never sit under headline or subhead glyphs.

## Vibe summary

This is the flyer stapled to the record-shop corkboard, the zine at the café till, the gig poster wheat-pasted outside the venue. It was printed on a risograph: two soy inks pushed through a stencil drum onto cheap off-white stock. The drums never line up perfectly, so every letter has a pink ghost peeking out from behind the blue. Where the inks cross they multiply into a deep violet nobody mixed on purpose. Tones are coarse halftone dots you can count. Floods are slightly uneven, and a few pinholes show paper where the drum ran dry. On top of the print sit a few physical artefacts: a yellow ticket stub with a real staple, a crooked rubber stamp, a cut-paper arrow. The type is condensed, capitalised and enormous, and one word is knocked out of a slab of ink. The voice is a flyer: short, loud, a bit cheeky. The app's real UI sits inside an untouched iPhone, which reads as "this is a real product" amid the print chaos.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F4F0E6` | Slide background (newsprint), knockout letters, tab stock |
| `--paper-shade` | `#E6DFCF` | Fibre tint (never a flat fill) |
| `--pink` | `#FF48B0` | Ink 1 (Riso "Fluorescent Pink"): misreg plates, halftones, arrows, stars. **Never text on paper** |
| `--blue` | `#3255A4` | Ink 2 (Riso "Medium Blue"): key plate for ALL text on paper, floods, knockout blocks, stamps |
| `--violet` | `#321871` | Overprint pink × blue (multiply result, not painted). Reads as the "type colour" |
| `--yellow` | `#FFE800` | Optional ink 3: ticket stock, one swatch, one halftone. Never a slide bg |
| `--olive` | `#324D00` | Overprint blue × yellow (text printed on tickets) |
| `--red` | `#FF4100` | Overprint pink × yellow (halftone on ticket stubs) |
| `--shadow-tint` | `rgba(50,24,113,.30)` | Contact shadow under phone, tickets and staples |
| `--staple` | `#F2F3F5 → #B9BEC6 → #6E747D` | Staple gradient (the only non-ink colour, 96×22px) |

**Measured contrast (WCAG):** blue/paper 6.21 · violet/paper 12.26 · paper/blue 6.21 · olive/yellow 7.64 · blue/yellow 5.65 · pink/paper **2.71 (decoration only)** · blue/pink **2.29 (never text on pink)**.

**Alternate ink sets** (swap both plates together; the key plate must always be ≥ 4.5:1 on paper):

| Set | Key plate (type) | Accent plate | Overprint | Best for |
|---|---|---|---|---|
| A (default) | Medium Blue `#3255A4` | Fluoro Pink `#FF48B0` | `#321871` | music, events, social, creative tools |
| B | Federal Blue `#3D5588` (6.5:1) | Yellow `#FFE800` | `#3D4D00` | bookstores, cafés, libraries |
| C | Federal Blue `#3D5588` | Bright Red `#F15060` | `#391A33` | news, podcasts, sports clubs |
| D | Burgundy `#914E72` (5.2:1) | Green `#00A95C` | `#003329` | plants, farmers markets, local community |
| E | Midnight `#435060` (7.2:1) | Fluoro Orange `#FF7477` | `#43242C` | food trucks, zines, maker tools |

## Typography

**Display (headlines, spine words, lineups):** **Anton** 400 (Google). It is condensed and heavy, and it holds up when misregistered. Always `text-transform: uppercase`.
- Phone slides: 240–280px. Flood slides: 300–340px. Spine words: 180–220px. Lineup rows: 150–200px.
- `line-height: .9` (knockout blocks use `.86`), `letter-spacing: -0.005em`, `white-space: nowrap` per line, lines broken by hand.
- Fit rule: Anton caps average ≈ 0.42em. Width ≈ chars × 0.42 × size. Keep it ≤ 1160px, e.g. 272px → at most 10 characters per line.
- Google alternates: **Bowlby One** (chunkier and wider, so use 78% of the Anton size), **Big Shoulders Display 900**, **Oswald 700** (lighter). **Rubik Mono One** is for stamps and tickets only.
- Commercial alternates: **Knockout** (H&Co), **Druk Condensed Super**, **Tungsten Black**, **GT America Compressed Black**.

**Utility (subheads, header strip, descriptors, tabs):** **Archivo** (variable: `wdth` 62–125, `wght` 100–900).
- Subhead: 600, 44px/1.18, `-0.005em`, blue, multiply, ≤ 2 lines, max width 820px.
- Header strip and ticket caps: `wdth` 125, 800, 30px, uppercase, `letter-spacing: .08em` (ticket line: `wdth` 100, 23px, `.1em`).
- Flood kicker ("BLOOM PRESENTS"): `wdth` 125, 800, 36–40px, `letter-spacing: .14–.3em`.
- Lineup descriptors: 700, 34px, lowercase, blue. Tear-off tabs: 700, 25px.
- Commercial alternates: **GT America Extended**, **Monument Extended**, **Söhne Breit**.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wdth,wght@62..125,100..900&display=block" rel="stylesheet">
```

```ts
// template/src/app/layout.tsx
import { Anton, Archivo } from "next/font/google";
const display = Anton({ subsets: ["latin"], weight: "400", display: "block", variable: "--font-display" });
const ui = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "block", variable: "--font-ui" });
// <body className={`${display.variable} ${ui.variable}`}>
```

## Headline emphasis (signature)

Build every headline as two ink plates, then put one word inside a knockout block.

```html
<!-- plate 1 (pink, behind) + plate 2 (blue key). Both multiply, both ink-filtered -->
<div class="plate ink anton" style="left:73px;top:167px;font-size:272px;color:#FF48B0;rotate:.35deg">DON’T MISS</div>
<div class="plate ink anton" style="left:64px;top:160px;font-size:272px;color:#3255A4">DON’T MISS</div>
<!-- knockout word: blue block over a misregistered pink block, paper-coloured letters -->
<div style="position:absolute;left:432px;top:426px;transform:rotate(-1.5deg)">
  <div class="plate ink" style="inset:0;background:#FF48B0;transform:translate(-12px,10px) rotate(.7deg)"></div>
  <div class="plate" style="inset:0;background:#3255A4;filter:url(#flood)"></div>
  <div class="anton" style="position:relative;font-size:262px;line-height:.86;padding:34px 26px 30px 34px;color:#F4F0E6">PEAK.</div>
</div>
```

```css
.plate{position:absolute;mix-blend-mode:multiply;white-space:nowrap}
.ink{filter:url(#riso)}
.anton{font-family:var(--font-display),'Anton',sans-serif;text-transform:uppercase;line-height:.9;letter-spacing:-.005em}
```

Rules:
- The knockout word is the payoff: the benefit noun ("PEAK."), the number ("ZERO"), or the verb. Keep it to 1 word, 4–6 letters where possible.
- Rotate the block −1.5° to +1.5°. Its pink plate shifts in the opposite direction (−12px, +10px), so two sides show a pink fringe.
- Leave a gap of ≥ 14px between the block (including its pink fringe) and any neighbouring glyphs.
- On flood slides the whole headline is knocked out (paper on blue). The knockout block is not repeated there.

**The ink filters (paste once per page, 0×0 SVG):**

```html
<svg width="0" height="0" style="position:absolute">
 <filter id="riso" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="4" result="fine"/>
  <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -10 7.6" result="speck"/>
  <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="3" seed="9" result="coarse"/>
  <feColorMatrix in="coarse" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -.5 1.24" result="cover"/>
  <feComposite in="speck" in2="cover" operator="arithmetic" k1="1" result="mask"/>
  <feComposite in="SourceGraphic" in2="mask" operator="in" result="inked"/>
  <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="2" result="warp"/>
  <feDisplacementMap in="inked" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G"/>
 </filter>
 <!-- #flood = same as #riso but cover matrix "-.3 1.13" (coverage .94–1.0, keeps knockout text ≥ 4.5:1) -->
 <!-- #stamp = one turbulence .09/3 octaves/seed 21, alpha "-8 5.75", displacement .07 scale 6 -->
</svg>
```

## Phone / device frame treatment

- Always use the template's default iPhone bezel (`public/mockup.png` via the `Phone` component). Style the area around it. Never redraw, recolour or halftone the bezel or the screenshot.
- **Width 1000–1060px**, visible height 68–72% of 2868. Anchor to the bottom edge (hero, proof) or the top edge (feature) with 40–180px bleed. Horizontal offset: centre ±130px, leaving one margin of 240–270px for a spine word, ticket or arrow.
- **Tilt 0° to ±3°** (feature −2°). Never over 5°. This style gets its energy from print, not from device angles.
- **Halftone offset shadow (the long shadow):** a phone-silhouette rounded rect (`rx = 0.155 × width`) offset **(−44, +40)** or **(+46, +42)**, filled with an 18px dot screen whose coverage runs from .34 at the top to .56 at the bottom. Use blue at 15° on light areas and pink at 75° when the slide already has a blue field. Multiply plus `#riso`.
- **Contact shadow (tight):** `filter: drop-shadow(0 4px 5px rgba(50,24,113,.30)) drop-shadow(0 18px 24px rgba(50,24,113,.10))`.
- A duotone field (pink halftone sun, solid pink disc, blue flood edge) may sit behind the phone, but it must spill ≥ 120px beyond the bezel to be visible.
- Decorations may overlap the bezel by ≤ 60px. They may overlap the screen only at the outer 50px margin over non-UI pixels.

```html
<svg class="plate ink" style="left:0;top:0;clip-path:url(#phShadow)" width="1320" height="2868"><!-- generated dots --></svg>
<svg width="0" height="0"><clipPath id="phShadow"><rect x="218" y="920" width="1000" height="2037" rx="155"/></clipPath></svg>
<div class="phone" style="left:262px;top:880px;width:1000px;filter:drop-shadow(0 4px 5px rgba(50,24,113,.30)) drop-shadow(0 18px 24px rgba(50,24,113,.10))">…</div>
```

## Background treatment

1. **Paper base:** a flat `#F4F0E6`. No gradient, no vignette.
2. **Fibre and flecks** (one div, `mix-blend-mode: multiply`, `inset: 0`). Maximum darkening is 14%, which keeps the worst pixel under blue text ≥ 4.8:1:

```css
.fibre{position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply;background-image:
 url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.025 .06' numOctaves='3' seed='5'/><feColorMatrix values='0 0 0 0 .62 0 0 0 0 .57 0 0 0 0 .48 0 0 0 1.6 -.72'/></filter><rect width='100%' height='100%' filter='url(%23f)' opacity='.16'/></svg>"),
 url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='k'><feTurbulence type='fractalNoise' baseFrequency='.45' seed='11'/><feColorMatrix values='0 0 0 0 .55 0 0 0 0 .5 0 0 0 0 .44 0 0 0 14 -10.3'/></filter><rect width='100%' height='100%' filter='url(%23k)' opacity='.4'/></svg>")}
```

3. **Grain:** the shared `.grain` overlay at `opacity: .10` (overlay blend), placed last in the stack.
4. **Halftone fields (1–2 per slide):** generated dots, never CSS radial-gradient tricks. Coverage functions: `disc` (sun), `sweep` (corner fade), `tint` (flat 30–55%).

```tsx
// Halftone.tsx: true AM screen, dot area ∝ tone
export function Halftone({ w, h, cell = 22, angle = 15, color, coverage, gain = 1.12 }:
  { w: number; h: number; cell?: number; angle?: number; color: string; coverage: (x: number, y: number) => number; gain?: number }) {
  const a = (angle * Math.PI) / 180, cx = w / 2, cy = h / 2, n = Math.ceil(Math.hypot(w, h) / 2 / cell) + 2;
  const dots: JSX.Element[] = [];
  for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
    const u = i * cell, v = j * cell;
    const x = cx + u * Math.cos(a) - v * Math.sin(a), y = cy + u * Math.sin(a) + v * Math.cos(a);
    if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
    const c = Math.min(1, coverage(x, y)); if (c <= 0.005) continue;
    const r = cell * Math.sqrt(c / Math.PI) * gain; if (r < 1.1) continue;
    dots.push(<circle key={`${i}.${j}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r.toFixed(1)} />);
  }
  return <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "multiply", filter: "url(#riso)" }}><g fill={color}>{dots}</g></svg>;
}
export const disc = (cx: number, cy: number, R: number, gamma = 0.85, peak = 1) =>
  (x: number, y: number) => { const d = Math.hypot(x - cx, y - cy) / R; return d >= 1 ? 0 : peak * (1 - d) ** gamma; };
```

For a flat tint, an SVG `<pattern>` is fine: `<pattern id="tint" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><circle cx="9" cy="9" r="6.4" fill="#3255A4"/></pattern>`. That is 40% coverage.

5. **Ink flood (flood / closer / inverted slides):** a blue rect bleeding 20px past three edges, filtered with `#flood`. A 44px pink strip sits under its free edge, rotated 0.3°, so a violet band and a pink fringe show. A pink halftone `disc` (R 500–600, 24px cell, 75°) overprints the flood as violet dots.

## Decorative accents

Density is **4–7 per slide**. Count each halftone field, ticket, stamp, arrow, registration mark, colour bar and star cluster as one item. At least one must be a halftone field. At least one may be physical (ticket and staple).

| Accent | Size on 1320×2868 | Build | Placement |
|---|---|---|---|
| **Halftone sun / field** | R 340–600 | `Halftone` + `disc`, pink 75° or blue 15° | Behind the phone, spilling ≥ 120px into a margin |
| **Stapled ticket stub** | 540–600 × 200–220 | Yellow stock, 24px notches, pink dot stub at 14px pitch (reads red-orange), perforation `stroke-dasharray: 2 12` in paper colour, "ADMIT ONE" Anton 84px, serial Anton 44px rotated ±90°, staple 96×22 | Rotate 5–12° or −78° (vertical, in a side margin). Needs a contact shadow `drop-shadow(0 3px 3px rgba(50,24,113,.28)) drop-shadow(0 14px 18px rgba(50,24,113,.14))` |
| **Hand stamp** | 210–250px circle | 8px outer ring + 4px inner ring, `textPath` label Archivo `wdth` 125 800 21px `.2em`, "Nº" 20px + number Anton 92px, `#stamp` filter, blue (paper-coloured on floods, normal blend) | Rotate −14° to +10°, beside the headline or near a corner. Never on screen UI |
| **Cut-paper arrow** | 300–310px long (polygon `4,58 262,40 250,2 408,86 246,176 258,128 10,136` at scale .6–.76) | Blue fill with a misregistered pink copy (+9, +8, 0.8°), or pink fill with blue halftone in the lower half | In a margin, tip touching the bezel and pointing at the key UI line |
| **Registration mark** | 80–92px | Circle r 24 plus a 92px cross, two opposite quadrants filled. Drawn twice (pink offset +4/−3, then blue) | One corner per slide at most |
| **Ink swatch bar** | 4 × 56px squares | pink, blue, pink+blue overprint, yellow | Bottom-left under the subhead, feature slides only |
| **Lineup stars** | r 30–44 | 8-point star, inner radius 46%, pink, `#riso` | Between lineup words only |

Polish gates (_QUALITY_BAR §3) are met through: overprint tones (≥ 2 fills), halftone and speckle texture, contact shadows on physical items, and misregistered contour offsets as the volume cue. **Never** draw clip-art coffee cups, vinyl records or microphones. If you need an object, render a halftone photo silhouette or cut it.

## Cross-screen moment

- **Allowed across the seam:** one halftone field (sun or sweep) running 10–30% into the neighbour, a flood edge continuing at the same y, a lineup of tear-off tabs running through, or a cut-paper arrow whose tail sits in slide N and tip in slide N+1.
- **Never across the seam:** headline letters, the knockout block, the ticket, the stamp, the phone.
- Put the seam through dots (the screen hides the cut) or through paper between tabs. Never cut through a dot-dense core ≥ 80% coverage, because that reads as a hard edge.

## Copy tone

Flyer voice. Short, loud, capitalised, a bit cheeky. Write it like a gig poster, a market-stall sign or a zine cover line. Every line still states the benefit.

- **Structure:** 2–5 words per line, max 2 lines on phone slides. Full stops are allowed and encouraged ("FOUR POURS. ZERO MATH."). No question marks, no exclamation marks.
- **Vocabulary:** live, doors, lineup, issue, side A, fresh, loud, every week, no filler, zero, peak, all ages, sold out, first press, admit one, tonight.
- **Subhead:** one plain sentence in sentence case that says what the feature does, e.g. "Bloom reads every roast date and flags the week each bag tastes best."
- **Banned words:** revolutionary, seamless, game-changing, unleash, elevate, effortless, next-level, supercharge, AI-powered (as the headline), "the ultimate", emoji, hashtags, "!!".

Example headlines:
1. Coffee: "DON'T MISS / THE [PEAK]."
2. Coffee timer: "FOUR POURS. / [ZERO] MATH."
3. Music / DJ: "EVERY SET. / [LIVE]."
4. Podcasts: "NEW EPISODE. / EVERY [TUESDAY]."
5. Events: "DOORS AT 8. / YOU'RE [IN]."
6. Bookshop: "READ THE / [ZINE] FIRST."
7. Café loyalty: "TENTH CUP / IS [FREE]." (only if true)
8. Creative tool: "PRINT IT. / [LOUD]."
9. Community board: "YOUR BLOCK. / YOUR [BOARD]."
10. Record shop: "FIRST PRESS. / [SOLD] OUT."
11. Farmers market: "FRESH ROAST. / LOUD FLAVOR. / EVERY [WEEK]." (3 lines on flood slide)
12. Habit / journal: "ONE PAGE. / [DAILY]."
13. Closer: "SIX ACTS. / ONE CUP." (all knocked out on a flood)

## Layout grid & safe zones

All values are px on 1320×2868.

- **Margins:** left/right 64–72px for text. Top 60px (header strip baseline 116). Bottom text safe line at 2800px.
- **Header strip:** box `x 72–1250, y 60–150`. App icon 76px (radius 18) + Archivo header 30px. A registration mark may take `x 1180–1275, y 55–150`.
- **Headline box (top layout):** `x 64–1256, y 160–740`. Subhead `x 72–900, y 750–860`. Stamp zone `x 1030–1270, y 640–900`.
- **Headline box (bottom layout):** `x 64–1256, y 2040–2560`. Subhead `y 2600–2720`. Swatch bar `y 2756–2812`.
- **Phone box (bottom anchor):** `x 262–1262, y 880–2917` (1000px wide). **Phone box (top anchor):** `x 62–1112, y −168–1971` (1050px, −2°).
- **Free margins for accents:** the side opposite the phone offset, `x 0–260` (bottom anchor) or `x 1120–1320` (top anchor; the spine word goes here).
- **No-decoration zones:** every glyph box of the headline and subhead plus 14px. Every phone screen except its outer 50px. Also the 40px band between the headline block and the phone top.
- **Flood slide:** flood `y 0–1180/1420`. Knockout type `y 110–900`. Ticket and stamp `y 1000–1360`. Content below the flood starts ≥ 100px under the pink fringe.

## Per-slide breakdown (mandatory)

### Slide 1: Hero ("DON'T MISS THE PEAK.")
- **Background:** paper + fibre + grain. Pink halftone sun `disc(230, 1440, 540, .85)`, cell 22, 75°.
- **Header:** icon at (72, 64) 76px. "BLOOM · THE FRESHNESS ISSUE" at (170, 84), Archivo `wdth` 125 800 30px blue. Registration mark at (1180, 58).
- **Headline:** "DON'T MISS" Anton 272px at (64, 160). "THE" at (64, 432). Knockout "PEAK." 262px at (432, 426), rotated −1.5°. Measured widest line 1138px (86%).
- **Subhead:** (72, 756), Archivo 600 44px, 2 lines.
- **Phone:** 1000px at (262, 880), 0°, 69.3% visible, bottom bleed 49px. Blue halftone shadow at (−44, +40).
- **Decorations (5):** halftone sun · stamp "01" 220px at (1036, 652), −14° · blue cut-paper arrow scale .74 at (−10, 1046), 4°, tip on the peak notification line · yellow ticket 540×200 at (−110, 2150), −78°, stapled · registration mark.
- **Must be true:** the knockout word is the brightest thing on the slide at 220px wide, and the pink ghost is visible on every headline letter.

### Slide 2: Differentiator (flood + phone)
- **Background:** blue flood `y 0–1180` with a pink under-strip and a violet overprint band. Pink halftone sun `disc(1040, 420, 520)` overprints the flood as violet dots.
- **Headline:** all knockout (paper). Kicker "ONLY ON BLOOM" Archivo `wdth` 125 38px at (72, 110). "EVERY BAG / GETS A / COUNTDOWN." Anton 250px at (64, 180), 3 lines, widest ≤ 1160px.
- **Phone:** 1020px centred at (150, 930), 0°, bottom bleed 130px, crossing the flood edge so its top third sits on blue. Pink halftone shadow at (+46, +42).
- **Decorations (4):** halftone sun · stamp on the flood (paper-coloured, normal blend) at (1030, 820) · registration mark at the bottom-left over paper · cut-paper arrow in the left margin at y 1700.
- **Must be true:** the phone bezel reads cleanly against both the blue flood and the paper, and the phone never carries misregistration itself.

### Slide 3: Feature ("FOUR POURS. ZERO MATH.")
- **Background:** paper. Pink halftone `disc(1236, 1640, 340)` bottom-right behind the phone. Blue `disc(−40, 120, 520, 1, .9)` top-left corner.
- **Phone:** 1050px at (62, −168), −2°, top bleed. Pink halftone shadow at (−44, +34). Visible 69.4%.
- **Spine word:** "BREW TIMER" Anton 200px, two plates, rotated 90° at left 1306, top 170 (reads top-to-bottom in `x 1126–1306`).
- **Headline:** "FOUR POURS." 248px at (64, 2044). Knockout "ZERO" 232px at (64, 2290), rotated +1.5°. "MATH." 248px at (566, 2300). Subhead at (72, 2610).
- **Decorations (5):** two halftone fields · cut-paper arrow (pink, rotated 180°) at the right edge, y 1146–1260, pointing at "Second Pour" · stamp "02" 210px at (1044, 2548), +10° · ink swatch bar at (72, 2762).
- **Must be true:** the right margin is clean paper behind the spine word, and no halftone dot sits under any headline glyph.

### Slide 4: Feature ("BIG NUMBER")
- **Background:** paper. A giant numeral ("128", "19", "8") in Anton 900–1100px, rendered as a **pink halftone** (text used as a `clipPath` over a 75° tint at 60%) with a blue outline plate (4px stroke, offset +10/+8). It sits at the left, partly behind the phone.
- **Headline:** top, 2 lines: "128 MG. / BED BY [10]." 250px at (64, 150).
- **Phone:** 1000px at (300, 900), +3°, bottom bleed. Blue halftone shadow at (−46, +40).
- **Decorations (4–5):** halftone numeral · ticket (vertical, left margin) or stamp · registration mark · arrow.
- **Must be true:** the halftone numeral is still legible as a number at 220px wide and never passes under headline letters.

### Slide 5: Proof / ecosystem ("LIVE ON YOUR HOME SCREEN")
- **Background:** paper. A blue halftone sweep from the bottom-left corner (`coverage = 1 − distance/1400`).
- **Headline:** "LIVE ON / YOUR [HOME] SCREEN." 240px at (64, 150). Subhead lists the surfaces.
- **Phone:** 1000px at (160, 900), 0°, showing the widgets or lock-screen screenshot.
- **Decorations (5–6):** 2–3 real widget or rating PNGs "stapled" as flyers (±6° rotation, staple and contact shadow; the images are untouched) · one yellow ticket with the rating ("4.9 · 12K RATINGS", only if real) · stamp · registration mark.
- **Must be true:** proof numbers are real, and every stapled card keeps its original colours (no multiply on UI images).

### Slide 6: Closer (lineup poster, no phone)
- **Background:** blue flood `y 0–1420` + pink strip at `y 1390–1434` + pink halftone `disc(1010, 560, 600, .8)` at 24px/75°. Paper below.
- **Knockout type:** "BLOOM PRESENTS" 40px `.3em` at (72, 110). "SIX ACTS. / ONE CUP." Anton 334px at (64, 190), widest 1138px. "LIVE ON YOUR PHONE — EVERY MORNING" 36px at (72, 850).
- **Flood accents:** stamp "03" 250px (paper-coloured) at (96, 1030), −10°. Ticket 580×220 at (620, 1060), +7°, "ADMIT ONE / DOORS 6AM · ALL AGES".
- **Lineup:** 3 centred rows, flex with a gap of 34px and a pink star between each pair. Row 1 Anton 200px at y 1540, rows 2–3 at 150px at y 1846 / 2096. Two plates each, with a 34px lowercase descriptor under every act.
- **Tear-off tabs:** 5px dashed blue line at y 2440, 8 tabs of 165px separated by 3px dashed lines. Each tab has "BLOOM" (Anton 54px) and "coffee app · scan a bag" (Archivo 700 25px), rotated −90°.
- **Must be true:** it reads as a real gig poster at thumbnail size, and every act maps to a real feature.

## Adapting to other app categories

| Category | Ink set | Motif swap | Copy angle |
|---|---|---|---|
| Music, DJ, gig listings | A | Halftone sun becomes halftone waveform bars. Ticket = "ADMIT ONE" | "EVERY SET. LIVE." |
| Podcasts | C | Stamp = episode number. Spine word "SIDE A / SIDE B" | "NEW EPISODE. EVERY TUESDAY." |
| Events, ticketing | A | 2 tickets allowed on the proof slide. Tear-off tabs = RSVP | "DOORS AT 8. YOU'RE IN." |
| Bookstores, libraries, cafés | B | Halftone book-spine stripes. Stamp = "DUE BACK" date | "READ THE ZINE FIRST." |
| Indie creative tools (design, print, music-making) | A or E | Swatch bar on every slide. Registration marks in 2 corners | "PRINT IT. LOUD." |
| Local community, markets, clubs | D | Pinned-flyer tear-off tabs on the closer. Arrow points to the map pin | "YOUR BLOCK. YOUR BOARD." |
| Food trucks, zines, makers | E | Ticket = order number. Halftone photo silhouette of the product | "FRESH ROAST. LOUD FLAVOR. EVERY WEEK." |

## Dark / inverted & localization notes

- **Inverted slide = flood slide.** Riso has no white ink, so "dark mode" is a full blue flood (or violet, with both plates at 100%). All type is knocked out to paper, and colour comes only from pink halftones overprinting as violet. Yellow and pink can never be text on the flood.
- **German / long words:** Anton's condensed width helps. Step down 8px at a time until the widest line is ≤ 1160px (floor 200px on phone slides). Then break compound words with a hyphen at a morpheme boundary. Knockout words over 8 letters drop to 0.9× size.
- **CJK:** use **Dela Gothic One** (JP) or **Noto Sans SC/TC 900** at 0.78× the Anton size, `line-height: 1.05`, no uppercase transform. Keep misregistration at 6/5px because dense glyphs muddy faster. Knockout blocks hold 2–4 characters.
- **RTL (Arabic/Hebrew):** use **Lalezar** or **Noto Kufi Arabic 900** (Arabic) and **Rubik 900** (Hebrew). Mirror the layout: headline flush right, phone offset left, and arrows point left. The pink plate offset becomes (−9, +7) so the ghost stays on the reading-trailing side. Spine words rotate −90°.
- **Numerals:** Anton lining figures work for stats. Use the Latin face for numerals inside CJK/RTL headlines.

## How to apply this style

1. **Fonts:** in `template/src/app/layout.tsx`, add `Anton` (400) and `Archivo` (`axes: ["wdth"]`) from `next/font/google` with `display: "block"`. Expose `--font-display` and `--font-ui` on `<body>`.
2. **Theme:** add a `risograph-zine` entry to `THEMES` in `template/src/lib/constants.ts` (bg `#F4F0E6`, bgAlt `#321871`, fg `#3255A4`, fgAlt `#F4F0E6`, accent `#C8006A`, muted `#5E4E7A`). Keep an `INKS` constant (`pink`, `blue`, `yellow`, overprints) for the real renderer.
3. **Filters:** render the 0×0 SVG with `#riso`, `#flood` and `#stamp` once, near the top of `slide-canvas.tsx`, so every slide can reference `url(#riso)`.
4. **Background:** for this theme, bypass `backgroundFor()` gradients. Render the paper hex, then the `.fibre` div, then the halftone fields (`Halftone` + `disc`), then the flood if the slide calls for one. Put the `.grain` div last.
5. **Headline:** render each line twice (pink plate offset +9/+7 and rotated .35°, then the blue key plate), both `mix-blend-mode: multiply` + `filter: url(#riso)`, sized by `cW/1320`. Wrap the chosen word in the `Knockout` component. Measure `scrollWidth` and step the size down 4px until the widest line is ≤ 88% of `cW`.
6. **Phone:** keep the `Phone` component. Before it, render the clipped halftone shadow (same rect, offset −44/+40) and add the contact `drop-shadow` pair to the wrapper. Rotate ≤ 3°.
7. **Decorations:** build `Ticket`, `Stamp`, `CutArrow`, `RegMark`, `SwatchBar` and `LineupStar` as absolutely positioned inline-SVG components. Expose them as movable elements and use the default positions from the per-slide breakdown.
8. **Contrast pass:** all text on paper is blue `#3255A4` or overprint. Knockout text is paper on the blue or violet block. Assert that no text uses pink or yellow as its colour. Screenshot once with text hidden and check that the glyph areas contain no halftone dots.
9. **Density pass:** count 4–7 decorations per slide, including ≥ 1 halftone field. Remove anything under the headline or subhead glyph boxes.
10. **Thumbnail test:** at 220px, the pink ghost and the knockout word must still read, and the dots must still read as dots (not as a pink blur). If the dots blur, raise the cell size to 24px.

## Style-specific QA checklist

- [ ] Are there only 2 inks (3 with yellow), with every other colour coming from multiply overlaps?
- [ ] Does every display line have a visible pink plate offset of 8–10px x and 6–8px y?
- [ ] Is there exactly one knockout word per headline (or a fully knocked-out flood headline)?
- [ ] Is all copy on paper blue `#3255A4` / violet, with no pink or yellow words anywhere?
- [ ] Do the halftone dots change size with tone, with the correct screen angle per ink (pink 75°, blue 15°)?
- [ ] Does each ink element carry the `#riso` speckle (visible pinholes at 100% zoom)?
- [ ] Is the paper `#F4F0E6` with fibre, and no `#FFFFFF` outside the phone?
- [ ] Is the phone tilt ≤ 3° with visible height 68–72%, and the screenshot untouched (no multiply, no filter)?
- [ ] Does each phone have both a halftone offset shadow and a tinted contact shadow?
- [ ] Is every ticket or staple physical (contact shadow) while everything printed stays flat?
- [ ] Is there no halftone dot under any headline or subhead glyph? (Verify with a text-hidden render.)
- [ ] Does the knockout text measure ≥ 4.5:1 against the block after 5px median filtering?
- [ ] Are there 4–7 decorations per slide, with ≥ 1 halftone field?

## Common failure modes

1. **Pink headline text:** it looks on-brand but measures 2.7:1. *Fix:* pink only as the misregistered plate behind the blue key.
2. **Opacity "halftone":** uniform dots faded with a gradient mask, which looks like a screen-door. *Fix:* generate dots whose radius follows coverage (`Halftone` component).
3. **Mush from over-misregistration:** offsets of 15–25px make letters unreadable at thumbnail size. *Fix:* 8–10px x and 6–8px y, with a rotation ≤ 0.8°.
4. **Blotchy floods:** the `#riso` coverage noise on large floods creates cloudy patches that drop knockout text below 4.5:1. *Fix:* use `#flood` (coverage .94–1.0) for floods and knockout blocks.
5. **Tinting the screenshot:** a multiply or duotone on the phone screen makes the real UI look broken. *Fix:* the phone renders normally above all ink layers. Only the area around the phone gets ink.
6. **Grey paper:** stacked fibre, fleck and grain layers push `#F4F0E6` down to ~`#D5D0C6`. *Fix:* check a paper pixel stays ≥ (236, 231, 220) and cap fibre darkening at 14%.
7. **Clip-art props:** vector coffee cups, vinyl records or microphones read as stock. *Fix:* use print artefacts (tickets, stamps, arrows, swatches, registration marks) or a halftone photo silhouette.
8. **Swiss-grid drift:** adding grid lines, mono labels and hairline rules turns it into style 08. *Fix:* no hairline grids. Structure comes from ink blocks, tickets and tear-off tabs.
9. **Candy-pop drift:** flat saturated slide backgrounds, hard black offset shadows and chat bubbles turn it into style 11. *Fix:* the background is always paper (or a blue flood), shadows are halftone dots, and there is no ink-black anywhere.

## What this style is NOT

- Not **Paper Sticker (03):** no cork, no die-cut stickers with white outlines, no marker handwriting. Everything is printed ink, apart from one ticket.
- Not **Candy Pop Social (11):** no flat saturated slide colours, no pill words, no chat bubbles, no black hard shadows.
- Not **Swiss Grid Bold (08):** no visible grid, no mono index labels, no hairlines, no orange. Type is misregistered and textured, not crisp.
- Not **Magazine Cover (10):** no serif, no italic emphasis, no masthead.
- Not a duotone photo filter: the app UI stays full colour and untouched.
- Not tilted-phone chaos: phones stay upright (≤ 3°), and the print carries the energy.
- Not gradients, glass, glow, 3D, chrome or neon. Riso has none of these.
- Not a 4-colour print: two inks, three at most.
