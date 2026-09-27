---
name: quiet-japandi
description: Warm washi-paper slides with calm, asymmetric negative space. An upright phone stands on a thin oak shelf beside one hand-thrown ceramic cup. Flush-left Mincho headlines with kenten dots, a vertical Japanese word, and one small vermilion hanko seal. Restraint as luxury. Inspired by MUJI, Kinto and Kenya Hara.
inspiration: MUJI catalogues, Kinto, Hasami Porcelain, Aesop store design, Kenya Hara's "White", Japanese stationery catalogues
feel: quiet, considered, tactile, "only what you need, placed with care"
---

# Quiet Japandi

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md). The universal quality rules apply to this style. Negative space here is designed. It never means a smaller phone.

## Hard quality rules (this style)

- **Phone size:** upright **0°**, **990 px wide** (≈ 2017 px tall = **70.3%** of 2868). Allowed range is 960–1020 px (68.2–72.6%). The negative space comes from **asymmetry** (phone flush to one side, text column on the other). Never shrink the phone. Tilt ≠ 0° = fail.
- **The phone stands on something.** On every phone slide it rests on the **oak shelf** (bottom edge overlaps the shelf's top face by 6 px) or on the **stone plinth**. It needs a contact shadow ellipse. A floating phone = fail.
- **Headline:** Shippori Mincho **500**, **158 px** (floor 120 px), line-height **1.05**, tracking **−0.012em**, colour sumi `#1E1D1B`. Set flush-left at **x = 100 px** in a column **≤ 800 px** wide. **≤ 6 words, 2 lines** (3 only for localisation). Centred headline = fail. Bold (≥ 700) = fail.
- **Exactly one emphasised word, marked with kenten dots.** Use one 19 px hinoki-ink `#7A5A34` dot per letter, centred **1.3em** below the line top, so the dots sit under the last line. No italics, no colour change, no underline. Emphasis by italic or colour = fail.
- **Vermilion `#C8321E` appears exactly once per slide**, as the hanko seal (96–112 px). Vermilion text, vermilion UI chips or a second seal = fail.
- **Background is warm washi `#F3F0EA`** with a 3-stop window-light wash, a kozo-fibre layer (≈ 2–3% visible texture) and grain at **0.16** overlay opacity. `#FFFFFF`, cool greys or visible "hair" fibres (any fibre opacity > 0.30) = fail.
- **Decoration density: minimal, 0–2 per slide.** The hanko is one. The single object (ceramic cup, river stone or bud vase) is the other. Shelf, plinth, hairlines and the vertical label are structure and don't count. A third decoration = fail.
- **The object must clear §3 gates 1–4.** That means a 5-stop cylindrical glaze gradient, a cast shadow and a contact shadow, speckle and noise texture, and a specular streak. A flat cup icon = fail. Minimum size: **≥ 300 px tall** beside a phone, **≥ 600 px tall** on a no-phone slide.
- **Text contrast (measured on renders):** sumi on washi **14.8:1**. Labels in stone-ink `#4E4B46` **7.6:1**, worst sampled pixel ≥ 5.2:1. Raw stone `#8C8A85` (3.0:1) is for hairlines only, never text.

## Vibe summary

A still life on a gallery wall. A wide sheet of warm washi, one thin oak shelf running edge to edge, and a phone standing on it the way a MUJI catalogue stands a notebook: square to camera, lit softly from the upper left. A hand-thrown yunomi sits at its foot. One short sentence in a refined Mincho is set flush-left in a narrow column. In the far margin a single Japanese word runs vertically with its reading beside it, signed off with a small vermilion seal. Nothing moves, glows or shouts. The luxury is in what was left out: the space is deliberate and every object has weight and a shadow. The voice is noun-led and unhurried ("A slower cup." / "Only what you need."). It must feel like a Kinto product page or an Aesop shelf. It must not feel like a magazine cover (10) or a clay diorama (12).

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--washi` | `#F3F0EA` | Slide background (base) |
| `--washi-lit` | `#FCFAF6` | Window-light highlight stop (top-left) |
| `--washi-shade` | `#E2DBCF` | Wash bottom stop, shadow zones |
| `--sumi` | `#1E1D1B` | Headlines, vertical Japanese word, list values (14.8:1) |
| `--stone-ink` | `#4E4B46` | Labels, glosses, subheads (7.6:1) |
| `--stone` | `#8C8A85` | Hairlines and rules only (3.0:1, never text) |
| `--hinoki` | `#C9A97E` | Oak shelf front face, kenten on dark slides (7.6:1 on sumi) |
| `--hinoki-lit` | `#E9D6B4` | Shelf top face |
| `--hinoki-ink` | `#7A5A34` | Kenten dots on washi (5.5:1) |
| `--shu` | `#C8321E` | Hanko seal only, once per slide |
| `--glaze` | `#A69E8F` | Ash glaze mid (cup body) |
| `--ame` | `#A8804F` | Amber "ame" glaze band at the cup rim |
| `--clay` | `#C39A72` | Unglazed foot / clay band |
| `--plinth` | `#E2DCD1` | Stone plinth front face |
| `--shadow` | `rgba(84,62,36,.16–.42)` | Every shadow is warm brown, never grey or black |

Colour philosophy: materials, not colours. Paper, ink, wood, stone, glaze, and one drop of seal-paste red. The app's brand colour lives only inside the screenshot.

## Typography

- **Headline (Google):** `Shippori Mincho` 500 (Latin + Japanese). Alternates: `Shippori Mincho B1` 500, `Zen Old Mincho` 500, `Noto Serif JP` 500. **Commercial:** Ryumin Light/Regular (Morisawa), A1 Mincho, Canela Text Light for Latin-only.
- **Labels / body (Google):** `Zen Kaku Gothic New` 500 (labels) / 400 (subheads). Alternates: `Noto Sans JP` 400/500, `M PLUS 1`. **Commercial:** Shin Go, Gill Sans Nova Light, Neue Haas Unica.
- **Hanko glyph:** `Yuji Syuku` 400. Fallback `Shippori Mincho B1` 800.
- **Sizes at 1320 wide:**

| Role | Face | Size / weight | Leading | Tracking | Case |
|---|---|---|---|---|---|
| Headline | Shippori Mincho | 158 px / 500 (120 floor) | 1.05 | −0.012em | Sentence |
| Vertical word | Shippori Mincho | 100–124 px / 500 | 1.0 | 0.12em | Japanese |
| Gloss (vertical) | Zen Kaku Gothic New | 32 px / 500 | 1.0 | 0.30em | lower |
| Label | Zen Kaku Gothic New | 30–32 px / 500 | 1.0 | 0.32em | UPPER |
| Subhead | Zen Kaku Gothic New | 40 px / 400 | 1.35 | 0.02em | Sentence, 1 line |
| List value (closer) | Shippori Mincho | 56 px / 500 | 1.0 | −0.005em | Sentence |
| Caption wordmark | Shippori Mincho | 84 px / 500 | 1.0 | 0 | App name |

```html
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Yuji+Syuku&display=block" rel="stylesheet">
```
```ts
// template/src/app/layout.tsx
import { Shippori_Mincho, Zen_Kaku_Gothic_New, Yuji_Syuku } from "next/font/google";
const mincho = Shippori_Mincho({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-mincho", display: "block", preload: false });
const kaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-kaku", display: "block", preload: false });
const seal = Yuji_Syuku({ weight: "400", subsets: ["latin"], variable: "--font-seal", display: "block", preload: false });
// <body className={`${mincho.variable} ${kaku.variable} ${seal.variable}`}>. CJK glyphs load by unicode-range; set lang="ja" on Japanese spans.
```

## Headline emphasis (signature)

Kenten (傍点) are the Japanese typographic emphasis marks. Here they are one small dot per letter of the single key word. **Don't** use CSS `text-emphasis`: on Latin it draws 50%-of-font-size blobs (≈ 79 px) and pushes the line box apart. Draw them yourself:

```css
.h em{font-style:normal}
.h em .k{position:relative}               /* wrap each letter: <em><span class="k">b</span>…</em> */
.h em .k::before{content:"";position:absolute;left:50%;top:1.3em;width:19px;height:19px;
  margin-left:-9.5px;border-radius:50%;background:#7A5A34}   /* #C9A97E on sumi slides */
```
- Put the emphasised word **on the last line** so the dots fall into free space below it. At 1.3em they clear the baseline by ≈ 26 px. Keep ≥ 40 px between the dots and anything underneath.
- Pick the word that carries the benefit: "Beans at their **best**." / "One pour at a **time**." / "Only what you **need**."
- Skip punctuation and spaces. For a word with descenders (g, j, p, q, y), move the dots to `top:1.5em`.

## Phone / device frame treatment

- Always the template's default iPhone bezel (`public/mockup.png` via the `Phone` component in `device-frames.tsx`). Never replace it, round it off or paper-frame it.
- **Width 990 px, upright 0°.** Phone left edge at **x = 64** (phone-left slides) or **x = 230–266** (phone-right slides). The inner screen then lines up with the 108 px text margin.
- **Standing:** phone bottom = shelf top + 6 px. Shadow stack on the wrapper (light from the upper left, so the long shadow falls down-right):
```css
.pshadow{filter:drop-shadow(26px 22px 46px rgba(88,68,44,.16)) drop-shadow(0 8px 14px rgba(60,46,30,.16))}
.contact{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(52,40,28,.42),rgba(52,40,28,0))}
/* contact ellipse: width = phone width − 80, height 34, top = phone bottom − 18, left = phone left + 46 */
```
- Never add a glow, reflection, colour tint or glass card to the phone.

## Background treatment

Three layers plus grain, identical on every light slide:
```css
.slide{background:#F3F0EA}
.wash{position:absolute;inset:0;background:
  radial-gradient(110% 70% at 14% 6%,rgba(252,250,246,.95) 0%,rgba(248,246,241,.5) 30%,rgba(243,240,234,0) 62%),
  linear-gradient(180deg,rgba(236,231,222,0) 55%,rgba(226,219,207,.55) 100%)}
.fibre{position:absolute;inset:0;background:url(/washi.svg) 0 0/1320px 2868px no-repeat}
.grain{/* shared fractal-noise overlay */ mix-blend-mode:overlay;opacity:.16}
```
**Washi fibre layer** (generate once, save as `public/washi.svg`). Use 520 dark and 260 light kozo strands plus 70 inclusions and a low-frequency mottling filter:
```ts
const rnd = mulberry32(17); // any seeded PRNG so every export is identical
function fibre(dark: boolean) {
  let x = rnd()*1400-40, y = rnd()*2950-40, a = rnd()*Math.PI; const L = 40+rnd()*150, p = [[x,y]];
  for (let i=0;i<4;i++){ a += (rnd()-.5)*1.1; x += Math.cos(a)*L/4; y += Math.sin(a)*L/4; p.push([x,y]); }
  const [c,o,w] = dark ? ["#8C7B62", .05+rnd()*.06, .7+rnd()*.8] : ["#FFFFFF", .16+rnd()*.14, 1+rnd()*1.2];
  return `<path d="M${p[0]} C${p[1]} ${p[2]} ${p[3]} S${p[4]} ${p[4]}" fill="none" stroke="${c}" stroke-opacity="${o.toFixed(2)}" stroke-width="${w.toFixed(1)}" stroke-linecap="round"/>`;
}
// + <filter id="m"><feTurbulence type="fractalNoise" baseFrequency="0.0045 0.006" numOctaves="3"/>
//   <feColorMatrix values="0 0 0 0 .55 0 0 0 0 .48 0 0 0 0 .38 0 0 0 -1.1 .62"/></filter> on a full rect at opacity .10
```
Test it at 100% zoom. The fibres should read as paper when you look for them and disappear at arm's length. If they look like hair or scratches, lower the light-fibre opacity.

## Decorative accents

**1. Oak shelf (structure).** It spans the full width at 32 px: an 8 px lit top face, then a 24 px front edge with horizontal grain.
```css
.shelf{position:absolute;left:-20px;width:1360px;height:32px;
 background:linear-gradient(180deg,#E9D6B4 0,#E2CBA3 7px,#B8956A 8px,#CBAB80 12px,#C5A376 70%,#A7845A 100%);
 box-shadow:0 1px 0 rgba(90,64,36,.35),0 14px 22px -6px rgba(84,62,36,.26),0 50px 80px -24px rgba(84,62,36,.16)}
.shelf::after{content:"";position:absolute;inset:8px 0 0;mix-blend-mode:multiply;opacity:.55;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1360' height='24'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='.0035 .42' numOctaves='3' seed='3'/><feColorMatrix values='0 0 0 0 .55 0 0 0 0 .40 0 0 0 0 .24 0 0 0 1.4 -.55'/></filter><rect width='1360' height='24' filter='url(%23w)'/></svg>")}
```
**2. Stone plinth (structure, alternative to the shelf).** 1220 × 132 px. It bleeds off one side edge: a 30 px top face and a 102 px front face.
```css
.plinth{box-shadow:0 26px 40px -10px rgba(84,64,40,.22),0 70px 110px -30px rgba(84,64,40,.16)}
.plinth .pt{height:30px;background:linear-gradient(90deg,#F6F3EE,#EFEBE4 55%,#E9E4DB);box-shadow:inset 0 1px 0 rgba(255,255,255,.9)}
.plinth .pf{top:30px;bottom:0;background:linear-gradient(180deg,#E2DCD1,#DAD3C6 60%,#D2CABC)}
.plinth .ptex{inset:0;mix-blend-mode:multiply;opacity:.35;/* fractal noise baseFrequency .6 .9 */}
```
**3. Vertical label (structure).** A Japanese word (1–4 characters) plus a hairline plus the romaji and meaning, laid out right to left. Put it top-right beside a top headline, or bottom-right beside a bottom headline.
```css
.vlab{position:absolute;right:96px;display:flex;flex-direction:row-reverse;gap:26px;align-items:flex-start}
.vjp{writing-mode:vertical-rl;font:500 124px/1 var(--font-mincho);letter-spacing:.12em;color:#1E1D1B}
.vrule{width:1.5px;height:210px;background:#8C8A85;opacity:.6;margin-top:14px}
.vgloss{writing-mode:vertical-rl;font:500 32px/1 var(--font-kaku);letter-spacing:.3em;color:#4E4B46;margin-top:10px}
```
Example words (all verified): 旬 *shun · at its peak*, 蒸らし *murashi · the bloom* (the pour-over pre-infusion), 一杯 *ippai · one cup*, 珈琲 *kōhī · coffee*, 朝 *asa · morning*, 余白 *yohaku · white space*, 暦 *koyomi · calendar*, 日記 *nikki · diary*, 茶 *cha · tea*, 住まい *sumai · home*.

**4. Hanko seal (decoration 1 of 2).** A solid vermilion square in 白文 style (carved glyph shows paper colour). It sits **centred under the vertical word**, 40–50 px below it, like a seal under a signature.
```html
<svg viewBox="0 0 120 120" width="112" height="112"><defs><filter id="r" x="-10%" y="-10%" width="120%" height="120%">
 <feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="2" seed="5" result="t"/>
 <feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/>
 <feTurbulence type="fractalNoise" baseFrequency=".75" seed="11" result="s"/>
 <feColorMatrix in="s" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -12 8" result="m"/>
 <feComposite in="d" in2="m" operator="in"/></filter></defs>
 <g filter="url(#r)"><rect x="4" y="4" width="112" height="112" rx="7" fill="#C8321E"/>
 <text x="60" y="88" text-anchor="middle" font-family="Yuji Syuku, Shippori Mincho B1, serif" font-size="80" fill="#F3F0EA">花</text></g></svg>
```
The glyph is one kanji tied to the app (花 bloom, 記 record, 暦 calendar, 茶 tea, 家 home, 静 quiet). The seal is inline SVG, so the page's web font renders inside it.

**5. Ceramic yunomi (decoration 2 of 2).** Hand-thrown, no handle, ash glaze with an amber rim that drips, and an unglazed clay foot. The viewBox is 420 × 380 and the foot sits at y = 346. Stack it in this order:
```html
<svg viewBox="0 0 420 380"><!-- clipPath #c = body path; filters b3/b6/b12 = Gaussian 3/6/14, soft = 1.2 -->
 <ellipse cx="262" cy="344" rx="178" ry="20" fill="#5A4632" opacity=".20" filter="url(#b12)"/>   <!-- long shadow -->
 <ellipse cx="214" cy="342" rx="118" ry="9"  fill="#3B2C1E" opacity=".42" filter="url(#b3)"/>    <!-- contact -->
 <path d="M122,322 C124,334 126,343 132,346 L290,346 C296,343 298,334 300,322 Z" fill="url(#clay)"/> <!-- foot -->
 <path id="body" d="M60,52 C57,118 64,222 82,296 C88,322 124,336 210,337 C296,336 332,322 338,296 C356,222 363,118 360,52 A150,30 0 0 1 60,52 Z" fill="url(#glaze)"/>
 <g clip-path="url(#c)">
  <!-- 1 clay band under a wavy glaze line (y≈276–296) + a 7px blurred darker "glaze roll" stroke on that line
       2 ame band from the rim to y≈96 with 5 drips of different lengths (longest to y≈156), soft-blurred,
         a 4px #4A321F edge stroke at .55, plus a vertical light→dark overlay gradient
       3 two uneven throwing rings: 3.5px #3E3730 @ .12 with a 2px white @ .09 line 4px below
       4 ~95 iron specks (r .8–2.6, #4A3526 @ .25–.6) + ~45 pale specks (#FFF8EC @ .25–.5)
       5 vertical AO gradient (white .10 → 0 → #2A1E14 .28) + fractal-noise rect @ .55
       6 specular: 16px #FFFBF2 stroke @ .42 blur 6 at x≈104–118, plus a 4px white core @ .55 -->
 </g>
 <ellipse cx="210" cy="52" rx="150" ry="30" fill="#8E6A42"/> <ellipse cx="210" cy="51" rx="146" ry="27.5" fill="#C9AB82"/>
 <ellipse cx="210" cy="53" rx="139" ry="25" fill="#5E4230"/> <ellipse cx="210" cy="58" rx="136" ry="22" fill="url(#coffee)"/>
 <ellipse cx="170" cy="54" rx="52" ry="7" fill="#F4E6D0" opacity=".22" filter="url(#b3)"/>  <!-- window reflection -->
</svg>
```
Gradients: `glaze` runs horizontally with stops `#6E675E 0, #A09888 .13, #BDB5A6 .30, #A69E8F .55, #80796D .82, #5C564D 1`. `ame` uses `#6B4A2E, #A8804F .3, #8E6A42 .6, #553A24`. `clay` uses `#8A6446, #C39A72 .3, #AE8560 .6, #6E4E36`. `coffee` is radial `#4E3423 → #2C1D13 → #1C130D`. Alternate objects for other categories (same gate rules): a **river stone** (3-stop radial `#A7A39B → #85817A → #5F5C56`, a specular, a contact shadow) or a **bud vase** (the same glaze recipe with a 6 px neck and one dry stem at 2 px stroke `#6B5B45`).

## Cross-screen moment

- **May cross:** the oak shelf (always full-bleed, so adjacent slides share one continuous shelf at the same y), the stone plinth (bleeds 70–120 px off the edge it touches), soft long shadows, and the washi wash.
- **May not cross:** headline, vertical label, hanko, the cup, and the phone. Each object belongs to one slide, and cutting a cup in half destroys the still-life calm.
- **Frequency:** one plinth crossing per 5–6 slide deck. The shelf continuity is ambient and doesn't count.

## Layout grid & safe zones

All rectangles are `x1–x2 × y1–y2` on 1320 × 2868.

| Zone | Rectangle | Rule |
|---|---|---|
| Text margin | left 100–108, right ≥ 96 | Labels and list at 108; headline glyph box at 100 (optical) |
| Top band | 0–1320 × 0–150 | Empty (App Store crops and rounds) |
| Headline, top variant | 100–900 × 214–600 | Label at y 150, headline at 214, dots to ≈ 580, subhead at 614 |
| Headline, bottom variant | 100–900 × 2380–2790 | Label at 2380, headline at 2444 |
| Vertical-label column | 1015–1224 × 150–600 (top) / 2296–2770 (bottom) | Seal centred under the word |
| Phone, shelf variant | 64–1054 × 716–2733 (left) or 266–1256 (right) | Shelf top = 2727 |
| Phone, plinth variant | 230–1220 × 150–2167 | Plinth top = 2155 |
| Object zone | the shelf corner opposite the text, body overlapping the phone by 60–120 px | Only over the phone's bottom 18% |
| No-go | the phone screen's top 80%; 40 px around headline glyphs; the text column below the headline | No decoration ever |

The empty strip beside the phone (≈ 266 × 2000 px) is the style's *ma* (間). Leave it empty. No horizontal band may exceed 22% (632 px).

## Copy tone

- **Voice:** quiet, considered, noun-led. Say one thing, then stop. Sentence case, and every headline ends with a period.
- **Vocabulary:** kept, placed, slow, one, each, enough, daily, simply, room, quiet, season, peak, at hand, by the day.
- **Punctuation:** periods and commas only. No !, ?, em-dash stacks, ampersands or emoji.
- **Numbers:** spelled out under ten in headlines ("One pour"). Digits are fine in lists and labels.
- **Banned words:** amazing, powerful, ultimate, supercharge, boost, hack, crush, level up, game-changer, revolutionary, seamless, effortless, must-have, insane, 10x, AI-powered, "zen" (cliché), "mindful" (overused), all-caps headlines.

| Category | Example headlines (≤ 6 words, **kenten word** in bold) |
|---|---|
| Coffee | "Beans at their **best**." · "One pour at a **time**." · "A slower **cup**." |
| Notes | "Only what you **need**." · "A quiet **page**." |
| Calendar | "The week, **unhurried**." · "Room for the **day**." |
| Reading | "One chapter, every **evening**." · "Pages, **kept**." |
| Tea | "Leaves, steeped **right**." |
| Journaling | "Ten lines a **day**." · "Today, set **down**." |
| Home & interior | "Less, but **placed**." · "Every room, **measured**." |
| Habits / utilities | "Small things, **daily**." |

## Per-slide breakdown (mandatory)

All slides use the washi background, fibre layer and grain 0.16, except slide 4 (the sumi inversion). The phone is always 990 px wide at 0°.

### Slide 1 — Hero ("Beans at their **best**.")
- **Text:** label `BLOOM · THE SHELF` at (108, 150). Headline 158 px at (100, 214), 2 lines, kenten on "best". Subhead 40 px at (108, 614): "Each bag, kept to its peak window."
- **Phone:** left 64, top 716, **70.3%**, home screen. Shelf at top 2727, full bleed. Contact ellipse at (110, 2715) with size 910 × 34.
- **Decorations:** vertical 旬 `shun · at its peak` at right 96, top 150. Hanko 112 px at (1106, 338). Cup 404 px wide on the shelf, left 902, overlapping the phone's lower-right corner by ≈ 90 px.
- **Must be true:** at 220 px you can read the headline, see an upright phone on a shelf, and find one red seal.

### Slide 2 — Differentiator (mirror of the hero, e.g. "Freshness, by the **day**.")
- **Text:** same top variant. Label `THE SHELF · PEAK WINDOWS`.
- **Phone:** right variant, left 266, top 716, on the shelf. Show the screen that proves the difference (freshness list).
- **Decorations:** 鮮度 `sendo · freshness` top-right, hanko under it. Cup (or stone) on the shelf's **left** end, left 14, overlapping the phone's lower-left by ≈ 90 px.
- **Must be true:** it reads as the hero's mirror, with the text column still flush-left. Only the phone and object swap sides.

### Slide 3 — Feature ("One pour at a **time**.")
- **Phone:** plinth variant, left 230, top 150, timer screen. Plinth at (170, 2155), 1220 × 132, bleeding off the right edge. Contact ellipse at (290, 2151), 870 × 30.
- **Text:** bottom variant. Label `BREW TIMER · GUIDED POURS` at (108, 2380). Headline at (100, 2444).
- **Decorations:** 蒸らし `murashi · the bloom` at 100 px, right 96, top 2296. Hanko 98 px centred under it at top 2662. No object.
- **Must be true:** the composition is inverted from the hero (text at the bottom, phone raised on stone), so the deck breathes.

### Slide 4 — Feature, inverted (sumi, e.g. "Rest, on **schedule**.")
- **Background:** `#1E1D1B` with a wash of `radial-gradient(100% 60% at 14% 6%, #2B2926, #1E1D1B 55%, #171614)`. Fibres inverted (light strands only, opacity .06–.12). Grain 0.22.
- **Text:** washi `#F3F0EA` headline (14.8:1). Labels `#B8B4AC` (8.2:1). Kenten `#C9A97E`.
- **Phone:** left variant on the oak shelf (top face `#D9C3A0`). Caffeine or evening screen.
- **Decorations:** 夜 `yoru · night`, and a hanko with a 3 px `#F3F0EA` inner hairline so it reads on dark. No object.
- **Must be true:** at most one sumi slide per deck, never the hero.

### Slide 5 — Proof / ecosystem ("Always at **hand**.")
- **Phone:** right variant on the shelf, showing the lock-screen or home-screen widgets.
- **Text:** top variant. The subhead may carry one **real** proof line (e.g. rating or awards), 40 px stone-ink, no badge graphics.
- **Decorations:** 手元 `temoto · at hand` plus the hanko. Cup on the left end of the shelf.
- **Must be true:** proof is plain text, with no laurels, stars clip-art or press logos.

### Slide 6 — Closer, no phone ("Only what you **need**.")
- **Text:** top variant with label `BLOOM · COFFEE, KEPT SIMPLY`. 一杯 `ippai · one cup` top-right, hanko at (1106, 470).
- **List:** at (108, 756), 1000 wide, 5 rows × 150 px, 1.5 px `rgba(140,138,133,.55)` rules above each row and below the last. Key: 30 px Kaku caps, 268 px column. Value: 56 px Mincho, one line each.
- **Still life:** shelf at top 2560. Cup 760 px wide (≈ 626 px tall) at left 520. Caption at (108, 2330): app name 84 px Mincho plus label `FOR IPHONE`.
- **Must be true:** the list ↔ cup gap is ≤ 17% (≈ 470 px) and the cup clears all 5 polish gates at full size.

## Adapting to other app categories

| Category | Vertical word | Seal glyph | Object | Copy angle |
|---|---|---|---|---|
| Notes / writing | 余白 *yohaku · white space* | 記 | river stone (paperweight) | what you leave out |
| Calendar / planning | 暦 *koyomi · calendar* | 暦 | bud vase, one stem | room in the week |
| Reading | 読書 *dokusho · reading* | 本 | cup of tea (celadon-free, ash glaze) | the evening ritual |
| Tea | 茶 *cha · tea* | 茶 | yunomi with a paler "shino" glaze `#E8E0D2` | steep, wait, pour |
| Journaling | 日記 *nikki · diary* | 記 | river stone | ten honest lines |
| Home & interior | 住まい *sumai · home* | 家 | bud vase | fewer, better things |
| Sleep / quiet utilities | 静 *sei · stillness* | 静 | none (the seal only) | less noise |

Never add a second accent colour. Swap the object and the words, and keep the palette.

## Dark / inverted & localization notes

- **Inverted:** see slide 4. Everything that was sumi becomes washi. Shadows become `rgba(0,0,0,.45)`. The shelf keeps its oak tones and gains a brighter top face. The seal gets a paper-coloured inner hairline.
- **Long German lines:** keep the 800 px column. Step down 158 → 136 → 120 px, then allow 3 lines. Hyphenate (`hyphens:auto; lang="de"`) before breaking the column. The kenten word must still sit on the last line.
- **Japanese locale:** the headline itself goes Japanese (Shippori Mincho 500, 132–148 px). It may be set vertically (`writing-mode:vertical-rl`) as a column on the right, in which case drop the separate vertical label. Use native kenten above: `text-emphasis: filled sesame #7A5A34`.
- **Chinese / Korean:** Noto Serif SC/TC/KR 500. Chinese emphasis dots go **under** (着重号), Korean dots go **above** (드러냄표). Always set `lang` so glyph variants are correct.
- **RTL (Arabic/Hebrew):** mirror the grid. The headline goes flush-right at x = 1220, the vertical label and seal move to the top-left, and the phone and object swap sides. Headline in `Noto Naskh Arabic` 500 / `Frank Ruhl Libre` 500. Replace kenten with a 2 px `#7A5A34` hairline 18 px under the key word. The Japanese vertical word keeps its orientation.

## Style-specific QA checklist

- [ ] Phone exactly 0°, 960–1020 px wide, visibly **standing** on the shelf or plinth with a contact shadow?
- [ ] Headline flush-left at x ≈ 100, column ≤ 800 px, ≤ 6 words, 2 lines, Mincho 500?
- [ ] Exactly one kenten word, one dot per letter, dots ≥ 40 px clear of any other element?
- [ ] Vermilion appears once (the seal) and nowhere else on the slide outside the screenshot?
- [ ] Seal centred under the vertical word, not floating elsewhere?
- [ ] Japanese word checked in a dictionary, rendered with `lang="ja"`, and its gloss accurate?
- [ ] At most 2 decorations (seal + one object)?
- [ ] Object ≥ 300 px tall (≥ 600 px on a no-phone slide) with a glaze gradient, speckle, specular, contact + long shadow?
- [ ] Fibres invisible at 220 px, visible but not hair-like at 100%?
- [ ] All shadows warm brown and falling down-right (light from the upper left)?
- [ ] One empty *ma* strip beside the phone, and no band > 22%?
- [ ] Labels in `#4E4B46` (never `#8C8A85`), all ≥ 30 px?
- [ ] Shelf at the same y on adjacent slides that share it?

## Common failure modes

1. **Shrinking the phone to "feel minimal."** A 760 px phone (53%) with acres of paper is a §1 fail. *Fix:* keep 990 px and get the calm from asymmetry and the empty strip.
2. **CSS `text-emphasis` on Latin.** You get 79 px dots that break the leading. *Fix:* use the per-letter `::before` recipe at 19 px.
3. **Kenten colliding with the line above.** *Fix:* put the emphasised word on the last line with the dots below it. Never put dots between two Latin lines at 1.05 leading.
4. **Red creep.** Vermilion kenten, red labels or a red CTA dilute the seal. *Fix:* vermilion only in the one hanko.
5. **Clip-art cup.** A flat beige trapezoid with an ellipse on top. *Fix:* follow the 6-layer yunomi recipe, or use the river stone instead.
6. **Machine-translated Japanese.** Phrases, wrong readings or Chinese glyph forms. *Fix:* 1–4 character words from the verified list, `lang="ja"`, and a gloss in romaji plus English.
7. **Floating phone.** No shelf contact and a generic grey shadow. *Fix:* overlap the shelf by 6 px, add the contact ellipse, and use the warm two-stack shadow.
8. **Texture turning into hair.** Light fibres above 0.30 opacity read as scratches. *Fix:* cap them and check at 100%.
9. **Drifting into neighbouring styles.** Italic display serifs, issue numbers, burgundy (→ 10 Magazine Cover) or rounded props, arches, pastels (→ 12 Soft Clay). *Fix:* upright Mincho, no italics, only paper, wood, stone and one seal.

## How to apply this style

1. **Fonts:** add the three `next/font/google` loaders above in `template/src/app/layout.tsx` and expose `--font-mincho`, `--font-kaku` and `--font-seal`.
2. **Theme:** add `quiet-japandi` to `THEMES` in `template/src/lib/constants.ts` (bg `#F3F0EA`, bgAlt `#1E1D1B`, fg `#1E1D1B`, fgAlt `#F3F0EA`, accent `#C8321E`, muted `#4E4B46`).
3. **Tokens & classes:** paste the palette as CSS variables plus the `.wash`, `.fibre`, `.shelf`, `.plinth`, `.vlab`, `.pshadow`, `.contact` and kenten recipes into `globals.css`. Generate `public/washi.svg` once.
4. **Background:** in `slide-canvas.tsx`, have `backgroundFor()` return `#F3F0EA` (or `#1E1D1B` when inverted). Render `.wash`, `.fibre` and grain as the first and last children of each slide.
5. **Staging:** render the shelf or plinth *before* the `Phone` component in DOM order. Set the phone to 990 px at the grid positions, and wrap it in `.pshadow` with a `.contact` ellipse.
6. **Props:** add small `<Hanko glyph>`, `<VerticalLabel jp gloss>` and `<Yunomi width>` components (inline SVG, seeded speckle RNG) to `slide-canvas.tsx`. Render the object *after* the phone so it overlaps the corner.
7. **Headline:** Mincho 500, 158 px, 1.05, −0.012em, flush-left. Split the kenten word into `<span class="k">` letters.
8. **Measure:** check every line ≤ 800 px, the phone ≥ 68%, labels in stone-ink, and the worst sampled background pixel under text ≥ 4.5:1.
9. **Audit:** one seal, ≤ 2 decorations, and the shelf continuous across neighbours. Then run the §10 list and the 220 px thumbnail test.

## What this style is NOT

- Not Magazine Cover Editorial: no italic display serif, no issue numbers, no burgundy, no dense print columns.
- Not Soft Clay Wellness: no clay pebbles, arches, hills, rounded Fraunces or sage/terracotta palette.
- Not "zen" clip art: no bamboo, cherry blossoms, enso brush circles, torii, koi or wave patterns.
- Not cold minimalism: no pure white, no grey UI chrome, no blue.
- Not tilted, floating or glowing phones, and never a replaced bezel.
- Not loud: no exclamation marks, badges, stars, arrows, stickers or gradients-as-decoration.
- Not more than one seal, one object and one emphasised word.
