/**
 * Boss detail page (spec §15, §16, §22).
 */

import { h, stars, glyph } from '../core/dom.js';
import { sprite, spriteTile } from '../core/sprites.js';
import { getState } from '../core/store.js';
import { BOSS_MAP, prepKey } from '../data/bosses.js';
import { arenaFor } from '../data/arenas.js';
import { getBuild } from '../data/class-builds.js';
import { CLASS_MAP, PRIMARY_CLASS_IDS, STAGE_MAP } from '../data/stages.js';
import { getItem } from '../data/items.js';
import { bossStatus, prerequisitesMet } from '../logic/progression.js';
import {
  badge,
  bullets,
  btn,
  checklist,
  emptyState,
  panel,
  panelHead,
  sectionTitle,
  statGrid,
  tabs,
} from '../components/ui.js';
import { defeatToggle } from '../components/boss-card.js';
import { loadoutView } from '../components/loadout.js';
import { arenaSection } from '../components/arena.js';
import { itemCard } from '../components/item-card.js';

export function bossDetailPage({ params }) {
  const boss = BOSS_MAP[params.id];
  if (!boss) {
    return h(
      'div.page',
      panel(
        {},
        emptyState({
          title: 'Boss not found',
          body: 'Select a boss from the progression map.',
          art: sprite('unknown', { size: 60 }),
          action: btn('Open progression', { variant: 'primary', href: '#/progression' }),
        })
      )
    );
  }

  const state = getState();
  const status = bossStatus(boss, state);
  const stage = STAGE_MAP[boss.stage];
  const playerClass = state.player.class === 'unsure' ? 'ranger' : state.player.class;
  const arena = arenaFor(boss);
  const summonItem = boss.summon ? getItem(boss.summon) : null;
  const prepEntries = (boss.preparation || []).map((entry) => ({
    key: prepKey(boss.id, entry),
    label: entry.label,
    note: entry.note,
  }));

  const locked = !prerequisitesMet(boss, state);

  return h(
    'div.page',

    h(
      'div.row.row--wrap',
      { style: { marginBottom: '14px' } },
      btn('All bosses', { variant: 'ghost', size: 'sm', href: '#/bosses', icon: '←' }),
      btn('Progression', { variant: 'ghost', size: 'sm', href: '#/progression', icon: '🗺️' })
    ),

    /* ------------------------------------------------------------- hero --- */
    h(
      'section.bossdetail__hero',
      h('div.bossdetail__art', sprite(boss.sprite, { size: 128, alt: boss.name })),
      h(
        'div.grow',
        h(
          'p.eyebrow',
          { style: { margin: 0 } },
          `${boss.tier === 'hardmode' ? 'HARDMODE' : 'PRE-HARDMODE'} • ${boss.title.toUpperCase()}`
        ),
        h('h1.bossdetail__title', boss.name),
        h('p.lede', { style: { marginBottom: '12px' } }, boss.blurb),
        h(
          'div.row.row--wrap',
          status === 'done' ? badge('Defeated', { variant: 'success' }) : null,
          locked ? badge('Locked', { variant: 'danger' }) : null,
          boss.optional ? badge('Optional', { variant: 'optional' }) : badge('Main progression', { variant: 'gold' }),
          boss.kind === 'event' ? badge('Event', {}) : null,
          badge(stage?.label || boss.stage, {})
        ),
        h(
          'div.row.row--wrap',
          { style: { marginTop: '14px' } },
          defeatToggle(boss),
          summonItem
            ? btn(`Summon: ${summonItem.name}`, { variant: 'ghost', href: `#/items?item=${summonItem.id}`, icon: '🔮' })
            : null
        )
      )
    ),

    locked
      ? h(
          'div',
          { style: { marginTop: '16px' } },
          panel(
            { variant: 'deep' },
            panelHead('🔒 Not available yet'),
            h(
              'p.small.muted',
              { style: { margin: 0 } },
              `You need to defeat ${boss.prerequisites
                .map((id) => BOSS_MAP[id]?.name || id)
                .join(', ')} first.`
            )
          )
        )
      : null,

    /* ------------------------------------------------------------ stats --- */
    h(
      'div',
      { style: { marginTop: '18px' } },
      statGrid([
        ['Difficulty', stars(boss.difficulty)],
        ['Stage', stage?.label || boss.stage],
        ['Recommended HP', boss.hp],
        ['Where', boss.where],
        ['When', boss.when],
      ])
    ),

    /* ------------------------------------------------ before the fight --- */
    sectionTitle('Before the fight'),
    panel(
      { variant: 'stone' },
      panelHead(
        'Preparation checklist',
        h('span.row', h('span.tiny.dim', 'DIFFICULTY'), stars(boss.difficulty))
      ),
      prepEntries.length
        ? checklist(prepEntries)
        : h('p.small.muted', 'No special preparation needed.')
    ),

    /* -------------------------------------------- recommended loadout --- */
    sectionTitle('Recommended loadout'),
    panel(
      { variant: 'stone', className: 'panel--flush' },
      h(
        'div',
        { style: { padding: '16px' } },
        h(
          'p.small.muted',
          { style: { marginTop: 0 } },
          `These recommendations are for the ${stage?.label || boss.stage} gear tier. Switch class tabs to compare.`
        ),
        tabs(
          PRIMARY_CLASS_IDS.map((id) => ({
            id,
            label: CLASS_MAP[id].name,
            icon: CLASS_MAP[id].icon,
            cls: id,
          })),
          (cls) => loadoutView(getBuild(cls, boss.stage), { cls, highlight: boss.highlight?.[cls] || [] }),
          { initial: playerClass, ariaLabel: 'Class loadout' }
        )
      )
    ),

    /* ------------------------------------------------------------ arena --- */
    sectionTitle('Arena'),
    panel({ variant: 'stone' }, arenaSection(arena)),

    /* ------------------------------------------------- tips and rewards --- */
    sectionTitle('Strategy & rewards'),
    h(
      'div.grid.grid--2',
      panel(
        { variant: 'stone' },
        panelHead('How to fight it'),
        bullets(boss.tips || [])
      ),
      h(
        'div.stack',
        panel(
          { variant: 'stone' },
          panelHead('Rewards'),
          bullets(boss.rewards || [], { variant: 'check' })
        ),
        panel(
          { variant: 'gold' },
          panelHead('What this unlocks'),
          bullets(boss.unlocks || [])
        )
      )
    ),

    /* ------------------------------------------------- summon reference --- */
    summonItem
      ? h(
          'div',
          { style: { marginTop: '18px' } },
          panel(
            { variant: 'deep' },
            panelHead('Summoning item'),
            h('div.slot__items', itemCard(summonItem, { tag: 'best' }))
          )
        )
      : null,

    /* --------------------------------------------------------- footnote --- */
    h(
      'p.tiny.dim',
      { style: { marginTop: '20px' } },
      glyph('ℹ️'),
      ` Difficulty ratings assume ${state.world.difficulty === 'master' ? 'Master' : state.world.difficulty === 'expert' ? 'Expert' : 'Classic'} mode. `,
      state.world.difficulty === 'master'
        ? 'Master mode roughly triples boss damage — treat every checklist item as mandatory.'
        : state.world.difficulty === 'expert'
          ? 'Expert bosses gain extra attacks and about double damage.'
          : 'Classic mode is the most forgiving balance.'
    )
  );
}
