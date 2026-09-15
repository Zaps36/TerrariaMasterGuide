/**
 * Arena diagram + guidance.
 */

import { h } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { BUFF_STATIONS } from '../data/potions.js';
import { bullets, panel, badge } from './ui.js';

const STATION_MAP = Object.fromEntries(BUFF_STATIONS.map((s) => [s.id, s]));

function propRow(propIds) {
  return h(
    'div.arena__props',
    propIds.map((id) => {
      const station = STATION_MAP[id];
      if (!station) return null;
      return h(
        'span',
        { title: `${station.name} — ${station.effect}`, style: { textAlign: 'center' } },
        sprite(station.sprite, { size: 26, palette: tint(station.tint), alt: station.name })
      );
    })
  );
}

/** The pixel arena diagram. */
export function arenaDiagram(arena) {
  return h(
    'div.arena',
    { role: 'img', 'aria-label': `${arena.name} layout diagram` },
    arena.rows.map((row) => {
      if (row.type === 'gap') return h('div.arena__gap');
      if (row.type === 'player') {
        return h(
          'div.arena__row',
          h('span.arena__tag', ''),
          h('div.arena__player', row.label || 'YOU')
        );
      }
      if (row.type === 'props') {
        return h('div.arena__row', h('span.arena__tag', row.label || 'BUFFS'), propRow(arena.props || []));
      }
      if (row.type === 'ground') {
        return h('div.arena__row', h('span.arena__tag', row.label || 'GROUND'), h('div.arena__ground'));
      }
      return h(
        'div.arena__row',
        h('span.arena__tag', row.label || 'PLATFORM'),
        h('div.arena__platform', { class: row.long ? 'arena__platform--long' : null })
      );
    })
  );
}

/** Full arena block: diagram + size + guidelines + buff stations. */
export function arenaSection(arena) {
  return h(
    'div.stack',
    h(
      'div.row.row--wrap',
      badge(arena.name, { variant: 'gold' }),
      h('span.small.muted', arena.size)
    ),
    h('p.small.muted', { style: { margin: 0 } }, arena.summary),
    arenaDiagram(arena),
    panel({ variant: 'deep' }, bullets(arena.guidelines)),
    h(
      'div.grid.grid--3',
      (arena.props || []).map((id) => {
        const station = STATION_MAP[id];
        if (!station) return null;
        return h(
          'div.itemcard',
          sprite(station.sprite, { size: 30, palette: tint(station.tint), alt: '' }),
          h(
            'span.itemcard__info',
            h('span.itemcard__name', station.name),
            h('span.tiny.success', { style: { display: 'block' } }, station.effect),
            h('span.tiny.dim', { style: { display: 'block', marginTop: '2px' } }, station.note)
          )
        );
      })
    )
  );
}
