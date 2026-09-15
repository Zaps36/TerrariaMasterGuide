/**
 * Resource / ore progression (spec §25).
 */

import { h, glyph } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { getState } from '../core/store.js';
import { KEY_MATERIALS, ORE_TIERS } from '../data/resources.js';
import { STAGE_MAP } from '../data/stages.js';
import { currentStageId, stageAtOrAfter } from '../logic/progression.js';
import { badge, bullets, kv, pageHead, panel, panelHead, sectionTitle } from '../components/ui.js';
import { treeLink } from '../components/boss-card.js';

export function resourcesPage({ query } = {}) {
  const state = getState();
  const stageId = currentStageId(state);
  const focus = query?.get('ore');

  const rows = [];
  ORE_TIERS.forEach((ore, index) => {
    if (index > 0) rows.push(treeLink(stageAtOrAfter(stageId, ORE_TIERS[index - 1].stage)));
    rows.push(oreRow(ore, stageId, focus === ore.id));
  });

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Materials',
        title: 'Ore & resource progression',
        lede: 'Twelve tiers from Copper to Luminite. Each entry tells you whether it is actually worth mining.',
      },
      badge(STAGE_MAP[stageId].label, { variant: 'gold' })
    ),

    h('div.orechain', ...rows),

    sectionTitle('Materials people forget'),
    h(
      'div.grid.grid--2',
      KEY_MATERIALS.map((m) =>
        panel(
          { variant: 'stone' },
          h(
            'div.row',
            sprite(m.sprite, { size: 36, palette: tint(m.tint), alt: '' }),
            h(
              'div.grow',
              h('h4', { style: { margin: 0 } }, m.name),
              h('p.tiny.dim', { style: { margin: '2px 0 0' } }, STAGE_MAP[m.stage]?.label || m.stage)
            )
          ),
          h('p.small.muted', { style: { margin: '10px 0 0' } }, m.note)
        )
      )
    ),

    h(
      'div',
      { style: { marginTop: '20px' } },
      panel(
        { variant: 'gold' },
        panelHead('⚠️ About smashing Demon Altars'),
        h(
          'p.small.muted',
          { style: { margin: 0 } },
          'Each Altar you break with the Pwnhammer spawns a new vein of Hardmode ore — but also converts random blocks in your world to Corruption, Crimson or Hallow. Break three to six, then stop. You can always break more later.'
        )
      )
    )
  );
}

function oreRow(ore, stageId, focused) {
  const reached = stageAtOrAfter(stageId, ore.stage);
  return h(
    'div.orerow',
    {
      class: focused ? 'panel--gold' : null,
      style: focused ? { boxShadow: 'inset 0 0 0 3px var(--ink), inset 0 0 0 6px var(--gold)' } : null,
    },
    h(
      'div.row',
      { style: { gap: '10px', flex: 'none' } },
      h('span.tiny.dim', { style: { width: '20px' } }, `${ore.tier}`),
      sprite('ore', { size: 38, palette: tint(ore.tint), alt: '' })
    ),
    h(
      'div.orerow__info',
      h('div.orerow__names', ore.names),
      h(
        'div.row.row--wrap',
        { style: { margin: '4px 0 8px' } },
        badge(STAGE_MAP[ore.stage]?.label || ore.stage, { variant: reached ? 'gold' : '' }),
        reached ? badge('Available now', { variant: 'success' }) : badge('Later', {})
      ),
      kv([
        ['Where', ore.where],
        ['Crafts', ore.crafts.join(', ')],
        ['Worth it?', ore.worthIt],
        ['Alternative', ore.alternative],
      ]),
      h('p.tiny.gold', { style: { margin: '8px 0 0' } }, glyph('💡'), ` ${ore.note}`)
    )
  );
}
