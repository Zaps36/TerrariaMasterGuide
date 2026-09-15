/**
 * Global search across bosses, items, potions, NPCs and resources.
 * Simple substring + prefix scoring — fast enough for a database this size.
 */

import { BOSSES } from '../data/bosses.js';
import { ITEMS } from '../data/items.js';
import { NPCS } from '../data/npcs.js';
import { ORE_TIERS } from '../data/resources.js';

const INDEX = [
  ...BOSSES.map((b) => ({
    id: b.id,
    kind: 'boss',
    kindLabel: b.kind === 'event' ? 'Event' : 'Boss',
    name: b.name,
    haystack: `${b.name} ${b.title} ${b.blurb}`.toLowerCase(),
    sprite: b.sprite,
    tint: null,
    href: `#/bosses/${b.id}`,
    meta: b.tier === 'hardmode' ? 'Hardmode' : 'Pre-Hardmode',
  })),
  ...ITEMS.map((i) => ({
    id: i.id,
    kind: i.type === 'potion' ? 'potion' : 'item',
    kindLabel: i.type.charAt(0).toUpperCase() + i.type.slice(1),
    name: i.name,
    haystack: `${i.name} ${i.desc} ${i.source} ${i.tags.join(' ')}`.toLowerCase(),
    sprite: i.sprite,
    tint: i.tint,
    href: i.type === 'potion' ? `#/potions?item=${i.id}` : `#/items?item=${i.id}`,
    meta: i.cls === 'universal' ? i.type : `${i.cls} ${i.type}`,
  })),
  ...NPCS.map((n) => ({
    id: n.id,
    kind: 'npc',
    kindLabel: 'NPC',
    name: n.name,
    haystack: `${n.name} ${n.unlock} ${n.why}`.toLowerCase(),
    sprite: 'npc',
    tint: n.tint,
    href: `#/npcs?npc=${n.id}`,
    meta: 'Town NPC',
  })),
  ...ORE_TIERS.map((o) => ({
    id: o.id,
    kind: 'resource',
    kindLabel: 'Resource',
    name: o.names,
    haystack: `${o.names} ${o.where} ${o.crafts.join(' ')}`.toLowerCase(),
    sprite: 'ore',
    tint: o.tint,
    href: `#/resources?ore=${o.id}`,
    meta: `Tier ${o.tier}`,
  })),
];

const GROUP_ORDER = ['boss', 'item', 'potion', 'npc', 'resource'];
const GROUP_LABELS = {
  boss: 'Bosses & Events',
  item: 'Items',
  potion: 'Potions',
  npc: 'NPCs',
  resource: 'Resources',
};

export function searchAll(query, limit = 24) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored = [];
  for (const entry of INDEX) {
    const name = entry.name.toLowerCase();
    let score = 0;
    if (name === q) score = 1000;
    else if (name.startsWith(q)) score = 500 - name.length;
    else if (name.includes(q)) score = 300 - name.indexOf(q);
    else if (entry.haystack.includes(q)) score = 100;
    if (score > 0) scored.push({ ...entry, score });
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.slice(0, limit);
}

/** Search results bucketed by kind, ready to render. */
export function searchGrouped(query, limit = 24) {
  const results = searchAll(query, limit);
  const groups = new Map();
  for (const r of results) {
    if (!groups.has(r.kind)) groups.set(r.kind, []);
    groups.get(r.kind).push(r);
  }
  return GROUP_ORDER.filter((k) => groups.has(k)).map((kind) => ({
    kind,
    label: GROUP_LABELS[kind],
    results: groups.get(kind),
  }));
}

export const searchIndexSize = INDEX.length;
