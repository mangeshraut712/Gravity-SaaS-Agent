---
name: candy-pop-social
description: One loud flat colour per slide (bubblegum, cobalt, lime, tangerine), huge chunky rounded display type with one word in a contrasting pill, chat bubbles and reaction pills bursting out of tilted phones, starbursts, squiggle arrows, white-outlined cut-out stickers. Gen-Z group-chat energy. Inspired by Partiful.
inspiration: Partiful, BeReal, Locket, Gas, Duolingo campaign graphics
feel: loud, joyful, "the group chat is already talking about this"
---

# Candy Pop Social

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## Hard quality rules (this style)

- **Background = ONE flat saturated hex per slide.** No gradient, no vignette, no blobs. Only a 4–6% monochrome grain overlay (`mix-blend-mode: overlay`) is allowed. A 2-stop "subtle" gradient = fail.
- **Headline is huge:** 200–240px font-size on 1320×2868 for 2-line headlines, 190–215px for 3-line. Minimum 180px anywhere. Weight 800. `line-height: 0.88–0.92`, `letter-spacing: -0.03em to -0.04em`. Measured widest line ≤ 88% of canvas width (≤ 1160px), pill shadow included.
- **Exactly ONE pill word per headline.** The word sits inside a full-radius pill (`border-radius: 999px`), `padding: 0 .2em .06em`, 7px ink `#16121F` border, hard offset shadow `12px 14px 0 #16121F`, rotated −2° to −4°. Pill fill must contrast the slide bg (table below). Two pills, or a pill with no border/shadow = fail.
- **Contrast is measured, not guessed.** White text is ONLY allowed on cobalt (`#2B44F0`, 6.6:1). On pink (6.5:1), lime (14:1), tangerine (7.1:1) and yellow (14:1) all text is ink `#16121F`. White on lime/tangerine/pink = 1.3–2.8:1 = instant fail.
- **Everything graphic gets the "sticker stack":** ink outline (5–7px) OR thick white cut-out outline (14–22px), plus a HARD offset shadow in ink (`8–14px` x, `10–16px` y, 0 blur). Soft blurry drop shadows on decorations = fail (that is style 06 territory).
- **Phone size:** 70–80% of canvas height (width 980–1040px on 1320 canvas), tilted **4°–10°** (either direction), bleeding 0–8% off the bottom. Two overlapping phones allowed on at most one slide; the front phone still obeys the size rule, the back phone is 820–880px wide, tilted the opposite way.
- **Decoration count: 8–14 per slide** (_QUALITY_BAR §9 maximalist), with at least one bleeding off an edge — but nothing may overlap the headline block. Decorations live around and on top of the phone, never on the letters.
- **Emoji:** max 1 per chat bubble / reaction pill, max 5 per slide total. Never in the headline.

## Vibe summary

This is the look of a social app whose marketing lives in the group chat. Every slide is a single screaming flat colour — bubblegum pink, electric cobalt, acid lime, tangerine — carrying a headline so big and chunky it reads from across the room, with one word dropped into a contrasting pill like a highlighted sticker. The phone tilts a few degrees, and the conversation spills out of it: white and cobalt chat bubbles with names on top, reaction pills (`❤️ 12`, `🔥 8-day streak`), a yellow starburst shouting "peak day!", loopy ink squiggle arrows, and thick white-outlined cut-out stickers (hearts, lightning bolts, product-shaped objects) with hard offset shadows. It is flat and graphic — poster ink, not chrome. Loud, but organised: the headline always wins, the phone is always big, and the chatter orbits them.

## Global palette

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#16121F` | All dark text, outlines, hard offset shadows, sparkles |
| `--white` | `#FFFFFF` | Bubble fill, sticker cut-out outline, text on cobalt only |
| `--pink` | `#FF5FA8` | Slide bg A, pill fill on lime/cobalt, heart sticker |
| `--pink-deep` | `#D63D86` | Phone hard shadow on pink, heart shade side |
| `--cobalt` | `#2B44F0` | Slide bg B, "you" chat bubbles, pill fill on pink |
| `--cobalt-deep` | `#1A2BB0` | Phone hard shadow on cobalt, sticker shade side |
| `--lime` | `#C6F135` | Slide bg C, pill fill on cobalt/tangerine, squiggles on cobalt |
| `--lime-deep` | `#9CC41A` | Phone hard shadow on lime |
| `--tangerine` | `#FF7A1F` | Slide bg D, starburst alt fill, cup/object stickers |
| `--tangerine-deep` | `#D95E0B` | Phone hard shadow on tangerine, sticker shade |
| `--yellow` | `#FFE23D` | Starbursts, highlight reaction pills, bolt sticker (never a slide bg) |
| `--yellow-deep` | `#E0B800` | Shade side of yellow stickers |

