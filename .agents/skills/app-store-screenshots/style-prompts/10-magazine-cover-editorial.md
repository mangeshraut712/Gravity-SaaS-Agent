---
name: magazine-cover-editorial
description: Every slide is a page from a quiet, expensive print magazine. Warm uncoated-paper ground, deep ink, one oxblood accent, a tracked small-caps masthead, huge high-contrast display serif with italic emphasis, hairline rules, folios and figure captions. Inspired by Kinfolk and Cereal.
inspiration: Kinfolk, Cereal, NYT Cooking, Apartamento, The Gentlewoman covers, independent food & travel quarterlies
feel: literate, unhurried, expensive paper, "this app has taste and a point of view"
---

# Magazine Cover Editorial

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Canvas reference:** all numbers below are for **1320 × 2868**. Scale by canvas width for other sizes.
- **Headline display size:** the largest headline line renders at **190–230 px**, and the italic emphasis line at **230–270 px**. Nothing smaller than 180 px is allowed for the main line on a phone slide. Line-height **0.90–0.95**, tracking **−0.02 to −0.03em**. If one word would exceed 88% of canvas width (1160 px), drop the size before you break the word.
- **Mixed sizes are mandatory.** Every headline has at least **two type sizes**, like a magazine cover line: a roman line plus a larger italic accent line. The size ratio between them is **1.15–2.3×** (for example 212 px roman plus 252 px italic, or 112 px "at its" plus 262 px italic "peak."). Words of different sizes on one line share a baseline. Never let them float.
- **Weight 400 only** for display type, with Fraunces at optical size 144. Contrast comes from size, italic and colour. Bold display serif is a fail.
- **Exactly one accent colour:** oxblood `#7A2320` (or forest `#2F4A3A` as the alternate, never both in one deck). It is used for the italic emphasis, the colour block, folio numerals on contents pages, and the seal. Every other mark is ink or cream.
- **Phone size:** visible phone height is **68–74% of canvas height** (about 1950–2120 px). That means a **980–1040 px wide** bezel anchored to the bottom edge and bleeding **0–60 px**. Phones stay **upright (0°)**. Up to **±3°** is allowed on one slide per deck, and only if the brief asks for it.
- **The default iPhone bezel is required.** Use `public/mockup.png` via the `Phone` component. No paper border, no photo mat, no polaroid frame, no bezelless card. The "cover image" feeling comes from the **colour block behind the phone**, not from reframing the phone.
- **Masthead on every slide:** a double rule (5 px ink plus 1.5 px ink, 7 px apart), a small-caps row, and a 1.5 px closing rule. It sits 84 px from the top with 80 px side margins, and its total height is about 95 px. It holds three items in a justified row: `APP NAME · ISSUE Nº 03 / SECTION · EDITION / PAGE`.
- **Paper grain is 4–6%** (`mix-blend-mode: overlay`) on every slide, over a warm paper ground. 0% grain is a fail, and so is more than 8% (it reads as dirt).
- **Folio on every slide:** an italic page number, 40–48 px, in a bottom corner. It goes on paper or on the colour block, never on the phone.
- **Contrast floor:** ink on paper is 15:1, oxblood on paper 8.5:1, `--ink-soft` on paper 8.3:1, and cream on oxblood 8.8:1. Any new accent must clear **4.5:1 on `#F1EBE1`**. A pale "dusty rose" italic is an automatic fail.
- **Margins:** 80 px outer margin on both sides for all type. Only the colour block and the phone's bottom edge may bleed.
- **Empty bands:** the gap between the headline block and the phone top stays **140–200 px**. On no-phone slides, no vertical gap exceeds 260 px (9%).
- **Decoration count:** **2–4** per slide. Count them from this list: masthead rules, colour block, seal/roundel, figure caption, oversized numeral, drop cap, pull-quote. The masthead is always one of them.

## Vibe summary

