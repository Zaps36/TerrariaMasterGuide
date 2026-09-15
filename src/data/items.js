import { WEAPONS } from './items-weapons.js';
import { GEAR } from './items-gear.js';
import { MISC_ITEMS } from './items-misc.js';
import { POTIONS } from './potions.js';
import { STAGE_MAP } from './stages.js';

/**
 * The unified item index. Everything searchable lives here.
 */
export const ITEMS = [...WEAPONS, ...GEAR, ...MISC_ITEMS, ...POTIONS];

export const ITEM_MAP = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function getItem(id) {
  return ITEM_MAP[id] || null;
}

/** Resolve a list of ids into items, silently dropping unknown ids. */
export function resolveItems(ids = []) {
  return ids.map((id) => ITEM_MAP[id]).filter(Boolean);
}

/** Items whose stated craft recipe includes this item. */
export function craftedFrom(itemId) {
  return ITEMS.filter((i) => i.craft?.inputs?.some((input) => input.id === itemId));
}

export const ITEM_TYPE_FILTERS = [
  { id: 'weapon', label: 'Weapons' },
  { id: 'armor', label: 'Armor' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'ammo', label: 'Ammunition' },
  { id: 'tool', label: 'Tools' },
  { id: 'potion', label: 'Potions' },
  { id: 'material', label: 'Materials' },
  { id: 'summon', label: 'Summoning Items' },
];

export const ITEM_CLASS_FILTERS = [
  { id: 'melee', label: 'Melee' },
  { id: 'ranger', label: 'Ranger' },
  { id: 'mage', label: 'Mage' },
  { id: 'summoner', label: 'Summoner' },
  { id: 'universal', label: 'Universal' },
];

/** Coarse progression buckets for the item filter bar. */
export const PROGRESSION_FILTERS = [
  { id: 'early', label: 'Early Game', stages: ['early'] },
  { id: 'pre-hardmode', label: 'Pre-Hardmode', stages: ['pre-skeletron', 'pre-wof'] },
  { id: 'early-hardmode', label: 'Early Hardmode', stages: ['early-hardmode', 'mech'] },
  { id: 'mid-hardmode', label: 'Mid Hardmode', stages: ['pre-plantera', 'post-plantera'] },
  { id: 'endgame', label: 'Endgame', stages: ['lunar', 'moon-lord', 'endgame'] },
];

const PROGRESSION_LOOKUP = {};
for (const bucket of PROGRESSION_FILTERS) {
  for (const stage of bucket.stages) PROGRESSION_LOOKUP[stage] = bucket.id;
}

export function progressionBucket(stageId) {
  return PROGRESSION_LOOKUP[stageId] || 'early';
}

/**
 * Filter the item database.
 * @param {{types?:string[], classes?:string[], buckets?:string[], query?:string, evil?:string}} options
 */
export function filterItems({ types = [], classes = [], buckets = [], query = '', evil = null } = {}) {
  const q = query.trim().toLowerCase();
  return ITEMS.filter((item) => {
    if (types.length && !types.includes(item.type)) return false;
    if (classes.length && !classes.includes(item.cls)) return false;
    if (buckets.length && !buckets.includes(progressionBucket(item.stage))) return false;
    if (evil && item.evil && item.evil !== evil) return false;
    if (q && !item.name.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Sort helper: progression order, then rating, then name. */
export function sortByProgression(items) {
  return [...items].sort((a, b) => {
    const oa = STAGE_MAP[a.stage]?.order ?? 0;
    const ob = STAGE_MAP[b.stage]?.order ?? 0;
    if (oa !== ob) return oa - ob;
    if (a.rating !== b.rating) return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
}
