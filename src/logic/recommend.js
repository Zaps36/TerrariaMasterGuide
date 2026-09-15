/**
 * The recommendation engine.
 *
 * Deterministic rules only — no AI, no randomness. Given the player's state
 * it answers: what next, what did you miss, and what is optional but worth it.
 */

import { BOSS_MAP, MECH_BOSSES, prepKey } from '../data/bosses.js';
import { OPTIONAL_WORTH_IT } from '../data/beginner.js';
import { STAGE_MAP } from '../data/stages.js';
import { getBuild } from '../data/class-builds.js';
import {
  currentStageId,
  nextMainObjective,
  stageAtOrAfter,
  worldPrepSectionForStage,
} from './progression.js';

/**
 * The headline "What should I do next?" recommendation.
 * Returns a view-model, never null (endgame gets its own card).
 */
export function whatNext(state, world) {
  const stageId = currentStageId(state);
  const stage = STAGE_MAP[stageId];
  const objective = nextMainObjective(state, world.evil);

  if (!objective) {
    const section = worldPrepSectionForStage(stageId);
    return {
      type: 'task',
      icon: '🏆',
      sprite: 'moon_lord',
      title: 'You beat Terraria',
      kicker: 'Post-Moon Lord',
      reason:
        'Luminite is unlocked. Craft the endgame armor sets, farm the Pumpkin and Frost Moons, and hunt the Zenith components.',
      difficulty: 5,
      stageId,
      prep: [
        { key: 'endgame:luminite', label: 'Craft a Luminite armor set' },
        { key: 'endgame:zenith', label: 'Collect every Zenith component sword' },
        { key: 'endgame:moons', label: 'Clear wave 15 of the Pumpkin Moon' },
        { key: 'endgame:frost', label: 'Clear wave 20 of the Frost Moon' },
        { key: 'endgame:build', label: 'Build something ridiculous' },
      ],
      cta: { label: 'Explore item database', href: '#/items' },
      section,
    };
  }

  const boss = objective.boss;

  // Special case from the spec's rules: fresh Hardmode = prepare, do not rush.
  if (objective.hardmodePrep) {
    const section = worldPrepSectionForStage(stageId);
    return {
      type: 'task',
      icon: '🔥',
      sprite: 'the_destroyer',
      title: 'Prepare for Hardmode',
      kicker: 'Recommended next objective',
      reason:
        'Hardmode enemies hit far harder than anything you have fought. Get a full Hardmode ore set and wings before you summon a mechanical boss.',
      difficulty: 3,
      stageId,
      prep: section.items.map((item) => ({
        key: item.global || `world:${section.id}:${item.id}`,
        label: item.label,
        note: item.note,
      })),
      cta: { label: 'Open world preparation', href: '#/world-prep' },
      then: { boss, label: `Then: ${boss.name}` },
      section,
    };
  }

  return {
    type: 'boss',
    icon: boss.kind === 'event' ? '🌙' : '👑',
    sprite: boss.sprite,
    boss,
    title: boss.kind === 'event' ? boss.name : `Defeat ${boss.name}`,
    kicker: 'Recommended next objective',
    reason: objective.reason,
    difficulty: boss.difficulty,
    stageId,
    prep: (boss.preparation || []).map((entry) => ({
      key: prepKey(boss.id, entry),
      label: entry.label,
      note: entry.note,
    })),
    cta: { label: `View ${boss.name} guide`, href: `#/bosses/${boss.id}` },
    section: worldPrepSectionForStage(stageId),
  };
}

/**
 * "You may have missed" — gentle, specific warnings based on what the player
 * has and has not ticked off.
 */
