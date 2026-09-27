---
name: soft-clay-wellness
description: Oat, sage and terracotta slides with soft plasticine-3D pebbles, sun discs, rolling hills and arch windows framing an upright phone. Rounded serif headlines, one italic word. Slow, grounded, tactile. Inspired by Calm, Headspace and Aesop packaging.
inspiration: Calm, Headspace (2024 rebrand), Finch, Rise Science, Stoic, Aesop packaging
feel: slow, grounded, tactile, "take a breath, this app is kind to you"
---

# Soft Clay Wellness

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Phone size**: upright phone, **960–1040px wide** on the 1320×2868 canvas (≈ 68–74% of canvas height). Rolling hills may overlap the bottom 6–12% of the phone, but the phone's full height still counts toward the 68% minimum. Never shrink the phone to "make room" for clay props.
- **Tilt**: 0° by default. At most one slide per deck may tilt, and never beyond **±4°** (the sample feature slide uses −3°). Anything past 4° = fail.
- **Headline size**: Fraunces (SOFT 100) at **160–190px**, never below **120px** even on three-line headlines. Weight 380–440 (regular-ish, never bold). Line-height 1.0, tracking −0.025em. Measure widths; no single line > 88% of canvas width (1160px).
- **Exactly one emphasised word per headline**: italic, and on light slides also recoloured to clay-ink `#9A4B31` (5.0:1 on oat). Two emphasised words = fail. Emphasis in the raw terracotta `#C7765A` on oat (2.8:1) = fail.
- **Clay objects must clear §3 polish gates 1, 2, 3 and 4**: three-stop radial fill (highlight → base → shadow), inner shadow on the shaded side + inner light on the lit side, a blurred specular highlight, a warm cast/contact shadow, and the global grain on top. A single flat-fill ellipse is a blob, not clay = fail.
- **Background is never pure flat and never saturated**: light slides use a 3-stop warm radial of oat (`#F6EFE4 → #EFE7DA → #E6DACA`); dark slides use a 4-stop dusk linear (`#2E2230 → #3A2B3A → #5E4254 → #8A5A5A`). Pure white or pure black anywhere on the background = fail.
- **Grain**: shared SVG fractal-noise overlay, `mix-blend-mode: overlay`, overlay opacity **0.35–0.45** (reads as ~4–6% luminance noise). Zero grain = fail — the grain is what makes the gradients read as matte clay instead of plastic.
- **Decoration density: editorial, 2–5 clay objects per slide** (a hill counts as one, a pebble pair counts as one). More than 5 turns calm into toy-box = fail.
- **Shadows are warm**: brown/plum tinted (`rgba(110,70,45,.30)` on light, `rgba(25,12,22,.55)` on dark). Grey or pure-black shadows = fail.

## Vibe summary

This style sells calm. Every slide feels like a hand-built diorama photographed in soft afternoon light: matte clay pebbles, a low sun disc, rolling hills pressed from plasticine, and a tall arched window — the kind of niche you'd find in a Mediterranean wall — cradling the phone. The palette is borrowed from the earth (oat, bone, sage, terracotta, dusk plum, deep moss), never from a screen. Headlines are set in a soft, round-shouldered serif at a generous size, spoken in a gentle second-person present tense: "Taste each bag at its *peak*." Nothing is loud; the drama comes from volume and light on the clay, not from colour or motion. If a slide feels like it's asking for attention, it's wrong — it should feel like it's offering a seat.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--oat` | `#EFE7DA` | Primary light background (mid stop) |
| `--bone` | `#F6F0E6` | Light bg highlight stop, arch rim, bone pebbles |
| `--oat-deep` | `#E6DACA` | Light bg edge stop |
| `--sage` | `#A9B79C` | Arch interior, hills, sage pebbles |
| `--sage-light` | `#B7C3A9` | Closer / sage slide background mid stop |
| `--sage-lo` | `#7F8F72` | Sage shadow side |
| `--clay` | `#C7765A` | Terracotta clay objects (sun disc, hills, pebbles) — **never text on oat** |
| `--clay-hi` | `#EDB195` | Clay highlight stop |
| `--clay-lo` | `#94492F` | Clay shadow stop |
| `--clay-ink` | `#9A4B31` | Emphasis word on oat (5.0:1) |
| `--clay-ink-deep` | `#6E2F1D` | Emphasis word on sage (5.5:1 on `#B7C3A9`) |
| `--clay-light` | `#E6A585` | Emphasis word on plum / deep moss (6.4:1 on `#3A2B3A`) |
| `--plum` | `#3A2B3A` | Dark slide background core |
| `--plum-hi` | `#5E4254` | Dusk band, plum hills and pebbles |
| `--moss` | `#3E4A35` | Front hill on dark/sage slides, cream text ground |
| `--moss-lo` | `#2A3323` | Headline ink on sage |
| `--ink` | `#3A2E27` | Headline ink on oat (10.7:1) |
| `--ink-soft` | `#6E5A4C` | Labels / subheads on oat (5.3:1) |
| `--cream` | `#F3EBDD` | Headline on plum/moss (11.2:1 on plum) |
| `--cream-dim` | `#D9C8BA` | Subheads / labels on plum/moss (5.8:1 on moss) |

