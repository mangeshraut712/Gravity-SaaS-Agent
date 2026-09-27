---
name: toybox-primary
description: Warm cream or one bright primary per slide, big rounded display type with a raised "toy lip", one word pressed onto a studded 3D block, and chunky extruded toy geometry (ABC cubes, studded bricks, rounded stars, rainbow arcs, clouds, balls) stacked around tilted phones. Joyful, safe, tactile. Inspired by Toca Boca, Khan Academy Kids and LEGO/Fisher-Price packaging.
inspiration: Toca Boca, Khan Academy Kids, Duolingo ABC, Sago Mini, LEGO and Fisher-Price packaging
feel: joyful, safe, tactile — "a parent would hand this to their kid, and a beginner feels welcome"
---

# Toybox Primary

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Canvas:** 1320 × 2868. All px values below are at this size; scale everything by `cW / 1320`.
- **Background = one solid hex per slide** from the slide palette (cream `#FFF6E6`, sunshine `#FFC940`, sky `#3FA9F5`, grass `#4CC26E`, grape-night `#6C3FDB`). No gradients, no vignette. Grain overlay at **6–8%** (`mix-blend-mode: overlay`) is mandatory: it is the "matte plastic" texture.
- **Headline:** Baloo 2 **800**, **190–214px** (2 lines) or **168–184px** (3 lines), `line-height: .9`, `letter-spacing: -0.025em`, `white-space: nowrap` per line, and a **40px** extra gap above any line that carries the block word (the studs need room). Widest line ≤ **1160px** (88%) measured *including* the block's extrusion.
- **Toy lip is mandatory on every headline:** a 12px stepped extrusion (`0 3/6/9/12px 0` in the lip colour) plus a soft contact shadow (`0 34px 28px rgba(58,36,16,.20)`). A headline without the lip = fail. A blurred-only shadow = fail.
- **Exactly one block word per headline.** It sits on a studded 3D block (front face + 26px lighter top band + 22px side extrusion + 2 studs + soft contact shadow). Text on the block is ink `#1F1A4D` on yellow/sky/green/red, white on grape `#7A48EE`. Two block words = fail.
- **Headline colour is ink `#1F1A4D`** (14.9:1 on cream, 10.4 on sunshine, 6.3 on sky, 7.0 on grass). On the grape-night slide the headline flips to white `#FFFFFF` (6.2:1) with lip `#3E2396`. Never ink on grape `#8C5CF5` (3.8:1) and never white on sky, grass, tomato or sunshine.
- **Phone:** 68–78% of canvas height visible (1950–2240px), width **1040–1080px**, tilt **3°–8°**, one direction per slide, alternating across the deck. 0° = fail, > 8° = fail.
- **Decoration density: 8–12 toy objects per slide** (maximalist-but-organised). Every object ≥ **150px** in its largest dimension. Nothing smaller than 150px ("confetti") is allowed. At least one object bleeds off a canvas edge by 20–45%.
- **Every toy object clears ≥ 4 of the 5 §3 polish gates:** ≥ 3 fill tones (top light / front base / side dark), a blurred contact shadow `rgba(58,36,16,.20–.25)`, grain texture, a specular highlight (white 45–70% ellipse or bevel line), and rounded corners (`stroke-linejoin: round`, stroke width = 28% of the shortest edge).
- **No characters.** No faces, eyes, mascots, animals with expressions, or hands. The toys are the motif. (Faces = style 01 or 11 territory.)
- **Headline zone is sacred:** toy objects may sit beside the headline (e.g. a star after a short first line) but never overlap a letter or the block word, including its studs and shadow.

## Vibe summary

