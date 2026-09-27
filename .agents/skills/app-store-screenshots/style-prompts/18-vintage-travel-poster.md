---
name: vintage-travel-poster
description: Flat, hard-edged silkscreen landscapes inside a cream poster border. Banded skies, a big sun or moon disc, layered mountain ridges that get lighter and hazier toward the horizon, and pine silhouettes. The upright phone rises from behind a ridge like a monolith. Condensed all-caps "destination" titles with a script lead-in, plus postage-stamp and ticket details. Inspired by WPA National Park posters and Fifty-Nine Parks.
inspiration: WPA National Park posters (1930s), Fifty-Nine Parks print series, TWA / SNCF / Swiss tourism lithographs, vintage luggage labels and postage stamps
feel: adventurous, crafted, place-like, "this app is a destination worth the trip"
---

# Vintage Travel Poster

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md). The universal quality rules apply to this style. This file only adds to them.

## Hard quality rules (this style)

- **Poster frame on every slide:** a cream `#F1E4C8` border that is **52px** on the top, left and right and **150px** on the bottom (the caption band). The art sits inside a **4px ink `#1C1A17` keyline** at `x 52–1268, y 52–2718`. A second **2px rule at 78% ink** sits **24px** in from the canvas edge. Leave out either rule and it stops looking like a print.
- **The sky is built from 4–6 hard-edged horizontal bands**, each **230–650px** tall. Never use a smooth gradient in the sky, and never blur a band edge. One `linear-gradient` in the sky is an automatic fail.
- **Limited ink palette:** the 7 base inks plus the listed overprint tints. Nothing else. That means no pure white, no pure black and no neon. Each slide uses **at most 7 distinct fills** in its landscape, not counting the phone UI.
- **Atmospheric perspective is required.** Each ridge layer is lighter, lower in contrast and closer to the sky colour than the layer in front of it. You need at least **3 ridge layers** on phone slides and **5–7 layers** on the no-phone closer. The nearest layer is always the darkest: forest `#2E4A3A` or pine `#1B2A22`.
- **Ridges are shaped profiles, not zigzags.** Build them with midpoint displacement between **5–9 hand-placed key vertices** (roughness 0.08–0.16, decaying ×0.52 per pass, 4 passes). Every peak whose slope falls to the right gets a **shadow face 8–15% darker**, cut by a diagonal spur line (light always comes from the upper-left). If a ridge has evenly spaced teeth, that is a fail.
- **Phone:** the default iPhone bezel, **upright at exactly 0°**, **960–1040px wide**. That gives a full phone height of **68–74%** of the canvas. It rises from **behind** a ridge or pine line. That ridge may hide the bottom **4–12%** of the phone height, measured at the phone's centreline. The **visible** phone must be **≥ 64%** of the canvas height (≥ 1835px).
- **Title lockup:** a Yellowtail script lead-in at **110–130px** sits over a Bebas Neue all-caps "destination" at **230–400px**, with tracking **+0.04 to +0.06em** and line-height **0.84–0.86**. The caps word is never below **220px**, and no caps line is wider than **1096px** (the art width minus 60px on each side).
- **Contrast:** script mustard `#E8B04A` sits only on plum, ink or forest (5.0–8.9:1). **Never put mustard on teal (3.9:1) or on cream (1.6:1).** The caps are cream on plum, ink, teal or forest (≥ 6.0:1). The title band gets **dark overprint rays** (ink at 16%), never light ones. Light rays under the title dropped the script to 4.1:1 in testing.
- **Print texture is required:** the SVG `print` filter on every landscape layer (see below), with edge displacement **scale 4–6**, ink mottle amplitude **0.20–0.26** and knocked-out paper specks. Add the shared `.grain` overlay at **0.22–0.30**. **Never** put the multiply mottle over the phone screen.
- **Decoration density:** editorial, **2–4 per slide** (_QUALITY_BAR §9). The sun or moon disc and the pine line are part of the landscape and don't count. Stamps, postmarks, bird flocks, tickets and luggage labels do count.

## Vibe summary