**Pill + text pairing (use exactly):**

| Slide bg | Headline colour | Pill fill / pill text | Squiggle / sparkle ink |
|---|---|---|---|
| pink `#FF5FA8` | ink | cobalt / white | ink + white sparkles |
| cobalt `#2B44F0` | white | lime / ink | lime + white sparkles |
| lime `#C6F135` | ink | pink / ink | ink |
| tangerine `#FF7A1F` | ink | ink / lime | ink + white sparkles |

Never place two adjacent slides in the same colour. Default 5-slide order: pink → cobalt → lime → tangerine → pink.

## Typography

**Headline (display):**
- Google (first choice): **Bricolage Grotesque 800** with `font-variation-settings: 'opsz' 96` — chunky, slightly quirky, rounded terminals. Alternates: **Rubik 900**, **Dela Gothic One 400** (already ultra-heavy; drop size ~8%).
- Commercial alternates: GT Walsheim Black, Cera Pro Black, Gilroy Heavy, Obviously Wide Black (reduce size 12%).
- Size 200–240px (2 lines), 190–215px (3 lines). `line-height: .9`, `letter-spacing: -0.035em`, `white-space: nowrap` per line, lines hand-broken.
- Case: **lowercase** by default. A single all-caps word is allowed only inside a starburst.

**Body / subhead:** Rubik 700, 48–54px, `line-height: 1.18`, `letter-spacing: -0.01em`, max 2 lines, hand-broken at a comma. Same colour as the headline.

**Chat bubbles & pills:** Rubik 700 at 50–56px for message text, Rubik 800 at 30px for the sender name (72% opacity), Rubik 800 at 42px for reaction pills.

**Starburst text:** Bricolage Grotesque 800, 40–52px, 1–2 words per line, max 2 lines, ink.

**App tag:** Rubik 800, 50px, inside a white pill with the 74px app icon.

**Mix rule:** two families max (display + Rubik). No serif, no script, no italic.

## Headline emphasis (signature)

The emphasis is a **pill box**, not a colour change. Pick the one word that carries the benefit or the joke and drop it in:

- `every bag / at its [peak]` — the payoff noun
- `no more / [sad] pours` — the funny adjective
- `your brew / crew is / gonna [ask]` — the social-proof verb
- `find your / [people]` · `plans in / [2 taps]` · `streaks you / [won't] break` · `swipe less, / [vibe] more`

Pill specs: full radius, 7px ink border, `12px 14px 0` ink hard shadow, rotation −2° to −4° (it looks slapped on), fill from the pairing table. The pill word may be the first word of a line or the last, never mid-line (it breaks the rag). Never colour a second word; never underline.

## Phone / device frame treatment

- Always the template's default iPhone bezel (`public/mockup.png` via the `Phone` component in `src/components/editor/device-frames.tsx`). Never replace it with a bezelless card or a drawn frame.
- **Tilt 4°–10°**, alternate direction slide to slide (hero −6°, feature +7°, etc.). 0° = fail, > 10° = fail.
- **Shadow stack (hard + soft):** `filter: drop-shadow(26px 30px 0 <bg-deep>) drop-shadow(0 30px 50px rgba(20,10,40,.28))` where `<bg-deep>` is the slide's deep token. The hard offset slab in a darker shade of the bg is the style's signature; pure black soft shadow alone = fail.
- Placement: top edge at 33–37% of canvas height (≈ 950–1060px), horizontally offset so one side reaches or kisses the canvas edge. Bottom bleeds 0–8%.
- Two-phone slide: front phone 1000px, back phone 840–880px tilted the opposite way, offset so ≥ 35% of the back screen is readable (list titles must not be clipped mid-word at the canvas edge).
- Screens show real app UI, light or dark as the app ships — the loud bg does the work.

## Background treatment

- One flat hex from the palette, edge-to-edge.
- Grain overlay 4–6% (`.grain` SVG turbulence, `mix-blend-mode: overlay`) — keeps flat colour from looking like a default fill.
- Nothing else. No shapes behind the headline, no confetti field, no halftone.