Color philosophy: everything is earth, clay or dusk. No saturated hue, no blue, no neon, no pure white, no pure black. Terracotta is an **object** colour; when it becomes text it darkens to `--clay-ink`.

## Typography

- **Headline (Google):** `Fraunces` variable with `font-variation-settings: "SOFT" 100, "WONK" 0, "opsz" 144`, weight 420 roman / 380 italic. Load with `family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1`. Alternates (Google): `Young Serif` 400 (no italic — use colour-only emphasis), `Gloock` 400. Commercial: Recoleta, Cooper Light, GT Alpina Condensed Light, Canela Soft.
- **Headline size at 1320 wide:** 160–190px default, ≥ 120px floor. Line-height 1.0, tracking −0.025em. Sentence case. 2 lines ideal, 3 max.
- **Labels (Google):** `DM Sans` 500, **30–36px**, uppercase, tracking 0.2em, colour `--ink-soft` on oat / `--cream-dim` on dark. Alternates: Inter, Söhne, Graphik.
- **Subhead / body:** `DM Sans` 400, **40–44px**, line-height 1.3, max 2 lines, hand-broken. Colour `--ink-soft` / `--cream-dim`.
- **Closer feature list:** Fraunces SOFT 100, weight 400, **60–68px**, line-height 1.5, tracking −0.01em; one italic phrase allowed inside the list.
- **Wordmark:** the app's name lives inside the top label (`Bloom · coffee, slowly`) rather than as a standalone logo. Never recreate another company's wordmark.

## Headline emphasis (signature)

Exactly **one** word (occasionally a two-word phrase) per headline is set in Fraunces italic at weight ~380. The italic word is the sensory or emotional payoff of the line — the word that, if removed, leaves a generic sentence.

- On oat: italic + `--clay-ink #9A4B31`.
- On sage: italic + `--clay-ink-deep #6E2F1D`.
- On plum / moss: italic + `--clay-light #E6A585`.
- Never underline it, never add a squiggle, never change size or weight beyond the italic cut. The soft italic's curl IS the decoration.

Examples: "Taste each bag at its *peak*." · "Sip, then *sleep* easy." · "Every cup, *savored*."

## Phone / device frame treatment

- **Always the template's default iPhone bezel** (`public/mockup.png` via the `Phone` component). Never swap it for a clay-moulded phone, bezelless card or paper frame.
- **Size:** 960–1040px wide; upright; anchored to the bottom (hero) or top (feature) edge — never floating centre with bands above and below.
- **Arch window (signature, ≥ 1 slide per deck):** a two-layer arch behind the phone. Outer rim: `border-radius: 564px 564px 0 0`, ~40px wider than the inner on each side, fill `linear-gradient(180deg,#F4ECDF,#E7DBC8)`, `box-shadow: 0 50px 90px -20px rgba(110,75,50,.30), inset 10px 14px 24px rgba(255,255,255,.7), inset -14px -10px 30px rgba(150,115,85,.25)`. Inner recess: sage radial `radial-gradient(90% 60% at 50% 18%, #C3CDB5, #A9B79C 52%, #8E9C80)` with `inset 0 46px 70px rgba(60,72,48,.42)` so it reads as pressed-in. The arch top sits 120–160px above the phone top; the arch bleeds off the canvas bottom.
- **Shadow:** two-stack warm drop-shadow on light slides `drop-shadow(0 60px 70px rgba(110,70,45,.30)) drop-shadow(0 12px 18px rgba(80,50,35,.22))`; on dark slides `drop-shadow(0 60px 80px rgba(25,12,22,.55)) drop-shadow(0 12px 20px rgba(20,10,18,.40))`.
- **Hills in front:** the front hill layer may overlap the phone's bottom 6–12% (tab bar area) so the phone appears to rise out of the landscape. Never let hills cover the UI element the headline talks about.
- **Screens:** use the app's real screenshots; light-mode UI suits this style best. Don't recolour UI.

## Background treatment

