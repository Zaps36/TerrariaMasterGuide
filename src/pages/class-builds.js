/**
 * Class Builds (spec §17) + accessory progression (spec §20).
 */

import { h, mount, glyph } from '../core/dom.js';
import { getState, setPlayerClass } from '../core/store.js';
import { BUILD_STAGE_IDS, CLASS_MAP, PRIMARY_CLASS_IDS, STAGE_MAP } from '../data/stages.js';
import { CLASS_BUILDS } from '../data/class-builds.js';
import { ACCESSORY_CHAINS, CLASS_ACCESSORIES, REFORGE_GUIDE } from '../data/accessory-chains.js';
import { currentStageId } from '../logic/progression.js';
import { badge, btn, bullets, pageHead, panel, panelHead, sectionTitle, tabs, toast } from '../components/ui.js';
import { loadoutView, buildSummary } from '../components/loadout.js';
import { chainRow } from '../components/chains.js';
import { itemCard, openItemModal } from '../components/item-card.js';
import { resolveItems } from '../data/items.js';

export function classBuildsPage({ query } = {}) {
  const state = getState();
  const stageNow = currentStageId(state);
  const requested = query?.get('class');
  const initial = PRIMARY_CLASS_IDS.includes(requested)
    ? requested
    : state.player.class === 'unsure'
      ? 'ranger'
      : state.player.class;

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Build planner',
        title: 'Class builds',
        lede: 'The best practical pick for every stage, plus good alternatives if the drop did not come your way.',
      },
      badge(`You are in ${STAGE_MAP[stageNow].label}`, { variant: 'gold' }),
      btn('World settings', { variant: 'ghost', href: '#/settings', icon: '⚙️' })
    ),

    tabs(
      PRIMARY_CLASS_IDS.map((id) => ({
        id,
        label: CLASS_MAP[id].name,
        icon: CLASS_MAP[id].icon,
        cls: id,
      })),
      (cls) => classTimeline(cls, stageNow, state),
      { initial, ariaLabel: 'Class' }
    ),

    sectionTitle('Accessory progression'),
    h(
      'p.small.muted',
      { style: { marginTop: '-8px', marginBottom: '14px', maxWidth: '72ch' } },
      'Accessories are the easiest thing for new players to overlook, and the cheapest source of power in the game. Each chain below combines into a single, better item — freeing up slots as you go.'
    ),
    h(
      'div.stack',
      ACCESSORY_CHAINS.map((chain) =>
        panel(
          { variant: 'stone' },
          panelHead(
            `${chain.icon}  ${chain.name}`,
            badge(chain.priority, {
              variant: chain.priority === 'Recommended' ? 'gold' : chain.priority === 'Luxury' ? 'optional' : '',
            })
          ),
          h('p.small.muted', { style: { marginTop: 0 } }, chain.summary),
          chainRow(chain.steps, { onSelect: (item) => openItemModal(item.id) }),
          h('p.tiny.dim', { style: { margin: '10px 0 0' } }, glyph('💡'), ` ${chain.note}`)
        )
      )
    ),

    sectionTitle('Reforging'),
    panel(
      { variant: 'deep' },
      panelHead('The Goblin Tinkerer is free power'),
      h(
        'div.grid.grid--2',
        REFORGE_GUIDE.map((r) =>
          h(
            'div.itemcard',
            h(
              'span.itemcard__info',
              h('span.itemcard__name', r.name),
              h('span.tiny.success', { style: { display: 'block' } }, r.effect),
              h('span.tiny.dim', { style: { display: 'block', marginTop: '2px' } }, r.when)
            )
          )
        )
      )
    )
  );
}

function classTimeline(cls, stageNow, state) {
  const info = CLASS_MAP[cls];
  const container = h('div');

  const stageChips = h(
    'div.stagejump',
    BUILD_STAGE_IDS.map((stageId) =>
      h(
        'a.chip',
        {
          href: `#stage-${cls}-${stageId}`,
          class: stageId === stageNow ? 'is-active' : null,
          onclick: (event) => {
            event.preventDefault();
            document.getElementById(`stage-${cls}-${stageId}`)?.scrollIntoView({ block: 'start' });
          },
        },
        STAGE_MAP[stageId].label
      )
    )
  );

  mount(
    container,

    panel(
      { variant: 'stone', accent: info.accent },
      h(
        'div.row.row--wrap',
        h('span', { style: { fontSize: '2rem', lineHeight: 1 } }, glyph(info.icon)),
        h(
          'div.grow',
          h('h2', { style: { margin: 0, color: info.accent } }, info.name),
          h('p.small.muted', { style: { margin: '4px 0 0' } }, info.desc)
        ),
        state.player.class === cls
          ? badge('Your class', { variant: 'success' })
          : btn('Play as this class', {
              variant: 'ghost',
              size: 'sm',
              onClick: () => {
                setPlayerClass(cls);
                toast(`Class set to ${info.name}`, { tone: 'success', icon: info.icon });
              },
            })
      ),
      h(
        'div.grid.grid--2',
        { style: { marginTop: '14px' } },
        panel({ variant: 'deep' }, h('h4', { style: { marginTop: 0 } }, 'Strengths'), bullets(info.strengths, { variant: 'check' })),
        panel({ variant: 'deep' }, h('h4', { style: { marginTop: 0 } }, 'Watch out for'), bullets(info.weaknesses, { variant: 'warn' }))
      ),
      h(
        'div',
        { style: { marginTop: '14px' } },
        panel(
          { variant: 'deep' },
          h('h4', { style: { marginTop: 0 } }, `Signature ${info.name} accessories`),
          h('div.slot__items', resolveItems(CLASS_ACCESSORIES[cls] || []).map((item) => itemCard(item)))
        )
      )
    ),

    h('div', { style: { marginTop: '16px' } }, stageChips),

    h(
      'div.stack',
      BUILD_STAGE_IDS.map((stageId, index) => {
        const build = CLASS_BUILDS[cls][stageId];
        const stage = STAGE_MAP[stageId];
        const isNow = stageId === stageNow;
        return panel(
          { variant: isNow ? 'gold' : 'stone', accent: info.accent },
          h(
            'div.buildstage__head',
            { id: `stage-${cls}-${stageId}` },
            h('span.buildstage__num', { style: { '--accent': info.accent } }, `${index + 1}`),
            h(
              'div.grow',
              h('h3', { style: { margin: 0 } }, stage.label),
              buildSummary(build)
            ),
            isNow ? badge('You are here', { variant: 'gold' }) : null
          ),
          h('p.small.muted', { style: { margin: '10px 0 4px' } }, stage.blurb),
          loadoutView(build, { cls })
        );
      })
    )
  );

  return container;
}
