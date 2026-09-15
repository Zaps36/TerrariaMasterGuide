/**
 * Progression stages — the spine of the whole app.
 *
 * A stage is "where the player is right now". Boss loadouts, class builds,
 * world preparation and recommendations are all keyed off these ids.
 */

export const STAGES = [
  {
    id: 'early',
    name: 'Early Game',
    label: 'EARLY GAME',
    tier: 'pre-hardmode',
    order: 0,
    accent: 'var(--success)',
    blurb: 'Wood, ore and your first house. Life Crystals matter more than weapons right now.',
    focus: ['Find Life Crystals', 'Build a small house', 'Loot surface + underground chests'],
  },
  {
    id: 'pre-skeletron',
    name: 'Pre-Skeletron',
    label: 'PRE-SKELETRON',
    tier: 'pre-hardmode',
    order: 1,
    accent: 'var(--ranger)',
    blurb: 'You have beaten your first bosses. Now push toward 300 HP and the Dungeon.',
    focus: ['Reach 300+ HP', 'Get a mobility accessory', 'Upgrade your main weapon'],
  },
  {
    id: 'pre-wof',
    name: 'Pre-Wall of Flesh',
    label: 'PRE-WALL OF FLESH',
    tier: 'pre-hardmode',
    order: 2,
    accent: 'var(--warning)',
    blurb: 'The last stretch of pre-Hardmode. Hellstone gear, 400 HP and a long Hell bridge.',
    focus: ['Mine Hellstone', 'Reach 400 HP', 'Build a Hell bridge arena'],
  },
  {
    id: 'early-hardmode',
    name: 'Early Hardmode',
    label: 'EARLY HARDMODE',
    tier: 'hardmode',
    order: 3,
    accent: 'var(--mage)',
    blurb: 'Everything hits harder. Get a full Hardmode ore set before you fight anything big.',
    focus: ['Get a Pickaxe Axe path started', 'Full tier-1 Hardmode ore armor', 'Find wings or a good mount'],
  },
  {
    id: 'mech',
    name: 'Mechanical Bosses',
    label: 'MECHANICAL BOSSES',
    tier: 'hardmode',
    order: 4,
    accent: 'var(--ranger)',
    blurb: 'Three mechanical bosses gate the Jungle Temple. Fight them one at a time.',
    focus: ['Adamantite / Titanium gear', 'Long sky arena', 'Full buff potion set'],
  },
  {
    id: 'pre-plantera',
    name: 'Pre-Plantera',
    label: 'PRE-PLANTERA',
    tier: 'hardmode',
    order: 5,
    accent: 'var(--success)',
    blurb: 'Mechs are down. Farm Hallowed and Chlorophyte, then break a Jungle bulb.',
    focus: ['Hallowed or Chlorophyte armor', 'Jungle arena with platforms', 'Ichor / Cursed ammo'],
  },
  {
    id: 'post-plantera',
    name: 'Post-Plantera · Pre-Golem',
    label: 'POST-PLANTERA',
    tier: 'hardmode',
    order: 6,
    accent: 'var(--gold)',
    blurb: 'The Temple is open and the Dungeon has new enemies. This is the biggest power spike in the game.',
    focus: ['Clear the Jungle Temple', 'Farm the post-Plantera Dungeon', 'Upgrade to endgame accessories'],
  },
  {
    id: 'lunar',
    name: 'Lunar Events',
    label: 'LUNAR EVENTS',
    tier: 'hardmode',
    order: 7,
    accent: 'var(--summoner)',
    blurb: 'Golem is down. Beat the Lunatic Cultist, then survive four Celestial Pillars.',
    focus: ['Beetle / Shroomite / Spectre / Spooky armor', 'Huge arena with heart statues', 'Learn the pillar shields'],
  },
  {
    id: 'moon-lord',
    name: 'Moon Lord',
    label: 'MOON LORD',
    tier: 'hardmode',
    order: 8,
    accent: 'var(--danger)',
    blurb: 'The final fight. Luminite armor comes after him, so you go in with your best pre-Lord kit.',
    focus: ['Best available armor + wings', 'Heart Statue arena', 'Full buff stack'],
  },
  {
    id: 'endgame',
    name: 'Post-Moon Lord',
    label: 'POST-MOON LORD',
    tier: 'hardmode',
    order: 9,
    accent: 'var(--rarity-rainbow)',
    blurb: 'Luminite unlocked. Now it is all about Zenith, endgame events and building.',
    focus: ['Craft Luminite armor sets', 'Pumpkin / Frost Moon farming', 'Zenith sword hunt'],
  },
];

export const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.id, s]));

/** Stages used by the Class Builds timeline (endgame is folded into Moon Lord). */
export const BUILD_STAGE_IDS = [
  'early',
  'pre-skeletron',
  'pre-wof',
  'early-hardmode',
  'mech',
  'pre-plantera',
  'post-plantera',
  'lunar',
  'moon-lord',
];

export function stageOrder(id) {
  return STAGE_MAP[id]?.order ?? 0;
}

export function stageLabel(id) {
  return STAGE_MAP[id]?.label ?? String(id || '').toUpperCase();
}

