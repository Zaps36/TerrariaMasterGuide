/**
 * Deterministic progression logic.
 * Everything the UI needs to answer "where am I?" lives here.
 */

import { BOSSES, BOSS_MAP, MAIN_CHAIN, MECH_BOSSES, evilBossId, prepKey } from '../data/bosses.js';
import { STAGES, STAGE_MAP } from '../data/stages.js';
import { WORLD_PREP } from '../data/world-prep.js';

/** The 12 milestones that make up "main progress". */
export function mainMilestones(evil) {
  return [
    'eye_of_cthulhu',
    evilBossId(evil),
    'skeletron',
    'wall_of_flesh',
    'the_destroyer',
    'the_twins',
    'skeletron_prime',
    'plantera',
    'golem',
    'lunatic_cultist',
    'lunar_events',
    'moon_lord',
  ];
}

/** Which progression stage the player is currently in. */
export function currentStageId(state) {
  const d = state.defeated;
  const mechs = MECH_BOSSES.filter((id) => d[id]).length;

  if (d.moon_lord) return 'endgame';
  if (d.lunar_events) return 'moon-lord';
  if (d.lunatic_cultist) return 'lunar';
  if (d.golem) return 'lunar';
  if (d.plantera) return 'post-plantera';
  if (mechs >= 3) return 'pre-plantera';
  if (d.wall_of_flesh) return mechs > 0 ? 'mech' : 'early-hardmode';
  if (d.skeletron) return 'pre-wof';
  if (d.eater_of_worlds || d.brain_of_cthulhu) return 'pre-skeletron';
  if (d.eye_of_cthulhu) return 'pre-skeletron';
  return 'early';
}

export function currentStage(state) {
  return STAGE_MAP[currentStageId(state)] || STAGES[0];
}

export function isHardmode(state) {
  return Boolean(state.defeated.wall_of_flesh);
}

/** Are this boss's prerequisites satisfied? */
export function prerequisitesMet(boss, state) {
  if (!boss?.prerequisites?.length) return true;
  return boss.prerequisites.every((id) => {
    if (id === 'EVIL') return Boolean(state.defeated.eater_of_worlds || state.defeated.brain_of_cthulhu);
    return Boolean(state.defeated[id]);
  });
}

/** 'done' | 'available' | 'locked' */
export function bossStatus(boss, state) {
  if (state.defeated[boss.id]) return 'done';
  return prerequisitesMet(boss, state) ? 'available' : 'locked';
}

/** Main progression percentage (0–100). */
export function mainProgress(state, evil) {
  const milestones = mainMilestones(evil);
  const done = milestones.filter((id) => state.defeated[id]).length;
  return {
    done,
    total: milestones.length,
    percent: Math.round((done / milestones.length) * 100),
  };
}

/** Every trackable boss/event, ignoring the other world evil. */
export function bossProgress(state, evil) {
  const hidden = evil === 'crimson' ? 'eater_of_worlds' : 'brain_of_cthulhu';
  const relevant = BOSSES.filter((b) => b.id !== hidden);
  const done = relevant.filter((b) => state.defeated[b.id]).length;
  return { done, total: relevant.length, percent: Math.round((done / relevant.length) * 100) };
}

/** Preparation percentage: the next boss checklist + the current world-prep section. */
export function preparationProgress(state, evil) {
  const keys = new Set();
  const next = nextMainObjective(state, evil);

  if (next?.boss) {
    for (const entry of next.boss.preparation || []) keys.add(prepKey(next.boss.id, entry));
  }
  const section = worldPrepSectionForStage(currentStageId(state));
  if (section) {
    for (const item of section.items) keys.add(item.global || `world:${section.id}:${item.id}`);
  }

  const list = [...keys];
  const done = list.filter((k) => state.checks[k]).length;
  return {
    done,
    total: list.length,
    percent: list.length ? Math.round((done / list.length) * 100) : 0,
    keys: list,
  };
}

