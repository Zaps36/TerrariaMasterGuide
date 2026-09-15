/**
 * Accessory upgrade chains.
 *
 * New players consistently under-value accessories, so this gets its own
 * section: what to combine, in what order, and what is optional luxury.
 */

export const ACCESSORY_CHAINS = [
  {
    id: 'boots',
    name: 'Movement Boots',
    icon: '👟',
    priority: 'Recommended',
    tone: 'gold',
    summary: 'The most important chain in the game. Every step is a real upgrade.',
    steps: ['hermes_boots', 'rocket_boots', 'spectre_boots', 'lightning_boots', 'frostspark_boots', 'terraspark_boots'],
    note: 'Hermes Boots are in almost every underground chest. Do not leave one behind.',
  },
  {
    id: 'jump',
    name: 'Jump & Air Control',
    icon: '🎈',
    priority: 'Recommended',
    tone: 'gold',
    summary: 'Double jumps stack with wings — this stays useful into the endgame.',
    steps: ['cloud_in_a_bottle', 'shiny_red_balloon', 'cloud_in_a_balloon', 'bundle_of_balloons'],
    note: 'Bundle of Balloons needs the Blizzard and Sandstorm variants too. Fish crates for them.',
  },
  {
    id: 'wings',
    name: 'Wings',
    icon: '🪽',
    priority: 'Recommended',
    tone: 'gold',
    summary: 'Non-negotiable in Hardmode. Farm Wyverns for Souls of Flight immediately.',
    steps: ['demon_angel_wings', 'fishron_wings', 'celestial_starboard'],
    note: 'Do not fight a mechanical boss without wings. It is the difference between hard and impossible.',
  },
  {
    id: 'shield',
    name: 'Defense & Knockback',
    icon: '🛡️',
    priority: 'Recommended',
    tone: 'gold',
    summary: 'Knockback immunity changes how boss fights feel. Get the Obsidian Shield early.',
    steps: ['obsidian_shield', 'ankh_shield'],
    note: 'The Cobalt Shield comes from Dungeon chests — grab it on your Skeletron trip.',
  },
  {
    id: 'damage',
    name: 'Damage Emblems',
    icon: '⚔️',
    priority: 'Recommended',
    tone: 'gold',
    summary: 'Straight percentage damage. Farm the Wall of Flesh until you get your class emblem.',
    steps: ['warrior_emblem', 'avenger_emblem', 'destroyer_emblem'],
    note: 'The Wall of Flesh drops one random emblem per kill. Re-fight it a few times.',
  },
  {
    id: 'survival',
    name: 'Survivability',
    icon: '❤️',
    priority: 'Alternative',
    tone: 'blue',
    summary: 'Extra immunity frames and faster potions. Massive in Expert and Master.',
    steps: ['band_of_regeneration', 'cross_necklace', 'charm_of_myths', 'star_veil'],
    note: 'Star Veil + Charm of Myths is the classic Expert-mode survival pair.',
  },
  {
    id: 'mobility-extra',
    name: 'Dash & Dodge',
    icon: '💨',
    priority: 'Alternative',
    tone: 'blue',
    summary: 'Dashes are free dodges. The Shield of Cthulhu is available before Skeletron.',
    steps: ['shield_of_cthulhu', 'master_ninja_gear'],
    note: 'Expert worlds get the Shield of Cthulhu very early — it stays useful all game.',
  },
  {
    id: 'luxury',
    name: 'Luxury / Quality of Life',
    icon: '✨',
    priority: 'Luxury',
    tone: 'purple',
    summary: 'Not required, but very pleasant once your damage and survival are handled.',
    steps: ['lucky_horseshoe', 'grappling_hook', 'celestial_shell'],
    note: 'Celestial Shell is a genuine best-in-slot all-rounder if you can craft it.',
  },
];

export const CLASS_ACCESSORIES = {
  melee: ['mechanical_glove', 'fire_gauntlet', 'destroyer_emblem'],
  ranger: ['magic_quiver', 'sniper_scope', 'destroyer_emblem'],
  mage: ['mana_flower', 'celestial_emblem', 'destroyer_emblem'],
  summoner: ['pygmy_necklace', 'necromantic_scroll', 'papyrus_scarab'],
};

export const REFORGE_GUIDE = [
  { id: 'warding', name: 'Warding', effect: '+4 defense per accessory', when: 'Expert / Master, or any fight you keep dying to.' },
  { id: 'menacing', name: 'Menacing', effect: '+4% damage per accessory', when: 'Once survival is solved — the standard damage reforge.' },
  { id: 'lucky', name: 'Lucky', effect: '+4% critical strike chance', when: 'Good on high-rate-of-fire builds.' },
  { id: 'quick', name: 'Quick', effect: '+4% movement speed', when: 'Mobility-focused builds and speedruns.' },
];