## Decorative accents

Count 8–14 per slide (the app tag counts as one). Each one uses the sticker stack.

1. **Chat bubbles (2–6 per slide):** `border-radius: 56px` with one corner at 12px (the "tail" corner, bottom-left for others, bottom-right for "you"). 6px ink border, `10px 12px 0` ink shadow, padding `30px 42px`, sender name on top. White bubble + ink text for friends; cobalt bubble + white text for "you"; pink bubble + ink text as the loud variant on cobalt slides. Rotation −6° to +4°. They **pop out of the phone**: overlap the bezel edge by 20–45% of their width.
2. **Reaction pills (1–3):** small white or yellow pill, 5px ink border, `6px 7px 0` shadow, `❤️ 12`, `😂 3`, `🔥 8-day streak`, `✓✓ read`. Tucked on the corner of a bubble, rotated opposite to it.
3. **Starburst (0–1):** 12–16 points, radii 50/40, yellow or tangerine fill, 3.2-unit ink stroke, ink offset copy behind it (`translate(4.5 5.5)`), 210–300px, rotated ±8–14°. Text: `peak day!`, `NEW!`, `to the gram`, `free!` (only if true). Sits on the phone's top corner or in open space — never on the headline.
4. **Squiggle arrows (1):** single loop-de-loop path, 12–13px round-cap stroke, open-chevron arrowhead, ink (lime on cobalt). Points from a decoration to a real UI element.
5. **Cut-out stickers (2–3):** product-relevant object (coffee bean, heart, lightning bolt, cup, ticket, controller…) with **14–22px white outline**, base fill + 12–18% darker shade side + a lighter highlight ellipse, and `drop-shadow(10px 12px 0 #16121F)`. One must bleed off a canvas edge by 20–40%.
6. **Sparkles (2–4):** 4-point curved stars, 56–110px, ink or white (lime on cobalt).
7. **App tag (1, every slide):** white pill, app icon + lowercase name, top-left at 84/104px, rotated ±2–3°.

Polish gates (§3): stickers pass fill tones + hard cast shadow + volume highlight; bubbles/pills pass outline + hard shadow + grain. If a sticker still reads as clipart, swap it for a plain heart or sparkle — never ship a lumpy drawn object.

### Component recipes (1320-wide canvas, scale by `cW/1320`)

```css
.cp-headline { font: 800 232px/.9 'Bricolage Grotesque'; font-variation-settings: 'opsz' 96;
  letter-spacing: -0.035em; white-space: nowrap; }
.cp-pill { display: inline-block; border-radius: 999px; padding: 0 .2em .06em; margin-left: .04em;
  border: 7px solid #16121F; box-shadow: 12px 14px 0 #16121F; transform: rotate(-3deg); }
.cp-bubble { font: 700 52px/1.12 Rubik; padding: 30px 42px 32px; border: 6px solid #16121F;
  border-radius: 56px; box-shadow: 10px 12px 0 #16121F; white-space: nowrap; }
.cp-bubble.friend { background: #fff; color: #16121F; border-bottom-left-radius: 12px; }
.cp-bubble.you    { background: #2B44F0; color: #fff; border-bottom-right-radius: 12px; }
.cp-bubble .who   { display: block; font: 800 30px/1 Rubik; opacity: .72; margin-bottom: 12px; }
.cp-reaction { font: 800 42px/1 Rubik; background: #fff; color: #16121F; border: 5px solid #16121F;
  border-radius: 999px; padding: 14px 26px; box-shadow: 6px 7px 0 #16121F; }
.cp-sticker { filter: drop-shadow(10px 12px 0 #16121F); } /* SVG inside draws a 14–22px white stroke under the fill */
.cp-tag { display: flex; gap: 18px; align-items: center; background: #fff; border: 6px solid #16121F;
  border-radius: 999px; padding: 12px 34px 12px 14px; box-shadow: 8px 10px 0 #16121F; font: 800 50px/1 Rubik; }
```

- **Starburst geometry:** polygon of `2 × points` vertices alternating radius 50 / 40 in a 100-unit viewBox; draw an ink copy offset `(4.5, 5.5)` first, then the coloured copy with a 3.2-unit ink stroke on top.
- **Sticker SVG layering:** (1) outer path with `stroke:#fff; stroke-width:20; stroke-linejoin:round` (the cut-out), (2) base fill, (3) shade shape on the right/bottom third, (4) one highlight ellipse at 55% white on the upper-left.
- **Squiggle:** one cubic path with a single loop, `stroke-width: 12–13`, `stroke-linecap: round`, arrowhead = a separate 2-segment open chevron path, same stroke.

