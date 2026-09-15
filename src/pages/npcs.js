/**
 * NPC guide (spec §24) including "Who should I get next?".
 */

import { h, glyph } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { getState } from '../core/store.js';
import { NPCS, NPC_GROUPS } from '../data/npcs.js';
import { STAGE_MAP } from '../data/stages.js';
import { currentStageId, stageAtOrAfter } from '../logic/progression.js';
import { badge, btn, checklist, pageHead, panel, panelHead, sectionTitle } from '../components/ui.js';

export function npcsPage({ query } = {}) {
  const state = getState();
  const stageId = currentStageId(state);
  const focusNpc = query?.get('npc');

  // "Who should I get next?" — available at this stage, not yet ticked, by priority.
  const candidates = NPCS.filter(
    (npc) => stageAtOrAfter(stageId, npc.stage) && !state.checks[`npc:${npc.id}`]
  ).sort((a, b) => b.priority - a.priority);
  const nextUp = candidates.slice(0, 3);

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Town',
        title: 'NPCs',
        lede: 'Every NPC is a shop, and several of them are genuine progression unlocks. Tick them off as they move in.',
      },
      badge(STAGE_MAP[stageId].label, { variant: 'gold' })
    ),

    panel(
      { variant: 'gold' },
      panelHead('Who should I get next?'),
      nextUp.length
        ? h(
            'div.stack',
            nextUp.map((npc) =>
              h(
                'div.row.row--top',
                sprite('npc', { size: 34, palette: tint(npc.tint), alt: '' }),
                h(
                  'div.grow',
                  h('b.small', npc.name),
                  h('p.tiny.muted', { style: { margin: '2px 0 0' } }, npc.unlock),
                  h('p.tiny.gold', { style: { margin: '2px 0 0' } }, npc.why)
                ),
                badge(`Priority ${npc.priority}/5`, { variant: npc.priority >= 5 ? 'danger' : '' })
              )
            )
          )
        : h('p.small.muted', { style: { margin: 0 } }, 'You have every NPC available at this stage. Nicely done.'),
      h(
        'div',
        { style: { marginTop: '12px' } },
        h('p.tiny.dim', { style: { margin: '0 0 6px' } }, 'Tick off the ones already living in your world:'),
        checklist(
          NPCS.filter((npc) => stageAtOrAfter(stageId, npc.stage)).map((npc) => ({
            key: `npc:${npc.id}`,
            label: npc.name,
            note: npc.unlock,
          })),
          { metaSuffix: 'MOVED IN' }
        )
      )
    ),

    ...NPC_GROUPS.flatMap((group) => {
      const list = NPCS.filter((n) => n.group === group.id);
      if (!list.length) return [];
      return [
        sectionTitle(group.label),
        h('p.small.muted', { style: { marginTop: '-8px', marginBottom: '12px' } }, group.desc),
        h(
          'div.grid.grid--2',
          list.map((npc) =>
            panel(
              { variant: npc.id === focusNpc ? 'gold' : 'stone' },
              h(
                'div.npcrow',
                { style: { background: 'none', boxShadow: 'none', padding: 0 } },
                sprite('npc', { size: 42, palette: tint(npc.tint), alt: npc.name }),
                h(
                  'div.npcrow__info',
                  h('h4.npcrow__name', npc.name),
                  h(
                    'div.row.row--wrap',
                    { style: { marginBottom: '8px' } },
                    badge(STAGE_MAP[npc.stage]?.label || npc.stage, {}),
                    state.checks[`npc:${npc.id}`] ? badge('Moved in', { variant: 'success' }) : null,
                    npc.priority >= 5 ? badge('High value', { variant: 'gold' }) : null
                  ),
                  h(
                    'dl.kv',
                    h('dt', 'Unlock'),
                    h('dd', npc.unlock),
                    h('dt', 'Housing'),
                    h('dd', npc.housing),
                    h('dt', 'Sells'),
                    h('dd', npc.items.join(', '))
                  ),
                  h('p.small.gold', { style: { margin: '10px 0 0' } }, glyph('★'), ` ${npc.why}`)
                )
              )
            )
          )
        ),
      ];
    }),

    h(
      'div',
      { style: { marginTop: '20px' } },
      panel(
        { variant: 'deep' },
        panelHead('Housing basics'),
        h(
          'ul.bullets',
          h('li', 'A valid house needs: background walls, a floor, a door, a light source, a table and a chair.'),
          h('li', 'Minimum size is about 6×10 tiles of enclosed space.'),
          h('li', 'NPCs prefer certain biomes and neighbours — happy NPCs sell cheaper and unlock Pylons.'),
          h('li', 'Put the Nurse next to your boss arena. A paid full heal mid-fight is worth the walk.')
        ),
        h('div', { style: { marginTop: '12px' } }, btn('World preparation', { variant: 'ghost', size: 'sm', href: '#/world-prep' }))
      )
    )
  );
}