- **Light slides (hero, most features):** `radial-gradient(120% 70% at 50% 30%, #F6EFE4 0%, #EFE7DA 48%, #E6DACA 100%)`.
- **Sage slide (closer or one feature):** `radial-gradient(110% 60% at 50% 40%, #C8D2BB 0%, #B7C3A9 45%, #A3B195 100%)`.
- **Dusk slide (max one per 5-deck, for sleep / evening / night features):** `linear-gradient(180deg, #2E2230 0%, #3A2B3A 38%, #5E4254 68%, #8A5A5A 100%)` + a horizon glow `radial-gradient(closest-side, rgba(230,160,120,.42), transparent)` ~1700×1100px centred behind the hill line.
- **Grain on every slide** (see hard rules). No vignette on light slides; the dusk slide's darkening is built into its gradient.

## Decorative accents (clay kit)

All accents are built from one CSS recipe so they look like the same material:

```css
.clay{border-radius:50% 48% 46% 52%/56% 54% 46% 44%;
  background:radial-gradient(120% 110% at 30% 24%,var(--hi) 0%,var(--base) 46%,var(--lo) 100%);
  box-shadow:inset -26px -38px 64px rgba(70,35,20,.30), inset 22px 26px 44px rgba(255,248,236,.50),
    0 60px 80px -24px rgba(95,60,40,.38), 0 14px 22px -6px rgba(95,60,40,.22)}
.clay::after{/* specular */ left:18%;top:12%;width:34%;height:22%;border-radius:50%;
  background:radial-gradient(closest-side,rgba(255,252,245,.75),transparent);filter:blur(6px);transform:rotate(-24deg)}
```
Tones (`--hi / --base / --lo`): terracotta `#EDB195 / #C7765A / #94492F`, sage `#DCE4D1 / #A9B79C / #6F7F63`, bone `#FFFBF4 / #E9DECC / #BFAE95`, plum `#9A7486 / #6A4A5B / #3F2A37`, moss `#8C9A78 / #5B6A4C / #343F2B`.

