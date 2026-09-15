/**
 * Boss cards, progression nodes and the defeat toggle.
 */

import { h, stars, glyph } from '../core/dom.js';
import { spriteTile } from '../core/sprites.js';
import { STAGE_MAP } from '../data/stages.js';
import { isDefeated, toggleDefeated } from '../core/store.js';
import { badge, btn, toast, sparkleBurst } from './ui.js';

const STATUS_LABEL = {
  done: 'Completed',
  available: 'Available',
  locked: 'Locked',
  next: 'Recommended next',
};

export function bossSpriteTile(boss, size = 44, variant = '') {
  return spriteTile(boss.sprite, { size, alt: boss.name, variant });
}

/** Card used on the Bosses database page. */
export function bossCard(boss, status) {
  const done = status === 'done';
  return h(
    'a.card',
    {
      href: `#/bosses/${boss.id}`,
      class: [done ? 'card--done' : null, status === 'locked' ? 'card--locked' : null].filter(Boolean),
      dataset: { focusKey: `bosscard:${boss.id}` },
    },
    done ? h('span.card__tick', { 'aria-label': 'Defeated' }, '✓') : null,
    h(
      'div.row',
      bossSpriteTile(boss, 48, status === 'next' ? 'gold' : ''),
      h(
        'div.grow',
        h('h4.card__title', { style: { margin: 0 } }, boss.name),
        h('p.tiny.dim', { style: { margin: '3px 0 0' } }, boss.title)
      )
    ),
    h(
      'div.card__meta',
      badge(boss.tier === 'hardmode' ? 'Hardmode' : 'Pre-Hardmode', { variant: boss.tier === 'hardmode' ? 'danger' : '' }),
      boss.optional ? badge('Optional', { variant: 'optional' }) : badge('Main', { variant: 'gold' }),
      boss.kind === 'event' ? badge('Event', {}) : null
    ),
    h(
      'div.row.row--between',
      h('span.row', h('span.tiny.dim', 'DIFFICULTY'), stars(boss.difficulty)),
      h('span.tiny.dim', `${boss.hp} HP`)
    ),
    h('p.small.muted', { style: { margin: 0 } }, `Gear tier: ${STAGE_MAP[boss.stage]?.label || boss.stage}`)
  );
}

/** Node used inside the progression tree. */
export function bossNode(boss, status, { compact = false } = {}) {
  const classes = ['node'];
  if (status === 'done') classes.push('is-done');
  if (status === 'available') classes.push('is-available');
  if (status === 'locked') classes.push('is-locked');
  if (status === 'next') classes.push('is-next');

  return h(
    'a',
    {
      href: `#/bosses/${boss.id}`,
      class: classes,
      dataset: { focusKey: `node:${boss.id}` },
      'aria-label': `${boss.name} — ${STATUS_LABEL[status]}`,
    },
    status === 'next' ? h('span.node__flag', 'Do this next') : null,
    bossSpriteTile(boss, compact ? 34 : 42, status === 'next' ? 'gold' : ''),
    h(
      'span.node__info',
      h('span.node__name', boss.name),
      h(
        'span.node__meta',
        badge(STAGE_MAP[boss.stage]?.label || boss.stage, { variant: boss.tier === 'hardmode' ? 'danger' : '' }),
        boss.optional ? badge('Optional', { variant: 'optional' }) : null,
        h('span.row', stars(boss.difficulty))
      ),
      !compact && boss.unlocks?.length
        ? h('span.tiny.dim', { style: { display: 'block', marginTop: '4px' } }, `Unlocks: ${boss.unlocks[0]}`)
        : null
    ),
    h('span.node__status', { 'aria-hidden': 'true' }, status === 'done' ? '✓' : status === 'locked' ? '🔒' : '›')
  );
}

export function treeLink(done = false) {
  return h('span.tree__link', { class: done ? 'tree__link--done' : null, 'aria-hidden': 'true' });
}

export function hardmodeBand(label = 'HARDMODE BEGINS', icon = '🔥') {
  return h('div.tree__band', glyph(icon), label, glyph(icon));
}

/**
 * The "mark as defeated" control. Used on boss detail pages and cards.
 */
export function defeatToggle(boss, { onChange = null, block = false, variant = 'primary' } = {}) {
  const done = isDefeated(boss.id);
  return btn(done ? 'Defeated ✓' : `Mark ${boss.name} defeated`, {
    variant: done ? 'success' : variant,
    block,
    focusKey: `defeat:${boss.id}`,
    onClick: (event) => {
      const now = toggleDefeated(boss.id);
      if (now) {
        sparkleBurst(event.currentTarget);
        toast(`${boss.name} defeated!`, { tone: 'success', icon: '👑' });
      } else {
        toast(`${boss.name} un-marked`, { icon: '↩' });
      }
      if (onChange) onChange(now);
    },
  });
}