Every screenshot is a page from a slow, beautifully printed quarterly. You see warm uncoated stock with a faint tooth, deep near-black ink, and one rich oxblood that looks like it cost extra at the printer. A tracked small-caps masthead runs across the top like the cover line of an independent magazine. Beneath it, an enormous high-contrast serif sets the headline in two sizes, with the emotional word in a swash italic. The phone sits upright on a cropped oxblood block, like the cover photograph, with a small italic figure caption in the margin. Nothing moves fast. The voice is literate, warm and specific ("The ritual, refined."), and it sells the *experience* of using the app, not a feature count. It works best for food, coffee, wine and tea, reading, journaling, travel, and lifestyle subscriptions.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F1EBE1` | Default slide ground (uncoated stock) |
| `--paper-deep` | `#E7DECF` | Alternate ground for a "back section" slide and secondary blocks |
| `--paper-light` | `rgba(255,250,240,.55)` | Radial lift, top-left of the page (paper tooth, not a gradient look) |
| `--ink` | `#1A1714` | Headlines, masthead, rules, captions (15:1 on paper) |
| `--ink-soft` | `#4A423A` | Deks, standfirsts, contents descriptions (8.3:1 on paper) |
| `--ink-mute` | `#6B6158` | Small metadata only (5.1:1). Never for headline words |
| `--oxblood` | `#7A2320` | The one accent: italic emphasis, colour block, seal, numerals (8.5:1 on paper) |
| `--oxblood-deep` | `#5E1917` | Bottom shade of the colour block, pressed-ink edges |
| `--forest` (alt) | `#2F4A3A` | Alternate accent for travel/tea/outdoors decks. Swap it for oxblood globally |
| `--cream` | `#F6EFE3` | Type, seal and folio on the colour block (8.8:1 on oxblood) |
| `--rule` | `#1A1714` | Hairlines at 1.5 px, masthead top rule at 5 px |
| `--phone-shadow` | `rgba(52,14,10,.38)` | Long bezel shadow (oxblood-tinted), plus a tight `rgba(40,20,10,.28)` contact shadow |
| `--grain` | `0.06` | Overlay noise opacity (range 0.04–0.06) |

**Forest variant:** replace `--oxblood` with `#2F4A3A` and `--oxblood-deep` with `#22372B`, and tint the phone shadow `rgba(20,40,30,.34)`. Everything else stays the same. Forest on paper is 8.2:1.

Colour philosophy: this is **one ink plus one spot colour** on paper. No gradients read as "gradients". The only permitted shading is a barely visible paper-tooth radial and a 25% darkening at the foot of the colour block. No pure white, no pure black.

## Typography

- **Display (headlines, numerals, folios, drop caps, pull-quotes):** **Fraunces** (Google Fonts, variable). Load `ital,opsz,wght,SOFT,WONK`. Set `font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0` for roman and `"WONK" 1` for italic (this gives the swash `f`, `k` and `d` terminals that make the italic sing). Weight 400.
  - Google alternates: **Playfair Display** (400/400i), **DM Serif Display**, **Instrument Serif** (lighter, less contrast).
  - Commercial alternates: GT Super Display, Canela, Tiempos Headline, Schnyder, Noe Display.
- **Small caps / labels (masthead, FIG. labels, section names, attributions):** Fraunces at `opsz 9`, weight 600, uppercase, **24–28 px**, tracking **0.22–0.28em**. If the deck uses a different display face, use the same family's text cut. Never use a sans for labels, because the whole page must feel set in one type family.
- **Dek / standfirst / captions:** Fraunces italic at `opsz 36`, weight 400, **34–40 px**, line-height 1.2, `--ink-soft`. Figure-caption text is italic 34–36 px in `--ink`.
- **Contents titles:** Fraunces roman `opsz 144`, **72–80 px**. Contents numerals are italic, **120–140 px**, oxblood.
- **Pull-quote:** Fraunces italic `opsz 96`, **64–80 px**, line-height 1.08, cream on oxblood or ink on paper. Always hand-break the lines.
- **Sizes cheat-sheet (1320 wide):** masthead 26 px · hero roman 200–215 px · hero italic 240–265 px · dek 34–38 px · fig label 24 px · fig text 34 px · folio 44 px · drop cap 150–160 px (spans 3 lines).
- **Loading:** `<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=block">`. In Next.js use `next/font/google` `Fraunces({ axes: ["opsz","SOFT","WONK"], style: ["normal","italic"] })`.

## Headline emphasis (signature)

The headline is a **cover line in two sizes**. A roman line in ink sets the scene. Then the **one** emotional word or phrase follows in a larger **swash italic in oxblood**, indented or offset so the two lines form a staggered, asymmetric block.

