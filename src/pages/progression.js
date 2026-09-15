/**
 * Progression page — the visual boss tree (spec §12, §13).
 */

import { h } from '../core/dom.js';
import { getState, toggleDefeated } from '../core/store.js';
import { STAGE_MAP } from '../data/stages.js';
import { BOSS_MAP } from '../data/bosses.js';
import {
  bossProgress,
  currentStageId,
  mainChainNodes,
  mainProgress,
  nextMainObjective,
} from '../logic/progression.js';
import { badge, btn, pageHead, panel, panelHead, progressBar, sectionTitle, toast } from '../components/ui.js';
import { optionalBossGrid, progressionTree, treeLegend } from '../components/progression-tree.js';
import { sprite } from '../core/sprites.js';

export function progressionPage() {
  const state = getState();
  const world = state.world;
  const main = mainProgress(state, world.evil);
  const bosses = bossProgress(state, world.evil);
  const next = nextMainObjective(state, world.evil);
  const stage = STAGE_MAP[currentStageId(state)];

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Progression',
        title: 'The path to Moon Lord',
        lede: 'Main progression on the left rail, optional content separated below. Nothing in the optional section is required to finish the game.',
      },
      btn('Dashboard', { variant: 'ghost', href: '#/dashboard', icon: '🏠' })
    ),

    h(
      'div.grid',
      { style: { gridTemplateColumns: 'minmax(0,1fr)', gap: '18px' } },

      panel(
        { variant: 'stone' },
        h(
          'div.row.row--wrap',
          h(
            'div.grow',
            h('p.eyebrow', { style: { margin: 0 } }, 'Current stage'),
            h('h2', { style: { margin: 0 } }, stage.label)
          ),
          badge(`${bosses.done} / ${bosses.total} bosses & events`, {}),
          badge(`${main.done} / ${main.total} main objectives`, { variant: 'gold' })
        ),
        h('div', { style: { marginTop: '12px' } }, progressBar(main.percent, { size: 'lg' })),
        next?.boss
          ? h(
              'div.row.row--wrap',
              { style: { marginTop: '12px' } },
              sprite(next.boss.sprite, { size: 32, alt: '' }),
              h('span.small.muted', next.reason),
              h('span.grow'),
              btn(`Open ${next.boss.name}`, { variant: 'primary', size: 'sm', href: `#/bosses/${next.boss.id}` })
            )
          : null
      )
    ),

    sectionTitle('Main progression'),
    progressionTree(state, world),

    sectionTitle('Optional / side bosses'),
    h(
      'p.small.muted',
      { style: { marginTop: '-8px', marginBottom: '14px', maxWidth: '70ch' } },
      'These are never required. Several of them (Queen Bee, Duke Fishron, Empress of Light) have some of the best loot in the game, so they are worth doing when you feel ready.'
    ),
    optionalBossGrid(state, world),

    sectionTitle('Quick log'),
    panel(
      { variant: 'deep' },
      panelHead('Tick off what you have already beaten'),
      h(
        'div.grid.grid--3',
        mainChainNodes(world.evil)
          .filter((n) => n.kind === 'boss')
          .map((node) => {
            const boss = node.boss;
            const done = Boolean(state.defeated[boss.id]);
            return h(
              'button.itemcard',
              {
                type: 'button',
                class: done ? 'itemcard--best' : null,
                dataset: { focusKey: `quicklog:${boss.id}` },
                onclick: () => {
                  const now = toggleDefeated(boss.id);
                  toast(now ? `${boss.name} defeated!` : `${boss.name} un-marked`, {
                    tone: now ? 'success' : '',
                    icon: now ? '👑' : '↩',
                  });
                },
              },
              sprite(boss.sprite, { size: 30, alt: '' }),
              h(
                'span.itemcard__info',
                h('span.itemcard__name', boss.name),
                h('span.itemcard__sub', badge(done ? 'Defeated' : 'Not yet', { variant: done ? 'success' : '' }))
              ),
              h('span.node__status', done ? '✓' : '○')
            );
          })
      )
    ),

    h('div', { style: { marginTop: '18px' } }, treeLegend()),

    h(
      'p.tiny.dim',
      { style: { marginTop: '18px' } },
      `World evil: ${world.evil === 'crimson' ? 'Crimson (Brain of Cthulhu)' : 'Corruption (Eater of Worlds)'} — the other evil's boss is hidden because it cannot spawn in your world.`
    ),
    BOSS_MAP.moon_lord && state.defeated.moon_lord
      ? panel(
          { variant: 'gold' },
          panelHead('🏆 Main progression complete'),
          h('p.small.muted', { style: { margin: 0 } }, 'Luminite, Zenith, the moon events and building are all that is left. Congratulations.')
        )
      : null
  );
}
