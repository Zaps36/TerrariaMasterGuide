/**
 * Beginner guide (spec §26).
 */

import { h, glyph } from '../core/dom.js';
import { getState } from '../core/store.js';
import { COMMON_MISTAKES, FIRST_STEPS } from '../data/beginner.js';
import { badge, btn, checklist, pageHead, panel, panelHead, sectionTitle } from '../components/ui.js';
import { itemCard } from '../components/item-card.js';
import { resolveItems } from '../data/items.js';

const STARTER_KIT = ['hermes_boots', 'cloud_in_a_bottle', 'magic_mirror', 'life_crystal', 'ironskin_potion', 'healing_potion'];

export function beginnerPage() {
  const state = getState();
  const doneCount = FIRST_STEPS.filter((s) => state.checks[`beginner:${s.id}`]).length;

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Guide',
        title: 'New to Terraria?',
        lede: 'Ten steps, in order, in plain language. Nothing here assumes you know any Terraria jargon.',
      },
      badge(`${doneCount}/${FIRST_STEPS.length} steps done`, { variant: doneCount === FIRST_STEPS.length ? 'success' : 'gold' }),
      btn('Start setup', { variant: 'primary', href: '#/setup', icon: '🧭' })
    ),

    panel(
      { variant: 'stone' },
      panelHead('Your first ten steps'),
      h(
        'div.steplist',
        FIRST_STEPS.map((step, index) =>
          h(
            'div.stepitem',
            h('span.stepitem__num', `${index + 1}`),
            h(
              'div.grow',
              h('h4.stepitem__title', step.title),
              h('p.small.muted', { style: { margin: '0 0 6px' } }, step.body),
              h('p.tiny.gold', { style: { margin: 0 } }, glyph('💡'), ` ${step.tip}`)
            )
          )
        )
      ),
      h(
        'div',
        { style: { marginTop: '16px' } },
        h('h4', 'Tick them off as you go'),
        checklist(
          FIRST_STEPS.map((s) => ({ key: `beginner:${s.id}`, label: s.title })),
          { metaSuffix: 'STEPS DONE' }
        )
      )
    ),

    sectionTitle('The starter kit'),
    h(
      'p.small.muted',
      { style: { marginTop: '-8px', marginBottom: '14px' } },
      'If you have these six things, you are ready for your first boss.'
    ),
    h('div.grid.grid--3', resolveItems(STARTER_KIT).map((item) => itemCard(item, { showStage: true }))),

    sectionTitle('Common beginner mistakes'),
    h(
      'div.grid.grid--2',
      COMMON_MISTAKES.map((m) =>
        h(
          'div.callout.callout--danger',
          h('div.callout__icon', glyph('⚠️')),
          h(
            'div.grow',
            h('p.callout__title', m.title),
            h('p.small.muted', { style: { margin: 0 } }, m.body)
          )
        )
      )
    ),

    h(
      'div',
      { style: { marginTop: '20px' } },
      panel(
        { variant: 'gold' },
        panelHead('Vocabulary cheat sheet'),
        h(
          'dl.kv',
          h('dt', 'Pre-Hardmode'),
          h('dd', 'Everything before you beat the Wall of Flesh.'),
          h('dt', 'Hardmode'),
          h('dd', 'The second half of the game. Starts permanently after the Wall of Flesh.'),
          h('dt', 'Evil biome'),
          h('dd', 'Your world has either Corruption (purple) or Crimson (red).'),
          h('dt', 'Mechs'),
          h('dd', 'The three mechanical bosses: The Destroyer, The Twins, Skeletron Prime.'),
          h('dt', 'Arena'),
          h('dd', 'A flat, lit area with platform layers built specifically for a boss fight.'),
          h('dt', 'Reforge'),
          h('dd', 'Paying the Goblin Tinkerer to reroll an item modifier for better stats.'),
          h('dt', 'Buff'),
          h('dd', 'A temporary bonus from a potion or a placed object like a Campfire.')
        )
      )
    ),

    h(
      'div',
      { style: { marginTop: '18px' } },
      panel(
        { variant: 'deep' },
        panelHead('Where to go next'),
        h(
          'div.row.row--wrap',
          btn('Set up my journey', { variant: 'primary', size: 'sm', href: '#/setup', icon: '🧭' }),
          btn('Progression map', { variant: 'ghost', size: 'sm', href: '#/progression', icon: '🗺️' }),
          btn('Class builds', { variant: 'ghost', size: 'sm', href: '#/class-builds', icon: '⚔️' }),
          btn('Potion guide', { variant: 'ghost', size: 'sm', href: '#/potions', icon: '🧪' })
        )
      )
    )
  );
}