This is the look of an app you'd trust in a small child's hands, or in the hands of someone brand-new to a hobby. Every slide feels like the lid of a toy box: a warm cream or one bright primary colour, a big friendly rounded headline that looks moulded out of plastic (a stepped "toy lip" under every letter), and one word pressed onto a chunky studded block, as if someone snapped it into place. Around a gently tilted phone sit real-feeling toys built from simple geometry: ABC cubes with embossed letters, 2×2 studded bricks, rounded puffy stars, a five-band rainbow arc with clouds at its feet, a striped ball, stacked number cubes. Everything is rounded, lit from the top-left, and rests on a soft contact shadow. It is bright but never harsh, busy but never messy. Each toy is big, and there are about ten of them, never a hundred tiny ones. The copy talks like a kind teacher: short, simple, encouraging.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FFF6E6` | Default slide bg (hero, proof) |
| `--ink` | `#1F1A4D` | Headlines, subheads, block-word text, tag text |
| `--lip` | `#3B3190` | Headline toy-lip extrusion on light slides |
| `--muted` | `#5B5480` | Small captions on cream (6.5:1) |
| `--tomato` | `#FF4B3E` | Toy objects; text brick (ink text, flat face only, 4.8:1) |
| `--tomato-top` / `-side` / `-deep` | `#FF8A7C` / `#D9362B` / `#A8241B` | Top face, side face, deepest shade/extrusion |
| `--sunshine` | `#FFC940` | Slide bg C; default block-word fill |
| `--sunshine-top` / `-side` / `-deep` | `#FFE38A` / `#E8A51C` / `#B37C0C` | |
| `--sky` | `#3FA9F5` | Slide bg B; block fill on sunshine slides |
| `--sky-top` / `-side` / `-deep` | `#8CCDFB` / `#1E86D6` / `#135E9E` | |
| `--grass` | `#4CC26E` | Slide bg D; bricks |
| `--grass-top` / `-side` / `-deep` | `#8FDEA6` / `#2FA052` / `#1F7438` | |
| `--grape` | `#8C5CF5` | Toy objects only (stars, cubes, balls) |
| `--grape-top` / `-side` / `-deep` | `#B795FB` / `#6C3FDB` / `#4D2AA6` | |
| `--grape-block` | `#7A48EE` | Text-bearing grape brick (white text, 5.3:1) |
| `--grape-night` | `#6C3FDB` | Inverted slide bg (white headline 6.2:1) |
| `--cloud` / `--cloud-shade` | `#FFFFFF` / `#D8E8F6`, underside `#B9D3EA` | Clouds |
| `--shadow` | `#3A2410` at 20–25% | All contact shadows (warm brown, never pure black) |

**Slide order for 6 slides:** cream → grass → sky → grape-night → cream → sunshine. Never two adjacent slides in the same colour. Toy objects use every hue *except* the slide's own bg hue (no yellow star on a sunshine slide; the rainbow swaps its yellow band for cream on sunshine).

## Typography

**Google Fonts (first choice):**
```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@700;800;900&display=block" rel="stylesheet">
```
```ts
// template/src/app/layout.tsx
import { Baloo_2, Nunito } from "next/font/google";
const display = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const ui = Nunito({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-ui" });
// <body className={`${display.variable} ${ui.variable}`}>
```

| Role | Face | Size @1320 | Leading | Tracking | Colour |
|---|---|---|---|---|---|
| Headline | Baloo 2 800 | 190–214px (2 lines), 168–184px (3 lines) | .90 | -0.025em | ink (white on grape-night) |
| Block word | same as headline | same | .90 | -0.025em | ink (white on grape brick) |
| Subhead | Nunito 800 | 48–52px, max 2 lines | 1.22 | -0.005em | ink |
| Feature brick label (closer) | Baloo 2 800 | 84–96px | 1.0 | -0.01em | per brick table |
| App tag | Baloo 2 800 | 56–60px + 96px icon | 1.0 | 0 | ink |
| Letters on ABC cubes | Baloo 2 800 | 78% of the cube edge | — | — | white + 55% deep-shade offset copy |

**Alternates:** Google: **Fredoka 700** (reduce size 4%), **Nunito 900** (reduce size 6%, lip 10px). Commercial: VAG Rounded Next Black, Filson Soft Heavy, Sofia Pro Soft Black, Gelion Black. Never a geometric sharp grotesk, serif, script or condensed face.

**Case:** sentence case with a terminal period ("Coffee, made easy."). The period is part of the friendliness. Never ALL CAPS except single letters/numerals on cubes.

## Headline emphasis (signature)

The emphasis is a **physical block**, not a colour change. The chosen word is "snapped onto" a chunky block:

```css
.hl { position:absolute; font:800 204px/.9 'Baloo 2'; letter-spacing:-.025em; color:#1F1A4D; white-space:nowrap;
  text-shadow: 0 3px 0 #3B3190, 0 6px 0 #3B3190, 0 9px 0 #3B3190, 0 12px 0 #3B3190, 0 34px 28px rgba(58,36,16,.20); }
.hl .ln { display:block } .hl .ln + .ln { margin-top:40px }   /* stud clearance */
.blk { position:relative; display:inline-block; padding:.04em .2em 0; margin:0 .04em; border-radius:40px;
  color:#1F1A4D; text-shadow:0 6px 0 var(--s);
  background:linear-gradient(180deg, var(--t) 0 26px, var(--b) 26px 72%, var(--b2) 100%);
  box-shadow: 0 22px 0 var(--s), 0 22px 0 3px var(--s), 0 56px 44px rgba(70,40,10,.30),
              inset 0 -12px 22px rgba(0,0,0,.07), inset 0 3px 0 rgba(255,255,255,.55); }
.stud { position:absolute; top:-30px; width:104px; height:40px; border-radius:0 0 12px 12px;
  background:linear-gradient(90deg, var(--s) 0, var(--t) 28%, var(--b) 55%, var(--s) 100%); }
.stud::before { content:""; position:absolute; left:0; right:0; top:-19px; height:38px; border-radius:50%;
  background:radial-gradient(ellipse at 38% 38%, rgba(255,255,255,.75) 0 14%, var(--t) 38%, var(--b) 100%); }
.y  { --t:#FFE38A; --b:#FFC940; --b2:#F7B82E; --s:#E0A21C }   /* default */
.bl { --t:#9ED6FC; --b:#3FA9F5; --b2:#2F9BEA; --s:#1E7FCC }   /* on sunshine slides */
.g  { --t:#9BE3B0; --b:#4CC26E; --b2:#3FB462; --s:#2A9A4C }
.r  { --t:#FF9A8E; --b:#FF4B3E; --b2:#FF4B3E; --s:#CC3025 }   /* flat face: ink 4.8:1 */
.gp { --t:#B795FB; --b:#7A48EE; --b2:#6D3CE0; --s:#5530B8; color:#fff; text-shadow:0 5px 0 #3E2396 }
```
```html
<div class="hl"><span class="ln">Coffee,</span>
  <span class="ln">made <span class="blk y"><i class="stud" style="left:16%"></i><i class="stud" style="left:58%"></i>easy.</span></span></div>
```

