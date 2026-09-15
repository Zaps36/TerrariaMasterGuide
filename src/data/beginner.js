/**
 * Beginner guide content — deliberately plain language.
 */

export const FIRST_STEPS = [
  {
    id: 'wood',
    title: 'Chop wood',
    body: 'Hit trees with your axe. Wood makes almost everything early: a Work Bench, a house, a bow, chests.',
    tip: 'Get about 200 wood before you do anything else.',
  },
  {
    id: 'house',
    title: 'Build a house',
    body: 'A house needs walls, a floor, a door, a light source, a table and a chair. Build three small rooms in a row.',
    tip: 'NPCs move in on their own once a house is valid.',
  },
  {
    id: 'chests',
    title: 'Find surface chests',
    body: 'Wooden chests on the surface and in the first caves hold accessories, potions and sometimes a spear or bow.',
    tip: 'Never walk past a chest. Early accessories come almost entirely from chests.',
  },
  {
    id: 'mobility',
    title: 'Get mobility accessories',
    body: 'Hermes Boots (run fast) and Cloud in a Bottle (double jump) are the two items that make the game click.',
    tip: 'Mobility beats damage in every early boss fight.',
  },
  {
    id: 'health',
    title: 'Increase your max health',
    body: 'Life Crystals are glowing heart-shaped crystals underground. Each one gives +20 max health, up to 400.',
    tip: 'Brew Spelunker Potions — they light up every crystal and ore nearby.',
  },
  {
    id: 'explore',
    title: 'Explore underground',
    body: 'Dig down and follow natural caves. Bring torches, rope and a few platforms. Gold ore starts appearing deeper down.',
    tip: 'Rope is the cheapest safety net in the game. Carry 200.',
  },
  {
    id: 'upgrade',
    title: 'Upgrade your weapons',
    body: 'Craft the best broadsword, bow or staff your ore allows. Gold or Platinum gear is the pre-boss standard.',
    tip: 'Also craft a full armor set — defense matters more than you think.',
  },
  {
    id: 'first-boss',
    title: 'Prepare for your first boss',
    body: 'Build a flat arena with a couple of platform layers, place a Campfire, brew Ironskin and Regeneration Potions, and carry 20 Healing Potions.',
    tip: 'The Eye of Cthulhu is the usual first boss. Summon it at the start of the night.',
  },
  {
    id: 'dungeon',
    title: 'Explore the Dungeon',
    body: 'After Skeletron you can loot the Dungeon: Muramasa, Water Bolt, Cobalt Shield, Handgun and a lot of Bones.',
    tip: 'Bones + Cobwebs make Necro Armor, which is excellent for rangers.',
  },
  {
    id: 'wof',
    title: 'Prepare for the Wall of Flesh',
    body: 'Mine Hellstone, craft Molten Armor, build a long flat bridge across The Underworld, then drop the Guide Voodoo Doll in lava.',
    tip: 'This starts Hardmode permanently. Finish your world preparation checklist first.',
  },
];

export const COMMON_MISTAKES = [
  {
    id: 'no-mobility',
    title: 'Fighting bosses without mobility',
    body: 'Almost every early death is a movement problem, not a damage problem. Boots and a double jump first.',
  },
  {
    id: 'ignore-accessories',
    title: 'Ignoring accessories',
    body: 'Five accessory slots is a huge amount of power. Combining them at the Tinkerer frees up even more.',
  },
  {
    id: 'no-buffs',
    title: 'Not using buff potions',
    body: 'Ironskin plus Regeneration is roughly a free armor tier. Brewing them costs almost nothing.',
  },
  {
    id: 'no-arena',
    title: 'Not building arenas',
    body: 'Flat ground, platform layers, a Campfire and a Heart Lantern turn most bosses from hard into routine.',
  },
  {
    id: 'rush-hardmode',
    title: 'Entering Hardmode unprepared',
    body: 'Hardmode enemies hit far harder than the Wall of Flesh. Get Molten-tier gear and a full world prep pass first.',
  },
  {
    id: 'no-housing',
    title: 'Forgetting NPC housing',
    body: 'Each NPC is a shop. The Merchant, Nurse, Arms Dealer and Goblin Tinkerer are all major power spikes.',
  },
  {
    id: 'selling-materials',
    title: 'Selling important crafting materials',
    body: 'Souls, bars, gems and biome materials are all recipe components. Store them, do not sell them.',
  },
  {
    id: 'smashing-altars',
    title: 'Smashing every Demon Altar',
    body: 'Each Altar you break seeds new Corruption or Crimson blocks in your world. Break three to six, then stop.',
  },
  {
    id: 'all-mechs',
    title: 'Summoning all three mechs at once',
    body: 'Craft the summon items so you can fight The Destroyer, The Twins and Skeletron Prime one at a time.',
  },
  {
    id: 'skipping-queen-bee',
    title: 'Skipping Queen Bee as a Summoner',
    body: 'Bee Armor and the Hornet Staff are the entire summoner early game. Do not skip her.',
  },
];

export const OPTIONAL_WORTH_IT = {
  early: [
    { id: 'king_slime', label: 'King Slime', why: 'Slimy Saddle mount and Ninja gear. Very easy fight.' },
    { id: 'goblin_army', label: 'Goblin Army', why: 'Unlocks the Goblin Tinkerer: Rocket Boots and accessory reforging.' },
  ],
  'pre-skeletron': [
    { id: 'queen_bee', label: 'Queen Bee', why: 'Bee Armor, Hornet Staff, Witch Doctor. Essential for summoners.' },
    { id: 'deerclops', label: 'Deerclops', why: 'The Eyebrella and Bone Helm are strong early accessories.' },
    { id: 'angler-quests', label: 'Angler quests', why: 'Fishing rewards include several excellent accessories.' },
  ],
  'pre-wof': [
    { id: 'fishing-gear', label: 'Fishing gear', why: 'Crates give ore, potions and accessories without any risk.' },
    { id: 'dungeon', label: 'Full Dungeon exploration', why: 'Water Bolt, Muramasa, Cobalt Shield, Handgun, Bones.' },
  ],
  'early-hardmode': [
    { id: 'queen_slime', label: 'Queen Slime', why: 'Blade Staff and a good pair of wings.' },
    { id: 'pirate_invasion', label: 'Pirate Invasion', why: 'Best money event in the game, plus the Cutlass.' },
  ],
  mech: [
    { id: 'spider-caves', label: 'Spider Caves', why: 'Spider Armor is the biggest summoner spike in Hardmode.' },
  ],
  'pre-plantera': [
    { id: 'blood-moon-fishing', label: 'Blood Moon fishing', why: 'Dreadnautilus drops the Sanguine Staff.' },
  ],
  'post-plantera': [
    { id: 'duke_fishron', label: 'Duke Fishron', why: 'Tsunami, Razorblade Typhoon, Tempest Staff, Fishron Wings.' },
    { id: 'empress_of_light', label: 'Empress of Light', why: 'Kaleidoscope, and the Terraprisma if you fight her in daylight.' },
    { id: 'martian_madness', label: 'Martian Madness', why: 'Influx Waver, Xeno Staff, Cosmic Car Key.' },
    { id: 'pumpkin_moon', label: 'Pumpkin Moon', why: 'Spooky Armor and the Necromantic Scroll.' },
  ],
  lunar: [
    { id: 'frost_moon', label: 'Frost Moon', why: 'North Pole, Blizzard Staff, Chain Gun.' },
  ],
  'moon-lord': [],
  endgame: [
    { id: 'zenith', label: 'Zenith hunt', why: 'Collect every component sword for the strongest weapon in the game.' },
  ],
};