Every slide is a 1930s silkscreen travel poster that happens to have your app standing in it. The sky comes down in flat bands of plum, rust, orange and mustard. A huge cream sun rises behind the phone, which stands like a granite monolith. Three to seven mountain ridges step back into the haze, each one paler than the one in front, until the farthest range almost melts into the sky. A dark pine forest cuts across the phone's base, so the phone reads as being in the landscape rather than pasted on top of it. The title is set like a place name: a script lead-in ("Every bag, at its") over a giant condensed destination word ("PEAK"). The voice is evocative, adventurous and a little romantic. The app is a place you visit every morning.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1C1A17` | Keylines, stamp text, night sky top band, ticket text |
| `--cream` | `#F1E4C8` | Poster border, sun/moon disc, caps titles on dark bands |
| `--plum` | `#4B2E4F` | Dusk title band (the default title ground), birds |
| `--orange` | `#D9622B` | Sky band, stamp scenes. **Never text on cream** (2.9:1) |
| `--mustard` | `#E8B04A` | Sky band, script lead-in on plum/ink/forest, ◆ separators |
| `--teal` | `#1F5C5B` | Near ridges, daylight top band, lake |
| `--forest` | `#2E4A3A` | Front ridge + pine line (in front of the phone) |
| `--rose` *(overprint plum+orange)* | `#8E3F3C` | Sky band directly under the plum title band |
| `--pale` *(overprint mustard+cream)* | `#F2CF8C` | Horizon band, lake glitter, sub-lines on ink |
| `--rust` *(text-safe orange)* | `#A8401C` | Numerals and accents on cream (4.9:1 on `#F1E4C8`, 5.2:1 on `#F6ECD6`) |
| `--haze` | `#9DB7A2` / shade `#86A48F` | Farthest daytime ridge |
| `--haze-2` | `#5F8D80` / shade `#4B776C` | Middle ridge |
| `--teal-shade` | `#174746` | Teal ridge shadow faces and far pine line |
| `--pine` | `#1B2A22` | Nearest foreground pines and the shoreline strip |
| `--snow` | `#E7E0CB` / shade `#C4CDBE` | Snow caps on 1–2 edge peaks |
| `--night` bands | `#1C1A17 → #23303A → #35304A → #4B2E4F → #6E3D4E → #8E4B4C` | Night / sleep slides |
| `--paper` | `#F6ECD6` | Stamp and ticket stock (a touch lighter than the border) |

Contrast table (measured): cream/plum 9.3 · mustard/plum 6.0 · mustard/ink 8.9 · cream/teal 6.1 · pale/teal 5.1 · cream/forest 7.7 · ink/cream 13.8 · rust/cream 4.9 · **mustard/teal 3.9 ✗ · cream/orange 2.9 ✗ · mustard/cream 1.6 ✗**.

## Typography

- **Display (destination word):** **Bebas Neue** 400, all caps. Sizes at 1320 wide: **360–400px** for one word of 4–5 letters, **280–320px** for two stacked lines, **230–250px** for one long word (9–11 letters). Tracking `0.04–0.06em`, line-height `0.84–0.86`. To optically centre it, add `margin-right:-<tracking>em`. Colour: cream on dark bands, ink on the pale or cream band.
- **Script lead-in:** **Yellowtail** 400, sentence case, **110–130px**, line-height 1, `letter-spacing: .005em`. Colour: mustard on plum/ink/forest, pale `#F2CF8C` on teal. It is always ONE line and always sits **above** the caps.
- **Sub-line / labels:** **Zilla Slab** 700, uppercase, **30–34px**, `letter-spacing: .22em`, cream on dark. Separate phrases with a mustard `◆` (U+25C6).
- **Body on paper (ticket, captions):** **Zilla Slab** italic 600 at **32–36px**, colour `#3A332B` (10.6:1 on paper).
- **Caption band:** the app name in Bebas Neue **66px** with `letter-spacing: .24em`, ink, left-aligned. The meta line ("SERIES Nº 01 ◆ EST. 2026") is Zilla Slab 700 **25px** with `.2em` tracking in `#3A332B`, right-aligned, and uses a rust dot separator.
- **Commercial alternates:** Futura Condensed ExtraBold / Knockout 48 / Trade Gothic Bold Condensed No. 20 (display). Bello Script / Mission Script / Lust Script (script). Clarendon / Archer / Sentinel (slab).
- **Google Fonts link:**
  `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Yellowtail&family=Zilla+Slab:ital,wght@0,500;0,700;1,500;1,600&display=block`

```ts
// template/src/app/layout.tsx
import { Bebas_Neue, Yellowtail, Zilla_Slab } from "next/font/google";
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-poster", display: "block" });
const script = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "block" });
const slab = Zilla_Slab({ weight: ["500", "600", "700"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-slab", display: "block" });
// <body className={`${bebas.variable} ${script.variable} ${slab.variable}`}>
```

## Headline emphasis (signature)

The emphasis is structural, not colour or italics. The **destination word** carries the claim. It is the one word or short phrase in caps, and the script line only leads into it. Read it like a poster: "Visit… **SWITZERLAND**".

- Script lead-in = the set-up, 12–22 characters ("Every bag, at its", "Know when you'll be", "Every morning, a").
- Caps destination = the payoff, 1–2 words, ≤ 11 characters per line ("PEAK", "SLEEP-READY", "NEW / HORIZON").
- The script's descenders (y, g) may reach down to the caps' cap line. They may overlap a caps glyph by **≤ 12px** and never touch a counter. Leave a 10–30px gap between the script baseline and the cap top.
- The optional sub-line (Zilla caps with `◆`) sits 40–70px under the caps and states the mechanism: "ROAST DATE IN ◆ PEAK WINDOW OUT".

```html
<div class="lockup" style="position:absolute;left:0;width:1320px;top:108px;text-align:center">
  <div style="font:400 124px/1 var(--font-script);color:#E8B04A">Every bag, at its</div>
  <div style="font:400 390px/.86 var(--font-poster);letter-spacing:.06em;margin-right:-.06em;color:#F1E4C8;margin-top:14px">PEAK</div>
  <div style="font:700 33px/1 var(--font-slab);letter-spacing:.22em;text-transform:uppercase;color:#F1E4C8;margin-top:52px">
    Roast date in <span style="color:#E8B04A">&#9670;</span> Peak window out</div>
</div>
```