export const PLAYER_CLASSES = [
  {
    id: 'melee',
    name: 'Melee',
    icon: '⚔️',
    accent: 'var(--melee)',
    tagline: 'High defense, close-range combat.',
    desc: 'The most forgiving class. Highest defense and health regeneration, but you have to get close.',
    strengths: ['Highest defense', 'Strong single-target damage', 'Simple to gear'],
    weaknesses: ['Short reach early on', 'Needs mobility to stay safe'],
  },
  {
    id: 'ranger',
    name: 'Ranger',
    icon: '🏹',
    accent: 'var(--ranger)',
    tagline: 'Long-range weapons and ammunition management.',
    desc: 'Consistently the strongest boss-killing class in pre-Hardmode and Hardmode — if you keep your ammo stocked.',
    strengths: ['Excellent boss damage', 'Safe range', 'Ammo swaps change everything'],
    weaknesses: ['Ammo costs money and materials', 'Low defense mid-game'],
  },
  {
    id: 'mage',
    name: 'Mage',
    icon: '🔮',
    accent: 'var(--mage)',
    tagline: 'High damage and mana management.',
    desc: 'Huge burst and crowd control with unique utility weapons, balanced by mana and paper-thin defense.',
    strengths: ['Massive damage spikes', 'Piercing and homing options', 'Great crowd control'],
    weaknesses: ['Mana dependency', 'Lowest survivability without Spectre'],
  },
  {
    id: 'summoner',
    name: 'Summoner',
    icon: '🧙',
    accent: 'var(--summoner)',
    tagline: 'Minions, whips, and lower direct defense.',
    desc: 'Your minions fight for you while you dodge. Weak early, absurdly strong once whips stack.',
    strengths: ['Damage while dodging', 'Whip tag stacking', 'Best for multitasking fights'],
    weaknesses: ['Rough early game', 'Minions need line of sight'],
  },
  {
    id: 'unsure',
    name: 'Mixed / Not Sure',
    icon: '🎲',
    accent: 'var(--gold)',
    tagline: 'Use whatever you find — decide later.',
    desc: 'Perfectly valid for a first playthrough. TerraGuide will show the strongest option across all classes.',
    strengths: ['Never bottlenecked by drops', 'Great for learning the game'],
    weaknesses: ['Armor set bonuses are split', 'Lower peak damage'],
  },
];

export const CLASS_MAP = Object.fromEntries(PLAYER_CLASSES.map((c) => [c.id, c]));

export const PRIMARY_CLASS_IDS = ['melee', 'ranger', 'mage', 'summoner'];

export const DIFFICULTIES = [
  {
    id: 'classic',
    name: 'Classic',
    icon: '🌱',
    desc: 'The original balance. Bosses are forgiving and you keep more of your coins on death.',
    hpNote: 'Baseline boss HP and damage.',
    prepMultiplier: 1,
  },
  {
    id: 'expert',
    name: 'Expert',
    icon: '🔥',
    desc: 'Bosses gain new attacks and roughly double damage. The intended "full experience" run.',
    hpNote: 'Bosses hit ~2x harder and gain extra AI phases.',
    prepMultiplier: 1.25,
    recommended: true,
  },
  {
    id: 'master',
    name: 'Master',
    icon: '💀',
    desc: 'Expert AI with about 3x damage and one extra accessory slot. Preparation is mandatory.',
    hpNote: 'Bosses hit ~3x harder. One extra accessory slot.',
    prepMultiplier: 1.5,
  },
  {
    id: 'journey',
    name: 'Journey',
    icon: '🧭',
    desc: 'Creative mode. Duplicate items, tweak difficulty sliders and research anything.',
    hpNote: 'Fully adjustable — sliders let you set your own challenge.',
    prepMultiplier: 0.75,
  },
];

export const DIFFICULTY_MAP = Object.fromEntries(DIFFICULTIES.map((d) => [d.id, d]));

export const WORLD_EVILS = [
  {
    id: 'corruption',
    name: 'Corruption',
    icon: '🟣',
    accent: 'var(--corruption)',
    desc: 'Shadow Orbs, the Eater of Worlds, and Demonite ore.',
    boss: 'eater_of_worlds',
    ore: 'Demonite',
    armor: 'Shadow Armor (+movement speed)',
    signature: ['Vilethorn', 'Ball O` Hurt', 'Musket', 'Band of Starpower', 'Cursed Flames later'],
    note: 'Corruption gives you the Musket (early ranger power) and Cursed Flames in Hardmode.',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    icon: '🔴',
    accent: 'var(--crimson)',
    desc: 'Crimson Hearts, the Brain of Cthulhu, and Crimtane ore.',
    boss: 'brain_of_cthulhu',
    ore: 'Crimtane',
    armor: 'Crimson Armor (+life regeneration)',
    signature: ['Vampire Knives later', 'The Undertaker', 'Panic Necklace', 'Ichor in Hardmode'],
    note: 'Crimson gives you Ichor (−defense debuff) and the Vampire Knives, both extremely strong.',
  },
];

export const EVIL_MAP = Object.fromEntries(WORLD_EVILS.map((e) => [e.id, e]));
