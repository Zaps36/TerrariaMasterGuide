# TerraGuide

A fan-made **Terraria progression companion** built to answer one question:

> **What should I do next?**

TerraGuide tracks where you are in a playthrough and turns that into a single clear
recommendation — the next boss, the preparation checklist for it, and the exact
weapons, armor, accessories, ammo and potions your class should be using at that
point in the game.

Interactive prototype: every button, tab, filter, search box and checklist works,
and progress persists in `localStorage`.

---

## Run it

**No install, no build, no dependencies.** Any static server works:

```bash
cd terraguide
python3 -m http.server 8123
# open http://localhost:8123
```

A server is required because the app uses native ES modules (`file://` blocks them).

### Single-file offline version

```bash
node build.mjs        # -> dist/terraguide.html
```

That produces one self-contained HTML file (CSS + all 51 modules inlined) which
runs by double-clicking it, with no server and no network access.

---

## What's in it

| Area | What it does |
| --- | --- |
| **Dashboard** | Current stage, main progress bar, "What should I do next?", "You may have missed", progress meters, your current kit |
| **Progression** | Vertical boss tree with locked / available / completed / recommended-next node states, main chain separated from optional bosses, quick-log toggles |
| **Bosses** | 25 bosses and events, searchable and filterable; detail pages with stats, preparation checklist, per-class loadout tabs, arena diagram, rewards and unlocks |
| **Class Builds** | 4 classes × 9 progression stages of curated loadouts, plus accessory upgrade chains and a reforging guide |
| **Items** | 242 items with type / class / progression filters, rarity tiers, stat blocks, sourcing notes and visual crafting trees |
| **Potions** | Grouped MUST HAVE / VERY USEFUL / OPTIONAL, ingredient lists, "prepare all" checklists, placeable buff stations |
| **NPCs** | Unlock conditions, housing needs, what they sell, and a "Who should I get next?" recommendation |
| **Resources** | 12 ore tiers with "is this actually worth mining?" guidance |
| **World Prep** | Five threshold checklists (before Hardmode, before the mechs, before Plantera, before Golem, before Moon Lord) |
| **Beginner Guide** | Ten first steps in plain language, a starter kit, common mistakes and a vocabulary cheat sheet |
| **Settings** | Difficulty, world evil, class, reset stage / reset all, reduced animations, compact mode |

### The core loop

```
player state → recommendation → preparation → boss → reward → next stage
```

Marking a boss defeated immediately recomputes your stage, your recommendation,
your loadout and your warnings.

---

## Architecture

```
index.html            single entry document
build.mjs             optional single-file bundler (no dependencies)
styles/
  base.css            design tokens, reset, typography, pixel night sky
  layout.css          app shell, sidebar, topbar, mobile nav
  components.css      panels, buttons, badges, bars, checklists, modal, toasts
  pages.css           page-level compositions (tree, arena, chains, timelines)
src/
  main.js             boot + route table
  core/
    dom.js            tiny hyperscript helper (h/frag/mount/delegate)
    router.js         hash router with scroll + focus restoration
    store.js          state + localStorage, the only place state mutates
    sprites.js        pixel-art renderer (character grid -> cached PNG data URL)
  data/               game data only — no UI code
    sprites.js        hand-authored 16×16 sprite grids
    tints.js          material palettes (one shape re-tinted many ways)
    stages.js         progression stages, classes, difficulties, world evils
    bosses.js         bosses + events, preparation, rewards, unlocks
    class-builds.js   4 classes × 9 stages of loadouts
    items*.js         weapons / gear / misc, built via shared factories
    potions.js  arenas.js  npcs.js  resources.js
    accessory-chains.js  world-prep.js  beginner.js
  logic/
    progression.js    stage detection, node status, progress maths
    recommend.js      the rule-based recommendation engine
    search.js         global search index
  components/         reusable UI (panels, checklists, tabs, modal, cards, tree…)
  pages/              one module per route
```

Three rules keep it maintainable:

1. **Game data never contains UI code**, and UI never hardcodes game data.
2. **All state changes go through `core/store.js`**, which persists and notifies.
3. **Boss loadouts are derived, not duplicated** — a boss declares its
   progression stage and the UI pulls the class build for that stage.

### Sprites

There are no external image assets and no game rips. `core/sprites.js` renders
hand-authored character grids to cached PNG data URLs:

```
'......xfax......'   x outline   a primary   f highlight
'.....xxfaxx.....'   c secondary e accent    w glow
'....xeeeeeex....'   . transparent
```

Because the palette is symbolic, one `sword` grid plus a `hellstone` tint gives
the Fiery Greatsword, and the same grid with `luminite` gives the Zenith.

---

## Accessibility

- Every interactive element is a real `<button>` or `<a>` with a visible focus ring.
- Status is never colour-only: nodes and cards carry ✓ / 🔒 / › markers and text badges.
- Progress bars expose `role="progressbar"` with aria values; tabs use `role="tab"`.
- Touch targets are at least 44 px; no horizontal overflow at 390 px width.
- Settings → Display → *Reduced animations*, and `prefers-reduced-motion` is honoured.

---

## Notes

- Content targets Terraria PC 1.4.x progression.
- Recommendations are deterministic rules, not AI, and are written as
  "best practical pick + good alternatives" rather than exhaustive lists.
- TerraGuide is unofficial. Terraria is a trademark of Re-Logic.