## Phone / device frame treatment

- Always use the template's **default iPhone bezel** (`public/mockup.png` through the `Phone` component). Don't reshape it, give it a paper border or cut it out.
- **Upright at 0°** on every slide. The monolith metaphor falls apart if the phone tilts.
- **Width 960–1040px.** Centred (`left = 660 − w/2`) on the hero. Offset toward one side (`left 92–140`) on feature slides, so a 150–250px strip of landscape shows on the other side.
- **Z-order:** sky, sun and back ridges → phone → front ridge + pines (and a shoreline strip) → text and stamps. The front layer must cross the phone base. A phone floating above a finished landscape looks pasted in.
- **Shadow (tinted plum, two-stack):** `filter: drop-shadow(0 34px 44px rgba(40,22,30,.34)) drop-shadow(0 6px 10px rgba(28,26,23,.30));`
- **Lake reflection (optional, one slide per deck):** mirror the phone about its bottom edge, show only 150–260px of it, and apply 30% opacity and stripe masking:

```html
<div style="position:absolute;left:92px;top:2556px;width:980px;height:162px;overflow:hidden;opacity:.30;
  -webkit-mask-image:repeating-linear-gradient(180deg,#000 0 13px,transparent 13px 19px),linear-gradient(#000,transparent);
  -webkit-mask-composite:source-in">
  <div class="phone" style="left:0;top:-1996px;width:980px;transform:scaleY(-1);transform-origin:50% 100%;filter:none">…same screenshot…</div>
</div>
```

## Background treatment

**1. Sky bands.** These are plain `<rect>`s with hard edges. Choose one set per slide:

| Set | Bands top → bottom (y where each starts) |
|---|---|
| Dawn (hero default) | plum 0 · rose 640 · orange 930 · mustard 1230 · pale 1560 |
| Dusk closer | plum 0 · rose 780 · orange 1010 · mustard 1190 · pale 1390 |
| Night | ink 0 · `#23303A` 620 · `#35304A` 1000 · plum 1380 · `#6E3D4E` 1760 · `#8E4B4C` 2080 |
| Daylight | teal 0 · `#3F7C74` 700 · haze `#9DB7A2` 1050 · pale 1400 · cream 1700 |

Always end the title band **at least 20px below** the last title glyph. On Dawn and Dusk it must end above the sun's top edge.

**2. Sun or moon disc.** A flat cream circle. Size it at **r 620–680** behind a phone (centre x 660, y 1250–1330, so the top 60–120px of the disc shows above the phone and cream slivers show at the sides). On the closer, use **r 320–360** sitting on the horizon. Add one halo ring at `r + 70–80`, cream at 16%. The moon is **r 130–150** with 3 crater dots in `#E3D5B6` (r 12–30) and 3 halo rings of pale at 7/10/14%, and it tucks **behind** the phone's upper corner.

**3. Rays.** Alternating wedges from the disc centre: 40–44 wedges, radius 2600. Split them with clip paths. The part **inside the title band** is ink at 16%, so it darkens the band and raises text contrast. The part **below** it is cream at 10–11%.

