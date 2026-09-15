/**
 * The progression tree: main chain + optional side content.
 */

import { h } from '../core/dom.js';
import { BOSS_MAP, OPTIONAL_BOSSES } from '../data/bosses.js';
import { bossStatus, mainChainNodes, nextMainObjective } from '../logic/progression.js';
import { bossNode, treeLink, hardmodeBand, bossCard } from './boss-card.js';
import { panel, panelHead, badge, emptyState } from './ui.js';

/** Vertical main progression tree with status-aware nodes. */
export function progressionTree(state, world, { compact = false } = {}) {
  const nodes = mainChainNodes(world.evil);
  const next = nextMainObjective(state, world.evil);
  const nextId = next?.boss?.id;

  const children = [];
  nodes.forEach((node, index) => {
    if (index > 0) {
      const previous = nodes[index - 1];
      const doneLink = previous.kind === 'boss' ? Boolean(state.defeated[previous.boss.id]) : false;
      children.push(treeLink(doneLink));
    }
    if (node.kind === 'band') {
      children.push(hardmodeBand(node.label, node.icon));
      return;
    }
    const status = state.defeated[node.boss.id]
      ? 'done'
      : node.boss.id === nextId
        ? 'next'
        : bossStatus(node.boss, state);
    children.push(bossNode(node.boss, status, { compact }));
  });

  return h('div.tree', ...children);
}

/** Optional / side bosses, clearly separated from the main chain. */
export function optionalBossGrid(state, world) {
  const hidden = world.evil === 'crimson' ? 'eater_of_worlds' : 'brain_of_cthulhu';
  const bosses = OPTIONAL_BOSSES.map((id) => BOSS_MAP[id]).filter((b) => b && b.id !== hidden);

  if (!bosses.length) {
    return emptyState({ title: 'No optional content for this world' });
  }

  return h(
    'div.grid.grid--3',
    bosses.map((boss) => bossCard(boss, state.defeated[boss.id] ? 'done' : bossStatus(boss, state)))
  );
}

/** Small legend so the node states are not colour-only. */
export function treeLegend() {
  return panel(
    { variant: 'deep' },
    panelHead('Legend'),
    h(
      'div.row.row--wrap',
      badge('✓  Completed', { variant: 'success' }),
      badge('›  Available', {}),
      badge('🔒  Locked', {}),
      badge('★  Recommended next', { variant: 'gold' }),
      badge('Optional', { variant: 'optional' })
    ),
    h(
      'p.tiny.dim',
      { style: { margin: '10px 0 0' } },
      'Optional bosses are never required to progress — they are shown separately so you always know what is mandatory.'
    )
  );
}
