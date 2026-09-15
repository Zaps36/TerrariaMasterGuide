/**
 * Upgrade chains and crafting trees rendered as visual pixel nodes.
 */

import { h } from '../core/dom.js';
import { spriteTile } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { getItem } from '../data/items.js';
import { rarityBadge } from './ui.js';

/** A compact node used inside chains and craft trees. */
export function chainNode(item, { onClick = null, tag = null } = {}) {
  if (!item) return null;
  const inner = [
    spriteTile(item.sprite, { size: 32, palette: tint(item.tint), alt: item.name }),
    h(
      'span.itemcard__info',
      h('span.itemcard__name', item.name),
      h(
        'span.itemcard__sub',
        tag ? h('span.itemcard__tag', tag) : null,
        rarityBadge(item.rarity)
      )
    ),
  ];
  const tagged = tag ? 'itemcard--tagged' : null;
  if (onClick) {
    return h('button.itemcard', { class: tagged, type: 'button', onclick: () => onClick(item) }, ...inner);
  }
  return h('div.itemcard', { class: tagged }, ...inner);
}

/** Plain text node for ingredients that are not in the item database. */
export function textNode(label, { qty = null, tag = null } = {}) {
  return h(
    'div.itemcard',
    { class: tag ? 'itemcard--tagged' : null },
    spriteTile('unknown', { size: 32, palette: tint('iron') }),
    h(
      'span.itemcard__info',
      h('span.itemcard__name', label),
      tag || qty
        ? h(
            'span.itemcard__sub',
            tag ? h('span.itemcard__tag', tag) : null,
            qty ? h('span.tiny.muted', `×${qty}`) : null
          )
        : null
    )
  );
}

/**
 * Horizontal upgrade chain: A → B → C
 * @param {string[]} ids
 */
export function chainRow(ids, { onSelect = null, highlightLast = true } = {}) {
  const items = ids.map((id) => getItem(id)).filter(Boolean);
  const nodes = [];
  items.forEach((item, index) => {
    if (index > 0) nodes.push(h('span.chain__arrow', '▶'));
    nodes.push(
      h(
        'div.chain__step',
        chainNode(item, {
          onClick: onSelect,
          tag: highlightLast && index === items.length - 1 ? 'Final' : null,
        })
      )
    );
  });
  return h('div.scroll-x', h('div.chain', ...nodes));
}

/**
 * Crafting tree: several inputs joined by a bracket into one output.
 */
export function craftTree(item, { onSelect = null } = {}) {
  if (!item?.craft) return null;
  const inputs = item.craft.inputs.map((input) => {
    const resolved = input.id ? getItem(input.id) : null;
    return resolved
      ? chainNode(resolved, { onClick: onSelect })
      : textNode(input.name || 'Unknown', { qty: input.qty > 1 ? input.qty : null });
  });

  return h(
    'div',
    h('p.tiny.muted', { style: { margin: '0 0 8px' } }, `Crafted at: ${item.craft.station}`),
    h(
      'div.scroll-x',
      h(
        'div.craft',
        h('div.craft__inputs', ...inputs),
        h('div.craft__brace'),
        h('div', chainNode(item, { tag: 'Result' }))
      )
    )
  );
}
