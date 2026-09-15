/**
 * Item cards and the item detail modal.
 */

import { h, glyph, stars } from '../core/dom.js';
import { spriteTile, sprite } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { getItem, craftedFrom } from '../data/items.js';
import { STAGE_MAP } from '../data/stages.js';
import { badge, rarityBadge, openModal, statGrid, bullets, panel } from './ui.js';
import { craftTree } from './chains.js';

const TAG_LABELS = {
  best: { label: 'Recommended', classes: ['itemcard__tag'] },
  alt: { label: 'Alternative', classes: ['itemcard__tag', 'itemcard__tag--alt'] },
  luxury: { label: 'Luxury', classes: ['itemcard__tag', 'itemcard__tag--luxury'] },
};

/**
 * The workhorse item card used by loadouts, the item database and search.
 * @param {object} item
 * @param {{tag?:'best'|'alt'|'luxury', showStage?:boolean}} options
 */
export function itemCard(item, { tag = null, showStage = false } = {}) {
  if (!item) return null;
  const tagInfo = tag ? TAG_LABELS[tag] : null;

  return h(
    'button.itemcard',
    {
      type: 'button',
      class: [
        tagInfo ? 'itemcard--tagged' : null,
        tag === 'best' ? 'itemcard--best' : null,
        tag === 'alt' ? 'itemcard--alt' : null,
      ].filter(Boolean),
      dataset: { focusKey: `item:${item.id}` },
      onclick: () => openItemModal(item.id),
      'aria-label': `${item.name} — open details`,
    },
    spriteTile(item.sprite, { size: 34, palette: tint(item.tint), alt: '', variant: tag === 'best' ? 'gold' : '' }),
    h(
      'span.itemcard__info',
      h('span.itemcard__name', item.name),
      h(
        'span.itemcard__sub',
        tagInfo ? h('span', { class: tagInfo.classes }, tagInfo.label) : null,
        rarityBadge(item.rarity),
        item.cls !== 'universal' ? badge(item.cls, { cls: item.cls }) : null,
        showStage ? h('span.tiny.dim', STAGE_MAP[item.stage]?.label || item.stage) : null
      )
    )
  );
}

/** Larger card for the item database grid. */
export function itemGridCard(item) {
  return h(
    'button.card',
    {
      type: 'button',
      dataset: { focusKey: `itemgrid:${item.id}` },
      onclick: () => openItemModal(item.id),
    },
    h(
      'div.row',
      spriteTile(item.sprite, { size: 44, palette: tint(item.tint), alt: '', variant: item.rating >= 5 ? 'gold' : '' }),
      h(
        'div.grow',
        h('h4.card__title', { style: { margin: 0 } }, item.name),
        h('div', { style: { marginTop: '4px' } }, rarityBadge(item.rarity))
      )
    ),
    h(
      'div.card__meta',
      badge(item.type, {}),
      item.cls !== 'universal' ? badge(item.cls, { cls: item.cls }) : null,
      badge(STAGE_MAP[item.stage]?.label || item.stage, { variant: 'gold' })
    ),
    h('p.small.muted', { style: { margin: 0 } }, item.desc)
  );
}

/** Opens the item detail modal (spec §19). */
export function openItemModal(itemId) {
  const item = typeof itemId === 'string' ? getItem(itemId) : itemId;
  if (!item) return;

  const usedForCrafts = craftedFrom(item.id).map((i) => i.name);
  const usedFor = [...new Set([...(item.usedFor || []), ...usedForCrafts])];

  const body = h(
    'div',
    { class: 'stack' },

    h(
      'div.row.row--wrap',
      rarityBadge(item.rarity),
      badge(item.type, {}),
      item.cls !== 'universal' ? badge(item.cls, { cls: item.cls }) : null,
      badge(STAGE_MAP[item.stage]?.label || item.stage, { variant: 'gold' }),
      item.evil ? badge(item.evil, { variant: 'optional' }) : null,
      h('span.row', h('span.tiny.dim', 'PICK'), stars(item.rating))
    ),

    item.desc ? h('p.lede', { style: { fontSize: '0.95rem' } }, item.desc) : null,

    statGrid(Object.entries(item.stats)),

    panel(
      { variant: 'deep' },
      h('h4', { style: { margin: '0 0 8px' } }, 'How to get it'),
      h('p.small.muted', { style: { margin: 0 } }, item.source || 'Found through normal progression.')
    ),

    item.craft
      ? panel(
          { variant: 'deep' },
          h('h4', { style: { margin: '0 0 8px' } }, 'Crafting tree'),
          craftTree(item, { onSelect: (next) => openItemModal(next.id) })
        )
      : null,

    usedFor.length
      ? panel(
          { variant: 'deep' },
          h('h4', { style: { margin: '0 0 8px' } }, 'Used for'),
          bullets(usedFor)
        )
      : null,

    item.tags?.length
      ? h('div.row.row--wrap', item.tags.map((t) => badge(t, { variant: 'optional' })))
      : null
  );

  openModal({
    title: item.name,
    subtitle: `${item.cls === 'universal' ? '' : `${item.cls} · `}${item.type}`.toUpperCase(),
    sprite: spriteTile(item.sprite, { size: 44, palette: tint(item.tint), variant: 'gold' }),
    body,
  });
}

/** Tiny inline reference used in prose. */
export function itemPill(id) {
  const item = getItem(id);
  if (!item) return null;
  return h(
    'button.preppill',
    { type: 'button', onclick: () => openItemModal(item.id), title: item.name },
    sprite(item.sprite, { size: 16, palette: tint(item.tint) }),
    item.name
  );
}

export function itemSpriteOnly(id, size = 24) {
  const item = getItem(id);
  if (!item) return glyph('❔');
  return sprite(item.sprite, { size, palette: tint(item.tint), alt: item.name });
}