export function missedThings(state, world) {
  const stageId = currentStageId(state);
  const at = (threshold) => stageAtOrAfter(stageId, threshold);
  const checked = (key) => Boolean(state.checks[key]);
  const beaten = (id) => Boolean(state.defeated[id]);
  const out = [];

  if (at('pre-skeletron') && !checked('gear:mobility')) {
    out.push({
      id: 'mobility',
      severity: 'danger',
      title: "You haven't marked a mobility accessory",
      body: 'Almost every early death is a movement problem. Boots and a double jump come before a better weapon.',
      itemId: at('early-hardmode') ? 'frostspark_boots' : 'spectre_boots',
      action: { label: 'View item', href: '#/items?q=boots' },
      fixKey: 'gear:mobility',
    });
  }

  if (at('pre-skeletron') && !checked('gear:hp300')) {
    out.push({
      id: 'hp300',
      severity: 'warning',
      title: 'You may be under 300 maximum health',
      body: 'Skeletron in Expert will delete a 200 HP character. Find five more Life Crystals.',
      itemId: 'life_crystal',
      action: { label: 'Life Crystal', href: '#/items?q=life' },
      fixKey: 'gear:hp300',
    });
  }

  if (at('pre-wof') && !checked('gear:hp400')) {
    out.push({
      id: 'hp400',
      severity: 'warning',
      title: 'Reach 400 health before the Wall of Flesh',
      body: 'Twenty Life Crystals is the pre-Hardmode cap. Hardmode is much harsher without it.',
      itemId: 'life_crystal',
      action: { label: 'World preparation', href: '#/world-prep' },
      fixKey: 'gear:hp400',
    });
  }

  if (at('early-hardmode') && !checked('gear:wings')) {
    out.push({
      id: 'wings',
      severity: 'danger',
      title: "You haven't marked a pair of wings",
      body: 'Wings are effectively mandatory for the mechanical bosses. Farm Wyverns for Souls of Flight.',
      itemId: 'demon_angel_wings',
      action: { label: 'View wings', href: '#/items?q=wings' },
      fixKey: 'gear:wings',
    });
  }

  if (at('pre-plantera') && !checked('world:pre-plantera:jungle-arena')) {
    out.push({
      id: 'jungle-arena',
      severity: 'warning',
      title: "You haven't prepared a Jungle arena before Plantera",
      body: 'Plantera chases you through blocks in phase two. Build the arena before you break the bulb.',
      itemId: null,
      action: { label: 'Prepare arena', href: '#/bosses/plantera' },
      fixKey: 'world:pre-plantera:jungle-arena',
    });
  }

  if (at('pre-plantera') && !checked('gear:hp500')) {
    out.push({
      id: 'hp500',
      severity: 'warning',
      title: 'Collect Life Fruit for 500 health',
      body: 'Twenty Life Fruit in the Hardmode Jungle takes you from 400 to 500 HP.',
      itemId: 'life_fruit',
      action: { label: 'Life Fruit', href: '#/items?q=life+fruit' },
      fixKey: 'gear:hp500',
    });
  }

  if (at('moon-lord') && !checked('gear:heart-statue')) {
    out.push({
      id: 'heart-statue',
      severity: 'warning',
      title: 'No Heart Statue arena marked',
      body: 'Wired Heart Statues are the single biggest quality-of-life upgrade for the Moon Lord fight.',
      itemId: null,
      action: { label: 'World preparation', href: '#/world-prep' },
      fixKey: 'gear:heart-statue',
    });
  }

  if (at('pre-skeletron') && !beaten('goblin_army')) {
    out.push({
      id: 'goblin',
      severity: 'info',
      title: 'You have not defeated a Goblin Army',
      body: 'It unlocks the Goblin Tinkerer: Rocket Boots, the Tinkerer\'s Workshop and accessory reforging.',
      itemId: 'rocket_boots',
      action: { label: 'Goblin Army', href: '#/bosses/goblin_army' },
    });
  }

  if (state.player.class === 'summoner' && at('pre-skeletron') && !beaten('queen_bee')) {
    out.push({
      id: 'queen-bee',
      severity: 'info',
      title: 'Summoners should not skip Queen Bee',
      body: 'Bee Armor and the Hornet Staff are the entire summoner early game.',
      itemId: 'bee_armor',
      action: { label: 'Queen Bee', href: '#/bosses/queen_bee' },
    });
  }

  if (at('lunar') && !beaten('duke_fishron')) {
    out.push({
      id: 'fishron',
      severity: 'info',
      title: 'Duke Fishron is still available',
      body: 'His drops (Tsunami, Razorblade Typhoon, Tempest Staff, Fishron Wings) are best-in-class before Moon Lord.',
      itemId: 'fishron_wings',
      action: { label: 'Duke Fishron', href: '#/bosses/duke_fishron' },
    });
  }

  return out;
}

/** "Optional but worth it" entries for the current stage. */
export function optionalForStage(state) {
  const stageId = currentStageId(state);
  const list = OPTIONAL_WORTH_IT[stageId] || [];
  return list.map((entry) => ({
    ...entry,
    boss: BOSS_MAP[entry.id] || null,
    done: Boolean(state.defeated[entry.id]),
  }));
}

/** Which mechanical bosses are left (used on the dashboard). */
export function mechStatus(state) {
  const done = MECH_BOSSES.filter((id) => state.defeated[id]);
  return { done: done.length, total: MECH_BOSSES.length, remaining: MECH_BOSSES.filter((id) => !state.defeated[id]) };
}

/** Loadout for the player's class at their current stage. */
export function currentLoadout(state) {
  return getBuild(state.player.class, currentStageId(state));
}