- Exactly **one** italic phrase per slide, 1–2 words, in oxblood. Never italicise and colour two things.
- The italic line is **15–30% larger** than the roman line, or the roman is split so a small word ("at its", "the", "for") sits at 100–120 px beside a huge italic.
- Offset the italic line **250–400 px** to the right of the roman line's left edge. Fill the pocket this leaves with the dek (on the left) or a seal (on the right).
- Words of different sizes sharing a line **share a baseline**. Check it by eye at full size.
- The full stop belongs to the italic word ("refined.", "peak.", "considered."). A comma may end the roman line.
- Examples: "The ritual, *refined.*" · "Drink it at its *peak.*" · "Every cup, *considered.*" · "Read a little *slower.*" · "Your kitchen, *annotated.*"

## Phone / device frame treatment

- **Always the template's default iPhone bezel** (`public/mockup.png` via `Phone` in `device-frames.tsx`). The screenshot fills the screen edge to edge.
- **Upright, 0° tilt.** If the brief insists on life, one slide may tilt up to ±3°. Never more.
- **Width 980–1040 px**, anchored to the bottom edge with a 0–60 px bleed. The top of the phone sits at **y ≈ 840–900 px**, directly under the headline block, with a gap of 140–200 px.
- **Horizontal placement alternates** per slide: centred-right (left edge ≈ 190 px), then right (left edge ≈ 280 px, leaving a 200–220 px left column for the figure caption), then back.
- **Shadow (oxblood-tinted, two layers):** `drop-shadow(0 50px 70px rgba(52,14,10,.38)) drop-shadow(0 8px 14px rgba(40,20,10,.28))`.
- **The cover-image block:** an oxblood rectangle behind the lower 55–60% of the phone. It starts at **y ≈ 1250 px** and runs to the bottom edge. It bleeds off one side edge and sits **130–210 px** in from the other. The phone overlaps the block's top edge by about 390 px, so the device reads as the cover subject breaking the frame. The block gets a faint top-left lift (`rgba(255,220,200,.10)` radial) and a 25% darker foot.
- **Screen choice:** prefer screens with a strong title near the top (a named item, a big number, a timer). Magazine pages reward one clear subject per figure. Avoid settings, empty states and dense lists as the hero figure.
- **Status bar:** keep whatever the real screenshot carries. Do not paint a fake one over it.
- **Never** put a mat, passepartout, polaroid border, tape or photo corners on the phone.

## Background treatment

1. **Ground:** solid `--paper` `#F1EBE1`. On one "back of book" slide per deck you may use `--paper-deep` `#E7DECF`.
2. **Paper tooth:** two soft radials, invisible as gradients. `radial-gradient(1200px 900px at 20% 10%, rgba(255,250,240,.55), transparent 60%)` plus `radial-gradient(1000px 1200px at 90% 95%, rgba(196,178,150,.18), transparent 65%)`.
3. **Grain:** fractal-noise SVG overlay (`baseFrequency .9`, 3 octaves) at **opacity 0.04–0.06**, `mix-blend-mode: overlay`. It sits above everything, including the colour block and the phone.
4. **Colour block:** as described under the phone treatment. On no-phone slides it becomes a footer band (the bottom 18–22% of the canvas) that holds the pull-quote.
5. No vignette, no photography, no textures other than grain.

## Decorative accents

Density: **editorial, 2–4 per slide** (_QUALITY_BAR §9). Choose from this list only:

- **Masthead rules** (always present, and always counted). A double top rule, a small-caps row, and a hairline under it.
- **Cropped colour block.** This is the "cover photograph" plate behind the phone. One per slide at most.
- **Seal / roundel.** A 230–260 px letterpress stamp, rotated **−10° to +10°**. It has an outer ring of 3.5 px, an inner ring of 1.2 px, and a 70 px-radius inner ring. Circular small-caps text runs on `textPath` with `textLength` set to the full circumference, so the text never overlaps itself. The centre reads "ISSUE / Nº3" in italic. Pass it through a tiny `feTurbulence` plus `feDisplacementMap` filter (scale about 2) for a pressed-ink edge. Use oxblood on paper and cream on the block. Place it in negative space (the top-right pocket beside the roman headline line, or on the colour block), never touching headline letters.
- **Figure caption.** `FIG. 2` in small caps, then a 70 px hairline, then 2 lines of italic caption. It can also run vertically in the gutter, rotated −90°, beside the phone.
- **Drop cap.** Used on the dek: an oxblood roman initial at 150–160 px that spans 3 lines.
- **Oversized numeral.** Contents numerals, or an italic section numeral 300–520 px in oxblood, in negative space only.
- **Pull-quote.** Curly quotes, italic, with a small-caps attribution ("— From the editors").