Rules: 2 studs on a headline block (at 14–18% and 54–58% of its width), 4 studs on a closer brick (10/30/60/80%). The block is the **last word of the last line** (or the whole last line), never mid-line. Block fill must differ from the slide bg: yellow on cream/sky/grass, sky on sunshine, yellow on grape-night. Rotation 0° (headline stays level). Only closer bricks rotate, ±0.5–2°.

## Phone / device frame treatment

- Always the template's default iPhone bezel (`public/mockup.png` via the `Phone` component in `src/components/editor/device-frames.tsx`). Never a drawn frame, never bezelless.
- **Width 1040–1080px**, tilt **3°–8°**, alternate direction per slide (hero −5°, differentiator +4°, feature −6°, feature 2 +5°, proof −4°).
- **Two anchors only:** (a) *bottom-bleed*: top edge 850–900px, bottom bleeds 150–270px; (b) *top-bleed*: top edge −170 to −220px, bottom at 1990–2060px, headline below the phone. Use both in a deck; never centre the phone with empty bands above and below.
- **Shadow stack (warm on light bgs):** `filter: drop-shadow(0 60px 70px rgba(120,70,20,.26)) drop-shadow(0 14px 18px rgba(70,40,10,.20))`.
  On sky: `drop-shadow(0 44px 54px rgba(12,60,130,.30)) drop-shadow(0 12px 16px rgba(10,40,90,.24))`. On grass: `rgba(20,90,40,.30)` / `rgba(10,60,25,.24)`. On grape-night: `rgba(30,10,80,.45)` / `rgba(20,5,60,.30)`.
- **Nesting:** the phone is "in the toy box". 1–3 toy objects overlap the bezel's lower corners (z-index above the phone), covering ≤ 12% of the screen area and never the UI element the headline talks about.
- Real app UI only, light or dark as the app ships.

## Background treatment

```css
.slide { background:#FFF6E6; }            /* one hex, from the slide order */
.grain { position:absolute; inset:0; pointer-events:none; mix-blend-mode:overlay; opacity:.07; z-index:9;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
```
No floor plane, no horizon, no hills, no confetti field, no patterned wallpaper. Contact shadows alone ground the objects.

## Decorative accents

Build every toy as inline SVG with the **three-tone rule**: top face = `-top`, front/left = base (with a gradient to 55% `-side` at the bottom), right side = `-side` → `-deep`. Round every polygon by stroking it in its own fill colour with `stroke-linejoin: round`, stroke width = 28% of the shortest edge.

| Toy | Size (largest dim) | Per slide | Notes |
|---|---|---|---|
| ABC / number cube (isometric) | 290–430px (edge 170–250) | 2–3 | Embossed white letter or numeral on the left face, stack cubes into towers |
| Studded brick 2×2 / 2×4 (isometric) | 400–560px | 0–1 | Top-face studs with elliptical tops |
| Headline block word | — | 1 | Counts as one decoration |
| Rounded star | 170–250px | 1 | 10-vertex star, 18px extrusion, 12° tilt |
| Rainbow arc | 420–680px wide | 0–1 | 5 bands, clouds hide both feet |
| Cloud | 170–260px | 1–3 | White with blue-grey underside |
| Striped ball | 170–230px | 1 | Rests *on* something (cube top) or bleeds off an edge |
| Cylinder / ring stack | 150–260px | 0–1 | Stacked cylinders of decreasing radius = a ring-stacker toy |
| App tag (icon + name) | 96px icon | 1 (hero, closer) | Not counted |