### Layout grid (1320 × 2868)

| Zone | y-range | Contents |
|---|---|---|
| Tag band | 90–200 | App tag, 1–2 sparkles, optional starburst (closer) |
| Headline | 260–760 (2 lines) / 260–900 (3 lines) | Headline + pill; nothing else may enter |
| Subhead | 770–900 | Rubik 52px, max 2 lines (omit on closer) |
| Stage | 950–2868 | Phone(s), bubbles, reactions, stickers, squiggle |

Left margin 84px for tag, headline and subhead. Decorations may bleed on the left/right/bottom edges only.

## Cross-screen moment

- **May cross the seam:** a chat bubble shape (only if its text sits fully on one side — the crossing part is the tail/empty padding), a sticker (heart, bean, bolt), a squiggle arrow, or a sparkle trail. 10–30% of the element crosses.
- **May not cross:** headline, pill word, any bubble text, starburst text, the app tag, the phone screen.
- Frequency: one moment per 5-slide deck, e.g. slide 2 → 3 a squiggle arrow launches from a bubble and lands on a sticker on the next slide.

## Copy tone

- **Voice:** your funniest friend narrating the group chat. Lowercase, second person, playful, social proof baked in ("your crew", "everyone's asking", "gonna").
- **Vocabulary:** your crew, the group chat, obsessed, lowkey, no more, gonna, bestie (sparingly), rn, ngl (bubbles only), peak, main character, plans, streak.
- **Avoid:** corporate verbs (leverage, optimise, seamless), "revolutionary", "#1", ALL-CAPS headlines, question marks in headlines, more than one `!` anywhere, cringe slang pile-ups ("slay bestie fr fr no cap").
- **Punctuation:** headlines have no terminal punctuation. Bubbles may use `??`, `…`, and one emoji. Starbursts may end in `!`.
- **Example headlines (pill word in brackets):**
  - Coffee: `every bag / at its [peak]` · `no more / [sad] pours`
  - Events: `the party / starts [here]`
  - Friends / location: `see who's / [out] tonight`
  - Dating-lite: `swipe less, / [vibe] more`
  - Language / games: `your streak / is [on fire]`
  - Messaging: `group chats, / but [fun]`
  - Fitness social: `sweat with / your [crew]`
  - Closer: `your crew is / gonna [ask]`

## Per-slide breakdown (mandatory)

### Slide 1 — Hero (pink `#FF5FA8`)
- App tag top-left (84, 104), rotated −3°.
- Headline 2 lines at 230–240px, ink, top 270px; pill word in cobalt/white on line 2.
- Subhead Rubik 700 52px, 2 lines, ink, ~790px from top.
- Phone: main screen (home/dashboard), 1000–1020px wide, left ~250px, top ~1010px, tilt −6°, hard pink-deep shadow.
- Decorations (~12): friend bubble popping off the phone's left edge + `❤️ 12` reaction; "you"/cobalt bubble lower right + `🔥 streak` yellow pill; yellow starburst on the phone's top-right corner; ink squiggle arrow from starburst to a UI card; cobalt heart sticker left; product sticker bleeding off bottom-left; 3–4 sparkles.

### Slide 2 — Differentiator (cobalt `#2B44F0`)
- White headline, lime/ink pill; subhead white.
- Two overlapping phones: back phone (list/browse screen) 840–880px, tilt −8°, left edge ≥ 20px; front phone (the differentiating feature, e.g. timer) 1000px, tilt +7°, right side.
- Decorations (~10): white "you → crew" bubble popping off the front phone's top edge; pink friend bubble crossing both phones (`wait u made this?? 🤯`) + reaction; yellow starburst with a feature spec (`to the gram`); lime squiggle; white/lime sparkles; bolt sticker bottom-left bleed; object sticker bottom-right bleed.

### Slide 3 — Feature (lime `#C6F135`)
- Ink headline, pink/ink pill.
- Single phone +5° to +9°, showing a data screen (stats, calendar, map).
- A floating widget or card PNG (from the app) gets the sticker treatment (white 14px outline + ink hard shadow) and pops out of the phone's side.
- Decorations: 2 bubbles, 1 reaction, starburst in tangerine, ink squiggle, 2 stickers, sparkles.

