# Copy Ideas

A working library of headline patterns for App Store and Google Play screenshots. Use it in **Step 3: Coach the User on Copy** to draft options, to rescue a weak headline, or to fill a deck quickly before the user edits it in the inspector.

Everything here obeys the Iron Rules in `SKILL.md`: one idea per headline, short common words, 3-5 words per line, intentional line breaks. The editor's inspector ships a smaller version of this list under **Copy ideas** next to the headline field (`src/lib/copy-ideas.ts`), so keep the two roughly in sync when you add patterns.

---

## How to use this file

1. Pick the deck slot first (hero, differentiator, feature, proof, closer). The slot decides the job the headline has to do.
2. Pick a **formula** for that slot, then fill it with the app's real nouns and verbs. Never ship a formula with placeholder words left in.
3. Check it against the category bank below. If the category bank has a sharper line, adapt that instead.
4. Rewrite for the chosen style's voice (see the style's `## Copy tone`). The same idea reads as "Dial in every pour." in Neon Athletic Night and "The ritual, refined." in Magazine Cover Editorial.
5. Offer the user **three** options per slide: one *paint a moment*, one *state an outcome*, one *kill a pain*. Let them pick.

---

## Formulas by slot

`[verb]`, `[noun]`, `[pain]`, `[outcome]`, `[moment]`, `[number]` are placeholders. Replace every one.

### Hero: the one slide most people see

| Formula | Example |
|---|---|
| `[outcome], without [pain].` | Great coffee, without the guesswork. |
| `The [adjective] way to [verb] [noun].` | The calm way to plan your week. |
| `Your [noun],\n[benefit].` | Your money,\nfinally clear. |
| `[verb] [noun].\n[verb] [noun].` | Track habits.\nKeep streaks. |
| `Every [noun],\n[outcome].` | Every workout,\ncounted. |
| `[noun] that [verb]s you.` | A journal that listens back. |
| `Meet your new [role].` | Meet your new sleep coach. |

### Differentiator: why this app and not the others

| Formula | Example |
|---|---|
| `Only [app] [does unique thing].` | Only Bloom knows when beans peak. |
| `[Competitor category] [does X].\n[app] [does Y].` | Timers count down.\nBloom coaches each pour. |
| `No [pain]. No [pain]. Just [outcome].` | No ads. No streak guilt. Just progress. |
| `Built for [specific person].` | Built for people who read slowly. |
| `[verb] it once.\n[outcome] forever.` | Scan it once.\nTracked forever. |

### Feature: one feature per slide

| Formula | Example |
|---|---|
| `[verb] [noun] in [time/number].` | Log a meal in 3 seconds. |
| `See [thing] at a glance.` | See your whole month at a glance. |
| `[noun], sorted.` | Your shelf, sorted by freshness. |
| `Never [pain] again.` | Never miss a refill again. |
| `From [before] to [after].` | From receipt to budget in one tap. |
| `[verb] it. [app] does the rest.` | Snap the bag. Bloom does the rest. |
| `Right on your [surface].` | Right on your lock screen. |

### Proof: numbers, trust, social

| Formula | Example |
|---|---|
| `[number] [people] [verb] [app].` | 40,000 runners train with Stride. |
| `Loved by [specific group].` | Loved by home baristas. |
| `[rating] from [number] reviews.` | 4.9 stars from 12,000 reviews. |
| `Private by design.` | Private by design. Your data stays on device. |
| `As seen in [publication].` | Only when the press mention is real and permitted. |

### Closer: the last slide

| Pattern | Example |
|---|---|
| Feature wordlist (4-6 short items, alternating emphasis) | Widgets · Journal · Recipes · Caffeine · Scanner |
| Big quiet statement | And it's all yours. |
| Invitation | Your first week starts today. |
| "And so much more" pills | Dark mode · iCloud sync · Siri · Shortcuts |
| Identity | Made for people who care about the details. |

Never put "Download now" or a price on a screenshot. The store already shows the button.

---

## Category banks

Three to six ready lines per category. Adapt nouns to the real app. Each line is under 30 characters per line so it survives the thumbnail test.

### Productivity & tasks
- Your whole day,\nin one list.
- Turn notes into\nnext steps.
- Plan less.\nDo more.
- Inbox zero,\nfinally.
- Talk it out.\nWe'll write it down.

### Notes & writing
- Write first.\nOrganize later.
- Every idea,\nfound in seconds.
- A quiet place\nto think.
- Your second brain,\nwithout the setup.

### Finance & budgeting
- Your money,\nfinally clear.
- Know where\nevery dollar goes.
- Split bills.\nKeep friends.
- Save without\nthinking about it.
- Budgets that\nbend, not break.