**Isometric cube (edge a = 200, copy and recolour):**
```html
<svg width="482" height="576" viewBox="0 0 482 576" style="overflow:visible">
  <defs>
    <linearGradient id="L" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF4B3E"/><stop offset="1" stop-color="#D9362B" stop-opacity=".55"/></linearGradient>
    <linearGradient id="R" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9362B"/><stop offset="1" stop-color="#A8241B"/></linearGradient>
    <radialGradient id="T" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#FF8A7C" stop-opacity="0"/></radialGradient>
    <filter id="blur14"><feGaussianBlur stdDeviation="14"/></filter><filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <ellipse cx="255" cy="458" rx="180" ry="80" fill="#3A2410" opacity=".22" filter="url(#blur14)"/>          <!-- contact shadow -->
  <polygon points="68,168 241,268 241,468 68,368"  fill="#FF4B3E" stroke="#FF4B3E" stroke-width="56" stroke-linejoin="round"/>
  <polygon points="68,168 241,268 241,468 68,368"  fill="url(#L)"/>                                              <!-- left/front face -->
  <polygon points="241,268 414,168 414,368 241,468" fill="#D9362B" stroke="#D9362B" stroke-width="56" stroke-linejoin="round"/>
  <polygon points="241,268 414,168 414,368 241,468" fill="url(#R)"/>                                             <!-- right/side face -->
  <polygon points="241,68 414,168 241,268 68,168"  fill="#FF8A7C" stroke="#FF8A7C" stroke-width="56" stroke-linejoin="round"/>
  <polygon points="241,68 414,168 241,268 68,168"  fill="url(#T)"/>                                              <!-- top face -->
  <polyline points="74,193 241,293 408,193" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="15" stroke-linecap="round" filter="url(#blur3)"/> <!-- bevel -->
  <g transform="matrix(.866,.5,0,1,155,318)">                                                                   <!-- letter mapped onto left face -->
    <text x="3" y="61" text-anchor="middle" font-family="&quot;Baloo 2&quot;" font-weight="800" font-size="156" fill="#A8241B" opacity=".55">A</text>
    <text x="0" y="56" text-anchor="middle" font-family="&quot;Baloo 2&quot;" font-weight="800" font-size="156" fill="#fff">A</text></g>
</svg>
```
Geometry for any box (wx, wy, h, k = .866): `R = T + (wx·k, wx·.5)`, `L = T + (−wy·k, wy·.5)`, `B = R + (−wy·k, wy·.5)`; faces: top `T R B L`, left `L B B+h L+h`, right `B R R+h B+h`. **Stacking:** a cube of the same edge placed at the same x and `y − a` sits exactly on the one below. Draw the upper cube later (higher z), and drop its contact shadow.

**Stud (on an iso top face, radius s = 40):**
```html
<ellipse cx="0" cy="22" rx="40" ry="23" fill="#2FA052"/><rect x="-40" y="0" width="80" height="22" fill="#2FA052"/>
<rect x="-40" y="0" width="36" height="22" fill="#4CC26E"/><ellipse cx="0" cy="0" rx="40" ry="23" fill="#8FDEA6"/>
<ellipse cx="-10" cy="-5" rx="18" ry="8" fill="#fff" opacity=".55"/>
```

**Rounded star (size S = 230):** 10 vertices, outer radius S/2, inner 0.52 × outer, rotated −90° start. Draw 1) deep copy `translate(0, .09S)`, 2) base fill with same-colour stroke `.12S` round joins, 3) radial gradient `top → base (60%) → side`, 4) highlight ellipse `rx .2R, ry .09R` rotated −30° at (−.18R, −.3R), 5) contact shadow ellipse below.

**Rainbow (outer radius R = 250, band 40):** five `A` arcs, one per band (tomato, sunshine, grass, sky, grape; on sunshine slides replace sunshine with cream `#FFFDF7`). Each band: a deep-shade copy `translate(0,16)` first, then base stroke, then a 22%-width `-top` highlight stroke inset 18%. Add one blurred white streak on the outer band's left shoulder. **Both feet must be hidden** by clouds or by bleeding off the canvas bottom. A flat cut-off foot = fail.

**Cloud (width w):** 8 overlapping circles (centres on a 400-unit grid: `110,150,70 · 190,110,90 · 285,135,75 · 340,175,48 · 62,182,44 · 150,190,40 · 240,192,40 · 300,190,36`), filled with a vertical gradient `#FFFFFF 35% → #D8E8F6`, an underside copy in `#B9D3EA` offset +14 units, and a blurred white ellipse highlight.

**Ball:** circle with radial gradient `top → base 55% → deep`, a clipped stripe band in a second primary (curved `Q` path), a 4px 8% black rim, a white highlight ellipse at (−.36R, −.42R), and a contact shadow `rx .72R`.

## Layout grid & safe zones