- **Sun disc:** perfect circle, 340–400px (hero) or 700–1040px (dusk slide, partly hidden behind the phone), terracotta or bone. Sits behind the arch or phone, never overlapping headline letters.
- **Rolling hills:** 2–3 overlapping ellipses 1100–2000px wide, lit from top-left: `radial-gradient(70% 60% at 36% 8%, hi, base 42%, lo)` + `inset 0 24px 36px` light rim + `inset -60px -60px 120px` shadow + `0 -24px 50px` upward cast shadow. Alternate hue per layer (sage / terracotta / plum / moss) so layers separate.
- **Pebbles:** organic ovals 90–600px, never perfect circles; pairs or a cairn of 3–4. Each ground-touching pebble gets a `.cast` ellipse (60–110% of its width, blurred 8px, 34–55% warm-dark alpha).
- **Cairn (closer):** 4 stacked pebbles, widest at the bottom (≈580×330 → 200×170), rotated ±4–6° each, ≥ 900px total height, on a hill ridge.
- **Lighting direction:** one key light from the top-left on every slide — every highlight, specular and rim sits top-left, every inner shadow bottom-right. Mixed light directions make the set look assembled from stock.
- **Placement:** props live at the margins of the phone (shoulder of the arch, ridge beside the phone, behind the phone's top corner). Keep ≥ 30px of air between any prop and the headline block.
- **Density:** 2–5 per slide. At least one decoration bleeds off a canvas edge (hills always do).
- **Not allowed:** outlines, strokes, sparkles, emoji, flat vector leaves, doodles, confetti, glass/chrome.

## Cross-screen moment

- **May cross the seam:** the rolling hill horizon (continuous ridge across 2 adjacent slides), a large sun disc split 30/70 across the seam, or a pebble cluster whose cast shadow straddles the seam. Keep 10–30% of the object on the neighbour.
- **May not cross:** headline text, the emphasised italic word, the arch window (arches are self-contained frames), the phone, the closer feature list.
- Use it once in a 5-slide deck: hero → slide 2 via the hill ridge is the natural choice. Each crop must still show a complete horizon on its own.

## Copy tone

- **Voice:** gentle, second person, present tense, sensory. The app is a companion, not a coach. Short sentences that breathe.
- **Vocabulary:** slow, gentle, softly, ease, rest, breathe, ritual, morning, evening, settle, savor, peak, warm, quiet, each, every, your.
- **Avoid:** "boost", "hack", "crush", "optimize", "maximize", "ultimate", "revolutionary", numbers-as-hype ("10x"), exclamation marks, question marks, ALL CAPS in headlines, emoji, streak-shaming or guilt language.
- **Punctuation:** sentence case, one period at the end of each headline; commas for rhythm ("Sip, then sleep easy."). Labels are uppercase DM Sans without punctuation except a middle dot.
- **Example headlines (6–10, varied categories):**
  - Coffee: "Taste each bag at its *peak*." / "Every cup, *savored*."
  - Sleep: "Sip, then *sleep* easy." / "Drift off a little *softer*."
  - Meditation: "Ten *quiet* minutes, just for you."
  - Journaling: "Let the day *settle* on the page."
  - Habits: "Small steps, *gently* kept."
  - Cycle / fertility: "Know your rhythm, *kindly*."
  - Nutrition: "Eat with *ease*, not rules."
  - Mood: "Notice how you *feel* today."

## Per-slide breakdown (mandatory)

### Slide 1 — Hero ("Taste each bag at its *peak*.")
- **Background:** oat 3-stop radial + grain 0.45.
- **Label:** `BLOOM · COFFEE, SLOWLY` DM Sans 34px, centred, top 150px, `--ink-soft`.
- **Headline:** 168px Fraunces SOFT, centred, top ~236px, 2 lines, `--ink`; "peak." italic `--clay-ink`.
- **Arch:** two-layer arch, outer 1128px wide from top ~680px, bleeding off the bottom.
- **Phone:** 980px wide, upright, top ~860px, home screen (shows the freshness/peak message).
- **Decorations (4):** terracotta sun disc 360px behind the arch's right shoulder; 3 rolling hills (sage back, terracotta, sage front) overlapping the phone bottom; bone + plum pebble pair on the front hill with a cast shadow.

### Slide 2 — Differentiator (arch variant)
- **Background:** sage slide gradient; arch rim in bone, recess in oat (inverse of slide 1).
- **Label:** feature name in DM Sans 34px `--moss-lo`, centred, top 150px.
- **Headline:** top ~236px, 170px, `--moss-lo`, emphasis italic `--clay-ink-deep` (e.g. "Every bag has a *window*.").
- **Phone:** 1000px wide, upright in the arch, anchored bottom, showing the product's unique screen (shelf with freshness windows).
- **Decorations (3):** hill ridge continuing from slide 1 (cross-screen), one bone pebble pair with cast shadow, small terracotta sun (300px) behind the arch's left shoulder — mirror of slide 1 so the pair reads as a spread.

### Slide 3 — Feature (dusk, "Sip, then *sleep* easy.")
- **Background:** dusk 4-stop linear + horizon glow + grain 0.4.
- **Phone:** 1000px wide, **−3°** tilt, anchored top (~100px), caffeine screen.
- **Sun disc:** 760px terracotta, mostly behind the phone, emerging on the right.
- **Hills (3):** plum back-right, moss mid-left, deep moss front covering the bottom ~30% of canvas; bone + terracotta pebble pair on the ridge.
- **Text on the front hill, left-aligned x=104px:** label `CAFFEINE & SLEEP` (32px `--cream-dim`), headline 164px `--cream` with "sleep" italic `--clay-light`, subhead 40px 2 lines `--cream-dim`.

### Slide 4 — Feature / proof (upright, no arch)
- **Background:** oat. Phone upright 1000px anchored bottom; headline top. Screen: timer / guided flow.
- **Decorations (2–3):** a terracotta hill lower-left, a single large bone pebble with cast shadow beside the phone, optional small sage sun top-right. Optional one clay "stat pebble" (bone pebble ≥ 260px with a DM Sans 44px number in `--ink`) — stats must be real.

### Slide 5 — Closer ("Every cup, *savored*.")
- **Background:** sage gradient + grain 0.38. **No phone.**
- **Label + headline** centred at top (184px, `--moss-lo`, "savored." italic `--clay-ink-deep`).
- **Cairn:** 4 pebbles (terracotta base, bone, plum, sage top) ≥ 900px tall, in front of a 640px bone sun disc, resting on the moss hill ridge with a cast shadow.
- **Front moss hill** fills the bottom ~36%; on it, a label `EVERYTHING, GENTLY` and a 5-line feature list (Fraunces 64px `--cream`, tiny terracotta clay-pebble bullets 26×22px, one italic phrase).

## Adapting the clay kit to other categories

Keep the material and palette; swap only the props' meaning. One prop swap per slide at most.

| Category | Sun disc becomes | Pebbles become | Dusk slide for |
|---|---|---|---|
| Meditation / breathing | a rising sun (bone) | a balanced cairn | the evening wind-down session |
| Sleep | a low moon (bone, cooler `--lo #A89A8A`) | two resting pebbles | the bedtime / sleep-sound screen |
| Journaling | a warm terracotta sun | a pebble "paperweight" beside the phone | the evening reflection prompt |
| Habits | sun behind the arch | a row of 3 pebbles, one terracotta = today | streak / evening check-in |
| Period / fertility | a terracotta sun as a soft "cycle" disc | pebble pair | — (keep light, no dusk) |
| Nutrition | sun as a plate-like bone disc | sage + terracotta pebbles (produce tones) | — |

- Never convert the clay kit into literal clay food, faces, or mascots — the props stay abstract so every app can use them.
- If the app's brand colour is saturated, use it only inside the screenshot; the slide palette stays earthen.

## Pre-export checklist (this style)

- [ ] Phone 960–1040px wide, upright (or one slide ≤ 4°), default bezel, warm two-stack shadow.
- [ ] Headline ≥ 160px (floor 120px), Fraunces SOFT 100, one italic word in the slide's emphasis colour.
- [ ] Emphasis colour clears 4.5:1 (`#9A4B31` on oat, `#6E2F1D` on sage, `#E6A585` on plum/moss).
- [ ] 2–5 clay objects, each with 3-stop fill + inner shadow + specular + cast/contact shadow.
- [ ] No clay silhouette crosses headline letters (leave ≥ 30px air between sun disc and the descenders).
- [ ] Hills overlap the phone's bottom but no gap shows the phone's lower screen between two hills.
- [ ] Grain overlay present on every slide.
- [ ] Label + subhead ≥ 30px / 40px; no body copy under 30px anywhere on the slide.
- [ ] At 220px wide: the arch/clay read, the headline is legible, and the phone screen still shows what the app does.

## How to apply this style

1. **Fonts** — in `template/src/app/layout.tsx`, load `Fraunces` via `next/font/google` with `axes: ["SOFT", "WONK", "opsz"]`, `style: ["normal", "italic"]`, and `DM_Sans` (weights 400/500/700). Expose them as CSS variables (`--font-fraunces`, `--font-dm-sans`).
2. **Theme** — add a `soft-clay-wellness` entry to `THEMES` in `template/src/lib/constants.ts` (bg `#EFE7DA`, bgAlt `#3A2B3A`, fg `#3A2E27`, fgAlt `#F3EBDD`, accent `#9A4B31`, muted `#6E5A4C`), and keep the full token table above as CSS custom properties in `globals.css`.
3. **Clay kit** — add a `.clay` class + tone modifiers (`.terra`, `.sagec`, `.bonec`, `.plumc`, `.mossc`) and a `.cast` shadow class to `globals.css` exactly as in the recipe above. Build every sun, hill, pebble and cairn from it.
4. **Backgrounds** — in `slide-canvas.tsx`, replace `backgroundFor()` output for this theme with the oat radial / sage radial / dusk linear per slide, then add the grain overlay as the last child of each slide.
5. **Arch** — render the two-layer arch as absolutely-positioned divs behind the `Phone` component; size it from the phone width (outer = phone + 150px, inner = phone + 70px).
6. **Phone** — use the existing `Phone` component (`device-frames.tsx`) at 960–1040px on 1320 wide; apply the warm `filter: drop-shadow` stack to its wrapper; tilt 0° (max one slide at ≤ 4°).
7. **Hills** — layer 2–3 hill ellipses after the phone in DOM order so they overlap the phone's bottom 6–12%.
8. **Headline** — Fraunces SOFT 100 at 160–190px, line-height 1.0, tracking −0.025em; wrap the one emphasis word in `<em>` with the slide's emphasis colour. Measure each line ≤ 1160px.
9. **Contrast pass** — check headline, emphasis, label and subhead colours against the palette table; never put `#C7765A` text on oat.
10. **Audit** — 2–5 clay objects per slide, every ground-touching object has a cast shadow, grain present, phone ≥ 68% canvas height, one italic word per headline, no text crossing a clay silhouette.

## What this style is NOT

- Not flat vector illustration — no single-fill blobs, no outlines, no Material-style leaves.
- Not glossy 3D — no chrome, no hard specular streaks, no glass, no neon rim light. Clay is matte.
- Not pastel candy — no lilac, baby blue, bubblegum or iridescent gradients.
- Not dark-mode tech — only one dusk slide per deck, and it is warm plum, never navy or black.
- Not tilted-phone editorial — no 10–25° tilts, no doodles, no script fonts.
- Not a sans-serif headline style; never bold or black serif weights.
- Not loud copy — no exclamation marks, no "boost/hack/crush", no streak guilt.
- Not busy — never more than 5 clay objects on a slide, never a sticker collage.
- Never replaces the default iPhone bezel with a clay-sculpted or bezelless phone.
