/**
 * Potion preparation (spec §21) — grouped by priority, with a Prepare All list.
 */

import { h, glyph, stars } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { getState } from '../core/store.js';
import { BUFF_STATIONS, POTIONS, PRIORITY_GROUPS } from '../data/potions.js';
import { CLASS_MAP, STAGE_MAP } from '../data/stages.js';
import { currentStageId, nextMainObjective, stageAtOrAfter } from '../logic/progression.js';
import { getBuild } from '../data/class-builds.js';
import { resolveItems } from '../data/items.js';
import { badge, btn, checklist, pageHead, panel, panelHead, sectionTitle, tabs } from '../components/ui.js';
import { openItemModal } from '../components/item-card.js';

export function potionsPage({ query } = {}) {
  const state = getState();
  const stageId = currentStageId(state);
  const cls = state.player.class === 'unsure' ? 'ranger' : state.player.class;
  const classInfo = CLASS_MAP[cls];
  const next = nextMainObjective(state, state.world.evil);
  const build = getBuild(cls, stageId);

  const deep = query?.get('item');
  if (deep) setTimeout(() => openItemModal(deep), 30);

  // Potions relevant now: available at or before the current stage,
  // and either universal or matching the player's class.
  const relevant = POTIONS.filter(
    (p) => stageAtOrAfter(stageId, p.stage) && (p.cls === 'universal' || p.cls === cls)
  );

  const nextBossPotions = resolveItems(build?.potions || []);

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Preparation',
        title: 'Potion preparation',
        lede: 'Buff potions are the cheapest power in Terraria. Ironskin plus Regeneration is roughly a free armor tier.',
      },
      badge(`${classInfo.icon} ${classInfo.name}`, { cls }),
      badge(STAGE_MAP[stageId].label, { variant: 'gold' })
    ),

    next?.boss
      ? panel(
          { variant: 'gold' },
          panelHead(
            `Buff list for ${next.boss.name}`,
            btn('Boss guide', { variant: 'ghost', size: 'sm', href: `#/bosses/${next.boss.id}` })
          ),
          h(
            'p.small.muted',
            { style: { marginTop: 0 } },
            'Tick these off as you brew them. Progress is shared with the boss page checklist.'
          ),
          checklist(
            nextBossPotions.map((p) => ({
              key: `potion:${next.boss.id}:${p.id}`,
              label: p.name,
              note: p.stats.Effect,
            })),
            { metaSuffix: 'BREWED' }
          )
        )
      : null,

    sectionTitle('By priority'),
    tabs(
      PRIORITY_GROUPS.map((g) => ({ id: g.id, label: g.label })),
      (groupId) => {
        const group = PRIORITY_GROUPS.find((g) => g.id === groupId);
        const list = relevant.filter((p) => p.priority === groupId);
        return h(
          'div.stack',
          h('p.small.muted', { style: { margin: 0 } }, group.desc),
          list.length
            ? h('div.stack', { style: { gap: '6px' } }, list.map((p) => potionRow(p)))
            : h('p.small.dim', 'Nothing in this group is available at your stage yet.'),
          list.length
            ? panel(
                { variant: 'deep' },
                panelHead(`Prepare all — ${group.label}`),
                checklist(
                  list.map((p) => ({
                    key: `potion:stock:${p.id}`,
                    label: `Stock ${p.name}`,
                    note: p.ingredients?.join(' + '),
                  })),
                  { metaSuffix: 'STOCKED' }
                )
              )
            : null
        );
      },
      { ariaLabel: 'Potion priority' }
    ),

    sectionTitle('Buff stations'),
    h(
      'p.small.muted',
      { style: { marginTop: '-8px', marginBottom: '14px', maxWidth: '70ch' } },
      'Placeable buffs stack with potions and never run out. Put these in every arena you build.'
    ),
    h(
      'div.grid.grid--3',
      BUFF_STATIONS.filter((s) => stageAtOrAfter(stageId, s.stage)).map((s) =>
        panel(
          { variant: 'stone' },
          h(
            'div.row',
            sprite(s.sprite, { size: 36, palette: tint(s.tint), alt: '' }),
            h(
              'div.grow',
              h('h4', { style: { margin: 0 } }, s.name),
              h('p.tiny.success', { style: { margin: '2px 0 0' } }, s.effect)
            )
          ),
          h('p.small.muted', { style: { margin: '10px 0 0' } }, s.note)
        )
      )
    ),

    h(
      'p.tiny.dim',
      { style: { marginTop: '18px' } },
      glyph('💡'),
      ' Plant a herb garden with Clay Pots near your base. Daybloom, Blinkroot, Deathweed, Moonglow, Waterleaf, Shiverthorn and Fireblossom cover almost every recipe in the game.'
    )
  );
}

function potionRow(potion) {
  return h(
    'button.potionrow',
    {
      type: 'button',
      style: { textAlign: 'left', width: '100%' },
      dataset: { focusKey: `potion:${potion.id}` },
      onclick: () => openItemModal(potion.id),
    },
    sprite('potion', { size: 32, palette: tint(potion.tint), alt: '' }),
    h(
      'div.potionrow__info',
      h('div.potionrow__name', potion.name),
      h('div.potionrow__effect', potion.stats.Effect),
      h('p.tiny.dim', { style: { margin: '2px 0 0' } }, `${potion.stats.Duration} · ${potion.ingredients?.join(' + ') || ''}`)
    ),
    h('span.row', stars(potion.rating)),
    h(
      'span.prioritytag',
      { dataset: { priority: potion.priority } },
      potion.priority === 'must' ? 'High priority' : potion.priority === 'useful' ? 'Useful' : 'Optional'
    )
  );
}