| Zone (px rectangle x0,y0 → x1,y1) | Bottom-bleed layout (hero, differentiator, proof) | Top-bleed layout (feature slides) |
|---|---|---|
| Margins | left/right 80px for text; toys may bleed | same |
| App tag | 84,96 → 400,192 (hero only) | omit |
| Headline block | 80,210 → 1160,630 | 80,2060 → 1180,2480 |
| Subhead | 86,672 → 800,800 | 86,2548 → 800,2670 |
| Phone box | 190,850 → 1290,2868 (bleed) | 10,−220 → 1290,2040 |
| Toy zone A (beside headline) | 900,90 → 1320,440 *only* if line 1 ends before x 860 | 860,1350 → 1320,2000 (tower on phone corner) |
| Toy zone B | 850,600 → 1320,860 (rainbow + clouds above phone corner) | 0,250 → 200,1400 (left edge: star, cloud) |
| Toy zone C | 0,1850 → 480,2868 (tower, bleeds left) and 880,2300 → 1320,2868 | 900,2560 → 1320,2868 (rainbow bleeding bottom) |
| **No-toy zones** | headline + subhead rectangles plus 24px; the central 60% of the phone screen | same |

Measured on the sample deck: hero phone visible 2021px (70.5%), feature phone visible 2039px (71.1%). No empty band exceeds 11% of canvas height.

## Cross-screen moment

- **May cross the seam:** the rainbow arc (its middle bands, never its feet), a cloud, the striped ball, or one cube of a tower. 15–30% of the object crosses. The object reads as complete toy geometry on both crops.
- **May not cross:** any headline, the block word, studs of the block word, brick labels, the app tag, the phone screen, letters/numerals on cubes (a cube may cross only on its blank right face).
- Frequency: one moment per 5–6 slide deck. Good default: slide 2 → 3, a rainbow arcs from the grass slide into the sky slide, one cloud on each side of the seam hiding the feet.

## Copy tone

- **Voice:** a kind, patient teacher or a parent cheering from the sofa. Second person, present tense, simple one- and two-syllable words, one idea per line. Encouraging, never babyish. The adult buying the app must trust it.
- **Vocabulary:** easy, little, big, first, step by step, together, ready, just right, well done, you've got this, play, try, help, every, friendly, cozy, happy.
- **Banned words:** revolutionary, seamless, leverage, optimise, AI-powered (as a headline), gamified, dopamine, crush it, hustle, grind, slay, lowkey, bestie, genius, hack, addictive, "for dummies", "idiot-proof", any fear/urgency ("don't miss", "before it's too late").
- **Punctuation:** end every headline with one period. Commas are welcome ("Coffee, made easy."). No question marks, no exclamation marks in headlines (one is allowed in a brick label on the closer only), no emoji anywhere.
- **Length:** headline ≤ 5 words, block word ≤ 6 characters where possible. Subhead ≤ 12 words, two lines.

**Example headlines (block word in brackets):**
- Coffee / beginner hobby: `Coffee, / made [easy].` · `It counts / every [pour].` · `You've got / [this].`
- Kids learning: `Learning feels / like [play].` · `Little steps, / big [wins].`
- Reading for kids: `One more / [page].`
- Language learning: `Hello in / ten [ways].` · `Say it / out [loud].`
- Family organiser: `The whole / family, [sorted].`
- Chores / allowance: `Chores, / but [fun].`
- Casual game: `Tap, stack, / [smile].`
- Pet care: `Happy pets, / happy [you].`
- Beginner fitness: `Your first / [push-up].`
- Bedtime / sleep for kids: `Calm little / [nights].`
- Money for teens: `Save it / step by [step].`

## Per-slide breakdown (mandatory)

### Slide 1 — Hero (cream `#FFF6E6`, bottom-bleed)
- **Tag:** icon 96px + "Bloom" Baloo 2 800 60px at (84, 96).
- **Headline:** `Coffee, / made [easy].` 204px at left 80, top 210; line 2 has the yellow block (2 studs). Measured box 80,210 → 1156,625.
- **Subhead:** Nunito 800 50px at (86, 672), 2 lines: "Know when beans taste best, / then brew them step by step."
- **Phone:** home screen, 1080px wide, left 190, top 890, tilt −5°, warm shadow stack. Visible 70.5%.
- **Toys (8):** yellow star 230px at (960, 90) rotated 12°; rainbow R 210 at (880, 620) with clouds 170px at (850, 770) and (1180, 770) hiding its feet, tucked behind the phone's top-right corner; ABC tower bleeding left: blue "B" cube edge 210 at (−70, 2440), red "A" cube stacked at (−70, 2230), grape striped ball 180px resting on the red cube's top face; green 2×4 studded brick (360 × 200 × 150) at (900, 2440) over the phone's bottom-right corner.
- **Must be true:** the headline and the block word read at 220px wide, and the tower's letters are both visible (stacked, not overlapping faces).

