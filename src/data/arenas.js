/**
 * Arena blueprints.
 * `rows` drives the pixel diagram; `guidelines` is the practical advice.
 */

export const ARENAS = {
  standard: {
    id: 'standard',
    name: 'Standard Boss Arena',
    size: '~100–150 blocks wide, 3 platform layers',
    summary: 'The all-purpose arena. Long enough to sprint, tall enough to dodge upward.',
    rows: [
      { type: 'platform', label: 'PLATFORM' },
      { type: 'gap' },
      { type: 'platform', label: 'PLATFORM' },
      { type: 'player', label: 'YOU' },
      { type: 'platform', label: 'PLATFORM' },
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
      { type: 'ground', label: 'GROUND' },
    ],
    props: ['campfire', 'heart_lantern', 'honey_pool'],
    guidelines: [
      'Platform layers 12–15 blocks apart so you can jump or fly between them.',
      'Keep the floor flat — nothing kills a boss fight faster than tripping on terrain.',
      'Place Campfires and Heart Lanterns every ~30 blocks along the arena.',
      'Add a shallow honey pool in the middle for the extra regeneration buff.',
      'Light the whole arena. You cannot dodge what you cannot see.',
    ],
  },

  hell: {
    id: 'hell',
    name: 'Wall of Flesh Hell Bridge',
    size: '1000+ blocks long, completely flat, 1 layer',
    summary: 'The Wall of Flesh chases you the whole fight. You are not dodging — you are running.',
    rows: [
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
      { type: 'platform', label: 'BRIDGE', long: true },
      { type: 'player', label: 'RUN THIS WAY →' },
      { type: 'gap' },
      { type: 'ground', label: 'LAVA' },
    ],
    props: ['campfire', 'heart_lantern'],
    guidelines: [
      'Build one enormous flat bridge across The Underworld — as long as you can manage.',
      'Use blocks, not platforms, so The Hungry cannot pull you through.',
      'Space Campfires and Heart Lanterns along the whole length.',
      'Leave headroom: about 10 blocks of clear space above the bridge.',
      'Bring Obsidian Skin Potions while you build it.',
    ],
  },

  sky: {
    id: 'sky',
    name: 'Sky Bridge (Mechs, Lunar, Moon Lord)',
    size: '500–1000 blocks long, high above the surface',
    summary: 'Flying bosses need horizontal room. A long sky bridge is the single best arena upgrade.',
    rows: [
      { type: 'gap' },
      { type: 'platform', label: 'PLATFORM', long: true },
      { type: 'player', label: 'FLY ALONG IT' },
      { type: 'platform', label: 'BRIDGE', long: true },
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
    ],
    props: ['campfire', 'heart_lantern', 'heart_statue', 'star_statue'],
    guidelines: [
      'Build it high enough that ground enemies cannot reach you.',
      'Use platforms so you can drop through them to dodge downward.',
      'Wire Heart Statues to a 1-second timer for endless healing.',
      'Two parallel layers give you vertical dodging room.',
      'Asphalt Blocks on the bridge give a big running speed bonus.',
    ],
  },

  jungle: {
    id: 'jungle',
    name: 'Underground Jungle Arena (Plantera)',
    size: '~150 blocks wide, 60 tall, cleared inside the Jungle',
    summary: 'Plantera chases you through blocks in phase two. You need space, not cover.',
    rows: [
      { type: 'platform', label: 'PLATFORM' },
      { type: 'gap' },
      { type: 'platform', label: 'PLATFORM' },
      { type: 'player', label: 'YOU' },
      { type: 'platform', label: 'PLATFORM' },
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
      { type: 'ground', label: 'JUNGLE FLOOR' },
    ],
    props: ['campfire', 'heart_lantern', 'honey_pool', 'sunflower'],
    guidelines: [
      'Dig it out inside the Underground Jungle — leaving the biome enrages her.',
      'Clear a wide box: she needs to be able to follow you, and you need to keep moving.',
      'Multiple platform layers so you can loop vertically as well as horizontally.',
      'Block off side tunnels so Jungle enemies do not join in.',
      'Break the bulb only when the arena is finished.',
    ],
  },

  corruption: {
    id: 'corruption',
    name: 'Evil Biome Chamber (EoW / BoC)',
    size: '~60 blocks wide, 30 tall, inside the evil biome',
    summary: 'A cleared chamber so the worm cannot ambush you through walls and Creepers cannot hide.',
    rows: [
      { type: 'platform', label: 'PLATFORM' },
      { type: 'gap' },
      { type: 'player', label: 'YOU' },
      { type: 'platform', label: 'PLATFORM' },
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
      { type: 'ground', label: 'FLOOR' },
    ],
    props: ['campfire', 'heart_lantern'],
    guidelines: [
      'Clear a wide, well-lit box in the evil biome — do not fight in a narrow tunnel.',
      'Two platform layers is enough at this stage.',
      'Seal the chasm pits so you do not fall mid-fight.',
      'A Campfire is cheap and makes a real difference this early.',
    ],
  },

  temple: {
    id: 'temple',
    name: 'Lihzahrd Altar Room (Golem)',
    size: 'The Altar chamber, plus platforms',
    summary: 'Golem is bound to the Temple. Fight him in a low-ceilinged room and he cannot jump on you.',
    rows: [
      { type: 'platform', label: 'CEILING' },
      { type: 'gap' },
      { type: 'platform', label: 'PLATFORM' },
      { type: 'player', label: 'YOU' },
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
      { type: 'ground', label: 'ALTAR FLOOR' },
    ],
    props: ['campfire', 'heart_lantern'],
    guidelines: [
      'Widen the Altar room but keep the ceiling low — it limits Golem\'s jumps.',
      'Add one platform layer so you can shoot over his fists.',
      'Clear the Lihzahrd traps first (they hurt a lot at this stage).',
      'Do not lure him out of the Temple — he becomes much more aggressive.',
    ],
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean Platform Bridge (Duke Fishron)',
    size: '300+ blocks of platforms over the ocean',
    summary: 'Fishron is fast in every phase. Pure horizontal running space is what you need.',
    rows: [
      { type: 'gap' },
      { type: 'platform', label: 'PLATFORM', long: true },
      { type: 'player', label: 'YOU' },
      { type: 'gap' },
      { type: 'props', label: 'BUFFS' },
      { type: 'ground', label: 'OCEAN' },
    ],
    props: ['campfire', 'heart_lantern'],
    guidelines: [
      'Build a long platform bridge just above the water.',
      'Keep Heart Lanterns and Campfires along it — you will need the regen.',
      'His third phase is very fast; make sure you have somewhere to run to.',
      'You can also fight him over land if you carry the Truffle Worm.',
    ],
  },
};

export function arenaFor(boss) {
  return ARENAS[boss?.arena] || ARENAS.standard;
}