```js
const rays = (cx, cy, n = 44, R = 2600, phase = 2) => Array.from({ length: n }, (_, i) => i).filter(i => i % 2 === 0)
  .map(i => { const a0 = (phase + i * 360 / n) * Math.PI / 180, a1 = (phase + (i + 1) * 360 / n) * Math.PI / 180;
    return `M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} L${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z`; }).join(" ");
```

**4. Ridges.** Seeded midpoint displacement between hand-placed key vertices, then shadow faces:

```js
function ridge(key, rough = 0.14, seed = 1, iters = 4) {           // key: [[x,y],…] 5–9 vertices, x from −30 to 1350
  let r = rough, pts = key, rnd = mulberry32(seed);
  for (let k = 0; k < iters; k++, r *= 0.52) pts = pts.flatMap((p, i) => {
    if (i === pts.length - 1) return [p]; const q = pts[i + 1], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return [p, [(p[0] + q[0]) / 2 + (rnd() * .24 - .12) * (q[0] - p[0]), (p[1] + q[1]) / 2 + (rnd() * 2 - 1) * L * r]]; });
  return pts;                                                     // close it to a base y (2300–2800) as a <path>
}
// Shadow face for each key peak P (lower y than both neighbours), next valley V:
// polygon = profile(P→V) + (V.x, base) + (P.x + .42·(V.x−P.x), base) + diagonal spur up to P
// (spur end y = V.y + .9·(V.y−P.y), 6 points, ±9px jitter). Fill = the layer colour 8–15% darker.
```

Use these layer recipes for the Dawn hero. Colours run lit / shade, and y is the peak range at the slide edges:

| Layer | Key y range | Lit / shade | Extras |
|---|---|---|---|
| Far | 1420–1640 | `#9DB7A2` / `#86A48F` | none; the palest layer, closest to the sky |
| Mid | 1690–1900 | `#5F8D80` / `#4B776C` | snow caps on the 2 edge peaks (depth .38) |
| Near | 2010–2240 | teal / `#174746` | a pine line in `#174746`, 60–120px tall, only at the slide edges |
| Front (over the phone) | 2330 edges → **2610 centre** (valley shape) | forest | a pine line of 80–190px trees at a 32px step |
| Foreground | 2560–2670 | pine `#1B2A22` | 150–300px pines in the two outer thirds only |

**5. Pines.** Seven drooping tiers, width = 0.34 × height, and a trunk 7% of the width. Place them along the ridge profile with a random step of 0.55–1.15× the base step, and sink each one 12–25% of its height into the ridge.

```js
function pine(x, yb, h, w = h * .34) { const top = yb - h, body = h * .9, R = [];
  for (let i = 0; i < 7; i++) { const t = (i + 1) / 7, yy = top + body * t, ww = w / 2 * (.18 + .82 * t);
    R.push([x + ww, yy + h * .015]); if (i < 6) R.push([x + ww * .42, yy - body / 7 * .28]); }
  const tw = Math.max(w * .07, 2.5), L = [...R].reverse().map(([px, py]) => [2 * x - px, py]);
  return "M" + [[x, top], ...R, [x + tw, top + body], [x + tw, yb], [x - tw, yb], [x - tw, top + body], ...L].join(" L") + " Z"; }
```

**6. Print filter.** Apply this to a `<g>` that wraps every landscape layer. It adds rough ink edges, uneven laydown and paper specks. It must never touch the phone.

```html
<filter id="print" filterUnits="userSpaceOnUse" x="0" y="0" width="1320" height="2868" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency=".012 .04" numOctaves="3" seed="9" result="m"/>
  <feColorMatrix in="m" values=".24 0 0 0 .9  .24 0 0 0 .9  .24 0 0 0 .9  0 0 0 0 1" result="mg"/>
  <feBlend in="d" in2="mg" mode="multiply" result="mul"/>
  <feComposite in="mul" in2="d" operator="in" result="inked"/>
  <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="4" result="s"/>
  <feColorMatrix in="s" values="0 0 0 0 .95  0 0 0 0 .89  0 0 0 0 .78  8 0 0 0 -6.1" result="sp"/>
  <feComposite in="sp" in2="d" operator="in" result="sp2"/>
  <feMerge><feMergeNode in="inked"/><feMergeNode in="sp2"/></feMerge>
</filter>
```

Put the shared `.grain` overlay (fractal noise, `mix-blend-mode: overlay`) at **0.26** as the last child of the slide. It adds tooth to the cream border too. Mottle stronger than `.24/.9` turns into camouflage blotches, and that happened in testing.

## Decorative accents

Choose **2–4 per slide**. Every accent is flat ink with no gradients, and every accent that sits on paper gets a **hard offset shadow**, not a blur.

- **Postage stamp** (240×300, shown at scale .72–1.0, rotated **−8° to +8°**). It is paper `#F6ECD6` with perforations: circles r 9 every 24px, cut with an SVG mask. Inside is a 188×200 window holding a mini three-band sky, a sun, two ridges and two birds, with a 3px ink border. Below the window: the app name in Bebas 44px in ink, a value ("26¢", "05") in Bebas 44px in rust, and Zilla 700 15px with 3.2 tracking ("FRESH ROAST POST"). Shadow: the same perforated shape offset **10px, 12px** at `rgba(28,26,23,.30)`. Place it in the **stamp pocket** beside a short caps word, or overlapping a ticket corner.

```html
<mask id="perf"><rect width="240" height="300" fill="#fff"/><g fill="#000"><!-- circle r=9 at x=12+24i on y=0 and y=300, at y=12+24i on x=0 and x=240 --></g></mask>
<g mask="url(#perf)"><rect x="10" y="12" width="240" height="300" fill="rgba(28,26,23,.30)"/></g>   <!-- offset print shadow -->
<g mask="url(#perf)"><rect width="240" height="300" fill="#F6ECD6"/> …window, scene, 3px ink frame, text… </g>
```

- **Postmark** (230px ring plus 5 wave lines 190px long): an outer ring 5px and an inner ring 2.5px in ink at 78%. The ring text sits on a `textPath` with `textLength` set to the circumference ("BLOOM MORNING POST · 2026 ·"). The date goes in the centre in Bebas. Pass it through an alpha-threshold turbulence so it prints patchy. Use it only on paper (stamp or ticket), never over phone UI.
- **Bird flock:** 3–5 gull silhouettes 15–34px wide, in plum on dawn and dusk skies, placed in a loose diagonal. The path is two quadratic wings with thickness: `M x−s,y−.15s Q x−.55s,y−.62s x−.05s,y+.02s Q x+.5s,y−.58s x+s,y−.22s Q x+.5s,y−.36s x,y+.2s Q x−.5s,y−.36s x−s,y−.15s Z`. Keep them in the sky between the title band and the ridges, or over the visible sun cap.
- **Itinerary ticket** (closer only): 1104×850 paper, rotated **−1.2°**, with the shadow `box-shadow: 16px 18px 0 rgba(28,26,23,.34)`. It has a double frame: a 3px ink line at an 18px inset and a 1.5px line at a 28px inset. The header is Zilla caps 28px with the app icon at 88px (radius 20, 3px ink ring), then a 4px ink rule. It lists 5 rows, each with a rust Bebas 60px numeral, a Bebas 62px name and a Zilla italic 34px line, separated by 2px dashed rules at 35% ink.
- **Stars** (night only): 60–80 cream dots, r 2–4, at 50–95% opacity, plus 3–4 four-point sparkles in pale 16–22px. Keep them out of the title box.
- **Lake glitter** (night or dusk): 7–9 stacked pale bars 6–8px tall, narrowing downward from 300px to 90px, alternately offset by 14–18px.

Polish gates: ridges pass gates 1 (lit and shade), 3 (print filter + grain), 4 (faceted volume) and 5 (pines and snow caps). Stamps and tickets pass 1, 2 (hard offset shadow), 3 and 5.

## Layout grid & safe zones

All rectangles are in canvas px (x1, y1 – x2, y2).

- **Canvas frame:** border 0–52 / 1268–1320 horizontally, 0–52 top, and the caption band **2718–2844**. Nothing crosses the keyline except the phone reflection's clipping, which is also inside it.
- **Text margin inside the art:** 60px, which puts live text at **x 112–1208** (1096px wide).
- **Title box:** **112, 90 – 1208, 640** on phone slides and **112, 90 – 1208, 780** on the closer. Centred on the hero and closer, left-aligned at x 104–112 on feature slides.
- **Phone box:** hero `160, 730 – 1160, 2767`. Features `92, 540 – 1072, 2556` or its mirror `248, 540 – 1228, 2556`. The phone top never rises above y 540, and the title box never reaches into it.
- **Stamp pocket:** `1040, 280 – 1250, 540` (beside a caps word ≤ 5 letters), or over the ticket's top-right corner. Keep a gap of 30px or more from any caps glyph.
- **Sky decoration band:** between the title box bottom and the first ridge (e.g. `60, 640 – 1260, 1500`). Birds go only here or over the visible sun cap.
- **Foreground band:** `52, 2330 – 1268, 2718`. This holds pines and fields, and stamps are allowed only on the closer.
- **Never decorate:** over phone UI, across the title box, or inside the caption band (text only).

## Cross-screen moment

- **May cross the seam:** the sky bands, which must share the **same y values** on adjacent slides; one ridge profile, continued by sharing its key vertices across the seam; the sun disc, split about 30/70; a bird flock, with 10–30% on the neighbour. Use one crossing in a 5–6 slide deck, and hero → slide 2 via the bands and near ridge works best.
- **May not cross:** the poster border (every export keeps all 4 sides of its frame), the title lockup, the stamp, the ticket, or the phone.
- Each crop is a finished poster in its own frame. The crossing only reads when the slides are seen side by side in the store row.

## Copy tone

- **Voice:** evocative, adventurous, place-like. The app is a destination, a route or a view. Use second person sparingly and present tense.
- **Vocabulary:** peak, summit, horizon, trail, route, pass, valley, first light, high country, every morning, the way there, journey, destination, itinerary, stop, arrive.
- **Structure:** a script lead-in (sentence case, ends mid-thought, no final period) plus a CAPS destination (no punctuation, and hyphens are allowed). Sub-lines are CAPS phrases joined with `◆`.
- **Punctuation:** commas inside the script only. No exclamation marks, no question marks and no emoji. Use digits only for real numbers ("26¢", "EST. 2026").
- **Banned words:** "ultimate", "revolutionary", "game-changing", "boost", "hack", "crush", "seamless", "powerful", "next-level", "unlock", "supercharge", "#1", "best-in-class", "AI-powered" (as a headline), "simply".
- **Example headlines (lead-in / DESTINATION):**
  - Coffee: "Every bag, at its / PEAK" · "Every morning, a / NEW HORIZON" · "Know when you'll be / SLEEP-READY"
  - Hiking: "Every trail leads / SOMEWHERE NEW" · "Offline maps for the / BACKCOUNTRY"
  - Weather: "Know the sky before / FIRST LIGHT" · "Rain or shine, / READY"
  - Astronomy: "Tonight's sky, / MAPPED" · "Find every star from / YOUR BACKYARD"
  - Road trips / maps: "The long way, / PLANNED" · "Every stop on / ONE ROUTE"
  - Travel booking: "Your next escape, / BOOKED"
  - Language learning: "Ten minutes a day to / FLUENT"
  - Running: "Every mile, a / NEW VIEW"

## Per-slide breakdown (mandatory)

### Slide 1 — Hero (dawn monolith, "Every bag, at its PEAK")
- **Background:** Dawn bands. A cream sun r 640 at (660, 1290) with a halo ring r 710. Rays are ink 16% in the title band and cream 10% below it.
- **Headline:** script "Every bag, at its" at 124px, mustard, box top 108, centred. "PEAK" at 390px, cream, tracking .06em, top 244. The sub-line "ROAST DATE IN ◆ PEAK WINDOW OUT" is 33px cream, top 584.
- **Phone:** 1000px wide at left 160, top 730, 0°. The home screen. The front forest valley is 2610 at centre and 2330 at the edges.
- **Decorations (3):** a stamp at left 1066, top 296, scale .72, rotate 8°; 5 birds at (862–978, 664–700) over the sun cap and (1214–1240, 860–912); snow caps on the edge peaks.
- **Must be true:** the sun reads as a disc behind the phone at thumbnail size (cap above it, slivers beside it), and "PEAK" is the largest thing on the slide.

### Slide 2 — Differentiator (daylight valley, "Know the day it / TASTES BEST")
- **Background:** Daylight bands with no sun. Put a flat cream cloud bank (2 flat cream lozenges 420×60, radius 30) at y 760–900. Use 4 ridge layers with a lake band from 2380–2560 holding mirrored ridge silhouettes. This is the style's cross-screen partner to the hero: share the near ridge vertices at the seam.
- **Headline:** script in **pale `#F2CF8C`** (mustard fails on teal), 118px, left 112, top 104. Caps "TASTES BEST" at 250px in cream, top 226, width ≤ 1096.
- **Phone:** 980px at left 248, top 560, 0°. The coffee-detail or freshness screen. The shoreline pine strip crosses the phone base at 2536.
- **Decorations (2):** a bird flock of 4 in ink at 80% (x 120–240, y 700–820), and a luggage-label lozenge (300×120, radius 60, paper, 3px ink frame, "ROASTED 12 SEP") at left 70, top 2200, rotated −6°.
- **Must be true:** the daylight palette still reads as the same print run as the hero (same frame, same fonts, same pines).

### Slide 3 — Feature (golden-hour canyon, "Guided, pour by pour, / RIGHT ON TIME")
- **Background:** Dusk bands shifted warmer: rose 0, orange 560, mustard 980, pale 1400. Flat-topped mesa ridges (key vertices with plateaus) in orange `#D9622B` / rust `#A8401C` shade and plum distance. No pines here; a foreground of rust-shaded rock bands replaces them.
- **Headline:** the title band here is **rose** `#8E3F3C`. The script is cream at 116px (5.7:1) and the caps "RIGHT ON TIME" at 240px in cream, left 112, top 100 / 222.
- **Phone:** 1000px at left 92, top 600. The timer screen. A mesa foreground crosses the base at 2560.
- **Decorations (2):** a sun r 170 low on the right, half behind the phone (1180, 1500), and one postmark (230px) at left 1030, top 2320 on a paper stamp.
- **Must be true:** there are no pines and it's warm, yet the frame, lockup and banding still make it the same series.

### Slide 4 — Feature (night lake, "Know when you'll be / SLEEP-READY")
- **Background:** Night bands. Stars (70, none inside the title box). A moon r 140 at (1150, 800), partly behind the phone. Three ridges in `#7A4A5E` / `#3E3A55` / `#174746`. A lake `#2B2A40` from 2546 down, with mirrored near-ridge silhouettes and ripple bars (4px, pale at 26–32%).
- **Headline:** the script "Know when you'll be" is mustard at 118px, left 112, top 104. The caps "SLEEP-READY" are 236px cream, left 104, top 226. The sub-line "CAFFEINE IN ◆ BEDTIME OUT" is 31px pale, top 470.
- **Phone:** 980px at left 92, top 560, 0°. The caffeine screen. A shoreline pine strip at 2534–2560, pines 110–260px beside the base, and a 30% striped reflection underneath.
- **Decorations (3):** the moon with halo rings, a 4-sparkle star cluster, and lake glitter (9 bars under the moon).
- **Must be true:** the sleep-ready card in the phone stays visible above the shoreline, and the reflection starts exactly at the phone's bottom edge.

### Slide 5 — Proof / ecosystem (rolling fields, "Your shelf, on / EVERY SCREEN")
- **Background:** Dawn bands with a sun r 300 at the upper right (1060, 980). The foreground is **rolling field stripes**: 6 alternating mustard / orange / pale bands shaped by gentle ridge profiles (roughness .04) from 1900–2718, plus a forest windbreak row of 60–90px pines along one field edge.
- **Headline:** script mustard 120px and caps "EVERY SCREEN" 250px in cream on the plum band, centred.
- **Phone:** 1000px centred, top 700, showing the home-screen widgets screenshot. Beside it at bottom-left, add 2 real widget PNGs (lock-screen rectangular, home medium) as paper-framed "luggage labels" (8px paper border, 3px ink keyline, 12px 14px hard offset shadow, rotated −5° and +4°), each 300–420px wide.
- **Decorations (3):** the 2 widget labels and one stamp. Use proof only if it is real, e.g. "4.8 ★ IN 12 COUNTRIES" on a stamp; never invent ratings.
- **Must be true:** the widgets are real UI crops and stay ≥ 300px wide.

### Slide 6 — Closer (dusk itinerary, "Every morning, a / NEW HORIZON")
- **Background:** Dusk bands. A sun r 340 on the horizon at (660, 1560) with a halo ring at r 420. **Five** ridge layers: pale sand `#E9C790`, haze, haze-2, teal, forest. A teal lake band at 1960–2160 with 7 glitter bars, then forest and pine foreground lines. There is no phone.
- **Headline:** script mustard 128px at top 110. Caps "NEW / HORIZON" at 300px, cream, line-height .84, top 262, centred. The rose band starts at 780, below the last glyph.
- **Ticket:** left 108, top 1800, 1104×850, −1.2°. It lists 5 stops: Shelf, Timer, Recipes, Caffeine, Journal. Put a stamp at left 1000, top 1650, rotated 8°, overlapping the ticket's corner.
- **Decorations (3):** the ticket, the stamp, and 6 birds.
- **Must be true:** all 5 rows sit inside the ticket's inner frame with ≥ 24px to spare, and the landscape shows ≥ 5 clearly separated layers.

## Adapting to other app categories

| Category | Sky set / accent swap | Landscape motif | Copy angle |
|---|---|---|---|
| Hiking / outdoors | Dawn; accent stays mustard | Alpine ridges, snow caps, a switchback trail as a 10px cream dashed path | "Every trail leads / SOMEWHERE NEW" |
| Weather | Daylight + one storm slide (ink/teal bands, 6px pale rain slashes at 20°) | Cloud lozenges, a rainbow drawn as 4 flat concentric arcs | "Know the sky before / FIRST LIGHT" |
| Astronomy | Night only; the accent becomes pale `#F2CF8C` | Observatory dome silhouette, constellations as 2px cream lines between stars | "Tonight's sky, / MAPPED" |
| Maps / road trips | Dusk; the accent becomes orange roads on ridges | A winding road (cream, 26px with a mustard centre dash) receding to the horizon | "The long way, / PLANNED" |
| Travel booking | Dawn; add a second stamp | Coastline cliffs, sea bands, a lighthouse with a two-tone tower | "Your next escape, / BOOKED" |
| Fitness / running | Dawn with a big sun | Rolling field stripes and a single runner's road | "Every mile, a / NEW VIEW" |
| Sleep / meditation | Night + Dusk | A lake, moon and reflection. No birds | "Drift off by / MOONRISE" |
| Food / recipes | Dusk; accent rust | Terraced hills (vineyard rows as stripes), a farmhouse silhouette | "Every recipe, a / DAY TRIP" |

## Dark / inverted & localization notes

- **Inverted slide:** the Night set is the dark variant (ink top band, cream caps, mustard script). The **light** variant is Daylight, where the script turns pale and the caps stay cream on the teal band. **Never** set ink caps on the pale or cream bands in the title box, because the title box must sit on one of the three darkest bands. Use at most 2 night slides per deck.
- **Long German / French words:** first cut the caps size in 10px steps down to 220px. If the word still exceeds 1096px, split it at a compound boundary with a hyphen onto two caps lines ("SCHLAF- / BEREIT"). Never condense with `scaleX`. The script line may wrap to 2 lines at ≤ 110px.
- **Cyrillic / Greek:** Bebas Neue lacks them. Use **Oswald 600** in caps at 0.9× size with tracking `.03em`, **Marck Script** for the lead-in, and Zilla Slab stays.
- **CJK:** use **Noto Sans JP / SC / KR 900** for the destination at **0.7×** the Latin size with 0 tracking, and no caps transform. Replace the script lead-in with **Zen Kurenaido** / **Ma Shan Zheng** at 96–110px. Keep it to 6–8 characters per line.
- **RTL (Arabic / Hebrew):** use **Lalezar** (Arabic) or **Secular One** (Hebrew) for the destination and **Aref Ruqaa** for the lead-in. Mirror the layout: left-aligned blocks become right-aligned, the stamp pocket moves to the top-left, and a feature phone offset flips. Keep light from the upper-left anyway, because the landscape is a picture, not text.

## Style-specific QA checklist

Every answer must be **yes**:

1. Does every slide show the 52/52/52/150 cream frame, the 4px ink keyline and the 2px outer rule?
2. Is the sky made only of hard-edged bands, with no CSS gradient anywhere in the art?
3. Are there ≥ 3 ridge layers (≥ 5 on the closer), each lighter and hazier than the one in front?
4. Does every peak have a darker right-hand shadow face with a diagonal (not vertical) spur?
5. Does a front ridge or pine line cross the phone base, with the phone behind it?
6. Is the phone at exactly 0°, 960–1040px wide, with visible height ≥ 64% of the canvas?
7. Does the title follow the script-over-CAPS lockup, with caps ≥ 220px and each line ≤ 1096px wide?
8. Is the mustard script only on plum, ink or forest, and never on teal or cream?
9. Are the rays inside the title band dark (ink 16%) rather than cream?
10. Is the print filter on the landscape only, with no mottle or specks on the phone screen?
11. Does every paper element (stamp, ticket, label) have a hard, unblurred offset shadow?
12. Does the caption band carry the app name plus a series/edition line, with nothing else?
13. Does the whole deck use no more than the 7 inks plus the listed overprint tints?
14. At 220px wide, can you still see the disc (sun or moon), the layered ridges and the caps word?

## Common failure modes

1. **Zigzag mountains:** evenly spaced triangles with a single fill. *Fix:* use 5–9 hand-placed key vertices, 4 passes of midpoint displacement and shadow faces.
2. **Gradient sky:** a `linear-gradient` "sunset". *Fix:* use 4–6 `<rect>` bands with hard edges. Get the smoothness from more bands, never from blur.
3. **Phone pasted on top:** the landscape stops above the phone base. *Fix:* render the front ridge and pines **after** the phone in DOM order so they overlap its bottom 4–12%.
4. **Sun hidden behind the phone:** only a sliver shows. *Fix:* use r ≥ 620 so its top clears the phone top by 60–120px and its sides pass the phone edges, or place it low beside an offset phone.
5. **Light rays kill the title contrast:** cream wedges behind mustard script measured 4.1:1. *Fix:* use ink 16% rays inside the title band and cream rays only below it.
6. **Texture on the UI:** a full-slide multiply mottle made the screenshots look dirty. *Fix:* keep texture inside the SVG `print` filter, with only the shared grain at ≤ 0.30 over everything.
7. **Camouflage blotches:** a mottle amplitude of 0.4+ at low frequency. *Fix:* use `.24 R + .9` with `baseFrequency .012 .04`.
8. **Clipart stamps:** a rounded rectangle with a dashed border. *Fix:* use a real perforation mask, a mini silkscreen scene, a 3px frame, a value and a hard offset shadow.
9. **Descender collision:** the script "g/y" stabbing into the caps. *Fix:* leave a 10–30px gap between the script baseline and the cap top, with ≤ 12px of overlap.
10. **Soft-clay drift:** rounded blob hills, blurred shadows, arches. *Fix:* keep everything flat and hard-edged, with pines and ridges, and never blur a landscape layer.

## How to apply this style

1. **Fonts:** add Bebas Neue, Yellowtail and Zilla Slab in `template/src/app/layout.tsx` using the `next/font/google` snippet above, and expose `--font-poster`, `--font-script` and `--font-slab`.
2. **Theme:** add `vintage-travel-poster` to `THEMES` in `template/src/lib/constants.ts` (`bg #4B2E4F`, `bgAlt #F1E4C8`, `fg #F1E4C8`, `fgAlt #1C1A17`, `accent #E8B04A`, `accentAlt #A8401C`, `muted #D8C6A6`). Mirror the palette table as CSS custom properties in `globals.css`.
3. **Landscape helpers:** create `src/lib/poster-landscape.ts` with `mulberry32`, `ridge()`, `shadowFaces()`, `pine()`, `treeline()`, `rays()` and `bird()` as given above. Use fixed seeds so re-renders are identical.
4. **Slide canvas:** in `slide-canvas.tsx`, for this theme render each slide in this order: cream slide → an `.art` wrapper clipped with `clip-path: inset(52px 52px 150px 52px)` → a back `<svg>` (bands, rays, disc, far-to-near ridges, all inside `<g filter="url(#print)">`) → the `Phone` component → a front `<svg>` (front ridge, pines, shoreline, also filtered) → keyline and rule divs → the title lockup → stamps → the caption band → `.grain`.
5. **Phone:** use the existing `Phone` from `device-frames.tsx` at 960–1040px, 0°, with the plum two-stack `drop-shadow`. Add the reflection block on at most one slide.
6. **Title:** build the lockup markup above. Measure each caps line with `getBoundingClientRect()` and shrink it in 10px steps until it is ≤ 1096px wide.
7. **Accents:** add a `PosterStamp`, `Postmark`, `ItineraryTicket` and `BirdFlock` component using the recipes, then place them only inside the safe zones listed.
8. **Contrast pass:** render once with the title hidden, sample the glyph-masked background pixels, and require ≥ 4.5:1 at the 1st percentile for every title element.
9. **Audit:** run the style QA checklist plus `_QUALITY_BAR.md` §10–§11 before exporting.

## What this style is NOT

- Not Soft Clay Wellness. There are no rounded plasticine hills, no radial-gradient volume, no blurred cast shadows, no arches and no Fraunces italics. Everything here is flat, hard-edged and silkscreened, inside a poster frame.
- Not Magazine Cover Editorial. There are no mastheads, no serif display type, no roundel seals as the main badge and no colour-block plates. The badge here is a perforated stamp or a ticket.
- Not Neon Athletic Night. There are no italic sports caps, no neon and no black gym backgrounds. The caps here are upright, cream and widely tracked, and they sit on a landscape.
- Not a photo style. It uses no photography, no photographic skies and no realistic lighting.
- Not retro-for-its-own-sake grunge. There are no torn paper edges, no coffee stains, no heavy distress and no halftone comics.
- It never tilts the phone, never replaces the default bezel, and never puts a cream paper border around the phone itself. The border belongs to the poster, not the device.
- There are no emoji, no exclamation marks, no gradient skies, no more than 7 inks, and no invented ratings on stamps.