### Slide 2 — Differentiator (grass `#4CC26E`, bottom-bleed)
- **Headline:** `Beans say / when they're [ready].` — if the widest line exceeds 1160px, drop to 3 lines at 176px. Yellow block. Top 200.
- **Subhead:** "Bloom tracks every bag's best days." Nunito 800 50px, ink (7.0:1).
- **Phone:** shelf screen, 1060px, left 150, top 880, tilt +4°, grass shadow.
- **Toys (8–10):** ring-stacker (3 cylinders r 110/90/70, tomato/sunshine/sky) standing bottom-left, bleeding; a 2×2 sky brick at the phone's bottom-right corner; rainbow crossing the right seam into slide 3 (cross-screen moment) with a cloud on each side; sunshine star top-right beside line 1; grape ball bleeding off the left edge at y ≈ 1500.
- **Must be true:** the freshness UI (bars/badges) the headline refers to is uncovered.

### Slide 3 — Feature (sky `#3FA9F5`, top-bleed)
- **Phone:** timer screen, 1060px, left 120, top −170, tilt −6°, sky shadow. Visible 71.1%.
- **Headline:** `It counts / every [pour].` 204px, left 80, top 2060 (box 80,2060 → 1175,2475). Yellow block.
- **Subhead:** "A friendly timer tells you / when to pour, and how much." at (86, 2548).
- **Toys (9):** number tower 1-2-3 (tomato/grass/grape cubes, edge 160) at x 1010, cube tops at y 1690/1530/1370, overlapping the phone's bottom-right corner (the numbers mirror the pour steps); red striped ball 170px at (860, 1830) at the tower's foot; star 180px at (−40, 300) on the phone's left edge; clouds 260px at (−90, 1180) and 200px at (1110, 380); rainbow R 230 bleeding off the bottom-right at (930, 2620) with a cloud at (1150, 2740).
- **Must be true:** the headline sits ≥ 20px below the phone's shadow. The phone's shadow darkening the sky must not push ink contrast under 4.5:1 (measured 5.65 worst on the sample).

### Slide 4 — Feature 2 (grape-night `#6C3FDB`, bottom-bleed, inverted)
- **Headline:** white, lip `#3E2396`: `Sleep-ready / by [bedtime].` at 184px (3-line fallback 170px). Block: yellow with ink text.
- **Subhead:** white Nunito 800 48px: "See how much caffeine is still in your system."
- **Phone:** caffeine screen, 1060px, left 170, top 900, tilt +5°, night shadow.
- **Toys (8):** three yellow stars (170–230px) at different depths (the largest sharp, the smallest with 2px blur for depth); two clouds with the underside colour switched to `#C9B8F5`; a crescent is allowed only as a *cylinder-extruded* shape (two-tone + extrusion), never a flat icon; a sky cube tower bleeding bottom-left.
- **Must be true:** white text only here. Every other element keeps the three-tone toy rule even at night.

### Slide 5 — Proof / ecosystem (cream, bottom-bleed)
- **Headline:** `Peek from / your [home] screen.` (3 lines at 176px if needed), yellow block.
- **Phone:** home-screen-widgets screenshot, 1040px, tilt −4°.
- **Widget tiles:** 2 real widget PNGs from the app, each mounted on a toy base: widget image with 36px radius sitting on a 22px `-side` extrusion (`box-shadow: 0 22px 0 #1E86D6, 0 50px 40px rgba(70,40,10,.28)`), rotated ±4°, 420–520px wide, overlapping the phone's left and right edges by 25–35%.
- **Toys (6–8 + 2 tiles):** grass 2×4 brick bottom-right, ABC tower bottom-left, star, 2 clouds. Proof numbers (ratings, downloads) go on a brick label only if real.
- **Must be true:** widget PNGs are the app's real widgets, not redrawn.

### Slide 6 — Closer: the brick tower (sunshine `#FFC940`, no phone)
- **Headline:** `You've got / [this].` 204px, centred, top 170 (box 0,170 → 1320,585). Sky block (a yellow block would vanish on sunshine).
- **Brick tower:** 5 feature bricks, Baloo 2 800 92px, padding `54px 70px 40px`, radius 44px, 4 studs each, centred, stacked with a **218px stride** so each brick's studs tuck under the brick above. Rotations −1.5°, +1°, −0.5°, +1.5°, −1°; x-offsets −20/+30/0/+30/−10px. Colours top→bottom: sky, tomato, grass, grape-block (white text), sky. Top at 960. Measured widest brick 67 → 1261 (in canvas).
- **Labels:** the app's five features in plain words: "Fresh-bean alerts", "Step-by-step timer", "Recipes for every brewer", "Caffeine & sleep", "A cozy coffee journal".
- **Toys (7):** red ball 180px at (50, 620), grape star 220px at (1030, 600); rainbow (cream middle band) at (−130, 2330) with clouds on both feet; tomato "A" + grass "B" cubes bleeding off the bottom-right.
- **Tag:** icon + "Bloom" at (640, bottom 120).
- **Must be true:** the tower reads as one stacked toy (no gaps), and every label clears 4.5:1 (sample: tomato 4.82, grape 5.11, sky 6.25, grass 6.97).

