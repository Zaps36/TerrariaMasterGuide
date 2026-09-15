/**
 * Class builds per progression stage.
 *
 * This is the single source of truth for loadouts. Boss detail pages read
 * from here using the boss's stage, so a recommendation never has to be
 * written twice.
 *
 *   weapon      the best practical pick
 *   alt         good alternatives / what to use if you did not get the drop
 *   armor       armor sets in preference order
 *   accessories the slots that matter most, in priority order
 *   ammo        ranger only
 *   potions     buff priorities for this stage
 *   upgrades    milestone objectives, not items
 */

export const CLASS_BUILDS = {
  melee: {
    early: {
      weapon: ['gold_broadsword'],
      alt: ['enchanted_sword', 'wooden_boomerang', 'copper_shortsword'],
      armor: ['gold_armor'],
      accessories: ['hermes_boots', 'cloud_in_a_bottle', 'grappling_hook', 'lucky_horseshoe'],
      potions: ['healing_potion', 'ironskin_potion', 'spelunker_potion'],
      upgrades: [
        'Collect 10 Life Crystals (200 HP) before your first boss',
        'Build a 3-room house so the Merchant and Nurse move in',
        'Keep an eye out for an Enchanted Sword Shrine underground',
      ],
      note: 'Melee is the most forgiving start. Prioritise health and boots over a better sword.',
    },
    'pre-skeletron': {
      weapon: ['starfury'],
      alt: ['blade_of_grass', 'ball_o_hurt', 'the_rotted_fork', 'muramasa'],
      armor: ['gold_armor'],
      accessories: ['spectre_boots', 'cloud_in_a_balloon', 'shield_of_cthulhu', 'band_of_regeneration'],
      potions: ['healing_potion', 'ironskin_potion', 'regeneration_potion', 'swiftness_potion'],
      upgrades: [
        'Reach 300 maximum health (15 Life Crystals)',
        'Rescue the Goblin Tinkerer for Rocket Boots and reforging',
        'Start collecting Night\'s Edge components',
      ],
      note: 'Starfury from a Floating Island outclasses everything else at this point.',
    },
    'pre-wof': {
      weapon: ['nights_edge'],
      alt: ['dark_lance', 'sunfury', 'fiery_greatsword'],
      armor: ['molten_armor', 'shadow_armor', 'crimson_armor'],
      accessories: ['obsidian_shield', 'spectre_boots', 'bundle_of_balloons', 'lucky_horseshoe'],
      potions: ['healing_potion', 'ironskin_potion', 'regeneration_potion', 'obsidian_skin_potion', 'swiftness_potion'],
      upgrades: [
        'Mine Hellstone with Obsidian Skin Potions and craft Molten Armor',
        'Reach 400 maximum health',
        'Build a long flat bridge across The Underworld',
      ],
      note: 'Molten Armor + Night\'s Edge is the classic pre-Hardmode melee peak.',
    },
    'early-hardmode': {
      weapon: ['shadowflame_knife'],
      alt: ['amarok', 'cutlass', 'nights_edge'],
      armor: ['cobalt_armor', 'mythril_armor'],
      accessories: ['frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'obsidian_shield'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'regeneration_potion', 'swiftness_potion'],
      upgrades: [
        'Get a full tier-1 or tier-2 Hardmode ore set before fighting anything',
        'Farm Wyverns for Souls of Flight and craft wings',
        'Contain the new Corruption/Crimson and Hallow stripes with hellevators',
      ],
      note: 'Do not rush the mechs. Hardmode enemies alone will kill you in pre-Hardmode gear.',
    },
    mech: {
      weapon: ['amarok'],
      alt: ['light_disc', 'fetid_baghnakhs', 'ice_sickle'],
      armor: ['adamantite_armor', 'frost_armor'],
      accessories: ['frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'obsidian_shield', 'cross_necklace'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'regeneration_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Craft Mechanical Eye / Worm / Skull so you fight them one at a time',
        'Build a long sky bridge with campfires and heart lanterns',
        'Titanium armor\'s Shadow Dodge is the best defensive option here',
      ],
      note: 'Amarok plus a long bridge handles all three mechs comfortably.',
    },
    'pre-plantera': {
      weapon: ['true_nights_edge'],
      alt: ['light_disc', 'ice_sickle', 'fetid_baghnakhs', 'true_excalibur'],
      armor: ['chlorophyte_armor', 'hallowed_armor'],
      accessories: ['mechanical_glove', 'avenger_emblem', 'charm_of_myths', 'star_veil', 'frostspark_boots', 'demon_angel_wings'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'wrath_potion', 'rage_potion', 'flask_of_ichor'],
      upgrades: [
        'Farm Chlorophyte with your new Pickaxe Axe',
        'Collect 20 Life Fruit in the Hardmode Jungle (500 HP)',
        'Hunt Broken Hero Swords in Solar Eclipses for the Terra Blade line',
      ],
      note: 'Ichor or Cursed Flames flasks add a surprising amount of damage.',
    },
    'post-plantera': {
      weapon: ['terra_blade'],
      alt: ['death_sickle', 'paladins_hammer', 'vampire_knives', 'scourge_of_the_corruptor'],
      armor: ['turtle_armor', 'chlorophyte_armor'],
      accessories: ['fire_gauntlet', 'destroyer_emblem', 'ankh_shield', 'terraspark_boots', 'fishron_wings', 'celestial_shell', 'master_ninja_gear'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'wrath_potion', 'rage_potion', 'flask_of_ichor'],
      upgrades: [
        'Clear the Jungle Temple for Beetle Husk access via Golem',
        'Farm the post-Plantera Dungeon (Paladins, Ectoplasm, biome keys)',
        'Reforge every accessory to Warding or Menacing',
      ],
      note: 'This is the biggest single power jump in the game — take your time here.',
    },
    lunar: {
      weapon: ['solar_eruption'],
      alt: ['daybreak', 'influx_waver', 'possessed_hatchet', 'terra_blade'],
      armor: ['beetle_armor', 'turtle_armor'],
      accessories: ['fire_gauntlet', 'destroyer_emblem', 'ankh_shield', 'fishron_wings', 'celestial_shell', 'master_ninja_gear'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'wrath_potion', 'rage_potion', 'flask_of_ichor'],
      upgrades: [
        'Beat the Solar Pillar first — Solar Eruption carries the rest of the event',
        'Build a wide arena with wired Heart Statues',
        'Beetle Armor (damage reduction shell) for survivability',
      ],
      note: 'Solar Eruption reaches through blocks, which makes the pillars trivial.',
    },
    'moon-lord': {
      weapon: ['solar_eruption'],
      alt: ['daybreak', 'influx_waver', 'terra_blade'],
      armor: ['beetle_armor', 'solar_flare_armor'],
      accessories: ['fire_gauntlet', 'destroyer_emblem', 'ankh_shield', 'fishron_wings', 'celestial_shell', 'star_veil'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'wrath_potion', 'rage_potion', 'flask_of_ichor'],
      upgrades: [
        'Solar Eruption + Daybreak covers both the eyes and the core',
        'Heart Statue arena is close to mandatory in Expert and Master',
        'Solar Flare Armor comes after the fight — go in with Beetle',
      ],
      note: 'Kill the two hand eyes first, then the head, then burst the core.',
    },
  },

  ranger: {
    early: {
      weapon: ['boomstick'],
      alt: ['wooden_bow', 'demon_bow'],
      armor: ['gold_armor'],
      accessories: ['hermes_boots', 'cloud_in_a_bottle', 'grappling_hook', 'lucky_horseshoe'],
      ammo: ['flaming_arrow', 'wooden_arrow', 'musket_ball'],
      potions: ['healing_potion', 'ironskin_potion', 'spelunker_potion'],
      upgrades: [
        'Save 35 gold for the Minishark — it is a game-changer',
        'Collect 10 Life Crystals (200 HP)',
        'Explore the Underground Jungle for a Boomstick',
      ],
      note: 'Ranger is item-dependent early. Ammo choice matters more than the weapon.',
    },
    'pre-skeletron': {
      weapon: ['minishark'],
      alt: ['musket', 'the_undertaker', 'demon_bow'],
      armor: ['gold_armor'],
      accessories: ['spectre_boots', 'cloud_in_a_balloon', 'shield_of_cthulhu', 'band_of_regeneration'],
      ammo: ['musket_ball', 'silver_bullet', 'jesters_arrow', 'unholy_arrow'],
      potions: ['healing_potion', 'ironskin_potion', 'regeneration_potion', 'archery_potion'],
      upgrades: [
        'Reach 300 maximum health',
        'Buy the Minishark from the Arms Dealer',
        'Stock 1000+ Musket Balls before any boss',
      ],
      note: "Jester's Arrows pierce infinitely — they melt worm bosses.",
    },
    'pre-wof': {
      weapon: ['molten_fury'],
      alt: ['phoenix_blaster', 'hellwing_bow', 'star_cannon', 'minishark'],
      armor: ['necro_armor', 'molten_armor'],
      accessories: ['obsidian_shield', 'spectre_boots', 'bundle_of_balloons', 'lucky_horseshoe'],
      ammo: ['jesters_arrow', 'unholy_arrow', 'meteor_shot', 'musket_ball'],
      potions: ['healing_potion', 'ironskin_potion', 'regeneration_potion', 'archery_potion', 'obsidian_skin_potion'],
      upgrades: [
        'Craft Molten Fury and Phoenix Blaster from Hellstone Bars',
        'Necro Armor saves 20% of your ammo — worth the Dungeon trip',
        'Build a long Hell bridge for the Wall of Flesh',
      ],
      note: 'Molten Fury with Unholy or Jester Arrows is the strongest pre-Hardmode ranged setup.',
    },
    'early-hardmode': {
      weapon: ['daedalus_stormbow'],
      alt: ['clockwork_assault_rifle', 'molten_fury', 'phoenix_blaster'],
      armor: ['cobalt_armor', 'mythril_armor'],
      accessories: ['frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'magic_quiver'],
      ammo: ['holy_arrow', 'jesters_arrow', 'musket_ball'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'archery_potion', 'swiftness_potion'],
      upgrades: [
        'Craft Hallowed Keys from 15 Souls of Light to farm Hallowed Mimics',
        'Get wings before fighting a mechanical boss',
        'Ranger Emblem from the Wall of Flesh (+15% ranged damage)',
      ],
      note: 'Daedalus Stormbow + Holy Arrows is famously overpowered here. Use it.',
    },
    mech: {
      weapon: ['daedalus_stormbow'],
      alt: ['megashark', 'onyx_blaster', 'uzi', 'clockwork_assault_rifle'],
      armor: ['adamantite_armor', 'frost_armor'],
      accessories: ['frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'magic_quiver', 'cross_necklace'],
      ammo: ['holy_arrow', 'crystal_bullet', 'ichor_bullet'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'archery_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Build a long sky bridge and fly parallel to the boss',
        'Craft Megashark once you have Souls of Might',
        'Place an Ammo Box in your arena',
      ],
      note: 'Holy Arrows from above deletes The Destroyer in under a minute.',
    },
    'pre-plantera': {
      weapon: ['megashark'],
      alt: ['daedalus_stormbow', 'onyx_blaster', 'uzi'],
      armor: ['chlorophyte_armor', 'hallowed_armor'],
      accessories: ['avenger_emblem', 'magic_quiver', 'charm_of_myths', 'star_veil', 'frostspark_boots', 'demon_angel_wings'],
      ammo: ['crystal_bullet', 'ichor_bullet', 'holy_arrow'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'archery_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Megashark + Crystal Bullets is the mid-Hardmode standard',
        'Collect 20 Life Fruit for 500 HP',
        'Craft an Endless Musket Pouch so ammo stops being a chore',
      ],
      note: 'Crystal Bullets shatter into shards — best sustained DPS available.',
    },
    'post-plantera': {
      weapon: ['chlorophyte_shotbow'],
      alt: ['venus_magnum', 'sniper_rifle', 'tsunami', 'megashark', 'grenade_launcher'],
      armor: ['shroomite_armor', 'chlorophyte_armor'],
      accessories: ['sniper_scope', 'destroyer_emblem', 'magic_quiver', 'ankh_shield', 'terraspark_boots', 'fishron_wings', 'master_ninja_gear'],
      ammo: ['chlorophyte_bullet', 'holy_arrow', 'ichor_bullet', 'rocket_i'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'archery_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Get Shroomite Armor (needs the Truffle NPC and an Autohammer)',
        'Chlorophyte Bullets home — never miss again',
        'Fish up a Truffle Worm for Duke Fishron and the Tsunami',
      ],
      note: 'Shroomite stealth means standing still is a damage bonus. Build a platform arena.',
    },
    lunar: {
      weapon: ['phantasm'],
      alt: ['vortex_beater', 'tsunami', 'chlorophyte_shotbow', 'sniper_rifle'],
      armor: ['shroomite_armor', 'vortex_armor'],
      accessories: ['sniper_scope', 'destroyer_emblem', 'magic_quiver', 'ankh_shield', 'fishron_wings', 'celestial_shell', 'master_ninja_gear'],
      ammo: ['chlorophyte_bullet', 'holy_arrow', 'ichor_bullet'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'archery_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Kill the Vortex Pillar first for Phantasm',
        'Shroomite Bow helmet + Magic Quiver stacks beautifully with Phantasm',
        'Wired Heart Statues in your arena',
      ],
      note: 'Phantasm with Holy Arrows is one of the highest DPS setups in the game.',
    },
    'moon-lord': {
      weapon: ['phantasm'],
      alt: ['vortex_beater', 'tsunami', 'sniper_rifle'],
      armor: ['vortex_armor', 'shroomite_armor'],
      accessories: ['sniper_scope', 'destroyer_emblem', 'magic_quiver', 'ankh_shield', 'fishron_wings', 'celestial_shell', 'star_veil'],
      ammo: ['chlorophyte_bullet', 'holy_arrow', 'luminite_bullet'],
      potions: ['healing_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'archery_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Bring 1000+ rounds — Moon Lord has a lot of health',
        'Vortex Armor stealth if you can get it before the fight',
        'Stand still on a platform for the Shroomite/Vortex stealth bonus',
      ],
      note: 'Ranger is arguably the easiest class for Moon Lord. Focus the hand eyes first.',
    },
  },

  mage: {
    early: {
      weapon: ['amethyst_staff'],
      alt: ['wand_of_sparking'],
      armor: ['gold_armor'],
      accessories: ['hermes_boots', 'cloud_in_a_bottle', 'grappling_hook', 'band_of_regeneration'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'spelunker_potion'],
      upgrades: [
        'Craft the best gem staff you can — Diamond Staff is genuinely strong',
        'Craft Mana Crystals from Fallen Stars (aim for 200 mana)',
        'Collect Jungle Spores and Stingers for Jungle Armor',
      ],
      note: 'Mage is weakest right at the start. Get mana capacity up and stay at range.',
    },
    'pre-skeletron': {
      weapon: ['water_bolt'],
      alt: ['aqua_scepter', 'vilethorn', 'crimson_rod', 'amethyst_staff'],
      armor: ['jungle_armor'],
      accessories: ['spectre_boots', 'cloud_in_a_balloon', 'shield_of_cthulhu', 'band_of_regeneration'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'regeneration_potion', 'magic_power_potion'],
      upgrades: [
        'Loot the Dungeon entrance bookshelves for a Water Bolt',
        'Reach 300 maximum health and 200 mana',
        'Craft a Mana Flower as soon as you find Nature\'s Gift',
      ],
      note: 'Water Bolt is absurd for how early you can find it — bouncing piercing damage.',
    },
    'pre-wof': {
      weapon: ['demon_scythe'],
      alt: ['space_gun', 'flower_of_fire', 'book_of_skulls', 'water_bolt'],
      armor: ['meteor_armor', 'molten_armor'],
      accessories: ['mana_flower', 'obsidian_shield', 'spectre_boots', 'bundle_of_balloons'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'regeneration_potion', 'magic_power_potion', 'obsidian_skin_potion'],
      upgrades: [
        'Meteor Armor + Space Gun = zero mana cost lasers',
        'Farm Demons in Hell for the Demon Scythe',
        'Place a Crystal Ball in your base once the Wizard arrives',
      ],
      note: 'Space Gun with Meteor Armor is infinite free damage. Demon Scythe is the raw power pick.',
    },
    'early-hardmode': {
      weapon: ['crystal_serpent'],
      alt: ['demon_scythe', 'diamond_staff', 'space_gun'],
      armor: ['mythril_armor', 'cobalt_armor', 'forbidden_armor'],
      accessories: ['mana_flower', 'frostspark_boots', 'demon_angel_wings', 'warrior_emblem'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'magic_power_potion'],
      upgrades: [
        'Fish in the Hallow for a Crystal Serpent — it is a huge upgrade',
        'Sorcerer Emblem from the Wall of Flesh',
        'Get wings before touching a mechanical boss',
      ],
      note: 'Crystal Serpent carries mage from Hardmode start all the way to the mechs.',
    },
    mech: {
      weapon: ['crystal_serpent'],
      alt: ['sky_fracture', 'crystal_storm', 'magical_harp', 'cursed_flames', 'golden_shower'],
      armor: ['adamantite_armor', 'mythril_armor'],
      accessories: ['mana_flower', 'frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'cross_necklace'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'magic_power_potion', 'wrath_potion', 'rage_potion'],
      upgrades: [
        'Place a Star Statue on a timer in your arena for infinite mana',
        'Magical Harp is excellent against The Destroyer',
        'Golden Shower (Crimson) lowers boss defense for everything you fire after',
      ],
      note: 'Mana sustain is the real challenge. Star statues and a Mana Flower solve it.',
    },
    'pre-plantera': {
      weapon: ['cursed_flames'],
      alt: ['golden_shower', 'sky_fracture', 'crystal_storm', 'magical_harp'],
      armor: ['chlorophyte_armor', 'hallowed_armor'],
      accessories: ['celestial_emblem', 'mana_flower', 'charm_of_myths', 'star_veil', 'frostspark_boots', 'demon_angel_wings'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'magic_power_potion', 'wrath_potion'],
      upgrades: [
        'Farm Mimics in your evil biome for Cursed Flames / Golden Shower',
        'Collect 20 Life Fruit for 500 HP',
        'Chlorophyte Armor for the defense boost before Plantera',
      ],
      note: 'Bouncing debuff weapons are perfect for Plantera\'s enclosed jungle arena.',
    },
    'post-plantera': {
      weapon: ['razorblade_typhoon'],
      alt: ['spectre_staff', 'leaf_blower', 'rainbow_rod', 'cursed_flames'],
      armor: ['spectre_armor', 'chlorophyte_armor'],
      accessories: ['celestial_emblem', 'destroyer_emblem', 'mana_flower', 'ankh_shield', 'terraspark_boots', 'fishron_wings', 'celestial_shell'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'magic_power_potion', 'wrath_potion'],
      upgrades: [
        'Farm Ectoplasm in the post-Plantera Dungeon for Spectre gear',
        'Spectre Hood turns damage into healing — swap hats per fight',
        'Duke Fishron for Razorblade Typhoon',
      ],
      note: 'Spectre Hood + any homing weapon makes you almost impossible to kill.',
    },
    lunar: {
      weapon: ['nebula_arcanum'],
      alt: ['nebula_blaze', 'razorblade_typhoon', 'spectre_staff'],
      armor: ['spectre_armor', 'nebula_armor'],
      accessories: ['celestial_emblem', 'destroyer_emblem', 'mana_flower', 'ankh_shield', 'fishron_wings', 'celestial_shell', 'master_ninja_gear'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'magic_power_potion', 'wrath_potion'],
      upgrades: [
        'Nebula Pillar first — Nebula Armor boosters are a massive damage buff',
        'Wired Star Statues for mana, Heart Statues for life',
        'Keep the Spectre Hood as a panic swap',
      ],
      note: 'Nebula Armor stacks three damage boosters. Pick them up and your DPS doubles.',
    },
    'moon-lord': {
      weapon: ['nebula_arcanum'],
      alt: ['nebula_blaze', 'razorblade_typhoon', 'last_prism'],
      armor: ['nebula_armor', 'spectre_armor'],
      accessories: ['celestial_emblem', 'destroyer_emblem', 'mana_flower', 'ankh_shield', 'fishron_wings', 'celestial_shell', 'star_veil'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'magic_power_potion', 'wrath_potion'],
      upgrades: [
        'Bring 30+ Mana Potions and a Star Statue setup',
        'Nebula boosters from the Moon Lord\'s own minions keep you buffed',
        'Last Prism drops from this fight and outclasses everything after',
      ],
      note: 'Mana is the constraint. Star statues plus Mana Flower makes this fight comfortable.',
    },
  },

  summoner: {
    early: {
      weapon: ['finch_staff'],
      alt: ['leather_whip', 'slime_staff'],
      armor: ['gold_armor'],
      accessories: ['hermes_boots', 'cloud_in_a_bottle', 'grappling_hook', 'band_of_regeneration'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'summoning_potion'],
      upgrades: [
        'Search Living Trees for a Finch Staff',
        'Get a whip immediately — whips are how summoner damage scales',
        'Collect 10 Life Crystals; summoner has low defense',
      ],
      note: 'Summoner has the hardest start. Always carry a whip and keep tagging.',
    },
    'pre-skeletron': {
      weapon: ['hornet_staff'],
      alt: ['finch_staff', 'snapthorn', 'leather_whip'],
      armor: ['bee_armor'],
      accessories: ['spectre_boots', 'cloud_in_a_balloon', 'shield_of_cthulhu', 'band_of_regeneration'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'summoning_potion', 'regeneration_potion'],
      upgrades: [
        'Kill Queen Bee for Bee Armor and the Hornet Staff',
        'Craft Snapthorn from Jungle materials',
        'Reach 300 maximum health',
      ],
      note: 'Queen Bee is the summoner unlock. Do her before Skeletron.',
    },
    'pre-wof': {
      weapon: ['imp_staff'],
      alt: ['hornet_staff', 'spinal_tap', 'snapthorn'],
      armor: ['obsidian_armor', 'molten_armor', 'bee_armor'],
      accessories: ['obsidian_shield', 'spectre_boots', 'bundle_of_balloons', 'lucky_horseshoe'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'summoning_potion', 'bewitching_table', 'obsidian_skin_potion'],
      upgrades: [
        'Craft the Imp Staff from Hellstone Bars — best pre-Hardmode minion',
        'Grab a Bewitching Table from the Dungeon for a free minion slot',
        'Obsidian Armor boosts whip range and speed by 30%',
      ],
      note: 'Imp Staff + Spinal Tap + Obsidian Armor is the pre-Hardmode summoner peak.',
    },
    'early-hardmode': {
      weapon: ['spider_staff'],
      alt: ['blade_staff', 'imp_staff', 'firecracker'],
      armor: ['spider_armor', 'forbidden_armor'],
      accessories: ['frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'pygmy_necklace'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'summoning_potion', 'bewitching_table'],
      upgrades: [
        'Find Spider Caves and farm 46 Spider Fangs for the full set',
        'Firecracker from the Wall of Flesh is a huge whip upgrade',
        'Queen Slime for the Blade Staff',
      ],
      note: 'Spider Armor gives +3 minions. It is the biggest summoner spike in Hardmode.',
    },
    mech: {
      weapon: ['sanguine_staff'],
      alt: ['blade_staff', 'optic_staff', 'spider_staff'],
      armor: ['spider_armor', 'adamantite_armor'],
      accessories: ['frostspark_boots', 'demon_angel_wings', 'warrior_emblem', 'pygmy_necklace', 'cross_necklace'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'summoning_potion', 'bewitching_table', 'wrath_potion'],
      upgrades: [
        'Fish a Blood Moon for the Dreadnautilus and the Sanguine Staff',
        'Craft Durendal after the first mech for tag speed',
        'Place a Bewitching Table in your arena',
      ],
      note: 'Blade Staff + Durendal + Firecracker is a well-known mech-melting combo.',
    },
    'pre-plantera': {
      weapon: ['sanguine_staff'],
      alt: ['optic_staff', 'blade_staff', 'durendal'],
      armor: ['chlorophyte_armor', 'spider_armor', 'hallowed_armor'],
      accessories: ['avenger_emblem', 'pygmy_necklace', 'charm_of_myths', 'star_veil', 'frostspark_boots', 'demon_angel_wings'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'summoning_potion', 'wrath_potion'],
      upgrades: [
        'Always be whipping — minion damage without tags is half damage',
        'Collect 20 Life Fruit for 500 HP',
        'Chlorophyte Armor for defense until Tiki is available',
      ],
      note: 'Whip stacking (Durendal + Firecracker) matters more than the minion you pick.',
    },
    'post-plantera': {
      weapon: ['tempest_staff'],
      alt: ['xeno_staff', 'deadly_sphere_staff', 'raven_staff', 'terraprisma'],
      armor: ['tiki_armor', 'spooky_armor'],
      accessories: ['papyrus_scarab', 'necromantic_scroll', 'pygmy_necklace', 'destroyer_emblem', 'ankh_shield', 'terraspark_boots', 'fishron_wings'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'summoning_potion', 'wrath_potion'],
      upgrades: [
        'Move the Witch Doctor to a Jungle house for Tiki Armor and Pygmy Necklace',
        'Kaleidoscope from the Empress of Light is the best whip in the game',
        'Pumpkin Moon for Spooky Armor and the Necromantic Scroll',
      ],
      note: 'Tiki + Papyrus Scarab + Kaleidoscope is the classic late Hardmode summoner core.',
    },
    lunar: {
      weapon: ['stardust_dragon_staff'],
      alt: ['stardust_cell_staff', 'xeno_staff', 'tempest_staff', 'terraprisma'],
      armor: ['spooky_armor', 'tiki_armor'],
      accessories: ['papyrus_scarab', 'necromantic_scroll', 'pygmy_necklace', 'destroyer_emblem', 'ankh_shield', 'fishron_wings', 'celestial_shell'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'summoning_potion', 'wrath_potion'],
      upgrades: [
        'Stardust Pillar first — the Dragon scales with every minion slot',
        'Dark Harvest whip if you skipped the Empress',
        'Maximise minion slots: armor + Papyrus Scarab + Pygmy Necklace + potion',
      ],
      note: 'The Stardust Dragon gets stronger with each summon slot. Stack them all.',
    },
    'moon-lord': {
      weapon: ['stardust_dragon_staff'],
      alt: ['stardust_cell_staff', 'terraprisma', 'xeno_staff'],
      armor: ['stardust_armor', 'spooky_armor'],
      accessories: ['papyrus_scarab', 'necromantic_scroll', 'pygmy_necklace', 'destroyer_emblem', 'ankh_shield', 'fishron_wings', 'celestial_shell'],
      potions: ['healing_potion', 'mana_potion', 'ironskin_potion', 'endurance_potion', 'lifeforce_potion', 'summoning_potion', 'wrath_potion'],
      upgrades: [
        'Stardust Dragon plus a whip does the whole fight for you',
        'Keep whipping the core — tag damage applies to every dragon segment',
        'Stardust Armor\'s Guardian can hold aggro on the True Eyes',
      ],
      note: 'Summoner is very strong here: dodge full-time and let the dragon work.',
    },
  },
};

/** Class-agnostic view used when the player has not picked a class. */
export function bestAcrossClasses(stageId) {
  return ['melee', 'ranger', 'mage', 'summoner']
    .map((cls) => ({ cls, build: CLASS_BUILDS[cls][stageId] }))
    .filter((entry) => entry.build);
}

export function getBuild(cls, stageId) {
  const key = cls === 'unsure' ? 'ranger' : cls;
  return CLASS_BUILDS[key]?.[stageId] || null;
}