### Fitness & running
- Every rep,\ncounted.
- Train smarter,\nnot longer.
- Beat last week.
- Your pace.\nYour plan.
- Recover like\nyou mean it.

### Health, sleep & wellness
- Sleep deeper\ntonight.
- Two minutes\nto calm.
- Feel it before\nyou burn out.
- Slow mornings,\nmade simple.
- Understand your\ncycle, gently.

### Food, recipes & drink
- Dinner, decided.
- Cook what's\nalready in the fridge.
- Every recipe,\none tap away.
- Great coffee,\nwithout the guesswork.
- Taste more.\nWaste less.

### Social, friends & events
- Plans your friends\nactually show up to.
- See what your\nfriends are up to.
- The group chat,\nbut for real life.
- Your people,\nin one place.

### Dating & relationships
- Fewer swipes.\nBetter dates.
- Meet people\nworth your time.
- Stay close,\nfrom anywhere.
- Your little world,\ntogether.

### Learning & education
- Five minutes\na day is enough.
- Learn it.\nKeep it.
- Speak from\nday one.
- Study smarter\nfor finals.

### Photo, video & creative
- Edits that\nlook expensive.
- Your best shot,\nin one tap.
- Make it yours.
- Pro tools,\nno learning curve.

### Travel & maps
- Every trip,\nplanned in minutes.
- Your itinerary,\noffline.
- Find the places\nlocals love.
- Pack once.\nNever forget.

### Developer & pro tools
- Ship faster\nfrom your phone.
- Every log,\nsearchable.
- Your servers,\nin your pocket.
- Alerts that\nactually matter.

### Kids & family
- Screen time\nthat teaches.
- The family calendar\neveryone uses.
- Chores, turned\ninto a game.

### Shopping & commerce
- Price drops,\nfound for you.
- Your wishlist,\nwatched.
- Checkout in\none tap.

---

## Eyebrow labels (the small line above the headline)

Keep them 1-3 words, uppercase or small caps depending on the style. They orient; they never carry the benefit.

- Positional: `FEATURE 01`, `STEP 2`, `Nº 03`, `01 / 05`
- Category: `WIDGETS`, `PRIVACY`, `OFFLINE`, `SYNC`
- Social: `NEW`, `EDITOR'S CHOICE`, `LOVED BY 40K`
- Temporal: `EVERY MORNING`, `IN 3 SECONDS`, `TONIGHT`

Only use `EDITOR'S CHOICE`, awards, ratings, or user counts when they are true.

---

## Weak → better

| Weak | Better | Why |
|---|---|---|
| Track your habits and stay motivated | Keep your streak alive | one idea, verb first |
| AI-powered expense categorization | Receipts sort themselves | benefit, not mechanism |
| The best meditation app | Two minutes to calm | concrete, no unprovable superlative |
| Organize recipes with tags and favorites | Dinner, decided | sells the outcome |
| Seamlessly sync across all devices | Start on phone. Finish on Mac. | paints the moment |
| Powerful analytics dashboard | See what changed this week | human question, answered |
| Welcome to MyApp | (cut it; say what the app does) | the hero slot is too valuable |
| Lots of features! | Widgets · Journal · Recipes · Sync | specific beats vague |

Red flags to rewrite on sight: "seamless", "powerful", "revolutionary", "all-in-one", "next-generation", "leverage", "AI-powered" as the whole message, exclamation marks, questions in headlines, and any headline that still works if you swap in a competitor's name.

---

## Deck arcs (pick one, then fill slots)

**Benefit ladder (default)**
1. Hero benefit → 2. Differentiator → 3. Core feature → 4. Core feature → 5. Ecosystem (widgets / watch) → 6. Proof → 7. Closer

**Problem → solution**
1. Name the pain → 2. The fix (hero screen) → 3-5. How it works, one step per slide → 6. Outcome → 7. Closer

**Day in the life**
1. Morning moment → 2. Midday moment → 3. Evening moment → 4. Weekly review → 5. Closer

**Numbers-led** (finance, fitness, health)
1. One giant number + meaning → 2-4. Each feature anchored to a number → 5. Proof number → 6. Closer

Whatever the arc, slide 1 must work alone. Most people see only that one.

---

## Localization notes

- Translate the idea, not the words. Rebuild line breaks for each locale; German and French run 20-35% longer, so shorten before shrinking the font.
- Keep numbers, units, and currency native to the locale (`1.234,5 g`, `€`, 24-hour time where expected).
- Arabic and Hebrew: write the headline RTL-native, mirror left-aligned layouts, and re-check which word carries the emphasis. It usually moves.
- Japanese and Chinese: fewer characters per line, avoid mid-phrase breaks, and prefer a slightly smaller emphasis scale so kana and kanji stay balanced.
- Never machine-translate the hero headline without a native read.