### Slide 4 — Feature / proof (tangerine `#FF7A1F`)
- Ink headline, ink/lime pill.
- Phone −4° to −8°. Proof via a stack of 3 reaction pills (`⭐ 4.8`, `❤️ 2.1k`, `🔥 obsessed`) only if the numbers are real; otherwise friend quotes in bubbles.
- Starburst yellow, cobalt heart sticker, ink squiggle.

### Slide 5 — Closer: the group chat (pink or lime)
- No phone. Headline 3 lines at ~210px (`your brew / crew is / gonna [ask]`).
- Below: a chat thread of 5–6 bubbles alternating friend (white, left, rotated −2° to −4°) and "you" (cobalt, right, +2° to +3°), 56px text. The "you" replies ARE the feature list (`bloom says when they peak`, `v60, aeropress, cold brew…`, `128mg. bed-ready by 10 😴`).
- 2–3 reaction pills on bubble corners, a `NEW!` tangerine starburst top-right, and a bottom row: product sticker, the **app icon as a sticker** (210px, 14px white outline, ink hard shadow, rotated −6°) with a squiggle arrow pointing at it, heart sticker bleeding right.

## How to apply this style

1. **Fonts** — in `template/src/app/layout.tsx` add `Bricolage_Grotesque` (weight 800, axes `["opsz"]`) and `Rubik` (600/700/800) from `next/font/google`; expose them as CSS variables (`--font-display`, `--font-ui`) on `<body>`.
2. **Theme** — add a `candy-pop-social` entry to `THEMES` in `template/src/lib/constants.ts` (flat fallback: bg lime `#C6F135`, bgAlt cobalt `#2B44F0`, fg ink `#16121F`, fgAlt white, accent cobalt — 5.0:1 on lime, muted `#4A3F5C`); keep the full token table in a style constant for the per-slide bg order.
3. **Slide background** — in `slide-canvas.tsx`, for this theme bypass `backgroundFor()`'s gradient and render the slide's flat hex (pink → cobalt → lime → tangerine → pink) plus the 5% grain div. No `Blob` components.
4. **Headline** — render lines as separate nowrap blocks in the display font at 200–240px scaled by `cW/1320`; wrap the chosen emphasis word in a `<span>` with the pill styles from the table. Measure the widest line (`scrollWidth`) and step the font size down 4px until ≤ 88% of `cW`.
5. **Phone** — use the existing `Phone` component; wrap it in a div with `transform: rotate(4–10deg)` and the hard+soft `drop-shadow` filter using the slide's deep token. Size to 70–80% of `cH`.
6. **Decorations** — build `ChatBubble`, `ReactionPill`, `Starburst`, `Squiggle`, `Sticker` as small absolutely-positioned components (inline SVG for burst/squiggle/sticker). Place them in `SlideElements` as movable text/image elements so users can nudge them; default positions from the per-slide breakdown.
7. **Contrast pass** — assert white text only on cobalt; ink everywhere else. Pill text colour from the pairing table.
8. **Density pass** — count decorations per slide (8–14), confirm at least one bleeds off an edge and none touch the headline block.
9. **Cross-screen** — optionally let one squiggle or sticker span the seam between two adjacent slides (text never crosses).
10. **Thumbnail test** — shrink to 220px: headline + pill must still read, the phone must still read as an iPhone, the bg colour must pop.

## What this style is NOT

- NOT glossy 3D: no chrome, no gradients, no inner glows, no soft bokeh — that is style 06. Everything is flat ink-and-colour.
- NOT pastel: no cotton-candy tints, no desaturated "aesthetic" colours — the four bgs are full saturation.
- NOT hand-drawn editorial: no script fonts, no pen doodles with pressure variation; squiggles are one confident thick marker line.
- NOT gradient-mesh or glassmorphism; no blurred cards.
- NOT sentence case corporate: no "Discover the best way to…".
- NOT white text on lime, tangerine, pink or yellow — ever.
- NOT a decoration soup over the headline — the headline zone is sacred; chatter lives around the phone.
- NOT tiny phones to make room for stickers — phone stays 70–80% of height.
- NOT more than one pill word, one starburst, or one squiggle arrow per slide.
- NOT emoji confetti — max five, only inside bubbles/pills.
- NOT other companies' logos, mascots or wordmarks — "inspired by" means the energy, not the assets.