Seal reference markup (250 px viewBox; swap `fill`/`stroke` to cream on the block):

```html
<svg width="250" height="250" viewBox="0 0 250 250" style="transform:rotate(-9deg)">
  <defs>
    <path id="ring" d="M125,125 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0"/>
    <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>
  </defs>
  <g filter="url(#ink)" fill="none" stroke="#7A2320">
    <circle cx="125" cy="125" r="120" stroke-width="3.5"/><circle cx="125" cy="125" r="112" stroke-width="1.2"/>
    <circle cx="125" cy="125" r="70" stroke-width="1.2"/></g>
  <g filter="url(#ink)" fill="#7A2320" font-family="Fraunces">
    <text font-size="17" font-weight="600" letter-spacing="2"><textPath href="#ring" textLength="574" lengthAdjust="spacing">FRESHNESS, KEPT · THE MORNING EDITION ·</textPath></text>
    <text x="125" y="112" text-anchor="middle" font-size="16" font-weight="600" letter-spacing="3">ISSUE</text>
    <text x="125" y="160" text-anchor="middle" font-size="58" font-style="italic">Nº3</text></g>
</svg>
```

Polish gates for the seal: two tones (ring plus text, cream or oxblood over the block or paper), texture (grain plus ink displacement), volume cue (double ring with thick/thin contrast), and detail density. That is 4 of the 5 gates.

## Cross-screen moment

This style crosses the seam **like a magazine spread**:

- **Best:** the **colour block** runs across the seam. Slide 1's block bleeds off its right edge at y = 1250. Slide 2's block starts at x = 0 at the **same y**, so the exported pair reads as one continuous plate under two phones.
- **Also good:** a single **hairline rule** at the same y on both slides. Or an **oversized numeral** ("02") with 15–25% of its width crossing into the neighbour, but only in negative space.
- **Never across the seam:** headline words, the masthead text, the seal, figure captions, folios, or the phone.
- Each slide must still read as a finished page on its own. The block must look deliberately cropped on each side.

## Layout grid

- **Columns:** a 12-column grid inside the 80 px margins (1160 px live width, 20 px gutters, about 78 px columns). Headlines span 10–12 columns. The dek and the figure caption take 3 columns (about 250 px), and the drop-cap dek takes 4.
- **Vertical rhythm:** masthead at 84–180 px, headline at 230–690 px, phone top at 840–900 px, colour block top at 1250 px, folio at 2750–2800 px. Keep these y values identical across slides, so the deck flips like pages of one issue.
- **Asymmetry:** each slide has one heavy side, and it alternates: headline left and phone right, then the reverse. Centred symmetric layouts read as a poster, not a magazine.

## Copy tone

- **Voice:** literate, warm, specific, a little understated. The voice of a food editor writing a standfirst. It sells rituals, mornings and craft, not "features".
- **Vocabulary:** ritual, refined, considered, peak, the morning, slow, kept, season, notes, the shelf, the table, a little, worth, well, each, every.
- **Structure:** short cover lines, 2–5 words, with the italic word last. Deks are one sentence, concrete and sensory ("Roast date in, peak window out.").
- **Punctuation:** sentence case, with a full stop on the italic word. Commas and em dashes are welcome. Use curly quotes and `Nº`. No exclamation marks, no question marks, no emoji, no ALL-CAPS except the small-caps labels.
- **Avoid:** "ultimate", "powerful", "seamless", "game-changing", "#1", "AI-powered" as a lead, feature-list bullets, percentages in headlines, second-person imperatives stacked in a row, and fake press quotes (pull-quotes are attributed "From the editors" or to the app, never to invented publications).
- **Deks (standfirsts):** one sentence of 6–14 words, concrete, naming the product category at least once in the deck's first dek. Examples: "Every bag of coffee, brewed at its peak." · "Roast date in, peak window out." · "Sixty recipes, tested in real kitchens." · "One line a day, bound like a book."
- **Figure captions:** 2–6 words, italic, observational, like a photo caption, not a CTA. Examples: "The morning, at a glance." · "Day sixteen, at its best." · "Second pour, thirty seconds."
- **Contents deks:** each ≤ 36 characters, ending with a full stop.
- **Example headlines:**
  - Coffee: "The ritual, *refined.*" / "Drink it at its *peak.*"
  - Recipes: "Tonight's supper, *sorted.*"
  - Reading: "Read a little *slower.*"
  - Journaling: "Your days, *kept.*"
  - Travel: "The long way, *mapped.*"
  - Wine: "Every bottle, *remembered.*"
  - Tea: "Steeped to the *second.*"
  - Subscription/lifestyle: "Less, but *better.*"