export function worldPrepSectionForStage(stageId) {
  const order = STAGE_MAP[stageId]?.order ?? 0;
  const bands = [
    { max: 2, id: 'pre-hardmode' },
    { max: 4, id: 'pre-mech' },
    { max: 5, id: 'pre-plantera' },
    { max: 6, id: 'pre-golem' },
    { max: 99, id: 'pre-moon-lord' },
  ];
  const pick = bands.find((b) => order <= b.max);
  return WORLD_PREP.find((s) => s.id === pick.id) || WORLD_PREP[0];
}

/**
 * The next main-chain objective. Returns { boss, reason } or null when the
 * game is finished.
 */
export function nextMainObjective(state, evil) {
  const d = state.defeated;
  const mechsLeft = MECH_BOSSES.filter((id) => !d[id]);

  if (d.moon_lord) return null;
  if (d.lunar_events) return { boss: BOSS_MAP.moon_lord, reason: 'The pillars have fallen. Only the Moon Lord remains.' };
  if (d.lunatic_cultist) return { boss: BOSS_MAP.lunar_events, reason: 'Four Celestial Pillars are active. Clear them for Lunar Fragments.' };
  if (d.golem) return { boss: BOSS_MAP.lunatic_cultist, reason: 'Cultists have appeared at the Dungeon entrance.' };
  if (d.plantera) return { boss: BOSS_MAP.golem, reason: 'Explore the Jungle Temple and prepare for Golem.' };
  if (!mechsLeft.length) return { boss: BOSS_MAP.plantera, reason: 'All three mechanical bosses are down. The Jungle bulbs are ready.' };

  if (d.wall_of_flesh) {
    const anyMechDone = MECH_BOSSES.some((id) => d[id]);
    const nextMech = BOSS_MAP[mechsLeft[0]];
    if (anyMechDone) {
      return { boss: nextMech, reason: `Prepare for your next Mechanical Boss — ${mechsLeft.length} remaining.` };
    }
    return {
      boss: nextMech,
      reason: 'You are in Hardmode. Gear up completely before you summon a mechanical boss.',
      hardmodePrep: true,
    };
  }

  if (d.skeletron) return { boss: BOSS_MAP.wall_of_flesh, reason: 'Prepare for the Wall of Flesh — this starts Hardmode permanently.' };
  if (d.eater_of_worlds || d.brain_of_cthulhu) return { boss: BOSS_MAP.skeletron, reason: "You're approaching the Dungeon." };
  if (d.eye_of_cthulhu) {
    return {
      boss: BOSS_MAP[evilBossId(evil)],
      reason: 'Your evil biome boss is next — it unlocks the ore you need.',
    };
  }
  return { boss: BOSS_MAP.eye_of_cthulhu, reason: 'Your first real boss. Build an arena and summon it at night.' };
}

/**
 * Nodes for the progression tree: the main chain with the world's evil boss
 * substituted in and the HARDMODE band kept as a marker.
 */
export function mainChainNodes(evil) {
  return MAIN_CHAIN.map((entry) => {
    if (entry === 'EVIL') return { kind: 'boss', boss: BOSS_MAP[evilBossId(evil)] };
    if (entry === 'HARDMODE') return { kind: 'band', label: 'HARDMODE BEGINS', icon: '🔥' };
    return { kind: 'boss', boss: BOSS_MAP[entry] };
  }).filter((node) => node.kind === 'band' || node.boss);
}

/** Bosses at or below the player's current stage that they have not beaten. */
export function availableBosses(state, evil) {
  const hidden = evil === 'crimson' ? 'eater_of_worlds' : 'brain_of_cthulhu';
  return BOSSES.filter(
    (b) => b.id !== hidden && !state.defeated[b.id] && prerequisitesMet(b, state)
  );
}

/** Checklist keys for a boss's preparation block. */
export function bossPrepKeys(boss) {
  return (boss.preparation || []).map((entry) => prepKey(boss.id, entry));
}

export function stageIndexOf(stageId) {
  return STAGE_MAP[stageId]?.order ?? 0;
}

export function stageAtOrAfter(stageId, thresholdId) {
  return stageIndexOf(stageId) >= stageIndexOf(thresholdId);
}
