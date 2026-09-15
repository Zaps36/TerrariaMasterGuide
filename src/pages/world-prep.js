/**
 * World preparation (spec §23) — the big checklists.
 */

import { h } from '../core/dom.js';
import { getState } from '../core/store.js';
import { WORLD_PREP, worldPrepKey } from '../data/world-prep.js';
import { STAGE_MAP } from '../data/stages.js';
import { currentStageId, stageIndexOf, worldPrepSectionForStage } from '../logic/progression.js';
import { badge, btn, checklist, pageHead, panel, panelHead, progressBar } from '../components/ui.js';

export function worldPrepPage() {
  const state = getState();
  const stageId = currentStageId(state);
  const activeSection = worldPrepSectionForStage(stageId);

  const overall = WORLD_PREP.flatMap((section) =>
    section.items.map((item) => worldPrepKey(section.id, item))
  );
  const overallDone = overall.filter((key) => state.checks[key]).length;

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Preparation',
        title: 'World preparation',
        lede: 'Terraria punishes rushing. These are the things worth doing before each major threshold.',
      },
      badge(STAGE_MAP[stageId].label, { variant: 'gold' }),
      btn('Dashboard', { variant: 'ghost', href: '#/dashboard', icon: '🏠' })
    ),

    panel(
      { variant: 'stone' },
      panelHead('Overall preparation'),
      progressBar(overall.length ? (overallDone / overall.length) * 100 : 0, {
        size: 'lg',
        label: `${overallDone} / ${overall.length} OBJECTIVES`,
      }),
      h(
        'p.small.muted',
        { style: { margin: '10px 0 0' } },
        `You are currently in ${STAGE_MAP[stageId].label}, so the "${activeSection.label}" section below is the one that matters right now.`
      )
    ),

    h(
      'div.stack',
      { style: { marginTop: '18px' } },
      WORLD_PREP.map((section) => {
        const entries = section.items.map((item) => ({
          key: worldPrepKey(section.id, item),
          label: item.label,
          note: item.note,
        }));
        const done = entries.filter((e) => state.checks[e.key]).length;
        const isActive = section.id === activeSection.id;
        const isPast = stageIndexOf(stageId) > stageIndexOf(section.stage);

        return panel(
          { variant: isActive ? 'gold' : 'stone' },
          panelHead(
            section.label,
            isActive ? badge('Current focus', { variant: 'gold' }) : null,
            isPast && !isActive ? badge('Past stage', {}) : null,
            badge(`${done}/${entries.length}`, { variant: done === entries.length ? 'success' : '' })
          ),
          h('p.small.muted', { style: { marginTop: 0 } }, section.intro),
          checklist(entries, { metaSuffix: 'DONE' })
        );
      })
    )
  );
}