## Adapting to other app categories

| Category | Bg rotation | Toy motif swaps | Block-word angle | Example |
|---|---|---|---|---|
| Kids learning / ABC | cream → sky → grass → sunshine | ABC cubes spell a 3–4 letter word, abacus = stacked balls on a cylinder rod | the win (`play`, `learn`, `wins`) | `Learning feels / like [play].` |
| Language learning | cream → grape-night → sky | cubes with letters from the target alphabet (see CJK notes), a speech-bubble made as an extruded rounded rectangle | the action (`say`, `loud`) | `Say it / out [loud].` |
| Family organiser | cream → grass → sunshine | a stacked "house" (cube + triangular roof prism), calendar as a studded brick with day numerals | togetherness (`sorted`, `together`) | `The whole / family, [sorted].` |
| Casual / puzzle game | sky → grape-night → sunshine | stacks of cubes mid-topple (±12° each), a ball mid-bounce with a second faded shadow | the verb (`stack`, `smile`) | `Tap, stack, / [smile].` |
| Pet care | cream → grass → sky | a bone as two balls + cylinder, a paw print as extruded rounded pads (no faces) | the outcome (`happy`, `healthy`) | `Happy pets, / happy [you].` |
| Chores / allowance | sunshine → cream → grass | coins as extruded cylinders with embossed stars, a piggy-bank shape only if faceless | the reward (`fun`, `earned`) | `Chores, / but [fun].` |
| Beginner fitness | grass → sky → cream | number cubes counting reps, a dumbbell as two cylinders + rod | the first step (`first`, `one`) | `Your first / [push-up].` |
| Kids bedtime / calm | grape-night → sky → cream | stars, clouds, extruded crescent, no bright tomato | softness (`calm`, `cozy`) | `Calm little / [nights].` |

## Dark / inverted & localization notes

