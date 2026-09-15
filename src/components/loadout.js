/**
 * Class loadout renderer.
 * Consumes a class build (data/class-builds.js) and paints the slot layout.
 */

import { h } from '../core/dom.js';
import { resolveItems, getItem } from '../data/items.js';
import { CLASS_MAP } from '../data/stages.js';
import { itemCard } from './item-card.js';
import { bullets, callout, emptyState, panel } from './ui.js';

function slot(label, nodes, { hint = null } = {}) {
  if (!nodes || !nodes.length) return null;
  return h(
    'div.slot',
    h('span.slot__label', label),
    hint ? h('p.tiny.dim', { style: { margin: '-2px 0 2px' } }, hint) : null,
    h('div.slot__items', ...nodes)
  );
}

/**
 * @param {object} build   class build entry
 * @param {object} options { cls, highlight: string[] }
 */
export function loadoutView(build, { cls = 'ranger', highlight = [] } = {}) {
  if (!build) {
    return emptyState({
      title: 'No loadout for this stage yet',
      body: 'Pick a class in World Settings to see specific recommendations.',
    });
  }

  const classInfo = CLASS_MAP[cls] || CLASS_MAP.ranger;
  const highlightItems = resolveItems(highlight).filter(
    (item) => item.cls === cls || item.cls === 'universal'
  );

  const best = resolveItems(build.weapon);
  const alts = resolveItems(build.alt || []);
  const armor = resolveItems(build.armor || []);
  const accessories = resolveItems(build.accessories || []);
  const ammo = resolveItems(build.ammo || []);
  const potions = resolveItems(build.potions || []);

  return h(
    'div.loadout',
    { style: { '--accent': classInfo.accent } },

    build.note
      ? callout({ icon: classInfo.icon, title: `${classInfo.name} tip`, body: build.note, tone: 'info' })
      : null,

    highlightItems.length
      ? slot(
          'Best for this fight',
          highlightItems.map((item) => itemCard(item, { tag: 'best' })),
          { hint: 'Specifically strong against this boss.' }
        )
      : null,

    slot('Weapon', best.map((item) => itemCard(item, { tag: 'best' }))),
    slot('Alternatives', alts.map((item) => itemCard(item, { tag: 'alt' }))),
    slot('Armor', armor.map((item, i) => itemCard(item, { tag: i === 0 ? 'best' : 'alt' }))),
    slot('Accessories', accessories.map((item) => itemCard(item)), {
      hint: 'In priority order. Reforge to Warding for survival or Menacing for damage.',
    }),
    slot('Ammunition', ammo.map((item, i) => itemCard(item, { tag: i === 0 ? 'best' : 'alt' }))),
    slot('Potions', potions.map((item) => itemCard(item))),

    build.upgrades?.length
      ? h(
          'div.slot',
          h('span.slot__label', 'Optional upgrades'),
          panel({ variant: 'deep' }, bullets(build.upgrades, { variant: 'check' }))
        )
      : null
  );
}

/** One-line summary of a build, used in the class timeline header. */
export function buildSummary(build) {
  const weapon = getItem(build?.weapon?.[0]);
  const armor = getItem(build?.armor?.[0]);
  if (!weapon && !armor) return null;
  return h(
    'p.small.muted',
    { style: { margin: 0 } },
    weapon ? h('b', weapon.name) : null,
    weapon && armor ? ' · ' : null,
    armor ? armor.name : null
  );
}