## Per-slide breakdown (mandatory)

### Slide 1 — Hero (the cover)
- **Masthead:** `APP · ISSUE Nº 03 · THE MORNING EDITION`.
- **Headline:** roman line at 212 px, left 80, top about 236. The italic oxblood line at 252 px is indented about 290 px, top about 420.
- **Dek:** a 3–4-line italic standfirst, 34 px, width about 250 px, placed in the pocket left of the italic line. It carries the plain-language benefit, and must name the product category ("Every bag of coffee, brewed at its peak.").
- **Seal:** in the top-right pocket beside the roman line, rotated −9°.
- **Phone:** 1000 px wide, left about 196, top about 860, bleeding off the bottom. Use the app's home/overview screen.
- **Colour block:** left 132 → bleeding off the right edge (the cross-screen plate), top 1250 → bottom.
- **Notable effect:** the phone breaks the top edge of the block by about 390 px, which is the "cover star over the frame" moment. Do not let the block's top edge line up with a UI row inside the screenshot. Nudge it ±40 px if it does.
- **Caption:** a vertical `FIG. 1 — The morning, at a glance` in the 130 px left gutter. The folio "3" goes bottom-left.

### Slide 2 — Differentiator (the feature spread)
- **Masthead:** `APP · THE SHELF · PAGE 04` (a section name, not the issue).
- **Headline:** "Drink it" at 212 px, then "at its" at 112 px on the same baseline as a 262 px italic oxblood "*peak.*".
- **Drop-cap dek:** top-right column (left 868, width 380), 36 px roman, with a 152 px oxblood drop cap.
- **Phone:** 1000 px, left about 278 (right-shifted), top about 880. Use the screen that proves the differentiator.
- **Colour block:** starts at x 0 (continuing slide 1's block), right edge 210 px short of the canvas, top 1250.
- **Caption:** left column on paper, `FIG. 2`, a hairline, then "Day sixteen, / at its best.". The folio "4" sits in cream on the block, bottom-left.

### Slide 3 — Feature (the recipe/how-to page)
- Use the `--paper-deep` ground. The phone is centred-left at 1000 px, with the colour block bleeding off the left edge.
- The headline is right-aligned for once, and the figure caption runs vertically in the right gutter.
- **Headline example:** "Every pour, / *on cue.*" with a timer or step-by-step screen.
- The decoration is an oversized italic numeral "III" (400 px, oxblood at 100% on paper) in the upper-left pocket. No seal on this slide.

### Slide 4 — Feature / proof (the sidebar)
- Use a paper ground. The phone is right-shifted, as on slide 2, but with no block. Use the pull-quote variant instead: a 64 px italic ink quote in the left column, 3 hand-broken lines, attributed in small caps.
- One hairline rule runs full-width at the phone's top edge (a rule may cross into slide 5 here if slide 2 did not already use the block crossing).
- Proof lives in the words, not in badges. Use a real review line or the editors' voice. No star ratings, laurels or banners.
- Notable effect: this is the quietest page in the deck. With no block, the ink quote and the hairline carry it, so keep the quote ≥ 64 px so it survives the thumbnail.

### Slide 5 — Closer (the contents page)
- **No phone.** The masthead reads `APP · IN THIS ISSUE · Nº 03`.
- **Headline:** "Every cup," at 200 px, plus "*considered.*" in 236 px oxblood italic, indented about 220 px.
- **Contents list:** 5 rows from y about 880, each separated by a 1.5 px ink rule (closed top and bottom). Each row has an italic oxblood page numeral (132 px, in a 230 px column), a feature name (76 px roman), and a one-line italic dek (38 px, `--ink-soft`).
- **Footer block:** oxblood, top 2330 → bottom. It holds a 76 px cream italic pull-quote in 3 hand-broken lines, a small-caps attribution, a cream seal rotated +8° on the right, and the folio.
- Check that no empty band exceeds 22%. The gap between the contents list and the footer block must stay ≤ 260 px.

## How to apply this style

1. **Fonts:** in `template/src/app/layout.tsx`, load Fraunces via `next/font/google` with `axes: ["opsz","SOFT","WONK"]` and both styles. Expose it as a CSS variable (`--font-display`) and use it for every slide element. Use no sans.
2. **Theme:** in `template/src/lib/constants.ts`, add a `THEMES["magazine-cover-editorial"]` entry: `bg #F1EBE1`, `bgAlt #7A2320`, `fg #1A1714`, `fgAlt #F6EFE3`, `accent #7A2320`, `muted #4A423A`. Set `bgAlt` to the oxblood so inverted slides become the colour-block page.
3. **Background:** in `slide-canvas.tsx` (`SlideBackground` / `backgroundFor`), return a **flat** `theme.bg` for this theme. There is no 160° gradient and no `Blob`s. Add the paper-tooth radials and the grain overlay at `opacity: 0.06; mix-blend-mode: overlay` as the top layer.
4. **Masthead component:** an absolutely positioned block (`top: cW*0.064`, `left/right: cW*0.061`) with the double rule, a justified small-caps row (`font-size: cW*0.0197`, `letter-spacing: .26em`, `font-variation-settings: "opsz" 9`, weight 600), and a closing hairline. Its content comes from the per-slide `section` / `page` fields.
5. **Headline:** render two elements, a roman line and an italic accent line, each with its own `fontSize` (`cW*0.16` and `cW*0.19`). Set `line-height: .92`, `letter-spacing: -.025em`, and `font-variation-settings: "opsz" 144`. The italic gets `"WONK" 1` and `color: theme.accent`, and is offset by `cW*0.22–0.30`.
6. **Measure:** after layout, measure each headline line's `scrollWidth`. If any line is wider than `cW*0.88`, reduce that line's font size in 4 px steps.
7. **Phone:** use the existing `Phone` component at `width = cW*0.76` (1000/1320), anchored so its bottom sits at `cH + 0–60px`. It has 0° rotation and the two-layer oxblood-tinted `drop-shadow` from the phone treatment section.
8. **Colour block:** a `div` behind the phone with `top: cH*0.436` (1250/2868) and `bottom: 0`, bleeding off one side and inset `cW*0.10–0.16` on the other. Use `theme.accent`. For the cross-screen spread, give slides 1 and 2 the same `top` and mirror their bleeds.
9. **Captions, folio, seal:** position these last. Keep them out of the headline's bounding box. Render the seal as inline SVG with `textPath` + `textLength` = 2πr.
10. **Audit:** run _QUALITY_BAR §10 and §11. Check one accent colour, one italic phrase per slide, 2–4 decorations, and that the phone's visible height is ≥ 68%.

11. **Five-slide default order:** cover (block crosses to slide 2), feature spread, recipe page (paper-deep), sidebar (pull-quote), contents closer. For 3-slide decks, use cover, feature spread, contents.

## What this style is NOT

- Not a Kinfolk-logo pastiche. Never reproduce a real magazine's nameplate, wordmark or cover layout. The masthead is always the app's own name set in small caps.
- Not minimal-sans or "clean Apple". There are no sans-serif headlines, no Inter labels, and no rounded chips.
- Not hand-drawn. There are no doodles, script fonts, squiggles or stickers.
- Not moody or photographic. There are no dark photo backgrounds, vignettes or candle bokeh. It is a bright paper page.
- Not a frame gimmick. There is no polaroid, paper mat, tape or torn-paper border around the phone. The bezel stays default.
- Not colourful. It uses one spot colour; a second accent, a gradient or a pastel tint is a fail.
- Not bold. Display type is weight 400 only; heavy serif reads as a newspaper tabloid.
- Not tilted, floating or 3D. Phones stand upright and anchor to the bottom edge.
- Not a newspaper. There are no multi-column body-text walls, no datelines, and no "BREAKING" red bars. It is a quarterly, not a daily.
- Not crowded. Never use more than 4 decorations on a page, or a seal, a numeral and a pull-quote all on one slide.
- Not shouty copy. There are no exclamation marks, questions, superlatives, ratings banners or "Download now".