- **Inverted slide:** only grape-night `#6C3FDB` (white 6.2:1). The headline turns white with lip `#3E2396`. The block stays yellow with ink text. The contact shadow becomes `rgba(20,5,60,.35)`. Toys keep their daytime colours. Never invert to black or navy. The style must stay bright.
- **Long German/Finnish/Dutch lines:** run the width pass first (widest line ≤ 1160px including the block's 22px extrusion). Steps: 3 lines at 176px → shorten the block word (choose a short noun) → hyphenate at a compound boundary with a real hyphen. Never go below 160px. Brick labels drop to 80px, then break onto 2 lines inside a taller brick (line-height 1.02, bottom padding +10px).
- **CJK:** headline in **M PLUS Rounded 1c 800** (Japanese), **Jua 400** (Korean, visually heavy already) or **ZCOOL KuaiLe** / Noto Sans SC 900 (Chinese). Size ×0.82, `letter-spacing: 0`, line-height 1.05. The block holds 1–3 characters. Keep the 12px lip. Cube letters may be kana/hangul.
- **RTL (Arabic/Hebrew):** Arabic in **Baloo Bhaijaan 2 800** (same family), Hebrew in **Varela Round** at 700-equivalent (add a 1px same-colour text-stroke). Mirror the layout: text right-aligned at right 80px, towers bleed off the right, phone tilts mirror. The block word is still the *last* word in reading order (leftmost). Letters on cubes are never mirrored.
- **Devanagari:** Baloo 2 covers it natively. Line-height 1.1 to clear matras, and add 24px to the stud gap.

## How to apply this style

1. **Fonts:** in `template/src/app/layout.tsx` add `Baloo_2` (600/700/800) and `Nunito` (700/800/900) from `next/font/google` as `--font-display` / `--font-ui` (snippet above).
2. **Theme:** add a `toybox-primary` entry to `THEMES` in `template/src/lib/constants.ts` (flat fallback: bg `#FFF6E6`, bgAlt `#3FA9F5`, fg `#1F1A4D`, fgAlt `#1F1A4D`, accent `#6236D9`, muted `#5B5480`). Keep the full token table (base/top/side/deep per hue) in a `TOYBOX` constant for the SVG toys.
3. **Background:** in `slide-canvas.tsx`, for this theme render the slide's flat hex from the slide order plus the 7% grain div. No blobs or gradients.
4. **Headline:** render each line as a nowrap block with `.hl` styles scaled by `cW/1320`. Wrap the chosen word in `.blk` + colour class + 2 `.stud` children. Measure the widest line (`getBoundingClientRect` on the line including the block) and step the size down 4px until ≤ 88% of `cW`.
5. **Toys:** create `IsoBox`, `Stud`, `ToyStar`, `Rainbow`, `Cloud`, `ToyBall`, `Cylinder` components (inline SVG, recipes above). Each takes a hue token and a size. Expose them as movable `SlideElements` with default positions from the per-slide breakdown.
6. **Phone:** the existing `Phone` component inside a wrapper with `transform: rotate(3–8deg)` and the bg-tinted two-shadow `filter`. Choose bottom-bleed or top-bleed per slide. Put 1–3 toys at a higher z-index over the bezel's lower corners.
7. **Stacking:** compute stacked cube positions from the geometry (`y − a`) rather than eyeballing, and remove contact shadows on upper cubes. Balls sit on a cube's top-face centre `(x + pad + a·.866, y + pad + a·.5)`.
8. **Contrast pass:** ink on cream/sunshine/sky/grass, white only on grape-night and grape bricks. Render once with text hidden, sample the pixels under each glyph and assert ≥ 4.5:1 (phone shadows on sky are the usual culprit).
9. **Density pass:** count 8–12 toys (≥150px each), confirm ≥ 1 bleed, confirm no toy intersects the headline rectangle + 24px.
10. **Thumbnail test** at 220px: the headline + block word, the phone and at least 3 recognisable toys (cube, star, rainbow) must read.

## Style-specific QA checklist (all must be "yes")

1. Does every headline have the 12px stepped toy lip plus soft contact shadow?
2. Is there exactly one block word per headline, with 2 visible studs that don't touch the line above?
3. Is the block colour different from the slide bg, and does its text clear 4.5:1 against the block's lowest (darkest) band?
4. Is every toy built from ≥ 3 tones (top/front/side) with rounded corners?
5. Does every grounded toy have a warm brown contact shadow (not black, not missing)?
6. Are all toys ≥ 150px, with 8–12 per slide and ≥ 1 bleeding off an edge?
7. Are stacked cubes geometrically aligned (same x, `y − a`), with every embossed letter/numeral fully visible?
8. Are both rainbow feet hidden (clouds or canvas bleed)?
9. Is the phone tilted 3–8°, 1040–1080px wide, and ≥ 68% of the canvas height visible?
10. Is the slide bg one flat hex with 6–8% grain and no gradient?
11. Is the palette free of faces, mascots, and eyes?
12. Does the copy end in a period, use simple words, and avoid every banned word?
13. Does each adjacent slide pair use different bg colours, with bottom-bleed and top-bleed layouts both present in a 5+ slide deck?

## Common failure modes

| Failure | Why it happens | Fix |
|---|---|---|
| Toys look like flat clipart icons | one fill per shape, no side face | Use the iso box recipe: top/left/right faces + bevel line + contact shadow |
| Block-word studs crash into the line above | default line-height .9 | Add `margin-top: 40px` to the line carrying the block |
| Stacked cubes interpenetrate and hide the letter | positions eyeballed, different edge sizes | Same edge, same x, `y − a`; the upper cube gets a higher z and no shadow |
| A yellow band/star vanishes on the sunshine slide | using every hue on every slide | Drop the slide's own hue from its toys; swap the rainbow band to cream |
| Rainbow ends in a flat coloured stub | feet left visible | Cover both feet with clouds or bleed them off the canvas bottom |
| "Confetti" of 30 tiny shapes | reading "maximalist" as "many" | 8–12 objects, each ≥ 150px; delete anything smaller |
| Headline fails contrast near the phone | the phone's drop shadow darkens the bg under the letters | Move the headline ≥ 20px clear of the shadow or soften the shadow alpha to ≤ .30 |
| White headline on sky/grass/tomato | "kids apps use white type" | Ink on all light/primary slides; white only on grape-night |
| Floating ball with a shadow on nothing | ball placed in open air | Rest it on a cube top, at a tower's foot, or bleed it off an edge |
| Looks like Candy Pop Social (11) | ink outlines + hard offset shadows + stickers | No outlines, no hard ink offsets on toys: soft contact shadows and 3-face volume only |
| Looks like Soft Clay (12) | muted palette, pebbles, hills | Full-saturation primaries, geometric blocks, no ground/hills |

## What this style is NOT

- NOT a mascot style: no characters, faces, eyes, gloves or animals with expressions (that is 01 Retro Rubberhose).
- NOT flat sticker/chat pop: no ink outlines, no hard ink offset shadows on decorations, no chat bubbles or reaction pills (that is 11 Candy Pop Social).
- NOT glossy chrome 3D: no mirror reflections, no iridescent gradients, no purple-night glam (that is 06).
- NOT soft clay: no muted earth tones, pebbles, arches or hills (that is 12).
- NOT pastel: colours are full primaries, and the only light bg is warm cream.
- NOT tiny confetti, emoji, sparkles or doodles. Every ornament is a chunky toy you could pick up.
- NOT babyish copy: no "yummy", "teehee", misspellings or baby talk. Simple words, adult-trustworthy.
- NOT a replacement bezel: the default iPhone frame stays.
- NOT any real toy brand's logo, minifigure, or trademarked brick proportions/lettering. The studs are generic, and "inspired by" means the tactility, not the assets.
