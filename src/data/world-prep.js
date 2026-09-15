/**
 * World preparation checklists.
 * Keys are namespaced `world:<sectionId>:<itemId>` so progress persists.
 */

export const WORLD_PREP = [
  {
    id: 'pre-hardmode',
    label: 'BEFORE HARDMODE',
    stage: 'pre-wof',
    intro:
      'Beating the Wall of Flesh changes your world permanently. Spend an hour here and Hardmode will be far kinder to you.',
    items: [
      { id: 'housing', label: 'Build NPC housing', note: 'A row of small rooms is fine. More NPCs = more shops.' },
      { id: 'storage', label: 'Establish a storage room', note: 'Chests labelled by category. You will thank yourself later.' },
      { id: 'herbs', label: 'Create potion farms', note: 'Clay Pots + herb seeds from the Dryad.' },
      { id: 'fishing', label: 'Prepare fishing spots', note: 'Fishing gives crates, quest rewards and potion fish.' },
      { id: 'arenas', label: 'Build your important arenas', note: 'A surface arena and the Hell bridge.' },
      { id: 'accessories', label: 'Secure key accessories', note: 'Spectre Boots, Obsidian Shield, a jump accessory.' },
      { id: 'wof-arena', label: 'Build the Wall of Flesh bridge', note: 'Long, flat, blocks not platforms.' },
      { id: 'hp400', label: 'Reach 400 maximum health', note: '20 Life Crystals.', global: 'gear:hp400' },
      { id: 'molten', label: 'Craft Molten Armor (or your class equivalent)' },
      { id: 'hellevator', label: 'Dig a hellevator or two', note: 'Also acts as a Corruption/Hallow firebreak.' },
    ],
  },
  {
    id: 'pre-mech',
    label: 'BEFORE MECHANICAL BOSSES',
    stage: 'early-hardmode',
    intro:
      'Hardmode enemies alone will kill you in pre-Hardmode gear. Do not rush the mechs — build up first.',
    items: [
      { id: 'armor', label: 'Upgrade to a full Hardmode ore set', note: 'Adamantite or Titanium ideally.' },
      { id: 'wings', label: 'Get wings', note: 'Farm Wyverns for Souls of Flight.', global: 'gear:wings' },
      { id: 'arena', label: 'Build a long sky bridge arena' },
      { id: 'buffs', label: 'Stock buff potions', note: 'Ironskin, Endurance, Regeneration, Wrath, Rage.' },
      { id: 'weapon', label: 'Upgrade your weapon', note: 'Daedalus Stormbow, Amarok, Crystal Serpent, Spider Staff.' },
      { id: 'summons', label: 'Craft mech summon items', note: 'So you fight them one at a time.' },
      { id: 'altars', label: 'Smash 3–6 Demon Altars only', note: 'Each one seeds more Corruption in your world.' },
      { id: 'emblem', label: 'Get your class Emblem from the Wall of Flesh' },
      { id: 'reforge', label: 'Reforge accessories', note: 'Warding for survival, Menacing for damage.' },
    ],
  },
  {
    id: 'pre-plantera',
    label: 'BEFORE PLANTERA',
    stage: 'pre-plantera',
    intro: 'Plantera is the mid-game wall. Health and arena size matter more than raw damage.',
    items: [
      { id: 'jungle-arena', label: 'Build a large Jungle arena', note: 'Inside the biome — leaving it enrages her.' },
      { id: 'hp500', label: 'Collect 20 Life Fruit (500 HP)', global: 'gear:hp500' },
      { id: 'mobility', label: 'Upgrade mobility', note: 'Frostspark Boots + wings minimum.' },
      { id: 'healing', label: 'Healing infrastructure', note: 'Campfires, Heart Lanterns, honey pool, Nurse nearby.' },
      { id: 'armor', label: 'Hallowed or Chlorophyte armor' },
      { id: 'chlorophyte', label: 'Farm Chlorophyte with the Pickaxe Axe' },
      { id: 'accessories', label: 'Craft Charm of Myths and Star Veil' },
    ],
  },
  {
    id: 'pre-golem',
    label: 'BEFORE GOLEM & THE TEMPLE',
    stage: 'post-plantera',
    intro: 'Plantera opened the Temple and upgraded the Dungeon. This is the biggest loot window in the game.',
    items: [
      { id: 'temple', label: 'Clear a path through the Jungle Temple' },
      { id: 'traps', label: 'Disable or avoid the Lihzahrd traps' },
      { id: 'dungeon', label: 'Farm the post-Plantera Dungeon', note: 'Ectoplasm, biome keys, Paladins.' },
      { id: 'armor', label: 'Upgrade to Turtle / Shroomite / Spectre / Tiki armor' },
      { id: 'platforms', label: 'Place platforms in the Altar room' },
      { id: 'truffle', label: 'Build a surface Mushroom house for the Truffle NPC' },
    ],
  },
  {
    id: 'pre-moon-lord',
    label: 'BEFORE MOON LORD',
    stage: 'moon-lord',
    intro: 'The final fight. Preparation here is not optional, especially in Expert and Master.',
    items: [
      { id: 'armor', label: 'Final pre-Lord armor', note: 'Beetle / Shroomite / Spectre / Spooky.' },
      { id: 'accessories', label: 'Final accessories, all reforged' },
      { id: 'buffs', label: 'Full buff stack brewed', note: 'Including Lifeforce and Endurance.' },
      { id: 'arena', label: 'Wide arena with wired Heart Statues', global: 'gear:heart-statue' },
      { id: 'healing', label: 'Healing strategy', note: 'Charm of Myths + 30 Healing Potions + Nurse house.' },
      { id: 'weapon', label: 'A Lunar-tier weapon for your class' },
      { id: 'hp500', label: '500 maximum health', global: 'gear:hp500' },
      { id: 'wings', label: 'Best available wings', global: 'gear:wings' },
    ],
  },
];

export const WORLD_PREP_MAP = Object.fromEntries(WORLD_PREP.map((s) => [s.id, s]));

export function worldPrepKey(sectionId, item) {
  return item.global || `world:${sectionId}:${item.id}`;
}
