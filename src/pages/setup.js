/**
 * Setup flow (spec §4): difficulty → class → world evil → starting progress.
 * Choices apply immediately so the dashboard is always in sync.
 */

import { h, mount, glyph } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { sprite } from '../core/sprites.js';
import {
  completeSetup,
  getState,
  setDefeatedMap,
  setPlayerClass,
  setWorld,
} from '../core/store.js';
import { DIFFICULTIES, PLAYER_CLASSES, WORLD_EVILS } from '../data/stages.js';
import { BOSS_MAP, evilBossId } from '../data/bosses.js';
import { badge, bullets, btn, panel, toast } from '../components/ui.js';

/** Cumulative starting-progress presets (spec §4 step 4). */
const PROGRESS_PRESETS = [
  { id: 'new', label: 'New world', note: 'Nothing defeated yet', bosses: [] },
  { id: 'started', label: 'Just started', note: 'House built, exploring caves', bosses: [] },
  { id: 'eoc', label: 'Eye of Cthulhu defeated', note: 'First boss down', bosses: ['eye_of_cthulhu'] },
  { id: 'evil', label: 'Evil boss defeated', note: 'Eater of Worlds / Brain of Cthulhu', bosses: ['eye_of_cthulhu', 'EVIL'] },
  { id: 'skeletron', label: 'Skeletron defeated', note: 'The Dungeon is open', bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron'] },
  {
    id: 'wof', label: 'Wall of Flesh defeated', note: 'Hardmode active',
    bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron', 'wall_of_flesh'],
  },
  {
    id: 'mech-started', label: 'Mechanical Bosses started', note: 'One mech down',
    bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron', 'wall_of_flesh', 'the_destroyer'],
  },
  {
    id: 'plantera', label: 'Plantera defeated', note: 'Temple and Dungeon upgraded',
    bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron', 'wall_of_flesh', 'the_destroyer', 'the_twins', 'skeletron_prime', 'plantera'],
  },
  {
    id: 'golem', label: 'Golem defeated', note: 'Cultists have appeared',
    bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron', 'wall_of_flesh', 'the_destroyer', 'the_twins', 'skeletron_prime', 'plantera', 'golem'],
  },
  {
    id: 'cultist', label: 'Lunatic Cultist defeated', note: 'Lunar Events running',
    bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron', 'wall_of_flesh', 'the_destroyer', 'the_twins', 'skeletron_prime', 'plantera', 'golem', 'lunatic_cultist'],
  },
  {
    id: 'moon-lord', label: 'Moon Lord defeated', note: 'Post-game',
    bosses: ['eye_of_cthulhu', 'EVIL', 'skeletron', 'wall_of_flesh', 'the_destroyer', 'the_twins', 'skeletron_prime', 'plantera', 'golem', 'lunatic_cultist', 'lunar_events', 'moon_lord'],
  },
];

function presetToMap(preset, evil) {
  const map = {};
  for (const id of preset.bosses) {
    map[id === 'EVIL' ? evilBossId(evil) : id] = true;
  }
  return map;
}

/** Which preset best matches the current defeated map. */
function detectPreset(state) {
  const evil = state.world.evil;
  for (let i = PROGRESS_PRESETS.length - 1; i >= 0; i -= 1) {
    const preset = PROGRESS_PRESETS[i];
    const map = presetToMap(preset, evil);
    const keys = Object.keys(map);
    if (keys.length && keys.every((k) => state.defeated[k])) return preset.id;
  }
  return Object.keys(state.defeated).length ? 'started' : 'new';
}

const STEPS = [
  { id: 1, label: 'Difficulty' },
  { id: 2, label: 'Class' },
  { id: 3, label: 'World evil' },
  { id: 4, label: 'Progress' },
];

export function setupPage() {
  let step = 1;
  const root = h('div.setup');

  function stepper() {
    const nodes = [];
    STEPS.forEach((s, i) => {
      if (i > 0) nodes.push(h('span.stepper__sep'));
      nodes.push(
        h(
          'button.stepper__dot',
          {
            type: 'button',
            class: s.id === step ? 'is-active' : s.id < step ? 'is-done' : null,
            onclick: () => {
              step = s.id;
              paint();
            },
          },
          h('span', `${s.id}`),
          h('span', s.label)
        )
      );
    });
    return h('div.stepper', ...nodes);
  }

  function optionCard({ icon, name, desc, selected, accent, ribbon, onSelect, extra }) {
    return h(
      'button.optioncard',
      {
        type: 'button',
        class: selected ? 'is-selected' : null,
        'aria-pressed': selected ? 'true' : 'false',
        style: accent ? { '--accent': accent } : null,
        onclick: onSelect,
      },
      ribbon ? h('span.optioncard__ribbon', ribbon) : null,
      h(
        'div.optioncard__top',
        h('span.optioncard__icon', glyph(icon)),
        h('span.optioncard__name', name)
      ),
      h('p.optioncard__desc', desc),
      extra
    );
  }

  function stepOne() {
    const state = getState();
    return h(
      'div.stack',
      h('p.eyebrow', 'Step 1 of 4'),
      h('h1', 'Choose your difficulty'),
      h('p.lede', 'This changes how much preparation TerraGuide recommends. Expert is the full experience.'),
      h(
        'div.optiongrid',
        DIFFICULTIES.map((d) =>
          optionCard({
            icon: d.icon,
            name: d.name,
            desc: d.desc,
            ribbon: d.recommended ? 'Recommended' : null,
            selected: state.world.difficulty === d.id,
            accent: d.recommended ? 'var(--gold)' : 'var(--border)',
            extra: h('p.tiny.dim', { style: { margin: 0 } }, d.hpNote),
            onSelect: () => {
              setWorld({ difficulty: d.id });
              paint();
            },
          })
        )
      )
    );
  }

  function stepTwo() {
    const state = getState();
    return h(
      'div.stack',
      h('p.eyebrow', 'Step 2 of 4'),
      h('h1', 'Choose your class'),
      h('p.lede', 'Every weapon, armor and accessory recommendation changes based on this. You can switch any time.'),
      h(
        'div.optiongrid',
        PLAYER_CLASSES.filter((c) => c.id !== 'unsure').map((c) =>
          optionCard({
            icon: c.icon,
            name: c.name,
            desc: c.tagline,
            selected: state.player.class === c.id,
            accent: c.accent,
            extra: h('p.tiny.dim', { style: { margin: 0 } }, c.desc),
            onSelect: () => {
              setPlayerClass(c.id);
              paint();
            },
          })
        )
      ),
      h(
        'div',
        { style: { marginTop: '4px' } },
        optionCard({
          icon: '🎲',
          name: 'Mixed / Not sure',
          desc: 'Perfectly valid for a first playthrough — we will show the strongest option available.',
          selected: state.player.class === 'unsure',
          accent: 'var(--gold)',
          onSelect: () => {
            setPlayerClass('unsure');
            paint();
          },
        })
      )
    );
  }

  function stepThree() {
    const state = getState();
    return h(
      'div.stack',
      h('p.eyebrow', 'Step 3 of 4'),
      h('h1', 'Which evil does your world have?'),
      h('p.lede', 'Every world rolls either Corruption or Crimson. It changes bosses, ore, armor and several key weapons.'),
      h(
        'div.optiongrid',
        WORLD_EVILS.map((e) => {
          const boss = BOSS_MAP[e.boss];
          return optionCard({
            icon: e.icon,
            name: e.name,
            desc: e.desc,
            selected: state.world.evil === e.id,
            accent: e.accent,
            extra: h(
              'div.stack',
              { style: { gap: '8px' } },
              h('div.row', sprite(boss.sprite, { size: 34, alt: '' }), h('span.small', `Boss: ${boss.name}`)),
              h('p.tiny.dim', { style: { margin: 0 } }, e.note),
              bullets(e.signature.slice(0, 3))
            ),
            onSelect: () => {
              setWorld({ evil: e.id });
              paint();
            },
          });
        })
      ),
      h(
        'p.tiny.dim',
        'Not sure? Look at your world: purple blocks and vertical chasms mean Corruption; red flesh and holes mean Crimson.'
      )
    );
  }

  function stepFour() {
    const state = getState();
    const active = detectPreset(state);
    return h(
      'div.stack',
      h('p.eyebrow', 'Step 4 of 4'),
      h('h1', 'How far have you got?'),
      h('p.lede', 'Pick the furthest thing you have already beaten. The dashboard updates immediately.'),
      panel(
        { variant: 'deep' },
        h(
          'div.stagepicker',
          PROGRESS_PRESETS.map((preset, index) =>
            h(
              'button.stagepicker__item',
              {
                type: 'button',
                class: preset.id === active ? 'is-selected' : null,
                'aria-pressed': preset.id === active ? 'true' : 'false',
                onclick: () => {
                  setDefeatedMap(presetToMap(preset, getState().world.evil));
                  paint();
                  toast(`Progress set: ${preset.label}`, { tone: 'success' });
                },
              },
              h('span.stagepicker__num', `${index + 1}`),
              h('span.grow', h('b', preset.label), h('span.check__note', preset.note)),
              preset.id === active ? badge('Current', { variant: 'gold' }) : null
            )
          )
        )
      ),
      h(
        'p.tiny.dim',
        'You can also tick bosses off individually later on the Progression page — this is just a fast start.'
      )
    );
  }

  function nav() {
    const isLast = step === STEPS.length;
    return h(
      'div.setup__nav',
      step > 1
        ? btn('Back', {
            variant: 'ghost',
            icon: '←',
            onClick: () => {
              step -= 1;
              paint();
            },
          })
        : btn('Home', { variant: 'ghost', href: '#/', icon: '←' }),
      h('span.tiny.dim', `Step ${step} of ${STEPS.length}`),
      isLast
        ? btn('Go to my dashboard', {
            variant: 'primary',
            iconAfter: '→',
            onClick: () => {
              completeSetup();
              toast('Journey saved', { tone: 'success', icon: '🧭' });
              navigate('/dashboard');
            },
          })
        : btn('Next', {
            variant: 'primary',
            iconAfter: '→',
            onClick: () => {
              step += 1;
              paint();
            },
          })
    );
  }

  function paint() {
    const bodies = { 1: stepOne, 2: stepTwo, 3: stepThree, 4: stepFour };
    mount(root, stepper(), bodies[step](), nav());
  }

  paint();
  return root;
}
