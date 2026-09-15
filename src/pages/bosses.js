/**
 * Boss database (spec §14) — search + filters + card grid.
 */

import { h, mount } from '../core/dom.js';
import { getState } from '../core/store.js';
import { BOSSES } from '../data/bosses.js';
import { bossStatus, nextMainObjective } from '../logic/progression.js';
import { bossCard } from '../components/boss-card.js';
import { badge, btn, chipGroup, emptyState, pageHead, panel, searchInput } from '../components/ui.js';
import { sprite } from '../core/sprites.js';

const FILTERS = [
  { id: 'pre-hardmode', label: 'Pre-Hardmode', test: (b) => b.tier === 'pre-hardmode' },
  { id: 'hardmode', label: 'Hardmode', test: (b) => b.tier === 'hardmode' },
  { id: 'main', label: 'Main progression', test: (b) => !b.optional },
  { id: 'optional', label: 'Optional', test: (b) => b.optional },
  { id: 'event', label: 'Event', test: (b) => b.kind === 'event' },
  { id: 'todo', label: 'Not defeated', test: (b, state) => !state.defeated[b.id] },
];

export function bossesPage({ query } = {}) {
  const state = getState();
  const world = state.world;
  const hidden = world.evil === 'crimson' ? 'eater_of_worlds' : 'brain_of_cthulhu';
  const next = nextMainObjective(state, world.evil);

  let search = query?.get('q') || '';
  let active = [];

  const results = h('div');

  function paint() {
    const q = search.trim().toLowerCase();
    const list = BOSSES.filter((boss) => {
      if (boss.id === hidden) return false;
      if (q && !`${boss.name} ${boss.title} ${boss.blurb}`.toLowerCase().includes(q)) return false;
      if (active.length && !active.every((id) => FILTERS.find((f) => f.id === id).test(boss, state))) return false;
      return true;
    }).sort((a, b) => a.order - b.order);

    if (!list.length) {
      mount(
        results,
        panel(
          {},
          emptyState({
            title: 'No bosses found',
            body: 'No adventurer has discovered anything matching that search. Try clearing a filter.',
            art: sprite('unknown', { size: 56 }),
            action: btn('Clear filters', {
              variant: 'ghost',
              onClick: () => {
                active = [];
                search = '';
                paint();
              },
            }),
          })
        )
      );
      return;
    }

    mount(
      results,
      h('p.tiny.dim', { style: { margin: '0 0 12px' } }, `${list.length} result${list.length === 1 ? '' : 's'}`),
      h(
        'div.grid.grid--3',
        list.map((boss) => {
          const status = state.defeated[boss.id]
            ? 'done'
            : boss.id === next?.boss?.id
              ? 'next'
              : bossStatus(boss, state);
          return bossCard(boss, status);
        })
      )
    );
  }

  const controls = h('div');

  function paintControls() {
    mount(
      controls,
      h(
        'div.filterbar',
        searchInput({
          placeholder: 'Search boss…',
          value: search,
          focusKey: 'boss-search',
          onInput: (value) => {
            search = value;
            paint();
          },
        }),
        chipGroup({
          label: 'Filter',
          options: FILTERS,
          selected: active,
          onToggle: (id) => {
            active = active.includes(id) ? active.filter((x) => x !== id) : [...active, id];
            paintControls();
            paint();
          },
        }),
        active.length || search
          ? btn('Reset', {
              variant: 'ghost',
              size: 'sm',
              onClick: () => {
                active = [];
                search = '';
                paintControls();
                paint();
              },
            })
          : null
      )
    );
  }

  paintControls();
  paint();

  return h(
    'div.page',
    pageHead(
      {
        eyebrow: 'Database',
        title: 'Bosses & events',
        lede: 'Every boss and major event, with the gear tier you should be at when you fight it.',
      },
      next?.boss ? badge(`Next: ${next.boss.name}`, { variant: 'gold' }) : null,
      btn('Progression map', { variant: 'ghost', href: '#/progression', icon: '🗺️' })
    ),
    controls,
    results
  );
}
